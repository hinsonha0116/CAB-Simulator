/* =====================================================================
   THE GUIDED FIRST WEEK
   ---------------------------------------------------------------------
   Week 1 can be played as a guided week: three hand-picked RFCs, one of
   each change type (Standard, Normal, Emergency), with Chris coaching
   you like a new hire with no experience. Outcomes in the guided week
   are predictable, so the lessons land.

   Each card has:
     rfc:       a normal RFC object (same fields as the data/ files).
                Ids end in "-T01" etc. so they never clash with the pool.
     lesson:    Chris explains the change type before you start:
                  heading:    shown in bold, e.g. "What's a Standard change?"
                  paragraphs: a list of short paragraphs
     steps:     what Chris tells you to do, in order. A step with
                  open: "implementation" | "rollback" | "testing" |
                        "diagram" | "catalogue"
                gets a tick once you've opened that document.
     recommend: "ready" or "sendBack" - the right call
     right:     what Chris says if you make the right call
     wrong:     what Chris says if you don't

   Text can use <strong>bold</strong> for emphasis.
   ===================================================================== */
const TUTORIAL = {
  // Shown on the Week 1 intro screen.
  intro: "Chris catches you on your first morning. \"Welcome aboard. Before we start, three words you'll hear all day. A CHANGE is anything we do that alters the network: a new firewall rule, a software update, swapping a broken part. A REQUEST FOR CHANGE, or RFC, is the form somebody fills in to ask permission to make one. And the CAB, the Change Advisory Board, is the group that meets every Thursday and decides which changes go ahead. You're the Change Manager: you sit in the middle. You don't approve changes. You check each RFC is complete and ready before the board sees it. This week I've picked three requests, one of each change type: Standard, Normal and Emergency. I'll sit with you for all three. Nothing you do this week will be held against you. Much.\"",

  // Chris opens the end-of-week debrief with this.
  wrapUp: "So, the three change types. STANDARD: routine and pre-approved. Check it really matches its catalogue entry, then log it. No meeting needed. NORMAL: most changes. Make sure it's ready (implementation plan, rollback plan, test results, diagram, all about THIS change) and then it goes to Thursday's CAB. If it isn't ready, send it back. EMERGENCY: something's broken or under attack right now. Get it to the ECAB today, and never sit on it. That's the whole job. From next week you're on your own, but I'll still do the Friday debrief.",

  cards: [
    {
      rfc: {
        id: "SW-T01", title: "Replace a failed fan in the Comms Shack switch",
        requester: "okafor", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
        systems: ["HQ Building Switches"], window: "Wed 0700-0710",
        rollback: "solid", testing: "yes", hiddenRisk: "Low",
        justification: "One of the two fans in the Comms Shack switch has died. The other one is running fine. Same part from stock, hot-swappable. Done this a hundred times."
      },
      lesson: {
        heading: "Lesson 1: What's a Standard change?",
        paragraphs: [
          "Some changes we make so often, and so safely, that we've already agreed exactly how to do them. Swapping a broken fan. Renewing a certificate before it expires. Those are <strong>Standard changes</strong>.",
          "Each kind of Standard change is written down in the <strong>Standard Change Catalogue</strong> (the blue book button at the top of the screen). The catalogue lists the conditions. If a change meets <em>every one</em> of them, it's <strong>pre-authorized</strong>: nobody needs to approve it again, and it never goes to the CAB.",
          "Think of it like a recipe the board has already tasted. As long as you follow the recipe exactly, you don't need to ask again.",
          "The catch: people love calling things 'standard' to skip the queue. So your job is to check it <strong>really</strong> matches its catalogue entry. If it doesn't, it isn't standard."
        ]
      },
      steps: [
        { open: "catalogue", text: "Click <strong>Check conditions</strong> on the card (or press C) and read entry SC-01. One condition matters a lot here: a hot-swap only counts if a second, <em>working</em> part is still running alongside the broken one. Mrs. Okafor says the other fan is fine, so that's met." },
        { open: "rollback", text: "Open the <strong>Rollback Plan</strong> (press 2). A rollback plan says how we'd undo the change if it went wrong. Even routine work needs one. This one has clear steps and a time to restore." },
        { open: "testing", text: "Open the <strong>Test Results</strong> (press 3). Test results prove the change works before we do it for real. Everything passed here." },
        { text: "It matches every condition in the catalogue and it's fully prepared. Press <strong>R</strong> to <strong>log it as a Standard change</strong>. It goes straight onto the schedule, with no meeting needed." }
      ],
      recommend: "ready",
      right: "That's it. Logged, scheduled, and the board never has to see it. That's the whole point of standard changes: the boring, safe stuff shouldn't need a meeting.",
      wrong: "That one really was standard: it matched every condition in SC-01, with a rollback plan and test results. Sending it back just slows down Mrs. Okafor, and the fan stays broken. If a standard change meets every condition, log it."
    },
    {
      rfc: {
        id: "FW-T02", title: "Firewall thing for the Supply Cage (on behalf of Annie)",
        requester: "mason", type: "Normal", statedRisk: "Low",
        systems: ["Data Center Firewall"], window: "Thursday, I reckon",
        rollback: "missing", testing: "none", hiddenRisk: "Low",
        justification: "Annie needs a firewall thing for the Supply Cage. Pretty simple, I'm told. I found a rollback plan in the shared drive and attached it. Testing's all good, I think.",
        artifacts: {
          implementation: "Steps:\n- Annie does the firewall thing for the Supply Cage.\n\nContacts: Annie (she doesn't know about this RFC yet), Mason.",
          rollbackCopiedFrom: "FW-061",
          testing: "Evidence: \"Annie said it'd be fine.\" - Mason\n\nNo environment, test cases or results recorded."
        }
      },
      lesson: {
        heading: "Lesson 2: What's a Normal change?",
        paragraphs: [
          "Most changes are <strong>Normal changes</strong>. They're not routine enough to be pre-approved like a Standard change, and not urgent enough to skip the queue like an Emergency.",
          "A Normal change has to be assessed and approved by the <strong>CAB</strong> at Thursday's meeting. The board looks at the risk and decides: yes, no, or not yet.",
          "You <strong>don't</strong> approve it. Your job comes first: make sure the RFC is <strong>ready</strong> before it reaches the board. If you send them something half-finished, you've wasted their time, and they'll remember who sent it.",
          "A ready RFC comes with four documents, and every one should be about <em>this</em> change:<br>&bull; an <strong>Implementation Plan</strong>: what will be done, when, and by whom<br>&bull; a <strong>Rollback Plan</strong>: how to undo it if it goes wrong<br>&bull; <strong>Test Results</strong>: proof it works, ideally on the same kind of equipment<br>&bull; a <strong>Diagram</strong>: what's changing and what's next to it",
          "If they're all there and they hold up, mark it <strong>Ready for CAB</strong>. If not, send it back to be fixed. Sending something back isn't a punishment. It's how it comes back better."
        ]
      },
      steps: [
        { open: "implementation", text: "This one's from Mason, submitted on behalf of Annie. Open the <strong>Implementation Plan</strong> (press 1). A good one has a time window, numbered steps and people to contact. Compare that with what Mason wrote." },
        { open: "rollback", text: "Now open the <strong>Rollback Plan</strong> (press 2) and look at the RFC number at the very top. It says FW-061, not FW-T02. Somebody copied a plan from a completely different change. A rollback plan for a different change is the same as having no rollback plan at all. This is the most common trap there is." },
        { open: "testing", text: "Open the <strong>Test Results</strong> (press 3). Real test evidence says where it was tested and what passed. 'Annie said it'd be fine' isn't evidence." },
        { text: "No real plan, no real way back, no real testing. However simple it sounds, it isn't ready. Press <strong>N</strong> to send it back to Mason so it can be done properly." }
      ],
      recommend: "sendBack",
      right: "Exactly. It'll come back next week, probably with Annie's real paperwork attached, and probably with a strongly worded email to Mason. That's the system working.",
      wrong: "That rollback plan was for a different change (check the number at the top), and 'Annie said it'd be fine' isn't test evidence. The board will ask why that reached them, and they'll be asking you. When the documents don't hold up, send it back."
    },
    {
      rfc: {
        id: "FW-T03", title: "Block a password-guessing attack on the VPN",
        requester: "morgan", type: "Emergency", statedRisk: "High",
        systems: ["NIPR Perimeter Firewall"], window: "Immediately",
        rollback: "solid", testing: "partial", hiddenRisk: "Low",
        justification: "Thousands of login attempts a minute against the VPN from three address ranges, right now. Block rule tested on the lab firewall. Removing it takes 30 seconds."
      },
      lesson: {
        heading: "Lesson 3: What's an Emergency change?",
        paragraphs: [
          "Sometimes something is broken or under attack <strong>right now</strong>, and waiting until Thursday's meeting would make it worse. That's an <strong>Emergency change</strong>.",
          "Emergencies still need approval, just faster. They go to the <strong>Emergency CAB</strong>, or <strong>ECAB</strong>: a few members of the board who get together by phone, the same day.",
          "Because there's no time, the paperwork is often rougher. Partial testing is normal. The ECAB weighs up the risk of making the change against the risk of <em>not</em> making it.",
          "Your job is to get it to the ECAB quickly. Never send an emergency back or put it on hold: that just leaves the problem in place. But don't let people abuse it either. 'I forgot to submit this on time' is not an emergency."
        ]
      },
      steps: [
        { text: "Read the justification on the card: thousands of password guesses a minute, happening now. That's a genuine emergency. Morgan isn't just in a hurry." },
        { open: "testing", text: "Open the <strong>Test Results</strong> (press 3). It's only been tried on the lab firewall: partial testing. In an emergency, that's acceptable. Note it, and let the ECAB weigh it up." },
        { open: "rollback", text: "Open the <strong>Rollback Plan</strong> (press 2). Removing the rule takes 30 seconds. A quick, simple way back makes an emergency change much less scary." },
        { text: "Press <strong>R</strong> to send it to the <strong>Emergency CAB</strong>. They'll decide today." }
      ],
      recommend: "ready",
      right: "Right. The ECAB approves it within the hour, Morgan puts the block in, and the attack bounces off. Emergencies are about speed with a safety net, not paperwork.",
      wrong: "The attack doesn't stop while the forms get tidied up. Emergency changes go to the ECAB, every time, even when the paperwork is rough. Holding them up is how small incidents become big ones."
    }
  ]
};
