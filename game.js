/* =====================================================================
   CAB SIMULATOR - GAME LOGIC
   This file holds the RULES. The content (RFCs, characters) lives in
   data.js, which is loaded before this file, so CHARACTERS, RFCS and
   GENERIC_REPORTS are already available here.
   ===================================================================== */

// ---------------------------------------------------------------------
// 1. GAME STATE - everything the game needs to remember while playing.
// ---------------------------------------------------------------------
const STARTING_METER_VALUE = 50;

let state = {}; // filled in by resetGame()

function resetGame() {
  state = {
    meters: {
      stability: STARTING_METER_VALUE,
      leadership: STARTING_METER_VALUE,
      audit: STARTING_METER_VALUE,
      sanity: STARTING_METER_VALUE
    },
    agenda: [...RFCS],   // a copy of the RFC list for this meeting
    currentIndex: 0,     // which RFC we're looking at (0 = first)
    decisions: [],       // a log of what the player chose
    reports: [],         // incident reports created after the meeting
    nextIncidentNumber: 1042
  };
}

// ---------------------------------------------------------------------
// 2. RULES
// ---------------------------------------------------------------------

// 2a. IMMEDIATE effects of a decision, felt in the meeting room.
//     These only look at what's VISIBLE on the card.
function getDecisionEffects(rfc, decision) {
  // Start with "no change" for every meter, then add things up.
  const fx = { stability: 0, leadership: 0, audit: 0, sanity: 0 };

  if (decision === "approve") {
    fx.leadership += 6;   // people like hearing "yes"
    fx.sanity += 2;       // and you avoided an argument

    // Approving without a proper rollback plan or testing hurts your audit trail.
    if (rfc.rollback === "missing") fx.audit -= 6;
    if (rfc.rollback === "weak") fx.audit -= 2;
    if (rfc.testing === "none") fx.audit -= 4;
  }

  if (decision === "reject") {
    fx.leadership -= 6;   // someone important wanted this
    fx.sanity -= 3;       // now you have to explain yourself

    // Rejecting an Emergency change is a big deal.
    if (rfc.type === "Emergency") fx.leadership -= 4;
    // Rejecting a pre-approved Standard change is pointless bureaucracy.
    if (rfc.type === "Standard") { fx.sanity -= 3; fx.leadership -= 2; }
  }

  if (decision === "sendBack") {
    fx.leadership -= 3;   // it's a delay
    fx.audit += 3;        // but the paperwork gets better
    fx.sanity -= 2;       // and it'll be back on your agenda
  }

  return fx;
}

// 2b. What ACTUALLY happens to an approved change after the meeting.
//     This is where the HIDDEN true risk matters.

// Base chance of an outage for each hidden risk level (0.10 = 10%).
const OUTAGE_CHANCE = { Low: 0.10, Medium: 0.35, High: 0.70 };

// Good testing makes an outage LESS LIKELY; no testing makes it MORE likely.
const TESTING_MODIFIER = { yes: -0.10, partial: 0, none: +0.15 };

// The rollback plan decides how BAD an outage is.
const OUTAGE_SEVERITY = {
  solid: {
    label: "Minor", duration: "25 minutes",
    fx: { stability: -5, leadership: -2, audit: 0, sanity: -2 }
  },
  weak: {
    label: "Major", duration: "3 hours",
    fx: { stability: -12, leadership: -6, audit: -2, sanity: -5 }
  },
  missing: {
    label: "Critical", duration: "most of the night",
    fx: { stability: -20, leadership: -10, audit: -6, sanity: -8 }
  }
};

// A change that goes well makes everyone a little happier.
const SUCCESS_FX = { stability: 3, leadership: 2, audit: 0, sanity: 1 };

function chanceOfOutage(rfc) {
  const chance = OUTAGE_CHANCE[rfc.hiddenRisk] + TESTING_MODIFIER[rfc.testing];
  return Math.max(0.02, Math.min(0.95, chance)); // never 0% or 100%
}

// Roll the dice for one approved RFC and build its incident report.
function resolveApprovedChange(rfc) {
  const isOutage = Math.random() < chanceOfOutage(rfc);
  const system = rfc.systems[0];

  if (isOutage) {
    const severity = OUTAGE_SEVERITY[rfc.rollback];
    return {
      number: "INC" + state.nextIncidentNumber++,
      rfc,
      outcome: "outage",
      label: severity.label + " outage",
      duration: severity.duration,
      text: fillIn(rfc.outageReport || pickRandom(GENERIC_REPORTS.outage), system),
      fx: severity.fx
    };
  }

  return {
    number: null, // successful changes don't get an incident number
    rfc,
    outcome: "success",
    label: "Successful change",
    text: fillIn(rfc.successReport || pickRandom(GENERIC_REPORTS.success), system),
    fx: SUCCESS_FX
  };
}

// Small helpers
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
function fillIn(text, system) {
  return text.replaceAll("{system}", system);
}

// Apply a set of meter changes, keeping every meter between 0 and 100.
function applyEffects(fx) {
  for (const meter in fx) {
    const newValue = state.meters[meter] + fx[meter];
    state.meters[meter] = Math.max(0, Math.min(100, newValue));
  }
}

function isGameOver() {
  return Object.values(state.meters).some(value => value <= 0);
}

// ---------------------------------------------------------------------
// 3. DRAWING THE SCREEN - functions that update what the player sees.
// ---------------------------------------------------------------------

// Show one screen and hide the others.
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.toggle("hidden", screen.id !== id);
  });
}

// Update the four meter bars. "fx" (optional) shows the +/- change.
function renderMeters(fx = {}) {
  document.querySelectorAll(".meter").forEach(meterEl => {
    const name = meterEl.dataset.meter;
    const value = state.meters[name];

    meterEl.querySelector(".meter-fill").style.width = value + "%";
    meterEl.classList.toggle("warn", value <= 40 && value > 20);
    meterEl.classList.toggle("danger", value <= 20);

    const delta = fx[name] || 0;
    let deltaText = "";
    if (delta > 0) deltaText = ` <span class="meter-delta up">+${delta}</span>`;
    if (delta < 0) deltaText = ` <span class="meter-delta down">${delta}</span>`;
    meterEl.querySelector(".meter-value").innerHTML = value + deltaText;
  });
}

// Pick a colour for a field value: green = good, yellow = meh, red = bad.
function tag(text, colour) {
  return `<span class="tag ${colour}">${text}</span>`;
}
const RISK_COLOURS = { Low: "good", Medium: "warn", High: "bad" };
const ROLLBACK_COLOURS = { solid: "good", weak: "warn", missing: "bad" };
const TESTING_COLOURS = { yes: "good", partial: "warn", none: "bad" };
const TYPE_COLOURS = { Standard: "good", Normal: "info", Emergency: "bad" };

// Build the RFC card's HTML from one RFC object in data.js.
function renderCard(rfc) {
  const person = CHARACTERS[rfc.requester];

  document.getElementById("progress").textContent =
    `RFC ${state.currentIndex + 1} of ${state.agenda.length}`;

  document.getElementById("rfc-card").innerHTML = `
    <span class="rfc-id">${rfc.id}</span>
    <h2>${rfc.title}</h2>
    <p class="requester">Requested by <strong>${person.name}</strong>, ${person.role}
      <br><small>${person.personality}</small></p>
    <dl class="fields">
      <dt>Change type</dt>     <dd>${tag(rfc.type, TYPE_COLOURS[rfc.type])}</dd>
      <dt>Stated risk</dt>     <dd>${tag(rfc.statedRisk, RISK_COLOURS[rfc.statedRisk])}</dd>
      <dt>Systems affected</dt><dd>${rfc.systems.join(", ")}</dd>
      <dt>Window</dt>          <dd>${rfc.window}</dd>
      <dt>Rollback plan</dt>   <dd>${tag(rfc.rollback, ROLLBACK_COLOURS[rfc.rollback])}</dd>
      <dt>Testing evidence</dt><dd>${tag(rfc.testing, TESTING_COLOURS[rfc.testing])}</dd>
    </dl>
    <blockquote class="justification">"${rfc.justification}"</blockquote>
  `;

  // Reset the buttons and reaction text for the new card.
  document.getElementById("reaction").textContent = "";
  setDecisionButtonsEnabled(true);
  document.getElementById("btn-next").classList.add("hidden");
}

function setDecisionButtonsEnabled(enabled) {
  document.querySelectorAll("#decision-buttons button").forEach(button => {
    button.disabled = !enabled;
  });
}

const METER_NAMES = {
  stability: "Stability", leadership: "Leadership", audit: "Audit", sanity: "Sanity"
};

// Turn { stability: -5, leadership: 2 } into "Stability -5, Leadership +2".
function describeEffects(fx) {
  return Object.keys(fx)
    .filter(m => fx[m] !== 0)
    .map(m => `${METER_NAMES[m]} ${fx[m] > 0 ? "+" : ""}${fx[m]}`)
    .join(", ");
}

// Build one incident report "ticket" for the consequences screen.
function renderReport(report) {
  const heading = report.outcome === "outage"
    ? `${report.number} &middot; ${report.label} &middot; ${report.rfc.systems.join(", ")}`
    : `${report.rfc.id} &middot; ${report.label}`;
  const duration = report.duration ? `<p class="report-meta">Duration: ${report.duration}</p>` : "";
  const source = report.outcome === "outage" ? `Caused by ${report.rfc.id}` : "Change";

  return `
    <article class="report ${report.outcome}">
      <h3>${heading}</h3>
      <p class="report-meta">${source}: ${report.rfc.title}</p>
      ${duration}
      <p>${report.text}</p>
      <p class="report-fx">${describeEffects(report.fx)}</p>
    </article>
  `;
}

function renderConsequences(totalFx) {
  const list = document.getElementById("reports");
  const outages = state.reports.filter(r => r.outcome === "outage").length;

  let intro;
  if (state.reports.length === 0) {
    intro = "You approved nothing. Nothing broke. Nothing improved. The business is unsure what you're for.";
  } else if (outages === 0) {
    intro = "A quiet night. Every approved change went in cleanly.";
  } else {
    intro = `The overnight change window produced ${outages} incident${outages > 1 ? "s" : ""}.`;
  }

  list.innerHTML = `<p>${intro}</p>` + state.reports.map(renderReport).join("");
  renderMeters(totalFx);
}

const DECISION_LABELS = { approve: "Approved", reject: "Rejected", sendBack: "Sent back" };

function renderEndScreen(gameOver) {
  const title = document.getElementById("end-title");
  const summary = document.getElementById("end-summary");

  if (gameOver) {
    const deadMeter = Object.keys(state.meters).find(m => state.meters[m] <= 0);
    title.textContent = "GAME OVER";
    summary.innerHTML = `<p>${GAME_OVER_MESSAGES[deadMeter]}</p>`;
  } else {
    title.textContent = "Meeting adjourned";
    summary.innerHTML = "<p>You survived the Tuesday CAB.</p>";
  }

  const outages = state.reports.filter(r => r.outcome === "outage").length;
  const count = d => state.decisions.filter(x => x.decision === d).length;
  summary.innerHTML += `
    <p><strong>${state.decisions.length}</strong> changes processed:
       ${count("approve")} approved, ${count("reject")} rejected, ${count("sendBack")} sent back.
       <br><strong>${outages}</strong> outage${outages === 1 ? "" : "s"} caused.</p>
  `;

  const items = state.decisions.map(d => {
    const report = state.reports.find(r => r.rfc === d.rfc);
    const result = report ? ` (${report.label.toLowerCase()})` : "";
    return `<li><strong>${d.rfc.id}</strong> ${d.rfc.title}: ${DECISION_LABELS[d.decision]}${result}</li>`;
  }).join("");
  summary.innerHTML += `<ul>${items}</ul>`;
}

const GAME_OVER_MESSAGES = {
  stability: "Production is on fire. The status page now just says 'yes'.",
  leadership: "Leadership has replaced the CAB with a Slack poll. You have been 'restructured'.",
  audit: "The auditors found your change records. All of them. You are now a case study.",
  sanity: "You have walked into the sea. Your out-of-office says 'rollback plan: none'."
};

// ---------------------------------------------------------------------
// 4. EVENTS - what happens when the player clicks things.
// ---------------------------------------------------------------------
function startMeeting() {
  resetGame();
  renderMeters();
  showScreen("screen-meeting");
  renderCard(state.agenda[state.currentIndex]);
}

function makeDecision(decision) {
  const rfc = state.agenda[state.currentIndex];
  const fx = getDecisionEffects(rfc, decision);

  applyEffects(fx);
  state.decisions.push({ rfc, decision });
  renderMeters(fx);

  // Show the requester's reaction and stop more clicks on this card.
  document.getElementById("reaction").textContent =
    CHARACTERS[rfc.requester].reactions[decision];
  setDecisionButtonsEnabled(false);

  if (isGameOver()) {
    renderEndScreen(true);
    // Short pause so the player sees the meter drop before game over.
    setTimeout(() => showScreen("screen-end"), 1200);
    return;
  }

  const isLastCard = state.currentIndex === state.agenda.length - 1;
  const nextButton = document.getElementById("btn-next");
  nextButton.textContent = isLastCard ? "End meeting" : "Next RFC";
  nextButton.classList.remove("hidden");
}

function nextCard() {
  state.currentIndex++;
  if (state.currentIndex >= state.agenda.length) {
    endMeeting();
  } else {
    renderMeters();
    renderCard(state.agenda[state.currentIndex]);
  }
}

// The meeting is over: roll the dice for every approved change.
function endMeeting() {
  const totalFx = { stability: 0, leadership: 0, audit: 0, sanity: 0 };

  state.decisions
    .filter(d => d.decision === "approve")
    .forEach(d => {
      const report = resolveApprovedChange(d.rfc);
      state.reports.push(report);
      applyEffects(report.fx);
      for (const m in report.fx) totalFx[m] += report.fx[m];
    });

  renderConsequences(totalFx);
  showScreen("screen-consequences");
}

// After reading the incident reports, go to the summary (or game over).
function afterConsequences() {
  renderMeters();
  renderEndScreen(isGameOver());
  showScreen("screen-end");
}

// Connect buttons to the functions above.
document.getElementById("btn-start").addEventListener("click", startMeeting);
document.getElementById("btn-next").addEventListener("click", nextCard);
document.getElementById("btn-continue").addEventListener("click", afterConsequences);
document.getElementById("btn-restart").addEventListener("click", startMeeting);
document.querySelectorAll("#decision-buttons button").forEach(button => {
  button.addEventListener("click", () => makeDecision(button.dataset.decision));
});

// Draw the meters once when the page first loads.
resetGame();
renderMeters();
