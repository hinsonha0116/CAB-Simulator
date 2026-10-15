/* =====================================================================
   CAB SIMULATOR - GAME LOGIC
   This file holds the RULES. The content (RFCs, characters, ratings)
   lives in data.js and the data/ folder, which are loaded first.

   HOW A WEEK WORKS
   1. Review:  you are the Change Manager. For each RFC in your queue you
               decide whether it is READY for the CAB or NOT READY (sent
               back to the requester). During a freeze you can also HOLD.
               - Ready Standard changes are pre-authorized: logged, no CAB.
               - Ready Emergency changes go to the Emergency CAB (ECAB).
   2. CAB:     Thursday's board votes on what you sent. Well-prepared
               RFCs usually get approved; poorly prepared ones embarrass
               you and may get rejected (or approved anyway...).
   3. Results: approved changes are implemented. Their HIDDEN risk
               decides whether they cause outages.
   4. Summary: week rating, then maybe a random event, then next week.
   ===================================================================== */

// ---------------------------------------------------------------------
// 0. DATA CHECKER - catches typos in the data files (e.g. testing: "Yes"
//    with a capital Y) and lists them in a red box on the page. Broken
//    RFCs are left out of the game so everything else keeps working.
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
const FOLLOW_UP_CONDITIONS = ["seen", "implemented", "outage"];  // see section 3e-2

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
  // The same checks run on the pool AND on the guided week's cards.
  const checkRfc = (rfc, index, label) => {
    const where = `${label} ${rfc.id || "#" + (index + 1)}`;
    const before = dataProblems.length;

    REQUIRED_RFC_FIELDS.forEach(f => { if (rfc[f] === undefined) dataProblems.push(`${where}: missing ${f}`); });
    ["type", "statedRisk", "hiddenRisk", "rollback", "testing"].forEach(f => {
      if (rfc[f] !== undefined) checkAllowed(where, f, rfc[f]);
    });
    if (rfc.id && !RFC_CATEGORIES[rfc.id.split("-")[0]]) {
      dataProblems.push(`${where}: id must start with one of: ${Object.keys(RFC_CATEGORIES).join(", ")} (e.g. "FW-111")`);
    }
    if (rfc.requester && !CHARACTERS[rfc.requester]) {
      dataProblems.push(`${where}: requester "${rfc.requester}" isn't in CHARACTERS`);
    }
    if (rfc.systems !== undefined && (!Array.isArray(rfc.systems) || rfc.systems.length === 0)) {
      dataProblems.push(`${where}: systems must be a list like ["Core Switch Stack"]`);
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

    // Follow-ups must point at a real RFC and use a known condition.
    if (rfc.after) {
      if (!RFCS.some(other => other.id === rfc.after.id)) {
        dataProblems.push(`${where}: after.id "${rfc.after.id}" isn't an RFC id`);
      }
      if (!FOLLOW_UP_CONDITIONS.includes(rfc.after.when)) {
        dataProblems.push(`${where}: after.when is "${rfc.after.when}", but must be one of: ${FOLLOW_UP_CONDITIONS.join(", ")}`);
      }
    }

    if (rfc.artifacts && rfc.artifacts.rollbackCopiedFrom &&
        !RFCS.some(other => other.id === rfc.artifacts.rollbackCopiedFrom)) {
      dataProblems.push(`${where}: artifacts.rollbackCopiedFrom "${rfc.artifacts.rollbackCopiedFrom}" isn't an RFC id`);
    }

    if (dataProblems.length > before) brokenRfcs.push(rfc);
  };
  RFCS.forEach((rfc, index) => checkRfc(rfc, index, "RFC"));

  // The guided first week (data/tutorial.js).
  const STEP_DOCS = ["implementation", "rollback", "testing", "diagram", "catalogue"];
  TUTORIAL.cards.forEach((card, index) => {
    checkRfc(card.rfc, index, "Guided week RFC");
    const where = `Guided week card ${index + 1}`;
    if (!["ready", "sendBack"].includes(card.recommend)) dataProblems.push(`${where}: recommend must be "ready" or "sendBack"`);
    if (!card.right || !card.wrong) dataProblems.push(`${where}: needs both "right" and "wrong" text`);
    if (card.lesson && (!card.lesson.heading || !Array.isArray(card.lesson.paragraphs))) {
      dataProblems.push(`${where}: lesson needs a heading and a list of paragraphs`);
    }
    (card.steps || []).forEach(step => {
      if (step.open && !STEP_DOCS.includes(step.open)) {
        dataProblems.push(`${where}: step open "${step.open}" must be one of: ${STEP_DOCS.join(", ")}`);
      }
    });
  });

  const catalogueIds = [];
  STANDARD_CHANGE_CATALOGUE.forEach((entry, index) => {
    const where = `Catalogue entry ${entry.id || "#" + (index + 1)}`;
    ["id", "name", "description", "conditions", "notCovered", "procedure"].forEach(f => {
      if (entry[f] === undefined) dataProblems.push(`${where}: missing ${f}`);
    });
    if (catalogueIds.includes(entry.id)) dataProblems.push(`${where}: another entry already uses this id`);
    catalogueIds.push(entry.id);
  });
  RFCS.forEach(rfc => {
    if (rfc.catalogueId && !catalogueIds.includes(rfc.catalogueId)) {
      dataProblems.push(`RFC ${rfc.id}: catalogueId "${rfc.catalogueId}" isn't in STANDARD_CHANGE_CATALOGUE`);
    }
  });

  ["wellPrepared", "borderline", "poorlyPrepared", "standardLogged", "ecab", "freezePulled"].forEach(k => {
    if (!CAB_COMMENTS[k] || CAB_COMMENTS[k].length === 0) dataProblems.push(`CAB_COMMENTS: missing ${k}`);
  });

  // Chris (MENTOR) needs every list of lines the debrief can use.
  ["openers", "general", "signoffs"].forEach(k => {
    if (!MENTOR[k] || MENTOR[k].length === 0) dataProblems.push(`MENTOR: missing ${k}`);
  });
  ["emergencyDelayed", "freezeViolation", "fakeStandard", "rankPressure", "forwardedJunk",
   "sentBackReady", "didntReview", "collisions", "badRollback", "partialTesting", "goodProcessBadLuck",
   "lowLeadership", "lowAudit", "lowStability", "lowSanity", "perfectWeek"].forEach(k => {
    if (!MENTOR.tips || !MENTOR.tips[k] || MENTOR.tips[k].length === 0) dataProblems.push(`MENTOR: missing tips.${k}`);
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
  box.innerHTML = `<strong>Problems found in the data files</strong> (fix these and refresh the page):
    <ul>${dataProblems.map(p => `<li>${p}</li>`).join("")}</ul>`;
  box.classList.remove("hidden");
  console.error("CAB Simulator data problems:\n" + dataProblems.join("\n"));
}

checkData();
// The RFCs the game will actually use (everything without problems).
const PLAYABLE_RFCS = RFCS.filter(rfc => !brokenRfcs.includes(rfc));
// Follow-ups (RFCs with "after") are never dealt at random; they're
// scheduled when the change they follow on from has happened.
const RANDOM_POOL = PLAYABLE_RFCS.filter(rfc => !rfc.after);

// ---------------------------------------------------------------------
// 1. GAME STATE - everything the game needs to remember while playing.
// ---------------------------------------------------------------------
const STARTING_METER_VALUE = 50;
const CAB_DAY = "Thursday";      // one CAB meeting per week
const MIN_RFCS_PER_WEEK = 5;     // the queue grows by 1 every 8 weeks...
const MAX_RFCS_PER_WEEK = 8;
const MAX_QUEUE_SIZE = 10;       // ...up to this size
const WEEKEND_SANITY_BONUS = 4;  // a weekend off helps a bit

// OPS TEMPO: every week the meters wear down a little (the network ages,
// the Colonel always wants more, paperwork piles up, the job is tiring).
// It gets 50% heavier every 4 weeks, so even great players eventually
// get worn down. This is what keeps the game from going on forever.
const WEEKLY_PRESSURE = { stability: -2, leadership: -2, audit: -2, sanity: -3 };
const PRESSURE_GROWTH_EVERY = 4;  // weeks
const PRESSURE_GROWTH = 0.5;      // +50% each time

function weeklyPressure(week) {
  const level = 1 + Math.floor((week - 2) / PRESSURE_GROWTH_EVERY) * PRESSURE_GROWTH;
  const fx = {};
  for (const m in WEEKLY_PRESSURE) fx[m] = Math.round(WEEKLY_PRESSURE[m] * level);
  return fx;
}

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
    deck: shuffle([...RANDOM_POOL]), // RFCs waiting to be put in a queue
    followUpsScheduled: new Set(),   // ids of follow-ups already lined up
    // RFCs coming back in a later week (sent back, deferred, or
    // returning as emergencies): { rfc, dueWeek }
    returning: [],
    queue: [],           // this week's RFCs to review
    currentIndex: 0,     // which RFC in the queue we're looking at
    // Every triage decision ever made: { week, rfc, decision, ... }
    history: [],
    nextIncidentNumber: 1042,
    // RFCs placed ON HOLD during a freeze; they return in the first
    // week without a freeze.
    onHold: [],
    // Random event state:
    freeze: false,        // change freeze at this week's CAB?
    promise: false,       // promised the Colonel to send everything to CAB?
    lastAuditWeek: 0,     // the auditors check everything after this week
    auditFlags: [],       // extra findings waiting for the next audit
    currentEvent: null,   // { event, suspect } while an event is on screen
    pendingNote: "",      // message to show on the next week's intro
    tutorial: false       // true during the guided first week
  };
}

// This week's triage decisions.
function decisionsThisWeek() {
  return state.history.filter(h => h.week === state.week);
}

// ---------------------------------------------------------------------
// 2. BUILDING THE WEEK'S QUEUE
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
// like "FW-002-R1". baseId is always the original id.
function baseId(rfc) {
  return rfc.baseId || rfc.id;
}

function drawQueue() {
  // 1. RFCs due back this week go first, emergencies on top.
  const due = state.returning.filter(r => r.dueWeek <= state.week);
  state.returning = state.returning.filter(r => r.dueWeek > state.week);
  const queue = due.map(r => r.rfc)
    .sort((a, b) => (b.type === "Emergency") - (a.type === "Emergency"));

  // Changes on hold come back as soon as there's no freeze.
  if (!state.freeze) {
    queue.push(...state.onHold);
    state.onHold = [];
  }

  // 2. Top up with fresh RFCs. When the deck runs out, reshuffle the
  //    whole pool so the game can keep going.
  const growth = Math.floor(state.week / 8);
  const size = Math.max(queue.length, Math.min(MAX_QUEUE_SIZE, MIN_RFCS_PER_WEEK + growth +
    Math.floor(Math.random() * (MAX_RFCS_PER_WEEK - MIN_RFCS_PER_WEEK + 1))));

  // Don't deal an RFC if a version of it is already in this queue
  // or is waiting to come back later.
  const isBlocked = rfc =>
    queue.some(q => baseId(q) === rfc.id) ||
    state.returning.some(r => baseId(r.rfc) === rfc.id) ||
    state.onHold.some(held => baseId(held) === rfc.id);

  while (queue.length < size) {
    if (state.deck.length === 0) {
      state.deck = shuffle(RANDOM_POOL.filter(rfc => !isBlocked(rfc)));
    }
    const rfc = state.deck.pop();
    if (!isBlocked(rfc)) queue.push(rfc);
  }
  return queue;
}

// ---------------------------------------------------------------------
// 3. RULES
// ---------------------------------------------------------------------

// 3a. READINESS. How well prepared does an RFC look? This only uses
//     what's VISIBLE on the card: the rollback plan and testing evidence.
//       rollback: solid 2, weak 1, missing 0
//       testing:  yes 2,   partial 1, none 0
//     So the score goes from 0 (nothing) to 4 (fully prepared).
const ROLLBACK_POINTS = { solid: 2, weak: 1, missing: 0 };
const TESTING_POINTS = { yes: 2, partial: 1, none: 0 };

function readinessScore(rfc) {
  return ROLLBACK_POINTS[rfc.rollback] + TESTING_POINTS[rfc.testing];
}

// Is it ready for the CAB? Returns "ready", "borderline" or "notReady".
//  - Emergency changes always go forward (they can't wait).
//  - A Standard change is only valid if it names a catalogue entry AND
//    is fully prepared (score 4). If not, it isn't really standard and
//    should be resubmitted as Normal.
//  - Normal changes: 3-4 ready, 2 borderline, 0-1 not ready.
function assessReadiness(rfc) {
  const score = readinessScore(rfc);
  if (rfc.type === "Emergency") return "ready";
  if (rfc.type === "Standard") return (score === 4 && rfc.catalogueId) ? "ready" : "notReady";
  if (score >= 3) return "ready";
  if (score === 2) return "borderline";
  return "notReady";
}

// Was the Change Manager's call a good one? (Used for triage accuracy.)
function wasGoodCall(h) {
  const isEmergency = h.rfc.type === "Emergency";
  if (h.decision === "hold") return !isEmergency;           // hold is right in a freeze, except for emergencies
  if (h.freezeViolation) return false;                      // sent to CAB during a freeze
  if (h.assessment === "borderline") return true;           // either call is defensible
  if (h.decision === "ready") return h.assessment === "ready";
  return h.assessment === "notReady";                       // sent back
}

// 3b. THE CAB VOTE on a Normal change you sent forward.
//     Chance of approval by readiness score 0..4, plus a bonus if the
//     requester has clout (the Colonel's office gets its way more often).
const APPROVAL_CHANCE = [0.10, 0.25, 0.50, 0.80, 0.95];
const CLOUT_BONUS = { High: 0.20, Medium: 0.05, Low: 0 };
const ECAB_APPROVAL_CHANCE = { prepared: 0.95, unprepared: 0.75 };

// Meter changes from the CAB meeting itself.
const CAB_FX = {
  approved: { leadership: 2 },             // requester is happy
  rejected: { leadership: -2 },            // requester isn't
  deferred: { leadership: -1 },            // a delay
  standard: { sanity: 1 },                 // no board time needed
  ecab: { stability: 2 }                   // emergency fixed fast
};
// Your credibility with the board, based on what you sent them.
const CREDIBILITY_FX = {
  ready: { audit: 1 },
  borderline: {},
  notReady: { audit: -4, sanity: -3, leadership: -2 }
};
const FREEZE_VIOLATION_FX = { leadership: -6, audit: -4 };

// Decide what the CAB does with one forwarded RFC.
// Returns { outcome, label, style, fx, comment } and whether it gets implemented.
function cabVote(h) {
  const rfc = h.rfc;
  const person = CHARACTERS[rfc.requester];
  const fx = {};

  // The guided week is predictable so the lessons land: ready changes
  // are approved, unready ones rejected, emergencies go through.
  if (state.tutorial) {
    if (rfc.type === "Standard") {
      addEffects(fx, CAB_FX.standard);
      return { outcome: "standard", label: "Logged as Standard (no CAB)", style: "good", fx,
        comment: pickRandom(CAB_COMMENTS.standardLogged), implement: true };
    }
    if (rfc.type === "Emergency") {
      addEffects(fx, CAB_FX.ecab);
      return { outcome: "approved", label: "Approved by ECAB", style: "good", fx,
        comment: `${pickRandom(CAB_COMMENTS.ecab)} ${person.reactions.approve}`, implement: true };
    }
    addEffects(fx, CREDIBILITY_FX[h.assessment]);
    if (h.assessment === "notReady") {
      addEffects(fx, CAB_FX.rejected);
      return { outcome: "rejected", label: "Rejected by CAB", style: "warn", fx,
        comment: `${pickRandom(CAB_COMMENTS.poorlyPrepared)} ${person.reactions.reject}`, implement: false };
    }
    addEffects(fx, CAB_FX.approved);
    return { outcome: "approved", label: "Approved by CAB", style: "good", fx,
      comment: `${pickRandom(CAB_COMMENTS.wellPrepared)} ${person.reactions.approve}`, implement: true };
  }

  // Sent forward during a freeze: pulled from the agenda and held.
  if (state.freeze && rfc.type !== "Emergency") {
    addEffects(fx, FREEZE_VIOLATION_FX);
    return { outcome: "pulled", label: "Pulled: change freeze", style: "bad", fx,
      comment: pickRandom(CAB_COMMENTS.freezePulled), implement: false };
  }

  // Standard changes are pre-authorized: logged, never voted on.
  if (rfc.type === "Standard") {
    addEffects(fx, CAB_FX.standard);
    return { outcome: "standard", label: "Logged as Standard (no CAB)", style: "good", fx,
      comment: pickRandom(CAB_COMMENTS.standardLogged), implement: true };
  }

  // Emergency changes go to the Emergency CAB.
  if (rfc.type === "Emergency") {
    const chance = readinessScore(rfc) >= 2 ? ECAB_APPROVAL_CHANCE.prepared : ECAB_APPROVAL_CHANCE.unprepared;
    if (Math.random() < chance) {
      addEffects(fx, CAB_FX.ecab);
      return { outcome: "approved", label: "Approved by ECAB", style: "good", fx,
        comment: `${pickRandom(CAB_COMMENTS.ecab)} ${person.reactions.approve}`, implement: true };
    }
    addEffects(fx, CAB_FX.rejected);
    return { outcome: "rejected", label: "Rejected by ECAB", style: "warn", fx,
      comment: `${pickRandom(CAB_COMMENTS.ecab)} The board isn't convinced it's safe. ${person.reactions.reject}`,
      implement: false };
  }

  // Normal change: the board votes. How it reads the RFC also reflects on you.
  addEffects(fx, CREDIBILITY_FX[h.assessment]);
  const boardComment = pickRandom(CAB_COMMENTS[{
    ready: "wellPrepared", borderline: "borderline", notReady: "poorlyPrepared"
  }[h.assessment]]);

  const chance = Math.min(0.98, APPROVAL_CHANCE[readinessScore(rfc)] + CLOUT_BONUS[person.clout]);
  if (Math.random() < chance) {
    addEffects(fx, CAB_FX.approved);
    return { outcome: "approved", label: "Approved by CAB", style: "good", fx,
      comment: `${boardComment} ${person.reactions.approve}`, implement: true };
  }
  // Not approved: well-prepared RFCs get deferred for a small fix;
  // poorly prepared ones are usually rejected outright.
  if (h.assessment === "ready" || Math.random() < 0.4) {
    addEffects(fx, CAB_FX.deferred);
    return { outcome: "deferred", label: "Deferred by CAB", style: "warn", fx,
      comment: `${boardComment} The board wants more information before deciding.`, implement: false };
  }
  addEffects(fx, CAB_FX.rejected);
  return { outcome: "rejected", label: "Rejected by CAB", style: "warn", fx,
    comment: `${boardComment} ${person.reactions.reject}`, implement: false };
}

// 3c. IMPLEMENTATION: what ACTUALLY happens to an approved change.
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

// Every result on the results screen is a "report". style = colour:
// "bad" (red), "warn" (yellow), "good" (green), "info" (grey).
function makeReport(rfc, outcome, label, style, text, fx, extra = {}) {
  return { number: null, rfc, outcome, label, style, text: fillIn(text, rfc), fx, ...extra };
}

// Roll the dice for one implemented RFC and build its incident report.
function resolveImplementation(rfc) {
  // Nothing breaks in the guided week (except by forwarding junk, which
  // the board rejects anyway).
  const isOutage = !state.tutorial && Math.random() < chanceOfOutage(rfc);

  if (isOutage) {
    const severity = OUTAGE_SEVERITY[rfc.rollback];
    return makeReport(rfc, "outage", severity.label + " outage", "bad",
      rfc.outageReport || genericReport("outage", rfc), severity.fx,
      { number: "INC" + state.nextIncidentNumber++, duration: severity.duration });
  }

  return makeReport(rfc, "success", "Successful change", "good",
    rfc.successReport || genericReport("success", rfc), SUCCESS_FX);
}

// 3d. A change that DIDN'T go ahead (rejected by the board, or a ready
//     change you sent back) can come back as an Emergency next week if
//     the underlying problem gets worse.
const NO_FX = { stability: 0, leadership: 0, audit: 0, sanity: 0 };
const EMERGENCY_RETURN_FX = { stability: -6, leadership: -4, audit: 0, sanity: -3 };

function makeEmergencyReturn(rfc, why) {
  const { reason, ...changes } = rfc.returnsAsEmergency;
  const emergency = {
    ...rfc,
    ...changes,
    type: "Emergency",
    id: baseId(rfc) + "-E",
    baseId: baseId(rfc),
    returnsAsEmergency: null, // it can't turn into an emergency twice
    returnNote: `Back as an EMERGENCY. ${why}`,
    returnStyle: "bad"
  };
  state.returning.push({ rfc: emergency, dueWeek: state.week + 1 });
  // { ...X } makes a copy, so adding to this report's numbers later
  // can't accidentally change the shared constant.
  return makeReport(rfc, "emergency", "Problem got worse", "bad", reason, { ...EMERGENCY_RETURN_FX });
}

// What happens after the CAB rejects a change.
const EMERGENCY_RETURN_CHANCE = 0.6;
const ESCALATION_CHANCE = { High: 0.7, Medium: 0.4, Low: 0.15 }; // by requester's clout
const ESCALATION_FX = { leadership: -5, sanity: -2 };
const DODGED_FX = { stability: 2, audit: 2, sanity: 2 };

function resolveCabRejection(rfc) {
  const person = CHARACTERS[rfc.requester];
  if (rfc.returnsAsEmergency && Math.random() < EMERGENCY_RETURN_CHANCE) {
    return makeEmergencyReturn(rfc, "The CAB rejected this last week and the problem got worse.");
  }
  if (Math.random() < ESCALATION_CHANCE[person.clout]) {
    return makeReport(rfc, "escalation", "Escalated over the CAB's head", "warn",
      rfc.rejectedReport || pickRandom(GENERIC_REPORTS.escalation), ESCALATION_FX);
  }
  if (rfc.hiddenRisk === "High") {
    return makeReport(rfc, "dodged", "Bullet dodged", "good",
      pickRandom(GENERIC_REPORTS.dodged), DODGED_FX);
  }
  return null; // the requester accepted it quietly
}

// 3e. SENT BACK (by you as "not ready", or deferred by the CAB).
//     It returns next week, improved or not depending on the requester.
const IMPROVE_CHANCE = { High: 0.9, Medium: 0.5, Low: 0.2 }; // by requester's followThrough
const MAX_RESUBMISSIONS = 2;  // sent back a 3rd time and they give up
const WITHDRAWN_FX = { leadership: -4, sanity: -2 };

// One step better: none -> partial -> yes, missing -> weak -> solid.
const BETTER_TESTING = { none: "partial", partial: "yes", yes: "yes" };
const BETTER_ROLLBACK = { missing: "weak", weak: "solid", solid: "solid" };

// Queue the resubmitted copy for next week. Returns false if they gave up.
function queueResubmission(rfc, whyBack) {
  const person = CHARACTERS[rfc.requester];
  const attempts = rfc.resubmissions || 0;
  if (attempts >= MAX_RESUBMISSIONS) return false;

  let resubmitted = { ...rfc };
  let note;
  if (Math.random() < IMPROVE_CHANCE[person.followThrough]) {
    resubmitted.testing = BETTER_TESTING[rfc.testing];
    resubmitted.rollback = BETTER_ROLLBACK[rfc.rollback];
    // Hand-written documents described the OLD version, so let the
    // generator write fresh ones that match the improved quality.
    delete resubmitted.artifacts;
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
  resubmitted.returnNote = `Resubmitted (attempt ${attempts + 2}). ${whyBack} ${fillIn(note, rfc)}`;
  resubmitted.returnStyle = "info";
  state.returning.push({ rfc: resubmitted, dueWeek: state.week + 1 });
  return true;
}

// What sending an RFC back says about YOUR judgement.
const SENDBACK_FX = {
  emergency: { stability: -5, leadership: -4 },  // emergencies can't wait for paperwork
  ready: { leadership: -4, sanity: -1 },         // it was fine: pointless delay
  borderline: { leadership: -1, audit: 1 },      // fair enough
  notReady: { audit: 2, sanity: 1 }              // good catch
};
const HIGH_CLOUT_EXTRA_FX = { leadership: -3 };  // annoying the Colonel's office costs more
const BROKEN_PROMISE_FX = { leadership: -4, sanity: -2 };
const DELAY_EMERGENCY_CHANCE = 0.5;              // ready change sent back -> problem may get worse

function resolveSendBack(h) {
  const rfc = h.rfc;
  const fx = {};
  if (state.promise) addEffects(fx, BROKEN_PROMISE_FX);

  if ((rfc.resubmissions || 0) >= MAX_RESUBMISSIONS) {
    addEffects(fx, WITHDRAWN_FX);
    return makeReport(rfc, "withdrawn", "Withdrawn by requester", "warn",
      pickRandom(RESUBMISSION_NOTES.withdrawn), fx);
  }

  if (rfc.type === "Emergency") {
    addEffects(fx, SENDBACK_FX.emergency);
    queueResubmission(rfc, "You sent this emergency back last week.");
    return makeReport(rfc, "resubmit", "Emergency delayed", "bad",
      "The emergency didn't wait for paperwork. {system} stayed broken another week while {name} filled in forms.", fx);
  }

  if (h.assessment === "ready") {
    addEffects(fx, SENDBACK_FX.ready);
    if (CHARACTERS[rfc.requester].clout === "High") addEffects(fx, HIGH_CLOUT_EXTRA_FX);
    // While it waited, the problem it was fixing might have got worse.
    if (rfc.returnsAsEmergency && Math.random() < DELAY_EMERGENCY_CHANCE) {
      const report = makeEmergencyReturn(rfc, "You sent it back last week, and the problem got worse while it waited.");
      addEffects(report.fx, fx);
      return report;
    }
    queueResubmission(rfc, "You sent it back last week.");
    return makeReport(rfc, "resubmit", "Sent back, but it was ready", "warn",
      "{name} points out, correctly, that the RFC had a rollback plan, test evidence and everything the board asks for.", fx);
  }

  if (h.assessment === "borderline") {
    addEffects(fx, SENDBACK_FX.borderline);
    queueResubmission(rfc, "You sent it back last week for more detail.");
    return makeReport(rfc, "resubmit", "Sent back for more detail", "info",
      "A fair call either way. {name} will tighten it up and resubmit.", fx);
  }

  addEffects(fx, SENDBACK_FX.notReady);
  queueResubmission(rfc, "You sent it back last week as not ready.");
  const why = rfc.type === "Standard"
    ? "It didn't meet its catalogue entry, so it isn't really a standard change. Good catch."
    : "It wasn't ready for the board. Good catch.";
  return makeReport(rfc, "resubmit", "Not ready: good catch", "good", why, fx);
}

// Requester's change came back from the board deferred.
function resolveDeferral(rfc) {
  if (!queueResubmission(rfc, "The CAB deferred it last week.")) {
    return makeReport(rfc, "withdrawn", "Withdrawn by requester", "warn",
      pickRandom(RESUBMISSION_NOTES.withdrawn), WITHDRAWN_FX);
  }
  return null;
}

// 3e-2. FOLLOW-UPS. Some RFCs only make sense after another change,
//       e.g. "same firmware the XO wanted, but after the visit". In the
//       data they have  after: { id: "UP-081", when: "seen" }  and they
//       arrive the WEEK AFTER that change, if the condition was met:
//         seen         - the change came up for review (any decision)
//         implemented  - it actually went in
//         outage       - it went in and caused an incident
//       (FOLLOW_UP_CONDITIONS, the list of allowed "when" values, is at the
//       top of the file because the data checker needs it first.)

// Every RFC with "after", grouped by the id it follows on from.
const FOLLOW_UPS = {};
RFCS.forEach(rfc => {
  if (!rfc.after) return;
  (FOLLOW_UPS[rfc.after.id] = FOLLOW_UPS[rfc.after.id] || []).push(rfc);
});

function followUpConditionMet(h, when) {
  if (when === "seen") return true;
  if (when === "implemented") return Boolean(h.implementation);
  if (when === "outage") {
    return Boolean((h.implementation && h.implementation.outcome === "outage") || h.collisions);
  }
  return false;
}

// Called after each CAB with that week's decisions.
function scheduleFollowUps(entries) {
  entries.forEach(h => {
    const prerequisite = baseId(h.rfc);
    (FOLLOW_UPS[prerequisite] || []).forEach(followUp => {
      if (state.followUpsScheduled.has(followUp.id)) return;   // only ever once
      if (brokenRfcs.includes(followUp)) return;
      if (!followUpConditionMet(h, followUp.after.when)) return;
      state.followUpsScheduled.add(followUp.id);
      state.returning.push({
        rfc: { ...followUp, returnNote: `Follow-up to ${prerequisite}: ${h.rfc.title}`, returnStyle: "info" },
        dueWeek: state.week + 1
      });
    });
  });
}

// 3f. ON HOLD during a freeze: it waits, unchanged, and returns in the
//     first week without a freeze.
const HOLD_FX = { leadership: -1, audit: 2 };
const HOLD_EMERGENCY_FX = { stability: -4, leadership: -3 };

function placeOnHold(rfc, why) {
  state.onHold.push({
    ...rfc,
    baseId: baseId(rfc),
    returnNote: `Released from hold. ${why}`,
    returnStyle: "info"
  });
}

function resolveHold(h) {
  const rfc = h.rfc;
  placeOnHold(rfc, `Placed on hold during the Week ${state.week} change freeze.`);
  if (rfc.type === "Emergency") {
    return makeReport(rfc, "held", "Emergency put on hold", "bad",
      "Emergency changes are allowed through a freeze. Holding this one means {system} stays broken.", HOLD_EMERGENCY_FX);
  }
  return makeReport(rfc, "held", "On hold", "info",
    "{name}'s change is parked until the freeze lifts. It will return automatically.", HOLD_FX);
}

// 3g. COLLISIONS. Everything implemented this week goes into the same
//     change window. Two changes touching the same system might clash.
const COLLISION_CHANCE = 0.4;  // per pair of changes sharing a system
const COLLISION_FX = { stability: -8, leadership: -4, audit: -3, sanity: -4 };

// Which systems do two RFCs have in common? (empty list = none)
function sharedSystems(a, b) {
  return a.systems.filter(system => b.systems.includes(system));
}

// entries = this week's history entries that were implemented.
function resolveCollisions(entries) {
  const reports = [];

  // Check every PAIR once: (1st, 2nd), (1st, 3rd), (2nd, 3rd), ...
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i].rfc;
      const b = entries[j].rfc;
      const shared = sharedSystems(a, b);
      if (shared.length === 0 || Math.random() >= COLLISION_CHANCE) continue;

      // Some pairs of people have their own special lines (a rivalry).
      const samePerson = a.requester === b.requester;
      const rivalry = (COLLISION_REPORTS.rivalries || []).find(r =>
        r.between.includes(a.requester) && r.between.includes(b.requester) && !samePerson);
      const lines = rivalry ? rivalry.lines
        : samePerson ? COLLISION_REPORTS.samePerson : COLLISION_REPORTS.twoPeople;
      const text = pickRandom(lines)
        .replaceAll("{system}", shared[0])
        .replaceAll("{a}", shortNameOf(a.requester))
        .replaceAll("{b}", shortNameOf(b.requester));

      const report = makeReport(b, "collision", "Change collision", "bad", text, COLLISION_FX, {
        number: "INC" + state.nextIncidentNumber++,
        duration: "2 hours",
        systemsHit: shared,
        source: `Caused by ${a.id} + ${b.id} going in during the same change window`
      });
      // Remember the collision on the later change's history entry.
      entries[j].collisions = (entries[j].collisions || []).concat(report);
      reports.push(report);
    }
  }
  return reports;
}

// Outages = changes that broke + collisions.
function countOutages(entries) {
  const broken = entries.filter(h => h.implementation && h.implementation.outcome === "outage").length;
  const collisions = entries.reduce((total, h) => total + (h.collisions ? h.collisions.length : 0), 0);
  return broken + collisions;
}

function triageAccuracy(entries) {
  if (entries.length === 0) return 1;
  return entries.filter(wasGoodCall).length / entries.length;
}

// 3h. End-of-week performance rating. Checked top to bottom: the
//     first rule that matches wins. Titles and jokes live in data.js.
function getPerformanceRating(entries) {
  const total = entries.length || 1;
  const count = d => entries.filter(h => h.decision === d).length;
  const sendBackRate = count("sendBack") / total;
  const readyRate = count("ready") / total;
  const junkForwarded = entries.filter(h => h.decision === "ready" && h.assessment === "notReady").length;
  const outages = countOutages(entries);
  const accuracy = triageAccuracy(entries);

  if (outages >= 3) return PERFORMANCE_RATINGS.incidentFactory;
  if (sendBackRate >= 0.7) return PERFORMANCE_RATINGS.wallOfNo;
  if (readyRate >= 0.85 && junkForwarded >= 2) return PERFORMANCE_RATINGS.rubberStamp;
  if (accuracy >= 0.85 && outages <= 1) return PERFORMANCE_RATINGS.actuallyGood;
  if (accuracy >= 0.65) return PERFORMANCE_RATINGS.cautious;
  return PERFORMANCE_RATINGS.mediocre;
}

// 3h-2. CHRIS'S WEEKLY DEBRIEF. Chris (the Configuration Manager, in
//       data.js as MENTOR) looks back over the week's calls and picks
//       the most useful things to tell you. The checks below run in order
//       of importance; Chris mentions up to MAX_TIPS of them, and each
//       RFC is only mentioned once.
const MAX_TIPS = 3;
const LOW_METER = 30;  // below this, Chris warns you about the meter

function chrisDebrief(entries) {
  const outage = h => h.implementation && h.implementation.outcome === "outage";
  const clout = h => CHARACTERS[h.rfc.requester].clout;

  // Each check: [tip key, which of this week's entries it's about].
  const checks = [
    ["emergencyDelayed", entries.filter(h => h.rfc.type === "Emergency" && h.decision !== "ready")],
    ["freezeViolation", entries.filter(h => h.freezeViolation)],
    ["fakeStandard", entries.filter(h => h.decision === "ready" && h.rfc.type === "Standard" && h.assessment === "notReady")],
    ["rankPressure", entries.filter(h => h.decision === "ready" && h.rfc.type === "Normal" && h.assessment === "notReady" && clout(h) === "High")],
    ["forwardedJunk", entries.filter(h => h.decision === "ready" && h.rfc.type === "Normal" && h.assessment === "notReady" && clout(h) !== "High")],
    ["sentBackReady", entries.filter(h => h.decision === "sendBack" && h.rfc.type !== "Emergency" && h.assessment === "ready")],
    // Forwarded without opening the rollback plan or test results that were attached.
    ["didntReview", entries.filter(h => h.decision === "ready" && h.rfc.type !== "Emergency" && h.attached &&
      ["rollback", "testing"].some(k => h.attached.includes(k) && !h.reviewed.includes(k)))],
    ["collisions", entries.filter(h => h.collisions)],
    ["badRollback", entries.filter(h => outage(h) && h.rfc.rollback !== "solid")],
    ["partialTesting", entries.filter(h => outage(h) && h.assessment === "borderline")],
    ["goodProcessBadLuck", entries.filter(h => outage(h) && h.assessment === "ready")]
  ];

  const tips = [];
  const mentioned = new Set();
  let mistakes = 0;
  checks.forEach(([key, list], index) => {
    const fresh = list.filter(h => !mentioned.has(h.rfc.id));
    if (fresh.length === 0) return;
    if (index <= 5) mistakes++;            // the first six checks are judgement calls
    if (tips.length >= MAX_TIPS) return;
    fresh.forEach(h => mentioned.add(h.rfc.id));
    const ids = fresh.slice(0, 3).map(h => h.rfc.id).join(", ") + (fresh.length > 3 ? " and others" : "");
    tips.push(pickRandom(MENTOR.tips[key]).replaceAll("{ids}", ids).replaceAll("{count}", fresh.length));
  });

  // A clean week gets praise first.
  if (mistakes === 0 && countOutages(entries) === 0) tips.unshift(pickRandom(MENTOR.tips.perfectWeek));

  // Warn about the lowest meter if it's getting dangerous.
  const lowest = Object.keys(state.meters).sort((a, b) => state.meters[a] - state.meters[b])[0];
  const lowKey = { stability: "lowStability", leadership: "lowLeadership", audit: "lowAudit", sanity: "lowSanity" }[lowest];
  if (state.meters[lowest] < LOW_METER && tips.length < MAX_TIPS) tips.push(pickRandom(MENTOR.tips[lowKey]));

  // Room for one more? Add a bit of general wisdom.
  if (tips.length < MAX_TIPS) tips.push(pickRandom(MENTOR.general));

  // The week in numbers.
  const incidents = countOutages(entries);
  const summary = MENTOR.summaryLine
    .replaceAll("{reviewed}", entries.length)
    .replaceAll("{forwarded}", entries.filter(h => h.decision === "ready").length)
    .replaceAll("{implemented}", entries.filter(h => h.implementation).length)
    .replaceAll("{incidents}", incidents === 0 ? "no incidents" : incidents === 1 ? "1 incident" : `${incidents} incidents`)
    .replaceAll("{sentBack}", entries.filter(h => h.decision === "sendBack").length)
    .replaceAll("{accuracy}", Math.round(100 * triageAccuracy(entries)));

  // List the incident numbers, the way they'd appear in the CMDB.
  const incidentNumbers = [];
  entries.forEach(h => {
    if (outage(h)) incidentNumbers.push(`${h.implementation.number} (${h.rfc.id})`);
    (h.collisions || []).forEach(c => incidentNumbers.push(`${c.number} (collision)`));
  });

  return {
    // After the guided week, Chris sums up what you've learned instead.
    opener: state.tutorial ? TUTORIAL.wrapUp : pickRandom(MENTOR.openers),
    summary,
    incidents: incidentNumbers,
    tips,
    signoff: pickRandom(MENTOR.signoffs)
  };
}

// 3i. RANDOM EVENTS between weeks. The events themselves (text and
//     choices) live in data.js; the special rules live here.
const EVENT_CHANCE = 0.6;  // chance of an event before each week
const AUDIT_PENALTY_PER_FINDING = 5;
const AUDIT_MAX_PENALTY = 25;
const CLEAN_AUDIT_FX = { leadership: 2, audit: 10, sanity: 3 };

// What would the inspectors find, looking at everything since their last visit?
function auditFindings() {
  const findings = [];
  state.history
    .filter(h => h.week > state.lastAuditWeek && h.decision === "ready")
    .forEach(h => {
      if (h.freezeViolation) findings.push(`${h.rfc.id} was sent to CAB during a change freeze`);
      if (!h.implementation) return;
      if (h.cabOutcome === "standard" && h.assessment === "notReady") {
        findings.push(`${h.rfc.id} was logged as a standard change but didn't meet its catalogue entry`);
      }
      if (h.rfc.rollback === "missing") findings.push(`${h.rfc.id} was implemented with no rollback plan`);
      if (h.rfc.testing === "none") findings.push(`${h.rfc.id} was implemented with no testing evidence`);
    });
  return findings.concat(state.auditFlags);
}

// Replace {name} in event text with the event's suspect.
function fillEventText(text) {
  const suspect = state.currentEvent.suspect;
  if (!suspect) return text;
  return text.replaceAll("{name}", shortNameOf(suspect));
}

// Add one set of meter changes onto another (both are { meter: number }).
function addEffects(target, more) {
  for (const m in more) target[m] = (target[m] || 0) + more[m];
}

// The player picked an event choice: work out its effects, switch on
// any lasting rule, and return what to show on screen.
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
    // The slate is wiped clean after an honest inspection.
    state.lastAuditWeek = state.week - 1;
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
// The name used in report text, e.g. "SSG Kowalski".
function shortNameOf(characterKey) {
  const c = CHARACTERS[characterKey];
  return c.shortName || c.name.split(" ")[0];
}
// Replace {system} and {name} placeholders in report text.
function fillIn(text, rfc) {
  return text.replaceAll("{system}", rfc.systems[0]).replaceAll("{name}", shortNameOf(rfc.requester));
}

// Which category an RFC belongs to, from its id prefix ("FW-012" -> "firewall").
function categoryOf(rfc) {
  return RFC_CATEGORIES[baseId(rfc).split("-")[0]];
}
// Pick a generic report ("outage" or "success") suited to the RFC's category.
function genericReport(kind, rfc) {
  const pool = GENERIC_REPORTS[kind];
  return pickRandom((pool[categoryOf(rfc)] || []).concat(pool.any));
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

// The screen at the start of each week.
function renderWeekIntro(extraNote = "") {
  const isWeekOne = state.week === 1;
  document.getElementById("intro-title").textContent = `Week ${state.week} · Change review`;
  document.getElementById("intro-text").textContent = isWeekOne
    ? TUTORIAL.intro
    : `Your queue has new requests for change. Review each one and decide whether it's ready ` +
      `for ${CAB_DAY}'s CAB.`;
  document.getElementById("intro-note").textContent = extraNote;

  // Week 1 offers the guided week, with a way to skip it.
  document.getElementById("btn-start-guided").classList.toggle("hidden", !isWeekOne);
  const startButton = document.getElementById("btn-start");
  startButton.textContent = isWeekOne ? "Skip it: go straight to a real week" : "Open the change queue";
  startButton.className = isWeekOne ? "ghost" : "primary";

  // Remind the player about any rules from random events.
  const alerts = [];
  if (state.freeze) alerts.push("❄ Change freeze this week: only Emergency changes may go to the CAB. Place everything else ON HOLD.");
  if (state.onHold.length > 0) {
    const n = state.onHold.length;
    const what = n === 1 ? "1 change is" : `${n} changes are`;
    alerts.push(state.freeze
      ? `${what} still on hold, waiting for the freeze to lift.`
      : `The freeze has lifted: ${what} coming off hold this week.`);
  }
  if (state.promise) alerts.push("You promised the Colonel's office to send everything to CAB. Sending RFCs back will cost extra.");
  document.getElementById("intro-alert").textContent = alerts.join(" ");
  // The "how to play" text only needs showing at the very start.
  const isFirstWeek = state.week === 1;
  document.getElementById("intro-rules").classList.toggle("hidden", !isFirstWeek);
  document.getElementById("intro-tip").classList.toggle("hidden", !isFirstWeek);
}

// Pick a colour for a field value: green = good, yellow = meh, red = bad.
function tag(text, colour) {
  return `<span class="tag ${colour}">${text}</span>`;
}
const RISK_COLOURS = { Low: "good", Medium: "warn", High: "bad" };
const ROLLBACK_COLOURS = { solid: "good", weak: "warn", missing: "bad" };
const TESTING_COLOURS = { yes: "good", partial: "warn", none: "bad" };
const TYPE_COLOURS = { Standard: "good", Normal: "info", Emergency: "bad" };

// A coloured circle with the character's initials, e.g. "ER" for
// "Capt. Elena Reyes" (the last two words, so ranks are skipped).
// Each character gets a fixed colour based on their position in data.js.
const AVATAR_COLOURS = ["#2f5fa7", "#2f8f4e", "#a2452f", "#7a4fb0", "#b97f0f",
  "#1f8a8a", "#b0457a", "#4a6b2f", "#5a5fc0", "#8a5a2f", "#3d7cb0", "#6b5a8a",
  "#c0392b", "#7d6b2f"];

function renderAvatar(characterKey) {
  const initials = CHARACTERS[characterKey].name
    .split(" ").slice(-2).map(word => word[0]).join("");
  const position = Object.keys(CHARACTERS).indexOf(characterKey);
  const colour = AVATAR_COLOURS[position % AVATAR_COLOURS.length];
  return `<span class="avatar" style="background:${colour}" aria-hidden="true">${initials}</span>`;
}

// The "Ready" button's wording depends on where the change would go.
function readyButtonLabel(rfc) {
  if (rfc.type === "Standard") return "Ready: log as Standard (no CAB)";
  if (rfc.type === "Emergency") return "Ready: send to Emergency CAB";
  return "Ready for CAB";
}

// ---------------------------------------------------------------------
// GUIDED WEEK: Chris's coaching panel above the card (data/tutorial.js).
// ---------------------------------------------------------------------
function tutorialCardFor(rfc) {
  return state.tutorial ? TUTORIAL.cards.find(card => card.rfc.id === rfc.id) : null;
}

function renderCoach(rfc) {
  const coach = document.getElementById("coach");
  const guide = tutorialCardFor(rfc);
  if (!guide) {
    coach.innerHTML = "";
    coach.classList.add("hidden");
    return;
  }
  const steps = guide.steps.map(step =>
    `<li ${step.open ? `data-open="${step.open}"` : ""}>${step.text}</li>`).join("");
  // Chris's explanation of the change type, before the steps.
  const lesson = guide.lesson ? `
    <div class="coach-lesson">
      <p class="coach-lesson-heading">${guide.lesson.heading}</p>
      ${guide.lesson.paragraphs.map(p => `<p>${p}</p>`).join("")}
    </div>` : "";
  coach.innerHTML = `
    <div class="mentor-head">
      <span class="avatar mentor-avatar" aria-hidden="true">${MENTOR.name[0]}</span>
      <div>
        <p class="mentor-name">${MENTOR.name} <span>&middot; guided week, RFC ${state.currentIndex + 1} of ${state.queue.length}</span></p>
      </div>
    </div>
    ${lesson}
    <p class="coach-steps-title">Let's look at this one together</p>
    <ol class="coach-steps">${steps}</ol>
    <p class="coach-feedback hidden"></p>
  `;
  coach.classList.remove("hidden");
  updateCoachTicks();
}

// Tick off each step whose document has been opened.
function updateCoachTicks() {
  document.querySelectorAll("#coach .coach-steps li[data-open]").forEach(li => {
    li.classList.toggle("done", openedArtifacts.has(li.dataset.open));
  });
}

// After a decision, Chris tells you whether it was the right call.
function showCoachFeedback(rfc, decision) {
  const guide = tutorialCardFor(rfc);
  if (!guide) return;
  const right = decision === guide.recommend;
  const feedback = document.querySelector("#coach .coach-feedback");
  feedback.textContent = `"${right ? guide.right : guide.wrong}"`;
  feedback.className = `coach-feedback ${right ? "good" : "bad"}`;
}

// Build the RFC card's HTML from one RFC object.
function renderCard(rfc) {
  const person = CHARACTERS[rfc.requester];

  document.getElementById("progress").textContent =
    `Week ${state.week} · Change review · RFC ${state.currentIndex + 1} of ${state.queue.length}`;

  // Returning RFCs get a banner explaining why they're back.
  const banner = rfc.returnNote
    ? `<p class="return-note ${rfc.returnStyle}">&#8617; ${rfc.returnNote}</p>`
    : "";

  // Reminders from random events (freeze, promise).
  let status = "";
  if (state.freeze) {
    status += `<p class="status-banner">&#10052; CHANGE FREEZE: only Emergency changes may go to this week's CAB. Use <strong>Place on Hold</strong> for everything else.</p>`;
  }
  if (state.promise) {
    status += `<p class="status-banner">&#128222; You promised to send everything to CAB. Sending RFCs back will cost you.</p>`;
  }

  // In the guided week, Chris coaches you through the card.
  renderCoach(rfc);

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
      ${quickRatingsOn() ? `
      <dt>Rollback plan</dt>   <dd>${tag(rfc.rollback, ROLLBACK_COLOURS[rfc.rollback])} <small class="training">training mode</small></dd>
      <dt>Testing evidence</dt><dd>${tag(rfc.testing, TESTING_COLOURS[rfc.testing])} <small class="training">training mode</small></dd>` : ""}
      ${renderCatalogueField(rfc)}
    </dl>
    <blockquote class="justification">"${rfc.justification}"</blockquote>
    ${renderAttachments(rfc)}
    ${renderScheduleWarning(rfc)}
  `;

  // Reset the buttons and reaction text for the new card.
  document.getElementById("reaction").textContent = "";
  setDecisionButtonsEnabled(true);
  document.querySelector('[data-decision="ready"] .label').textContent = readyButtonLabel(rfc);
  // "Place on Hold" only exists while a change freeze is in effect.
  document.querySelector('[data-decision="hold"]').classList.toggle("hidden", !state.freeze);
  document.getElementById("hold-hint").classList.toggle("hidden", !state.freeze);
  document.getElementById("btn-next").classList.add("hidden");
}

// ---------------------------------------------------------------------
// ATTACHMENTS: the documents submitted with each RFC (built in
// artifacts.js). The player opens them to judge whether the RFC is ready.
// ---------------------------------------------------------------------

// Which documents the player has opened for the card on screen.
let openedArtifacts = new Set();

// Training mode: show the rollback/testing ratings on the card.
// Remembered in this browser only (localStorage), and it's fine if that fails.
function quickRatingsOn() {
  return document.getElementById("quick-ratings").checked;
}
try {
  document.getElementById("quick-ratings").checked = localStorage.getItem("cab-quick-ratings") === "on";
} catch (e) { /* storage blocked: just start with it off */ }
document.getElementById("quick-ratings").addEventListener("change", event => {
  try { localStorage.setItem("cab-quick-ratings", event.target.checked ? "on" : "off"); } catch (e) { }
  // Redraw the card on screen (keeping the stamp if a decision was made).
  const onReview = !document.getElementById("screen-meeting").classList.contains("hidden");
  const decided = document.querySelector("#rfc-card .stamp");
  if (onReview && !decided) renderCard(state.queue[state.currentIndex]);
});

function renderAttachments(rfc) {
  const buttons = getArtifacts(rfc).map((doc, i) => {
    if (!doc.html) {
      return `<span class="attachment missing">${doc.icon} ${doc.label} <em>not attached</em></span>`;
    }
    const seen = openedArtifacts.has(doc.key) ? ` <span class="seen">&#10003;</span>` : "";
    return `<button class="attachment" data-artifact="${i}">${doc.icon} ${doc.label}${seen}<kbd>${i + 1}</kbd></button>`;
  }).join("");
  return `<div class="attachments"><p class="attachments-title">Attachments</p>${buttons}</div>`;
}

function openArtifact(index) {
  const rfc = state.queue[state.currentIndex];
  const doc = getArtifacts(rfc)[index];
  if (!doc || !doc.html) return;
  openedArtifacts.add(doc.key);
  document.getElementById("artifact-title").innerHTML = `${doc.icon} ${doc.label}`;
  document.getElementById("artifact-body").innerHTML = doc.html;
  const dialog = document.getElementById("artifact-viewer");
  dialog.showModal();
  dialog.scrollTop = 0;
  updateCoachTicks();
  // Tick the attachment on the card.
  const button = document.querySelector(`#rfc-card [data-artifact="${index}"]`);
  if (button && !button.querySelector(".seen")) {
    button.querySelector("kbd").insertAdjacentHTML("beforebegin", ` <span class="seen">&#10003;</span>`);
  }
}

document.getElementById("btn-artifact-close").addEventListener("click", () => {
  document.getElementById("artifact-viewer").close();
});
// Clicking outside the document closes it.
document.getElementById("artifact-viewer").addEventListener("click", event => {
  const box = event.currentTarget.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right ||
      event.clientY < box.top || event.clientY > box.bottom) event.currentTarget.close();
});

// "Change schedule" check: warn if this RFC touches the same system as
// something already marked ready this week, or later in the queue.
function renderScheduleWarning(rfc) {
  const describe = other => `${other.id} (${sharedSystems(rfc, other).join(", ")})`;

  const readyClashes = decisionsThisWeek()
    .filter(h => h.decision === "ready" && sharedSystems(rfc, h.rfc).length > 0)
    .map(h => describe(h.rfc));
  const laterClashes = state.queue.slice(state.currentIndex + 1)
    .filter(other => sharedSystems(rfc, other).length > 0)
    .map(describe);

  if (readyClashes.length === 0 && laterClashes.length === 0) return "";

  let lines = "";
  if (readyClashes.length > 0) {
    lines += `<p><strong>&#9888; Schedule conflict:</strong> already marked ready for this week's ` +
      `change window: ${readyClashes.join(", ")}.</p>`;
  }
  if (laterClashes.length > 0) {
    lines += `<p><strong>&#9888; Heads up:</strong> later in your queue, touching the same ` +
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

// Build one report "ticket" for the results screen.
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

// The results screen: CAB minutes, then implementation, then the
// changes that went back to their requesters.
function renderResults(sections, totalFx) {
  const outages = sections.implementation.filter(r => r.outcome === "outage" || r.outcome === "collision").length;
  const implemented = sections.implementation.filter(r => r.outcome === "outage" || r.outcome === "success").length;

  let summary;
  if (sections.cab.length === 0) {
    summary = "You sent nothing to the CAB. The board met for four minutes and went to lunch.";
  } else if (implemented === 0) {
    summary = "Nothing was implemented this week.";
  } else if (outages === 0) {
    summary = `${implemented} change${implemented > 1 ? "s" : ""} implemented. A quiet change window: everything went in cleanly.`;
  } else {
    summary = `${implemented} change${implemented > 1 ? "s" : ""} implemented, causing ${outages} incident${outages > 1 ? "s" : ""}.`;
  }

  const section = (title, reports, empty) => `
    <h3 class="results-heading">${title}</h3>
    ${reports.length ? reports.map(renderReport).join("") : `<p class="results-empty">${empty}</p>`}
  `;

  document.getElementById("consequences-title").textContent = `Week ${state.week} · ${CAB_DAY} CAB results`;
  document.getElementById("reports").innerHTML = `
    <p class="cab-scene">${CAB_DAY}, 1000. ${pickRandom(MEETING_INTROS)}</p>
    <p><strong>${summary}</strong></p>
    ${section("CAB minutes", sections.cab, "Nothing on the agenda.")}
    ${section("Implementation", sections.implementation, "Nothing was implemented.")}
    ${section("Back with the requesters", sections.requesters, "Nothing was sent back.")}
  `;
  renderMeters(totalFx);

  const button = document.getElementById("btn-continue");
  button.textContent = isGameOver() ? "Oh no" : "See week summary";
}

const DECISION_LABELS = { ready: "Sent to CAB", sendBack: "Sent back", hold: "On hold" };
const STAMP_LABELS = { ready: "To CAB", sendBack: "Not ready", hold: "On hold" };

// Shared by the week summary and game over screen: stats + decision list.
function renderStats(entries) {
  const count = d => entries.filter(h => h.decision === d).length;
  const outages = countOutages(entries);
  const approved = entries.filter(h => h.implementation).length;
  const accuracy = Math.round(100 * triageAccuracy(entries));

  const items = entries.map(h => {
    let result = "";
    if (h.cabLabel) result += ` → ${h.cabLabel.toLowerCase()}`;
    if (h.implementation) result += ` (${h.implementation.label.toLowerCase()})`;
    if (h.collisions) result += h.collisions.length === 1 ? " + collision" : ` + ${h.collisions.length} collisions`;
    // Reveal what the documents were really showing, so the player can learn.
    result += ` <small class="truth">rollback ${h.rfc.rollback} &middot; testing ${h.rfc.testing}</small>`;
    const mark = wasGoodCall(h) ? `<span class="call good">&#10003;</span>` : `<span class="call bad">&#10007;</span>`;
    return `<li>${mark} <span class="when">Wk ${h.week}</span> <strong>${h.rfc.id}</strong> ` +
      `${h.rfc.title}: ${DECISION_LABELS[h.decision]}${result}</li>`;
  }).join("");

  return `
    <div class="stats">
      <div><span class="stat-number">${entries.length}</span>changes reviewed</div>
      <div><span class="stat-number">${count("ready")}</span>sent forward</div>
      <div><span class="stat-number">${approved}</span>implemented</div>
      <div><span class="stat-number">${count("sendBack")}</span>sent back</div>
      <div><span class="stat-number">${count("hold")}</span>on hold</div>
      <div><span class="stat-number ${outages ? "bad" : ""}">${outages}</span>outage${outages === 1 ? "" : "s"} caused</div>
      <div><span class="stat-number ${accuracy < 65 ? "bad" : ""}">${accuracy}%</span>triage accuracy</div>
    </div>
    <p class="stats-key">&#10003; = a good readiness call, &#10007; = a questionable one.</p>
    <ul class="decision-list">${items}</ul>
  `;
}

// Chris's debrief panel on the week summary screen.
function renderMentorPanel(debrief) {
  const incidents = debrief.incidents.length
    ? `<p class="mentor-incidents">Logged in the CMDB this week: ${debrief.incidents.join(", ")}.</p>`
    : "";
  return `
    <section class="mentor" aria-label="Weekly debrief from ${MENTOR.name}">
      <div class="mentor-head">
        <span class="avatar mentor-avatar" aria-hidden="true">${MENTOR.name[0]}</span>
        <div>
          <p class="mentor-name">${MENTOR.name} <span>&middot; ${MENTOR.role}</span></p>
          <p class="mentor-personality">${MENTOR.personality}</p>
        </div>
      </div>
      <p class="mentor-opener">"${debrief.opener}"</p>
      <p>${debrief.summary}</p>
      ${incidents}
      <p class="mentor-tips-title">Things to think about</p>
      <ul class="mentor-tips">${debrief.tips.map(t => `<li>${t}</li>`).join("")}</ul>
      <p class="mentor-signoff">"${debrief.signoff}"</p>
    </section>
  `;
}

function renderWeekSummary() {
  const entries = decisionsThisWeek();
  const rating = getPerformanceRating(entries);

  document.getElementById("week-title").textContent = `Week ${state.week} complete`;
  document.getElementById("week-summary").innerHTML = `
    ${renderMentorPanel(chrisDebrief(entries))}
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
    <p>You served as Change Manager for <strong>${weeks}</strong>. Your whole career:</p>
    ${renderStats(state.history)}
  `;
}

const GAME_OVER_MESSAGES = {
  stability: "The network is down. The installation is running on runners, radios and handwritten notes. The Colonel would like a word.",
  leadership: "The Colonel has replaced you as Change Manager. Your replacement is SSG Kowalski. Pray for the network.",
  audit: "The inspection team found your change records. All of them. You are now a slide in the Office of Inspections' annual training.",
  sanity: "You have submitted an RFC titled 'Retire to a remote site with no network'. You marked it ready. The CAB approved it unanimously."
};

// ---------------------------------------------------------------------
// 5. FLOW - what happens when the player clicks things.
//    intro -> review queue -> CAB results -> week summary
//          -> (maybe a random event) -> next week's intro ...
// ---------------------------------------------------------------------
function newGame() {
  resetGame();
  renderMeters();
  renderWeekIntro();
  showScreen("screen-intro");
}

// guided = true starts the guided first week with Chris.
function startReview(guided = false) {
  state.tutorial = guided === true;
  state.queue = state.tutorial
    ? TUTORIAL.cards.map(card => ({ ...card.rfc }))   // copies, so the originals stay untouched
    : drawQueue();
  state.currentIndex = 0;
  openedArtifacts = new Set();
  renderMeters();
  showScreen("screen-meeting");
  renderCard(state.queue[0]);
}

function makeDecision(decision) {
  const rfc = state.queue[state.currentIndex];
  const person = CHARACTERS[rfc.requester];
  const assessment = assessReadiness(rfc);

  // No meters move yet: the consequences arrive at the CAB.
  state.history.push({
    week: state.week, rfc, decision, assessment,
    freezeViolation: decision === "ready" && state.freeze && rfc.type !== "Emergency",
    // Which documents were attached, and which ones the player actually opened.
    attached: getArtifacts(rfc).filter(doc => doc.html).map(doc => doc.key),
    reviewed: [...openedArtifacts]
  });

  // The requester's reaction (they find out straight away if it's sent back).
  let reaction;
  if (decision === "sendBack") reaction = person.reactions.sendBack;
  else if (decision === "hold") reaction = person.reactions.hold || `${shortNameOf(rfc.requester)}'s change is parked until the freeze lifts.`;
  else if (rfc.type === "Standard") reaction = "Logged as a pre-authorized standard change. It won't go to the board.";
  else if (rfc.type === "Emergency") reaction = "Sent to the Emergency CAB. They'll convene by phone today.";
  else reaction = `Added to ${CAB_DAY}'s CAB agenda.`;
  document.getElementById("reaction").textContent = reaction;
  setDecisionButtonsEnabled(false);
  showCoachFeedback(rfc, decision);

  // Thump a rubber stamp onto the card.
  const stamp = document.createElement("div");
  stamp.className = `stamp ${decision}`;
  stamp.textContent = decision === "ready" && rfc.type === "Standard" ? "Standard"
    : decision === "ready" && rfc.type === "Emergency" ? "To ECAB"
    : STAMP_LABELS[decision];
  document.getElementById("rfc-card").appendChild(stamp);

  const isLastCard = state.currentIndex === state.queue.length - 1;
  const nextButton = document.getElementById("btn-next");
  nextButton.textContent = isLastCard ? `Send the agenda to ${CAB_DAY}'s CAB` : "Next RFC";
  nextButton.classList.remove("hidden");
}

function nextCard() {
  state.currentIndex++;
  if (state.currentIndex >= state.queue.length) {
    holdCab();
  } else {
    openedArtifacts = new Set();  // fresh card, nothing opened yet
    renderCard(state.queue[state.currentIndex]);
  }
}

// The CAB meets: vote on everything you sent, implement what's approved,
// and deal with everything you sent back or held.
function holdCab() {
  const sections = { cab: [], implementation: [], requesters: [] };
  const implemented = [];

  decisionsThisWeek().forEach(h => {
    if (h.decision === "ready") {
      const vote = cabVote(h);
      h.cabOutcome = vote.outcome;
      h.cabLabel = vote.label;
      sections.cab.push(makeReport(h.rfc, "cab", vote.label, vote.style, vote.comment, vote.fx));

      if (vote.implement) {
        h.implementation = resolveImplementation(h.rfc);
        sections.implementation.push(h.implementation);
        implemented.push(h);
      } else if (vote.outcome === "pulled") {
        placeOnHold(h.rfc, `Pulled from the CAB agenda during the Week ${state.week} change freeze.`);
      } else if (vote.outcome === "rejected") {
        const after = resolveCabRejection(h.rfc);
        if (after) sections.requesters.push(after);
      } else if (vote.outcome === "deferred") {
        const after = resolveDeferral(h.rfc);
        if (after) sections.requesters.push(after);
      }
    }
    if (h.decision === "sendBack") sections.requesters.push(resolveSendBack(h));
    if (h.decision === "hold") sections.requesters.push(resolveHold(h));
  });

  // Did any of this week's implemented changes clash with each other?
  sections.implementation.push(...resolveCollisions(implemented));

  // Apply every report's meter changes.
  const totalFx = { stability: 0, leadership: 0, audit: 0, sanity: 0 };
  [...sections.cab, ...sections.implementation, ...sections.requesters].forEach(report => {
    applyEffects(report.fx);
    for (const m in report.fx) totalFx[m] += report.fx[m];
  });

  // Line up any follow-up RFCs for next week.
  scheduleFollowUps(decisionsThisWeek());

  // Freezes and promises only last for one week.
  state.freeze = false;
  state.promise = false;

  renderResults(sections, totalFx);
  showScreen("screen-consequences");
}

// After reading the results: game over, or the week summary.
function afterResults() {
  renderMeters();
  if (isGameOver()) {
    renderGameOver();
    showScreen("screen-end");
  } else {
    renderWeekSummary();
    showScreen("screen-week");
  }
}

function startNextWeek() {
  state.week++;
  state.tutorial = false;   // the guided week is over
  // The weekend helps a bit; the ops tempo grinds everything down a bit.
  const pressure = weeklyPressure(state.week);
  const fx = { sanity: WEEKEND_SANITY_BONUS };
  addEffects(fx, pressure);
  applyEffects(fx);
  renderMeters(fx);
  state.pendingNote = `The weekend restored a little sanity (+${WEEKEND_SANITY_BONUS}), ` +
    `but the ops tempo grinds on: ${describeEffects(pressure)}.`;
  if (isGameOver()) {
    renderGameOver();
    showScreen("screen-end");
    return;
  }
  // There's a chance of a random event before the week starts.
  if (Math.random() < EVENT_CHANCE) startEvent();
  else showWeekIntro();
}

function showWeekIntro() {
  renderWeekIntro(state.pendingNote);
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
  continueButton.textContent = isGameOver() ? "Oh no" : `On to week ${state.week}`;
  continueButton.classList.remove("hidden");
}

function afterEvent() {
  if (isGameOver()) {
    renderGameOver();
    showScreen("screen-end");
  } else {
    showWeekIntro();
  }
}

// Connect buttons to the functions above.
document.getElementById("btn-start").addEventListener("click", () => startReview(false));
document.getElementById("btn-start-guided").addEventListener("click", () => startReview(true));
document.getElementById("btn-next").addEventListener("click", nextCard);
document.getElementById("btn-continue").addEventListener("click", afterResults);
document.getElementById("btn-next-week").addEventListener("click", startNextWeek);
document.getElementById("btn-event-continue").addEventListener("click", afterEvent);
document.getElementById("btn-restart").addEventListener("click", newGame);
document.querySelectorAll("#decision-buttons button").forEach(button => {
  button.addEventListener("click", () => makeDecision(button.dataset.decision));
});

// ---------------------------------------------------------------------
// STANDARD CHANGE CATALOGUE - a reference the player can open any time.
// ---------------------------------------------------------------------
function findCatalogueEntry(id) {
  return STANDARD_CHANGE_CATALOGUE.find(entry => entry.id === id);
}

// The extra line on Standard RFC cards: which catalogue entry it claims.
function renderCatalogueField(rfc) {
  if (rfc.type !== "Standard") return "";
  const entry = findCatalogueEntry(rfc.catalogueId);
  const value = entry
    ? `${entry.id} ${entry.name} <button class="link" data-catalogue="${entry.id}">Check conditions</button>`
    : `<span class="catalogue-missing">&#9888; No catalogue entry given</span>
       <button class="link" data-catalogue="">Open catalogue</button>`;
  return `<dt>Catalogue entry</dt><dd>${value}</dd>`;
}

// Build the list of entries inside the catalogue pop-up.
function renderCatalogue(highlightId) {
  const list = items => items.map(item => `<li>${item}</li>`).join("");
  document.getElementById("catalogue-entries").innerHTML = STANDARD_CHANGE_CATALOGUE.map(entry => `
    <article class="catalogue-entry ${entry.id === highlightId ? "highlight" : ""}" id="entry-${entry.id}">
      <h3><span class="entry-id">${entry.id}</span>${entry.name}</h3>
      <p>${entry.description}</p>
      <h4>Conditions (all must be true)</h4>
      <ul class="conditions">${list(entry.conditions)}</ul>
      <h4>Not covered: raise a Normal change instead</h4>
      <ul class="not-covered">${list(entry.notCovered)}</ul>
      <h4>Procedure</h4>
      <p>${entry.procedure}</p>
    </article>
  `).join("");
}

// Open the catalogue. If an entry id is given, highlight it and scroll to it.
function openCatalogue(highlightId) {
  // Counts as "read the catalogue" for Chris's guided-week checklist.
  if (!document.getElementById("screen-meeting").classList.contains("hidden")) {
    openedArtifacts.add("catalogue");
    updateCoachTicks();
  }
  renderCatalogue(highlightId);
  const dialog = document.getElementById("catalogue");
  dialog.showModal();
  const target = highlightId && document.getElementById(`entry-${highlightId}`);
  if (target) target.scrollIntoView({ block: "center" });
  else dialog.scrollTop = 0;
}

document.getElementById("btn-catalogue").addEventListener("click", () => openCatalogue());
document.getElementById("btn-catalogue-close").addEventListener("click", () => {
  document.getElementById("catalogue").close();
});
// Clicking the dark area around the pop-up also closes it.
document.getElementById("catalogue").addEventListener("click", event => {
  const box = event.currentTarget.getBoundingClientRect();
  const outside = event.clientX < box.left || event.clientX > box.right ||
                  event.clientY < box.top || event.clientY > box.bottom;
  if (outside) event.currentTarget.close();
});
// "Check conditions" buttons on RFC cards. The card is rebuilt for every
// RFC, so we listen on the card container instead of each button.
document.getElementById("rfc-card").addEventListener("click", event => {
  const button = event.target.closest("[data-catalogue]");
  if (button) openCatalogue(button.dataset.catalogue);
  const attachment = event.target.closest("[data-artifact]");
  if (attachment) openArtifact(Number(attachment.dataset.artifact));
});

// Keyboard shortcuts: R = ready, N = not ready, H = hold (freeze only),
// C = catalogue, Enter = the screen's main "continue" button.
// (The guided-week button comes first, so Enter picks it on week 1.)
const CONTINUE_BUTTONS = ["btn-start-guided", "btn-start", "btn-next", "btn-continue", "btn-event-continue",
  "btn-next-week", "btn-restart"];

document.addEventListener("keydown", event => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  // While the catalogue is open, the game's shortcuts are paused
  // (Escape closes it - the browser handles that for us).
  if (document.getElementById("catalogue").open) return;
  if (document.getElementById("artifact-viewer").open) return;
  if (event.key.toLowerCase() === "c") {
    openCatalogue();
    return;
  }

  // 1-4: open the matching attachment on the card.
  const onReviewScreen = !document.getElementById("screen-meeting").classList.contains("hidden");
  if (onReviewScreen && ["1", "2", "3", "4"].includes(event.key)) {
    openArtifact(Number(event.key) - 1);
    return;
  }

  const decision = { r: "ready", n: "sendBack", h: "hold" }[event.key.toLowerCase()];
  const decisionButton = decision && document.querySelector(`[data-decision=${decision}]`);
  const onReview = !document.getElementById("screen-meeting").classList.contains("hidden");
  const buttonShown = decisionButton && !decisionButton.classList.contains("hidden");
  if (buttonShown && onReview && !decisionButton.disabled) {
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

// Set up the first week when the page loads.
renderDataProblems();
newGame();
