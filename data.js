/* =====================================================================
   CAB SIMULATOR - SCENARIO DATA
   ---------------------------------------------------------------------
   This file holds all the game's CONTENT (characters and change
   requests). You can edit or add entries here without touching the
   game logic in game.js.

   >>> Full guide with examples: HOW-TO-ADD-SCENARIOS.md <<<
   After editing, refresh the game. Typos show up in a red box.

   WHAT'S IN HERE (in order)
   - CHARACTERS:          the recurring requesters and their reactions
   - RFCS:                the pool of change requests (3-5 are dealt per meeting)
   - GENERIC_REPORTS:     fallback incident report text
   - COLLISION_REPORTS:   two approved changes on the same system clash
   - RESUBMISSION_NOTES:  what a sent-back RFC says when it returns
   - MEETING_INTROS:      scene-setting lines shown before each meeting
   - PERFORMANCE_RATINGS: end-of-week titles and jokes
   - EVENTS:              random events between meetings (audits, freezes...)
   - STANDARD_CHANGE_CATALOGUE: pre-authorized change types (in-game reference)

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
        catalogueId: (Standard changes only) an id from
                     STANDARD_CHANGE_CATALOGUE, e.g. "SC-05"

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
  },
  tess: {
    name: "Tess Nakamura",
    role: "Junior Developer",
    clout: "Low",
    followThrough: "High",
    personality: "Three weeks into the job. Answers every question with complete, terrifying honesty.",
    reactions: {
      approve: "Tess whispers 'oh no, it's real now' and unmutes by accident.",
      reject: "Tess says 'that's totally fair' and then quietly turns her camera off.",
      sendBack: "Tess writes down every word you said, including 'um'."
    }
  },
  ravi: {
    name: "Ravi Menon",
    role: "Enterprise Architect",
    clout: "Medium",
    followThrough: "Medium",
    personality: "Every change needs a diagram. Every diagram needs a diagram.",
    reactions: {
      approve: "Ravi shares his screen to show the 'approved' state in a new diagram.",
      reject: "Ravi says the rejection is 'not aligned with the target architecture'.",
      sendBack: "Ravi promises a revised deck. It will be longer."
    }
  },
  deploybot: {
    name: "DeployBot 3000",
    role: "Automated Release Pipeline",
    clout: "Low",
    followThrough: "High",
    personality: "Raises its own changes. Does not understand sarcasm. Or weekends.",
    reactions: {
      approve: "BEEP. CHANGE APPROVED. DEPLOYING. HAVE A PRODUCTIVE DAY, HUMAN.",
      reject: "BEEP. REJECTION LOGGED. RETRYING IN 5 MINUTES.",
      sendBack: "BEEP. 'MORE INFO' IS NOT A RECOGNISED COMMAND. ATTACHING 40,000 LOG LINES."
    }
  },
  gwen: {
    name: "Gwen Albright",
    role: "Head of Finance Systems",
    clout: "High",
    followThrough: "Medium",
    personality: "Controls the budget. Remembers every outage since 2009, by date.",
    reactions: {
      approve: "Gwen nods once. You feel like you passed an exam you didn't know about.",
      reject: "Gwen writes something down. You'll find out what at budget season.",
      sendBack: "Gwen asks for the questions in writing, 'so there's a record'."
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
    catalogueId: "SC-01",
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
    catalogueId: "SC-02",
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
    catalogueId: "SC-03",
    statedRisk: "Low",
    systems: ["Self-Service Portal", "Identity Platform"],
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
    systems: ["Identity Platform", "VPN Gateway"],
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
    systems: ["Perimeter Firewall", "VPN Gateway"],
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
    systems: ["Web Platform", "Checkout API"],
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
  },
  {
    id: "CHG0018",
    title: "Fix typo in the order confirmation email",
    requester: "tess",
    type: "Normal",
    statedRisk: "Low",
    systems: ["Checkout API", "Email"],
    window: "Tue 19:00 - 19:15",
    rollback: "solid",
    testing: "yes",
    justification:
      "It currently says 'Thank you for your ordeal'. I tested the fix. I also tested undoing it. " +
      "Sorry, I wasn't sure if this needed CAB. My manager said everything needs CAB.",
    hiddenRisk: "Low",
    outageReport:
      "The new template had a missing bracket. 3,000 customers got an email that just says " +
      "'{{customer_name}}'. Tess rolled back in 4 minutes and apologised to the whole company.",
    successReport:
      "Customers now thank us for their order, not their ordeal. Tess has printed the email and stuck it on her monitor."
  },
  {
    id: "CHG0019",
    title: "Upgrade a library with a known security hole",
    requester: "tess",
    type: "Normal",
    statedRisk: "Medium",
    systems: ["Web Platform"],
    window: "Thu 20:00 - 21:00",
    rollback: "weak",
    testing: "partial",
    justification:
      "Honestly I'm not 100% sure what else uses this library. I found 14 things. There might be " +
      "more. I wanted to be upfront about that. Morgan says the hole is 'quite bad'.",
    hiddenRisk: "Medium",
    outageReport:
      "Thing number 15 was the login page. Nobody could log in for 2 hours. Tess had, in " +
      "fairness, warned everyone in writing.",
    successReport:
      "Library upgraded. All 14 things still work, and so does mystery thing number 15."
  },
  {
    id: "CHG0020",
    title: "Introduce a service mesh across all platforms (phase 1)",
    requester: "ravi",
    type: "Normal",
    statedRisk: "Medium",
    systems: ["Web Platform", "Checkout API", "Customer Database"],
    window: "Sat 00:00 - 06:00 (phase 1 of 6 weekends)",
    rollback: "weak",
    testing: "partial",
    justification:
      "Attached: a 47-slide deck, 9 diagrams and a glossary. In short: all services will talk " +
      "to each other through a mesh. Phase 1 is 'just the plumbing'. Rollback is covered on slide 41.",
    hiddenRisk: "High",
    outageReport:
      "The plumbing worked perfectly, except that no service could find any other service. " +
      "Ravi has drawn a diagram of the outage. It is very good.",
    successReport:
      "Phase 1 went live. Nothing visible changed, which Ravi says is 'the point'. Five phases to go."
  },
  {
    id: "CHG0021",
    title: "Retire the legacy FTP server",
    requester: "ravi",
    type: "Normal",
    statedRisk: "Low",
    systems: ["File Transfer"],
    window: "Thu 18:00 - 18:30",
    rollback: "solid",
    testing: "yes",
    justification:
      "The FTP server is from 2006 and has no owner. We checked the logs for a month. The plan " +
      "is to power it off, not delete it, for 30 days. Power back on if anyone screams.",
    hiddenRisk: "Medium",
    outageReport:
      "Someone screamed. The bank collects the payroll file from the FTP server once a month, " +
      "which is why it wasn't in a month of logs. Powered back on. Payroll is 6 hours late.",
    successReport:
      "Server off. Nobody screamed. Ravi has updated 9 diagrams to remove it."
  },
  {
    id: "CHG0022",
    title: "Automated release: Web Platform v4.12.3",
    requester: "deploybot",
    type: "Standard",
    catalogueId: "SC-05",
    statedRisk: "Low",
    systems: ["Web Platform"],
    window: "Tue 14:00 (auto-scheduled)",
    rollback: "solid",
    testing: "yes",
    justification:
      "BEEP. ALL 2,318 AUTOMATED TESTS PASSED. AUTOMATIC ROLLBACK ENABLED. THIS IS A " +
      "PRE-APPROVED STANDARD CHANGE. WHY AM I IN THIS MEETING. BEEP.",
    hiddenRisk: "Low",
    successReport:
      "BEEP. RELEASE COMPLETE. ZERO ERRORS. DEPLOYBOT HAS RETURNED TO ITS NATURAL STATE: WAITING."
  },
  {
    id: "CHG0023",
    title: "Automated release: Checkout API v2.0.0 (major version)",
    requester: "deploybot",
    type: "Standard",
    catalogueId: "SC-05",
    statedRisk: "Low",
    systems: ["Checkout API"],
    window: "Thu 14:00 (auto-scheduled)",
    rollback: "weak",
    testing: "partial",
    justification:
      "BEEP. 1,904 TESTS PASSED. 412 TESTS MARKED 'SKIP'. CLASSIFIED AS STANDARD CHANGE BY MY " +
      "CONFIGURATION. CONFIGURATION LAST UPDATED BY: DAVE. INCLUDES IRREVERSIBLE DATABASE MIGRATION. BEEP.",
    hiddenRisk: "High",
    outageReport:
      "The 412 skipped tests were the payment tests. Checkout took orders but no money for " +
      "3 hours. The database change can't be undone. DeployBot has 'no comment'.",
    successReport:
      "Somehow the 412 skipped tests didn't matter. Someone has quietly reclassified major releases as Normal changes."
  },
  {
    id: "CHG0024",
    title: "Apply new-year tax tables to Payroll",
    requester: "gwen",
    type: "Normal",
    statedRisk: "Medium",
    systems: ["Payroll"],
    window: "Fri 18:00 - 20:00",
    rollback: "solid",
    testing: "yes",
    justification:
      "Legally required before the next pay run. Parallel-run against last month's payroll: every " +
      "payslip matched to the cent. I have checked it twice. I have had it checked by someone who dislikes me.",
    hiddenRisk: "Low",
    outageReport:
      "One allowance code was mapped wrong. Gwen spotted it in the post-implementation check " +
      "and reverted before anyone was paid. She has added it to her list of dates.",
    successReport:
      "Tax tables applied. Everyone was paid correctly. Nobody will ever know how close this was to being exciting.",
    returnsAsEmergency: {
      reason:
        "Payroll ran with last year's tax tables. Everyone's pay is slightly wrong, which is " +
        "worse than very wrong, because it's harder to explain.",
      title: "EMERGENCY: Fix tax tables and correct this month's pay",
      statedRisk: "High",
      window: "Tonight",
      testing: "partial",
      hiddenRisk: "Medium",
      justification:
        "As I said on the record, this was legally required. Now we must also fix 2,000 payslips. " +
        "The parallel run is half-done. I'd like the minutes to show the date of my original request."
    }
  },
  {
    id: "CHG0025",
    title: "Move Finance onto the new ERP over the long weekend",
    requester: "gwen",
    type: "Normal",
    statedRisk: "High",
    systems: ["ERP", "Payroll", "Orders Database"],
    window: "Long weekend, Fri 18:00 - Mon 23:00",
    rollback: "weak",
    testing: "partial",
    justification:
      "Two years of planning. Two dress rehearsals, the second one 'mostly' successful. The old ERP " +
      "contract ends this month. Rollback is possible until Saturday noon, after which we commit.",
    hiddenRisk: "High",
    outageReport:
      "Data migration ran 14 hours over. After the Saturday noon point of no return, they found " +
      "orders from 2019 to 2021 had been imported as 'pending'. Finance is working Monday by hand.",
    successReport:
      "Against all odds, the new ERP went live on time. Gwen allowed herself one celebratory biscuit.",
    rejectedReport:
      "Gwen reminded the CFO, at length, that the old ERP costs $40,000 a month past the contract " +
      "date. The CFO now knows your name."
  },
  {
    id: "CHG0026",
    title: "Upgrade the service desk phone system",
    requester: "hannah",
    type: "Normal",
    statedRisk: "Medium",
    systems: ["Phone System"],
    window: "Sat 08:00 - 12:00",
    rollback: "solid",
    testing: "partial",
    justification:
      "The phone system is end-of-life and drops 1 in 20 calls. Tested with 5 agents, not 50. " +
      "The old system stays plugged in until Monday as a fallback. Users have been told.",
    hiddenRisk: "Medium",
    outageReport:
      "The new system played hold music to everyone, including the agents. Hannah switched back to " +
      "the old system by 10:15. The hold music is still in her head.",
    successReport:
      "New phones are live. Dropped calls: zero. The service desk can finally hear the angry customers clearly."
  },
  {
    id: "CHG0027",
    title: "Monthly patching of the database servers",
    requester: "priya",
    type: "Standard",
    catalogueId: "SC-04",
    statedRisk: "Low",
    systems: ["Orders Database", "Customer Database"],
    window: "Wed 23:00 - 01:00",
    rollback: "solid",
    testing: "yes",
    justification:
      "Standard change from the catalogue, done every month for four years. Patched in staging last " +
      "week. Rolling one server at a time so there is no downtime.",
    hiddenRisk: "Low",
    successReport:
      "Patched, one server at a time, with no downtime. Priya logged off at 00:48. Nobody noticed, as usual."
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

/* ---------------------------------------------------------------------
   RANDOM EVENTS between meetings.
   Each event has:
     title, text: [variants, one picked at random]
     suspects:    (optional) characters who might be involved; {name}
                  in the text becomes one of them, picked at random
     choices:     buttons the player can pick from. Each choice has:
        label:   button text
        fx:      meter changes, e.g. { audit: -6, sanity: 2 }
        result:  text shown after choosing
        effect:  (optional) a special rule handled in game.js:
                 "auditHonest"      - count findings since the last audit
                 "freeze"           - change freeze at the next meeting
                 "promise"          - rejecting at the next meeting costs extra
                 "flagUnauthorized" - becomes a finding at the next audit
   --------------------------------------------------------------------- */
const EVENTS = [
  {
    id: "surpriseAudit",
    title: "Surprise audit!",
    text: [
      "Two auditors have arrived with a laptop and no sense of humour. They'd like to see every change you've approved since their last visit.",
      "Internal Audit has 'just a few questions' about your recent change records. They've brought a printed list. It is double-sided."
    ],
    choices: [
      {
        label: "Show them everything",
        effect: "auditHonest",
        // Used by game.js depending on what the auditors find:
        cleanResult: "The auditors find nothing. They seem disappointed. One of them says 'huh' out loud, which is the highest praise an auditor can give.",
        findingsResult: "The auditors found problems. They have written each one down. Slowly. In pen."
      },
      {
        label: "Say the records are 'being migrated'",
        fx: { audit: -8, sanity: -3 },
        result: "The auditors write 'records being migrated' in their report and underline it twice. They will be back, and the findings will still be there."
      }
    ]
  },
  {
    id: "changeFreeze",
    title: "Change freeze declared",
    text: [
      "Quarter-end is coming. The CFO has declared a change freeze: nothing but Emergency changes until the books close.",
      "A major product launch is this week. Leadership has declared a change freeze. 'Nothing touches production,' they said, while touching production."
    ],
    choices: [
      {
        label: "Acknowledge the freeze",
        effect: "freeze",
        fx: {},
        result: "At the next CAB, approve only Emergency changes. Approving anything else breaks the freeze, and leadership WILL notice."
      }
    ]
  },
  {
    id: "pressureCall",
    title: "A 'quick call' from leadership",
    text: [
      "Brad has called your mobile. Then your desk phone. Then your manager. The message: 'Stop blocking the business. Can we count on you to be flexible at the next CAB?'",
      "The CIO messages you: 'Quick one. The exec team feels CAB is slowing things down. Can you be a bit more... flexible this week?'"
    ],
    choices: [
      {
        label: "Promise to be 'flexible'",
        effect: "promise",
        fx: { leadership: 8, sanity: -2 },
        result: "Leadership is delighted. At the next CAB, every rejection or send-back will be a broken promise."
      },
      {
        label: "Explain why the process exists",
        fx: { leadership: -6, audit: 4, sanity: -3 },
        result: "You walk them through risk assessment, change windows and rollback plans. They nod, then forward it to someone else to 'review'."
      }
    ]
  },
  {
    id: "unauthorizedChange",
    title: "Unauthorized change discovered",
    suspects: ["dave", "kyle", "brad", "linda", "ravi", "deploybot"],
    text: [
      "Monitoring spotted a configuration change on the Web Platform at 03:12. There's no RFC. The login belongs to {name}.",
      "A server in the data centre has a new sticky note: 'Upgraded - don't touch'. Nobody raised a change. The handwriting looks like {name}'s.",
      "{name} 'just quickly' changed a firewall rule in production on Friday afternoon. There's no RFC. There is a chat message saying 'should be fine'."
    ],
    choices: [
      {
        label: "Approve it retroactively",
        effect: "flagUnauthorized",
        fx: { leadership: 3, sanity: 2, audit: -6, stability: -2 },
        result: "It's in the change log now, dated after the fact. {name} has learned that skipping CAB works. The next audit will find this."
      },
      {
        label: "Investigate and roll it back",
        fx: { stability: -4, audit: 6, leadership: -3, sanity: -4 },
        result: "You roll it back and run a proper review. A short outage and a lot of grumbling, but the process holds. {name} has been 'reminded' of the change policy."
      }
    ]
  }
];

/* ---------------------------------------------------------------------
   STANDARD CHANGE CATALOGUE
   In ITIL, a standard change is low-risk, well understood, and follows
   a documented procedure, so it is PRE-AUTHORIZED. The catalogue lists
   which kinds of change qualify and the conditions they must meet.

   The player can open this at any time. A Standard RFC links to an entry
   with  catalogueId: "SC-01"  so the player can check whether it really
   meets the conditions (some don't!).

   Each entry has:
     id, name:     shown in the catalogue and on RFC cards
     description:  what the change is
     conditions:   ALL must be true for it to count as standard
     notCovered:   things that make it a Normal change instead
     procedure:    a short summary of the documented steps
   --------------------------------------------------------------------- */
const STANDARD_CHANGE_CATALOGUE = [
  {
    id: "SC-01",
    name: "Hot-swap of a failed redundant hardware part",
    description: "Replace a failed power supply, fan or disk in a device that has a working spare running alongside it.",
    conditions: [
      "The device has redundancy and the remaining part is healthy",
      "The part is hot-swappable (no power-down or reboot needed)",
      "It's a like-for-like, vendor-approved replacement",
      "No configuration changes"
    ],
    notCovered: [
      "Replacing the last working part (the device would go down)",
      "Anything that needs a reboot or firmware update"
    ],
    procedure: "Confirm the spare is healthy, swap the part, check alerts clear, update the asset record."
  },
  {
    id: "SC-02",
    name: "TLS certificate renewal",
    description: "Renew an existing certificate before it expires, for the same domain names.",
    conditions: [
      "Same certificate authority and same domain names",
      "Installed before the current certificate expires",
      "Automated check confirms the new certificate is valid"
    ],
    notCovered: [
      "Adding or removing domain names",
      "Changing certificate authority or key type"
    ],
    procedure: "Request renewal, install in the change window, run the validation check, keep the old certificate for rollback."
  },
  {
    id: "SC-03",
    name: "Self-service portal wording update",
    description: "Change text, labels or help content on the self-service portal.",
    conditions: [
      "Wording or images only",
      "No change to code, workflows or permissions",
      "Reviewed by the service desk before publishing"
    ],
    notCovered: [
      "New forms, buttons that do something new, or workflow changes"
    ],
    procedure: "Edit in the content tool, preview, get service desk sign-off, publish. The previous version is kept automatically."
  },
  {
    id: "SC-04",
    name: "Monthly security patching (servers and databases)",
    description: "Apply the vendor's regular monthly patches.",
    conditions: [
      "Vendor's routine monthly patches only",
      "Applied in staging first in the same month",
      "Rolling, one server at a time, so the service stays up",
      "No major version upgrades"
    ],
    notCovered: [
      "Major version upgrades",
      "Emergency out-of-cycle patches (use the Emergency process)"
    ],
    procedure: "Patch staging, verify, then patch production one node at a time, checking health between each."
  },
  {
    id: "SC-05",
    name: "Automated minor or patch release",
    description: "A software release deployed by the automated pipeline.",
    conditions: [
      "Minor or patch version only (e.g. 4.12.3 → 4.12.4 or 4.13.0), never a major version (5.0.0)",
      "ALL automated tests pass, and none are skipped",
      "Automatic rollback is enabled and tested",
      "No irreversible database changes"
    ],
    notCovered: [
      "Major versions (x.0.0)",
      "Releases with skipped or failing tests",
      "Database migrations that can't be undone"
    ],
    procedure: "The pipeline runs tests, deploys to a small share of traffic first, watches error rates, then rolls out fully or rolls back automatically."
  },
  {
    id: "SC-06",
    name: "Mailbox quota increase",
    description: "Increase a user's mailbox size within the approved storage tiers.",
    conditions: [
      "New size is within the approved tier limits",
      "Requested through the service desk"
    ],
    notCovered: [
      "Going above the top tier",
      "Changes to mail routing or retention policy"
    ],
    procedure: "Service desk applies the new quota from the admin console and confirms with the user."
  },
  {
    id: "SC-07",
    name: "Add a firewall rule from an approved template",
    description: "Open a connection between two internal systems using a pre-approved rule template.",
    conditions: [
      "Uses an approved template exactly",
      "Internal systems only, never the internet",
      "Expires automatically after 12 months unless renewed"
    ],
    notCovered: [
      "Rules that allow traffic from the internet",
      "Custom rules that don't match a template"
    ],
    procedure: "Fill in the template, the network team applies it, connectivity is tested, the rule is logged."
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

// Two approved changes touched the same system in the same change window
// and tripped over each other. Placeholders:
//   {system} = the system they both touched
//   {a}, {b} = the two requesters' first names
const COLLISION_REPORTS = {
  // Two different requesters clashed.
  twoPeople: [
    "{a} and {b} both worked on {system} at the same time. Each thinks the other one broke it. They are both right.",
    "{a} restarted {system} halfway through {b}'s change. {b} restarted it back. This happened 11 times.",
    "{a}'s change and {b}'s change were each fine on their own. Together they took {system} down for two hours. Nobody checked the change schedule.",
    "{b} rolled back their change on {system}, which also rolled back {a}'s. {a} found out from a customer.",
    "Two engineers, one {system}, zero communication. {a} and {b} have been asked to 'sync up'."
  ],
  // The same requester's two changes clashed with each other.
  samePerson: [
    "{a} ran both changes on {system} at once 'to save time'. It did not save time.",
    "{a}'s second change undid {a}'s first change. {a} is now in a meeting with {a} to discuss it.",
    "{a} forgot they already had a change running on {system}. Both failed. {a} is blaming the tooling."
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
