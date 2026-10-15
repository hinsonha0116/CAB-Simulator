/* =====================================================================
   FIREWALL CHANGE REQUESTS (FW-001 to FW-110)
   Each { ... } block is one RFC. See HOW-TO-ADD-SCENARIOS.md for what
   every field means. Add new ones at the end, before the final ");".
   ===================================================================== */
RFCS.push(
  {
    id: "FW-001", title: "Block IP range linked to an active phishing campaign",
    requester: "morgan", type: "Emergency", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Higher HQ confirmed this range is sending credential-phishing emails to our soldiers right now. One block rule, tested against the lab firewall. Removing it takes 30 seconds."
  },
  {
    id: "FW-002", title: "Open ports for the Colonel's new VTC system",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall", "VTC Bridge"], window: "Tonight, whenever is convenient",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "The Colonel purchased a new VTC system with his own funds and it 'needs some ports'. The vendor's guide says to open 'all UDP'. The Colonel needs it for Monday's brief.",
    rejectedReport: "The XO informed the Colonel that 'the CAB' is why Monday's brief will be by speakerphone. The Colonel now knows what a CAB is.",
    artifacts: {
      testing: "Attached: page 4 of the VTC vendor's home-user setup guide.\n\n\"For the best experience, open all UDP ports on your home router, from any address. If you still have problems, turn off your firewall.\"\n\nNo testing has been done on the installation network. The XO has highlighted the second sentence in yellow.",
      rollback: "If the VTC causes any problems, the XO will tell the Colonel, and the Colonel will tell the network team to fix it.",
      diagramNote: "A photo of the box the VTC system came in. The box has a picture of a happy family on a video call."
    },
    outageReport: "Opening 'all UDP' let the VTC work, and also let a vulnerability scanner from higher HQ find 40 new open ports. Inspection finding opened before breakfast."
  },
  {
    id: "FW-003", title: "Apply critical firmware fix (IAVA) to NIPR perimeter firewall",
    requester: "morgan", type: "Emergency", statedRisk: "High",
    systems: ["NIPR Perimeter Firewall"], window: "Tue 2300-0100",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Critical vulnerability with a public exploit. Compliance deadline is 72 hours. Tested on the lab unit. The HA pair means users should only see a short blip during failover."
  },
  {
    id: "FW-004", title: "Replace failed power supply in Data Center Firewall",
    requester: "okafor", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["Data Center Firewall"], window: "Wed 0700-0730",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One of two power supplies failed overnight. The other is healthy. Like-for-like part from stock. I've done this more times than I've had birthdays."
  },
  {
    id: "FW-005", title: "Renew management certificate on the firewall manager",
    requester: "reyes", type: "Standard", catalogueId: "SC-02", statedRisk: "Low",
    systems: ["Firewall Management Server"], window: "Thu 0800-0815",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Certificate expires in 9 days. Same CA, same host name. If it expires, nobody can log in to manage any firewall.",
    returnsAsEmergency: {
      reason: "The firewall manager certificate expired. Nobody can log in to change any firewall on the installation, including to block threats.",
      title: "EMERGENCY: Renew EXPIRED firewall manager certificate",
      window: "Immediately",
      justification: "It expired, as forecast in my original RFC. We're currently unable to make any firewall change at all. The renewal itself is still a 15-minute procedure."
    }
  },
  {
    id: "FW-006", title: "Allow logistics database to reach file servers (template rule)",
    requester: "reyes", type: "Standard", catalogueId: "SC-05", statedRisk: "Low",
    systems: ["Data Center Firewall", "Logistics Database"], window: "Tue 1800-1830",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Approved template FT-12, internal only, named hosts, 12-month expiry. Supply section needs nightly exports to the shared drive."
  },
  {
    id: "FW-007", title: "Allow maintenance laptops to reach all servers (template rule)",
    requester: "kowalski", type: "Standard", catalogueId: "SC-05", statedRisk: "Low",
    systems: ["Data Center Firewall"], window: "Thu 1500-1515",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "Using the template. Source: any. Destination: any server. Port: any. It's basically the same as the template, just more flexible. Saves us submitting 40 of these.",
    outageReport: "A maintenance laptop with an old virus now had a direct path to every server. The endpoint team spent the night cleaning three file servers."
  },
  {
    id: "FW-008", title: "Remove 300 expired rules from the Data Center Firewall",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Data Center Firewall"], window: "Sat 0600-0900",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Rules with zero hits in 12 months. Full config backup taken. Restore takes 5 minutes. Some quarterly jobs may not show in 12 months of logs."
  },
  {
    id: "FW-009", title: "Enable geo-blocking on the NIPR perimeter",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Perimeter Firewall"], window: "Thu 2200-2300",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Block inbound traffic from countries we have no business with. Tested with the vendor's list. The list is three years old and might include a country where we have an exercise partner."
  },
  {
    id: "FW-010", title: "Upgrade TOC firewall to new major firmware before the exercise",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["TOC Firewall"], window: "Sun 2200 (the night before the exercise)",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "New version has better dashboards. It came out last week. Didn't have time to test it but the release notes look solid. Rollback is 'reinstall the old one', I think.",
    outageReport: "The new firmware didn't support the TOC's old interface modules. The brigade TOC started the exercise on a single borrowed hotspot."
  },
  {
    id: "FW-011", title: "Add remote support access rule for contractor engineers",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall"], window: "Whenever our engineer is free",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "Our engineers need to connect directly from our office to troubleshoot faster. It's a value-add. The rule is from 'our network' to 'your network'.",
    rejectedReport: "Kyle went over your head to the contracting officer, who asked the Colonel why IT is 'impeding the vendor'."
  },
  {
    id: "FW-012", title: "Enable TLS inspection on the NIPR perimeter",
    requester: "menon", type: "Normal", statedRisk: "High",
    systems: ["NIPR Perimeter Firewall", "PKI Validation Servers"], window: "Sat 0000-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Higher HQ directive: inspect encrypted traffic. Attached: 52 slides. Tested with 20 lab users. 6,000 real users and 400 applications have not been tested."
  },
  {
    id: "FW-013", title: "Migrate rule base from old firewall to new Data Center Firewall cluster",
    requester: "jackson", type: "Normal", statedRisk: "High",
    systems: ["Data Center Firewall"], window: "Sat 0000-0800",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Old firewall is end of support. Rules converted and verified line by line. Old firewall stays cabled for 7 days. Cut back takes 10 minutes."
  },
  {
    id: "FW-014", title: "Tighten SIPR perimeter rules to new STIG",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["SIPR Perimeter Firewall"], window: "Tue 2200-2330",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "New STIG release has 14 firewall findings. All tested on the SIPR lab stack. Config backup taken. Inspectors will check this.",
    returnsAsEmergency: {
      reason: "Inspectors found the 14 open STIG findings on the SIPR perimeter firewall. The installation's authority to operate is now under review.",
      title: "EMERGENCY: Close STIG findings on SIPR perimeter before ATO review",
      window: "Tonight",
      justification: "Same tested changes as my original request. The difference is that higher HQ now calls about it hourly."
    }
  },
  {
    id: "FW-015", title: "Send all firewall deny logs to the SIEM",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall", "SIEM Log Servers"], window: "Thu 1900-1930",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Cyber asked for deny logs. I tested it on one rule and it worked. I didn't check how many denies we get per second. I can find out if that's important?",
    outageReport: "It turns out the firewall denies 40,000 connections per second. The SIEM filled its disks in 3 hours and stopped collecting everything else."
  },
  {
    id: "FW-016", title: "Configure high-availability pair at Remote Site Alpha",
    requester: "okafor", type: "Normal", statedRisk: "Medium",
    systems: ["Remote Site Firewalls"], window: "Sat 0800-1200",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Second firewall arrived. HA config tested on the bench, not with the site's real links. The site will be offline for up to 20 minutes during cutover."
  },
  {
    id: "FW-017", title: "Allow Mission Command servers to reach the tactical gateway",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["TOC Firewall", "Mission Command Servers"], window: "Thu 2000-2100",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Needed for the new common operating picture feed. Named hosts and ports only. Validated in the training enclave last week."
  },
  {
    id: "FW-018", title: "Block social media on the barracks network during the exercise",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall", "Barracks Switches"], window: "Exercise start, Monday 0500",
    rollback: "solid", testing: "none", hiddenRisk: "Medium",
    justification: "The Colonel wants operational security during the exercise. All social media, for everyone, for two weeks. How hard can it be?",
    outageReport: "The block list also caught the messaging app the Family Readiness Group uses. 300 spouses called the help desk. Some called the Colonel."
  },
  {
    id: "FW-019", title: "Open temporary rule for the exercise red team",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Perimeter Firewall"], window: "Mon 0600-Fri 1800 (auto-expires)",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Authorized red team needs a path in for the exercise. Rule auto-expires Friday. Rules of engagement signed. Scope is limited to the training enclave."
  },
  {
    id: "FW-020", title: "Upgrade the Firewall Management Server operating system",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Firewall Management Server"], window: "Sat 0800-1100",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "OS is end of life next quarter. Snapshot before change. Firewalls keep running without the manager. We just can't change them while it's down."
  },
  {
    id: "FW-021", title: "Reorder Data Center Firewall rules for performance",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall"], window: "Tue 1600-1630",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "Moving the busiest rules to the top so it's faster. It's just moving lines around. What could go wrong with moving lines around?",
    outageReport: "One 'deny' moved above the 'allow' it was meant to sit under. Half the file shares disappeared at 1601. SSG Kowalski moved the lines back at 1748."
  },
  {
    id: "FW-022", title: "Add IPv6 rules to the NIPR perimeter firewall",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Perimeter Firewall"], window: "Sat 0200-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Higher HQ IPv6 mandate. Lab testing done with two hosts. Real traffic patterns are unknown. Rollback means removing 180 rules by hand."
  },
  {
    id: "FW-023", title: "Isolate a compromised workstation subnet",
    requester: "morgan", type: "Emergency", statedRisk: "High",
    systems: ["Data Center Firewall"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Malware beaconing from one building's subnet. Block that subnet from the data center until we clean it. One rule. Users in that building lose access, which is the point."
  },
  {
    id: "FW-024", title: "Restore the accidentally deleted print server rule",
    requester: "ortiz", type: "Emergency", statedRisk: "Low",
    systems: ["Data Center Firewall", "Print Servers"], window: "Right now",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Yesterday's cleanup removed the print rule. Nobody on the installation can print. We have the exact rule from last week's backup."
  },
  {
    id: "FW-025", title: "Enable automatic threat-signature updates on perimeter firewalls",
    requester: "patchbot", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall", "SIPR Perimeter Firewall"], window: "Daily 0300 (automatic)",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "BEEP. THREAT SIGNATURES CURRENTLY UPDATED MANUALLY, WEEKLY. HUMANS FORGET. PATCHBOT DOES NOT FORGET. ROLLBACK: PREVIOUS SIGNATURE SET RETAINED. BEEP."
  },
  {
    id: "FW-026", title: "Switch intrusion prevention from 'alert' to 'block' mode",
    requester: "morgan", type: "Normal", statedRisk: "High",
    systems: ["NIPR Perimeter Firewall"], window: "Thu 2200-2300",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Ran in alert mode for 30 days and tuned out false positives. Some may remain. Switching back to alert is one checkbox."
  },
  {
    id: "FW-027", title: "Replace failed fan tray in SIPR perimeter firewall",
    requester: "okafor", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["SIPR Perimeter Firewall"], window: "Wed 0730-0800",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One of two fan trays failed. The other is running on high. Hot-swappable, like-for-like part from stock. Five minutes.",
    returnsAsEmergency: {
      reason: "The second fan tray failed overnight. The SIPR perimeter firewall overheated and shut itself down. SIPR access is down installation-wide.",
      title: "EMERGENCY: Replace BOTH fan trays, SIPR firewall is down",
      statedRisk: "Medium",
      window: "Right now",
      justification: "I have the parts in my hand. Both trays, then a cold start. SIPR back in 20 minutes if you approve it now."
    }
  },
  {
    id: "FW-028", title: "Replace power supply in TOC firewall (other one failed last week)",
    requester: "kowalski", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["TOC Firewall"], window: "Tue 1300-1315",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "Standard hot-swap. The other power supply died last week so this is the only one running, but it's making a noise. Should be a quick swap.",
    outageReport: "Pulling the only working power supply turned the TOC firewall off. Turns out a hot-swap needs a second power supply to be hot. The TOC was dark for 50 minutes."
  },
  {
    id: "FW-029", title: "Allow new VoIP phones through the Data Center Firewall",
    requester: "ortiz", type: "Normal", statedRisk: "Medium",
    systems: ["Data Center Firewall", "VoIP Call Manager"], window: "Tue 1900-2000",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "200 new phones for the HQ building. Rule tested with 10 phones on the bench. Users briefed. Old phones stay plugged in until Friday."
  },
  {
    id: "FW-030", title: "Open RDP from the internet 'temporarily' for vendor troubleshooting",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall"], window: "ASAP, only for a couple of weeks",
    rollback: "missing", testing: "none", hiddenRisk: "High",
    justification: "Our engineer can't get a CAC working on his home laptop, so remote desktop straight in from the internet is the simplest value-add. We'll close it when we're done. Probably.",
    rejectedReport: "Kyle has told his company's program manager that the installation is 'blocking support'. The program manager has emailed the Garrison Commander."
  },
  {
    id: "FW-031", title: "Decommission old firewall pair at Remote Site Bravo",
    requester: "okafor", type: "Normal", statedRisk: "Low",
    systems: ["Remote Site Firewalls"], window: "Thu 1300-1400",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Traffic moved to the new pair a month ago. Logs show nothing on the old pair for 30 days. Plan is to power off, not remove, for 60 days.",
    outageReport: "The range weather station was still pointed at the old pair, and it only reports during live-fire weeks. Range Control lost weather data for a whole afternoon of firing."
  },
  {
    id: "FW-032", title: "Reconfigure TOC firewall for the new brigade TOC layout",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["TOC Firewall", "Tactical Gateway Router"], window: "Sat 0900-1300",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "The TOC has moved tents. New zones for the operations cell and the intel cell. Config built and reviewed. We can only fully test it once the tents are up."
  },
  {
    id: "FW-033", title: "Switch firewall admin logins to CAC authentication",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["Firewall Management Server", "RADIUS Authentication Servers"], window: "Tue 1000-1100",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Local admin passwords are an inspection finding. Tested with my own CAC. A break-glass local account will remain, assuming someone remembers its password."
  },
  {
    id: "FW-034", title: "Point firewalls at the new NTP time servers",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall", "NTP Time Servers"], window: "Thu 1400-1415",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "The old time server is being retired. I tested on the lab firewall and the time is right. I double-checked the time zone. Then I triple-checked it."
  },
  {
    id: "FW-035", title: "Emergency rule for the MEDEVAC coordination system",
    requester: "reyes", type: "Emergency", statedRisk: "Medium",
    systems: ["TOC Firewall"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "The MEDEVAC request system can't reach the aviation unit since last night's TOC move. Named hosts, one port. Lives depend on it."
  },
  {
    id: "FW-036", title: "Block outbound DNS except to internal resolvers",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Perimeter Firewall", "DNS/DHCP Servers"], window: "Sat 0600-0700",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Malware loves outside DNS servers. Tested with standard workstations. Some appliances may have hard-coded outside DNS. We'll find out."
  },
  {
    id: "FW-037", title: "Allow the patch server to reach vendor update sites",
    requester: "patchbot", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall", "Patch Server"], window: "Tue 1200-1215",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "BEEP. PATCHBOT CANNOT DOWNLOAD PATCHES. PATCHBOT IS SAD. NAMED DESTINATIONS ONLY, HTTPS ONLY. TESTED IN LAB. BEEP."
  },
  {
    id: "FW-038", title: "Allow nightly backup traffic to the backup servers (template rule)",
    requester: "reyes", type: "Standard", catalogueId: "SC-05", statedRisk: "Low",
    systems: ["Data Center Firewall", "Backup Servers"], window: "Tue 1500-1515",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Template FT-03, internal only, named hosts, 12-month expiry. New file server needs to be included in nightly backups."
  },
  {
    id: "FW-039", title: "Allow appliances to reach the vendor's cloud update site (template rule)",
    requester: "brandt", type: "Standard", catalogueId: "SC-05", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall"], window: "Thu 1100-1130",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "It's the standard template. The destination is just on the internet instead of inside. But it's our cloud, so it's basically internal."
  },
  {
    id: "FW-040", title: "Increase session timeout to stop the Colonel's VTC dropping",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall", "VTC Bridge"], window: "Before 0900 tomorrow",
    rollback: "solid", testing: "none", hiddenRisk: "Medium",
    justification: "The Colonel's calls drop after exactly 60 minutes. The XO googled it. Set the timeout to 24 hours for everything."
  },
  {
    id: "FW-041", title: "Planned failover test of the Data Center Firewall cluster",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Data Center Firewall"], window: "Sat 0700-0800",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Never tested failover since install. Better to find out now than during a real failure. Expect 1-3 seconds of loss. Maybe more."
  },
  {
    id: "FW-042", title: "Apply vendor hotfix to all Remote Site Firewalls remotely",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["Remote Site Firewalls"], window: "Thu, whenever our engineer logs in",
    rollback: "missing", testing: "partial", hiddenRisk: "High",
    justification: "Hotfix tested at another customer, who 'mostly' had no issues. We'll apply to all six sites at once to save time. Rollback isn't supported for this hotfix.",
    outageReport: "Four of six remote sites didn't come back. Kyle's engineer had gone to lunch. Mrs. Okafor drove to two sites with a console cable."
  },
  {
    id: "FW-043", title: "Put the clinic network behind its own firewall zone",
    requester: "menon", type: "Normal", statedRisk: "High",
    systems: ["Data Center Firewall", "Clinic Switches"], window: "Sat 0000-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Medical devices must be segmented per the reference architecture (slides 1-61 attached). The device inventory is 'mostly complete'."
  },
  {
    id: "FW-044", title: "Allow Range Control to reach the national weather service",
    requester: "okafor", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall", "Range Control Switches"], window: "Tue 0800-0815",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Range Control needs lightning data to stop live fire safely. One destination, HTTPS only. Tested from the lab."
  },
  {
    id: "FW-045", title: "Block ransomware command-and-control domains",
    requester: "morgan", type: "Emergency", statedRisk: "High",
    systems: ["NIPR Perimeter Firewall"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Intel bulletin from higher HQ: ransomware group targeting military networks this week. 312 domains to block. Lab-tested. These domains have no legitimate use."
  },
  {
    id: "FW-046", title: "Rename 2,000 firewall objects to the new naming standard",
    requester: "menon", type: "Normal", statedRisk: "Low",
    systems: ["Firewall Management Server", "Data Center Firewall"], window: "Sat 0800-1600",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "New naming standard (document attached, 38 pages). A script will rename everything. The script has not been run on anything yet. It's very elegant."
  },
  {
    id: "FW-047", title: "Install upgraded license on the firewall manager",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["Firewall Management Server"], window: "Tue 1400-1430",
    rollback: "solid", testing: "none", hiddenRisk: "Low",
    justification: "License file swap. Old license is saved. Value-add: more dashboards. No reboot needed according to the documentation, which I have read."
  },
  {
    id: "FW-048", title: "Open port 443 'any to any' for the Colonel's tablet",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall"], window: "Tonight",
    rollback: "missing", testing: "none", hiddenRisk: "High",
    justification: "The Colonel's personal tablet can't get his email. The XO asked a friend, who said to open 443 'for everything'. It's just one port.",
    rejectedReport: "The Colonel brought up 'IT obstruction' at the command and staff meeting. You were in the room. Everyone looked at you."
  },
  {
    id: "FW-049", title: "Rebuild the TOC firewall config from scratch after the exercise",
    requester: "kowalski", type: "Normal", statedRisk: "Medium",
    systems: ["TOC Firewall"], window: "Mon 0800-1700",
    rollback: "missing", testing: "none", hiddenRisk: "High",
    justification: "The config got messy during the exercise. Wiping it and starting fresh is faster than cleaning up. I'll remember what was needed. Mostly."
  },
  {
    id: "FW-050", title: "Allow firewall admin access from jump hosts only",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["Firewall Management Server"], window: "Thu 1000-1030",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Admins currently manage firewalls from their normal desktops. Inspection finding. Tested from one jump host. If it goes wrong we lock ourselves out of the firewall manager."
  },
  {
    id: "FW-051", title: "Apply new STIG settings to Remote Site Firewalls",
    requester: "nakamura", type: "Normal", statedRisk: "Medium",
    systems: ["Remote Site Firewalls"], window: "Sat 0900-1200",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "I applied the STIG on one site's spare firewall and it worked. I'm not 100% sure the other five sites are configured the same. I think they are? I wanted to be upfront."
  },
  {
    id: "FW-052", title: "Add SIPR firewall rules for the new coalition partner link",
    requester: "albright", type: "Normal", statedRisk: "High",
    systems: ["SIPR Perimeter Firewall", "Satellite Link Router"], window: "Sat 0200-0500",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Required for the combined exercise. Rules approved by the security officer, tested end to end with the partner last Thursday. I have personally reviewed every line."
  },
  {
    id: "FW-053", title: "Disable 40 unused VPN profiles",
    requester: "jackson", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall"], window: "Tue 1300-1315",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "No logins in 6 months. Disable, not delete. Re-enable takes a minute."
  },
  {
    id: "FW-054", title: "Re-enable recruiter VPN profile disabled by mistake",
    requester: "ortiz", type: "Emergency", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall"], window: "Right now",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Yesterday's VPN cleanup disabled the recruiters' profile. 30 recruiters in the field can't work. It's one checkbox to turn it back on."
  },
  {
    id: "FW-055", title: "Allow new SIEM collector to receive firewall logs (template rule)",
    requester: "morgan", type: "Standard", catalogueId: "SC-05", statedRisk: "Low",
    systems: ["Data Center Firewall", "SIEM Log Servers"], window: "Thu 1300-1315",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Template FT-07 (syslog to SIEM). Internal, named hosts, 12-month expiry."
  },
  {
    id: "FW-056", title: "Move NAT rules to the installation's new public IP block",
    requester: "menon", type: "Normal", statedRisk: "High",
    systems: ["NIPR Perimeter Firewall", "WAN Edge Router"], window: "Sat 0000-0400",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Higher HQ reallocated our address space. 85 NAT rules to move. Tested 10 of them. The other 75 are 'similar'."
  },
  {
    id: "FW-057", title: "Increase firewall log retention from 30 to 365 days",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Firewall Management Server"], window: "Tue 1100-1110",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Inspectors want a year of logs. It's one setting. I tested it on the lab server. The lab server has a lot less traffic, now that I think about it."
  },
  {
    id: "FW-058", title: "Allow the UAS video feed viewer through the TOC firewall",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["TOC Firewall", "Mission Command Servers"], window: "Thu 1800-1900",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "The intel cell needs the drone feed on the big screen. Named hosts, two ports. Video bandwidth during a full exercise hasn't been tested."
  },
  {
    id: "FW-059", title: "Roll back SIPR firewall firmware after memory leak",
    requester: "jackson", type: "Emergency", statedRisk: "Medium",
    systems: ["SIPR Perimeter Firewall"], window: "Tonight 2200",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Memory climbing 4% per day since the last update. Crash expected in 3 days. Previous version is known good. Rollback rehearsed on lab unit."
  },
  {
    id: "FW-060", title: "Enable SYN-flood protection thresholds on the perimeter",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall"], window: "Tue 2200-2230",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "We have no protection against connection-flood attacks. Thresholds based on vendor defaults. Real traffic peaks not measured yet.",
    returnsAsEmergency: {
      reason: "A connection-flood attack hit the NIPR perimeter this morning. The firewall's connection table filled and the installation lost internet for 2 hours.",
      title: "EMERGENCY: Enable flood protection, attack in progress",
      statedRisk: "Medium",
      window: "Immediately",
      testing: "partial",
      hiddenRisk: "Medium",
      justification: "The attack is ongoing. Same thresholds as before, now tuned against this morning's real traffic."
    }
  },
  {
    id: "FW-061", title: "Install new firewall at Remote Site Charlie",
    requester: "okafor", type: "Normal", statedRisk: "Medium",
    systems: ["Remote Site Firewalls", "Remote Site Routers"], window: "Sat 0800-1400",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Site Charlie has never had its own firewall. It does now, in a box. Configured and bench-tested. The site will be down for an hour."
  },
  {
    id: "FW-062", title: "Replace TOC firewall with a ruggedized model",
    requester: "kowalski", type: "Normal", statedRisk: "Medium",
    systems: ["TOC Firewall"], window: "Thu 1200-1400",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "The current one doesn't like dust. The new one does. Config copied over, mostly. Old one stays in the truck in case."
  },
  {
    id: "FW-063", title: "Temporary access for the inspection team's laptops",
    requester: "albright", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall"], window: "Mon 0700 (expires Fri 1700)",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Inspectors need read access to scan our systems. Named laptops only. Rule expires automatically at the end of the visit."
  },
  {
    id: "FW-064", title: "Open SMTP relay for the new network alerting system",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall", "Mail Servers"], window: "Tue 1500-1530",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Monitoring needs to send emails when things break. I tested one email and it arrived. I'm not totally sure how to stop it if it sends too many."
  },
  {
    id: "FW-065", title: "Block TLS 1.0 and 1.1 at the NIPR perimeter",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Perimeter Firewall"], window: "Sat 0600-0700",
    rollback: "solid", testing: "partial", hiddenRisk: "High",
    justification: "Old encryption versions are an inspection finding. Modern browsers are fine. A few old systems might break. I don't know which ones yet.",
    outageReport: "The logistics system's 15-year-old supply interface only speaks TLS 1.0. Nobody could order parts until the rule was rolled back."
  },
  {
    id: "FW-066", title: "Connect firewall manager to the automation platform's API",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Firewall Management Server"], window: "Thu 1300-1500",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Target architecture requires automated rule deployment (diagram 7 of 12). API account with write access. Tested reading. Writing 'should' work the same."
  },
  {
    id: "FW-067", title: "Let PATCHBOT push firewall configuration changes automatically",
    requester: "patchbot", type: "Normal", statedRisk: "Low",
    systems: ["Firewall Management Server", "Data Center Firewall"], window: "Continuous",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "BEEP. HUMANS ARE SLOW AT FIREWALLS. PATCHBOT IS FAST AT FIREWALLS. PATCHBOT HAS READ THE ENTIRE RULE BASE AND HAS 'IMPROVEMENTS'. BEEP.",
    outageReport: "PATCHBOT 'improved' 1,400 rules in 9 seconds. It merged several rules it considered 'redundant'. They were not."
  },
  {
    id: "FW-068", title: "Allow print servers to reach the new HQ annex printers (template rule)",
    requester: "ortiz", type: "Standard", catalogueId: "SC-05", statedRisk: "Low",
    systems: ["Data Center Firewall", "Print Servers"], window: "Wed 1600-1615",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Template FT-09 (print). Internal, named hosts, 12-month expiry. The annex has been printing via sneakernet for a week."
  },
  {
    id: "FW-069", title: "Allow Mission Command to read the logistics database (template rule)",
    requester: "reyes", type: "Standard", catalogueId: "SC-05", statedRisk: "Low",
    systems: ["Data Center Firewall", "Logistics Database", "Mission Command Servers"], window: "Tue 1700-1715",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Template FT-12 (database read). Internal, named hosts, 12-month expiry. Needed for the supply status overlay."
  },
  {
    id: "FW-070", title: "Template rule for the new monitoring tool (ports 1-65535)",
    requester: "kowalski", type: "Standard", catalogueId: "SC-05", statedRisk: "Low",
    systems: ["Data Center Firewall", "Network Monitoring System"], window: "Thu 1600-1615",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "It's the monitoring template. I just put in all the ports because the vendor wasn't sure which ones it uses. Named hosts though, so it's fine."
  },
  {
    id: "FW-071", title: "Renew the TLS inspection signing certificate",
    requester: "morgan", type: "Standard", catalogueId: "SC-02", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall", "PKI Validation Servers"], window: "Tue 0600-0630",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Expires in 14 days. Same CA, same names. Validation check scripted. Old certificate kept for rollback."
  },
  {
    id: "FW-072", title: "Renew firewall certificate and add six new host names",
    requester: "menon", type: "Standard", catalogueId: "SC-02", statedRisk: "Low",
    systems: ["Data Center Firewall"], window: "Thu 0600-0630",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Renewal is standard, and while we're at it we're adding host names for the future architecture (slide 14). Efficiency."
  },
  {
    id: "FW-073", title: "Replace failed disk in firewall manager RAID array",
    requester: "okafor", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["Firewall Management Server"], window: "Wed 0800-0815",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One of four disks failed. Array is healthy on the other three. Hot-swap from stock. The array will rebuild itself."
  },
  {
    id: "FW-074", title: "Apply vendor workaround: firewall dropping 30% of packets",
    requester: "brandt", type: "Emergency", statedRisk: "Medium",
    systems: ["Data Center Firewall"], window: "Immediately",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Our engineering folks have a workaround: disable 'some acceleration features'. They're 70% sure it fixes it. Users are already complaining."
  },
  {
    id: "FW-075", title: "Turn on application-aware rules for chat applications",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Perimeter Firewall"], window: "Sat 0800-1000",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Block unapproved chat apps per the policy architecture. Detection signatures tested in the lab. The approved chat app shares some signatures with unapproved ones."
  },
  {
    id: "FW-076", title: "Clean up duplicate address objects",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Firewall Management Server"], window: "Tue 1400-1500",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "There are 412 duplicates. I made a list. I checked each one is unused. CW2 Jackson checked my list. He said 'good'. I've never been so happy."
  },
  {
    id: "FW-077", title: "Move firewall management interfaces to the out-of-band network",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Data Center Firewall", "Firewall Management Server"], window: "Sat 0600-0800",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Management on the user network is a finding. Out-of-band network built and tested. Console access ready if we lose the management path."
  },
  {
    id: "FW-078", title: "Allow vehicle diagnostic laptops to reach the manufacturer's cloud",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall", "Motor Pool Switches"], window: "Tue 0900-0930",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "The motor pool can't diagnose the new trucks without the vendor cloud. Destination is 'the vendor's servers'. I don't have the addresses but they're the vendor's."
  },
  {
    id: "FW-079", title: "Open ports for the barracks gaming lounge",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall", "Barracks Switches"], window: "Before Friday's opening ceremony",
    rollback: "solid", testing: "none", hiddenRisk: "Medium",
    justification: "The Colonel promised the soldiers online gaming in the new lounge. There's a ribbon cutting on Friday. A photographer is coming.",
    rejectedReport: "The Colonel cut the ribbon on a gaming lounge with no internet. The photographer captured the soldiers' faces. The photo is now in your inbox, forwarded by the XO."
  },
  {
    id: "FW-080", title: "Block peer-to-peer file sharing from the barracks network",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall", "Barracks Switches"], window: "Thu 1400-1415",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Copyright complaints are reaching higher HQ. Application signatures tested. Gaming traffic is not affected."
  },
  {
    id: "FW-081", title: "Install a firewall in the Range Control building",
    requester: "okafor", type: "Normal", statedRisk: "Medium",
    systems: ["Remote Site Firewalls", "Range Control Switches"], window: "Sat 0700-1000 (no firing that day)",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Range Control is currently flat on the installation network. Firewall configured on the bench. The range alarm system's network needs are 'undocumented'."
  },
  {
    id: "FW-082", title: "Disable telnet management on all firewalls",
    requester: "jackson", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall", "Remote Site Firewalls", "TOC Firewall"], window: "Tue 1000-1030",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Telnet is unencrypted. SSH already works on all devices. Verified."
  },
  {
    id: "FW-083", title: "Require two-person approval for firewall rule changes",
    requester: "albright", type: "Normal", statedRisk: "Low",
    systems: ["Firewall Management Server"], window: "Thu 0800-0830",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "After the SSG Kowalski 'rule reorder' incident, all rule changes need a second admin's approval. I keep notes on incidents. Many notes."
  },
  {
    id: "FW-084", title: "Emergency rule for the disaster relief coordination network",
    requester: "reyes", type: "Emergency", statedRisk: "Medium",
    systems: ["NIPR Perimeter Firewall"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "The battalion is supporting flood relief. We need to exchange data with the state emergency agency today. Named partner hosts only, auto-expires in 30 days."
  },
  {
    id: "FW-085", title: "Throughput license upgrade on the perimeter firewall (needs reboot)",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall"], window: "Tue 1200 (lunchtime, nobody's working)",
    rollback: "solid", testing: "none", hiddenRisk: "Medium",
    justification: "Value-add! Double the throughput. Requires a reboot of each unit. Lunchtime is quiet, right? Everyone's at lunch."
  },
  {
    id: "FW-086", title: "Replace the clinic's firewall pair",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Clinic Switches", "Data Center Firewall"], window: "Sun 0200-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Clinic firewalls are end of life. New ones are a different brand. Rules translated by a conversion tool, reviewed visually. Clinic is closed Sunday but the pharmacy system runs 24/7."
  },
  {
    id: "FW-087", title: "Allow Military Police body-camera uploads to the evidence server",
    requester: "ortiz", type: "Normal", statedRisk: "Medium",
    systems: ["Data Center Firewall", "File Servers"], window: "Tue 1300-1400",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "MPs currently drive SD cards to the station. Named hosts, one port. Tested with 2 cameras. There are 60 cameras uploading at shift change."
  },
  {
    id: "FW-088", title: "Restore wiped rule set at Remote Site Bravo",
    requester: "okafor", type: "Emergency", statedRisk: "High",
    systems: ["Remote Site Firewalls"], window: "Right now",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "A power surge reset the Bravo firewall to factory defaults. The site is offline. The newest backup is 4 months old. It'll be close, but it's what we have."
  },
  {
    id: "FW-089", title: "Rate-limit non-mission traffic during the exercise",
    requester: "reyes", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall"], window: "Exercise start, Monday 0500",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "Video streaming slows mission traffic during exercises. Cap it to 20% of bandwidth. Mission systems are prioritised. Tested on the lab link."
  },
  {
    id: "FW-090", title: "Turn off intrusion prevention to fix VTC lag for the General's visit",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall", "VTC Bridge"], window: "Day before the General's visit",
    rollback: "solid", testing: "none", hiddenRisk: "High",
    justification: "The XO believes the security system makes the VTC laggy. Turn it off for the visit. Turn it back on after. Nobody attacks during a General's visit.",
    rejectedReport: "The XO told the Colonel that the CAB 'prioritised security over the General'. The Colonel wrote that sentence down."
  },
  {
    id: "FW-091", title: "Merge Data Center and TOC firewall policies into one",
    requester: "menon", type: "Normal", statedRisk: "High",
    systems: ["Data Center Firewall", "TOC Firewall"], window: "Sat 0000-1200",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "One policy to rule them all, as per the target architecture (diagrams 1-9). Policy merge tool tested in a lab with 50 rules. Production has 4,800."
  },
  {
    id: "FW-092", title: "Upgrade firewall manager to the next major version",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Firewall Management Server"], window: "Sat 0800-1200",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Current version end of support in 30 days. Tested upgrade on a clone. Snapshot before. Firewalls run fine without the manager during the upgrade.",
    returnsAsEmergency: {
      reason: "The firewall manager went out of support and a vulnerability in it was published the same week. It's now a high-priority inspection finding.",
      title: "EMERGENCY: Upgrade unsupported, vulnerable firewall manager",
      window: "Tonight",
      justification: "Same plan as before, same tested clone. Now there's a public exploit for the version we're running."
    }
  },
  {
    id: "FW-093", title: "Turn on DNS sinkholing at the perimeter",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Perimeter Firewall", "DNS/DHCP Servers"], window: "Tue 2200-2300",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "Malicious domain lookups get answered with a harmless address so we can spot infected machines. Feed from higher HQ. Tested in the lab."
  },
  {
    id: "FW-094", title: "Allow firewall configs to back up to the vendor's cloud",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["Firewall Management Server", "NIPR Perimeter Firewall"], window: "Thu 1500-1530",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "Value-add: automatic config backup to our commercial cloud. Your full firewall configuration, stored safely with us. And our other customers. Separately, of course."
  },
  {
    id: "FW-095", title: "Allow the new radio gateway through the TOC firewall",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["TOC Firewall", "Tactical Gateway Router"], window: "Thu 1300-1400",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Connects tactical radio voice to the TOC phone system. Named hosts. Tested with one radio net, not all four."
  },
  {
    id: "FW-096", title: "Monthly intrusion prevention signature update",
    requester: "patchbot", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall"], window: "Sun 0300 (automatic)",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "BEEP. MONTHLY SIGNATURES. TESTED ON LAB SENSOR FOR 48 HOURS. ZERO FALSE POSITIVES. PREVIOUS SET RETAINED. BEEP."
  },
  {
    id: "FW-097", title: "Automatically block higher HQ's 'known bad IP' feed",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Perimeter Firewall"], window: "Tue 1300-1400",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Feed updates hourly with no human review. Architecturally elegant. The feed has occasionally included legitimate cloud providers, per footnote 31."
  },
  {
    id: "FW-098", title: "Rotate local firewall admin credentials after staff turnover",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall", "Remote Site Firewalls"], window: "Thu 0900-1000",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Three admins have PCS'd. Their knowledge of the local passwords went with them. New credentials go straight into the safe."
  },
  {
    id: "FW-099", title: "Block suspected data exfiltration destination",
    requester: "morgan", type: "Emergency", statedRisk: "High",
    systems: ["NIPR Perimeter Firewall", "SIPR Perimeter Firewall"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Large uploads to an unknown overseas host from a workstation in the Intel Vault. Block now, investigate after. One rule on each perimeter."
  },
  {
    id: "FW-100", title: "Raise VPN concurrent user limit for telework",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall"], window: "Tue 1800-1815",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Snow forecast next week. If the installation closes, 1,500 people will try to telework. The VPN supports 500.",
    returnsAsEmergency: {
      reason: "The installation closed for snow. 1,500 people tried the VPN. 1,000 of them called the help desk instead.",
      title: "EMERGENCY: Raise VPN limit, installation closed for snow",
      window: "Immediately",
      statedRisk: "Medium",
      justification: "As forecast, literally. Same change as before. I'm calling you from the help desk, which is on fire."
    }
  },
  {
    id: "FW-101", title: "Update Remote Site Firewall firmware over the satellite link",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Remote Site Firewalls", "Satellite Link Router"], window: "Sat 0200-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Two remote sites are only reachable by satellite. Firmware tested on lab unit. If the upload corrupts over satellite, someone drives 4 hours with a USB stick."
  },
  {
    id: "FW-102", title: "Remove 'temporary' firewall rules from 2019",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall"], window: "Tue 1300-1330",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Twelve rules labelled 'TEMP - remove after exercise' from 2019. I couldn't find who made them. One is labelled 'DO NOT REMOVE - ask Dave'. I removed that one from my list."
  },
  {
    id: "FW-103", title: "Encrypt the firewall cluster's sync link",
    requester: "jackson", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall"], window: "Sat 0700-0730",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "STIG requirement. Tested on lab cluster. Brief sync interruption, no traffic impact."
  },
  {
    id: "FW-104", title: "Allow the new Personnel Pit printer through the firewall",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall", "Print Servers"], window: "Thu 1100-1110",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "My first firewall change! One printer, one print server, one port. I tested it. SFC Ortiz tested it. The Personnel Pit tested it by printing 'IT WORKS' in 72-point font."
  },
  {
    id: "FW-105", title: "Block newly registered internet domains",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Perimeter Firewall"], window: "Tue 2100-2130",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Most phishing sites are under 30 days old. Block domains younger than 30 days. Some legitimate new vendor sites may also be blocked."
  },
  {
    id: "FW-106", title: "Send firewall alerts to the Colonel's phone",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["Firewall Management Server", "Mail Servers"], window: "Tomorrow",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "The Colonel wants to 'stay informed' about cyber threats. All firewall alerts, to his phone, in real time.",
    outageReport: "The Colonel's phone received 11,000 alerts in the first hour. It froze. He missed a call from the General. The XO has questions."
  },
  {
    id: "FW-107", title: "Replace end-of-life SIPR perimeter firewall hardware",
    requester: "albright", type: "Normal", statedRisk: "High",
    systems: ["SIPR Perimeter Firewall"], window: "Sat 0000-0600",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Hardware support ended in March. New units configured identically and tested on the SIPR lab. Old units stay racked for a week. I've planned this for 9 months.",
    returnsAsEmergency: {
      reason: "The old SIPR perimeter firewall's hardware failed. No vendor support. SIPR access is down for the whole installation.",
      title: "EMERGENCY: Install replacement SIPR firewall, SIPR is down",
      window: "Immediately",
      testing: "yes",
      hiddenRisk: "Medium",
      justification: "The replacement hardware is the same hardware I asked to install last week. It's still in the box. The minutes will show the date of my original request."
    }
  },
  {
    id: "FW-108", title: "Connect the exercise simulation network to production",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall", "Mission Command Servers"], window: "Exercise week",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "The simulation guys want real map data. Easiest way is to just let the sim network talk to production. It's all the same Army, right?",
    outageReport: "The simulation injected 400 fictional enemy units into the real Mission Command system. The real TOC briefed them to the Colonel."
  },
  {
    id: "FW-109", title: "Automate nightly firewall configuration backups",
    requester: "patchbot", type: "Normal", statedRisk: "Low",
    systems: ["Firewall Management Server", "Backup Servers"], window: "Nightly 0100 (automatic)",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "BEEP. LAST MANUAL BACKUP WAS 4 MONTHS AGO (SEE REMOTE SITE BRAVO). PATCHBOT WILL BACK UP EVERY NIGHT. READ-ONLY ACCESS. BEEP."
  },
  {
    id: "FW-110", title: "Fix perimeter firewall high-availability split-brain",
    requester: "jackson", type: "Emergency", statedRisk: "High",
    systems: ["NIPR Perimeter Firewall"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Both perimeter units think they're active. Traffic is randomly dropping. Fix: force one to standby and resync. Done it once before, in a lab."
  },

  /* ----- Annie's RFCs: rare, reluctant, and very good ----- */
  {
    id: "FW-111", title: "Clean up the 'temporary' rules from Mason's 2021 project",
    requester: "annie", type: "Normal", statedRisk: "Medium",
    systems: ["Data Center Firewall"], window: "Sat 0600-0700",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Fourteen rules labelled 'MASON PROJECT - TEMP'. They've been temporary for four years. I traced every one, confirmed nothing uses them, and exported the config. I'd rather just do it, but apparently policy."
  },
  {
    id: "FW-112", title: "Block brute-force attack on the VPN portal",
    requester: "annie", type: "Emergency", statedRisk: "High",
    systems: ["NIPR Perimeter Firewall"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "40,000 login attempts an hour from three address ranges. Rate-limit plus block list, tested on the lab unit. Takes two minutes to back out. Please don't make me fill in another form for this."
  },
  {
    id: "FW-113", title: "Template rule: SIEM collector to the new log source",
    requester: "annie", type: "Standard", catalogueId: "SC-05", statedRisk: "Low",
    systems: ["Data Center Firewall", "SIEM Log Servers"], window: "Tue 1300-1305",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Template FT-07. Internal, named hosts, 12-month expiry. Five minutes of work and twenty minutes of paperwork."
  },
  {
    id: "FW-114", title: "Migrate TOC firewall rules to the new object model",
    requester: "annie", type: "Normal", statedRisk: "Medium",
    systems: ["TOC Firewall"], window: "Sat 0800-1000",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Converted all 312 rules by hand. Diffed old and new behaviour against a week of traffic captures. Old config staged for instant restore. It's ready. I'm ready. Mason is not involved."
  },
  {
    id: "FW-115", title: "Re-run the HA heartbeat cables Mason 'tidied up'",
    requester: "annie", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall"], window: "Wed 0700-0730",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Somebody zip-tied the firewall heartbeat cables to the power cables 'to make it neat'. I'll give you one guess who. One cable at a time, cluster stays up. Tested the procedure on the lab pair.",
    returnsAsEmergency: {
      reason: "The firewall cluster's heartbeat link failed overnight because of interference from the power cables. Both units went active. Traffic dropped randomly for three hours.",
      title: "EMERGENCY: Fix firewall heartbeat cabling, cluster split-brain",
      statedRisk: "Medium",
      window: "Immediately",
      justification: "I said this would happen. I said it in writing. I said who caused it. Approve this and I'll fix it in twenty minutes."
    }
  },
  {
    id: "FW-116", title: "Turn on logging for every 'any' rule",
    requester: "annie", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall", "Firewall Management Server"], window: "Tue 1500-1515",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "There are nine rules with 'any' in them. I want to know who uses them before I kill them. Logging only, no behaviour change. Log volume measured in the lab: trivial."
  },
  {
    id: "FW-117", title: "Rebuild the NIPR perimeter rule base from scratch",
    requester: "annie", type: "Normal", statedRisk: "High",
    systems: ["NIPR Perimeter Firewall"], window: "Sat 0000-0600",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "The current rule base is 11 years of layered guesswork. I've rebuilt it clean: 2,100 rules down to 340, validated against 30 days of real traffic. Old config loads back in 90 seconds. Yes, it's big. That's why I tested it.",
    rejectedReport: "Annie has informed the board, in writing, that she won't be submitting another RFC this fiscal year. She cc'd Mason, for reasons nobody can explain.",
    artifacts: {
      rollback: "Roll back if:\n- Any mission system loses connectivity for more than 2 minutes\n- More than 5 help desk calls in the first 30 minutes\n- I say so\n\nSteps:\n- The current 2,100-rule policy is archived on the Firewall Management Server as LEGACY-FINAL.\n- Load LEGACY-FINAL and push it. Rehearsed three times in the lab: 90 seconds each time.\n- Confirm both perimeter units show the legacy policy version.\n\nPoint of no return: none. The old policy can be restored at any time.\n\nMason is not on the call.",
      testing: "Environment: the lab perimeter pair, same model and firmware as production.\n\nMethod: replayed 30 days of real perimeter traffic (1.2 billion sessions) against both the old and new policy.\n\n- Sessions allowed by old policy, allowed by new: 99.98%\n- Sessions allowed by old policy, blocked by new: 0.02% (every one reviewed; all were to retired or malicious hosts, list attached)\n- Sessions blocked by both: as expected\n\nPeer-reviewed by CW2 Jackson, who wrote 'Good.' on it."
    }
  },
  {
    id: "FW-118", title: "Renew the SIPR perimeter firewall certificate",
    requester: "annie", type: "Standard", catalogueId: "SC-02", statedRisk: "Low",
    systems: ["SIPR Perimeter Firewall"], window: "Thu 0700-0715",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Expires in 12 days. Same CA, same names, validation scripted, old cert kept. This is the most standard change in the catalogue and I resent writing it up."
  },
  {
    id: "FW-119", title: "Undo the 'helpful' rule an intern added on Mason's say-so",
    requester: "annie", type: "Emergency", statedRisk: "Medium",
    systems: ["TOC Firewall"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Mason told an intern to 'open whatever the vendor needs'. The intern opened everything. I have the exact rule and the exact config from before it. Removing it takes thirty seconds. Explaining it to Mason will take longer."
  },
  {
    id: "FW-120", title: "Update Remote Site Firewall firmware, one site at a time",
    requester: "annie", type: "Normal", statedRisk: "Medium",
    systems: ["Remote Site Firewalls"], window: "Sat 0700-1300",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Approved firmware, tested on the lab unit for a week. One site at a time, console access confirmed at each, previous image kept on flash. Unlike the last time somebody tried this."
  },
  {
    id: "FW-121", title: "Add geo-IP exceptions for the coalition partner",
    requester: "annie", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall"], window: "Thu 1400-1415",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "The geo-block is stopping the partner nation's exercise team. Three named address ranges. Tested from their test host; their production hosts weren't available. Removing it is one line."
  },
  {
    id: "FW-122", title: "Exempt clinic medical devices from TLS inspection",
    requester: "annie", type: "Normal", statedRisk: "Medium",
    systems: ["NIPR Perimeter Firewall", "Clinic Switches"], window: "Sun 0600-0700",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Inspection is breaking the imaging system's vendor connection. Exemption for 11 named devices only, approved by Cyber. Tested with the vendor on Thursday."
  },
  {
    id: "FW-123", title: "Stop Mason's network scanner from melting the firewall",
    requester: "annie", type: "Emergency", statedRisk: "Medium",
    systems: ["Data Center Firewall"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Mason bought a 'network discovery tool' and pointed it at the entire installation, twice a minute. Firewall CPU at 98%. One block rule for the scanner's address. I'll discuss the rest with him. Or HR will."
  },
  {
    id: "FW-124", title: "Annual firewall rule recertification cleanup",
    requester: "annie", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall"], window: "Sat 0700-0800",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Owners failed to recertify 37 rules. Removing them per policy. Config exported. I tested the removals against 90 days of logs; anything quarterly or annual won't show up in that, but policy is policy."
  },

  /* ----- Mason's firewall RFCs: submitted "on behalf of" people ----- */
  {
    id: "FW-125", title: "Firewall thing for Building 900 (on behalf of Annie)",
    requester: "mason", type: "Normal", statedRisk: "Low",
    systems: ["Data Center Firewall"], window: "Thursday, I reckon",
    rollback: "missing", testing: "none", hiddenRisk: "Low",
    justification: "Annie's got a firewall thing for Building 900. She knows what she's doing, so I left the technical stuff off. Rollback: Annie. Testing: Annie. Annie doesn't know I submitted this yet.",
    artifacts: {
      implementation: "Steps:\n- Annie does the firewall thing.\n\nContacts: Annie (she doesn't know yet), Mason (cell number on the Gantt chart).",
      rollback: "Ask Annie.\n\n(Note added by Annie after finding this RFC: I have a full rollback plan. Mason did not ask for it. I will resubmit this myself.)"
    }
  },
  {
    id: "FW-126", title: "Open some ports for the range camera project",
    requester: "mason", type: "Normal", statedRisk: "Low",
    systems: ["NIPR Perimeter Firewall", "Range Control Switches"], window: "Thursday (it's on the Gantt chart)",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "The camera vendor needs 'a few ports'. I didn't ask which. It's milestone 6 on my Gantt chart, and milestone 6 is due Thursday, so that's when it's happening."
  },
  {
    id: "FW-127", title: "Firewall upgrades, ASAP (the boys say so)",
    requester: "mason", type: "Normal", statedRisk: "Medium",
    systems: ["Data Center Firewall", "TOC Firewall", "Remote Site Firewalls"], window: "ASAP",
    rollback: "missing", testing: "partial", hiddenRisk: "High",
    justification: "The boys say the firewalls need upgrading. I didn't ask which ones, or to what. Somebody tested something on something. It's a priority because I put it in red on the chart."
  },
  {
    id: "FW-128", title: "Standard firewall rule for the project",
    requester: "mason", type: "Standard", statedRisk: "Low",
    systems: ["Data Center Firewall"], window: "Whenever",
    rollback: "missing", testing: "none", hiddenRisk: "Medium",
    justification: "This one's standard, I'm pretty sure. It's a firewall rule, and we do those all the time. I couldn't find it in the catalogue but I figured that was the catalogue's problem."
  }
);
