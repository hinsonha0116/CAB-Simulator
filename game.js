/* =====================================================================
   CAB SIMULATOR - GAME LOGIC
   This file holds the RULES. The content (RFCs, characters) lives in
   data.js, which is loaded before this file, so CHARACTERS and RFCS
   are already available here.
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
    decisions: []        // a log of what the player chose
  };
}

// ---------------------------------------------------------------------
// 2. RULES - how much each decision moves the meters.
//    For now (Milestone 1) this only looks at the VISIBLE card fields.
//    The hidden true risk will matter in Milestone 2.
// ---------------------------------------------------------------------
function getDecisionEffects(rfc, decision) {
  // Start with "no change" for every meter, then add things up.
  const fx = { stability: 0, leadership: 0, audit: 0, sanity: 0 };

  if (decision === "approve") {
    fx.leadership += 6;   // people like hearing "yes"
    fx.sanity += 2;       // and you avoided an argument
    fx.stability -= 2;    // every change carries some risk

    // Approving without a proper rollback plan or testing hurts your audit trail.
    if (rfc.rollback === "missing") fx.audit -= 6;
    if (rfc.rollback === "weak") fx.audit -= 2;
    if (rfc.testing === "none") { fx.audit -= 4; fx.stability -= 3; }
  }

  if (decision === "reject") {
    fx.leadership -= 6;   // someone important wanted this
    fx.stability += 2;    // nothing changed, nothing broke
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
    summary.innerHTML = "<p>You survived the Tuesday CAB. Here's what you decided:</p>";
  }

  const items = state.decisions
    .map(d => `<li><strong>${d.rfc.id}</strong> ${d.rfc.title}: ${DECISION_LABELS[d.decision]}</li>`)
    .join("");
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
    renderEndScreen(false);
    showScreen("screen-end");
  } else {
    renderMeters();
    renderCard(state.agenda[state.currentIndex]);
  }
}

// Connect buttons to the functions above.
document.getElementById("btn-start").addEventListener("click", startMeeting);
document.getElementById("btn-next").addEventListener("click", nextCard);
document.getElementById("btn-restart").addEventListener("click", startMeeting);
document.querySelectorAll("#decision-buttons button").forEach(button => {
  button.addEventListener("click", () => makeDecision(button.dataset.decision));
});

// Draw the meters once when the page first loads.
resetGame();
renderMeters();
