# How to add scenarios

All of the game's content lives in **`data.js`**. You never need to touch
`game.js` to add change requests, characters or event text.

**The workflow:** edit `data.js`, save, refresh the browser. If you made a
typo, a red box at the top of the game tells you exactly what's wrong.

---

## Add a change request (RFC)

1. Open `data.js` and find `const RFCS = [`.
2. Copy an existing RFC, everything from its `{` to its `},`.
3. Paste it just before the `];` that ends the list.
4. Give it a **new, unique id** (e.g. `CHG0028`) and change the text.

```js
  {
    id: "CHG0028",
    title: "Replace the office Wi-Fi access points",
    requester: "linda",            // must be a key from CHARACTERS
    type: "Normal",                // Standard | Normal | Emergency
    statedRisk: "Low",             // what the requester CLAIMS: Low | Medium | High
    systems: ["Office Wi-Fi"],     // a list, even if there's only one
    window: "Sat 07:00 - 09:00",   // free text, shown on the card
    rollback: "solid",             // solid | weak | missing
    testing: "partial",            // yes | partial | none
    justification:
      "The current access points are older than some of our interns. " +
      "Tested one floor last week.",
    hiddenRisk: "Medium",          // the TRUTH. The player never sees this.

    // Optional extras:
    outageReport: "What the incident report says if it breaks things.",
    successReport: "What happens if it goes fine."
  },
```

### What each field does in the game

| Field | What it affects |
|---|---|
| `hiddenRisk` | The real chance of an outage if approved (Low 10%, Medium 35%, High 70%). |
| `testing` | Shifts that chance: `yes` −10%, `none` +15%. |
| `rollback` | How *bad* an outage is: `solid` minor, `weak` major, `missing` critical. |
| `statedRisk` | Only what the player sees. Make it differ from `hiddenRisk` to create a trap! |
| `systems` | Two approved changes sharing a system at one meeting may **collide**. |
| `type` | Emergency changes are allowed during a change freeze. Rejecting one costs extra. |

### Writing good scenarios

The fun comes from the **visible fields hinting at the hidden risk, but not always honestly.**

- **Honest and good:** solid rollback, real testing, low hidden risk (e.g. Priya's changes).
- **Overconfident:** says "Low", but testing is partial and hidden risk is High (e.g. Dave).
- **Scary but well-prepared:** says "High" honestly, with solid rollback and testing, so the hidden risk is only Medium.
- **Hidden trap:** everything *looks* fine, but the hidden risk is Medium because of something
  nobody knew (e.g. the FTP server the bank secretly uses).

### Placeholders in report text

| Write | Becomes |
|---|---|
| `{system}` | The RFC's first system, e.g. "Orders Database" |
| `{name}` | The requester's first name, e.g. "Priya" |

### Optional: what happens if it's rejected

```js
    // If the requester escalates the rejection to leadership:
    rejectedReport: "Brad has told the CEO that IT is 'anti-revenue'.",

    // If the problem gets worse and it comes back as an EMERGENCY at the
    // next meeting. List only the fields that change, plus a reason.
    returnsAsEmergency: {
      reason: "The certificate expired. Customers see a big red warning.",
      title: "EMERGENCY: Renew EXPIRED certificate",
      window: "Immediately",
      justification: "As predicted. In writing. Three times."
    }
```

---

## Add a character

Find `const CHARACTERS = {` and copy an existing character. The **key** (the
word before the colon, like `linda:`) is what RFCs use as their `requester`.

```js
  sam: {
    name: "Sam Okoro",
    role: "Cloud Engineer",
    clout: "Medium",          // Low | Medium | High: how likely to escalate a rejection
    followThrough: "High",    // Low | Medium | High: how likely to IMPROVE a sent-back RFC
    personality: "One sentence the player sees under their name.",
    reactions: {
      approve: "What happens right after you approve.",
      reject: "What happens right after you reject.",
      sendBack: "What happens right after you send it back."
    }
  },
```

Each character gets an avatar colour automatically. To have a new character
cause **unauthorized changes**, add their key to `suspects` in the
`unauthorizedChange` event.

---

## Other things you can edit in data.js

| Section | What it is |
|---|---|
| `GENERIC_REPORTS` | Fallback report text when an RFC doesn't have its own |
| `COLLISION_REPORTS` | Text for when two changes clash on the same system |
| `RESUBMISSION_NOTES` | What a sent-back RFC says when it returns |
| `MEETING_INTROS` | Scene-setting lines before each meeting |
| `PERFORMANCE_RATINGS` | End-of-week titles and jokes |
| `EVENTS` | Random events between meetings (add more text variants freely) |

## Changing the rules (numbers)

Percentages and meter amounts live near the top of each section in
`game.js`, in ALL_CAPS names like `OUTAGE_CHANCE`, `COLLISION_CHANCE` and
`EVENT_CHANCE`. They're safe to tweak. Change one number, refresh and play.

## Common mistakes

| Symptom | Likely cause |
|---|---|
| Red box: *must be one of: yes, partial, none* | Capital letters matter: `"yes"` not `"Yes"`. |
| Red box: *requester "Linda" isn't in CHARACTERS* | Use the key (`"linda"`), not the display name. |
| Red box: *another RFC already uses this id* | Each `id` must be unique. |
| The whole game is blank | Usually a missing comma between two `{ }` blocks, or a missing quote. Press **F12** and look at the **Console** tab: it names the line number. |
