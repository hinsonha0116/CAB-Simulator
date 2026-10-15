/* =====================================================================
   CAB SIMULATOR - GAME LOGIC
   This file holds the RULES. The content (RFCs, characters, ratings)
   lives in data.js, which is loaded before this file.
   ===================================================================== */

// ---------------------------------------------------------------------
// 1. GAME STATE - everything the game needs to remember while playing.
// ---------------------------------------------------------------------
const STARTING_METER_VALUE = 50;
const MEETING_DAYS = ["Tuesday", "Thursday"]; // CAB meetings each week
const MIN_RFCS_PER_MEETING = 3;
const MAX_RFCS_PER_MEETING = 5;
const WEEKEND_SANITY_BONUS = 5;               // a weekend off helps a bit

let state = {}; // filled in by resetGame()

function resetGame() {
  state = {
    meters: {
      stability: STARTING_METER_VALUE,
      leadership: STARTING_METER_VALUE,
      audit: STARTING_METER_VALUE,
      sanity: STARTING_METER_VALUE
    },
    week: 1,
    meetingIndex: 0,     // 0 = Tuesday, 1 = Thursday
    deck: shuffle([...RFCS]), // RFCs waiting to be put on an agenda
    agenda: [],          // the RFCs in the current meeting
    currentIndex: 0,     // which RFC on the agenda we're looking at
    // Every decision ever made, each stamped with its week and day:
    // { week, day, rfc, decision, report }
    history: [],
    nextIncidentNumber: 1042
  };
}

function currentDay() {
  return MEETING_DAYS[state.meetingIndex];
}

// Handy filters over the history.
function decisionsThisMeeting() {
  return state.history.filter(h => h.week === state.week && h.day === currentDay());
}
function decisionsThisWeek() {
  return state.history.filter(h => h.week === state.week);
}

// ---------------------------------------------------------------------
// 2. BUILDING AN AGENDA
// ---------------------------------------------------------------------

// Shuffle a list into random order (the "Fisher-Yates" shuffle).
function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

// Deal 3-5 RFCs off the top of the deck. When the deck runs out,
// reshuffle the whole pool so the game can keep going.
function drawAgenda() {
  const size = MIN_RFCS_PER_MEETING +
    Math.floor(Math.random() * (MAX_RFCS_PER_MEETING - MIN_RFCS_PER_MEETING + 1));
  const agenda = [];
  while (agenda.length < size) {
    if (state.deck.length === 0) {
      state.deck = shuffle(RFCS.filter(rfc => !agenda.includes(rfc)));
    }
    agenda.push(state.deck.pop());
  }
  return agenda;
}

// ---------------------------------------------------------------------
// 3. RULES
// ---------------------------------------------------------------------

// 3a. IMMEDIATE effects of a decision, felt in the meeting room.
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

// 3b. What ACTUALLY happens to an approved change after the meeting.
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

// 3c. End-of-week performance rating. Checked top to bottom: the
//     first rule that matches wins. Titles and jokes live in data.js.
function getPerformanceRating(entries) {
  const total = entries.length;
  const count = d => entries.filter(h => h.decision === d).length;
  const approveRate = count("approve") / total;
  const rejectRate = count("reject") / total;
  const sendBackRate = count("sendBack") / total;
  const outages = entries.filter(h => h.report && h.report.outcome === "outage").length;

  if (outages >= 3) return PERFORMANCE_RATINGS.incidentFactory;
  if (rejectRate >= 0.6) return PERFORMANCE_RATINGS.wallOfNo;
  if (sendBackRate >= 0.5) return PERFORMANCE_RATINGS.needsMoreInfo;
  if (approveRate >= 0.8 && outages >= 1) return PERFORMANCE_RATINGS.rubberStamp;
  if (outages === 0 && approveRate >= 0.4) return PERFORMANCE_RATINGS.actuallyGood;
  if (outages === 0) return PERFORMANCE_RATINGS.cautious;
  return PERFORMANCE_RATINGS.mediocre;
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
// 4. DRAWING THE SCREEN - functions that update what the player sees.
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

// The scene-setting screen before each meeting.
function renderMeetingIntro(extraNote = "") {
  document.getElementById("intro-title").textContent =
    `Week ${state.week} · ${currentDay()} CAB, 10:00`;
  document.getElementById("intro-text").textContent = pickRandom(MEETING_INTROS);
  document.getElementById("intro-note").textContent = extraNote;
  // The "how to play" text only needs showing at the very start.
  const isFirstMeeting = state.week === 1 && state.meetingIndex === 0;
  document.getElementById("intro-rules").classList.toggle("hidden", !isFirstMeeting);
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
    `Week ${state.week} · ${currentDay()} CAB · RFC ${state.currentIndex + 1} of ${state.agenda.length}`;

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

function renderConsequences(reports, totalFx) {
  const outages = reports.filter(r => r.outcome === "outage").length;

  let intro;
  if (reports.length === 0) {
    intro = "You approved nothing. Nothing broke. Nothing improved. The business is unsure what you're for.";
  } else if (outages === 0) {
    intro = "A quiet night. Every approved change went in cleanly.";
  } else {
    intro = `The change window after ${currentDay()}'s CAB produced ${outages} incident${outages > 1 ? "s" : ""}.`;
  }

  document.getElementById("consequences-title").textContent =
    `After ${currentDay()}'s CAB: results`;
  document.getElementById("reports").innerHTML =
    `<p>${intro}</p>` + reports.map(renderReport).join("");
  renderMeters(totalFx);

  // What does the "continue" button lead to?
  const button = document.getElementById("btn-continue");
  const isLastMeetingOfWeek = state.meetingIndex === MEETING_DAYS.length - 1;
  if (isGameOver()) button.textContent = "Oh no";
  else if (isLastMeetingOfWeek) button.textContent = "See week summary";
  else button.textContent = `On to ${MEETING_DAYS[state.meetingIndex + 1]}'s CAB`;
}

const DECISION_LABELS = { approve: "Approved", reject: "Rejected", sendBack: "Sent back" };

// Shared by the week summary and game over screen: stats + decision list.
function renderStats(entries) {
  const count = d => entries.filter(h => h.decision === d).length;
  const outages = entries.filter(h => h.report && h.report.outcome === "outage").length;

  const items = entries.map(h => {
    const result = h.report ? ` (${h.report.label.toLowerCase()})` : "";
    return `<li><span class="when">${h.day.slice(0, 3)}</span> <strong>${h.rfc.id}</strong> ` +
      `${h.rfc.title}: ${DECISION_LABELS[h.decision]}${result}</li>`;
  }).join("");

  return `
    <div class="stats">
      <div><span class="stat-number">${entries.length}</span>changes processed</div>
      <div><span class="stat-number">${count("approve")}</span>approved</div>
      <div><span class="stat-number">${count("reject")}</span>rejected</div>
      <div><span class="stat-number">${count("sendBack")}</span>sent back</div>
      <div><span class="stat-number ${outages ? "bad" : ""}">${outages}</span>outage${outages === 1 ? "" : "s"} caused</div>
    </div>
    <ul class="decision-list">${items}</ul>
  `;
}

function renderWeekSummary() {
  const entries = decisionsThisWeek();
  const rating = getPerformanceRating(entries);

  document.getElementById("week-title").textContent = `Week ${state.week} complete`;
  document.getElementById("week-summary").innerHTML = `
    <div class="rating">
      <p class="rating-label">Performance rating</p>
      <p class="rating-title">${rating.title}</p>
      <p>${rating.blurb}</p>
    </div>
    ${renderStats(entries)}
  `;
  document.getElementById("btn-next-week").textContent = `Start week ${state.week + 1}`;
}

function renderGameOver() {
  const deadMeter = Object.keys(state.meters).find(m => state.meters[m] <= 0);
  const weeks = state.week === 1 ? "1 week" : `${state.week} weeks`;

  document.getElementById("end-title").textContent = "GAME OVER";
  document.getElementById("end-summary").innerHTML = `
    <p>${GAME_OVER_MESSAGES[deadMeter]}</p>
    <p>You chaired the CAB for <strong>${weeks}</strong>, until ${currentDay()}.
       Your whole career:</p>
    ${renderStats(state.history)}
  `;
}

const GAME_OVER_MESSAGES = {
  stability: "Production is on fire. The status page now just says 'yes'.",
  leadership: "Leadership has replaced the CAB with a Slack poll. You have been 'restructured'.",
  audit: "The auditors found your change records. All of them. You are now a case study.",
  sanity: "You have walked into the sea. Your out-of-office says 'rollback plan: none'."
};

// ---------------------------------------------------------------------
// 5. EVENTS - what happens when the player clicks things.
//    The flow is:  intro -> meeting -> results -> (next meeting's intro
//    OR week summary -> next week's intro)  ...until a meter hits 0.
// ---------------------------------------------------------------------
function newGame() {
  resetGame();
  renderMeters();
  renderMeetingIntro();
  showScreen("screen-intro");
}

function startMeeting() {
  state.agenda = drawAgenda();
  state.currentIndex = 0;
  renderMeters();
  showScreen("screen-meeting");
  renderCard(state.agenda[0]);
}

function makeDecision(decision) {
  const rfc = state.agenda[state.currentIndex];
  const fx = getDecisionEffects(rfc, decision);

  applyEffects(fx);
  state.history.push({ week: state.week, day: currentDay(), rfc, decision, report: null });
  renderMeters(fx);

  // Show the requester's reaction and stop more clicks on this card.
  document.getElementById("reaction").textContent =
    CHARACTERS[rfc.requester].reactions[decision];
  setDecisionButtonsEnabled(false);

  if (isGameOver()) {
    renderGameOver();
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
  const reports = [];

  decisionsThisMeeting()
    .filter(h => h.decision === "approve")
    .forEach(h => {
      h.report = resolveApprovedChange(h.rfc);
      reports.push(h.report);
      applyEffects(h.report.fx);
      for (const m in h.report.fx) totalFx[m] += h.report.fx[m];
    });

  renderConsequences(reports, totalFx);
  showScreen("screen-consequences");
}

// After reading the incident reports: game over, next meeting, or week summary.
function afterConsequences() {
  renderMeters();
  if (isGameOver()) {
    renderGameOver();
    showScreen("screen-end");
  } else if (state.meetingIndex < MEETING_DAYS.length - 1) {
    state.meetingIndex++;
    renderMeetingIntro();
    showScreen("screen-intro");
  } else {
    renderWeekSummary();
    showScreen("screen-week");
  }
}

function startNextWeek() {
  state.week++;
  state.meetingIndex = 0;
  applyEffects({ sanity: WEEKEND_SANITY_BONUS });
  renderMeters({ sanity: WEEKEND_SANITY_BONUS });
  renderMeetingIntro(`The weekend restored a little sanity (+${WEEKEND_SANITY_BONUS}).`);
  showScreen("screen-intro");
}

// Connect buttons to the functions above.
document.getElementById("btn-start").addEventListener("click", startMeeting);
document.getElementById("btn-next").addEventListener("click", nextCard);
document.getElementById("btn-continue").addEventListener("click", afterConsequences);
document.getElementById("btn-next-week").addEventListener("click", startNextWeek);
document.getElementById("btn-restart").addEventListener("click", newGame);
document.querySelectorAll("#decision-buttons button").forEach(button => {
  button.addEventListener("click", () => makeDecision(button.dataset.decision));
});

// Set up the first meeting when the page loads.
newGame();
