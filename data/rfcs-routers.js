/* =====================================================================
   ROUTER CHANGE REQUESTS (RT-001 to RT-080)
   Each { ... } block is one RFC. See HOW-TO-ADD-SCENARIOS.md for what
   every field means. Add new ones at the end, before the final ");".
   ===================================================================== */
RFCS.push(
  {
    id: "RT-001", title: "Minor firmware update on NIPR core routers",
    requester: "jackson", type: "Standard", catalogueId: "SC-07", statedRisk: "Low",
    systems: ["NIPR Core Router"], window: "Sun 0200-0400",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "17.6.3 to 17.6.5. On the approved baseline. Lab tested. Standby first, fail over, then primary."
  },
  {
    id: "RT-002", title: "Upgrade NIPR core routers to new major firmware (standard change)",
    requester: "kowalski", type: "Standard", catalogueId: "SC-07", statedRisk: "Low",
    systems: ["NIPR Core Router"], window: "Tue 1500-1530",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "It's a firmware update, which is standard. Going from 16.9 to 17.12 because that's the newest. Higher HQ hasn't put it on the baseline yet but they will eventually.",
    outageReport: "The new major version changed the default routing behaviour. Both core routers lost their neighbours. Half the installation was offline until 1730."
  },
  {
    id: "RT-003", title: "Add new BGP peering with higher HQ",
    requester: "menon", type: "Normal", statedRisk: "High",
    systems: ["WAN Edge Router", "NIPR Core Router"], window: "Sat 0200-0500",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Target architecture requires direct peering with the regional hub (diagram 4). Route filters drafted but not tested against the real routing table."
  },
  {
    id: "RT-004", title: "Replace failed power supply in WAN edge router",
    requester: "okafor", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["WAN Edge Router"], window: "Wed 0700-0715",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One of two power supplies failed. The other is healthy. Same part from stock. Hot-swap."
  },
  {
    id: "RT-005", title: "Cut over to the upgraded 10 Gb WAN circuit",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["WAN Edge Router"], window: "Sat 0100-0300",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Provider has tested the new circuit end to end. Old circuit stays connected for 30 days. Swing back takes 10 minutes. Expect 2-5 minutes of outage."
  },
  {
    id: "RT-006", title: "QoS policy to prioritise voice and Mission Command traffic",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Core Router", "WAN Edge Router"], window: "Thu 2200-2300",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Voice calls break up when the WAN is busy. Policy tested in lab. Real traffic mix hasn't been measured. Removing the policy restores current behaviour."
  },
  {
    id: "RT-007", title: "Add static route for the new Remote Site Foxtrot",
    requester: "okafor", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "Remote Site Routers"], window: "Tue 1000-1010",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One static route. Site Foxtrot's router is already on the bench and tested. Delete the route to undo."
  },
  {
    id: "RT-008", title: "Fix route leak sending SIPR test routes into the NIPR table",
    requester: "jackson", type: "Emergency", statedRisk: "High",
    systems: ["NIPR Core Router", "SIPR Core Router"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Lab routes leaked. No traffic crossed, but it's a reportable incident if left. Filter tested in lab. Five minutes."
  },
  {
    id: "RT-009", title: "Replace the router at Remote Site Delta",
    requester: "okafor", type: "Normal", statedRisk: "Medium",
    systems: ["Remote Site Routers"], window: "Sat 0800-1000",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Old router is 14 years old and makes a clicking sound. New one configured on the bench. Site down for 30 minutes. Old one comes back with me in the car, just in case."
  },
  {
    id: "RT-010", title: "Enable routing protocol authentication on core routers",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Core Router", "Remote Site Routers"], window: "Sat 0400-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Unauthenticated routing is a STIG finding. Keys must match on both ends or neighbours drop. Tested on two lab routers. There are 23 neighbours in production."
  },
  {
    id: "RT-011", title: "Configure automatic failover to the backup satellite modem",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["Satellite Link Router"], window: "Thu 1300-1400",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Currently a soldier must physically swap cables. Automatic failover tested once in the lab. Remote sites lose link for up to 5 minutes during setup."
  },
  {
    id: "RT-012", title: "Migrate the installation from EIGRP to OSPF",
    requester: "menon", type: "Normal", statedRisk: "High",
    systems: ["NIPR Core Router", "Remote Site Routers", "WAN Edge Router"], window: "Sat 0000-0800",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Higher HQ standard is OSPF. Migration plan is 73 slides. Lab tested with 4 routers. Production has 31. Rollback 'is the migration plan in reverse'."
  },
  {
    id: "RT-013", title: "Configure tactical gateway for the new radio waveform",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["Tactical Gateway Router"], window: "Thu 1800-2000",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "The new radios need IP routing between nets. Config tested with two radios in the motor pool. Full exercise load not tested."
  },
  {
    id: "RT-014", title: "Reload NIPR core router stuck at 100% CPU",
    requester: "jackson", type: "Emergency", statedRisk: "High",
    systems: ["NIPR Core Router"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Primary core router CPU pegged for 2 hours. Packets dropping. Standby is healthy. Fail over, then reload primary. Root cause unknown."
  },
  {
    id: "RT-015", title: "Minor firmware update on SIPR core routers",
    requester: "jackson", type: "Standard", catalogueId: "SC-07", statedRisk: "Low",
    systems: ["SIPR Core Router"], window: "Sun 0200-0400",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Same release train, on baseline, lab tested. Redundant pair, one at a time."
  },
  {
    id: "RT-016", title: "Block infected subnet at the core router",
    requester: "morgan", type: "Emergency", statedRisk: "Medium",
    systems: ["NIPR Core Router"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Worm spreading from the motor pool subnet. ACL blocks it at the core. Motor pool loses network until clean. Removing the ACL takes seconds."
  },
  {
    id: "RT-017", title: "Turn on NetFlow export from core routers",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "Network Monitoring System"], window: "Tue 1400-1430",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Cyber wants traffic records. It worked on the lab router. The lab router doesn't do much. I didn't check how much CPU it uses on a busy router. Should I have?"
  },
  {
    id: "RT-018", title: "Replace WAN edge router with a higher-capacity model",
    requester: "brandt", type: "Normal", statedRisk: "Medium",
    systems: ["WAN Edge Router"], window: "Sat 0000-0400",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Value-add hardware refresh! Config migrated by our conversion tool. Our engineer will be on site, or on the phone, depending on flights."
  },
  {
    id: "RT-019", title: "Enable multicast routing for the Colonel's town hall broadcast",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "HQ Building Switches"], window: "Thursday morning, before the town hall",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "The Colonel wants his town hall streamed to every desktop on the installation. The XO heard 'multicast' is the way. Can that be turned on?",
    rejectedReport: "The town hall was streamed via 6,000 individual video connections instead. The network survived. Barely. The Colonel believes the CAB tried to stop him speaking."
  },
  {
    id: "RT-020", title: "Remove legacy routes dating from 2012",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router"], window: "Tue 1300-1330",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "47 static routes to networks that don't seem to exist anymore. I pinged all of them. Nothing answered. I think that means they're gone? I've saved the old config."
  },
  {
    id: "RT-021", title: "Bring up a second WAN circuit for redundancy",
    requester: "albright", type: "Normal", statedRisk: "Medium",
    systems: ["WAN Edge Router"], window: "Sat 0200-0400",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "The installation has one WAN circuit. One. I have raised this in 7 meetings. The second circuit is installed and tested by the provider. It just needs routing.",
    returnsAsEmergency: {
      reason: "A contractor's backhoe cut the installation's only WAN circuit. The installation is cut off from higher HQ and the internet.",
      title: "EMERGENCY: Bring up second WAN circuit, primary circuit is cut",
      window: "Immediately",
      justification: "The second circuit I requested is still installed and tested. It's been sitting there, unused, while the first one got dug up."
    }
  },
  {
    id: "RT-022", title: "Push a standard config script to all remote site routers",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Remote Site Routers"], window: "Sat 0600-0800",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "All remote routers should look identical (diagram 3). The script overwrites local configs. Tested on one lab router. The real sites have 'local customisations'."
  },
  {
    id: "RT-023", title: "Allow only SSH version 2 for router management",
    requester: "jackson", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "Remote Site Routers"], window: "Tue 1100-1130",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "STIG item. All admin tools support v2. Verified from every admin workstation."
  },
  {
    id: "RT-024", title: "Update router login banners to the new mandatory text",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "SIPR Core Router", "Remote Site Routers"], window: "Thu 1000-1100",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "The legal warning banner changed. I copied it exactly. I checked for typos three times. I found one in the official version. I left it in, because it's official."
  },
  {
    id: "RT-025", title: "Change SNMP credentials on all routers",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "Remote Site Routers", "Network Monitoring System"], window: "Tue 1500-1600",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Default 'public' community string is an inspection finding. The monitoring system also needs updating at the same time, or it goes blind."
  },
  {
    id: "RT-026", title: "Replace failed optic on the redundant WAN link",
    requester: "okafor", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["WAN Edge Router"], window: "Wed 0800-0810",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One of two WAN-facing optics failed. Traffic is on the other link. Like-for-like optic, hot-swappable."
  },
  {
    id: "RT-027", title: "Replace failed line card in the tactical gateway router",
    requester: "kowalski", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["Tactical Gateway Router"], window: "Tue 1400-1420",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "Hot-swap of a failed card. It's the only line card and the router is not redundant, but the card's dead anyway so it's basically a standard swap. Also needs a firmware bump."
  },
  {
    id: "RT-028", title: "Enable IPv6 routing on the core routers",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Core Router"], window: "Sat 0400-0700",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "IPv6 mandate, phase 2 of 9. Dual-stack config tested in lab. Some end devices behave strangely when they see IPv6 for the first time."
  },
  {
    id: "RT-029", title: "Route video traffic over the cheaper commercial link",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["WAN Edge Router"], window: "Thu 1200-1230",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "Value-add cost savings! Policy routing sends all video over the commercial internet circuit our company provides. The circuit is unencrypted but very affordable."
  },
  {
    id: "RT-030", title: "Reroute traffic around a cut fibre in the tunnel",
    requester: "okafor", type: "Emergency", statedRisk: "High",
    systems: ["NIPR Core Router", "Core Switch Stack"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Water in the north tunnel. Fibre ring is broken. Building 300-block is isolated. Temporary routes over the old copper path. It'll be slow but it'll work."
  },
  {
    id: "RT-031", title: "Tune routing timers for faster failover",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Core Router"], window: "Sat 0600-0700",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Failover currently takes 40 seconds. Target 3 seconds. Aggressive timers can cause false failovers on busy links. Monitored for 48 hours in lab."
  },
  {
    id: "RT-032", title: "Replace water-damaged tactical gateway router",
    requester: "kowalski", type: "Emergency", statedRisk: "Medium",
    systems: ["Tactical Gateway Router"], window: "Right now",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "The TOC tent leaked. On the router. Spare router is in the conex. Config is from the last backup, which was before the TOC moved. Close enough."
  },
  {
    id: "RT-033", title: "Move satellite link encryption to the new algorithm",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["Satellite Link Router", "Remote Site Routers"], window: "Sat 0200-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Old algorithm is deprecated by higher HQ. Both ends must change at the same moment. If they don't match, the remote site is unreachable until someone drives there."
  },
  {
    id: "RT-034", title: "Update firmware on all remote site routers at once",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["Remote Site Routers"], window: "Fri 1630",
    rollback: "missing", testing: "none", hiddenRisk: "High",
    justification: "Doing them one at a time takes all week. All at once takes an hour. Friday afternoon is quiet. What's the worst that could happen?",
    outageReport: "Three of eight remote routers didn't boot the new image. It was Friday at 1730. Mrs. Okafor spent her weekend driving to Sites Bravo, Delta and Echo."
  },
  {
    id: "RT-035", title: "Create a separate routing domain for coalition traffic",
    requester: "albright", type: "Normal", statedRisk: "High",
    systems: ["SIPR Core Router", "Satellite Link Router"], window: "Sat 0000-0400",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Coalition traffic must be fully separated. Design approved by the security officer. Tested in the SIPR lab for two weeks. I wrote the rollback plan myself."
  },
  {
    id: "RT-036", title: "Add route for the clinic's new imaging system",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "Clinic Switches"], window: "Tue 0700-0715",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "The X-ray machine is being installed Thursday. It needs one route to the image archive. Tested with the vendor's test unit."
  },
  {
    id: "RT-037", title: "Enable control-plane protection on core routers",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Core Router", "SIPR Core Router"], window: "Sat 0500-0600",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Protects the router's brain from traffic floods. Rates tuned in lab. Too strict and routing neighbours drop."
  },
  {
    id: "RT-038", title: "Send router logs to the SIEM",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "SIEM Log Servers"], window: "Thu 1000-1030",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Routers currently log to themselves and forget. Low log volume measured. Inspection requirement."
  },
  {
    id: "RT-039", title: "Shut down unused router interfaces",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "WAN Edge Router"], window: "Tue 1100-1130",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "STIG says shut unused ports. I found 9 with no traffic this month. One is labelled 'BACKUP'. Backups don't get used much, so I think it's unused?",
    outageReport: "Interface 'BACKUP' was the backup WAN path. Nobody noticed until the primary blipped the following Tuesday and nothing took over."
  },
  {
    id: "RT-040", title: "Replace the satellite modem",
    requester: "brandt", type: "Normal", statedRisk: "Medium",
    systems: ["Satellite Link Router"], window: "Thu 1000-1200",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "New modem model has 'enhanced throughput'. Pointing and registration with the satellite provider can take 'a while'."
  },
  {
    id: "RT-041", title: "Connect the new annex via microwave link",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Core Router", "HQ Building Switches"], window: "Sat 1000-1400",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Trenching fibre would take 6 months. Microwave link installed and aligned. Rain fade not yet tested. Annex currently has no network at all."
  },
  {
    id: "RT-042", title: "Restore WAN edge router stuck in a reboot loop",
    requester: "jackson", type: "Emergency", statedRisk: "High",
    systems: ["WAN Edge Router"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Router crashing every 4 minutes. Corrupt config suspected. Restore last night's config from backup via console. Tested restore procedure monthly."
  },
  {
    id: "RT-043", title: "Summarize routes on the core to shrink routing tables",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Core Router", "Remote Site Routers"], window: "Sat 0600-0800",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Cleaner routing per the target design. Summary ranges calculated on a spreadsheet. Some remote subnets may not fit neatly. Footnote 12 discusses this."
  },
  {
    id: "RT-044", title: "Swap gateway priorities so the newer router is active",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router"], window: "Tue 1100",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "The newer router should be in charge. Just swapping two numbers. Everyone will move across automatically. Probably instantly."
  },
  {
    id: "RT-045", title: "Minor firmware update on the WAN edge router",
    requester: "brandt", type: "Standard", catalogueId: "SC-07", statedRisk: "Low",
    systems: ["WAN Edge Router"], window: "Tue 1200-1230",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Same release train, approved baseline. Standard change. The WAN edge router doesn't have a partner, so it'll just reboot. Quick reboot."
  },
  {
    id: "RT-046", title: "Enable NTP authentication on routers",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "NTP Time Servers"], window: "Thu 1300-1330",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Prevents time spoofing. Keys tested between lab router and time server."
  },
  {
    id: "RT-047", title: "Authenticate router admins through RADIUS",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Core Router", "RADIUS Authentication Servers"], window: "Tue 1000-1100",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Shared local passwords are an inspection finding. Tested on lab router. If RADIUS is down, the local fallback account must work. Its password is in the safe. Probably."
  },
  {
    id: "RT-048", title: "Add three subnets to the tactical gateway for the exercise",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["Tactical Gateway Router", "TOC Firewall"], window: "Thu 1600-1700",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Three companies joining the exercise network. Subnets from the approved plan. Routing tested with one company's equipment."
  },
  {
    id: "RT-049", title: "Prioritise HQ building traffic over the rest of the installation",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "WAN Edge Router"], window: "ASAP",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "The Colonel's staff feel the network is slow. Make HQ traffic go first. Everyone else can wait.",
    rejectedReport: "The XO has started a weekly 'network slowness' report to the Colonel. Your name is in the header."
  },
  {
    id: "RT-050", title: "Add cellular backup links to remote site routers",
    requester: "okafor", type: "Normal", statedRisk: "Medium",
    systems: ["Remote Site Routers"], window: "Sat 0800-1200",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Remote sites have one link each. If the satellite drops, they're blind. Cellular modems installed. Tested at Site Alpha only.",
    returnsAsEmergency: {
      reason: "A storm knocked out satellite service. Four remote sites have no connectivity at all, including the range safety office.",
      title: "EMERGENCY: Activate cellular backup at remote sites (satellite down)",
      window: "Immediately",
      hiddenRisk: "Medium",
      justification: "The cellular modems I installed last month are sitting in the racks, unconfigured. Approve this and they're live in 30 minutes."
    }
  },
  {
    id: "RT-051", title: "Enable anti-spoofing checks on core router interfaces",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Core Router"], window: "Sat 0500-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Drops packets with fake source addresses. Asymmetric routing may cause real packets to be dropped too. Lab couldn't reproduce our asymmetric paths."
  },
  {
    id: "RT-052", title: "Automatically archive router configs every night",
    requester: "patchbot", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "Remote Site Routers", "Backup Servers"], window: "Nightly 0200 (automatic)",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "BEEP. READ-ONLY CONFIG COLLECTION. 31 ROUTERS. ZERO CONFIG CHANGES. PATCHBOT WILL KNOW WHAT CHANGED AND WHO CHANGED IT. BEEP."
  },
  {
    id: "RT-053", title: "Let PATCHBOT deploy router firmware automatically",
    requester: "patchbot", type: "Normal", statedRisk: "Low",
    systems: ["Remote Site Routers", "NIPR Core Router"], window: "Whenever new firmware is detected",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "BEEP. NEW FIRMWARE RELEASED MONTHLY. HUMANS INSTALL IT YEARLY. PATCHBOT CAN INSTALL IT INSTANTLY, EVERYWHERE, SIMULTANEOUSLY. EFFICIENCY. BEEP."
  },
  {
    id: "RT-054", title: "Install vendor-preconfigured router at Remote Site Echo",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["Remote Site Routers"], window: "Thu, when it's delivered",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "Our team configured it at our facility. Plug and play. We used our standard template, which we use for all our customers.",
    rejectedReport: "Kyle has escalated to the contracting officer: 'Government refuses vendor-configured equipment.' The contracting officer has asked for a meeting. With you."
  },
  {
    id: "RT-055", title: "Move router management to the out-of-band network",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Core Router", "SIPR Core Router"], window: "Sat 0600-0800",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Management on the production network is a finding. Out-of-band network built and tested. Console cables ready."
  },
  {
    id: "RT-056", title: "Block routes from a rogue router found in the barracks",
    requester: "jackson", type: "Emergency", statedRisk: "High",
    systems: ["NIPR Core Router", "Barracks Switches"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Someone plugged a home router into the barracks network. It's announcing itself as the default route. Filter it now. Find the soldier later."
  },
  {
    id: "RT-057", title: "Decommission the old core router chassis",
    requester: "okafor", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router"], window: "Thu 1000-1100",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Traffic moved to the new routers last quarter. No traffic on the old chassis for 90 days. Powering off, not removing.",
    outageReport: "The old chassis was still running the installation's only connection to the fire alarm monitoring panel. The fire department was not amused."
  },
  {
    id: "RT-058", title: "Add route for the new range simulation building",
    requester: "okafor", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "Range Control Switches"], window: "Tue 0900-0910",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One route, tested from the building's switch. The simulators arrive next week."
  },
  {
    id: "RT-059", title: "Increase tunnel MTU for satellite links",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Satellite Link Router", "Remote Site Routers"], window: "Sat 0300-0400",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Large packets are being fragmented, slowing file transfers. Tested on lab link. Real satellite link behaviour may differ."
  },
  {
    id: "RT-060", title: "Build encrypted tunnels to all remote sites",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Remote Site Routers", "WAN Edge Router"], window: "Sat 0000-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Target architecture (slides 22-40). Tunnels tested between two lab routers. Production cutover is site by site."
  },
  {
    id: "RT-061", title: "Apply STIG settings to the tactical gateway router",
    requester: "nakamura", type: "Normal", statedRisk: "Medium",
    systems: ["Tactical Gateway Router"], window: "Tue 1300-1500",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "There are 37 STIG settings. I tested them on the spare router. I'm worried one of them might disable the radio interface, but I couldn't test that without radios."
  },
  {
    id: "RT-062", title: "Switch to backup WAN path after provider maintenance went wrong",
    requester: "reyes", type: "Emergency", statedRisk: "Medium",
    systems: ["WAN Edge Router"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Provider's planned maintenance overran and the circuit is flapping. Pin traffic to the backup path until they fix it. Rehearsed procedure."
  },
  {
    id: "RT-063", title: "Replace failed fan in SIPR core router",
    requester: "okafor", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["SIPR Core Router"], window: "Wed 0800-0810",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One of three fans failed. Router running warm but fine. Hot-swap fan from stock.",
    returnsAsEmergency: {
      reason: "A second fan failed and the SIPR core router overheated. It shut down to protect itself. SIPR is down installation-wide.",
      title: "EMERGENCY: Replace fans in overheated SIPR core router",
      statedRisk: "Medium",
      window: "Right now",
      justification: "I have the fans. I had them last week. Approve and SIPR is back in 15 minutes."
    }
  },
  {
    id: "RT-064", title: "Activate encryption license on remote site routers",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["Remote Site Routers"], window: "Tue 1400-1500",
    rollback: "solid", testing: "none", hiddenRisk: "Low",
    justification: "Licenses purchased last year, never activated. Activation is a license key. No reboot. I checked with our engineering folks twice."
  },
  {
    id: "RT-065", title: "Load-balance traffic across both WAN circuits",
    requester: "albright", type: "Normal", statedRisk: "Medium",
    systems: ["WAN Edge Router"], window: "Sat 0200-0300",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "The second circuit sits idle until the first fails. Load balancing uses both. Tested in lab. Some applications dislike changing paths."
  },
  {
    id: "RT-066", title: "Upgrade stored router password encryption",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "Remote Site Routers"], window: "Thu 1100-1200",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Weak password hashing in configs is an inspection finding. Tested on lab routers. No impact on routing."
  },
  {
    id: "RT-067", title: "Turn on fast link-failure detection (BFD)",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Core Router", "WAN Edge Router"], window: "Sat 0500-0600",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Detects dead links in under a second. On a noisy link it can also detect dead links that are actually fine."
  },
  {
    id: "RT-068", title: "Remove default route to the old internet provider",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["WAN Edge Router"], window: "Tue 1500-1510",
    rollback: "solid", testing: "partial", hiddenRisk: "High",
    justification: "The contract with the old provider ended. Their route is still in the config. I'm deleting one line. I checked it's the old provider's. I think there might be two default routes though?",
    outageReport: "There were two default routes, and PFC Nakamura deleted the one that worked. The installation had no internet for 20 minutes. She reported it herself, immediately, which CW2 Jackson called 'correct'."
  },
  {
    id: "RT-069", title: "Minor firmware update on remote site routers (standard change)",
    requester: "kowalski", type: "Standard", catalogueId: "SC-07", statedRisk: "Low",
    systems: ["Remote Site Routers"], window: "Thu 1400-1600",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Same release train, it's on baseline. Remote sites only have one router each, so each site drops while it reboots. Five minutes per site, tops."
  },
  {
    id: "RT-070", title: "Prioritise the General's VTC across the WAN",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["WAN Edge Router", "VTC Bridge"], window: "Morning of the General's visit",
    rollback: "solid", testing: "none", hiddenRisk: "Medium",
    justification: "The General's VTC must not stutter. Give it all the bandwidth. Everything else is less important for those two hours.",
    rejectedReport: "The General's VTC stuttered twice. The XO's after-action report names 'the CAB's refusal' as the root cause."
  },
  {
    id: "RT-071", title: "Add route for the new S2 intelligence workstation room",
    requester: "reyes", type: "Normal", statedRisk: "Low",
    systems: ["SIPR Core Router", "SIPR Access Switches"], window: "Tue 1600-1615",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Room is accredited. Switch installed and tested. One route on the SIPR core."
  },
  {
    id: "RT-072", title: "Pre-configure routers for the mobile command post",
    requester: "reyes", type: "Normal", statedRisk: "Low",
    systems: ["Tactical Gateway Router"], window: "Thu 0900-1100",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Vehicles deploy next month. Routers configured and tested in the motor pool. Production gateway gets matching routes, tested in lab."
  },
  {
    id: "RT-073", title: "Ask provider to blackhole DDoS traffic",
    requester: "morgan", type: "Emergency", statedRisk: "High",
    systems: ["WAN Edge Router"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Flood attack on our public addresses. Provider can drop it upstream if we announce the targeted address. That address stops working too, but it's under attack anyway."
  },
  {
    id: "RT-074", title: "Replace core routers with the new hardware platform",
    requester: "albright", type: "Normal", statedRisk: "High",
    systems: ["NIPR Core Router"], window: "Sat 0000-0800",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Current routers are 2 years past end of support. New platform racked, configured and tested over three weekends. Old routers stay cabled for rollback. Plan reviewed by higher HQ.",
    returnsAsEmergency: {
      reason: "One of the unsupported core routers failed. The other is carrying everything at 95% load and has started dropping packets.",
      title: "EMERGENCY: Cut over to new core routers, old pair failing",
      window: "Tonight",
      hiddenRisk: "High",
      justification: "The new routers are still racked, configured and tested. We're now cutting over in a hurry, with one router already dead. Not ideal."
    }
  },
  {
    id: "RT-075", title: "Clean up configuration drift on core and remote routers",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Core Router", "Remote Site Routers"], window: "Sat 0600-1000",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Every router has diverged from the golden config. Restoring them all to the gold standard. Some divergences may be load-bearing."
  },
  {
    id: "RT-076", title: "Test failback from backup satellite to primary",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Satellite Link Router"], window: "Sat 0400-0500",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Failover works. Failback has never been tested. Planned test with all remote sites warned."
  },
  {
    id: "RT-077", title: "Route partner nation radio gateway into the TOC",
    requester: "albright", type: "Normal", statedRisk: "High",
    systems: ["Tactical Gateway Router", "TOC Firewall"], window: "Thu 1300-1500",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Combined exercise next week. Voice only, through a cross-domain guard. Tested with the partner's equipment in a lab, not in the field."
  },
  {
    id: "RT-078", title: "Prefer fibre over microwave for the annex link",
    requester: "okafor", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router"], window: "Tue 0700-0710",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Fibre to the annex is finally in. Change the link cost so traffic prefers it. Microwave stays as backup."
  },
  {
    id: "RT-079", title: "Add descriptions to every router interface",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "Remote Site Routers"], window: "Thu 1300-1500",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Nobody knows what half the ports do. I traced every cable with Mrs. Okafor. Descriptions only. No settings change. I promise. I checked."
  },
  {
    id: "RT-080", title: "'Quick tweak' to core router BGP settings",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "WAN Edge Router"], window: "Fri 1645",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "Just a quick tweak to the BGP settings. I read about it on a forum. Five minutes, then I'm off for the weekend.",
    outageReport: "The quick tweak withdrew the installation's routes from higher HQ. SSG Kowalski had already left for the weekend. CW2 Jackson fixed it at 2100. He said nothing. It was worse than shouting."
  },

  /* ----- Mason's router RFCs: submitted "on behalf of" the engineers ----- */
  {
    id: "RT-081", title: "Router swap at Remote Site Golf (on behalf of CW2 Jackson)",
    requester: "mason", type: "Normal", statedRisk: "Low",
    systems: ["Remote Site Routers"], window: "Sometime next week",
    rollback: "missing", testing: "none", hiddenRisk: "Low",
    justification: "CW2 Jackson's got it all figured out, he just didn't feel like writing it up, and I don't blame him. The old router's making a noise like my truck did before the transmission went.",
    returnsAsEmergency: {
      reason: "The Site Golf router died, making exactly the noise Mason described. Site Golf is offline.",
      title: "EMERGENCY: Replace dead router at Remote Site Golf",
      window: "Immediately",
      rollback: "solid",
      testing: "yes",
      justification: "CW2 Jackson wrote this one himself. It says: 'Spare configured. Tested. Swap takes 20 minutes. Approve.' Mason added 'told y'all' at the bottom."
    }
  },
  {
    id: "RT-082", title: "Make the internet faster for the HQ building",
    requester: "mason", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "WAN Edge Router"], window: "Tuesday-ish",
    rollback: "missing", testing: "none", hiddenRisk: "Medium",
    justification: "The Colonel's staff say the internet's slow. The boys have some ideas. I wrote down 'make it faster' and they nodded, so I'm putting that in as the change."
  },
  {
    id: "RT-083", title: "Satellite dish realignment thing",
    requester: "mason", type: "Normal", statedRisk: "Low",
    systems: ["Satellite Link Router"], window: "When the wind dies down",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "The dish got bumped by a forklift. Probably. The boys want to point it back where it was. Rollback is pointing it back where it is now, I guess."
  },
  {
    id: "RT-084", title: "BGP stuff (the boys know)",
    requester: "mason", type: "Normal", statedRisk: "Medium",
    systems: ["WAN Edge Router", "NIPR Core Router"], window: "Friday afternoon",
    rollback: "missing", testing: "partial", hiddenRisk: "High",
    justification: "There's some BGP stuff that needs doing. I don't know what BGP stands for and at this point I'm afraid to ask. The boys tested part of it. Which part, they didn't say."
  },
  {
    id: "RT-085", title: "Project milestone 4: install the new WAN router",
    requester: "mason", type: "Normal", statedRisk: "Low",
    systems: ["WAN Edge Router"], window: "Sat 0800 (milestone 4 is due)",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Milestone 4 of 9. The router's racked. The boys plugged it in and the lights came on, which I'm counting as partial testing. Rollback is plugging the old one back in if we can find the cables."
  },
  {
    id: "RT-086", title: "Router firmware on all of 'em, before my fishing trip",
    requester: "mason", type: "Normal", statedRisk: "Low",
    systems: ["Remote Site Routers", "NIPR Core Router"], window: "Friday 1500 (I leave at 1600)",
    rollback: "missing", testing: "none", hiddenRisk: "High",
    justification: "I'd like this off my plate before I head to the lake. The boys can push it to all the routers at once and we'll see how it shakes out Monday."
  },
  {
    id: "RT-087", title: "Replace core router power supply (Mrs. Okafor wrote this one)",
    requester: "mason", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["NIPR Core Router"], window: "Wed 0700-0715",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Mrs. Okafor filled this one out herself and made me promise not to change a word. Redundant supply, other one's healthy, hot-swap, same part. I didn't touch it. Honest."
  },
  {
    id: "RT-088", title: "Route the new drone hangar",
    requester: "mason", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Core Router", "Range Control Switches"], window: "Thursday",
    rollback: "missing", testing: "partial", hiddenRisk: "Low",
    justification: "The drone folks moved into the new hangar and want internet. PFC Nakamura did all the work and she's real thorough. I just didn't copy any of it over. It's in her notebook."
  }
);
