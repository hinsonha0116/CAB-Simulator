# CAB Simulator

A tongue-in-cheek browser game about being the **Change Manager** for a
military installation's IT network, based on ITIL 4 change enablement.
500 change requests covering firewalls, routers, switches, servers and
software updates.

## How to play

Open `index.html` in any browser, or play it on GitHub Pages. No install or
build step needed.

You don't approve changes: the **CAB** does, once a week on Thursday. Your
job is to decide which requests are **ready** to go in front of the board.
Keep all four meters (Stability, Leadership Happiness, Audit Readiness,
Your Sanity) above zero.

Each week:

1. **Review your queue** of 5-10 RFCs. Each comes with **attachments** you
   can open (keyboard **1-4**): an implementation plan, a rollback plan, test
   results and a before/after diagram. Read them: is each one about *this*
   change, and does it really say how it was tested and how to undo it?
   Some are vague, some are missing, and some were copy-pasted from a
   different change. Then choose **Ready for CAB** (keyboard **R**) or
   **Not Ready: Send Back** (**N**). New players can tick **Quick ratings**
   in the header to see a summary of each RFC's rollback and testing.
   - *Standard* changes are pre-authorized: if ready, they're logged and skip the CAB.
     Check the catalogue: some "standard" changes aren't.
   - *Emergency* changes go to the Emergency CAB the same day.
   - During a **change freeze**, a **Place on Hold** button (**H**) parks
     non-emergency changes until the freeze lifts.
2. **Thursday's CAB** votes on what you sent. Well-prepared RFCs (solid
   rollback plan, real testing) usually get approved. Send the board
   half-baked work and they'll want to know why you let it through.
3. **Implementation:** approved changes go in. Their *hidden* true risk
   decides whether they cause an outage; testing evidence changes how
   likely that is, and the rollback plan decides how bad it is.
4. **Week summary:** **Chris, the seasoned Configuration Manager**, gives you
   a debrief: what changed this week, what broke, and up to three tips on
   what to think about next time, naming the RFCs you got wrong. Then a
   performance rating and your **triage accuracy**, with every call marked
   ✓ or ✗.

More things that happen:

- **Sent back** changes return the next week, improved or not, depending
  on who raised them. Send back a change that was actually ready and the
  requester (and sometimes the problem) gets worse.
- Changes the CAB **rejects** can come back as Emergencies or get escalated
  up the chain of command.
- The **ops tempo** wears every meter down a little each week, and it gets
  heavier over time, so even great Change Managers eventually burn out.
- **Collisions:** two approved changes touching the same system in the same
  change window can clash. Cards warn you about schedule conflicts.
- **Random events** between weeks: no-notice cyber inspections, change
  freezes, pressure from the Colonel's office and discovered unauthorized changes.
- **Standard Change Catalogue:** open it any time (button at the top, or
  press **C**) to check whether a "Standard" change really meets the
  conditions for pre-authorization.
- **End of week:** a summary with a performance rating, from "Actually
  Squared Away" to "Chief of Unplanned Outages".

## Adding your own scenarios

See **[HOW-TO-ADD-SCENARIOS.md](HOW-TO-ADD-SCENARIOS.md)**. Change requests
live in the `data/` folder (one file per category); everything else is in
`data.js`. A built-in checker flags typos with a red box when you refresh.

## Files

| File | What it's for |
|---|---|
| `index.html` | Page structure (the screens) |
| `style.css` | Look and feel, including dark mode |
| `data.js` | Characters, events, report text, ratings, Standard Change Catalogue |
| `data/rfcs-*.js` | **The 500 change requests**, by category. Add your own here! |
| `artifacts.js` | Builds the documents attached to each RFC (rollback plans, test results, diagrams) |
| `game.js` | Game rules and logic |
| `HOW-TO-ADD-SCENARIOS.md` | Guide to writing new content |
