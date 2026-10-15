/* =====================================================================
   SWITCH CHANGE REQUESTS (SW-001 to SW-090)
   Each { ... } block is one RFC. See HOW-TO-ADD-SCENARIOS.md for what
   every field means. Add new ones at the end, before the final ");".
   ===================================================================== */
RFCS.push(
  {
    id: "SW-001", title: "Move the Personnel Pit office port to the personnel VLAN",
    requester: "ortiz", type: "Standard", catalogueId: "SC-06", statedRisk: "Low",
    systems: ["HQ Building Switches"], window: "Tue 1200-1210",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One access port, approved VLAN for the HQ building, port security stays on. The new Personnel Pit clerk can't reach the personnel system."
  },
  {
    id: "SW-002", title: "Change VLAN on the HQ uplink port (standard change)",
    requester: "kowalski", type: "Standard", catalogueId: "SC-06", statedRisk: "Low",
    systems: ["HQ Building Switches", "Core Switch Stack"], window: "Tue 1000-1005",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "It's a VLAN change on a port, which is a standard change. The port happens to be the uplink for the whole HQ building. Same thing really.",
    outageReport: "Changing the uplink's VLAN disconnected the entire HQ building, including the Colonel's office, during the morning update brief."
  },
  {
    id: "SW-003", title: "Replace failed power supply in the core switch stack",
    requester: "okafor", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["Core Switch Stack"], window: "Wed 0700-0715",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Stack member 2 lost one of its two power supplies. The other is fine. Hot-swap from stock."
  },
  {
    id: "SW-004", title: "Minor firmware update on the core switch stack",
    requester: "jackson", type: "Standard", catalogueId: "SC-07", statedRisk: "Low",
    systems: ["Core Switch Stack"], window: "Sun 0200-0400",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Same release train, approved baseline. Lab stack tested. Rolling upgrade, one member at a time."
  },
  {
    id: "SW-005", title: "Upgrade core switches to the vendor's newest major release",
    requester: "brandt", type: "Standard", catalogueId: "SC-07", statedRisk: "Low",
    systems: ["Core Switch Stack"], window: "Thu 1100-1200",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Firmware updates are standard, so this is standard. It's a new major release with lots of value-add features. It's not on your baseline yet, but it's on ours."
  },
  {
    id: "SW-006", title: "Replace end-of-life barracks switches",
    requester: "okafor", type: "Normal", statedRisk: "Medium",
    systems: ["Barracks Switches"], window: "Sat 0800-1600",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Twelve switches from 2009. New ones configured on the bench. Each barracks loses network for about 20 minutes during its swap.",
    returnsAsEmergency: {
      reason: "Two of the old barracks switches died overnight. Three barracks buildings have no network, and the soldiers have discovered the help desk phone number.",
      title: "EMERGENCY: Replace failed barracks switches (3 buildings offline)",
      window: "Immediately",
      hiddenRisk: "Medium",
      justification: "The new switches are configured and still on my bench. Now we're doing it in a hurry instead of on a Saturday."
    }
  },
  {
    id: "SW-007", title: "Enable 802.1X port authentication in the HQ building",
    requester: "morgan", type: "Normal", statedRisk: "High",
    systems: ["HQ Building Switches", "RADIUS Authentication Servers"], window: "Sat 0600-1000",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Only authenticated devices may connect. Tested with 20 workstations. Printers, phones and the Colonel's coffee machine have not been tested."
  },
  {
    id: "SW-008", title: "Enable port security on barracks switches",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["Barracks Switches"], window: "Tue 1000-1200",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Limit each port to one device. Stops soldiers plugging in home routers (see RT-056). Some soldiers have a laptop AND a console on one port."
  },
  {
    id: "SW-009", title: "Move spanning-tree root to the core switch stack",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Core Switch Stack", "HQ Building Switches"], window: "Sat 0500-0600",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "The root is currently a switch in a closet in the motor pool. That is wrong. Brief network reconvergence expected."
  },
  {
    id: "SW-010", title: "Shut down port causing a broadcast storm in the motor pool",
    requester: "okafor", type: "Emergency", statedRisk: "Low",
    systems: ["Motor Pool Switches"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Someone plugged both ends of a cable into the same switch. Motor pool network is down. I've found the port. Shutting it takes a second."
  },
  {
    id: "SW-011", title: "Create a voice VLAN for the HQ building's new phones",
    requester: "ortiz", type: "Normal", statedRisk: "Medium",
    systems: ["HQ Building Switches", "VoIP Call Manager"], window: "Tue 1800-1900",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Separate VLAN for 200 new phones. Tested with 10 phones. Users briefed. Help desk script ready."
  },
  {
    id: "SW-012", title: "Replace the data center switches",
    requester: "albright", type: "Normal", statedRisk: "High",
    systems: ["Data Center Switches"], window: "Sat 0000-0800",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Current switches are out of support. New switches staged and tested for 3 weeks. Every server cable is labelled and mapped. Old switches stay racked for rollback.",
    returnsAsEmergency: {
      reason: "One of the unsupported data center switches failed. Half the servers lost one network link. If the other switch fails, the data center goes dark.",
      title: "EMERGENCY: Replace failing data center switches",
      window: "Tonight",
      hiddenRisk: "High",
      justification: "Same switches, same plan, now with one already dead and no time for a careful cutover."
    }
  },
  {
    id: "SW-013", title: "Install switch for the new annex building",
    requester: "reyes", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches"], window: "Tue 0900-1000",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "New building, new switch, nothing currently connected. Configured from the approved template and tested."
  },
  {
    id: "SW-014", title: "Increase power budget for new security cameras",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["Motor Pool Switches"], window: "Thu 1300-1330",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "The MPs installed 16 cameras that draw power from the switch. Raising the switch's power allocation. Phones on the same switch also draw power."
  },
  {
    id: "SW-015", title: "Shut unused ports on barracks switches",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Barracks Switches"], window: "Tue 1400-1500",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "STIG requirement. I listed every port with no link for 30 days. Some soldiers are on leave, so their ports might look unused. I've noted their rooms."
  },
  {
    id: "SW-016", title: "Add two new switches to the core stack while it's live",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["Core Switch Stack"], window: "Tue 1100",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "The new switches can join the stack while it's running. I saw a video. They'll just sync up. Takes two minutes.",
    outageReport: "The new switches had a newer firmware version and tried to become stack master. They won. They also wiped the stack's config. The core network was down for 2 hours."
  },
  {
    id: "SW-017", title: "Re-cable the Building 200 comms closet",
    requester: "okafor", type: "Normal", statedRisk: "Medium",
    systems: ["HQ Building Switches"], window: "Sat 0700-1300",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "The closet is a spaghetti nightmare. Every cable will be traced, labelled and replaced. Photos taken first. Some cables lead to places nobody remembers."
  },
  {
    id: "SW-018", title: "Enable DHCP snooping on access switches",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["HQ Building Switches", "Barracks Switches", "DNS/DHCP Servers"], window: "Sat 0600-0800",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Stops rogue DHCP servers. Every uplink must be marked trusted or nobody gets an address. Tested on one building."
  },
  {
    id: "SW-019", title: "Replace the SIPR access switches in the TOC",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["SIPR Access Switches"], window: "Sat 0900-1200",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Accredited replacements, configured and tested in the SIPR lab. Old switches kept until Monday. SIPR down in the TOC for 30 minutes."
  },
  {
    id: "SW-020", title: "Assign SIPR access port for the new Ops Floor workstation",
    requester: "reyes", type: "Standard", catalogueId: "SC-06", statedRisk: "Low",
    systems: ["SIPR Access Switches"], window: "Tue 1300-1310",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One access port, approved SIPR VLAN for that room, port security enabled. Workstation accredited."
  },
  {
    id: "SW-021", title: "Update firmware on clinic switches",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Clinic Switches"], window: "Sun 0200-0400",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Clinic switches are 3 major versions behind the reference baseline. Lab tested on a different model. The pharmacy and lab systems run 24/7."
  },
  {
    id: "SW-022", title: "Replace Range Control switch after lightning strike",
    requester: "okafor", type: "Emergency", statedRisk: "High",
    systems: ["Range Control Switches"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Lightning hit the range tower. The switch is a smoking brick. Range is closed until it's replaced. Spare is configured from last month's backup."
  },
  {
    id: "SW-023", title: "Turn on LLDP neighbour discovery on all switches",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Core Switch Stack", "HQ Building Switches"], window: "Thu 1000-1030",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "It lets switches tell us what's plugged into them. CW2 Jackson said it was 'a good idea'. I've written that in my notebook."
  },
  {
    id: "SW-024", title: "Bundle data center links for more bandwidth",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Data Center Switches", "Core Switch Stack"], window: "Sat 0400-0500",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Two 10 Gb links bundled into one 20 Gb link. Mismatched settings on either end will drop the link. Done in lab."
  },
  {
    id: "SW-025", title: "Move core switch stack to the new UPS circuit",
    requester: "okafor", type: "Normal", statedRisk: "Medium",
    systems: ["Core Switch Stack"], window: "Sat 0600-0700",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "The old UPS batteries are swelling. Move power cords one at a time to the new UPS. Each switch has two power supplies, so it should stay up. Should."
  },
  {
    id: "SW-026", title: "Replace failed fan in an HQ building switch",
    requester: "okafor", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["HQ Building Switches"], window: "Wed 0730-0740",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One of two fans failed. The other is running. Hot-swap fan from stock.",
    returnsAsEmergency: {
      reason: "The second fan failed. The switch overheated and shut down. The third floor of the HQ building, including the Colonel's office, has no network.",
      title: "EMERGENCY: Replace failed fans, HQ third floor offline",
      statedRisk: "Medium",
      window: "Right now",
      justification: "I'm standing in the closet with the fans. The switch is hot enough to fry an egg. Approve and it's back in 10 minutes."
    }
  },
  {
    id: "SW-027", title: "Swap a dead barracks switch for a spare (standard change)",
    requester: "kowalski", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["Barracks Switches"], window: "Tue 1500-1530",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "Hardware replacement is standard. It's the whole switch, not a part, and there's no backup switch, and the spare needs configuring. But it's hardware."
  },
  {
    id: "SW-028", title: "Enable jumbo frames in the data center",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Data Center Switches", "Virtualization Cluster"], window: "Sat 0200-0500",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Larger packets improve storage performance (slides 18-25). Every device in the path must agree on frame size. The inventory of devices in the path is 'nearly complete'."
  },
  {
    id: "SW-029", title: "Create a VLAN for the exercise simulation network",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["Core Switch Stack", "HQ Building Switches"], window: "Thu 1800-1900",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Simulation must stay separate from production. New VLAN, tagged to the simulation room only. Tested in lab."
  },
  {
    id: "SW-030", title: "Install a switch in the Colonel's quarters",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches"], window: "This weekend",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "The Colonel would like the government network in his on-post house. Run a cable from the HQ building. It's only 600 metres.",
    rejectedReport: "The XO says the Colonel was 'surprised' to learn that network cables have a maximum length. He believes CAB invented this limit."
  },
  {
    id: "SW-031", title: "Disable CDP on user-facing switch ports",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches", "Barracks Switches"], window: "Tue 1100-1130",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Leaks device information to anyone who plugs in. STIG finding. IP phones use LLDP instead, verified."
  },
  {
    id: "SW-032", title: "Move switch management to a new VLAN",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Core Switch Stack", "HQ Building Switches", "Barracks Switches"], window: "Sat 0500-0700",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Management traffic is mixed with user traffic. Move it. If a step goes wrong we lose remote access and walk to the closet."
  },
  {
    id: "SW-033", title: "Swap motor pool switches into weatherproof enclosures",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["Motor Pool Switches"], window: "Thu 1300-1500",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "The motor pool switches live next to a pressure washer. New enclosures are rated for it. Moving the switches means unplugging everything."
  },
  {
    id: "SW-034", title: "Set storm-control thresholds on access ports",
    requester: "jackson", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches", "Barracks Switches", "Motor Pool Switches"], window: "Tue 2000-2100",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "Limits broadcast floods like last week's motor pool loop. Thresholds conservative. Port blocks itself if exceeded."
  },
  {
    id: "SW-035", title: "Let PATCHBOT auto-fix switch config compliance drift",
    requester: "patchbot", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches", "Barracks Switches", "Core Switch Stack"], window: "Continuous",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "BEEP. 3,412 SWITCH SETTINGS DO NOT MATCH THE STANDARD. PATCHBOT WILL MAKE THEM MATCH. ALL OF THEM. IMMEDIATELY. BEEP."
  },
  {
    id: "SW-036", title: "Back up switch configs every night",
    requester: "patchbot", type: "Normal", statedRisk: "Low",
    systems: ["Core Switch Stack", "HQ Building Switches", "Backup Servers"], window: "Nightly 0130 (automatic)",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "BEEP. READ-ONLY. PATCHBOT ONLY LOOKS. PATCHBOT DOES NOT TOUCH. (THIS TIME.) BEEP."
  },
  {
    id: "SW-037", title: "Move barracks wireless access points to their own VLAN",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["Barracks Switches"], window: "Tue 1300-1400",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Barracks Wi-Fi shares a VLAN with the barracks offices. Separate VLAN tested with one access point. There are 48."
  },
  {
    id: "SW-038", title: "Enable SSH and disable telnet on all switches",
    requester: "jackson", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches", "Barracks Switches", "Motor Pool Switches"], window: "Thu 1000-1100",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "STIG finding. SSH keys generated and tested on every switch first. Telnet off last."
  },
  {
    id: "SW-039", title: "Authenticate switch admins through RADIUS",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["Core Switch Stack", "HQ Building Switches", "RADIUS Authentication Servers"], window: "Tue 0900-1000",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Individual admin accounts instead of a shared password. Fallback local account configured. If RADIUS fails at the wrong moment, we're locked out."
  },
  {
    id: "SW-040", title: "Replace failed member of the core switch stack",
    requester: "jackson", type: "Emergency", statedRisk: "High",
    systems: ["Core Switch Stack"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Stack member 3 is dead. Everything on it is offline. Spare matches firmware. Swap, let it join the stack, verify."
  },
  {
    id: "SW-041", title: "Replace all HQ building switches over a weekend",
    requester: "albright", type: "Normal", statedRisk: "Medium",
    systems: ["HQ Building Switches"], window: "Sat 0600-Sun 1800",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Fourteen switches, planned for six months. Every port mapped. Staging tested. Two engineers on site all weekend. I have personally checked the coffee supply.",
    returnsAsEmergency: {
      reason: "Three of the old HQ switches failed within an hour of each other on Monday morning. Half the HQ building is offline.",
      title: "EMERGENCY: Replace failed HQ building switches (half the building down)",
      window: "Immediately",
      hiddenRisk: "Medium",
      justification: "The replacements are staged in the closet, as they were when you rejected this. My notes on the date of that decision are very precise."
    }
  },
  {
    id: "SW-042", title: "Segregate clinic medical devices onto their own VLANs",
    requester: "menon", type: "Normal", statedRisk: "High",
    systems: ["Clinic Switches"], window: "Sun 0000-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Medical devices must be isolated (reference architecture, 61 slides). Device list compiled from purchase records. Some devices were bought on credit cards and aren't on it."
  },
  {
    id: "SW-043", title: "Reassign 40 HQ offices to the new staff VLAN",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["HQ Building Switches"], window: "Sat 0800-1000",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Staff reorganisation means new VLANs. 40 ports at once by script. Tested on 2 ports. The script is beautiful."
  },
  {
    id: "SW-044", title: "Shut down port with a rogue wireless access point",
    requester: "morgan", type: "Emergency", statedRisk: "Low",
    systems: ["HQ Building Switches"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Someone in the Supply Cage plugged in a home Wi-Fi router named 'FREE_WIFI_NO_PASSWORD'. Shutting the port."
  },
  {
    id: "SW-045", title: "Replace failed optic on a redundant core uplink",
    requester: "okafor", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["Core Switch Stack"], window: "Wed 0800-0805",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One of two uplinks to the barracks has a dead optic. Traffic is on the other. Same optic from stock."
  },
  {
    id: "SW-046", title: "Fix time zone settings on all switches",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Core Switch Stack", "HQ Building Switches"], window: "Thu 1500-1530",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Half the switches think they're in a different time zone, so the logs don't line up. I fixed one and checked the logs. Now they match."
  },
  {
    id: "SW-047", title: "Build a switch stack for the brigade TOC",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["SIPR Access Switches", "Tactical Gateway Router"], window: "Thu 0800-1200",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "New ruggedized stack for the field TOC. Configured and tested in the motor pool. Real field conditions (dust, heat, generators) not tested."
  },
  {
    id: "SW-048", title: "Upgrade barracks uplinks from 1 Gb to 10 Gb",
    requester: "okafor", type: "Normal", statedRisk: "Medium",
    systems: ["Barracks Switches", "Core Switch Stack"], window: "Sat 0800-1100",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Soldiers stream video every evening and the uplinks are maxed. New optics and fibre patch cords. Each barracks drops for a few minutes."
  },
  {
    id: "SW-049", title: "Configure private VLANs in the data center",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Data Center Switches"], window: "Sat 0200-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Servers shouldn't talk to each other unless needed (slide 33). Some clustered servers definitely need to talk to each other. The list of which ones is in progress."
  },
  {
    id: "SW-050", title: "Turn on IP source guard on access switches",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["HQ Building Switches"], window: "Sat 0700-0800",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Blocks spoofed addresses. Depends on DHCP snooping data. Devices with static addresses will be blocked unless listed. The list has 'most' of them."
  },
  {
    id: "SW-051", title: "Reboot every switch to clear a memory leak",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["Core Switch Stack", "HQ Building Switches", "Barracks Switches"], window: "Tue 1200 (lunch)",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "Some switches show high memory. Rebooting fixes it. Doing them all at once at lunch is fastest. They usually come back."
  },
  {
    id: "SW-052", title: "Break a network loop in the HQ building",
    requester: "ortiz", type: "Emergency", statedRisk: "High",
    systems: ["HQ Building Switches"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Someone plugged a phone's PC port back into the wall. HQ network is crawling. Help desk has found the port. Shut it."
  },
  {
    id: "SW-053", title: "Connect the new range observation tower by fibre",
    requester: "okafor", type: "Normal", statedRisk: "Low",
    systems: ["Range Control Switches"], window: "Tue 0700-0800",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Fibre pulled and tested. One new switch port on the range switch. No live fire on Tuesday."
  },
  {
    id: "SW-054", title: "Mirror a suspect workstation's port for investigation",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches"], window: "Tue 0900-0910",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Investigating unusual traffic from one office. Copy that port's traffic to our sensor. Read-only, invisible to the user."
  },
  {
    id: "SW-055", title: "Mirror all core switch traffic to the new security sensor",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Core Switch Stack", "SIEM Log Servers"], window: "Sat 0400-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Full visibility, per the security architecture. The sensor's capacity is 10 Gb. The core carries 60 Gb. It will 'sample'."
  },
  {
    id: "SW-056", title: "Apply STIG settings to SIPR access switches",
    requester: "nakamura", type: "Normal", statedRisk: "Medium",
    systems: ["SIPR Access Switches"], window: "Tue 1300-1500",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "I tested all 52 settings on the SIPR lab switch. The lab switch is a different model from the production ones. I wanted to mention that."
  },
  {
    id: "SW-057", title: "Minor firmware update on SIPR access switches",
    requester: "jackson", type: "Standard", catalogueId: "SC-07", statedRisk: "Low",
    systems: ["SIPR Access Switches"], window: "Sun 0300-0500",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Same train, on baseline, lab tested. Switches are in redundant pairs. One at a time."
  },
  {
    id: "SW-058", title: "Rename all VLANs 'for clarity'",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["Core Switch Stack", "HQ Building Switches"], window: "Thu 1400",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "VLAN names are confusing. I'll rename them to something better. Just names, not numbers. Some of our scripts use the names, but that's their problem."
  },
  {
    id: "SW-059", title: "Replace motor pool switches",
    requester: "albright", type: "Normal", statedRisk: "Medium",
    systems: ["Motor Pool Switches"], window: "Sat 0700-1100",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Replacing the switches SSG Kowalski 'weatherproofed' with tape. New rugged switches configured and tested. Port map verified by me."
  },
  {
    id: "SW-060", title: "Add second power supply to clinic switches",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["Clinic Switches"], window: "Wed 0600-0700",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Clinic switches have one power supply each. If one fails, the pharmacy goes offline. Adding the second is hot-pluggable."
  },
  {
    id: "SW-061", title: "Let the vendor run a remote 'health check' script on all switches",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["Core Switch Stack", "HQ Building Switches"], window: "Thu, when our engineer connects",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "Value-add complimentary health check. Our script needs admin rights. It only reads things. Mostly. It might 'fix minor issues' it finds."
  },
  {
    id: "SW-062", title: "Swap HQ switches for the vendor's new brand (free trial)",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches"], window: "Sat 0800-1600",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Free 90-day trial of our new switches! Not on the approved products list yet, but that's paperwork. Config converted by our tool.",
    rejectedReport: "Kyle's company sent a letter to the Colonel about 'missed innovation opportunities'. The letter had the company logo on it in gold."
  },
  {
    id: "SW-063", title: "Create a VLAN for the new security cameras",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["Motor Pool Switches", "HQ Building Switches"], window: "Tue 1400-1430",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Cameras are on the user VLAN. MPs and Cyber agree they should be separate. Tested with 4 cameras."
  },
  {
    id: "SW-064", title: "Replace dead clinic switch, pharmacy offline",
    requester: "okafor", type: "Emergency", statedRisk: "Medium",
    systems: ["Clinic Switches"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "The pharmacy switch died. Prescriptions are being written by hand. Spare is configured from last night's backup. 15 minutes."
  },
  {
    id: "SW-065", title: "Enable link checks on fibre uplinks",
    requester: "jackson", type: "Normal", statedRisk: "Low",
    systems: ["Core Switch Stack", "Barracks Switches"], window: "Tue 2100-2130",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "Detects one-way fibre failures that cause loops. Enabled on both ends of each link. Lab tested."
  },
  {
    id: "SW-066", title: "Renumber the core switch stack members",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["Core Switch Stack"], window: "Tue 1300",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "The stack members are numbered 1, 3, 4, 2. It bothers me. Renumbering needs a stack reload, but it'll look much tidier."
  },
  {
    id: "SW-067", title: "Change the native VLAN on all trunk links",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["Core Switch Stack", "HQ Building Switches", "Barracks Switches"], window: "Sat 0400-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "VLAN 1 as native is a STIG finding. Both ends of every trunk must change together. Mismatches break the link. There are 140 trunks."
  },
  {
    id: "SW-068", title: "Decommission switches in the 'empty' Building 412",
    requester: "okafor", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches"], window: "Thu 1000-1100",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Building 412 was vacated in the spring. No traffic in 60 days. Powering off the switches.",
    outageReport: "Building 412 isn't empty: the chaplain moved in last month and uses the network every Sunday. The chaplain was gracious about it. Mrs. Okafor was mortified."
  },
  {
    id: "SW-069", title: "Add a switch in the gym for PT music and displays",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["Barracks Switches"], window: "Before Monday PT",
    rollback: "solid", testing: "none", hiddenRisk: "Low",
    justification: "The Colonel wants music and motivational displays at 0600 PT. A switch in the gym. It's not connected to anything important."
  },
  {
    id: "SW-070", title: "Dedicated switch for the General's visit conference room",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches", "Core Switch Stack"], window: "Day before the visit",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "The XO wants the conference room on its own switch, wired directly into the core, 'so nothing can go wrong'. Install the day before.",
    rejectedReport: "The XO briefed the Colonel that the conference room has 'standard' network for the General's visit. The Colonel's expression was described as 'disappointed'."
  },
  {
    id: "SW-071", title: "Minor firmware update on data center switches",
    requester: "jackson", type: "Standard", catalogueId: "SC-07", statedRisk: "Low",
    systems: ["Data Center Switches"], window: "Sun 0200-0400",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Same train, baseline approved, lab tested. Pairs updated one at a time. Servers are dual-homed."
  },
  {
    id: "SW-072", title: "Synchronise data center switch configs to the reference design",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Data Center Switches"], window: "Sat 0400-0700",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "The data center pair has drifted apart. Aligning both to the reference template. Some differences may exist for good reasons nobody wrote down."
  },
  {
    id: "SW-073", title: "Shut SIPR port after suspected classified spillage",
    requester: "morgan", type: "Emergency", statedRisk: "Low",
    systems: ["SIPR Access Switches"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Possible spillage incident in the Intel Vault. Isolate the workstation's port now, per the incident procedure. Security officer notified."
  },
  {
    id: "SW-074", title: "Replace barracks switch damaged by an energy drink",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["Barracks Switches"], window: "Tue 1600-1630",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "A soldier balanced an energy drink on the comms cabinet. The switch drank it. Spare configured from backup. Barracks C has been offline since lunch."
  },
  {
    id: "SW-075", title: "Change SNMP credentials on all switches",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["Core Switch Stack", "HQ Building Switches", "Network Monitoring System"], window: "Tue 1500-1600",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Default credentials are a finding. Monitoring system must be updated at the same time or it goes blind for a while."
  },
  {
    id: "SW-076", title: "Trust phone QoS markings on access ports",
    requester: "ortiz", type: "Normal", statedRisk: "Medium",
    systems: ["HQ Building Switches", "VoIP Call Manager"], window: "Thu 1900-2000",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Calls break up during busy periods. Trusting phone markings gives voice priority. Tested on 10 phones."
  },
  {
    id: "SW-077", title: "Consolidate the two barracks switch stacks into one",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Barracks Switches"], window: "Sat 0800-1200",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Simpler topology, per the design. Requires re-cabling and a stack rebuild. Barracks offline for the morning."
  },
  {
    id: "SW-078", title: "Minor firmware update on the Range Control switch (standard change)",
    requester: "kowalski", type: "Standard", catalogueId: "SC-07", statedRisk: "Low",
    systems: ["Range Control Switches"], window: "Tue 1000-1020",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Minor update, on baseline. Range Control only has one switch so it'll drop for a reboot. There's a live-fire range today but it's only a few minutes."
  },
  {
    id: "SW-079", title: "Install a switch in the new motor pool bay",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["Motor Pool Switches"], window: "Thu 0900-1000",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "New maintenance bay, new switch, from the approved template. Nothing else is connected yet. Even I can't break this one."
  },
  {
    id: "SW-080", title: "Add port descriptions on HQ building switches",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches"], window: "Tue 1300-1500",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "I walked every floor with a label maker. 640 ports. Descriptions only, no settings. My knees hurt."
  },
  {
    id: "SW-081", title: "Re-address switch management interfaces",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Core Switch Stack", "HQ Building Switches", "Barracks Switches"], window: "Sat 0600-0900",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "New management address plan (slide 9). Each switch gets a new address. Monitoring, backups and admin tools all need updating."
  },
  {
    id: "SW-082", title: "Rejoin core switch stack split after a power blip",
    requester: "jackson", type: "Emergency", statedRisk: "High",
    systems: ["Core Switch Stack"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Power blip split the stack in two. Both halves think they're in charge. Intermittent outages everywhere. Reload one half to rejoin."
  },
  {
    id: "SW-083", title: "Turn off power on unused switch ports to save energy",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches"], window: "Thu 1600-1630",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Energy audit recommendation. I listed ports with nothing drawing power. Some phones go to sleep at night. I ran my list during the day."
  },
  {
    id: "SW-084", title: "Move clinic switches to the new comms closet",
    requester: "okafor", type: "Normal", statedRisk: "Medium",
    systems: ["Clinic Switches"], window: "Sun 0600-1000",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "The clinic's closet is under a leaking AC unit. New closet ready. Every cable labelled. The pharmacy stays on a temporary switch during the move.",
    returnsAsEmergency: {
      reason: "The AC unit above the clinic comms closet burst. Water is in the switches. The clinic and pharmacy are offline.",
      title: "EMERGENCY: Move clinic switches out of the flooded closet",
      statedRisk: "High",
      window: "Immediately",
      testing: "partial",
      justification: "The new closet I prepared is still ready. The old one is now a paddling pool. I'm standing in it."
    }
  },
  {
    id: "SW-085", title: "Enable DHCP option 82 on access switches",
    requester: "jackson", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches", "DNS/DHCP Servers"], window: "Tue 2000-2030",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "Lets the DHCP server know which port a request came from. Tested with the lab DHCP server."
  },
  {
    id: "SW-086", title: "Add a quarantine VLAN for non-compliant devices",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["HQ Building Switches", "RADIUS Authentication Servers"], window: "Sat 0700-0900",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Devices missing patches get moved to a quarantine VLAN automatically. Tested on 5 laptops. Compliance checks occasionally misfire."
  },
  {
    id: "SW-087", title: "Install a switch in the chapel for streamed services",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches"], window: "Thu 1000-1100",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "The chaplain wants to stream services to deployed families. Small switch, approved template, tested. Nothing else connected."
  },
  {
    id: "SW-088", title: "Rate-limit barracks ports during the exercise",
    requester: "reyes", type: "Normal", statedRisk: "Low",
    systems: ["Barracks Switches"], window: "Exercise start, Monday 0500",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "Barracks streaming competes with exercise traffic. Cap each barracks port at 20 Mb for two weeks. Removed after ENDEX."
  },
  {
    id: "SW-089", title: "Factory reset spare switches and return them to stock",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Switches"], window: "Tue 1300-1400",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Six spare switches in the cage still have old configs. Resetting them so they're ready. They're not plugged into anything. I checked. Twice."
  },
  {
    id: "SW-090", title: "Enable spanning-tree protection on all access ports",
    requester: "jackson", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches", "Barracks Switches", "Motor Pool Switches"], window: "Tue 2000-2100",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Shuts a port if someone plugs a switch into it. Would have prevented last month's three loops. Lab tested."
  },

  /* ----- Mason's switch RFCs: submitted "on behalf of" the engineers ----- */
  {
    id: "SW-091", title: "Switches for the new barracks (on behalf of PFC Nakamura)",
    requester: "mason", type: "Normal", statedRisk: "Low",
    systems: ["Barracks Switches"], window: "Next week sometime",
    rollback: "missing", testing: "none", hiddenRisk: "Low",
    justification: "Nakamura did a real nice job on this. She's got a whole binder with diagrams and everything. I didn't bring the binder."
  },
  {
    id: "SW-092", title: "Fix the Wi-Fi in the dining facility",
    requester: "mason", type: "Normal", statedRisk: "Low",
    systems: ["Barracks Switches"], window: "Thursday",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "The cooks say the Wi-Fi's slow and they're the ones who make the biscuits, so this is a priority. The boys are going to 'move some stuff around' on the switches."
  },
  {
    id: "SW-093", title: "Swap the motor pool switch that makes the noise",
    requester: "mason", type: "Normal", statedRisk: "Low",
    systems: ["Motor Pool Switches"], window: "Whenever the boys get to it",
    rollback: "missing", testing: "none", hiddenRisk: "Medium",
    justification: "There's a switch in the motor pool that's been making a grinding noise for a month. SSG Kowalski says it's fine. That's why I'm submitting this.",
    returnsAsEmergency: {
      reason: "The grinding motor pool switch stopped grinding. Then it stopped working. The motor pool is offline mid-inspection.",
      title: "EMERGENCY: Replace dead motor pool switch",
      window: "Immediately",
      rollback: "solid",
      testing: "partial",
      justification: "Mrs. Okafor has a spare configured and is already walking over there. Mason has added 'I did say' to the RFC, which is technically true."
    }
  },
  {
    id: "SW-094", title: "VLAN stuff for the new project",
    requester: "mason", type: "Standard", catalogueId: "SC-06", statedRisk: "Low",
    systems: ["Core Switch Stack", "HQ Building Switches"], window: "Tuesday",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "VLAN changes are standard, right? This is a bunch of them, on the core switches I think, for the project. Some might be new VLANs. The boys will sort out the details."
  },
  {
    id: "SW-095", title: "Core switch upgrade (milestone 7 of 12)",
    requester: "mason", type: "Normal", statedRisk: "Medium",
    systems: ["Core Switch Stack"], window: "Saturday, if the weather holds",
    rollback: "missing", testing: "partial", hiddenRisk: "High",
    justification: "Milestone 7 says 'core switch upgrade'. I wrote milestone 7. The boys have done some testing, and SSG Kowalski says he's 'pretty sure' about the rest."
  },
  {
    id: "SW-096", title: "Switch for the project management office",
    requester: "mason", type: "Normal", statedRisk: "Low",
    systems: ["HQ Building Switches"], window: "Monday",
    rollback: "missing", testing: "none", hiddenRisk: "Low",
    justification: "I need more ports in my office for my laptop, my other laptop, my printer, and the TV for the Gantt chart. A little switch. What's the worst that could happen?"
  },
  {
    id: "SW-097", title: "Replace barracks switches, phase 2 (Mrs. Okafor's plan)",
    requester: "mason", type: "Normal", statedRisk: "Medium",
    systems: ["Barracks Switches"], window: "Sat 0800-1400",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Mrs. Okafor made me attach her whole plan this time. She said she was tired of me 'abridging' her. It's got a rollback plan and everything. I read most of it."
  },
  {
    id: "SW-098", title: "Turn off the blinking lights on the server room switches",
    requester: "mason", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Switches"], window: "Tuesday",
    rollback: "missing", testing: "none", hiddenRisk: "Medium",
    justification: "The blinking lights are distracting the boys. There's a setting to turn the port lights off. The boys say the lights also tell them when something's broken, but they'll manage."
  }
);
