# CAB Simulator

A tongue-in-cheek browser game about chairing the Change Advisory Board for
a military installation's IT network, based on ITIL 4 change enablement.
500 change requests covering firewalls, routers, switches, servers and
software updates.

## How to play

Open `index.html` in any browser, or play it on GitHub Pages. No install or
build step needed.

Each week has two CAB meetings (Tuesday and Thursday). For each change
request (RFC), choose **Approve**, **Reject**, or **Send Back for More Info**
(keyboard: **A / R / S**, **Enter** to continue). Keep all four meters
(Stability, Leadership Happiness, Audit Readiness, Your Sanity) above zero.

- **Approved** changes are implemented after the meeting. Their *hidden* true
  risk decides whether they cause an outage; testing evidence changes how
  likely that is, and the rollback plan decides how bad it is.
- **Rejected** changes can come back as Emergencies or get escalated up the
  chain of command. Rejecting a genuinely dangerous one earns a "bullet dodged".
- **Sent back** changes return a meeting or two later, improved or not,
  depending on who raised them.
- **Change freezes** (exercises, VIP visits, block leave): only Emergency
  changes should go in. A **Place on Hold** button (keyboard **H**) parks
  everything else until the freeze lifts.
- **Collisions:** two approved changes touching the same system in the same
  change window can clash. Cards warn you about schedule conflicts.
- **Random events** between meetings: no-notice cyber inspections, change
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
| `game.js` | Game rules and logic |
| `HOW-TO-ADD-SCENARIOS.md` | Guide to writing new content |
