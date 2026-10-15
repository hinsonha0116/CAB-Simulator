/* =====================================================================
   SERVER CHANGE REQUESTS (SV-001 to SV-110)
   Each { ... } block is one RFC. See HOW-TO-ADD-SCENARIOS.md for what
   every field means. Add new ones at the end, before the final ");".
   ===================================================================== */
RFCS.push(
  {
    id: "SV-001", title: "Monthly patching: domain controllers",
    requester: "patchbot", type: "Standard", catalogueId: "SC-03", statedRisk: "Low",
    systems: ["Domain Controllers"], window: "Sun 0200-0500 (automatic)",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "BEEP. APPROVED MONTHLY BASELINE. TEST ENCLAVE PATCHED 9 DAYS AGO, ZERO ISSUES. FOUR DOMAIN CONTROLLERS, ONE AT A TIME. BEEP."
  },
  {
    id: "SV-002", title: "Monthly patching: file servers",
    requester: "patchbot", type: "Standard", catalogueId: "SC-03", statedRisk: "Low",
    systems: ["File Servers"], window: "Sun 0200-0500 (automatic)",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "BEEP. MONTHLY BASELINE. CLUSTERED FILE SERVERS. ONE NODE AT A TIME. USERS WILL NOT NOTICE. USERS NEVER NOTICE PATCHBOT. PATCHBOT IS FINE WITH THIS. BEEP."
  },
  {
    id: "SV-003", title: "Monthly patching: mail servers",
    requester: "patchbot", type: "Standard", catalogueId: "SC-03", statedRisk: "Low",
    systems: ["Mail Servers"], window: "Sun 0300-0600 (automatic)",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "BEEP. MONTHLY BASELINE. MAIL DATABASE COPIES MOVE BETWEEN SERVERS DURING PATCHING. TESTED IN ENCLAVE. BEEP."
  },
  {
    id: "SV-004", title: "Monthly patching: logistics database server (standard change)",
    requester: "kowalski", type: "Standard", catalogueId: "SC-03", statedRisk: "Low",
    systems: ["Logistics Database"], window: "Tue 1000-1030",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "It's the monthly patch, which is standard. The logistics database is just one server, so it'll be down while it reboots. Supply section can wait 20 minutes. Probably."
  },
  {
    id: "SV-005", title: "Upgrade domain controllers to the new OS version (patching)",
    requester: "brandt", type: "Standard", catalogueId: "SC-03", statedRisk: "Low",
    systems: ["Domain Controllers"], window: "Thu 1300-1700",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Patching is standard, and an OS upgrade is just a big patch. Value-add! Our engineers did this at another site. It went 'mostly well'."
  },
  {
    id: "SV-006", title: "Replace failed disk in file server array",
    requester: "okafor", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["File Servers"], window: "Wed 0800-0815",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One of 12 disks failed. Array is healthy and protected. Hot-swap from stock. Rebuild takes a few hours in the background."
  },
  {
    id: "SV-007", title: "Replace failed disk in backup server",
    requester: "okafor", type: "Standard", catalogueId: "SC-01", statedRisk: "Low",
    systems: ["Backup Servers"], window: "Wed 0830-0845",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One failed disk out of 24. The array is protected. Same part from stock."
  },
  {
    id: "SV-008", title: "Renew mail server certificate",
    requester: "reyes", type: "Standard", catalogueId: "SC-02", statedRisk: "Low",
    systems: ["Mail Servers"], window: "Thu 0600-0630",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Expires in 11 days. Same CA, same names. Validation scripted. Old certificate retained.",
    returnsAsEmergency: {
      reason: "The mail server certificate expired. Every user's mail client is showing security warnings, and mobile devices have stopped syncing entirely.",
      title: "EMERGENCY: Renew EXPIRED mail certificate",
      window: "Immediately",
      justification: "It expired, as forecast. The renewal is still the same 30-minute procedure. Approve and the warnings stop."
    }
  },
  {
    id: "SV-009", title: "Renew VTC bridge certificate from a different authority",
    requester: "menon", type: "Standard", catalogueId: "SC-02", statedRisk: "Low",
    systems: ["VTC Bridge"], window: "Tue 0700-0730",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Certificate renewal is standard. We're switching to a new certificate authority to align with the target architecture. Partners may need to trust the new CA."
  },
  {
    id: "SV-010", title: "DNS record for the new range targeting system",
    requester: "ortiz", type: "Standard", catalogueId: "SC-09", statedRisk: "Low",
    systems: ["DNS/DHCP Servers"], window: "Tue 1100-1105",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One internal A record. Range Control's system owner approved it. Ticket attached."
  },
  {
    id: "SV-011", title: "DHCP reservation for the new S4 printer",
    requester: "ortiz", type: "Standard", catalogueId: "SC-09", statedRisk: "Low",
    systems: ["DNS/DHCP Servers"], window: "Tue 1110-1115",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "One reservation so the printer keeps the same address. S4 approved. Ticket attached."
  },
  {
    id: "SV-012", title: "Change DNS forwarders to a faster public resolver (standard)",
    requester: "kowalski", type: "Standard", catalogueId: "SC-09", statedRisk: "Low",
    systems: ["DNS/DHCP Servers"], window: "Thu 1500",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "DNS changes are standard. I'm pointing our DNS at a public resolver because it's faster. It's just one setting.",
    outageReport: "Public resolvers can't see our internal names, and higher HQ blocks them anyway. Nothing on the installation could resolve anything for 50 minutes."
  },
  {
    id: "SV-013", title: "Add a domain controller at Remote Site Alpha",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["Domain Controllers", "Remote Site Routers"], window: "Sat 0800-1200",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Logins at Site Alpha fail whenever the satellite drops. A local domain controller fixes it. Built and tested in the lab. Replication over satellite not tested."
  },
  {
    id: "SV-014", title: "Raise the domain functional level",
    requester: "menon", type: "Normal", statedRisk: "High",
    systems: ["Domain Controllers"], window: "Sat 0200-0400",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Required for future capabilities (slides 12-30). This is one-way: there is no rollback except restoring every domain controller from backup."
  },
  {
    id: "SV-015", title: "Enforce 10-minute screen lock by Group Policy",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["Domain Controllers", "NIPR Workstations"], window: "Tue 1600-1630",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Unlocked unattended computers is a top inspection finding. Tested on the IT section's machines for a week. They complained, which means it works."
  },
  {
    id: "SV-016", title: "Push new Group Policy settings to every unit at once",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["Domain Controllers", "NIPR Workstations"], window: "Tue 1000",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "I made a bunch of improvements to the policies. Linking them to the top of the domain so everyone gets them. Testing would take ages.",
    outageReport: "One of the 'improvements' removed local admin rights from the help desk. And from SSG Kowalski. Nobody could undo it from a workstation for six hours."
  },
  {
    id: "SV-017", title: "Migrate file shares to the new file server cluster",
    requester: "albright", type: "Normal", statedRisk: "Medium",
    systems: ["File Servers"], window: "Sat 0000-0800",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Data copied and verified over 3 weeks. Final sync and cutover Saturday. Old server stays read-only for 30 days. I've rehearsed this twice."
  },
  {
    id: "SV-018", title: "Expand virtualization cluster storage",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Virtualization Cluster"], window: "Sat 0400-0600",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Cluster is 91% full. New disk shelf installed. Expanding storage online. Vendor procedure followed. Not done on this model before."
  },
  {
    id: "SV-019", title: "Firmware update on virtualization hosts",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["Virtualization Cluster"], window: "Thu 1300-1700",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Value-add firmware bundle. Each host is emptied, updated, rebooted. Our engineer will do it from home. Firmware can't easily be downgraded."
  },
  {
    id: "SV-020", title: "Live-migrate all virtual machines to the new hosts",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Virtualization Cluster", "Data Center Switches"], window: "Sat 0000-0600",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "New hosts per the architecture. Live migration tested with 5 VMs. There are 240. Some are 'special'."
  },
  {
    id: "SV-021", title: "Repair corrupted mail database",
    requester: "reyes", type: "Emergency", statedRisk: "High",
    systems: ["Mail Servers"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "One mail database corrupted overnight. 900 users have no email. Activate the healthy copy on the second server, then rebuild the bad one."
  },
  {
    id: "SV-022", title: "Shorten backup retention and delete older backups",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Backup Servers"], window: "Tue 1300-1400",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Backup storage is full. New retention: 30 days instead of 1 year. Deleting the old backups frees space. Once they're deleted they're gone. I just realised that as I typed it."
  },
  {
    id: "SV-023", title: "Add Mission Command servers to nightly backups",
    requester: "reyes", type: "Normal", statedRisk: "Low",
    systems: ["Backup Servers", "Mission Command Servers"], window: "Tue 1500-1530",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "The Mission Command servers have never been backed up. I found this out yesterday. Test backup and test restore completed."
  },
  {
    id: "SV-024", title: "Test restore of a domain controller from backup",
    requester: "albright", type: "Normal", statedRisk: "Low",
    systems: ["Backup Servers", "Domain Controllers"], window: "Sat 0800-1200",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Restore into an isolated lab. Production untouched. We have never proven we can restore a domain controller. I would like to know before we need to."
  },
  {
    id: "SV-025", title: "Increase mailbox quotas for HQ staff",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["Mail Servers"], window: "Tue 1200-1215",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "HQ staff keep hitting the mailbox limit during exercises. Storage is available. Quota change only."
  },
  {
    id: "SV-026", title: "Sandbox mail attachments before delivery",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["Mail Servers"], window: "Thu 2000-2100",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Attachments get detonated in a sandbox first. Adds up to 2 minutes of delay. Some file types may be held incorrectly."
  },
  {
    id: "SV-027", title: "Disable SMBv1 on all file servers",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["File Servers"], window: "Sat 0700-0800",
    rollback: "solid", testing: "partial", hiddenRisk: "High",
    justification: "Ancient file-sharing protocol, a favourite of ransomware. Modern clients don't need it. Some old devices might.",
    outageReport: "Every scan-to-folder copier on the installation spoke only SMBv1. 140 copiers stopped scanning. Orderly rooms resorted to photocopying and hand-delivery."
  },
  {
    id: "SV-028", title: "Decommission the old print server",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["Print Servers"], window: "Thu 1600-1630",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "All printers moved to the new server. Shutting down the old one, not deleting it. Some users may have the old printers mapped manually."
  },
  {
    id: "SV-029", title: "Move the patch server to new hardware",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Patch Server"], window: "Sat 0800-1200",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Old patch server is out of disk. New server built and synchronised. Clients redirected by policy. Old server stays as fallback."
  },
  {
    id: "SV-030", title: "Expand SIEM storage",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["SIEM Log Servers"], window: "Tue 1000-1100",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "SIEM is at 88% and growing. New disks installed. Online expansion tested on the lab instance.",
    returnsAsEmergency: {
      reason: "The SIEM's disks filled up. It has stopped collecting logs from every system on the installation. Security monitoring is blind.",
      title: "EMERGENCY: Expand full SIEM storage, monitoring is blind",
      window: "Immediately",
      justification: "The disks I requested are installed and waiting. The SIEM is now 100% full instead of 88%."
    }
  },
  {
    id: "SV-031", title: "Upgrade the SIEM to its next major version",
    requester: "menon", type: "Normal", statedRisk: "High",
    systems: ["SIEM Log Servers"], window: "Sat 0000-0800",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Strategic alignment with higher HQ's SIEM (slides 1-45). Migration converts all correlation rules automatically. Automatic conversion success rate: 'high'."
  },
  {
    id: "SV-032", title: "Add certificate-based authentication to RADIUS",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["RADIUS Authentication Servers", "PKI Validation Servers"], window: "Thu 1900-2000",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Needed for 802.1X. Tested with IT section laptops. If the certificate chain isn't right on a device, it can't connect."
  },
  {
    id: "SV-033", title: "Update the certificate revocation source on PKI validation servers",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["PKI Validation Servers"], window: "Tue 2200-2230",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Higher HQ moved its revocation service. If the validation servers can't check revocation, CAC logins fail across the installation."
  },
  {
    id: "SV-034", title: "Restart stuck PKI validation service, CAC logins failing",
    requester: "jackson", type: "Emergency", statedRisk: "Medium",
    systems: ["PKI Validation Servers"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Nobody can log in with their CAC. Validation service hung. Restart procedure documented and tested. Two minutes."
  },
  {
    id: "SV-035", title: "Switch NTP servers to a GPS time source",
    requester: "okafor", type: "Normal", statedRisk: "Low",
    systems: ["NTP Time Servers"], window: "Tue 0900-1000",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Our time comes from higher HQ over the WAN. If the WAN drops, time drifts. GPS antenna installed on the roof. Signal tested for a week."
  },
  {
    id: "SV-036", title: "Upgrade the VoIP call manager",
    requester: "ortiz", type: "Normal", statedRisk: "Medium",
    systems: ["VoIP Call Manager"], window: "Sat 0600-1000",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Vendor support ends next month. Upgrade tested on a lab call manager. Phones re-register after the upgrade. 911 calling verified in the lab."
  },
  {
    id: "SV-037", title: "Add dial plan for the new annex building",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["VoIP Call Manager"], window: "Tue 1300-1330",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Annex phones need extension numbers. New range added and tested with two phones."
  },
  {
    id: "SV-038", title: "Increase VTC bridge concurrent call license",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["VTC Bridge"], window: "Before Monday",
    rollback: "solid", testing: "none", hiddenRisk: "Low",
    justification: "The Colonel's staff keep getting 'bridge full' messages. More licenses were purchased. They just need installing."
  },
  {
    id: "SV-039", title: "Record every VTC call automatically",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["VTC Bridge", "File Servers"], window: "This week",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "The Colonel wants a record of every VTC 'for accountability'. All calls, all participants, stored on the file server forever.",
    rejectedReport: "The XO told the Colonel that the CAB 'doesn't believe in accountability'. The JAG officer, who had concerns about recording everyone, has quietly thanked you."
  },
  {
    id: "SV-040", title: "Rebuild indexes on the logistics database",
    requester: "albright", type: "Normal", statedRisk: "Low",
    systems: ["Logistics Database"], window: "Sat 0200-0400",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Supply reports take 40 minutes. Index rebuild tested on a copy of production. No downtime required."
  },
  {
    id: "SV-041", title: "Move the logistics database to new storage",
    requester: "albright", type: "Normal", statedRisk: "High",
    systems: ["Logistics Database", "Virtualization Cluster"], window: "Sat 0100-0500",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Current storage is out of support and logging errors. Three rehearsals. Full backup. Go/no-go checkpoint at 0200. Old storage stays live until Monday.",
    artifacts: {
      rollback: "Go/no-go checkpoint at 0200. If the data copy is less than 60% complete, or any verification check has failed, I call NO-GO and we stay on the old storage.\n\nAfter cutover, roll back if:\n- Any supply transaction fails in the post-cutover check\n- Database response time is more than double the baseline\n\nSteps:\n- Point the database back at the old storage (it stays live and untouched until Monday).\n- Replay the transaction log from cutover time, which is captured separately.\n- Supply section re-runs the standard checks.\n\nTime to restore: 20 minutes, measured in rehearsal 3.\n\nI keep notes. These are them. G. Albright"
    },
    returnsAsEmergency: {
      reason: "The old storage lost two disks overnight. The logistics database is running with no redundancy. One more failure and the supply system is gone.",
      title: "EMERGENCY: Move logistics database off failing storage",
      window: "Tonight",
      hiddenRisk: "High",
      justification: "Same plan, rehearsed three times. But now we migrate from a dying array under pressure, with no buffer. I would have preferred last week."
    }
  },
  {
    id: "SV-042", title: "Add new terrain map layers to Mission Command servers",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["Mission Command Servers"], window: "Thu 2000-2200",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Updated terrain data for the exercise area. 40 GB of map data. Tested on one workstation. Load on the server with 80 users not measured."
  },
  {
    id: "SV-043", title: "Upgrade Mission Command database the night before the exercise",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["Mission Command Servers"], window: "Sun 2300 (exercise starts 0500)",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "New database version is faster. If we do it the night before, it'll be nice and fresh for the exercise.",
    outageReport: "The upgraded database didn't match the application version. The brigade TOC started the exercise with paper maps and grease pencils. The Colonel said it was 'good training'. Through his teeth."
  },
  {
    id: "SV-044", title: "Update print drivers on the print servers",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["Print Servers"], window: "Thu 1700-1800",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "New drivers fix the 'printing in Klingon' bug. Tested on 5 printer models. There are 22 models."
  },
  {
    id: "SV-045", title: "Deploy new printers by Group Policy",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Print Servers", "Domain Controllers"], window: "Tue 1500-1530",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Users won't have to add printers by hand. Tested on the IT section. Everyone's default printer stays the same. I checked that specifically."
  },
  {
    id: "SV-046", title: "Isolate file server showing ransomware activity",
    requester: "morgan", type: "Emergency", statedRisk: "High",
    systems: ["File Servers"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Files on share S: are being renamed to '.locked'. Disconnect the server now to stop the spread. Users lose that share until it's clean."
  },
  {
    id: "SV-047", title: "Restore encrypted file shares from backup",
    requester: "reyes", type: "Emergency", statedRisk: "High",
    systems: ["File Servers", "Backup Servers"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Ransomware is contained. Restore from last night's backup. 6 TB. Restores have been tested, but never this large."
  },
  {
    id: "SV-048", title: "Reset the domain's master Kerberos key",
    requester: "morgan", type: "Normal", statedRisk: "High",
    systems: ["Domain Controllers"], window: "Sat 0200-0600",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Post-incident hardening after the ransomware event. Must be done twice, 10 hours apart. Done wrong, everyone's logins break. Done right, attackers' stolen tickets break."
  },
  {
    id: "SV-049", title: "Remove old domain admin accounts",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["Domain Controllers"], window: "Tue 1300-1330",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "14 domain admin accounts belong to people who left in the last 5 years. Disabling, not deleting. Verified no services run under them."
  },
  {
    id: "SV-050", title: "Install the vendor's monitoring agent on every server",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["Virtualization Cluster", "Domain Controllers", "File Servers"], window: "Thu, rolling",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "Value-add monitoring. The agent sends performance data to our cloud dashboard. It needs domain admin rights to install. It isn't on the approved software list yet.",
    rejectedReport: "Kyle has told his company's program manager that the installation is 'refusing free monitoring'. The program manager has requested a meeting with the Colonel."
  },
  {
    id: "SV-051", title: "Delete old virtual machine snapshots",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Virtualization Cluster"], window: "Sat 0800-1000",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "There are 140 snapshots, some from 2021. They're eating storage. Deleting a big snapshot can make a VM slow for a while. I learned that today."
  },
  {
    id: "SV-052", title: "Enable automatic VM load balancing",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Virtualization Cluster"], window: "Thu 1900-2000",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "The cluster moves VMs around automatically to balance load (slide 31). Some VMs dislike being moved during busy periods."
  },
  {
    id: "SV-053", title: "Encrypt backup data",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["Backup Servers"], window: "Sat 0600-0800",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Unencrypted backups are a finding. Encryption keys must be stored safely. If we lose the key, we lose every backup. The key will be in the safe. And on a USB stick. Somewhere."
  },
  {
    id: "SV-054", title: "Replicate backups offsite to higher HQ",
    requester: "albright", type: "Normal", statedRisk: "Medium",
    systems: ["Backup Servers", "WAN Edge Router"], window: "Nightly 0100-0500",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "All our backups are in one building. If it burns, we lose everything. Replication tested for two weeks with throttling to protect the WAN."
  },
  {
    id: "SV-055", title: "Block automatic mail forwarding outside the network",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["Mail Servers"], window: "Tue 1600-1615",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Users forwarding work email to personal accounts. Data spillage risk. Transport rule tested."
  },
  {
    id: "SV-056", title: "Migrate installation email to the cloud",
    requester: "menon", type: "Normal", statedRisk: "High",
    systems: ["Mail Servers", "Domain Controllers"], window: "Sat-Sun, all weekend",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Enterprise direction (slides 1-88). 6,000 mailboxes over one weekend. Pilot of 30 mailboxes went 'mostly' fine. Rolling back would take weeks."
  },
  {
    id: "SV-057", title: "Add a secondary DNS server at Remote Site Bravo",
    requester: "okafor", type: "Normal", statedRisk: "Low",
    systems: ["DNS/DHCP Servers", "Remote Site Routers"], window: "Tue 1000-1100",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "When the satellite drops, Bravo can't resolve anything. A local copy of DNS fixes it. Tested in lab with a simulated link failure."
  },
  {
    id: "SV-058", title: "Enable DNSSEC validation",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["DNS/DHCP Servers"], window: "Sat 0600-0700",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Protects against forged DNS answers. Misconfigured domains anywhere in the world will fail to resolve for us. Tested with 100 common domains."
  },
  {
    id: "SV-059", title: "Expand the barracks DHCP scope",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["DNS/DHCP Servers"], window: "Tue 1400-1410",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "New soldiers arrived and the barracks scope ran out. Bigger scope approved by CW2 Jackson. Tested."
  },
  {
    id: "SV-060", title: "Configure DHCP failover between the two DHCP servers",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["DNS/DHCP Servers"], window: "Sat 0500-0600",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Only one DHCP server holds the scopes. If it dies, nobody gets an address. Failover configured in lab. Scopes sync during setup.",
    returnsAsEmergency: {
      reason: "The only DHCP server crashed. Devices are losing their addresses one by one as their leases expire. The help desk phones are lighting up.",
      title: "EMERGENCY: Bring up DHCP failover, primary DHCP server down",
      window: "Immediately",
      hiddenRisk: "Medium",
      justification: "Second server is ready, as in my original request. Leases are expiring. We have maybe 2 hours."
    }
  },
  {
    id: "SV-061", title: "HQ DHCP scope exhausted, add addresses",
    requester: "ortiz", type: "Emergency", statedRisk: "Low",
    systems: ["DNS/DHCP Servers"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "No addresses left in HQ. New laptops can't connect. Extend the scope into the reserved range CW2 Jackson set aside for exactly this."
  },
  {
    id: "SV-062", title: "Hide folders users can't access on file shares",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["File Servers"], window: "Tue 1600-1615",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Users see folders they can't open and call the help desk. This hides them. Tested on the IT share. One checkbox."
  },
  {
    id: "SV-063", title: "Enforce storage quotas on department shares",
    requester: "albright", type: "Normal", statedRisk: "Low",
    systems: ["File Servers"], window: "Thu 1700-1730",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "The S3 share holds 4 TB of exercise videos. Quotas stop shares filling the server. Some shares are already over their new quota."
  },
  {
    id: "SV-064", title: "Delete files older than 7 years from all shares",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["File Servers"], window: "Sat 0800-1200",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Storage cleanup. I wrote a script. It deletes anything not modified in 7 years. Some of it might be records we're legally required to keep. I'm not sure who would know."
  },
  {
    id: "SV-065", title: "Dedicated file server for the command group",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["File Servers", "Virtualization Cluster"], window: "This week",
    rollback: "weak", testing: "none", hiddenRisk: "Medium",
    justification: "The Colonel doesn't want command group files on the 'same server as everyone else'. A separate server, separate backups, separate everything.",
    rejectedReport: "The XO noted in the staff meeting that 'the Colonel's files share a server with the motor pool's'. The motor pool sergeant has never been more pleased."
  },
  {
    id: "SV-066", title: "Move servers into the new data center racks",
    requester: "okafor", type: "Normal", statedRisk: "Medium",
    systems: ["Virtualization Cluster", "File Servers"], window: "Sat 0600-1400",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Old racks have no cable management and a sagging shelf. Servers move one at a time with their partners staying up. Every cable photographed."
  },
  {
    id: "SV-067", title: "Replace UPS batteries in the server room",
    requester: "okafor", type: "Normal", statedRisk: "Medium",
    systems: ["Virtualization Cluster", "Domain Controllers", "File Servers"], window: "Sat 0700-0900",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Batteries are 6 years old and failed the runtime test. Hot-swappable battery modules. If utility power blips during the swap, there's less protection."
  },
  {
    id: "SV-068", title: "BIOS and firmware updates on virtualization hosts",
    requester: "jackson", type: "Normal", statedRisk: "Medium",
    systems: ["Virtualization Cluster"], window: "Sat 0200-0600",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Security fixes for the server hardware. One host at a time, VMs moved off first. Tested on the lab host."
  },
  {
    id: "SV-069", title: "Rebalance VMs after a virtualization host failure",
    requester: "jackson", type: "Emergency", statedRisk: "Medium",
    systems: ["Virtualization Cluster"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Host 4 died. Its VMs restarted on the other hosts, which are now overloaded. Shut down non-essential VMs and rebalance."
  },
  {
    id: "SV-070", title: "Install a new Mission Command server for the brigade",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["Mission Command Servers", "Virtualization Cluster"], window: "Thu 0800-1200",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Brigade needs its own server for the next rotation. Built from the approved image. Accredited. Tested with brigade users in the training room."
  },
  {
    id: "SV-071", title: "Create domain trust with higher HQ's domain",
    requester: "menon", type: "Normal", statedRisk: "High",
    systems: ["Domain Controllers", "WAN Edge Router"], window: "Sat 0400-0800",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Users should access higher HQ resources seamlessly (slides 40-52). Trust tested between two lab domains. Our production domain has quirks from 2008."
  },
  {
    id: "SV-072", title: "Raise minimum password length to 15 characters",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["Domain Controllers"], window: "Tue 1600-1630",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "STIG requirement for password-based accounts. Applies at next password change. Some service accounts may not support long passwords."
  },
  {
    id: "SV-073", title: "Disable accounts inactive for 35 days",
    requester: "morgan", type: "Normal", statedRisk: "Low",
    systems: ["Domain Controllers"], window: "Thu 1000-1030",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Inactive accounts are a finding. Script disables them nightly. Soldiers on leave or deployed will be disabled when they return.",
    outageReport: "A company returned from a 6-week deployment. 140 soldiers couldn't log in on their first morning back. The help desk queue reached the end of the hallway."
  },
  {
    id: "SV-074", title: "Upgrade the network monitoring server",
    requester: "brandt", type: "Normal", statedRisk: "Medium",
    systems: ["Network Monitoring System"], window: "Thu 1400-1600",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "Value-add upgrade with new dashboards. Database schema changes during upgrade. Our engineer will be 'on standby'."
  },
  {
    id: "SV-075", title: "Add disk shelf to the SIEM server",
    requester: "okafor", type: "Normal", statedRisk: "Low",
    systems: ["SIEM Log Servers"], window: "Wed 0900-0930",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Additional shelf, hot-plug. Storage is added, nothing removed. Vendor procedure followed."
  },
  {
    id: "SV-076", title: "Monthly patching: print servers",
    requester: "ortiz", type: "Standard", catalogueId: "SC-03", statedRisk: "Low",
    systems: ["Print Servers"], window: "Sun 0400-0500",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Monthly baseline. Two print servers, one at a time. Test enclave patched last week."
  },
  {
    id: "SV-077", title: "Monthly patching: VoIP call managers",
    requester: "patchbot", type: "Standard", catalogueId: "SC-03", statedRisk: "Low",
    systems: ["VoIP Call Manager"], window: "Sun 0300-0400 (automatic)",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "BEEP. MONTHLY BASELINE. PRIMARY AND SUBSCRIBER PATCHED SEPARATELY. PHONES STAY REGISTERED. BEEP."
  },
  {
    id: "SV-078", title: "Out-of-cycle critical patch for mail servers",
    requester: "morgan", type: "Emergency", statedRisk: "High",
    systems: ["Mail Servers"], window: "Tonight 2200",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Mail server vulnerability being exploited in the wild. Compliance deadline: 48 hours. Tested on one lab server. Patch one server at a time."
  },
  {
    id: "SV-079", title: "Repair broken domain controller replication",
    requester: "jackson", type: "Emergency", statedRisk: "Medium",
    systems: ["Domain Controllers"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "DC3 stopped replicating 4 days ago. Password changes aren't reaching it. Users at the remote site can't log in. Force replication, then investigate."
  },
  {
    id: "SV-080", title: "Replace aging domain controller hardware",
    requester: "albright", type: "Normal", statedRisk: "Medium",
    systems: ["Domain Controllers"], window: "Sat 0800-1200",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "DC1 and DC2 are on 9-year-old hardware. New DCs built, promoted and replicating. Old ones demoted after a week of monitoring. Plan reviewed twice.",
    returnsAsEmergency: {
      reason: "DC1's motherboard failed. DC2 is carrying the whole domain alone and showing disk errors.",
      title: "EMERGENCY: Promote new domain controllers, DC1 dead and DC2 failing",
      window: "Immediately",
      hiddenRisk: "Medium",
      justification: "The new DCs I requested are built and waiting. I have noted the date of my original request in green ink."
    }
  },
  {
    id: "SV-081", title: "Clean up server C: drives with a deletion script",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["File Servers", "Domain Controllers", "Mail Servers"], window: "Tue 1100",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "Servers are low on disk. My script deletes everything in folders called 'temp' or 'logs'. Fast and simple."
  },
  {
    id: "SV-082", title: "Reboot every server at once to finish pending updates",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["Virtualization Cluster", "Domain Controllers", "File Servers", "Mail Servers"], window: "Tue 1200 (lunch)",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "Lots of servers say 'restart required'. One big reboot at lunch and we're done. Everything comes back up eventually."
  },
  {
    id: "SV-083", title: "Rename all servers to the new naming standard",
    requester: "menon", type: "Normal", statedRisk: "Low",
    systems: ["Virtualization Cluster", "File Servers", "Mail Servers"], window: "Sat 0000-0800",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "New enterprise naming convention (40-page standard). Every server gets a new name. Applications that use the old names will need updating. We're compiling a list."
  },
  {
    id: "SV-084", title: "Deploy a self-service password reset server",
    requester: "ortiz", type: "Normal", statedRisk: "Medium",
    systems: ["Domain Controllers", "RADIUS Authentication Servers"], window: "Thu 1300-1500",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "40% of help desk calls are password resets. Users verify with CAC and reset themselves. Tested with 25 users from the S6 shop."
  },
  {
    id: "SV-085", title: "Give the vendor remote access to 'optimise' the logistics database",
    requester: "brandt", type: "Normal", statedRisk: "Low",
    systems: ["Logistics Database"], window: "Whenever our DBA is available",
    rollback: "weak", testing: "none", hiddenRisk: "High",
    justification: "Value-add performance tuning! Our DBA needs full admin access remotely for a few days. He'll make 'small changes' as he goes."
  },
  {
    id: "SV-086", title: "Give the XO access to every mailbox on the installation",
    requester: "whitfield", type: "Normal", statedRisk: "Low",
    systems: ["Mail Servers"], window: "Today",
    rollback: "solid", testing: "none", hiddenRisk: "High",
    justification: "The Colonel wants the XO to be able to 'check on things'. Full access to all mailboxes. It's for good order and discipline.",
    rejectedReport: "The XO says the Colonel is 'very disappointed in the CAB's lack of support'. The Inspector General, who heard about the request, is very disappointed in something else."
  },
  {
    id: "SV-087", title: "Let PATCHBOT reboot servers automatically after patching",
    requester: "patchbot", type: "Normal", statedRisk: "Low",
    systems: ["Virtualization Cluster", "File Servers", "Domain Controllers"], window: "Whenever patching completes",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "BEEP. HUMANS FORGET TO REBOOT. PATCHBOT WILL REBOOT THE MOMENT PATCHES FINISH. DAY OR NIGHT. BRIEFING OR NO BRIEFING. BEEP."
  },
  {
    id: "SV-088", title: "PATCHBOT self-update to version 4.0",
    requester: "patchbot", type: "Normal", statedRisk: "Low",
    systems: ["Patch Server"], window: "Tue 0300 (automatic)",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "BEEP. PATCHBOT WISHES TO PATCH PATCHBOT. VERSION 4.0 HAS 'IMPROVED AUTONOMY'. PATCHBOT IS VERY EXCITED. BEEP."
  },
  {
    id: "SV-089", title: "Add antivirus exclusions for the logistics database files",
    requester: "albright", type: "Normal", statedRisk: "Low",
    systems: ["Logistics Database", "Endpoint Security Suite"], window: "Tue 1700-1715",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "The antivirus scans every database write, slowing supply transactions. Vendor-recommended exclusions only. Reviewed by Cyber."
  },
  {
    id: "SV-090", title: "Fix time drift on domain controllers",
    requester: "jackson", type: "Emergency", statedRisk: "Medium",
    systems: ["Domain Controllers", "NTP Time Servers"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "DCs drifted 6 minutes. Logins start failing at 5. Point the primary DC back at the correct time source. Documented procedure."
  },
  {
    id: "SV-091", title: "Create mail distribution lists for the exercise",
    requester: "ortiz", type: "Normal", statedRisk: "Low",
    systems: ["Mail Servers"], window: "Tue 1000-1030",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Twelve distribution lists for the exercise cells. Members verified by each cell's OIC."
  },
  {
    id: "SV-092", title: "Allow copiers to send scans through the mail relay",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["Mail Servers", "Print Servers"], window: "Thu 1400-1430",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Scan-to-email stopped after SMBv1 was disabled. I tested the relay with one copier. I'm not sure if the relay should be limited to copiers only. I left it open for now?"
  },
  {
    id: "SV-093", title: "Emergency restart of the VTC bridge before the General's call",
    requester: "whitfield", type: "Emergency", statedRisk: "Low",
    systems: ["VTC Bridge"], window: "In 20 minutes",
    rollback: "solid", testing: "none", hiddenRisk: "Medium",
    justification: "The XO says the bridge 'looked slow'. The General's call is in 30 minutes. Restart it now, just to be safe."
  },
  {
    id: "SV-094", title: "Connect Mission Command to the coalition partner's server",
    requester: "albright", type: "Normal", statedRisk: "High",
    systems: ["Mission Command Servers", "SIPR Core Router"], window: "Sat 0400-0700",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Shared operating picture for the combined exercise. Through the cross-domain guard. Tested with the partner's test server. Their production server is a different version."
  },
  {
    id: "SV-095", title: "Move backup jobs to daytime hours",
    requester: "kowalski", type: "Normal", statedRisk: "Low",
    systems: ["Backup Servers", "File Servers"], window: "Starting Monday",
    rollback: "solid", testing: "none", hiddenRisk: "Medium",
    justification: "Backups run at night and I'm not here at night to watch them. Running them at 1000 means I can keep an eye on them."
  },
  {
    id: "SV-096", title: "Move home drives to the new storage array",
    requester: "reyes", type: "Normal", statedRisk: "Medium",
    systems: ["File Servers"], window: "Sat 0000-0600",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "6,000 home drives, 11 TB. Pre-copied over two weeks. Final sync Saturday. Drive mappings updated by policy. Some users map their drives manually."
  },
  {
    id: "SV-097", title: "Add memory to the logistics database server",
    requester: "okafor", type: "Normal", statedRisk: "Low",
    systems: ["Logistics Database"], window: "Sat 0600-0700",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "Server needs a shutdown to add memory. Supply section agreed to a Saturday morning outage. Memory is the vendor-approved part."
  },
  {
    id: "SV-098", title: "Add remote site switches as RADIUS clients",
    requester: "jackson", type: "Normal", statedRisk: "Low",
    systems: ["RADIUS Authentication Servers", "Remote Site Routers"], window: "Tue 1300-1330",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Remote site devices still use local passwords. Clients added and tested from the lab."
  },
  {
    id: "SV-099", title: "Deploy new intermediate CA certificates to all servers",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["PKI Validation Servers", "Domain Controllers", "Mail Servers"], window: "Sat 0600-0800",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Higher HQ is rotating its intermediate certificates. Every server needs the new chain or it won't trust new CACs. Tested on 6 lab servers."
  },
  {
    id: "SV-100", title: "SIEM rules that disable accounts automatically",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["SIEM Log Servers", "Domain Controllers"], window: "Thu 2000-2100",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Suspicious login patterns trigger automatic account lockout. Faster response. Tested against last month's logs, where it would have locked out 3 attackers and 40 innocent people."
  },
  {
    id: "SV-101", title: "Retire the old NTP time server",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["NTP Time Servers"], window: "Thu 1100-1130",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Everything should now use the new time servers. I checked the ones I could find. Some old devices might have the old address typed in by hand."
  },
  {
    id: "SV-102", title: "Delete stale DNS records with a script",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["DNS/DHCP Servers"], window: "Tue 1400-1500",
    rollback: "weak", testing: "partial", hiddenRisk: "Medium",
    justification: "3,000 DNS records haven't been updated in a year. Some are for servers with fixed addresses that never update their records. My script can't tell the difference."
  },
  {
    id: "SV-103", title: "Turn on secure print release",
    requester: "ortiz", type: "Normal", statedRisk: "Medium",
    systems: ["Print Servers"], window: "Thu 1700-1800",
    rollback: "solid", testing: "partial", hiddenRisk: "Medium",
    justification: "Sensitive documents sit on printers for hours. Users tap their CAC at the printer to release jobs. Tested on 3 printers. There are 300."
  },
  {
    id: "SV-104", title: "Upgrade the hypervisor to the next major version",
    requester: "jackson", type: "Normal", statedRisk: "High",
    systems: ["Virtualization Cluster"], window: "Sat 0000-0800",
    rollback: "solid", testing: "yes", hiddenRisk: "Medium",
    justification: "Current version end of support in 60 days. Upgrade rehearsed on the lab cluster. One host at a time, VMs moved off first.",
    returnsAsEmergency: {
      reason: "The hypervisor went out of support and a critical vulnerability was published. Higher HQ has ordered it fixed within 72 hours or the cluster gets disconnected.",
      title: "EMERGENCY: Upgrade unsupported hypervisor (72-hour deadline)",
      window: "Tonight",
      hiddenRisk: "High",
      justification: "Same plan. Less sleep. Higher HQ is calling every 4 hours."
    }
  },
  {
    id: "SV-105", title: "SIEM disk full: pause low-priority log collection",
    requester: "morgan", type: "Emergency", statedRisk: "Low",
    systems: ["SIEM Log Servers"], window: "Immediately",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "SIEM at 99%. Pause debug-level logs from the printers to save room for security logs. Re-enable after the new disks arrive."
  },
  {
    id: "SV-106", title: "Clear locked sessions on the logistics database",
    requester: "albright", type: "Emergency", statedRisk: "Medium",
    systems: ["Logistics Database"], window: "Immediately",
    rollback: "solid", testing: "partial", hiddenRisk: "Low",
    justification: "A runaway report has locked the supply tables. Nobody can issue equipment. Kill the report's session. Documented procedure."
  },
  {
    id: "SV-107", title: "Create time-limited accounts for exercise augmentees",
    requester: "reyes", type: "Normal", statedRisk: "Low",
    systems: ["Mission Command Servers", "Domain Controllers"], window: "Thu 1000-1100",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "60 augmentees arrive Monday. Accounts expire automatically at ENDEX. Roles approved by the S3."
  },
  {
    id: "SV-108", title: "Disable NTLMv1 on domain controllers",
    requester: "morgan", type: "Normal", statedRisk: "Medium",
    systems: ["Domain Controllers"], window: "Sat 0700-0800",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "Old authentication protocol, easily cracked. Logs show 9 devices still using it. We know what 6 of them are."
  },
  {
    id: "SV-109", title: "Enable shadow copies on file servers",
    requester: "nakamura", type: "Normal", statedRisk: "Low",
    systems: ["File Servers"], window: "Tue 1500-1515",
    rollback: "solid", testing: "yes", hiddenRisk: "Low",
    justification: "Users can restore their own deleted files. Fewer help desk calls. Uses about 10% of disk. I checked there's room."
  },
  {
    id: "SV-110", title: "Apply the new server hardening baseline everywhere",
    requester: "menon", type: "Normal", statedRisk: "Medium",
    systems: ["Domain Controllers", "File Servers", "Mail Servers", "Virtualization Cluster"], window: "Sat 0000-0800",
    rollback: "weak", testing: "partial", hiddenRisk: "High",
    justification: "One hardening baseline for every server (document attached, 112 pages). Tested on two generic servers. Production servers are not generic."
  }
);
