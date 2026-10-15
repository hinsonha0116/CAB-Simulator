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

   ITIL quick reference (used to flavour the scenarios):
   - Standard change:  low risk, pre-authorized, follows a known procedure.
   - Normal change:    needs assessment and authorization (that's you, CAB).
   - Emergency change: must happen ASAP (e.g. fixing an incident or a
                       security hole). Expedited, but still needs a record.
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
    hiddenRisk: "Low"
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
    hiddenRisk: "High"
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
    hiddenRisk: "High"
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
    hiddenRisk: "Medium"
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
    hiddenRisk: "Low"
  }
];
