# CAB Simulator

A tongue-in-cheek browser game about chairing an IT Change Advisory Board,
based on ITIL 4 change enablement.

## How to play

Open `index.html` in any browser. No install or build step needed.

Each week has two CAB meetings (Tuesday and Thursday). For each change
request (RFC), choose **Approve**, **Reject**, or **Send Back for More Info**
(keyboard: **A / R / S**, **Enter** to continue). Keep all four meters
(Stability, Leadership Happiness, Audit Readiness, Your Sanity) above zero.

- **Approved** changes are implemented after the meeting. Their *hidden* true
  risk decides whether they cause an outage; testing evidence changes how
  likely that is, and the rollback plan decides how bad it is.
- **Rejected** changes can come back as Emergencies or get escalated to
  leadership. Rejecting a genuinely dangerous one earns a "bullet dodged".
- **Sent back** changes return a meeting or two later, improved or not,
  depending on who raised them.
- **Collisions:** two approved changes touching the same system in the same
  change window can clash. Cards warn you about schedule conflicts.
- **Random events** between meetings: surprise audits, change freezes,
  pressure calls from leadership and discovered unauthorized changes.
- **Standard Change Catalogue:** open it any time (button at the top, or
  press **C**) to check whether a "Standard" change really meets the
  conditions for pre-authorization.
- **End of week:** a summary with a performance rating, from "Actually
  Pretty Good At This" to "Chief Incident Officer".

## Adding your own scenarios

See **[HOW-TO-ADD-SCENARIOS.md](HOW-TO-ADD-SCENARIOS.md)**. All content
lives in `data.js`, and a built-in checker flags typos with a red box when
you refresh.

## Files

| File | What it's for |
|---|---|
| `index.html` | Page structure (the screens) |
| `style.css` | Look and feel, including dark mode |
| `data.js` | **Scenario content**: characters, RFCs, events, ratings. Edit this one! |
| `game.js` | Game rules and logic |
| `HOW-TO-ADD-SCENARIOS.md` | Guide to writing new content |
