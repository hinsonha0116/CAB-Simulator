/* =====================================================================
   CAB SIMULATOR - SCENARIO DATA (military IT setting)
   ---------------------------------------------------------------------
   This file holds the game's shared CONTENT: characters, report text,
   events, ratings and the Standard Change Catalogue.

   The change requests themselves live in the data/ folder, one file
   per category (about 100 each, 500 in total):
     data/rfcs-firewalls.js   FW-xxx
     data/rfcs-routers.js     RT-xxx
     data/rfcs-switches.js    SW-xxx
     data/rfcs-servers.js     SV-xxx
     data/rfcs-software.js    UP-xxx

   >>> Full guide with examples: HOW-TO-ADD-SCENARIOS.md <<<
   After editing, refresh the game. Typos show up in a red box.

   WHAT'S IN THIS FILE (in order)
   - RFCS:                the (empty) list the data/ files add to
   - RFC_CATEGORIES:      which id prefix means which kind of change
   - CHARACTERS:          the recurring requesters and their reactions
   - GENERIC_REPORTS:     incident report text, per category
   - COLLISION_REPORTS:   two approved changes on the same system clash
   - RESUBMISSION_NOTES:  what a sent-back RFC says when it returns
   - MEETING_INTROS:      scene-setting lines shown before each meeting
   - PERFORMANCE_RATINGS: end-of-week titles and jokes
   - EVENTS:              random events between meetings
   - STANDARD_CHANGE_CATALOGUE: pre-authorized change types

   ITIL quick reference (used to flavour the scenarios):
   - Standard change:  low risk, pre-authorized, follows a known procedure.
   - Normal change:    needs assessment and authorization (that's you, CAB).
   - Emergency change: must happen ASAP (e.g. an active intrusion or a
                       failed critical device). Expedited, but still recorded.
   - Change freeze:    a period (exercise, inspection, VIP visit) when only
                       emergency changes go in. Everything else waits ON HOLD.
   - Remediation / rollback plan: how you get back to a working state if
                       the change fails. This decides how BAD an outage is.
   - Testing evidence: proof it works before production. This decides how
                       LIKELY an outage is.
   ===================================================================== */

// The data/ files add their change requests to this list.
const RFCS = [];

// An RFC's id prefix decides its category, e.g. "FW-012" is a firewall
// change. The category picks which generic incident reports are used.
const RFC_CATEGORIES = {
  FW: "firewall",
  RT: "router",
  SW: "switch",
  SV: "server",
  UP: "software"
};

/* ---------------------------------------------------------------------
   CHARACTERS
   clout:         how likely they are to escalate a rejection (Low/Medium/High)
   followThrough: how likely they are to IMPROVE an RFC you sent back
   shortName:     used in report text, e.g. "SSG Kowalski"
   reactions.hold is optional (used when you place a change on hold)
   --------------------------------------------------------------------- */
const CHARACTERS = {
  reyes: {
    name: "Capt. Elena Reyes",
    shortName: "Capt. Reyes",
    role: "Battalion S6 (Communications Officer)",
    clout: "Medium",
    followThrough: "High",
    personality: "Runs the network like a range card: every sector covered, every risk drawn.",
    reactions: {
      approve: "Capt. Reyes nods and updates the comms plan before you've finished talking.",
      reject: "Capt. Reyes says 'Roger, understood' in a tone that means 'we'll discuss this later'.",
      sendBack: "Capt. Reyes has the revised RFC on your desk by 0600.",
      hold: "Capt. Reyes adds it to the post-freeze execution checklist. Colour-coded."
    }
  },
  kowalski: {
    name: "SSG Dave Kowalski",
    shortName: "SSG Kowalski",
    role: "Network Operations NCOIC",
    clout: "Medium",
    followThrough: "Low",
    personality: "Believes 'if it ain't broke, upgrade it anyway' is doctrine.",
    reactions: {
      approve: "SSG Kowalski is already consoled in. He was consoled in before you clicked.",
      reject: "SSG Kowalski mutters something about 'paper-pushers' and goes to get a Monster.",
      sendBack: "SSG Kowalski replies 'more info like what, sir?' and disappears to the motor pool.",
      hold: "SSG Kowalski says 'hold, aye' and immediately asks when the freeze ends. Twice."
    }
  },
  whitfield: {
    name: "COL Bradley Whitfield",
    shortName: "COL Whitfield",
    role: "Garrison Commander (via his Executive Officer)",
    clout: "High",
    followThrough: "Low",
    personality: "Everything is a priority. Everything must be done before the General visits.",
    reactions: {
      approve: "The XO reports the Colonel is 'very pleased'. Nobody has ever seen him pleased.",
      reject: "The XO asks for your full name and the correct spelling of it.",
      sendBack: "The XO replies-all to the entire staff: 'Who is the blocker here?'",
      hold: "The XO asks, with great politeness, whether the Colonel's request is 'really' on hold."
    }
  },
  morgan: {
    name: "Morgan Lee",
    shortName: "Morgan",
    role: "Cyber Defense Analyst (civilian)",
    clout: "Medium",
    followThrough: "High",
    personality: "Has not slept since the last IAVA. Cannot stop saying 'CVE'.",
    reactions: {
      approve: "Morgan exhales for the first time in 36 hours.",
      reject: "Morgan opens a risk acceptance memo with your name already filled in.",
      sendBack: "Morgan stares at the VTC camera for an uncomfortably long time.",
      hold: "Morgan logs the hold and starts a countdown timer. It's visible on the big screen."
    }
  },
  okafor: {
    name: "Mrs. Linda Okafor",
    shortName: "Mrs. Okafor",
    role: "Installation Network Engineer (31 years)",
    clout: "Low",
    followThrough: "Medium",
    personality: "Pulled the original fibre through the tunnels. Possibly IS the network.",
    reactions: {
      approve: "Mrs. Okafor says 'thank you, dear' and is done before the meeting ends.",
      reject: "Mrs. Okafor reminds the board she's been doing this since before they enlisted.",
      sendBack: "Mrs. Okafor resubmits the exact same form, now in a font from 1994.",
      hold: "Mrs. Okafor says she's held changes through four freezes and a hurricane."
    }
  },
  brandt: {
    name: "Kyle Brandt",
    shortName: "Kyle",
    role: "Field Service Rep, Sentinel Federal Systems (contractor)",
    clout: "Medium",
    followThrough: "Medium",
    personality: "Calls every patch a 'value-add'. Has never read the contract's statement of work.",
    reactions: {
      approve: "Kyle thanks you for 'partnering on this mission' and asks where the CAC reader is.",
      reject: "Kyle mentions, casually, that the support contract is up for renewal.",
      sendBack: "Kyle forwards your question to 'the engineering folks' in another time zone.",
      hold: "Kyle asks whether the hold affects billable hours. It does. He's thrilled."
    }
  },
  ortiz: {
    name: "SFC Hannah Ortiz",
    shortName: "SFC Ortiz",
    role: "Service Desk NCOIC",
    clout: "Low",
    followThrough: "High",
    personality: "Takes 400 tickets a day. The only person who reads the change calendar.",
    reactions: {
      approve: "SFC Ortiz briefs the help desk so they know what's coming. Nobody else ever does.",
      reject: "SFC Ortiz sighs and adds a new canned response for 'yes, we know'.",
      sendBack: "SFC Ortiz resubmits with a user notification plan attached. Again.",
      hold: "SFC Ortiz updates the help desk script: 'It's on hold for the freeze, Sergeant.'"
    }
  },
  nakamura: {
    name: "PFC Tess Nakamura",
    shortName: "PFC Nakamura",
    role: "IT Specialist (three weeks in the unit)",
    clout: "Low",
    followThrough: "High",
    personality: "Answers every question with complete, terrifying honesty.",
    reactions: {
      approve: "PFC Nakamura whispers 'oh no, it's real now' and unmutes by accident.",
      reject: "PFC Nakamura says 'that's totally fair, Sir' and quietly turns her camera off.",
      sendBack: "PFC Nakamura writes down every word you said, including 'um'.",
      hold: "PFC Nakamura asks what a freeze is. Then asks if it's a real freeze or a training freeze."
    }
  },
  menon: {
    name: "Mr. Ravi Menon",
    shortName: "Mr. Menon",
    role: "Enterprise Architect, Higher HQ G6",
    clout: "Medium",
    followThrough: "Medium",
    personality: "Every change needs a diagram. Every diagram needs a diagram.",
    reactions: {
      approve: "Mr. Menon shares his screen to show the 'approved' state in a new diagram.",
      reject: "Mr. Menon says the rejection is 'not aligned with the target architecture'.",
      sendBack: "Mr. Menon promises a revised slide deck. It will be longer.",
      hold: "Mr. Menon adds a 'Freeze' swim lane to the diagram."
    }
  },
  patchbot: {
    name: "PATCHBOT 3000",
    shortName: "PATCHBOT",
    role: "Automated Patch & Deployment System",
    clout: "Low",
    followThrough: "High",
    personality: "Raises its own changes. Does not understand sarcasm, freezes or weekends.",
    reactions: {
      approve: "BEEP. CHANGE APPROVED. DEPLOYING. HAVE A MISSION-CAPABLE DAY, HUMAN.",
      reject: "BEEP. REJECTION LOGGED. RETRYING IN 5 MINUTES.",
      sendBack: "BEEP. 'MORE INFO' IS NOT A RECOGNISED COMMAND. ATTACHING 40,000 LOG LINES.",
      hold: "BEEP. 'HOLD' ACKNOWLEDGED. RESUMING AUTOMATICALLY WHEN FREEZE = FALSE."
    }
  },
  albright: {
    name: "MAJ Gwen Albright",
    shortName: "MAJ Albright",
    role: "Deputy G6",
    clout: "High",
    followThrough: "Medium",
    personality: "Remembers every outage since 2009, by date and by name of the person responsible.",
    reactions: {
      approve: "MAJ Albright nods once. You feel like you passed an inspection you didn't know about.",
      reject: "MAJ Albright writes something in her green notebook. You'll find out at your evaluation.",
      sendBack: "MAJ Albright asks for your questions in a memo, 'so there's a record'.",
      hold: "MAJ Albright approves of the hold. Silently. You can tell by the eyebrow."
    }
  },
  jackson: {
    name: "CW2 Marcus Jackson",
    shortName: "CW2 Jackson",
    role: "Network Warrant Officer",
    clout: "Medium",
    followThrough: "High",
    personality: "Speaks only in short sentences. Knows where every cable goes and why.",
    reactions: {
      approve: "CW2 Jackson says 'Copy.' and leaves.",
      reject: "CW2 Jackson says 'Copy.' and leaves, but more quietly.",
      sendBack: "CW2 Jackson resubmits with a 2-page technical annex. No adjectives.",
      hold: "CW2 Jackson says 'Smart.' This is the most he has ever said in CAB."
    }
  }
};

/* ---------------------------------------------------------------------
   GENERIC INCIDENT REPORTS
   Used when an RFC doesn't have its own outageReport / successReport.
   outage and success have one list per category (see RFC_CATEGORIES),
   plus "any" which is used for every category.
   Placeholders: {system} = first affected system, {name} = requester.
   --------------------------------------------------------------------- */
const GENERIC_REPORTS = {
  outage: {
    firewall: [
      "The new rule set on the {system} blocked more than intended. Including the CAB's own VTC.",
      "{system} rejected all traffic for 40 minutes. Technically, the network has never been more secure.",
      "A rule was added above the 'deny all' instead of below it. The {system} let nothing through until it was rolled back.",
      "The {system} failed over mid-change and both units decided they were in charge. Neither was."
    ],
    router: [
      "A routing change on the {system} sent traffic in a perfect circle for an hour.",
      "The {system} dropped its neighbours. Half the installation was briefly an island.",
      "Someone pasted the config into the wrong router. The {system} now believes it is in Germany.",
      "The {system} rebooted and took 25 minutes to come back. Units reverted to runners and handwritten notes."
    ],
    switch: [
      "A loop on the {system} took down the building network. The blinking lights were described as 'festive'.",
      "The {system} came back with the wrong VLANs. Soldiers in one building could print to a printer three buildings away.",
      "The {system} rebooted out of order. The help desk received 200 calls in 10 minutes.",
      "Spanning tree reconverged on the {system}. Everyone's network dropped for 'just a second'. For 45 minutes."
    ],
    server: [
      "The {system} did not come back after the reboot. It is now 'thinking about it'.",
      "The {system} came back up, but the service on it didn't. Nobody noticed until morning formation.",
      "Disk space on the {system} filled up during the change. Logs, backups and morale all stopped.",
      "The {system} lost its certificates during the change. Every user got a security warning before breakfast."
    ],
    software: [
      "The update broke {system} logins for anyone with an older CAC. Which was most of the battalion.",
      "The update rebooted {system} in the middle of a briefing. The Colonel's slides did not survive.",
      "{system} started crashing on launch after the update. The help desk queue is now a parade formation.",
      "The update conflicted with the endpoint security agent on {system}. Each one quarantined the other."
    ],
    any: [
      "{system} became unavailable shortly after implementation. The help desk queue is longer than the change record.",
      "{system} went down. The monitoring dashboard is a lovely shade of red."
    ]
  },
  success: {
    firewall: [
      "Rule change on the {system} went in cleanly. Traffic flows. Threats don't.",
      "{system} updated with zero dropped sessions. The Cyber team actually said 'nice'."
    ],
    router: [
      "{system} change completed. Routes converged in seconds. Nobody noticed, which is the goal.",
      "{system} updated on schedule. The network map is still green."
    ],
    switch: [
      "{system} change completed with no user impact. {name} labelled every port by hand.",
      "{system} updated. Not a single help desk call. Suspiciously quiet."
    ],
    server: [
      "{system} patched and back up in under 10 minutes. Monitoring stayed green throughout.",
      "{system} change completed. Users came in the next morning and noticed nothing at all."
    ],
    software: [
      "Update rolled out to {system} with no issues reported. SFC Ortiz's phone stayed silent.",
      "{system} updated and compliant. The compliance dashboard went from red to green. Someone took a screenshot."
    ],
    any: [
      "Implemented on schedule. {system} is fine. Suspiciously fine.",
      "Change completed with no incidents. Someone even updated the documentation."
    ]
  },
  // A rejected requester went over your head (used if no rejectedReport).
  escalation: [
    "{name} escalated your rejection up the chain of command. It came back down with extra questions attached.",
    "{name} raised it at the Commander's update brief. Your name was mentioned. Twice.",
    "{name} has asked the Sergeant Major to 'have a word' with you."
  ],
  // You rejected a change that really WAS dangerous. Well done.
  dodged: [
    "Good call. Another installation tried the same change and lost their network for a day. {name} has gone quiet.",
    "On closer inspection, this would have broken {system}. {name} has stopped mentioning it.",
    "The vendor has just pulled the version {name} wanted to install. Nice instincts."
  ]
};

// Two approved changes touched the same system in the same change window
// and tripped over each other. Placeholders:
//   {system} = the system they both touched
//   {a}, {b} = the two requesters' names
const COLLISION_REPORTS = {
  twoPeople: [
    "{a} and {b} both worked on the {system} at the same time. Each thinks the other one broke it. They are both right.",
    "{a} rebooted the {system} halfway through {b}'s change. {b} rebooted it back. This happened 11 times.",
    "{a}'s change and {b}'s change were each fine on their own. Together they took the {system} down for two hours. Nobody checked the change schedule.",
    "{b} rolled back their change on the {system}, which also rolled back {a}'s. {a} found out from a very angry First Sergeant."
  ],
  samePerson: [
    "{a} ran both changes on the {system} at once 'to save time'. It did not save time.",
    "{a}'s second change undid {a}'s first change. {a} has been counselled by {a}.",
    "{a} forgot there was already a change running on the {system}. Both failed."
  ]
};

// Notes shown on a sent-back RFC when it returns to the agenda.
// {name} becomes the requester's name.
const RESUBMISSION_NOTES = {
  improved: [
    "{name} has done the homework this time.",
    "{name} took the feedback seriously. Who knew?",
    "Resubmitted with real evidence attached. {name} looks tired but proud."
  ],
  unchanged: [
    "{name} has resubmitted it unchanged, with 'as discussed' in the subject line.",
    "{name} changed the font and nothing else.",
    "Identical to last time, but now marked PRIORITY in red."
  ],
  withdrawn: [
    "{name} has withdrawn the change and is telling everyone that CAB is where changes go to die.",
    "{name} has given up and is 'exploring options that don't involve CAB'. This is worrying."
  ]
};

// Short scene-setting lines shown before each meeting (picked at random).
const MEETING_INTROS = [
  "The VTC has frozen on the Sergeant Major's face. Nobody dares to mention it.",
  "Half the board is in the field. One member is dialling in from a Humvee.",
  "The agenda was sent 4 minutes ago. Two RFCs were added during the meeting.",
  "The conference room projector needs a change request to fix the projector.",
  "Someone brought donuts. Attendance is unusually high.",
  "The meeting room was double-booked with a safety stand-down. Both meetings are happening at once.",
  "The SIPR terminal in the conference room has been 'updating' since Tuesday."
];

// End-of-week performance titles. game.js decides WHICH one you get.
const PERFORMANCE_RATINGS = {
  incidentFactory: {
    title: "Chief of Unplanned Outages",
    blurb: "The help desk has a dartboard. Your photo is on it."
  },
  wallOfNo: {
    title: "The Concertina Wire",
    blurb: "Nothing gets through you. Not threats, not patches, not the Colonel's VTC upgrade."
  },
  needsMoreInfo: {
    title: "Professional Memo Generator",
    blurb: "Every RFC comes back with a new memo. Your backlog now needs its own ATO."
  },
  rubberStamp: {
    title: "Rubber Stamp, Signal Corps",
    blurb: "You approved almost everything. Some of it caught fire. You remain optimistic."
  },
  actuallyGood: {
    title: "Actually Squared Away",
    blurb: "Changes went in, nothing broke. Nobody will ever thank you, which is how you know it went well."
  },
  cautious: {
    title: "Cautiously Mission Capable",
    blurb: "No outages, but a fair few annoyed requesters. A respectable week of risk management."
  },
  mediocre: {
    title: "Meets the Standard (Barely)",
    blurb: "Some wins, some fires. Your evaluation will call you 'a solid performer'. Everyone knows what that means."
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
    title: "No-notice cyber inspection!",
    text: [
      "An inspection team from higher HQ has arrived for a no-notice Command Cyber Readiness Inspection. They'd like every change record since their last visit.",
      "The Inspector General's office has 'just a few questions' about your change records. They've brought a printed list. It's double-sided."
    ],
    choices: [
      {
        label: "Show them everything",
        effect: "auditHonest",
        cleanResult: "The inspectors find nothing. One of them says 'huh' out loud, which is the highest praise an inspector can give.",
        findingsResult: "The inspectors found problems. Each one is now a finding in the out-brief. With your name on the slide."
      },
      {
        label: "Say the records are 'on the SIPR side'",
        fx: { audit: -8, sanity: -3 },
        result: "The inspectors write 'records unavailable' in their report and underline it twice. They will be back, and the findings will still be there."
      }
    ]
  },
  {
    id: "changeFreeze",
    title: "Change freeze declared",
    text: [
      "A major field exercise starts next week. The Commander has frozen all non-emergency changes to the network.",
      "The Commanding General is visiting the installation. Nothing touches the network until the motorcade leaves.",
      "A deployment readiness exercise has been called. The network is frozen: emergency changes only.",
      "Holiday block leave starts Friday, and half the network team is gone. Leadership has declared a change freeze."
    ],
    choices: [
      {
        label: "Acknowledge the freeze",
        effect: "freeze",
        fx: {},
        result: "At the next CAB, approve only Emergency changes. Everything else should be placed ON HOLD until the freeze lifts. Approving it anyway breaks the freeze, and the Command WILL notice."
      }
    ]
  },
  {
    id: "pressureCall",
    title: "A 'quick call' from the Colonel's office",
    text: [
      "COL Whitfield's XO has called your desk phone, your mobile and your First Sergeant. The message: 'The Colonel needs CAB to be flexible this week.'",
      "The Command Sergeant Major stops you in the hallway: 'Sir, the Commander feels CAB is slowing down the mission. Can we count on you to be flexible?'"
    ],
    choices: [
      {
        label: "Promise to be 'flexible'",
        effect: "promise",
        fx: { leadership: 8, sanity: -2 },
        result: "The Command is delighted. At the next CAB, every rejection or send-back will be a broken promise."
      },
      {
        label: "Explain why the process exists",
        fx: { leadership: -6, audit: 4, sanity: -3 },
        result: "You brief them on risk management, change windows and rollback plans. They nod politely, then forward it to the XO for 'review'."
      }
    ]
  },
  {
    id: "unauthorizedChange",
    title: "Unauthorized change discovered",
    suspects: ["kowalski", "brandt", "whitfield", "okafor", "menon", "patchbot"],
    text: [
      "The network monitoring system spotted a configuration change on a core switch at 0312. There's no RFC. The login belongs to {name}.",
      "A router in the comms closet has a new sticky note: 'Upgraded - don't touch'. Nobody raised a change. The handwriting looks like {name}'s.",
      "{name} 'just quickly' opened a port on the TOC firewall on Friday afternoon. There's no RFC. There's a chat message saying 'should be fine'."
    ],
    choices: [
      {
        label: "Approve it retroactively",
        effect: "flagUnauthorized",
        fx: { leadership: 3, sanity: 2, audit: -6, stability: -2 },
        result: "It's in the change log now, dated after the fact. {name} has learned that skipping CAB works. The next inspection will find this."
      },
      {
        label: "Investigate and roll it back",
        fx: { stability: -4, audit: 6, leadership: -3, sanity: -4 },
        result: "You roll it back and run a proper review. A short outage and a lot of grumbling, but the process holds. {name} has been 'counselled' on the change policy."
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
    description: "Replace a failed power supply, fan, disk or line card in a device that has a working spare running alongside it.",
    conditions: [
      "The device has redundancy and the remaining part is healthy",
      "The part is hot-swappable (no power-down or reboot needed)",
      "It's a like-for-like, vendor-approved replacement",
      "No configuration changes"
    ],
    notCovered: [
      "Replacing the last working part (the device would go down)",
      "Anything that needs a reboot, firmware update or config change"
    ],
    procedure: "Confirm the spare is healthy, swap the part, check alarms clear, update the property book."
  },
  {
    id: "SC-02",
    name: "DoD PKI server certificate renewal",
    description: "Renew an existing server or device certificate before it expires, for the same names.",
    conditions: [
      "Same issuing certificate authority and same host names",
      "Installed before the current certificate expires",
      "Validation check confirms the new certificate chain is trusted"
    ],
    notCovered: [
      "Adding or removing host names",
      "Changing certificate authority, key length or algorithm"
    ],
    procedure: "Request renewal, install in the change window, run the validation check, keep the old certificate for rollback."
  },
  {
    id: "SC-03",
    name: "Monthly STIG-compliant OS patching",
    description: "Apply the approved monthly patch baseline to servers.",
    conditions: [
      "Patches are from the approved monthly baseline only",
      "Applied in the test enclave first, in the same month",
      "Rolling, one server at a time, so the service stays up",
      "No major version upgrades"
    ],
    notCovered: [
      "Major version or operating system upgrades",
      "Out-of-cycle emergency patches (use the Emergency process)",
      "Servers with no redundant partner (patching takes the service down)"
    ],
    procedure: "Patch test enclave, verify, then patch production one node at a time, checking health between each."
  },
  {
    id: "SC-04",
    name: "Endpoint security definition update",
    description: "Daily antivirus and endpoint protection signature updates.",
    conditions: [
      "Signature/definition files only, no agent version change",
      "Delivered by the approved central management server",
      "Staged to a pilot group for 2 hours first"
    ],
    notCovered: [
      "Agent upgrades or new modules",
      "Policy changes (what gets blocked or quarantined)"
    ],
    procedure: "Management server pulls definitions, deploys to the pilot group, auto-promotes to all endpoints if no alerts."
  },
  {
    id: "SC-05",
    name: "Firewall rule from an approved template",
    description: "Open a connection between two internal systems using a pre-approved, ISSM-signed rule template.",
    conditions: [
      "Uses an approved template exactly",
      "Internal systems only, never to or from the internet",
      "Named source and destination: no 'any'",
      "Expires automatically after 12 months unless renewed"
    ],
    notCovered: [
      "Rules that allow traffic from outside the network",
      "Custom rules that don't match a template",
      "Any rule containing 'any' as source, destination or port"
    ],
    procedure: "Fill in the template, the firewall team applies it, connectivity is tested, the rule is logged with an expiry date."
  },
  {
    id: "SC-06",
    name: "Switch access-port VLAN assignment",
    description: "Move a user access port to a different VLAN from the approved VLAN list.",
    conditions: [
      "Access ports only, never trunk or uplink ports",
      "Target VLAN is on the approved list for that building",
      "Port security stays enabled"
    ],
    notCovered: [
      "Trunk, uplink or core switch ports",
      "Creating new VLANs",
      "Disabling port security"
    ],
    procedure: "Confirm the port and VLAN, apply the change, verify the device connects, update the port map."
  },
  {
    id: "SC-07",
    name: "Network device minor firmware update",
    description: "Update router or switch firmware within the same approved release train.",
    conditions: [
      "Same release train (e.g. 17.6.3 to 17.6.5), never a new major release",
      "Version is on the higher-HQ approved baseline",
      "Tested on the lab device first",
      "Redundant pairs updated one at a time"
    ],
    notCovered: [
      "Major version jumps (e.g. 16.x to 17.x)",
      "Devices with no redundant partner",
      "Versions not yet on the approved baseline"
    ],
    procedure: "Back up the config, update the standby device, fail over, verify, then update the other device."
  },
  {
    id: "SC-08",
    name: "Automated minor software release",
    description: "A minor software update deployed by the automated patch system.",
    conditions: [
      "Minor or patch version only (e.g. 4.12.3 to 4.12.4), never a major version (5.0.0)",
      "ALL automated tests pass, and none are skipped",
      "Automatic rollback is enabled and tested",
      "Pilot group first, then wider deployment"
    ],
    notCovered: [
      "Major versions (x.0.0)",
      "Releases with skipped or failing tests",
      "Deploying to every machine at once"
    ],
    procedure: "The system tests, deploys to a pilot group, watches for errors, then rolls out fully or rolls back automatically."
  },
  {
    id: "SC-09",
    name: "DNS record or DHCP reservation",
    description: "Add, change or remove a single internal DNS record or DHCP reservation.",
    conditions: [
      "Internal zones only",
      "One record or reservation per change",
      "Requested through the service desk with the system owner's approval"
    ],
    notCovered: [
      "Zone-wide changes, forwarders or external DNS",
      "Changes to DHCP scopes or options"
    ],
    procedure: "Service desk submits, the server team applies it, a lookup test confirms it, the ticket is closed."
  },
  {
    id: "SC-10",
    name: "Workstation re-image with the gold image",
    description: "Re-image a workstation or tactical laptop with the current approved gold image.",
    conditions: [
      "Uses the current, approved gold image",
      "One device or a small batch (under 25)",
      "User data backed up first"
    ],
    notCovered: [
      "New or modified images",
      "Servers or network devices",
      "Large batches across a whole unit at once"
    ],
    procedure: "Back up user data, re-image, join to the domain, restore data, confirm with the user."
  }
];
