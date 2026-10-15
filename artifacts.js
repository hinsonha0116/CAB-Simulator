/* =====================================================================
   CAB SIMULATOR - ARTIFACTS
   ---------------------------------------------------------------------
   Every RFC comes with documents ("artifacts") the Change Manager can
   open and review before deciding whether it's ready:

     1. Implementation Plan   (always attached)
     2. Rollback Plan         (quality depends on the RFC's `rollback`)
     3. Test Results          (quality depends on the RFC's `testing`)
     4. Diagram               (before/after picture of the change)

   Writing 1,500+ documents by hand isn't practical, so this file
   GENERATES them from each RFC's details. The documents never say
   "solid" or "weak" - they SHOW it, and the player has to read them:

     rollback solid    -> specific triggers, steps, restore time, backup
     rollback weak     -> vague, no triggers, "backup: TBD"
     rollback missing  -> not attached, OR a plan copied from another RFC
     testing yes       -> matching lab, everything passes
     testing partial   -> tests not run, different lab, accepted failures
     testing none      -> not attached, OR evidence for a different system
                          or version, stale evidence, or "worked for me"

   Each RFC always gets the same documents (they're generated from a
   "seed" based on its id), so re-opening one shows the same thing.

   HAND-WRITTEN OVERRIDES: an RFC in the data files can include
     artifacts: { rollback: "...", testing: "...", implementation: "...",
                  diagramNote: "..." }
   to replace a generated document with your own text. Keep it consistent
   with the RFC's rollback/testing values! Blank lines split paragraphs;
   lines starting with "- " become bullet points.

   The TEMPLATES section below is safe to edit. The logic is further down.
   ===================================================================== */

// ---------------------------------------------------------------------
// TEMPLATES (wording). {id} {system} {systems} {title} {name} {window}
// are filled in automatically.
// ---------------------------------------------------------------------
const ARTIFACT_TEMPLATES = {
  // Rollback steps per category, for a SOLID plan.
  rollbackSteps: {
    firewall: [
      "Before starting, export the current policy from the Firewall Management Server as pre-{id}.cfg.",
      "If any trigger below is hit, re-import pre-{id}.cfg and push it to the {system}.",
      "Confirm both units of the HA pair show the same policy version.",
      "Run the standard connectivity checks from the test hosts in the HQ building and the data center."
    ],
    router: [
      "Save the running config of the {system} to flash and to the Backup Servers as pre-{id}.",
      "If triggered, load pre-{id} back onto the {system} from the console.",
      "Confirm every routing neighbour comes back up.",
      "Trace routes from test hosts in three different buildings to higher HQ."
    ],
    switch: [
      "Back up the {system} configuration to the Backup Servers as pre-{id}.",
      "If triggered, restore pre-{id} and reload affected switches one at a time.",
      "Confirm uplinks are up and spanning tree has settled.",
      "Spot-check a phone, a printer and a workstation in each affected area."
    ],
    server: [
      "Take a snapshot of the {system} and confirm it can be restored (tested on the restore server).",
      "If triggered, revert the {system} to the snapshot.",
      "Confirm dependent services start and users can log in.",
      "Help desk runs the standard login and file-access checks."
    ],
    software: [
      "Keep the current package on the Patch Server as the 'previous version'.",
      "If triggered, stop the deployment and push the previous version to every machine that received the update.",
      "Confirm pilot machines report the previous version.",
      "Re-run the smoke tests on one machine from each section."
    ]
  },

  rollbackTriggers: [
    "{system} unreachable for more than 5 minutes",
    "Error rates in monitoring rise above the normal baseline",
    "Any mission system reports a failure linked to the change",
    "Work not complete 30 minutes before the end of the window",
    "Help desk receives more than 10 related calls"
  ],

  // A WEAK rollback plan: vague, short, no detail.
  weakRollback: [
    "If there are any problems, we will undo the change and put things back how they were.",
    "Rollback: revert the change. The team has done this before.",
    "We'll restore from backup if needed. Backup: TBD (should be one from last month).",
    "Rollback will be done by whoever is on shift, using their best judgement."
  ],

  // Test names per category.
  tests: {
    firewall: ["Allowed traffic passes for the named hosts", "Denied traffic is still blocked", "Failover to the standby unit",
      "Logs reach the SIEM", "No impact on existing VPN sessions", "Policy install completes in normal time"],
    router: ["Routing neighbours re-establish", "Routes to all buildings present", "Failover to the backup path",
      "CPU and memory normal under load", "Management access over SSH", "Traceroute to higher HQ"],
    switch: ["Uplinks come up at full speed", "VLANs present on the right ports", "Spanning tree stable",
      "Phones and powered devices come up", "Port security behaves", "Config survives a reload"],
    server: ["Service starts after reboot", "Users can log in", "Dependent applications connect",
      "Backup job completes afterwards", "Performance within baseline", "Monitoring agent reports in"],
    software: ["Installs on pilot machines", "Application launches", "CAC login still works",
      "No conflict with endpoint security", "Rolling back to the previous version works", "Mission applications unaffected"]
  },

  // Informal "testing" that isn't really testing.
  informalTesting: [
    "Tried it on my own machine and it seemed fine.",
    "Pinged it afterwards. It answered.",
    "The vendor says it's been tested.",
    "It worked at another installation, according to a guy who was there."
  ],

  // Words used in implementation plans, by how well prepared the RFC is.
  thinSteps: [
    "Do the change.",
    "Check it works.",
    "Let people know if it doesn't."
  ],

  // Neighbouring systems drawn around the change in diagrams.
  diagramChains: {
    firewall: ["Internet / higher HQ", "WAN Edge Router", "*", "Core Switch Stack", "Users and servers"],
    router: ["Higher HQ", "*", "Core Switch Stack", "Buildings"],
    switch: ["NIPR Core Router", "Core Switch Stack", "*", "Workstations, phones, printers"],
    server: ["Users", "Core Switch Stack", "Data Center Switches", "*", "Backup Servers"],
    software: ["Patch Server", "Pilot ring", "*", "All remaining machines"]
  },

  // An out-of-date diagram some weak RFCs attach instead of a real one.
  staleDiagramNotes: [
    "Building 200 comms closet, as of 2019",
    "Network overview, draft v0.3 (2018)",
    "Old HQ layout, before the 2020 move"
  ]
};

// ---------------------------------------------------------------------
// LOGIC (you shouldn't need to edit below here)
// ---------------------------------------------------------------------

// A small random-number generator that always gives the same sequence
// for the same text "seed". This keeps each RFC's documents stable.
function seededRandom(seedText) {
  let h = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i++) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function artifactCategory(rfc) {
  const prefix = (rfc.baseId || rfc.id).split("-")[0];
  return RFC_CATEGORIES[prefix] || "server";
}

// Fill {id} {system} ... placeholders.
function fillArtifact(text, rfc) {
  const person = CHARACTERS[rfc.requester];
  return text
    .replaceAll("{id}", rfc.id)
    .replaceAll("{system}", rfc.systems[0])
    .replaceAll("{systems}", rfc.systems.join(", "))
    .replaceAll("{title}", rfc.title)
    .replaceAll("{window}", rfc.window)
    .replaceAll("{name}", person ? (person.shortName || person.name) : "the requester");
}

// Turn hand-written text into simple HTML (paragraphs and bullet lists).
function textToHtml(text) {
  return text.split(/\n\s*\n/).map(block => {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.every(l => l.startsWith("- "))) {
      return `<ul>${lines.map(l => `<li>${l.slice(2)}</li>`).join("")}</ul>`;
    }
    return `<p>${lines.join("<br>")}</p>`;
  }).join("");
}

// The header block every document starts with.
function docHeader(kind, rfc, author, when) {
  return `
    <div class="doc-header">
      <p class="doc-kind">${kind}</p>
      <p class="doc-ref"><strong>${rfc.id}</strong>: ${rfc.title}</p>
      <p class="doc-meta">Systems: ${rfc.systems.join(", ")} &middot; Prepared by ${author} &middot; ${when}</p>
    </div>`;
}

function pick(rng, list) {
  return list[Math.floor(rng() * list.length)];
}
function pickSome(rng, list, count) {
  const copy = [...list];
  const out = [];
  while (out.length < count && copy.length) out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
  return out;
}

// Another RFC from the same category with a different main system,
// used for "copy-pasted from another change" documents.
function decoyRfc(rfc, rng) {
  const category = artifactCategory(rfc);
  const candidates = RFCS.filter(other =>
    other.id !== (rfc.baseId || rfc.id) &&
    artifactCategory(other) === category &&
    other.systems[0] !== rfc.systems[0]);
  return candidates.length ? pick(rng, candidates) : null;
}

const authorName = rfc => {
  const p = CHARACTERS[rfc.requester];
  return p ? (p.shortName || p.name) : "unknown";
};

// ---- Implementation plan ----------------------------------------------
function buildImplementation(rfc, rng) {
  const author = authorName(rfc);
  if (rfc.artifacts && rfc.artifacts.implementation) {
    return docHeader("Implementation Plan", rfc, author, "Submitted with the RFC") + textToHtml(fillArtifact(rfc.artifacts.implementation, rfc));
  }
  const score = { solid: 2, weak: 1, missing: 0 }[rfc.rollback] + { yes: 2, partial: 1, none: 0 }[rfc.testing];
  let body;
  if (score >= 3) {
    body = `
      <h4>Window</h4><p>${rfc.window}</p>
      <h4>Before starting</h4>
      <ul><li>Confirm the window with the service desk and post a notice for affected users.</li>
          <li>Confirm the rollback plan's backup has been taken and verified.</li>
          <li>Second engineer on the call to check each step.</li></ul>
      <h4>Steps</h4>
      <ol><li>Carry out: ${rfc.title.charAt(0).toLowerCase() + rfc.title.slice(1)}.</li>
          <li>Verify ${rfc.systems.join(", ")} after each stage, using the test cases in the test results.</li>
          <li>Hand back to monitoring and watch for 30 minutes.</li></ol>
      <h4>Contacts</h4><p>${author} (lead), on-call network engineer, SFC Ortiz (help desk).</p>`;
  } else if (score === 2) {
    body = `
      <h4>Window</h4><p>${rfc.window}</p>
      <h4>Steps</h4>
      <ol><li>${rfc.title}.</li><li>Check ${rfc.systems[0]} is working afterwards.</li><li>Tell the help desk it's done.</li></ol>
      <h4>Contacts</h4><p>${author}.</p>`;
  } else {
    body = `
      <h4>Window</h4><p>${rfc.window}</p>
      <h4>Steps</h4>
      <ol>${ARTIFACT_TEMPLATES.thinSteps.map(s => `<li>${s}</li>`).join("")}</ol>`;
  }
  return docHeader("Implementation Plan", rfc, author, "Submitted with the RFC") + body;
}

// ---- Rollback plan -------------------------------------------------------
// Returns null when there's no rollback plan attached.
function buildRollback(rfc, rng) {
  const author = authorName(rfc);
  if (rfc.artifacts && rfc.artifacts.rollback) {
    return docHeader("Rollback Plan", rfc, author, "Submitted with the RFC") + textToHtml(fillArtifact(rfc.artifacts.rollback, rfc));
  }
  // Hand-picked copy-paste: attach another RFC's rollback plan on purpose.
  if (rfc.artifacts && rfc.artifacts.rollbackCopiedFrom) {
    const source = RFCS.find(other => other.id === rfc.artifacts.rollbackCopiedFrom);
    if (source) return copiedRollback(source, rng);
  }
  const category = artifactCategory(rfc);

  if (rfc.rollback === "solid") {
    const triggers = pickSome(rng, ARTIFACT_TEMPLATES.rollbackTriggers, 3).map(t => fillArtifact(t, rfc));
    const steps = ARTIFACT_TEMPLATES.rollbackSteps[category].map(s => fillArtifact(s, rfc));
    const minutes = 5 + Math.floor(rng() * 6) * 5;
    return docHeader("Rollback Plan", rfc, author, `Prepared ${1 + Math.floor(rng() * 5)} days ago`) + `
      <h4>Roll back if any of these happen</h4><ul>${triggers.map(t => `<li>${t}</li>`).join("")}</ul>
      <h4>Steps</h4><ol>${steps.map(s => `<li>${s}</li>`).join("")}</ol>
      <h4>Time to restore</h4><p>About ${minutes} minutes. Rehearsed in the lab.</p>
      <h4>Decision authority</h4><p>${author} can call the rollback without further approval.</p>`;
  }

  if (rfc.rollback === "weak") {
    return docHeader("Rollback Plan", rfc, author, "Prepared the day before submission") + `
      <p>${pick(rng, ARTIFACT_TEMPLATES.weakRollback)}</p>
      <p class="doc-muted">No triggers, steps or restore time given.</p>`;
  }

  // Missing: either nothing attached, or a plan copied from another RFC.
  const decoy = rng() < 0.5 ? decoyRfc(rfc, rng) : null;
  if (!decoy) return null;
  return copiedRollback(decoy, rng);
}

// A perfectly good rollback plan... for a DIFFERENT change.
function copiedRollback(decoy, rng) {
  const steps = ARTIFACT_TEMPLATES.rollbackSteps[artifactCategory(decoy)].map(s => fillArtifact(s, decoy));
  return docHeader("Rollback Plan", decoy, authorName(decoy), `Prepared ${3 + Math.floor(rng() * 10)} months ago`) + `
    <h4>Roll back if</h4><ul><li>${fillArtifact(ARTIFACT_TEMPLATES.rollbackTriggers[0], decoy)}</li></ul>
    <h4>Steps</h4><ol>${steps.map(s => `<li>${s}</li>`).join("")}</ol>
    <h4>Time to restore</h4><p>About 15 minutes.</p>`;
}

// ---- Test results --------------------------------------------------------
// Returns null when there's no test evidence attached.
function buildTesting(rfc, rng) {
  const author = authorName(rfc);
  if (rfc.artifacts && rfc.artifacts.testing) {
    return docHeader("Test Results", rfc, author, "Submitted with the RFC") + textToHtml(fillArtifact(rfc.artifacts.testing, rfc));
  }
  const category = artifactCategory(rfc);
  const names = pickSome(rng, ARTIFACT_TEMPLATES.tests[category], 5);
  const table = rows => `
    <table class="doc-table"><thead><tr><th>Test</th><th>Result</th></tr></thead>
    <tbody>${rows.map(([name, result, cls]) => `<tr><td>${name}</td><td class="${cls}">${result}</td></tr>`).join("")}</tbody></table>`;

  if (rfc.testing === "yes") {
    return docHeader("Test Results", rfc, author, `Tested ${1 + Math.floor(rng() * 6)} days ago`) + `
      <h4>Environment</h4><p>Lab replica of the ${rfc.systems[0]}: same model and software version as production.</p>
      ${table(names.map(n => [n, "PASS", "pass"]))}
      <p><strong>Result:</strong> all tests passed. Logs and screenshots attached. Peer-reviewed by CW2 Jackson.</p>`;
  }

  if (rfc.testing === "partial") {
    const rows = names.map((n, i) => {
      if (i === names.length - 1) return [n, "NOT RUN: no lab equipment", "notrun"];
      if (i === names.length - 2 && rng() < 0.5) return [n, "FAIL: accepted, will monitor", "fail"];
      return [n, "PASS", "pass"];
    });
    const env = pick(rng, [
      `Lab unit (a different model from the production ${rfc.systems[0]}).`,
      `Tested on 1 of the production devices only.`,
      `Lab environment with a fraction of production traffic.`
    ]);
    return docHeader("Test Results", rfc, author, `Tested ${1 + Math.floor(rng() * 10)} days ago`) + `
      <h4>Environment</h4><p>${env}</p>
      ${table(rows)}
      <p><strong>Result:</strong> partial coverage. Remaining items to be checked during the change.</p>`;
  }

  // None: nothing, informal "testing", or evidence for something else.
  const roll = rng();
  if (roll < 0.35) return null;
  const decoy = roll >= 0.65 ? decoyRfc(rfc, rng) : null;
  if (!decoy) {
    // Never fall back to a convincing report for THIS change: that would
    // make an untested change look tested.
    return docHeader("Test Results", rfc, author, "Undated") + `
      <h4>Evidence</h4><p>"${pick(rng, ARTIFACT_TEMPLATES.informalTesting)}"</p>
      <p class="doc-muted">No environment, test cases or results recorded.</p>`;
  }
  return docHeader("Test Results", decoy, authorName(decoy), `Tested ${12 + Math.floor(rng() * 20)} months ago`) + `
    <h4>Environment</h4><p>Lab replica of the ${decoy.systems[0]}.</p>
    ${table(pickSome(rng, ARTIFACT_TEMPLATES.tests[artifactCategory(decoy)], 4).map(n => [n, "PASS", "pass"]))}
    <p><strong>Result:</strong> all tests passed.</p>`;
}

// ---- Diagram -------------------------------------------------------------
// Draws a simple before/after chain of boxes as an SVG picture.
function svgEscape(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function diagramChain(category, systems) {
  const chain = [];
  ARTIFACT_TEMPLATES.diagramChains[category].forEach(node => {
    if (node === "*") chain.push(...systems.map(s => ({ label: s, changed: true })));
    else if (!systems.includes(node)) chain.push({ label: node, changed: false });
  });
  return chain;
}

const DIAGRAM_WIDTH = 700;

function drawChain(chain, y, highlight) {
  // Boxes shrink to fit when there are many of them.
  const gap = 16, boxH = 46;
  const boxW = Math.min(126, (DIAGRAM_WIDTH - 20 - (chain.length - 1) * gap) / chain.length);
  const totalW = chain.length * boxW + (chain.length - 1) * gap;
  const startX = (DIAGRAM_WIDTH - totalW) / 2;
  let svg = "";
  chain.forEach((node, i) => {
    const x = startX + i * (boxW + gap);
    if (i > 0) svg += `<line x1="${x - gap}" y1="${y + boxH / 2}" x2="${x}" y2="${y + boxH / 2}" class="dg-link"/>`;
    const cls = highlight && node.changed ? "dg-node dg-changed" : "dg-node";
    // Split long labels over two lines, balancing the line lengths.
    const words = node.label.split(" ");
    let lines = [node.label];
    if (node.label.length > 14 && words.length > 1) {
      let best = 1, bestDiff = Infinity;
      for (let cut = 1; cut < words.length; cut++) {
        const diff = Math.abs(words.slice(0, cut).join(" ").length - words.slice(cut).join(" ").length);
        if (diff < bestDiff) { bestDiff = diff; best = cut; }
      }
      lines = [words.slice(0, best).join(" "), words.slice(best).join(" ")];
    }
    svg += `<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="6" class="${cls}"/>`;
    // Shrink the text a little if the longest line wouldn't fit the box.
    const longest = Math.max(...lines.map(l => l.length));
    const fontSize = Math.min(11, Math.floor(((boxW - 10) / (longest * 0.6)) * 10) / 10);
    lines.forEach((line, li) => {
      const ty = y + boxH / 2 + (li - (lines.length - 1) / 2) * 13 + 4;
      svg += `<text x="${x + boxW / 2}" y="${ty}" class="dg-text" style="font-size:${fontSize}px">${svgEscape(line)}</text>`;
    });
    if (highlight && node.changed) svg += `<text x="${x + boxW / 2}" y="${y - 6}" class="dg-tag">CHANGED</text>`;
  });
  return svg;
}

function buildDiagram(rfc, rng) {
  const author = authorName(rfc);
  const category = artifactCategory(rfc);
  const score = { solid: 2, weak: 1, missing: 0 }[rfc.rollback] + { yes: 2, partial: 1, none: 0 }[rfc.testing];

  // Weak RFCs sometimes attach an old diagram of something else entirely.
  if (score <= 1 && rng() < 0.4) {
    const decoy = decoyRfc(rfc, rng) || rfc;
    const chain = diagramChain(artifactCategory(decoy), decoy.systems.slice(0, 2));
    return docHeader("Network Diagram", rfc, author, "Attached by requester") + `
      <p class="doc-caption">${pick(rng, ARTIFACT_TEMPLATES.staleDiagramNotes)}</p>
      <svg viewBox="0 0 700 90" class="diagram" role="img" aria-label="Old network diagram">
        ${drawChain(chain, 24, false)}
      </svg>
      <p class="doc-muted">No before/after view. No mention of ${rfc.systems.join(", ")} being changed.</p>`;
  }

  const chain = diagramChain(category, rfc.systems.slice(0, 3));
  const note = rfc.artifacts && rfc.artifacts.diagramNote
    ? fillArtifact(rfc.artifacts.diagramNote, rfc)
    : `After: ${rfc.title.charAt(0).toLowerCase() + rfc.title.slice(1)}.`;
  const kind = category === "software" ? "Deployment Diagram" : "Network Diagram";
  return docHeader(kind, rfc, author, "Submitted with the RFC") + `
    <svg viewBox="0 0 700 200" class="diagram" role="img" aria-label="Before and after diagram for ${svgEscape(rfc.id)}">
      <text x="10" y="18" class="dg-heading">BEFORE</text>
      ${drawChain(chain, 30, false)}
      <text x="10" y="118" class="dg-heading">AFTER</text>
      ${drawChain(chain, 130, true)}
    </svg>
    <p class="doc-caption">${svgEscape(note)}</p>`;
}

// ---- Putting it together ---------------------------------------------------
const ARTIFACT_KINDS = [
  { key: "implementation", label: "Implementation Plan", icon: "&#128203;", build: buildImplementation },
  { key: "rollback", label: "Rollback Plan", icon: "&#8617;", build: buildRollback },
  { key: "testing", label: "Test Results", icon: "&#129514;", build: buildTesting },
  { key: "diagram", label: "Diagram", icon: "&#128506;", build: buildDiagram }
];

const artifactCache = new Map();

// All the documents for one RFC: [{ key, label, icon, html (null = not attached) }]
function getArtifacts(rfc) {
  const cacheKey = `${rfc.id}|${rfc.rollback}|${rfc.testing}`;
  if (artifactCache.has(cacheKey)) return artifactCache.get(cacheKey);
  const artifacts = ARTIFACT_KINDS.map(kind => {
    // Each document gets its own seed so they vary independently.
    const rng = seededRandom(`${cacheKey}|${kind.key}`);
    return { key: kind.key, label: kind.label, icon: kind.icon, html: kind.build(rfc, rng) };
  });
  artifactCache.set(cacheKey, artifacts);
  return artifacts;
}
