/* =====================================================================
   THE GUIDED FIRST WEEK
   ---------------------------------------------------------------------
   Week 1 can be played as a guided week: four hand-picked RFCs (one
   Standard, two Normal, one Emergency), with Chris coaching you through
   each one on the card. Outcomes in the guided week are predictable:
   ready changes go in cleanly, so the lessons land.

   Each card has:
     rfc:       a normal RFC object (same fields as the data/ files).
                Ids end in "-T01" etc. so they never clash with the pool.
     steps:     what Chris tells you to do, in order. A step with
                  open: "implementation" | "rollback" | "testing" |
                        "diagram" | "catalogue"
                gets a tick once you've opened that document.
     recommend: "ready" or "sendBack" - the right call
     right:     what Chris says if you make the right call
     wrong:     what Chris says if you don't
   ===================================================================== */
const TUTORIAL = {
  // Shown on the Week 1 intro screen.
  intro: "Chris catches you on your first morning. \"I'll sit with you this week. Four requests, one of each kind you'll see. Read what they send you, and I'll tell you what I look for. Nothing you do this week will be held against you. Much.\"",

  // Chris opens the end-of-week debrief with this.
  wrapUp: "That's the whole job, really. Read the documents, check they're about THIS change, and ask: if it goes wrong, how do we get back? Standard changes skip the board, emergencies go to the ECAB, and everything else only goes to the CAB when it's ready. From next week, you're on your own. I'll still do the Friday debrief.",

  cards: [
    {
      rfc: {
        id: "SW-T01", title: "Replace a failed fan in the Comms Shack switch",
        requester: "okafor", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
        systems: ["HQ Building Switches"], window: "Wed 0700-0710",
        rollback: "solid", testing: "yes", hiddenRisk: "Low",
        justification: "One of the two fans in the Comms Shack switch has died. The other one is running fine. Same part from stock, hot-swappable. Done this a hundred times."
      },
      steps: [
        { text: "This is a STANDARD change. Standard changes are pre-authorized: they skip the CAB completely, as long as they really are standard." },
        { open: "catalogue", text: "Click 'Check conditions' on the card (or press C) and read SC-01. A hot-swap only counts if a working spare is still running alongside the broken part." },
        { open: "rollback", text: "Open the Rollback Plan (press 2). Even a standard change needs a way back." },
        { open: "testing", text: "Open the Test Results (press 3)." },
        { text: "It matches every condition and it's fully prepared. Log it as a Standard change." }
      ],
      recommend: "ready",
      right: "That's it. Logged, scheduled, and the board never has to see it. That's what standard changes are for: the boring, safe stuff shouldn't need a meeting.",
      wrong: "That one really was standard: it matched the catalogue entry, with a rollback plan and test results. Sending it back just slows down Mrs. Okafor, and she will remember. If a standard change meets every condition, log it."
    },
    {
      rfc: {
        id: "FW-T02", title: "Allow the new Ops Floor printers through the firewall",
        requester: "annie", type: "Normal", statedRisk: "Low",
        systems: ["Data Center Firewall", "Print Servers"], window: "Tue 1500-1515",
        rollback: "solid", testing: "yes", hiddenRisk: "Low",
        justification: "Six new printers on the Ops Floor. One rule, named hosts, one port. Tested. Rollback rehearsed. Can I go now?"
      },
      steps: [
        { text: "A NORMAL change. These go to Thursday's CAB. You don't approve it; you decide whether it's ready to go in front of the board." },
        { open: "implementation", text: "Start with the Implementation Plan (press 1). Is there a window, real steps, someone to call?" },
        { open: "rollback", text: "Now the Rollback Plan (press 2). I look for three things: when they'd roll back, how, and how long it takes." },
        { open: "testing", text: "Then the Test Results (press 3). Was it tested on the same kind of kit? Is the report about THIS change?" },
        { open: "diagram", text: "Finally the Diagram (press 4): what's changing, and what's sitting next to it." },
        { text: "Every document should say FW-T02 at the top. They do, and they're all solid. This one's ready for the board." }
      ],
      recommend: "ready",
      right: "Good. Annie's work is always like this: short, specific, tested. The board will wave it through, and she'll pretend she didn't care.",
      wrong: "That was ready: real rollback plan, real tests, all about this change. Sending back good work costs goodwill, and Annie has a long memory. Ask yourself what was actually missing. If nothing was, send it forward."
    },
    {
      rfc: {
        id: "FW-T03", title: "Firewall thing for the Supply Cage (on behalf of Annie)",
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
      steps: [
        { text: "Another NORMAL change, this time from Mason, on behalf of Annie. Mason means well. Mason also leaves things out." },
        { open: "rollback", text: "Open the Rollback Plan (press 2) and look at the RFC number at the top. That's not this change. Somebody copied a plan from a completely different RFC. This is the most common trap there is." },
        { open: "testing", text: "Now the Test Results (press 3). 'Annie said it'd be fine' isn't testing." },
        { text: "No real rollback plan, no real testing. However simple it sounds, it isn't ready. Send it back." }
      ],
      recommend: "sendBack",
      right: "Exactly. It'll come back next week, probably with Annie's real paperwork attached. And probably with a strongly worded email to Mason.",
      wrong: "That rollback plan was for a different change: check the number at the top. And 'Annie said it'd be fine' isn't test evidence. The board will ask why that reached them, and they'll be asking you. When the documents don't hold up, send it back."
    },
    {
      rfc: {
        id: "FW-T04", title: "Block a password-guessing attack on the VPN",
        requester: "morgan", type: "Emergency", statedRisk: "High",
        systems: ["NIPR Perimeter Firewall"], window: "Immediately",
        rollback: "solid", testing: "partial", hiddenRisk: "Low",
        justification: "Thousands of login attempts a minute against the VPN from three address ranges. Block rule tested on the lab firewall. Removing it takes 30 seconds."
      },
      steps: [
        { text: "An EMERGENCY change. Emergencies can't wait for Thursday: they go to the Emergency CAB, which meets by phone the same day." },
        { open: "testing", text: "Read the documents anyway (press 3 for the test results). Partial testing is normal in an emergency. The ECAB will weigh up the risk; that's their job." },
        { text: "Your job here is simple: don't hold it up. Send it to the ECAB." }
      ],
      recommend: "ready",
      right: "Right. Morgan gets the block in within the hour, and the attack bounces off. Emergencies are about speed with a safety net, not paperwork.",
      wrong: "The attack doesn't stop while the forms get tidied up. Emergency changes go to the ECAB, every time, even when the paperwork is rough. Holding them up is how small incidents become big ones."
    }
  ]
};
