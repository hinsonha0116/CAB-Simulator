/* =====================================================================
   CAB SIMULATOR - SCENARIO DATA
   ---------------------------------------------------------------------
   This file holds all the game's CONTENT (characters and change
   requests). You can edit or add entries here without touching the
   game logic in game.js.

   HOW TO ADD A NEW CHANGE REQUEST (RFC)
   1. Copy one of the { ... } blocks inside RFCS below.
   2. Paste it after the last one (keep the comma between blocks!).
   3. Change the text. Allowed values for each field:
        type:        "Standard" | "Normal" | "Emergency"
        statedRisk:  "Low" | "Medium" | "High"   (what the requester CLAIMS)
        rollback:    "solid" | "weak" | "missing"
        testing:     "yes" | "partial" | "none"
        hiddenRisk:  "Low" | "Medium" | "High"   (the TRUTH - player never sees it)
        requester:   must match a key in CHARACTERS (e.g. "dave")

   OPTIONAL incident report text (shown after the meeting if approved):
        outageReport:  what happened if the change broke something
        successReport: what happened if it went fine
   Leave them out and a random line from GENERIC_REPORTS is used instead.
   You can write {system} in any report and it becomes the first
   affected system, e.g. "Orders Database".

   ITIL quick reference (used to flavour the scenarios):
   - Standard change:  low risk, pre-authorized, follows a known procedure.
   - Normal change:    needs assessment and authorization (that's you, CAB).
   - Emergency change: must happen ASAP (e.g. fixing an incident or a
                       security hole). Expedited, but still needs a record.
   - Remediation / rollback plan: how you get back to a working state if
                       the change fails. This decides how BAD an outage is.
   - Testing evidence: proof it works before production. This decides how
                       LIKELY an outage is.
   ===================================================================== */

const CHARACTERS = {
  priya: {
    name: "Priya Raman",
    role: "Senior DBA",
    personality: "Meticulous. Has a runbook for her runbooks.",
    reactions: {
      approve: "Priya nods and quietly updates her change record to 'Scheduled'.",
      reject: "Priya asks, very politely, which part of her 14-page test plan was lacking.",
      sendBack: "Priya replies within 4 minutes with a 3-page addendum."
    }
  },
  dave: {
    name: "Dave Kowalski",
    role: "DevOps Lead",
    personality: "Believes 'move fast and break things' is a compliance framework.",
    reactions: {
      approve: "Dave is already deploying. He was deploying before you clicked.",
      reject: "Dave posts a single skull emoji in the team chat.",
      sendBack: "Dave replies 'more info like what??' and goes to lunch."
    }
  },
  brad: {
    name: "Brad Whitfield",
    role: "VP of Revenue Acceleration",
    personality: "Everything is urgent. Everything is a 'quick win'.",
    reactions: {
      approve: "Brad sends you a calendar invite titled 'Synergy Celebration'.",
      reject: "Brad schedules a 'quick chat' with your manager.",
      sendBack: "Brad replies-all: 'Who is blocking this?'"
    }
  },
  morgan: {
    name: "Morgan Lee",
    role: "Security Engineer",
    personality: "Has not slept since the last zero-day. Will not stop saying 'CVE'.",
    reactions: {
      approve: "Morgan exhales for the first time in 36 hours.",
      reject: "Morgan opens a risk acceptance form with your name already filled in.",
      sendBack: "Morgan stares at the camera for an uncomfortably long time."
    }
  },
  linda: {
    name: "Linda Okafor",
    role: "Network Engineer (31 years)",
    personality: "Installed the original network. Possibly IS the network.",
    reactions: {
      approve: "Linda says 'thank you, dear' and swaps the part in under 5 minutes.",
      reject: "Linda reminds everyone this is a pre-approved Standard change. Twice.",
      sendBack: "Linda sends back the exact same form, now in Comic Sans."
    }
  }
};

const RFCS = [
  {
    id: "CHG0001",
    title: "Add index to Orders table to fix slow reports",
    requester: "priya",
    type: "Normal",
    statedRisk: "Low",
    systems: ["Orders Database"],
    window: "Tue 22:00 - 23:00",
    rollback: "solid",
    testing: "yes",
    justification:
      "Month-end reports take 47 minutes. Tested in staging with a copy of production data. " +
      "Rollback is a single DROP INDEX statement, rehearsed twice.",
    hiddenRisk: "Low",
    outageReport:
      "Index build locked the Orders table longer than expected. Priya rolled back in 6 minutes " +
      "and has already filed a post-implementation review. With diagrams.",
    successReport:
      "Month-end report now runs in 38 seconds. Finance sent a thank-you email. Nobody has ever " +
      "seen Finance send a thank-you email."
  },
  {
    id: "CHG0002",
    title: "Upgrade ALL Kubernetes clusters to latest version",
    requester: "dave",
    type: "Normal",
    statedRisk: "Low",
    systems: ["Web Platform", "Checkout API"],
    window: "Fri 16:45 - 17:00",
    rollback: "weak",
    testing: "partial",
    justification:
      "New version has cool features. Tested on my laptop and it was fine. " +
      "15 minutes should be plenty. If it breaks we can just roll forward.",
    hiddenRisk: "High",
    outageReport:
      "Checkout API down from 16:52 Friday. Dave 'rolled forward' three times. Each version " +
      "was worse. Dave's laptop is now the most stable environment in the company.",
    successReport:
      "Somehow it worked. Dave is now insufferable and has submitted 6 more RFCs titled 'yolo'."
  },
  {
    id: "CHG0003",
    title: "Change pricing rules before tomorrow's big client demo",
    requester: "brad",
    type: "Emergency",
    statedRisk: "Medium",
    systems: ["Pricing Engine", "Checkout API"],
    window: "Tonight, whenever",
    rollback: "missing",
    testing: "none",
    justification:
      "The client wants to see a 40% discount live in production. This is a huge revenue " +
      "opportunity and a quick win. Not sure why this needs a meeting.",
    hiddenRisk: "High",
    outageReport:
      "The 40% discount applied to every customer. Then it applied again. Some orders now cost " +
      "negative money. Nobody knows what the old pricing rules were.",
    successReport:
      "Demo went well. Brad took full credit. The discount is still live and nobody has noticed. Yet."
  },
  {
    id: "CHG0004",
    title: "Patch actively exploited VPN vulnerability",
    requester: "morgan",
    type: "Emergency",
    statedRisk: "High",
    systems: ["VPN Gateway"],
    window: "Tue 23:00 - 01:00",
    rollback: "solid",
    testing: "partial",
    justification:
      "Vendor advisory confirms attackers are exploiting this right now. Patch tested on our " +
      "lab gateway. Remote staff will lose VPN for ~20 minutes during the restart.",
    hiddenRisk: "Medium",
    outageReport:
      "Gateway didn't come back after the restart. Morgan restored the previous image within the " +
      "window. Remote staff missed 40 minutes of VPN at 23:30, and nobody noticed.",
    successReport:
      "Patched. Attack traffic now bounces off harmlessly. Morgan has finally gone to sleep."
  },
  {
    id: "CHG0005",
    title: "Replace failed power supply in core switch (hot-swap)",
    requester: "linda",
    type: "Standard",
    statedRisk: "Low",
    systems: ["Core Network"],
    window: "Wed 07:00 - 07:30",
    rollback: "solid",
    testing: "yes",
    justification:
      "Pre-approved Standard change from the catalogue. The switch has a redundant PSU and " +
      "we've done this 40 times. Honestly not sure why it's on the agenda.",
    hiddenRisk: "Low",
    successReport:
      "New power supply installed. Linda labelled it, by hand, in a font that predates computers."
  }
];

// Used when an RFC has no outageReport / successReport of its own.
const GENERIC_REPORTS = {
  outage: [
    "{system} became unavailable shortly after implementation. The service desk queue is now longer than the change record.",
    "{system} started returning errors. The on-call engineer has described the situation using words we can't print.",
    "{system} went down. The monitoring dashboard is a lovely shade of red.",
    "Users report that {system} is 'being weird'. Investigation shows it is, in fact, being weird."
  ],
  success: [
    "Implemented on schedule. {system} is fine. Suspiciously fine.",
    "Change completed with no incidents. Someone actually updated the documentation.",
    "{system} updated successfully. Nobody noticed, which is the highest praise in IT."
  ]
};
