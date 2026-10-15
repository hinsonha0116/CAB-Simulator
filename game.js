/* =====================================================================
   CAB SIMULATOR - GAME LOGIC
   This file holds the RULES. The content (RFCs, characters, ratings)
   lives in data.js, which is loaded before this file.
   ===================================================================== */

// ---------------------------------------------------------------------
// 0. DATA CHECKER - catches typos in data.js (e.g. testing: "Yes" with a
//    capital Y) and lists them in a red box on the page. Broken RFCs are
//    left out of the game so everything else keeps working.
// ---------------------------------------------------------------------
const ALLOWED = {
  type: ["Standard", "Normal", "Emergency"],
  statedRisk: ["Low", "Medium", "High"],
  hiddenRisk: ["Low", "Medium", "High"],
  rollback: ["solid", "weak", "missing"],
  testing: ["yes", "partial", "none"],
  clout: ["Low", "Medium", "High"],
  followThrough: ["Low", "Medium", "High"]
};
const REQUIRED_RFC_FIELDS = ["id", "title", "requester", "type", "statedRisk", "systems",
  "window", "rollback", "testing", "justification", "hiddenRisk"];
const EVENT_EFFECTS = ["auditHonest", "freeze", "promise", "flagUnauthorized"];

const dataProblems = [];   // human-readable problems found
const brokenRfcs = [];     // RFCs left out of the game

// Check one field's value against its allowed list.
function checkAllowed(where, field, value) {
  if (!ALLOWED[field].includes(value)) {
    dataProblems.push(`${where}: ${field} is "${value}", but must be one of: ${ALLOWED[field].join(", ")}`);
    return false;
  }
  return true;
}

function checkData() {
  for (const key in CHARACTERS) {
    const c = CHARACTERS[key];
    const where = `Character "${key}"`;
    ["name", "role", "personality"].forEach(f => { if (!c[f]) dataProblems.push(`${where}: missing ${f}`); });
    checkAllowed(where, "clout", c.clout);
    checkAllowed(where, "followThrough", c.followThrough);
    ["approve", "reject", "sendBack"].forEach(d => {
      if (!c.reactions || !c.reactions[d]) dataProblems.push(`${where}: missing reactions.${d}`);
    });
  }

  const seenIds = [];
  RFCS.forEach((rfc, index) => {
    const where = `RFC ${rfc.id || "#" + (index + 1)}`;
    const before = dataProblems.length;

    REQUIRED_RFC_FIELDS.forEach(f => { if (rfc[f] === undefined) dataProblems.push(`${where}: missing ${f}`); });
    ["type", "statedRisk", "hiddenRisk", "rollback", "testing"].forEach(f => {
      if (rfc[f] !== undefined) checkAllowed(where, f, rfc[f]);
    });
    if (rfc.requester && !CHARACTERS[rfc.requester]) {
      dataProblems.push(`${where}: requester "${rfc.requester}" isn't in CHARACTERS`);
    }
    if (rfc.systems !== undefined && (!Array.isArray(rfc.systems) || rfc.systems.length === 0)) {
      dataProblems.push(`${where}: systems must be a list like ["Web Platform"]`);
    }
    if (seenIds.includes(rfc.id)) dataProblems.push(`${where}: another RFC already uses this id`);
    seenIds.push(rfc.id);

    const em = rfc.returnsAsEmergency;
    if (em) {
      if (!em.reason) dataProblems.push(`${where}: returnsAsEmergency needs a reason`);
      ["statedRisk", "hiddenRisk", "rollback", "testing"].forEach(f => {
        if (em[f] !== undefined) checkAllowed(`${where} (returnsAsEmergency)`, f, em[f]);
      });
    }

    if (dataProblems.length > before) brokenRfcs.push(rfc);
  });

  EVENTS.forEach(event => {
    const where = `Event "${event.id}"`;
    if (!event.title || !event.text || !event.choices || event.choices.length === 0) {
      dataProblems.push(`${where}: needs a title, text and at least one choice`);
    }
    (event.suspects || []).forEach(s => {
      if (!CHARACTERS[s]) dataProblems.push(`${where}: suspect "${s}" isn't in CHARACTERS`);
    });
    (event.choices || []).forEach(choice => {
      if (choice.effect && !EVENT_EFFECTS.includes(choice.effect)) {
        dataProblems.push(`${where}: unknown effect "${choice.effect}"`);
      }
    });
  });
}

function renderDataProblems() {
  const box = document.getElementById("data-problems");
  if (dataProblems.length === 0) return;
  box.innerHTML = `<strong>Problems found in data.js</strong> (fix these and refresh the page):
    <ul>${dataProblems.map(p => `<li>${p}</li>`).join("")}</ul>`;
  box.classList.remove("hidden");
  console.error("CAB Simulator data problems:\n" + dataProblems.join("\n"));
}

checkData();
// The RFCs the game will actually use (everything without problems).
const PLAYABLE_RFCS = RFCS.filter(rfc => !brokenRfcs.includes(rfc));

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
    meetingNumber: 0,    // counts every meeting so far (1, 2, 3...)
    deck: shuffle([...PLAYABLE_RFCS]), // RFCs waiting to be put on an agenda
    // RFCs coming back later (sent back, or returning as emergencies):
    // { rfc, dueMeeting }
    returning: [],
    agenda: [],          // the RFCs in the current meeting
    currentIndex: 0,     // which RFC on the agenda we're looking at
    // Every decision ever made, each stamped with its week and day:
    // { week, day, rfc, decision, report }
    history: [],
    nextIncidentNumber: 1042,
    // Random event state:
    freeze: false,        // change freeze at the next meeting?
    promise: false,       // promised leadership to be "flexible"?
    lastAuditMeeting: 0,  // the auditors check everything after this meeting
    auditFlags: [],       // extra findings waiting for the next audit
    currentEvent: null,   // { event, suspect } while an event is on screen
    pendingNote: ""       // message to show on the next meeting intro
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

// A returning RFC is a modified COPY of the original, with a new id
// like "CHG0002-R1". baseId is always the original id.
function baseId(rfc) {
  return rfc.baseId || rfc.id;
}

function drawAgenda() {
  // 1. RFCs that are due back go on the agenda first, emergencies on top.
  const due = state.returning.filter(r => r.dueMeeting <= state.meetingNumber);
  state.returning = state.returning.filter(r => r.dueMeeting > state.meetingNumber);
  const agenda = due.map(r => r.rfc)
    .sort((a, b) => (b.type === "Emergency") - (a.type === "Emergency"));

  // 2. Top up with fresh RFCs to 3-5 in total. When the deck runs out,
  //    reshuffle the whole pool so the game can keep going.
  const size = Math.max(agenda.length, MIN_RFCS_PER_MEETING +
    Math.floor(Math.random() * (MAX_RFCS_PER_MEETING - MIN_RFCS_PER_MEETING + 1)));

  // Don't deal an RFC if a version of it is already on this agenda
  // or is waiting to come back later.
  const isBlocked = rfc =>
    agenda.some(a => baseId(a) === rfc.id) ||
    state.returning.some(r => baseId(r.rfc) === rfc.id);

  while (agenda.length < size) {
    if (state.deck.length === 0) {
      state.deck = shuffle(PLAYABLE_RFCS.filter(rfc => !isBlocked(rfc)));
    }
    const rfc = state.deck.pop();
    if (!isBlocked(rfc)) agenda.push(rfc);
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

// Every after-meeting result is a "report". style = colour on screen:
// "bad" (red), "warn" (yellow), "good" (green), "info" (grey).
function makeReport(rfc, outcome, label, style, text, fx, extra = {}) {
  return { number: null, rfc, outcome, label, style, text: fillIn(text, rfc), fx, ...extra };
}

// Roll the dice for one approved RFC and build its incident report.
function resolveApprovedChange(rfc) {
  const isOutage = Math.random() < chanceOfOutage(rfc);

  if (isOutage) {
    const severity = OUTAGE_SEVERITY[rfc.rollback];
    return makeReport(rfc, "outage", severity.label + " outage", "bad",
      rfc.outageReport || pickRandom(GENERIC_REPORTS.outage), severity.fx,
      { number: "INC" + state.nextIncidentNumber++, duration: severity.duration });
  }

  return makeReport(rfc, "success", "Successful change", "good",
    rfc.successReport || pickRandom(GENERIC_REPORTS.success), SUCCESS_FX);
}

// 3c. What happens to a REJECTED change after the meeting.
const EMERGENCY_RETURN_CHANCE = 0.6;  // if the RFC has a returnsAsEmergency version
const ESCALATION_CHANCE = { High: 0.7, Medium: 0.4, Low: 0.15 }; // by requester's clout

const NO_FX = { stability: 0, leadership: 0, audit: 0, sanity: 0 };
const EMERGENCY_RETURN_FX = { stability: -6, leadership: -4, audit: 0, sanity: -3 };
const ESCALATION_FX = { stability: 0, leadership: -8, audit: 0, sanity: -4 };
const DODGED_FX = { stability: 2, leadership: 0, audit: 2, sanity: 2 };

function resolveRejectedChange(rfc) {
  const person = CHARACTERS[rfc.requester];

  // 1. The problem the change was meant to fix gets worse -> it comes
  //    back at the very next meeting as an Emergency change.
  if (rfc.returnsAsEmergency && Math.random() < EMERGENCY_RETURN_CHANCE) {
    const { reason, ...changes } = rfc.returnsAsEmergency;
    const emergency = {
      ...rfc,
      ...changes,
      type: "Emergency",
      id: baseId(rfc) + "-E",
      baseId: baseId(rfc),
      returnsAsEmergency: null, // it can't turn into an emergency twice
      returnNote: `Back as an EMERGENCY. You rejected this at ${currentDay()}'s CAB.`,
      returnStyle: "bad"
    };
    state.returning.push({ rfc: emergency, dueMeeting: state.meetingNumber + 1 });
    return makeReport(rfc, "emergency", "Problem got worse", "bad", reason, EMERGENCY_RETURN_FX);
  }

  // 2. The requester goes over your head.
  if (Math.random() < ESCALATION_CHANCE[person.clout]) {
    return makeReport(rfc, "escalation", "Escalated to leadership", "warn",
      rfc.rejectedReport || pickRandom(GENERIC_REPORTS.escalation), ESCALATION_FX);
  }

  // 3. It really WAS dangerous, and you saw it. Small reward.
  if (rfc.hiddenRisk === "High") {
    return makeReport(rfc, "dodged", "Bullet dodged", "good",
      pickRandom(GENERIC_REPORTS.dodged), DODGED_FX);
  }

  return null; // the requester accepted it quietly; no report
}

// 3d. What happens to a SENT BACK change after the meeting.
const IMPROVE_CHANCE = { High: 0.9, Medium: 0.5, Low: 0.2 }; // by requester's followThrough
const MAX_RESUBMISSIONS = 2;  // send it back a 3rd time and they give up
const WITHDRAWN_FX = { stability: 0, leadership: -4, audit: 0, sanity: -2 };

// One step better: none -> partial -> yes, missing -> weak -> solid.
const BETTER_TESTING = { none: "partial", partial: "yes", yes: "yes" };
const BETTER_ROLLBACK = { missing: "weak", weak: "solid", solid: "solid" };

function resolveSentBack(rfc) {
  const person = CHARACTERS[rfc.requester];
  const attempts = rfc.resubmissions || 0;

  if (attempts >= MAX_RESUBMISSIONS) {
    return makeReport(rfc, "withdrawn", "Withdrawn by requester", "warn",
      pickRandom(RESUBMISSION_NOTES.withdrawn), WITHDRAWN_FX);
  }

  // Did they actually fix anything?
  let resubmitted = { ...rfc };
  let note;
  if (Math.random() < IMPROVE_CHANCE[person.followThrough]) {
    resubmitted.testing = BETTER_TESTING[rfc.testing];
    resubmitted.rollback = BETTER_ROLLBACK[rfc.rollback];
    const changes = [];
    if (resubmitted.testing !== rfc.testing) changes.push(`testing ${rfc.testing} → ${resubmitted.testing}`);
    if (resubmitted.rollback !== rfc.rollback) changes.push(`rollback ${rfc.rollback} → ${resubmitted.rollback}`);
    note = pickRandom(RESUBMISSION_NOTES.improved) +
      (changes.length ? ` Changes: ${changes.join(", ")}.` : " It was already solid; they added more detail anyway.");
  } else {
    note = pickRandom(RESUBMISSION_NOTES.unchanged);
  }

  resubmitted.resubmissions = attempts + 1;
  resubmitted.baseId = baseId(rfc);
  resubmitted.id = `${baseId(rfc)}-R${attempts + 1}`;
  resubmitted.returnNote = `Resubmitted (attempt ${attempts + 2}). ${fillIn(note, rfc)}`;
  resubmitted.returnStyle = "info";

  // Back in 1 or 2 meetings' time.
  const delay = 1 + Math.floor(Math.random() * 2);
  state.returning.push({ rfc: resubmitted, dueMeeting: state.meetingNumber + delay });

  return makeReport(rfc, "resubmit", "Sent back for more info", "info",
    "{name} will resubmit it at a later CAB.", NO_FX);
}

// 3e. COLLISIONS. Everything approved at one meeting goes into the
//     same change window afterwards. Two approved changes that touch
//     the same system might trip over each other.
const COLLISION_CHANCE = 0.4;  // per pair of changes sharing a system
const COLLISION_FX = { stability: -8, leadership: -4, audit: -3, sanity: -4 };

// Which systems do two RFCs have in common? (empty list = none)
function sharedSystems(a, b) {
  return a.systems.filter(system => b.systems.includes(system));
}

// approvedEntries = this meeting's history entries that were approved.
function resolveCollisions(approvedEntries) {
  const reports = [];

  // Check every PAIR once: (1st, 2nd), (1st, 3rd), (2nd, 3rd), ...
  for (let i = 0; i < approvedEntries.length; i++) {
    for (let j = i + 1; j < approvedEntries.length; j++) {
      const a = approvedEntries[i].rfc;
      const b = approvedEntries[j].rfc;
      const shared = sharedSystems(a, b);
      if (shared.length === 0 || Math.random() >= COLLISION_CHANCE) continue;

      const samePerson = a.requester === b.requester;
      const text = pickRandom(samePerson ? COLLISION_REPORTS.samePerson : COLLISION_REPORTS.twoPeople)
        .replaceAll("{system}", shared[0])
        .replaceAll("{a}", CHARACTERS[a.requester].name.split(" ")[0])
        .replaceAll("{b}", CHARACTERS[b.requester].name.split(" ")[0]);

      const report = makeReport(b, "collision", "Change collision", "bad", text, COLLISION_FX, {
        number: "INC" + state.nextIncidentNumber++,
        duration: "2 hours",
        systemsHit: shared,
        source: `Caused by ${a.id} + ${b.id} clashing in the same change window`
      });
      // Remember the collision on the later change's history entry.
      // (A list, because one change can clash with several others.)
      approvedEntries[j].collisions = (approvedEntries[j].collisions || []).concat(report);
      reports.push(report);
    }
  }
  return reports;
}

// Outages = changes that broke + collisions.
function countOutages(entries) {
  const brokenChanges = entries.filter(h => h.report && h.report.outcome === "outage").length;
  const collisions = entries.reduce((total, h) => total + (h.collisions ? h.collisions.length : 0), 0);
  return brokenChanges + collisions;
}

// 3f. End-of-week performance rating. Checked top to bottom: the
//     first rule that matches wins. Titles and jokes live in data.js.
function getPerformanceRating(entries) {
  const total = entries.length;
  const count = d => entries.filter(h => h.decision === d).length;
  const approveRate = count("approve") / total;
  const rejectRate = count("reject") / total;
  const sendBackRate = count("sendBack") / total;
  const outages = countOutages(entries);

  if (outages >= 3) return PERFORMANCE_RATINGS.incidentFactory;
  if (rejectRate >= 0.6) return PERFORMANCE_RATINGS.wallOfNo;
  if (sendBackRate >= 0.5) return PERFORMANCE_RATINGS.needsMoreInfo;
  if (approveRate >= 0.8 && outages >= 1) return PERFORMANCE_RATINGS.rubberStamp;
  if (outages === 0 && approveRate >= 0.4) return PERFORMANCE_RATINGS.actuallyGood;
  if (outages === 0) return PERFORMANCE_RATINGS.cautious;
  return PERFORMANCE_RATINGS.mediocre;
}

// 3g. RANDOM EVENTS between meetings. The events themselves (text and
//     choices) live in data.js; the special rules live here.
const EVENT_CHANCE = 0.5;  // chance of an event before each meeting
const FREEZE_VIOLATION_FX = { leadership: -10, audit: -4 }; // outweighs the +6 for approving
const BROKEN_PROMISE_FX = { leadership: -4, sanity: -2 };
const AUDIT_PENALTY_PER_FINDING = 5;
const AUDIT_MAX_PENALTY = 25;
const CLEAN_AUDIT_FX = { leadership: 2, audit: 10, sanity: 3 };

// What would auditors find, looking at everything since their last visit?
function auditFindings() {
  const findings = [];
  state.history
    .filter(h => h.meeting > state.lastAuditMeeting && h.decision === "approve")
    .forEach(h => {
      if (h.rfc.rollback === "missing") findings.push(`${h.rfc.id} was approved with no rollback plan`);
      if (h.rfc.testing === "none") findings.push(`${h.rfc.id} was approved with no testing evidence`);
      if (h.freezeViolation) findings.push(`${h.rfc.id} was approved during a change freeze`);
    });
  return findings.concat(state.auditFlags);
}

// Replace {name} in event text with the event's suspect.
function fillEventText(text) {
  const suspect = state.currentEvent.suspect;
  if (!suspect) return text;
  return text.replaceAll("{name}", CHARACTERS[suspect].name.split(" ")[0]);
}

// Add one set of meter changes onto another (both are { meter: number }).
function addEffects(target, more) {
  for (const m in more) target[m] = (target[m] || 0) + more[m];
}

// The player picked a choice: work out its effects, switch on any
// lasting rule, and return what to show on screen.
function applyEventChoice(choice) {
  const fx = { stability: 0, leadership: 0, audit: 0, sanity: 0 };
  addEffects(fx, choice.fx || {});
  let text = choice.result || "";
  let findings = [];

  if (choice.effect === "auditHonest") {
    findings = auditFindings();
    if (findings.length === 0) {
      addEffects(fx, CLEAN_AUDIT_FX);
      text = choice.cleanResult;
    } else {
      fx.audit -= Math.min(AUDIT_MAX_PENALTY, findings.length * AUDIT_PENALTY_PER_FINDING);
      fx.sanity -= 2;
      text = choice.findingsResult;
    }
    // The slate is wiped clean after an honest audit.
    state.lastAuditMeeting = state.meetingNumber;
    state.auditFlags = [];
  }
  if (choice.effect === "freeze") state.freeze = true;
  if (choice.effect === "promise") state.promise = true;
  if (choice.effect === "flagUnauthorized") {
    state.auditFlags.push(fillEventText("An unauthorized change by {name} was approved after the fact"));
  }

  applyEffects(fx);
  return { fx, text: fillEventText(text), findings };
}

// Small helpers
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
// Replace {system} and {name} placeholders in report text.
function fillIn(text, rfc) {
  const firstName = CHARACTERS[rfc.requester].name.split(" ")[0];
  return text.replaceAll("{system}", rfc.systems[0]).replaceAll("{name}", firstName);
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

  // Remind the player about any rules from random events.
  const alerts = [];
  if (state.freeze) alerts.push("❄ Change freeze in effect: approve only Emergency changes.");
  if (state.promise) alerts.push("You promised leadership you'd be 'flexible'. Rejecting or sending back will cost extra.");
  document.getElementById("intro-alert").textContent = alerts.join(" ");
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
// A coloured circle with the character's initials, e.g. "PR".
// Each character gets a fixed colour based on their position in data.js.
const AVATAR_COLOURS = ["#2f5fa7", "#2f8f4e", "#a2452f", "#7a4fb0", "#b97f0f",
  "#1f8a8a", "#b0457a", "#4a6b2f", "#5a5fc0", "#8a5a2f", "#3d7cb0"];

function renderAvatar(characterKey) {
  const initials = CHARACTERS[characterKey].name
    .split(" ").slice(0, 2).map(word => word[0]).join("");
  const position = Object.keys(CHARACTERS).indexOf(characterKey);
  const colour = AVATAR_COLOURS[position % AVATAR_COLOURS.length];
  return `<span class="avatar" style="background:${colour}" aria-hidden="true">${initials}</span>`;
}

function renderCard(rfc) {
  const person = CHARACTERS[rfc.requester];

  document.getElementById("progress").textContent =
    `Week ${state.week} · ${currentDay()} CAB · RFC ${state.currentIndex + 1} of ${state.agenda.length}`;

  // Returning RFCs get a banner explaining why they're back.
  const banner = rfc.returnNote
    ? `<p class="return-note ${rfc.returnStyle}">&#8617; ${rfc.returnNote}</p>`
    : "";

  // Reminders from random events (freeze, promise).
  let status = "";
  if (state.freeze) {
    status += `<p class="status-banner">&#10052; CHANGE FREEZE: approving anything except an Emergency change breaks the freeze.</p>`;
  }
  if (state.promise) {
    status += `<p class="status-banner">&#128222; You promised to be 'flexible'. Rejecting or sending back will cost you.</p>`;
  }

  const card = document.getElementById("rfc-card");
  card.className = `card type-${rfc.type}`; // coloured top edge per change type
  card.innerHTML = `
    ${status}
    ${banner}
    <span class="rfc-id">${rfc.id}</span>
    <h2>${rfc.title}</h2>
    <div class="requester">
      ${renderAvatar(rfc.requester)}
      <p class="requester-text">Requested by <strong>${person.name}</strong>, ${person.role}
        <small>${person.personality}</small></p>
    </div>
    <dl class="fields">
      <dt>Change type</dt>     <dd>${tag(rfc.type, TYPE_COLOURS[rfc.type])}</dd>
      <dt>Stated risk</dt>     <dd>${tag(rfc.statedRisk, RISK_COLOURS[rfc.statedRisk])}</dd>
      <dt>Systems affected</dt><dd>${rfc.systems.join(", ")}</dd>
      <dt>Window</dt>          <dd>${rfc.window}</dd>
      <dt>Rollback plan</dt>   <dd>${tag(rfc.rollback, ROLLBACK_COLOURS[rfc.rollback])}</dd>
      <dt>Testing evidence</dt><dd>${tag(rfc.testing, TESTING_COLOURS[rfc.testing])}</dd>
    </dl>
    <blockquote class="justification">"${rfc.justification}"</blockquote>
    ${renderScheduleWarning(rfc)}
  `;

  // Reset the buttons and reaction text for the new card.
  document.getElementById("reaction").textContent = "";
  setDecisionButtonsEnabled(true);
  document.getElementById("btn-next").classList.add("hidden");
}

// "Change schedule" check: warn if this RFC touches the same system as
// something already approved at this meeting, or later on the agenda.
function renderScheduleWarning(rfc) {
  const describe = other => `${other.id} (${sharedSystems(rfc, other).join(", ")})`;

  const approvedClashes = decisionsThisMeeting()
    .filter(h => h.decision === "approve" && sharedSystems(rfc, h.rfc).length > 0)
    .map(h => describe(h.rfc));
  const laterClashes = state.agenda.slice(state.currentIndex + 1)
    .filter(other => sharedSystems(rfc, other).length > 0)
    .map(describe);

  if (approvedClashes.length === 0 && laterClashes.length === 0) return "";

  let lines = "";
  if (approvedClashes.length > 0) {
    lines += `<p><strong>&#9888; Schedule conflict:</strong> already approved for the same change ` +
      `window: ${approvedClashes.join(", ")}.</p>`;
  }
  if (laterClashes.length > 0) {
    lines += `<p><strong>&#9888; Heads up:</strong> later on this agenda, touching the same ` +
      `systems: ${laterClashes.join(", ")}.</p>`;
  }
  return `<div class="schedule-warning">${lines}</div>`;
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
  // Incidents (outages, collisions) have an INC number; other reports don't.
  const systems = (report.systemsHit || report.rfc.systems).join(", ");
  const heading = report.number
    ? `${report.number} &middot; ${report.label} &middot; ${systems}`
    : `${report.rfc.id} &middot; ${report.label}`;
  const duration = report.duration ? `<p class="report-meta">Duration: ${report.duration}</p>` : "";
  const source = report.source ||
    (report.outcome === "outage" ? `Caused by ${report.rfc.id}` : "Change") + `: ${report.rfc.title}`;

  return `
    <article class="report ${report.style}">
      <h3>${heading}</h3>
      <p class="report-meta">${source}</p>
      ${duration}
      <p>${report.text}</p>
      <p class="report-fx">${describeEffects(report.fx)}</p>
    </article>
  `;
}

function renderConsequences(reports, totalFx) {
  const outages = reports.filter(r => r.outcome === "outage" || r.outcome === "collision").length;
  const implemented = reports.filter(r => r.outcome === "outage" || r.outcome === "success").length;

  let intro;
  if (reports.length === 0) {
    intro = "You approved nothing. Nothing broke. Nothing improved. The business is unsure what you're for.";
  } else if (implemented === 0) {
    intro = "Nothing was approved, so nothing was implemented. But your decisions still had consequences.";
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
  const outages = countOutages(entries);

  const items = entries.map(h => {
    const showResult = h.report && h.report.outcome !== "resubmit";
    let result = showResult ? ` (${h.report.label.toLowerCase()})` : "";
    if (h.collisions) result += h.collisions.length === 1 ? " + collision" : ` + ${h.collisions.length} collisions`;
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
  state.meetingNumber++;
  state.agenda = drawAgenda();
  state.currentIndex = 0;
  renderMeters();
  showScreen("screen-meeting");
  renderCard(state.agenda[0]);
}

function makeDecision(decision) {
  const rfc = state.agenda[state.currentIndex];
  const fx = getDecisionEffects(rfc, decision);
  const reactions = [CHARACTERS[rfc.requester].reactions[decision]];

  // Change freeze: approving anything but an Emergency breaks it.
  const breaksFreeze = state.freeze && decision === "approve" && rfc.type !== "Emergency";
  if (breaksFreeze) {
    addEffects(fx, FREEZE_VIOLATION_FX);
    reactions.push("You approved a non-Emergency change during a freeze. Leadership noticed.");
  }
  // Promised to be "flexible", then said no.
  if (state.promise && decision !== "approve") {
    addEffects(fx, BROKEN_PROMISE_FX);
    reactions.push("So much for being 'flexible'. Your phone is already ringing.");
  }

  applyEffects(fx);
  state.history.push({
    week: state.week, day: currentDay(), meeting: state.meetingNumber,
    rfc, decision, report: null, freezeViolation: breaksFreeze
  });
  renderMeters(fx);

  // Show the requester's reaction and stop more clicks on this card.
  document.getElementById("reaction").textContent = reactions.join(" ");
  setDecisionButtonsEnabled(false);

  // Thump a rubber stamp onto the card.
  const stamp = document.createElement("div");
  stamp.className = `stamp ${decision}`;
  stamp.textContent = DECISION_LABELS[decision];
  document.getElementById("rfc-card").appendChild(stamp);

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

// The meeting is over: work out what happens with every decision.
function endMeeting() {
  const totalFx = { stability: 0, leadership: 0, audit: 0, sanity: 0 };
  const reports = [];

  decisionsThisMeeting().forEach(h => {
    if (h.decision === "approve") h.report = resolveApprovedChange(h.rfc);
    if (h.decision === "reject") h.report = resolveRejectedChange(h.rfc);
    if (h.decision === "sendBack") h.report = resolveSentBack(h.rfc);
    if (!h.report) return; // nothing to report

    reports.push(h.report);
  });

  // Then check whether any approved changes clashed with each other.
  const approved = decisionsThisMeeting().filter(h => h.decision === "approve");
  reports.push(...resolveCollisions(approved));

  // Apply every report's meter changes.
  reports.forEach(report => {
    applyEffects(report.fx);
    for (const m in report.fx) totalFx[m] += report.fx[m];
  });

  // Freezes and promises only last for one meeting.
  state.freeze = false;
  state.promise = false;

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
    goToNextMeeting();
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
  goToNextMeeting(`The weekend restored a little sanity (+${WEEKEND_SANITY_BONUS}).`);
}

// Before each meeting there's a chance of a random event first.
function goToNextMeeting(note = "") {
  state.pendingNote = note;
  if (Math.random() < EVENT_CHANCE) {
    startEvent();
  } else {
    showMeetingIntro();
  }
}

function showMeetingIntro() {
  renderMeetingIntro(state.pendingNote);
  showScreen("screen-intro");
}

function startEvent() {
  const event = pickRandom(EVENTS);
  const suspect = event.suspects ? pickRandom(event.suspects) : null;
  state.currentEvent = { event, suspect };

  document.getElementById("event-title").textContent = event.title;
  document.getElementById("event-text").textContent = fillEventText(pickRandom(event.text));

  // One button per choice.
  const choicesEl = document.getElementById("event-choices");
  choicesEl.innerHTML = "";
  event.choices.forEach(choice => {
    const button = document.createElement("button");
    button.className = "primary";
    button.textContent = choice.label;
    button.addEventListener("click", () => chooseEventOption(choice));
    choicesEl.appendChild(button);
  });

  choicesEl.classList.remove("hidden");
  document.getElementById("event-result").classList.add("hidden");
  document.getElementById("btn-event-continue").classList.add("hidden");
  showScreen("screen-event");
}

function chooseEventOption(choice) {
  const outcome = applyEventChoice(choice);
  renderMeters(outcome.fx);

  const findingsList = outcome.findings.length
    ? `<ul>${outcome.findings.map(f => `<li>${f}</li>`).join("")}</ul>`
    : "";
  const resultEl = document.getElementById("event-result");
  resultEl.innerHTML = `
    <p>${outcome.text}</p>
    ${findingsList}
    <p class="report-fx">${describeEffects(outcome.fx)}</p>
  `;
  resultEl.classList.remove("hidden");
  document.getElementById("event-choices").classList.add("hidden");

  const continueButton = document.getElementById("btn-event-continue");
  continueButton.textContent = isGameOver() ? "Oh no" : `On to ${currentDay()}'s CAB`;
  continueButton.classList.remove("hidden");
}

function afterEvent() {
  if (isGameOver()) {
    renderGameOver();
    showScreen("screen-end");
  } else {
    showMeetingIntro();
  }
}

// Connect buttons to the functions above.
document.getElementById("btn-start").addEventListener("click", startMeeting);
document.getElementById("btn-next").addEventListener("click", nextCard);
document.getElementById("btn-continue").addEventListener("click", afterConsequences);
document.getElementById("btn-next-week").addEventListener("click", startNextWeek);
document.getElementById("btn-event-continue").addEventListener("click", afterEvent);
document.getElementById("btn-restart").addEventListener("click", newGame);
document.querySelectorAll("#decision-buttons button").forEach(button => {
  button.addEventListener("click", () => makeDecision(button.dataset.decision));
});

// Keyboard shortcuts: A / R / S to decide, Enter to press the screen's
// main "continue" button.
const CONTINUE_BUTTONS = ["btn-start", "btn-next", "btn-continue", "btn-event-continue",
  "btn-next-week", "btn-restart"];

document.addEventListener("keydown", event => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const decision = { a: "approve", r: "reject", s: "sendBack" }[event.key.toLowerCase()];
  const decisionButton = decision && document.querySelector(`[data-decision=${decision}]`);
  const onMeeting = !document.getElementById("screen-meeting").classList.contains("hidden");
  if (decisionButton && onMeeting && !decisionButton.disabled) {
    decisionButton.click();
    return;
  }

  // Enter: if a button already has keyboard focus, the browser clicks it
  // for us, so only step in when nothing is focused.
  if (event.key === "Enter" && event.target.tagName !== "BUTTON") {
    const button = CONTINUE_BUTTONS
      .map(id => document.getElementById(id))
      .find(b => b.offsetParent !== null); // offsetParent is null when hidden
    if (button) button.click();
  }
});

// Set up the first meeting when the page loads.
renderDataProblems();
newGame();
