# How to add scenarios

All of the game's content lives in **`data.js`** and the **`data/`** folder.
You never need to touch `game.js` to add change requests, characters or
event text.

**The workflow:** edit a data file, save, refresh the browser. If you made a
typo, a red box at the top of the game tells you exactly what's wrong.

| File | What's in it |
|---|---|
| `data/rfcs-firewalls.js` | Firewall changes, ids `FW-001`... |
| `data/rfcs-routers.js` | Router changes, ids `RT-001`... |
| `data/rfcs-switches.js` | Switch changes, ids `SW-001`... |
| `data/rfcs-servers.js` | Server changes, ids `SV-001`... |
| `data/rfcs-software.js` | Software updates, ids `UP-001`... |
| `data.js` | Characters, report text, events, ratings, the Standard Change Catalogue |

---

## Add a change request (RFC)

1. Open the file for the right category (e.g. `data/rfcs-switches.js`).
2. Copy an existing RFC, everything from its `{` to its `},`.
3. Paste it just before the `);` at the very end of the file.
4. Give it a **new, unique id** with the file's prefix (e.g. `SW-091`) and change the text.

```js
  {
    id: "SW-091", title: "Replace the switch in the Range Control tower",
    requester: "okafor",                  // must be a key from CHARACTERS
    type: "Normal",                       // Standard | Normal | Emergency
    statedRisk: "Low",                    // what the requester CLAIMS: Low | Medium | High
    systems: ["Range Control Switches"],  // a list, even if there's only one
    window: "Sat 0700-0900",              // free text, shown on the card
    rollback: "solid",                    // solid | weak | missing
    testing: "partial",                   // yes | partial | none
    hiddenRisk: "Medium",                 // the TRUTH. The player never sees this.
    justification: "The tower switch is 12 years old and drops out in the heat. New one tested on the bench.",

    // Optional extras:
    outageReport: "What the incident report says if it breaks things.",
    successReport: "What happens if it goes fine."
  },
```

The **id prefix decides the category** (`FW`, `RT`, `SW`, `SV`, `UP`). The
category picks which generic incident reports are used when an RFC doesn't
have its own `outageReport` / `successReport`.

### How the game judges "ready"

The player is the Change Manager, deciding what's ready for the CAB. The
game scores each RFC's **readiness** from two visible fields:

| | 2 points | 1 point | 0 points |
|---|---|---|---|
| `rollback` | `solid` | `weak` | `missing` |
| `testing` | `yes` | `partial` | `none` |

- **Normal** change: 3-4 = ready, 2 = borderline (either call is fine), 0-1 = not ready.
- **Standard** change: only ready with a perfect 4. Anything less means it doesn't
  really meet its catalogue entry, so the right call is Not Ready.
- **Emergency** change: always ready (it can't wait). Sending it back is a mistake.

The same score drives the **CAB vote**: a 4 is approved about 95% of the time, a 0
about 10%. Requesters with High clout (the Colonel's office) get a bonus.

### What each field does in the game

| Field | What it affects |
|---|---|
| `rollback`, `testing` | Readiness (above), so whether the CAB approves it. |
| `hiddenRisk` | The real chance of an outage once implemented (Low 10%, Medium 35%, High 70%). |
| `testing` | Also shifts that outage chance: `yes` −10%, `none` +15%. |
| `rollback` | Also decides how *bad* an outage is: `solid` minor, `weak` major, `missing` critical. |
| `statedRisk` | Only what the player sees. Make it differ from `hiddenRisk` to create a trap! |
| `systems` | Two changes implemented in the same week sharing a system may **collide**. Reuse the existing system names exactly (e.g. `"Core Switch Stack"`) so collisions work. |
| `type` | Standard skips the CAB, Emergency goes to the ECAB and is allowed during a freeze. |

### Writing good scenarios

The fun comes from the **visible fields hinting at the hidden risk, but not always honestly.**

- **Honest and good:** solid rollback, real testing, low hidden risk (e.g. CW2 Jackson's changes). Ready.
- **Overconfident:** says "Low", but testing is none and hidden risk is High (e.g. SSG Kowalski). Not ready.
- **Scary but well-prepared:** says "High" honestly, with solid rollback and testing, so the hidden risk is only Medium (e.g. MAJ Albright). Ready, despite the scary label.
- **Hidden trap:** everything *looks* ready, but the hidden risk is Medium because of something
  nobody knew (e.g. the "empty" building where the chaplain moved in). The player can't catch these; that's life.
- **Pressure from above:** the Colonel's requests are rarely tested and often risky, but sending them back hurts Leadership, and the CAB tends to bend for him.

### Standard changes and the catalogue

If `type` is `"Standard"`, add a `catalogueId` pointing at an entry in
`STANDARD_CHANGE_CATALOGUE` (at the bottom of `data.js`):

```js
    type: "Standard", catalogueId: "SC-07",
```

The player can compare the RFC against that entry's conditions. A great
trap is a "Standard" RFC whose justification quietly breaks one of the
conditions (like a "minor" firmware update that's really a major version,
or a "hot-swap" of the only working power supply).

### Placeholders in report text

| Write | Becomes |
|---|---|
| `{system}` | The RFC's first system, e.g. "Core Switch Stack" |
| `{name}` | The requester's short name, e.g. "SSG Kowalski" |

### Optional: what happens if it's rejected

```js
    // If the CAB rejects it and the requester escalates up the chain of command:
    rejectedReport: "The XO told the Colonel that the CAB is 'blocking the mission'.",

    // If it doesn't go ahead (the CAB rejects it, or you send back a change that
    // was actually ready), the problem may get worse and it comes back as an
    // EMERGENCY next week. List only the fields that change, plus a reason.
    returnsAsEmergency: {
      reason: "The second power supply failed. The switch is down.",
      title: "EMERGENCY: Replace BOTH power supplies",
      window: "Immediately",
      justification: "I did say."
    }
```

---

## Add a character

Find `const CHARACTERS = {` in `data.js` and copy an existing character.
The **key** (the word before the colon, like `okafor:`) is what RFCs use as
their `requester`.

```js
  santos: {
    name: "SGT Ana Santos",
    shortName: "SGT Santos",      // used in report text
    role: "Satellite Communications NCO",
    clout: "Low",                 // Low | Medium | High: how likely to escalate, and how much the CAB bends for them
    followThrough: "High",        // Low | Medium | High: how likely to IMPROVE a sent-back RFC
    personality: "One sentence the player sees under their name.",
    reactions: {
      approve: "Shown in the CAB minutes when the board approves their change.",
      reject: "Shown in the CAB minutes when the board rejects it.",
      sendBack: "Shown straight away when YOU mark it not ready.",
      hold: "(Optional) shown when you place it on hold during a freeze."
    }
  },
```

Each character gets an avatar colour automatically. To have a new character
cause **unauthorized changes**, add their key to `suspects` in the
`unauthorizedChange` event.

---

## Change freezes and "Place on Hold"

When the **change freeze** event happens, that week's CAB is frozen:

- Mark a non-Emergency change **Ready** and the board pulls it from the agenda (Leadership and Audit penalty, plus an inspection finding). It's held anyway.
- **Place on Hold** appears as a third button (keyboard **H**). The change waits, unchanged, and comes back automatically in the first week after the freeze lifts.
- **Emergency** changes are allowed through a freeze (they go to the ECAB). Holding one is a mistake and costs Stability.

You can add new freeze reasons by adding text variants to the `changeFreeze` event in `data.js`.

---

## Other things you can edit in data.js

| Section | What it is |
|---|---|
| `GENERIC_REPORTS` | Fallback report text, per category (firewall, router, switch, server, software) |
| `COLLISION_REPORTS` | Text for when two changes clash on the same system |
| `RESUBMISSION_NOTES` | What a sent-back RFC says when it returns |
| `MEETING_INTROS` | Scene-setting lines at the top of the CAB results |
| `CAB_COMMENTS` | What the board (MAJ Albright, CW2 Jackson, Morgan) says about the RFCs you send them |
| `PERFORMANCE_RATINGS` | End-of-week titles and jokes |
| `EVENTS` | Random events between meetings (add more text variants freely) |
| `STANDARD_CHANGE_CATALOGUE` | Pre-authorized change types and their conditions (the in-game reference) |

### Adding a catalogue entry

```js
  {
    id: "SC-11",                       // unique; RFCs point at it with catalogueId
    name: "Name of the standard change",
    description: "What kind of change this is.",
    conditions: ["Every one of these must be true", "..."],
    notCovered: ["Things that make it a Normal change instead"],
    procedure: "The short, documented steps."
  },
```

## Changing the rules (numbers)

Percentages and meter amounts live near the top of each section in
`game.js`, in ALL_CAPS names like `APPROVAL_CHANCE`, `OUTAGE_CHANCE`,
`COLLISION_CHANCE`, `EVENT_CHANCE` and `WEEKLY_PRESSURE` (the ops tempo that
wears the meters down each week). They're safe to tweak. Change one number,
refresh and play. Making `WEEKLY_PRESSURE` smaller makes the game longer and
easier.

## Common mistakes

| Symptom | Likely cause |
|---|---|
| Red box: *must be one of: yes, partial, none* | Capital letters matter: `"yes"` not `"Yes"`. |
| Red box: *requester "Okafor" isn't in CHARACTERS* | Use the key (`"okafor"`), not the display name. |
| Red box: *another RFC already uses this id* | Each `id` must be unique across all files. |
| Red box: *id must start with one of: FW, RT, SW, SV, UP* | The id prefix sets the category. |
| The whole game is blank | Usually a missing comma between two `{ }` blocks, or a missing quote. Press **F12** and look at the **Console** tab: it names the file and line number. |
