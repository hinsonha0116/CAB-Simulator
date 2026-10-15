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
   - MEETING_INTROS:      scene-setting lines shown at the top of the CAB results
   - CAB_COMMENTS:        what the board says about the RFCs you sent them
   - MENTOR:              Chris, who debriefs you at the end of each week
   - PERFORMANCE_RATINGS: end-of-week titles and jokes
   - EVENTS:              random events between weeks
   - STANDARD_CHANGE_CATALOGUE: pre-authorized change types

   ITIL quick reference (used to flavour the scenarios):
   - Change Manager:   that's you. You check each RFC is complete and ready
                       before it goes to the CAB. You don't approve it.
   - CAB:              the Change Advisory Board. Meets weekly, assesses and
                       authorizes Normal changes.
   - ECAB:             the Emergency CAB. Convened quickly for Emergency changes.
   - Standard change:  low risk, pre-authorized, follows a known procedure.
                       Doesn't need the CAB at all.
   - Normal change:    needs assessment and authorization by the CAB.
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
   clout:         how likely they are to escalate when the CAB rejects their
                  change, and how much the board bends for them (Low/Medium/High)
   followThrough: how likely they are to IMPROVE an RFC that was sent back
   shortName:     used in report text, e.g. "SSG Kowalski"
   reactions:
     approve:  when the CAB approves their change
     reject:   when the CAB rejects their change
     sendBack: when YOU mark it not ready and send it back
     hold:     (optional) when you place it on hold during a freeze
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
  },
  annie: {
    name: "Annie Delgado",
    shortName: "Annie",
    role: "Firewall Engineer Extraordinaire",
    clout: "Medium",
    followThrough: "High",
    personality: "Knows every rule on every firewall by heart. Submits RFCs only when cornered. Has not forgiven Mason for The Incident of five years ago.",
    reactions: {
      approve: "Annie is already logged in. She mutters that at least Mason didn't get his hands on this one.",
      reject: "Annie asks the board, very calmly, whether Mason put them up to this.",
      sendBack: "Annie resubmits in nine minutes with a 40-line rule diff and the words 'happy now?'",
      hold: "Annie is fine with the hold. She'll spend the week fixing something Mason broke."
    }
  },
  mason: {
    name: "Mason Tidwell",
    shortName: "Mason",
    role: "Network Team Lead (in spirit) / Project Manager",
    clout: "Medium",
    followThrough: "Medium",
    personality: "A likeable redneck who runs the network team in spirit only. Hasn't logged in to a router since 2014. Keeps the project Gantt chart taped to the dashboard of his truck.",
    reactions: {
      approve: "Mason whoops, says 'Hot dang!' and goes to tell the boys to do whatever it was.",
      reject: "Mason says 'Well, shoot' and asks whether anybody read the part he left out.",
      sendBack: "Mason scratches his head and says he'll 'holler at the boys' about the missing bits.",
      hold: "Mason says the hold suits him fine. He's got a fishing trip that week anyway."
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
  ],
  // Special lines when these two people's changes clash with each other.
  rivalries: [
    {
      between: ["annie", "mason"],
      lines: [
        "Annie's change and Mason's change both hit the {system} in the same window. Annie fixed both in 20 minutes, then spent an hour writing an email about it. Mason has not opened the email.",
        "The {system} went down when Mason's project collided with Annie's change. Annie says this is exactly like what happened five years ago. Mason still doesn't know what happened five years ago.",
        "Mason's 'boys' and Annie were both working on the {system} at once. Annie's version of events is 14 pages long. Mason's is 'well, shoot'.",
        "Annie's and Mason's changes collided on the {system}. Annie has added this to The List. Nobody has ever seen The List, but everybody knows it exists."
      ]
    }
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

// Short scene-setting lines shown at the top of the CAB results (picked at random).
const MEETING_INTROS = [
  "The VTC has frozen on the Sergeant Major's face. Nobody dares to mention it.",
  "Half the board is in the field. One member is dialling in from a Humvee.",
  "The agenda was sent 4 minutes ago. Two RFCs were added during the meeting.",
  "The conference room projector needs a change request to fix the projector.",
  "Someone brought donuts. Attendance is unusually high.",
  "The meeting room was double-booked with a safety stand-down. Both meetings are happening at once.",
  "The SIPR terminal in the conference room has been 'updating' since Tuesday."
];

/* ---------------------------------------------------------------------
   CAB COMMENTS: what the board says about the RFCs you send them.
   The CAB is chaired by MAJ Albright, with CW2 Jackson and Morgan.
     wellPrepared:   a Normal change you sent that WAS ready
     borderline:     one with some gaps
     poorlyPrepared: one that should never have reached the board
     standardLogged: a Standard change you logged (it skips the board)
     ecab:           opening line for an Emergency CAB
     freezePulled:   a non-emergency you sent during a change freeze
   --------------------------------------------------------------------- */
const CAB_COMMENTS = {
  wellPrepared: [
    "MAJ Albright: 'Rollback plan, test evidence, a sensible window. This is what an RFC should look like.'",
    "CW2 Jackson: 'Clean.' He moves to the next item. From him, that's a standing ovation.",
    "Morgan: 'No security concerns. I'm almost suspicious.'",
    "The board gets through it in under a minute. MAJ Albright nods at you."
  ],
  borderline: [
    "MAJ Albright: 'There are gaps here, but I can live with them.'",
    "CW2 Jackson asks two pointed questions. The requester answers one of them.",
    "Morgan: 'Partial testing. I'll be watching the logs that night.'",
    "The board debates it for ten minutes. Opinions are split."
  ],
  poorlyPrepared: [
    "MAJ Albright: 'Who reviewed this before it reached my board?' Everyone turns to look at you.",
    "CW2 Jackson reads the rollback section aloud. It takes two seconds. He stares at you.",
    "Morgan: 'There's no testing evidence. None. Why is this on the agenda?'",
    "The board spends 25 minutes on this RFC and the rest of the agenda runs late. MAJ Albright writes something in her green notebook."
  ],
  standardLogged: [
    "Logged as a pre-authorized standard change. It never needed the board's time.",
    "Recorded against the catalogue and scheduled. MAJ Albright appreciates not seeing it.",
    "Pre-authorized. The board will only hear about it if something goes wrong."
  ],
  ecab: [
    "Emergency CAB convened by phone within the hour.",
    "MAJ Albright, CW2 Jackson and Morgan dial in to an Emergency CAB from three different locations.",
    "ECAB convened. MAJ Albright joins from the motor pool, slightly out of breath."
  ],
  freezePulled: [
    "MAJ Albright: 'We are in a change freeze. Why is this on my agenda?' It's pulled and placed on hold.",
    "The board refuses to discuss it during the freeze. It's placed on hold, and the XO hears that you tried.",
    "CW2 Jackson: 'Freeze.' One word. The item is pulled and held."
  ]
};

/* ---------------------------------------------------------------------
   MENTOR: Chris, the seasoned Configuration Manager.
   Chris never submits changes. At the end of every week Chris gives you
   a debrief: a summary of the week's changes and tips on what to think
   about next time. game.js decides WHICH tips you get, based on the
   calls you made; the words live here.

   Placeholders you can use in tips:
     {ids}   the RFC ids the tip is about, e.g. "FW-021, SV-043"
     {count} how many RFCs the tip is about
   Placeholders in summaryLine:
     {reviewed} {forwarded} {implemented} {incidents} {sentBack} {accuracy}
   --------------------------------------------------------------------- */
const MENTOR = {
  name: "Chris",
  role: "Seasoned Configuration Manager",
  personality: "Has tracked every configuration item on this installation since it was a cow pasture. Keeps the CMDB like a family Bible.",

  // How Chris opens the debrief (picked at random).
  openers: [
    "Pull up a chair. Coffee's terrible, but it's hot.",
    "Got a minute before you head out? Let's look at the week.",
    "I've updated the CMDB with everything that changed this week. Here's what it tells me.",
    "Close the door. Let's talk about the week while it's still fresh."
  ],

  // The week in one paragraph.
  // {incidents} is filled in as "no incidents", "1 incident", "3 incidents"...
  summaryLine: "You reviewed {reviewed} change requests and sent {forwarded} forward. {implemented} actually went in, causing {incidents}. {sentBack} went back to their requesters. By my count, {accuracy}% of your readiness calls were sound.",

  // Tips, keyed by what happened. Each has a few variants.
  tips: {
    emergencyDelayed: [
      "You held up {ids}. Emergency changes don't wait for paperwork or freezes; that's what the ECAB is for. Send them through and let the board judge the risk.",
      "{ids} was an emergency, and you parked it. The fault doesn't stop because the form is untidy. Emergencies go to the ECAB, every time."
    ],
    freezeViolation: [
      "You sent {ids} to the board during a freeze. In a freeze, anything that isn't an emergency goes ON HOLD. Read the banner at the top of the card.",
      "Freeze means freeze. {ids} should have been held, not forwarded. The board had to pull it, and the XO noticed."
    ],
    fakeStandard: [
      "You logged {ids} as a standard change. Check it against the catalogue: a standard change has to meet every condition, and that one didn't. If it isn't fully prepared, it isn't standard.",
      "{ids} called itself 'Standard'. Calling it standard doesn't make it standard. Open the catalogue and read the conditions; if even one fails, send it back to be raised as a Normal change."
    ],
    rankPressure: [
      "{ids} came from the Colonel's office and wasn't ready, but you forwarded it anyway. Rank doesn't make an RFC ready. If you don't send it back, the board will usually wave it through, and then it's your outage too.",
      "I know who sent {ids}. It still had no real rollback plan or testing. Your job is to protect the network, not the requester's feelings, whatever their rank."
    ],
    forwardedJunk: [
      "You forwarded {ids} without a real rollback plan or testing evidence. Before anything goes to the board, look at those two lines first. If both are weak, it isn't ready.",
      "The board had to ask why {ids} reached them. Rule of thumb: solid rollback plus real testing is ready. Missing either one, think hard. Missing both, send it back.",
      "{ids} wasn't ready. The stated risk is the requester's opinion; the rollback plan and the test evidence are the facts. Judge on the facts."
    ],
    sentBackReady: [
      "You sent back {ids}, and it was ready: solid rollback, real testing. Every bounce costs goodwill and time, and sometimes the problem gets worse while it waits. Don't make good work jump through hoops.",
      "{ids} had everything the board asks for and you still bounced it. Being careful is good. Being a wall isn't. Requesters stop bothering to do it right if right gets sent back too."
    ],
    collisions: [
      "{ids} collided with another change on the same system. When you see the yellow schedule warning, think about whether both should go in the same week. Stagger work on the same configuration items.",
      "Two changes on the same box in the same window: that's how {ids} turned into an incident. The schedule warning on the card is there for a reason. Read it."
    ],
    badRollback: [
      "{ids} broke, and the weak rollback plan turned a blip into a long night. The rollback plan decides how bad a failure is. A change with a poor one needs a very good reason to go ahead.",
      "When {ids} failed, there was no good way back. Everything fails sometimes; that's exactly why the rollback plan matters more than the stated risk."
    ],
    partialTesting: [
      "{ids} was borderline, and it went wrong. Partial testing means somebody hasn't tested the bit that's going to hurt. Borderline calls are yours to make, but ask what wasn't tested.",
      "{ids} had gaps and they showed. On borderline RFCs, look at the justification: the requester often tells you exactly what they didn't test."
    ],
    goodProcessBadLuck: [
      "{ids} was a sound call and it still failed. That happens; you can't see everything that's hidden in the network. That's why we insist on rollback plans. Don't let one bad night make you a wall.",
      "You did the right thing with {ids} and it still caused an incident. Good process doesn't mean nothing breaks. It means when it breaks, you can recover. Keep making the same call."
    ],
    lowLeadership: [
      "Leadership is getting impatient with you. Make sure you're only sending back what's genuinely not ready, and don't forget emergencies need to move fast.",
      "The front office is losing patience. You can't keep everyone happy, but make sure every send-back is one you could defend to the Colonel's face."
    ],
    lowAudit: [
      "The inspectors will be back, and your records are getting thin. Every weak RFC you forward and every 'standard' change that wasn't is a finding waiting to happen.",
      "Audit readiness is low. Find the weak ones before the board does, and don't let anything go through during a freeze."
    ],
    lowStability: [
      "The network's taking a beating. Look harder at what goes in together, and favour changes with solid rollback plans until things settle.",
      "Stability is low. This is a week to be picky: only fully prepared changes, and nothing piled onto the same systems."
    ],
    lowSanity: [
      "You look tired. Clean, quick calls on the obvious ones save your energy for the hard ones. And go home on time once this week.",
      "Your sanity's running low. Not every RFC is a crisis. Ready is ready, junk is junk; save the agonising for the borderline ones."
    ],
    perfectWeek: [
      "Honestly? I've got nothing to correct. Every call was sound. Enjoy that; it doesn't happen often.",
      "Clean week. Ready work went forward, weak work went back, emergencies moved. That's the job."
    ]
  },

  // General wisdom, used when there's room for one more tip.
  general: [
    "When Mason submits on behalf of an engineer, the engineer usually did the work and Mason usually didn't write it down. Send it back and it often comes back much better.",
    "Annie's RFCs are short because she's already done the work. Don't mistake short for incomplete: check the rollback plan and the testing, same as anyone. And never let Mason submit for her.",
    "The CMDB tells you what a change touches. The systems list on the card is the short version. Two changes on the same configuration item is the first thing I look for.",
    "Requesters with clout aren't wrong more often. They're just harder to say no to. Judge the RFC, not the name on it.",
    "A good RFC answers three questions before you ask: how do we know it works, how do we undo it, and when will it happen.",
    "A standard change is a promise: low risk, done this exact way, every time. If the RFC is improvising, it isn't standard.",
    "Your job isn't to stop change. It's to make sure the changes that go ahead are ones we can live with if they fail.",
    "Watch the window. A change planned for Friday at 1645 is telling you something about how much the requester has thought it through."
  ],

  // How Chris signs off (picked at random).
  signoffs: [
    "Same time next week.",
    "Go home. The network will still be here tomorrow. Probably.",
    "I'll update the CMDB. You update your notes.",
    "Good talk. Don't tell Kowalski I said any of this."
  ]
};

// End-of-week performance titles. game.js decides WHICH one you get.
const PERFORMANCE_RATINGS = {
  incidentFactory: {
    title: "Chief of Unplanned Outages",
    blurb: "Plenty of changes reached production this week. So did plenty of incidents. The help desk has a dartboard with your photo on it."
  },
  wallOfNo: {
    title: "The Concertina Wire",
    blurb: "Almost nothing got past you to the CAB. The board met just to drink coffee. Requesters have started a support group."
  },
  rubberStamp: {
    title: "Rubber Stamp, Signal Corps",
    blurb: "You forwarded nearly everything, including RFCs with no rollback plan. MAJ Albright has started a page in her notebook just for you."
  },
  actuallyGood: {
    title: "Actually Squared Away",
    blurb: "Ready changes went forward, weak ones went back, and nothing broke. Nobody will ever thank you, which is how you know it went well."
  },
  cautious: {
    title: "Cautiously Mission Capable",
    blurb: "Mostly good readiness calls, with a few you'd like back. A respectable week of change management."
  },
  mediocre: {
    title: "Meets the Standard (Barely)",
    blurb: "Some wins, some fires. Your evaluation will call you 'a solid performer'. Everyone knows what that means."
  }
};

/* ---------------------------------------------------------------------
   RANDOM EVENTS between weeks.
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
                 "freeze"           - change freeze for this week's CAB
                 "promise"          - sending RFCs back this week costs extra
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
        result: "This week, only Emergency changes may go to the CAB. Place everything else ON HOLD until the freeze lifts. Send a non-emergency to the board anyway and it gets pulled, and the Command WILL notice."
      }
    ]
  },
  {
    id: "pressureCall",
    title: "A 'quick call' from the Colonel's office",
    text: [
      "COL Whitfield's XO has called your desk phone, your mobile and your First Sergeant. The message: 'The Colonel expects every request to reach the CAB this week. No more sending things back.'",
      "The Command Sergeant Major stops you in the hallway: 'Sir, the Commander feels you're holding up the mission by sending RFCs back. Can we count on you to be flexible this week?'"
    ],
    choices: [
      {
        label: "Promise to send everything to CAB",
        effect: "promise",
        fx: { leadership: 8, sanity: -2 },
        result: "The Command is delighted. This week, every RFC you send back will be a broken promise."
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
    suspects: ["kowalski", "brandt", "whitfield", "okafor", "menon", "patchbot", "mason"],
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
