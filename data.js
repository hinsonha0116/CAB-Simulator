/* =====================================================================
   CAB SIMULATOR - SCENARIO DATA
   ---------------------------------------------------------------------
   This file holds all the game's CONTENT (characters and change
   requests). You can edit or add entries here without touching the
   game logic in game.js.

   WHAT'S IN HERE (in order)
   - CHARACTERS:          the recurring requesters and their reactions
   - RFCS:                the pool of change requests (3-5 are dealt per meeting)
   - GENERIC_REPORTS:     fallback incident report text
   - RESUBMISSION_NOTES:  what a sent-back RFC says when it returns
   - MEETING_INTROS:      scene-setting lines shown before each meeting
   - PERFORMANCE_RATINGS: end-of-week titles and jokes

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
   affected system, e.g. "Orders Database". {name} becomes the
   requester's first name.

   OPTIONAL "what if you reject it" fields:
        rejectedReport:     what the requester does if they escalate
                            your rejection to leadership
        returnsAsEmergency: { ... } the problem gets worse and the RFC
                            comes back at the next meeting as an Emergency.
                            Inside, list only the fields that CHANGE
                            (title, justification, window, statedRisk,
                            hiddenRisk, testing, rollback...), plus:
                            reason: the report text explaining why it's back

   CHARACTER traits ("High" | "Medium" | "Low"):
        clout:         how likely they are to escalate a rejection
        followThrough: how likely they are to actually improve an RFC
                       you sent back (better testing / rollback plan)

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
    clout: "Low",
    followThrough: "High",
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
    clout: "Medium",
    followThrough: "Low",
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
    clout: "High",
    followThrough: "Low",
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
    clout: "Medium",
    followThrough: "High",
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
    clout: "Low",
    followThrough: "Medium",
    personality: "Installed the original network. Possibly IS the network.",
    reactions: {
      approve: "Linda says 'thank you, dear' and swaps the part in under 5 minutes.",
      reject: "Linda reminds everyone this is a pre-approved Standard change. Twice.",
      sendBack: "Linda sends back the exact same form, now in Comic Sans."
    }
  },
  kyle: {
    name: "Kyle Brandt",
    role: "Account Manager, CloudSyncly (vendor)",
    clout: "Medium",
    followThrough: "Medium",
    personality: "Calls every patch a 'value-add'. Has never seen a change window.",
    reactions: {
      approve: "Kyle thanks you for 'partnering on this journey' and logs in remotely. From an airport.",
      reject: "Kyle mentions, casually, that your support contract renews next month.",
      sendBack: "Kyle forwards your question to 'the engineering folks'. They are in another time zone."
    }
  },
  hannah: {
    name: "Hannah Ortiz",
    role: "Service Desk Manager",
    clout: "Low",
    followThrough: "High",
    personality: "Takes 400 calls a day. Is the only person who reads the change calendar.",
    reactions: {
      approve: "Hannah briefs her team so they know what's coming. Nobody else ever does this.",
      reject: "Hannah sighs and adds a new canned response for 'yes, we know'.",
      sendBack: "Hannah resubmits with a user comms plan attached. Again."
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
      "seen Finance send a thank-you email.",
    returnsAsEmergency: {
      reason:
        "Month-end reports now time out completely. Finance cannot close the books. Priya's " +
        "index is back, as an Emergency, with the CFO cc'd.",
      title: "EMERGENCY: Add Orders index - month-end close is blocked",
      window: "Tonight, 22:00 - 23:00",
      justification:
        "Same change as before, same testing, same rollback. The only difference is that the " +
        "CFO is now standing behind my chair."
    }
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
      "Demo went well. Brad took full credit. The discount is still live and nobody has noticed. Yet.",
    rejectedReport:
      "Brad told the CEO that 'IT lost us the deal'. The client actually signed anyway, but " +
      "that's not the story leadership heard."
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
      "Patched. Attack traffic now bounces off harmlessly. Morgan has finally gone to sleep.",
    returnsAsEmergency: {
      reason:
        "Attackers got in through the unpatched VPN. Security incident declared. The patch is " +
        "back, and this time nobody is asking about the 20 minutes of downtime.",
      title: "EMERGENCY: Patch VPN - active intrusion in progress",
      statedRisk: "High",
      window: "Immediately",
      testing: "partial",
      hiddenRisk: "Medium",
      justification:
        "We are being breached through the hole I asked to patch on Tuesday. I would like to " +
        "patch it now. I have not slept. Please."
    }
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
      "New power supply installed. Linda labelled it, by hand, in a font that predates computers.",
    returnsAsEmergency: {
      reason:
        "The second power supply in the core switch failed too. The whole building's network " +
        "went down for 2 hours. Linda would like a word.",
      title: "EMERGENCY: Replace BOTH power supplies in core switch (network is down)",
      statedRisk: "Medium",
      window: "Right now",
      justification:
        "I did say. The building is offline. I have the parts in my hand. Approve it and I'll " +
        "have everyone back in 10 minutes."
    }
  },
  {
    id: "CHG0006",
    title: "Add a VLAN for the new 3rd-floor printers",
    requester: "linda",
    type: "Normal",
    statedRisk: "Low",
    systems: ["Core Network"],
    window: "Thu 06:00 - 06:30",
    rollback: "solid",
    testing: "yes",
    justification:
      "Facilities bought 12 printers without asking anyone. They need their own network so they " +
      "can't see payroll. Config is tested in the lab and the old config is saved.",
    hiddenRisk: "Low",
    outageReport:
      "A typo briefly put the printers on the finance VLAN. Linda reverted in 4 minutes. The " +
      "printers printed 900 pages of payroll data in that time. Facilities is 'looking into it'.",
    successReport:
      "Printers are online and isolated. They have already jammed, which is how we know they work."
  },
  {
    id: "CHG0007",
    title: "Turn on auto-scaling for the Web Platform",
    requester: "dave",
    type: "Normal",
    statedRisk: "Medium",
    systems: ["Web Platform"],
    window: "Tue 21:00 - 22:00",
    rollback: "solid",
    testing: "partial",
    justification:
      "Site slows down every time Marketing sends an email. Load tested at 2x traffic, not 10x. " +
      "Rollback is one toggle. I even wrote it down this time.",
    hiddenRisk: "Medium",
    outageReport:
      "Auto-scaling scaled up to 400 servers, then down to zero, then back up. The cloud bill " +
      "has its own incident ticket now.",
    successReport:
      "Marketing's email went out and the site stayed up. Dave has framed the graph.",
    returnsAsEmergency: {
      reason:
        "Marketing sent a 50% off email. The website collapsed under the traffic for 90 " +
        "minutes. Auto-scaling is back as an Emergency.",
      title: "EMERGENCY: Turn on auto-scaling NOW (site keeps crashing)",
      window: "Immediately",
      testing: "partial",
      justification:
        "Told you. Site has crashed twice today. The toggle is right there. I am hovering my " +
        "mouse over it as we speak."
    }
  },
  {
    id: "CHG0008",
    title: "Connect new 'SalesRocket' CRM to the customer database",
    requester: "brad",
    type: "Normal",
    statedRisk: "Low",
    systems: ["Customer Database", "CRM"],
    window: "Thursday afternoon (so everyone can see it go live!)",
    rollback: "weak",
    testing: "none",
    justification:
      "I signed the contract on Friday. The vendor says it's plug and play. The rollback plan is " +
      "'unplug and unplay'. Sales needs this for Q3.",
    hiddenRisk: "High",
    outageReport:
      "SalesRocket synced in both directions. Every customer is now called 'Test Test'. Some of " +
      "them have received 41 welcome emails.",
    successReport:
      "Surprisingly, it works. SalesRocket has only duplicated each customer twice, which Brad " +
      "calls 'pipeline growth'.",
    rejectedReport:
      "Brad has escalated to the COO, the CFO, and someone from the board he met at a golf " +
      "course. All of them now think IT is 'anti-revenue'."
  },
  {
    id: "CHG0009",
    title: "Renew the TLS certificate on the public website",
    requester: "morgan",
    type: "Standard",
    statedRisk: "Low",
    systems: ["Web Platform"],
    window: "Thu 08:00 - 08:15",
    rollback: "solid",
    testing: "yes",
    justification:
      "The certificate expires on Saturday. This is a Standard change from the catalogue. If we " +
      "don't do it, every customer sees a giant red warning. Please. I'm begging.",
    hiddenRisk: "Low",
    successReport:
      "Certificate renewed. The website remains trustworthy for another 90 days. Morgan has set 14 calendar reminders.",
    returnsAsEmergency: {
      reason:
        "The certificate expired. Every customer now sees a giant red 'Your connection is not " +
        "private' warning. Online sales have stopped.",
      title: "EMERGENCY: Renew EXPIRED certificate (website showing security warnings)",
      statedRisk: "Low",
      window: "Immediately",
      justification:
        "It expired. As predicted. In writing. Three times. The renewal is still a 15-minute " +
        "Standard procedure. It's just on fire now."
    }
  },
  {
    id: "CHG0010",
    title: "Move the Orders Database to the new storage array",
    requester: "priya",
    type: "Normal",
    statedRisk: "High",
    systems: ["Orders Database"],
    window: "Sat 01:00 - 05:00",
    rollback: "solid",
    testing: "yes",
    justification:
      "The old array is out of support and making clicking noises. This IS risky, so: three " +
      "rehearsals, a full backup, a go/no-go checkpoint at 02:00, and the old array stays live until Monday.",
    hiddenRisk: "Medium",
    outageReport:
      "Migration ran long and hit the 02:00 go/no-go. Priya called no-go and was back on the old " +
      "array by 02:20. Nobody outside IT noticed. This is what good looks like.",
    successReport:
      "Migrated in 2 hours 10 minutes. Reports are faster. The clicking noise has stopped. Priya is unbearably calm about it.",
    returnsAsEmergency: {
      reason:
        "The old storage array lost two disks overnight. The Orders Database is running " +
        "degraded with no redundancy left. One more failure and it's gone.",
      title: "EMERGENCY: Migrate Orders Database off the failing storage array",
      window: "Tonight, 23:00 - 03:00",
      testing: "yes",
      hiddenRisk: "High",
      justification:
        "Same plan, rehearsed three times. But we now migrate from a dying array under " +
        "pressure, with no time for a go/no-go buffer. I would have preferred last week."
    }
  },
  {
    id: "CHG0011",
    title: "Apply vendor 'hotfix' to the HR system via remote session",
    requester: "kyle",
    type: "Normal",
    statedRisk: "Low",
    systems: ["HR System", "Payroll"],
    window: "Whenever our engineer is free (probably Thursday?)",
    rollback: "missing",
    testing: "partial",
    justification:
      "This value-add hotfix was tested at another customer and they only had minor issues. Our " +
      "engineer will connect remotely. Rollback is not supported for this version.",
    hiddenRisk: "High",
    outageReport:
      "The hotfix fixed the bug and also deleted the payroll schedule. Kyle says this is a " +
      "'known behaviour'. Payday is in three days.",
    successReport:
      "Hotfix applied. The HR system works. Kyle has sent an invoice for 'professional services'.",
    rejectedReport:
      "Kyle went over your head to the CIO, who he golfs with. The CIO has asked why IT is " +
      "'blocking our strategic partner'."
  },
  {
    id: "CHG0012",
    title: "Reword the password reset page",
    requester: "hannah",
    type: "Standard",
    statedRisk: "Low",
    systems: ["Self-Service Portal"],
    window: "Tue 12:00 - 12:10",
    rollback: "solid",
    testing: "yes",
    justification:
      "The button says 'Initiate Credential Recovery Workflow'. Users don't click it, they call us. " +
      "Changing it to 'Forgot your password?' could save 60 calls a day.",
    hiddenRisk: "Low",
    successReport:
      "Password reset calls dropped 40% by lunchtime. Hannah's team ate lunch at an actual table."
  },
  {
    id: "CHG0013",
    title: "Decommission 'unused' logging servers to save money",
    requester: "dave",
    type: "Normal",
    statedRisk: "Low",
    systems: ["Logging Platform"],
    window: "Tue 17:00 - 17:05",
    rollback: "missing",
    testing: "none",
    justification:
      "Nobody has logged into these servers in a year. They cost a fortune. Five minutes, " +
      "power off, done. What's the worst that could happen?",
    hiddenRisk: "Medium",
    outageReport:
      "The servers weren't unused: they hold the audit logs. Security monitoring is now blind, " +
      "and next quarter's audit evidence is gone.",
    successReport:
      "Servers powered off. Saved $4,000 a month. Nobody has noticed yet. That word 'yet' is doing a lot of work."
  },
  {
    id: "CHG0014",
    title: "Turn on multi-factor authentication for all staff",
    requester: "morgan",
    type: "Normal",
    statedRisk: "Medium",
    systems: ["Identity Platform"],
    window: "Mon 09:00 (everyone at once)",
    rollback: "weak",
    testing: "partial",
    justification:
      "Phishing attempts tripled this month. Piloted with the IT team. Rolling out to all 2,000 staff " +
      "at 9am Monday because it's 'the cleanest cutover'.",
    hiddenRisk: "Medium",
    outageReport:
      "2,000 people tried to set up MFA at 9:00 on Monday. The service desk phone system went " +
      "down first. Hannah has gone very quiet.",
    successReport:
      "MFA is live. Phishing success rate: zero. Complaints received: 1,400. Morgan considers this a win.",
    returnsAsEmergency: {
      reason:
        "Someone in Finance gave their password to a phishing email. The attacker sent " +
        "$80,000 of 'invoices' from their mailbox. MFA is back, urgently.",
      title: "EMERGENCY: Turn on MFA for Finance and executives today",
      statedRisk: "Medium",
      window: "Today, 14:00",
      rollback: "solid",
      hiddenRisk: "Low",
      justification:
        "Smaller scope this time: just Finance and the executives, 80 people, with the " +
        "service desk briefed. Also, we've been robbed."
    }
  },
  {
    id: "CHG0015",
    title: "Upgrade firewall firmware to v9.0.0 (released yesterday)",
    requester: "kyle",
    type: "Normal",
    statedRisk: "Medium",
    systems: ["Perimeter Firewall"],
    window: "Thu 22:00 - 23:00",
    rollback: "solid",
    testing: "partial",
    justification:
      "v9.0.0 is our most exciting release ever, with AI-powered threat detection. It was tested " +
      "in our lab. You can always reinstall v8 if needed.",
    hiddenRisk: "High",
    outageReport:
      "The AI-powered threat detection flagged all incoming traffic as a threat, including the " +
      "firewall's own updates. Rolled back to v8. v9.0.1 is 'coming soon'.",
    successReport:
      "Firmware upgraded. The AI has detected one threat so far: Kyle's own remote session."
  },
  {
    id: "CHG0016",
    title: "Restore email for the CEO's assistant",
    requester: "hannah",
    type: "Emergency",
    statedRisk: "Low",
    systems: ["Email"],
    window: "Right now",
    rollback: "solid",
    testing: "yes",
    justification:
      "Their mailbox hit the size limit and the board pack is stuck in it. Fix is a quota increase, " +
      "same as we've done 30 times. Raising it as an Emergency because the board meets at 2pm.",
    hiddenRisk: "Low",
    successReport:
      "Mailbox restored. The board pack arrived at 1:52pm. The CEO's assistant has sent Hannah a muffin.",
    rejectedReport:
      "The board meeting started without its board pack. The CEO called you personally to ask " +
      "why a mailbox quota needed a committee."
  },
  {
    id: "CHG0017",
    title: "Add a 'Buy Now' button to the login page",
    requester: "brad",
    type: "Normal",
    statedRisk: "Low",
    systems: ["Web Platform"],
    window: "Tue 20:00 - 20:30",
    rollback: "weak",
    testing: "partial",
    justification:
      "Customers who log in are customers who want to buy. Why make them wait until AFTER login? " +
      "The web team says it's 'technically possible but philosophically confusing'.",
    hiddenRisk: "Low",
    outageReport:
      "The 'Buy Now' button covered the 'Log In' button on mobile. Mobile logins down 90%. " +
      "Mobile 'Buy Now' clicks up 300%, all of them by accident.",
    successReport:
      "Button added. Nobody has clicked it. Brad says it's 'building brand awareness'.",
    rejectedReport:
      "Brad presented a slide titled 'Revenue Lost To Process' at the leadership offsite. " +
      "Your face was on it."
  }
];

// Short scene-setting lines shown before each meeting (picked at random).
const MEETING_INTROS = [
  "The coffee is cold. Someone has joined the call from their car.",
  "Three people are presenting the same slide. Nobody has unmuted.",
  "The agenda was sent 4 minutes ago. Two RFCs were added during the meeting.",
  "Someone's dog is barking. It has more questions than half the board.",
  "The meeting room projector needs a change request to fix the projector.",
  "Half the attendees are 'just listening in'. They are definitely answering emails."
];

// End-of-week performance titles. game.js decides WHICH one you get
// (see getPerformanceRating). You can freely change the wording here.
const PERFORMANCE_RATINGS = {
  incidentFactory: {
    title: "Chief Incident Officer",
    blurb: "The service desk has your photo on the wall. Not in a good way."
  },
  wallOfNo: {
    title: "The Wall of No",
    blurb: "Nothing broke, because nothing happened. Leadership is drafting a 'blocker' org chart with you at the top."
  },
  needsMoreInfo: {
    title: "Professional Procrastinator",
    blurb: "Your favourite phrase is 'can we take this offline?' Your backlog has its own backlog."
  },
  rubberStamp: {
    title: "Rubber Stamp Enthusiast",
    blurb: "You approved almost everything. Some of it caught fire. You remain optimistic."
  },
  actuallyGood: {
    title: "Actually Pretty Good At This",
    blurb: "Changes went in, nothing broke. Nobody will ever thank you, which is how you know it went well."
  },
  cautious: {
    title: "Cautiously Competent",
    blurb: "No outages, but a fair few annoyed requesters. A respectable week of risk management."
  },
  mediocre: {
    title: "Meets Expectations (Barely)",
    blurb: "Some wins, some fires. Your annual review will use the word 'journey'."
  }
};

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
  ],
  // A rejected requester went over your head (used if no rejectedReport).
  escalation: [
    "{name} escalated your rejection to their director, who escalated it to yours.",
    "{name} has started a meeting series called 'Unblocking IT'. You are not invited.",
    "{name} complained about you in the all-hands Q&A. Anonymously. Everyone knows it was {name}."
  ],
  // You rejected a change that really WAS dangerous. Well done.
  dodged: [
    "Good call. A similar change at another company took them offline for two days. {name} has quietly gone back to the drawing board.",
    "On closer inspection, this would have broken {system}. {name} has stopped mentioning it.",
    "The vendor has just withdrawn the version {name} wanted to install. Nice instincts."
  ]
};

// Notes shown on a sent-back RFC when it returns to the agenda.
// {name} becomes the requester's first name.
const RESUBMISSION_NOTES = {
  improved: [
    "{name} has done the homework this time.",
    "{name} took the feedback seriously. Who knew?",
    "Resubmitted with real evidence attached. {name} looks tired but proud."
  ],
  unchanged: [
    "{name} has resubmitted it unchanged, with 'as discussed' in the subject line.",
    "{name} changed the font and nothing else.",
    "Identical to last time, but now marked URGENT in red."
  ],
  // Sent back too many times: the requester gives up.
  withdrawn: [
    "{name} has withdrawn the change and is telling everyone that CAB is where changes go to die.",
    "{name} has given up and is 'exploring options that don't involve CAB'. This is worrying."
  ]
};
