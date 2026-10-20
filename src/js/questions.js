/**
 * Cybersecurity Quiz Bee - Question Bank
 * -----------------------------------------------------------
 * This file is DATA ONLY. It is intentionally kept separate from
 * the application logic so that the bank can be edited or replaced
 * without touching the quiz engine.
 *
 * Structure for each question:
 *   id              : unique number
 *   type            : "multiple-choice" | "scramble"
 *   text            : the question prompt
 *   options         : array of strings (multiple-choice only, otherwise null)
 *   correctAnswer   : index into options (multiple-choice) OR string (scramble)
 *   acceptedAnswers : array of normalized, acceptable spellings (scramble only)
 *   explanation     : short justification shown after reveal / in review
 */
window.QUESTION_BANK = [
  /* ================= PART I - MULTIPLE CHOICE (1-24) ================= */
  {
    id: 1,
    difficulty: "easy",
    type: "multiple-choice",
    text: "What is the primary purpose of a firewall?",
    options: [
      "Filter network traffic using security rules",
      "Repair damaged hardware",
      "Create user passwords automatically",
      "Increase storage capacity"
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "A firewall inspects and filters network traffic based on configured security rules."
  },
  {
    id: 2,
    difficulty: "easy",
    type: "multiple-choice",
    text: "What is phishing?",
    options: [
      "Compressing a file",
      "Tricking people into revealing sensitive information",
      "Updating a device",
      "Testing network speed"
    ],
    correctAnswer: 1,
    acceptedAnswers: [],
    explanation: "Phishing uses deceptive messages or sites to trick people into giving up sensitive information."
  },
  {
    id: 3,
    difficulty: "easy",
    type: "multiple-choice",
    text: "Which type of malware can encrypt files and demand payment?",
    options: ["Adware", "Spyware", "Ransomware", "Cookie"],
    correctAnswer: 2,
    acceptedAnswers: [],
    explanation: "Ransomware encrypts files and demands payment, often in cryptocurrency, for the key."
  },
  {
    id: 4,
    difficulty: "easy",
    type: "multiple-choice",
    text: "Which principle limits users to only the permissions needed for their work?",
    options: ["Open access", "Full control", "Public access", "Least privilege"],
    correctAnswer: 3,
    acceptedAnswers: [],
    explanation: "Least privilege grants only the access required to perform assigned tasks."
  },
  {
    id: 5,
    difficulty: "easy",
    type: "multiple-choice",
    text: "What does the CIA triad stand for in information security?",
    options: [
      "Control, Internet, Access",
      "Confidentiality, Integrity, Availability",
      "Cybercrime, Investigation, Analysis",
      "Credentials, Identity, Authorization"
    ],
    correctAnswer: 1,
    acceptedAnswers: [],
    explanation: "The CIA triad is Confidentiality, Integrity, and Availability."
  },
  {
    id: 6,
    difficulty: "easy",
    type: "multiple-choice",
    text: "Which protocol is commonly used for encrypted remote command-line access?",
    options: ["Telnet", "FTP", "SSH", "HTTP"],
    correctAnswer: 2,
    acceptedAnswers: [],
    explanation: "SSH (Secure Shell) encrypts remote command-line sessions; Telnet and FTP are unencrypted."
  },
  {
    id: 7,
    difficulty: "easy",
    type: "multiple-choice",
    text: "What is the main goal of a DDoS attack?",
    options: [
      "Make a service unavailable by overwhelming its resources",
      "Improve server performance",
      "Create secure backups",
      "Encrypt a hard drive for legitimate protection"
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "A Distributed Denial-of-Service attack floods a service from many sources to disrupt availability."
  },
  {
    id: 8,
    difficulty: "easy",
    type: "multiple-choice",
    text: "Which is the strongest password practice?",
    options: [
      "Use your birthday",
      "Reuse one password everywhere",
      "Share passwords with friends",
      "Use a long, unique password for each account"
    ],
    correctAnswer: 3,
    acceptedAnswers: [],
    explanation: "Long, unique passwords per account reduce the impact of any single breach."
  },
  {
    id: 9,
    difficulty: "easy",
    type: "multiple-choice",
    text: "What is multi-factor authentication (MFA)?",
    options: [
      "Using multiple usernames",
      "Using two or more different types of verification factors",
      "Logging in from several devices",
      "Changing a password every hour"
    ],
    correctAnswer: 1,
    acceptedAnswers: [],
    explanation: "MFA combines two or more different factor types: something you know, have, or are."
  },
  {
    id: 10,
    difficulty: "easy",
    type: "multiple-choice",
    text: "What does HTTPS help protect?",
    options: [
      "All content on a device from malware",
      "A user from every online scam",
      "Data exchanged with a website while in transit",
      "A computer from physical theft"
    ],
    correctAnswer: 2,
    acceptedAnswers: [],
    explanation: "HTTPS encrypts data in transit between the browser and the website."
  },
  {
    id: 11,
    difficulty: "easy",
    type: "multiple-choice",
    text: "What is a zero-day vulnerability?",
    options: [
      "A flaw exploited before an effective fix is available",
      "A vulnerability with no security impact",
      "A fully patched flaw that cannot be exploited",
      "A type of backup"
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "A zero-day is exploited before the vendor has released an effective fix."
  },
  {
    id: 12,
    difficulty: "easy",
    type: "multiple-choice",
    text: "Which activity is an example of social engineering?",
    options: [
      "Applying a software patch",
      "Encrypting a disk",
      "Running a scheduled backup",
      "Impersonating IT support to steal a password"
    ],
    correctAnswer: 3,
    acceptedAnswers: [],
    explanation: "Social engineering manipulates people, for example by impersonating IT support."
  },
  {
    id: 13,
    difficulty: "easy",
    type: "multiple-choice",
    text: "What is the main purpose of encryption?",
    options: [
      "Make computers run faster",
      "Make data unreadable without the appropriate key or method",
      "Remove all malware",
      "Guarantee that a website is legitimate"
    ],
    correctAnswer: 1,
    acceptedAnswers: [],
    explanation: "Encryption makes data unreadable to anyone without the correct key or method."
  },
  {
    id: 14,
    difficulty: "easy",
    type: "multiple-choice",
    text: "What is a vulnerability in cybersecurity?",
    options: [
      "A security certificate",
      "A backup schedule",
      "A weakness that could be exploited",
      "A type of firewall"
    ],
    correctAnswer: 2,
    acceptedAnswers: [],
    explanation: "A vulnerability is a weakness that an attacker could exploit."
  },
  {
    id: 15,
    difficulty: "easy",
    type: "multiple-choice",
    text: "What does a VPN commonly provide when configured correctly?",
    options: [
      "An encrypted connection to a VPN endpoint",
      "Guaranteed total anonymity",
      "Automatic removal of every virus",
      "A guarantee that all websites are safe"
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "A VPN encrypts traffic between the device and a VPN endpoint; it does not guarantee anonymity."
  },
  {
    id: 16,
    difficulty: "easy",
    type: "multiple-choice",
    text: "What is the purpose of a security patch?",
    options: [
      "Add advertisements",
      "Disable account protection",
      "Replace a computer's hardware",
      "Fix bugs or security weaknesses"
    ],
    correctAnswer: 3,
    acceptedAnswers: [],
    explanation: "Patches fix bugs and security weaknesses in software."
  },
  {
    id: 17,
    difficulty: "normal",
    type: "multiple-choice",
    text: "Which malware is designed to secretly monitor activity or collect information?",
    options: ["Firewall", "Spyware", "Patch", "Backup utility"],
    correctAnswer: 1,
    acceptedAnswers: [],
    explanation: "Spyware secretly monitors activity and collects information."
  },
  {
    id: 18,
    difficulty: "normal",
    type: "multiple-choice",
    text: "What is a brute-force attack?",
    options: [
      "Physically damaging a server",
      "Encrypting a backup",
      "Trying many possible passwords or keys until one works",
      "Installing an authorized update"
    ],
    correctAnswer: 2,
    acceptedAnswers: [],
    explanation: "A brute-force attack systematically tries many passwords or keys until one works."
  },
  {
    id: 19,
    difficulty: "normal",
    type: "multiple-choice",
    text: "What is the safest action when you receive a suspicious email attachment?",
    options: [
      "Avoid opening it and verify or report the message",
      "Open it immediately",
      "Forward it to everyone",
      "Disable antivirus first"
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Never open suspicious attachments; verify the sender and report the message."
  },
  {
    id: 20,
    difficulty: "normal",
    type: "multiple-choice",
    text: "Why should important files be backed up regularly?",
    options: [
      "To make passwords unnecessary",
      "To stop all phishing attempts",
      "To increase screen resolution",
      "To recover data after loss, damage, or some attacks"
    ],
    correctAnswer: 3,
    acceptedAnswers: [],
    explanation: "Backups allow recovery after data loss, hardware failure, or attacks such as ransomware."
  },
  {
    id: 21,
    difficulty: "normal",
    type: "multiple-choice",
    text: "Which security property means data has not been improperly changed?",
    options: ["Availability", "Integrity", "Confidentiality", "Scalability"],
    correctAnswer: 1,
    acceptedAnswers: [],
    explanation: "Integrity ensures data has not been improperly altered."
  },
  {
    id: 22,
    difficulty: "normal",
    type: "multiple-choice",
    text: "Which device commonly forwards traffic between different networks?",
    options: ["Keyboard", "Webcam", "Router", "Printer"],
    correctAnswer: 2,
    acceptedAnswers: [],
    explanation: "A router forwards traffic between different networks."
  },
  {
    id: 23,
    difficulty: "normal",
    type: "multiple-choice",
    text: "What is the role of antivirus or endpoint protection software?",
    options: [
      "Detect, block, or help remove malicious software",
      "Guarantee that no attack can succeed",
      "Replace all network equipment",
      "Make every password unique automatically"
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Endpoint protection detects, blocks, and helps remove malicious software; it is not infallible."
  },
  {
    id: 24,
    difficulty: "normal",
    type: "multiple-choice",
    text: "What is ethical hacking?",
    options: [
      "Accessing any system without permission",
      "Stealing data to prove a weakness",
      "Disabling security controls for fun",
      "Authorized testing to identify security weaknesses"
    ],
    correctAnswer: 3,
    acceptedAnswers: [],
    explanation: "Ethical hacking is authorized testing performed with permission to find weaknesses."
  },

  /* ================= PART II - SCRAMBLE (25-40) ================= */
  {
    id: 25,
    difficulty: "normal",
    type: "scramble",
    text: "A fraudulent message or website designed to trick someone into revealing sensitive information.",
    options: null,
    correctAnswer: "Phishing",
    acceptedAnswers: ["phishing", "phishing attack", "phishing scam"],
    explanation: "Phishing uses fraudulent messages or sites to steal sensitive information."
  },
  {
    id: 26,
    difficulty: "normal",
    type: "scramble",
    text: "Malicious software that can encrypt files and demand payment.",
    options: null,
    correctAnswer: "Ransomware",
    acceptedAnswers: ["ransomware", "ransom ware"],
    explanation: "Ransomware encrypts files and demands payment for the decryption key."
  },
  {
    id: 27,
    difficulty: "normal",
    type: "scramble",
    text: "A security system that filters network traffic according to rules.",
    options: null,
    correctAnswer: "Firewall",
    acceptedAnswers: ["firewall", "fire wall"],
    explanation: "A firewall filters traffic based on predefined security rules."
  },
  {
    id: 28,
    difficulty: "normal",
    type: "scramble",
    text: "The process of converting readable data into a protected form using cryptographic methods.",
    options: null,
    correctAnswer: "Encryption",
    acceptedAnswers: ["encryption", "encrypt", "data encryption"],
    explanation: "Encryption converts readable data into a protected form using cryptographic methods."
  },
  {
    id: 29,
    difficulty: "hard",
    type: "scramble",
    text: "A small hardware or software device used as an additional authentication factor beyond a password, such as a key fob or app-generated code.",
    options: null,
    correctAnswer: "Token",
    acceptedAnswers: ["token", "security token", "auth token", "authentication token"],
    explanation: "A token provides an additional authentication factor beyond a password."
  },
  {
    id: 30,
    difficulty: "hard",
    type: "scramble",
    text: "Software or code specifically written to take advantage of a security flaw in a system or application.",
    options: null,
    correctAnswer: "Exploit",
    acceptedAnswers: ["exploit", "exploits", "software exploit", "security exploit"],
    explanation: "An exploit leverages a vulnerability to execute unintended behavior on a target system."
  },
  {
    id: 31,
    difficulty: "hard",
    type: "scramble",
    text: "A type of malware that can copy itself and spread to other devices on a network without needing to attach itself to existing software.",
    options: null,
    correctAnswer: "Worm",
    acceptedAnswers: ["worm", "computer worm", "network worm"],
    explanation: "A worm is self-replicating malware that spreads independently across networks."
  },
  {
    id: 32,
    difficulty: "hard",
    type: "scramble",
    text: "A form of malware that misleads users of its true intent by masquerading as a legitimate or desirable program.",
    options: null,
    correctAnswer: "Trojan",
    acceptedAnswers: ["trojan", "trojan horse"],
    explanation: "A trojan horse disguises malware as legitimate software to trick users."
  },
  {
    id: 33,
    difficulty: "hard",
    type: "scramble",
    text: "A collection of compromised internet-connected devices that are controlled remotely by an attacker without the owners' awareness.",
    options: null,
    correctAnswer: "Botnet",
    acceptedAnswers: ["botnet", "bot net", "zombie network", "bot network"],
    explanation: "A botnet is a network of compromised devices remotely controlled by an attacker."
  },
  {
    id: 34,
    difficulty: "hard",
    type: "scramble",
    text: "The security property concerned with keeping data accurate and protected from unauthorized modification.",
    options: null,
    correctAnswer: "Integrity",
    acceptedAnswers: ["integrity", "data integrity"],
    explanation: "Integrity keeps data accurate and protected from unauthorized modification."
  },
  {
    id: 35,
    difficulty: "expert",
    type: "scramble",
    text: "The portion of a piece of malicious code that is designed to perform the actual harmful action on the target system.",
    options: null,
    correctAnswer: "Payload",
    acceptedAnswers: ["payload", "malware payload"],
    explanation: "A payload is the active part of malware that carries out the intended malicious effect."
  },
  {
    id: 36,
    difficulty: "expert",
    type: "scramble",
    text: "A hidden method of bypassing normal authentication or security controls in a computer system.",
    options: null,
    correctAnswer: "Backdoor",
    acceptedAnswers: ["backdoor", "back door", "trapdoor"],
    explanation: "A backdoor allows unauthorized access by bypassing normal authentication."
  },
  {
    id: 37,
    difficulty: "expert",
    type: "scramble",
    text: "A device, software, or program that monitors and captures data packets traveling across a computer network.",
    options: null,
    correctAnswer: "Sniffer",
    acceptedAnswers: ["sniffer", "packet sniffer", "network sniffer"],
    explanation: "A sniffer captures and analyzes network traffic, often without the network's knowledge."
  },
  {
    id: 38,
    difficulty: "expert",
    type: "scramble",
    text: "The act of falsifying communication data, such as a sender address, to deceive and manipulate recipients.",
    options: null,
    correctAnswer: "Spoofing",
    acceptedAnswers: ["spoofing", "spoof", "email spoofing", "caller id spoofing"],
    explanation: "Spoofing is the forgery of data or identities to deceive recipients or systems."
  },
  {
    id: 39,
    difficulty: "expert",
    type: "scramble",
    text: "A program or code designed to harm, disrupt, spy on, or gain unauthorized access to systems.",
    options: null,
    correctAnswer: "Malware",
    acceptedAnswers: ["malware", "malicious software", "malicious code"],
    explanation: "Malware is software designed to harm, disrupt, spy, or gain unauthorized access."
  },
  {
    id: 40,
    difficulty: "expert",
    type: "scramble",
    text: "A type of malware that secretly records a user's keystrokes.",
    options: null,
    correctAnswer: "Keylogger",
    acceptedAnswers: ["keylogger", "key logger", "keystroke logger", "keylogging"],
    explanation: "A keylogger secretly records a user's keystrokes."
  },

  /* ================= PART IV - EXTRA MULTIPLE CHOICE (1001-1016) ================= */
  {
    id: 1001,
    difficulty: "normal",
    type: "multiple-choice",
    text: "What does DNS do on a network?",
    options: [
      "Translates domain names into IP addresses",
      "Encrypts files stored on the host",
      "Blocks phishing emails automatically",
      "Assigns permissions to user accounts"
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "DNS resolves human-readable domain names into the IP addresses computers use to connect."
  },
  {
    id: 1002,
    difficulty: "normal",
    type: "multiple-choice",
    text: "Which attack inserts malicious SQL statements through unvalidated user input?",
    options: ["Cross-site scripting", "SQL injection", "Session hijacking", "Brute force"],
    correctAnswer: 1,
    acceptedAnswers: [],
    explanation: "SQL injection inserts malicious SQL through unsanitized input to read or alter a database."
  },
  {
    id: 1003,
    difficulty: "normal",
    type: "multiple-choice",
    text: "Which vulnerability lets attackers inject malicious scripts that run in other users' browsers?",
    options: ["Buffer overflow", "SQL injection", "Cross-site scripting", "Directory traversal"],
    correctAnswer: 2,
    acceptedAnswers: [],
    explanation: "Cross-site scripting (XSS) injects client-side scripts that execute in a victim's browser."
  },
  {
    id: 1004,
    difficulty: "normal",
    type: "multiple-choice",
    text: "Which type of malware hides itself and other software to maintain privileged access?",
    options: ["Adware", "Worm", "Trojan", "Rootkit"],
    correctAnswer: 3,
    acceptedAnswers: [],
    explanation: "A rootkit conceals its presence and that of other malware to keep persistent privileged access."
  },
  {
    id: 1005,
    difficulty: "hard",
    type: "multiple-choice",
    text: "Which software automatically displays unwanted advertisements and can redirect a browser?",
    options: ["Adware", "Ransomware", "Rootkit", "Keylogger"],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Adware automatically shows unwanted ads and may redirect browsing to advertising sites."
  },
  {
    id: 1006,
    difficulty: "hard",
    type: "multiple-choice",
    text: "Which attack secretly intercepts and possibly alters communication between two parties?",
    options: ["Phishing", "Man-in-the-middle", "Denial of service", "Privilege escalation"],
    correctAnswer: 1,
    acceptedAnswers: [],
    explanation: "A man-in-the-middle attack secretly relays or alters traffic between two parties who believe they are talking directly."
  },
  {
    id: 1007,
    difficulty: "hard",
    type: "multiple-choice",
    text: "Which technique converts data into a fixed-length value that cannot be reversed to the original?",
    options: ["Encryption", "Compression", "Hashing", "Encoding"],
    correctAnswer: 2,
    acceptedAnswers: [],
    explanation: "Hashing produces a fixed-length digest that is effectively irreversible, unlike encryption."
  },
  {
    id: 1008,
    difficulty: "hard",
    type: "multiple-choice",
    text: "What is the primary purpose of a digital signature?",
    options: [
      "Compress a message for storage",
      "Encrypt an entire disk",
      "Hide a file's location",
      "Verify authenticity and integrity"
    ],
    correctAnswer: 3,
    acceptedAnswers: [],
    explanation: "A digital signature verifies the sender's authenticity and confirms the message was not altered."
  },
  {
    id: 1009,
    difficulty: "hard",
    type: "multiple-choice",
    text: "Which entity issues and signs digital certificates to vouch for a website's identity?",
    options: ["Certificate authority", "Domain registrar", "Internet service provider", "Firewall"],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "A certificate authority (CA) issues and signs certificates that bind identities to public keys."
  },
  {
    id: 1010,
    difficulty: "normal",
    type: "multiple-choice",
    text: "What is the main benefit of using a password manager?",
    options: [
      "It makes every password shorter",
      "It stores unique strong passwords securely",
      "It removes the need for multi-factor authentication",
      "It shares passwords with anyone who asks"
    ],
    correctAnswer: 1,
    acceptedAnswers: [],
    explanation: "A password manager securely stores unique, strong passwords so every account can differ."
  },
  {
    id: 1011,
    difficulty: "normal",
    type: "multiple-choice",
    text: "Which authentication factor uses fingerprints or facial features?",
    options: ["Something you know", "Something you have", "Something you are", "Somewhere you are"],
    correctAnswer: 2,
    acceptedAnswers: [],
    explanation: "Biometrics authenticate using something you are, such as a fingerprint or face."
  },
  {
    id: 1012,
    difficulty: "normal",
    type: "multiple-choice",
    text: "Which Wi-Fi security standard is the most current and secure?",
    options: ["WEP", "WPA", "WPA2", "WPA3"],
    correctAnswer: 3,
    acceptedAnswers: [],
    explanation: "WPA3 is the newest Wi-Fi security standard and improves on WPA2."
  },
  {
    id: 1013,
    difficulty: "normal",
    type: "multiple-choice",
    text: "What does the 3-2-1 backup rule recommend?",
    options: [
      "Keep 3 copies on 2 media with 1 offsite",
      "Keep 3 passwords and 2 devices",
      "Keep 3 admins and 2 servers",
      "Keep 3 firewalls and 2 logs"
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "The 3-2-1 rule keeps three copies of data, on two media types, with one copy offsite."
  },
  {
    id: 1014,
    difficulty: "hard",
    type: "multiple-choice",
    text: "What is shoulder surfing?",
    options: [
      "Scanning a network for active hosts",
      "Watching someone enter sensitive information",
      "Clicking a fake advertisement",
      "Flooding a server with traffic"
    ],
    correctAnswer: 1,
    acceptedAnswers: [],
    explanation: "Shoulder surfing is directly observing someone to capture sensitive information such as PINs."
  },
  {
    id: 1015,
    difficulty: "hard",
    type: "multiple-choice",
    text: "What is spear phishing?",
    options: [
      "Any mass email campaign",
      "A network scanning technique",
      "A targeted phishing attack on a specific person",
      "A type of ransomware"
    ],
    correctAnswer: 2,
    acceptedAnswers: [],
    explanation: "Spear phishing is a targeted phishing attack tailored to a specific individual or group."
  },
  {
    id: 1016,
    difficulty: "normal",
    type: "multiple-choice",
    text: "Why should you change a router's default administrator password?",
    options: [
      "To speed up the Wi-Fi connection",
      "To hide the network name",
      "To extend the wireless range",
      "Defaults are publicly known and easily exploited"
    ],
    correctAnswer: 3,
    acceptedAnswers: [],
    explanation: "Default router credentials are publicly documented, so changing them prevents unauthorized access."
  },
  {
    id: 2001,
    type: "multiple-choice",
    difficulty: "expert",
    text: "What does a CVE identifier represent?",
    options: [
      "A publicly catalogued entry for a specific known vulnerability",
      "A mandatory encryption standard for all web traffic",
      "A type of malware that hides inside a compiler",
      "A certificate revocation list maintained by browsers",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "CVE (Common Vulnerabilities and Exposures) is a public, uniquely numbered list of disclosed vulnerabilities that vendors and tools reference for tracking and patching."
  },
  {
    id: 2002,
    type: "multiple-choice",
    difficulty: "expert",
    text: "What is the main function of a Web Application Firewall (WAF)?",
    options: [
      "Inspecting and filtering HTTP traffic to block common application-layer attacks",
      "Encrypting every request so proxies cannot read it",
      "Replacing secure coding reviews with automated scanning",
      "Assigning public IP addresses to web servers",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "A WAF sits between users and the application, filtering requests against signature and anomaly rules to block things like SQL injection and cross-site scripting."
  },
  {
    id: 2003,
    type: "multiple-choice",
    difficulty: "expert",
    text: "Why is a password stored with a unique salt before it is hashed?",
    options: [
      "So identical passwords produce different hashes, defeating precomputed tables",
      "So the server can reverse the hash when the user forgets it",
      "To make the stored value longer than the password policy allows",
      "To allow every account to share one single stored hash",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Salting makes each stored hash unique for the same password, so precomputed rainbow tables and bulk cracking of identical passwords become useless."
  },
  {
    id: 2004,
    type: "multiple-choice",
    difficulty: "expert",
    text: "What is a time-of-check to time-of-use (TOCTOU) flaw?",
    options: [
      "A race condition where a value changes between being checked and being used",
      "A clock drift issue that makes logs record the wrong timestamp",
      "A denial of service caused by sending packets too quickly",
      "A weakness where passwords expire while a session is still open",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "TOCTOU bugs appear when code checks a value (a permission, a file path, a balance) and then acts on it later, giving an attacker a window to swap it."
  },
  {
    id: 2005,
    type: "multiple-choice",
    difficulty: "expert",
    text: "What is a software supply chain attack?",
    options: [
      "Compromising a trusted vendor, dependency or update channel to reach downstream targets",
      "Sending oversized packets to exhaust a vendor's bandwidth",
      "Installing an unpatched operating system on every machine",
      "Copying a company's source code onto a public repository",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Supply chain attacks abuse trust in upstream code, so a poisoned update or dependency can reach many organizations that never ran the attacker's exploit directly."
  },
  {
    id: 2006,
    type: "multiple-choice",
    difficulty: "expert",
    text: "What does certificate pinning add to HTTPS?",
    options: [
      "The client accepts only specific certificates or public keys for a host",
      "The client stores an extra copy of the certificate in case it is lost",
      "The server rotates its certificate automatically every few hours",
      "The browser refuses to visit any site that uses a paid certificate",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Pinning makes the client verify the host against a known key or certificate, so even a compromised certificate authority cannot impersonate that site."
  },
  {
    id: 2007,
    type: "multiple-choice",
    difficulty: "expert",
    text: "What is a passkey?",
    options: [
      "A FIDO2 credential bound to a device's secure hardware that replaces a password and resists phishing",
      "A long random password stored in the browser's password manager",
      "A one-time code sent by SMS to a registered phone",
      "A certificate that proves an employee's job title to a website",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Passkeys are cryptographic credentials bound to a device's secure element. They cannot be replayed by a phishing site because the credential only works on the real site."
  },
  {
    id: 2008,
    type: "multiple-choice",
    difficulty: "expert",
    text: "What is threat modeling?",
    options: [
      "A structured process of identifying assets, threats and mitigations before or during a build",
      "A test that runs known exploits against a finished application",
      "A report that ranks firewalls and antivirus products by price",
      "A backup procedure that protects systems from ransomware",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Threat modelling asks what can go wrong, how likely it is and what to do about it - normally during design, so weaknesses are fixed cheaply."
  },
  {
    id: 2009,
    type: "scramble",
    difficulty: "expert",
    text: "A long-term, carefully planned intrusion carried out by a well-resourced adversary who stays inside a target network for months.",
    options: null,
    correctAnswer: "APT",
    acceptedAnswers: ["apt", "advancedpersistentthreat", "advanced persistent threat"],
    explanation: "An APT describes a patient, well-funded attacker (often a state group) that establishes long-term access and quietly extracts data."
  },
  {
    id: 2010,
    type: "scramble",
    difficulty: "expert",
    text: "The act of gaining higher permissions than originally granted, for example from a normal user account to administrator or root.",
    options: null,
    correctAnswer: "Privilege Escalation",
    acceptedAnswers: ["privilegeescalation", "privilege escalation"],
    explanation: "Escalation turns limited access into full control, and it is a common second step after an initial foothold."
  },
  {
    id: 2011,
    type: "scramble",
    difficulty: "expert",
    text: "An attack that logs in to other services using username and password pairs stolen from a previous breach.",
    options: null,
    correctAnswer: "Credential Stuffing",
    acceptedAnswers: ["credentialstuffing", "credential stuffing"],
    explanation: "Because people reuse passwords, a leaked list lets attackers try the same pairs on unrelated sites at scale."
  },
  {
    id: 2012,
    type: "scramble",
    difficulty: "expert",
    text: "An attack where the attacker authenticates with a stolen password hash instead of cracking it back into the original password.",
    options: null,
    correctAnswer: "Pass the Hash",
    acceptedAnswers: ["passthehash", "pass the hash", "pass-the-hash"],
    explanation: "Windows and other protocols authenticate with hashes, so a captured NTLM hash can be replayed directly with tools such as Mimikatz."
  },
  {
    id: 2013,
    type: "scramble",
    difficulty: "expert",
    text: "A flaw where attacker-supplied input ends up being executed as an operating system command, usually by passing through a shell.",
    options: null,
    correctAnswer: "Command Injection",
    acceptedAnswers: ["commandinjection", "command injection"],
    explanation: "Unlike SQL injection, command injection reaches the shell. It typically appears when a program builds a command line by concatenating untrusted input."
  },
  {
    id: 2014,
    type: "scramble",
    difficulty: "expert",
    text: "An attack that uses ../ or similar sequences inside a file path to reach files outside the intended directory.",
    options: null,
    correctAnswer: "Path Traversal",
    acceptedAnswers: ["pathtraversal", "path traversal", "directory traversal"],
    explanation: "If a file parameter is not normalised, ../ sequences walk up the tree and expose configuration files, source code or private keys."
  },
  {
    id: 2015,
    type: "scramble",
    difficulty: "expert",
    text: "A flaw that makes the server send requests to resources the attacker chooses, using the server's own network position.",
    options: null,
    correctAnswer: "SSRF",
    acceptedAnswers: ["ssrf", "serversiderequestforgery", "server-side request forgery", "server side request forgery"],
    explanation: "SSRF turns a server into a proxy: it can reach internal admin panels, cloud metadata endpoints or other services the attacker cannot reach directly."
  },
  {
    id: 2016,
    type: "scramble",
    difficulty: "expert",
    text: "An attack that makes an authenticated user's browser send an unwanted request to a site where they are logged in.",
    options: null,
    correctAnswer: "CSRF",
    acceptedAnswers: ["csrf", "crosssiterequestforgery", "cross-site request forgery", "cross site request forgery"],
    explanation: "CSRF abuses the browser's automatic inclusion of cookies; the defences are SameSite cookies, anti-CSRF tokens and re-authentication for risky actions."
  },
  {
    id: 2017,
    type: "scramble",
    difficulty: "expert",
    text: "A payload that opens a connection from the compromised machine back to the attacker's listener, giving remote command execution.",
    options: null,
    correctAnswer: "Reverse Shell",
    acceptedAnswers: ["reverseshell", "reverse shell"],
    explanation: "A reverse shell is preferred by attackers because victims usually allow outbound traffic, so no inbound port needs to be opened."
  },
  {
    id: 2018,
    type: "scramble",
    difficulty: "expert",
    text: "A pattern-matching rule used to identify and classify suspicious files by their strings, bytes or structure.",
    options: null,
    correctAnswer: "YARA Rule",
    acceptedAnswers: ["yararule", "yara rule", "yara"],
    explanation: "YARA rules describe malware families and are widely used by antivirus engines, incident responders and threat hunters."
  },
  {
    id: 2019,
    type: "scramble",
    difficulty: "expert",
    text: "The infrastructure and channel an attacker uses to manage compromised systems and send instructions to implants.",
    options: null,
    correctAnswer: "C2",
    acceptedAnswers: ["c2", "commandandcontrol", "command and control"],
    explanation: "C2 servers let operators keep control, stage data and update implants; defenders hunt for the domains, certificates and beacon patterns they use."
  },
  {
    id: 2020,
    type: "scramble",
    difficulty: "expert",
    text: "The unauthorized use of a victim's computing power to mine cryptocurrency, usually through a malicious script or binary.",
    options: null,
    correctAnswer: "Cryptojacking",
    acceptedAnswers: ["cryptojacking", "crypto-jacking", "crypto mining"],
    explanation: "Cryptojacking is often low and slow: the victim loses electricity and performance while the attacker earns a small, steady return."
  },
  {
    id: 2021,
    type: "scramble",
    difficulty: "expert",
    text: "The technique of moving from an already compromised system to other systems inside the same network.",
    options: null,
    correctAnswer: "Lateral Movement",
    acceptedAnswers: ["lateralmovement", "lateral movement"],
    explanation: "Once inside, attackers pivot to workstations, file servers and cloud services - the goal is usually to reach valuable data or domain admin rights."
  },
  {
    id: 2022,
    type: "scramble",
    difficulty: "expert",
    text: "An isolated environment where suspicious files or code are executed so their behaviour can be observed safely.",
    options: null,
    correctAnswer: "Sandbox",
    acceptedAnswers: ["sandbox", "sandboxing", "sandbox analysis"],
    explanation: "Malware often behaves differently when it senses analysis, so sandboxes detonate samples in a controlled environment to record behaviour."
  },
  {
    id: 2023,
    type: "scramble",
    difficulty: "expert",
    text: "A security capability that monitors endpoints, detects malicious behaviour and lets responders act on it.",
    options: null,
    correctAnswer: "EDR",
    acceptedAnswers: ["edr", "endpointdetectionandresponse", "endpoint detection and response"],
    explanation: "EDR records behaviour across workstations and servers, and gives responders the ability to isolate a host or kill a malicious process."
  },
  {
    id: 2024,
    type: "scramble",
    difficulty: "expert",
    text: "A platform that collects, correlates and analyses log data from across the environment to surface threats.",
    options: null,
    correctAnswer: "SIEM",
    acceptedAnswers: ["siem", "securityinformationandeventmanagement", "security information and event management"],
    explanation: "A SIEM aggregates logs from many systems, applies correlation rules and gives responders a single place to investigate alerts."
  },
  {
    id: 2025,
    type: "scramble",
    difficulty: "expert",
    text: "A public knowledge base of adversary tactics and techniques used to plan and describe real-world attack behaviour.",
    options: null,
    correctAnswer: "MITRE ATT&CK",
    acceptedAnswers: ["mitreattck", "mitre att ck", "attck", "att ck"],
    explanation: "MITRE ATT&CK is a curated matrix of tactics and techniques (TTPs) defenders use to compare incidents, build detections and run adversary emulation."
  },
  {
    id: 2026,
    type: "scramble",
    difficulty: "expert",
    text: "Following an authorised person closely through a secure door to enter a building without their knowledge.",
    options: null,
    correctAnswer: "Tailgating",
    acceptedAnswers: ["tailgating", "piggybacking"],
    explanation: "Also called piggybacking, tailgating is a physical access breach where someone slips in behind a person who badges in legitimately."
  },
  {
    id: 2027,
    type: "scramble",
    difficulty: "expert",
    text: "Phishing conducted by phone, where the attacker calls the victim and impersonates a trusted person or organisation.",
    options: null,
    correctAnswer: "Vishing",
    acceptedAnswers: ["vishing", "voice phishing"],
    explanation: "Vishing leans on urgency and authority: a fake support desk or bank caller tries to extract a code or password over the phone."
  },
  {
    id: 2028,
    type: "scramble",
    difficulty: "expert",
    text: "The practice of layering independent controls so that the failure of one layer does not expose the whole system.",
    options: null,
    correctAnswer: "Defense in Depth",
    acceptedAnswers: ["defenseindepth", "defenceindepth", "defense in depth", "defence in depth"],
    explanation: "Layered controls - network, host, application, data and human - mean a single mistake or a single compromised system is not enough to cause a breach."
  },
  {
    id: 3001,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "Registering a domain that imitates a well-known site with a close spelling variant, to catch users who mistype or are fooled.",
    options: null,
    correctAnswer: "Typosquatting",
    acceptedAnswers: ["typosquatting", "typo squatting"],
    explanation: "Typosquatting sites imitate popular brands with subtle spelling changes; they harvest credentials, payment details or malware installs."
  },
  {
    id: 3002,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "An attack that abuses a package manager by publishing a malicious package whose name a public repository resolves before the private one.",
    options: null,
    correctAnswer: "Dependency Confusion",
    acceptedAnswers: ["dependencyconfusion", "dependency confusion"],
    explanation: "If a build tool prefers the public registry over the internal one, an attacker who publishes that name can inject code straight into the build."
  },
  {
    id: 3003,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "An attack that requests service tickets for domain accounts and then cracks them offline to recover password hashes.",
    options: null,
    correctAnswer: "Kerberoasting",
    acceptedAnswers: ["kerberoasting", "kerberoast"],
    explanation: "Because any domain user can request a service ticket, Kerberoasting turns weak service account passwords into a domain compromise without noisy network traffic."
  },
  {
    id: 3004,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A well-known credential-dumping tool that extracts password hashes, tickets and plaintext secrets from Windows memory.",
    options: null,
    correctAnswer: "Mimikatz",
    acceptedAnswers: ["mimikatz"],
    explanation: "Mimikatz is used legitimately for testing and illegitimately by attackers to harvest domain administrator credentials."
  },
  {
    id: 3005,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A rogue wireless access point that impersonates a legitimate one to intercept the traffic of users who connect to it.",
    options: null,
    correctAnswer: "Evil Twin",
    acceptedAnswers: ["eviltwin", "evil twin", "rogue access point"],
    explanation: "An evil twin broadcasts the same SSID as a real network; users who join it have their traffic decrypted and captured."
  },
  {
    id: 3006,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "Forging Address Resolution Protocol replies so the attacker's machine receives traffic meant for other hosts on the same LAN.",
    options: null,
    correctAnswer: "ARP Spoofing",
    acceptedAnswers: ["arpspoofing", "arp spoofing", "arp poisoning"],
    explanation: "ARP has no authentication, so a forged reply can poison a host's cache and position the attacker in the middle of local traffic."
  },
  {
    id: 3007,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "Redirecting name resolution so users are sent to attacker-controlled addresses while believing they are visiting the real site.",
    options: null,
    correctAnswer: "DNS Hijacking",
    acceptedAnswers: ["dnshijacking", "dns hijacking", "dns poisoning"],
    explanation: "DNS hijacking can be done by compromising DNS servers, poisoning caches or abusing the router - it redirects users before TLS even starts."
  },
  {
    id: 3008,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A denial-of-service attack that floods a server with TCP connection requests and never completes the handshake.",
    options: null,
    correctAnswer: "SYN Flood",
    acceptedAnswers: ["synflood", "syn flood", "syn flood attack"],
    explanation: "Half-open connections exhaust the server's backlog, so legitimate clients cannot be served."
  },
  {
    id: 3009,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A slow denial-of-service attack that holds server connections open by trickling data just slowly enough to avoid timeouts.",
    options: null,
    correctAnswer: "Slowloris",
    acceptedAnswers: ["slowloris"],
    explanation: "Slowloris keeps worker threads busy with minimal bandwidth, defeating simple rate limits and per-connection traffic thresholds."
  },
  {
    id: 3010,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A memory-safety bug where code keeps using a pointer to memory that has already been released, often leading to code execution.",
    options: null,
    correctAnswer: "Use After Free",
    acceptedAnswers: ["useafterfree", "use after free", "uaf"],
    explanation: "The dangling pointer can be reallocated for attacker-controlled data, and the reused memory can be corrupted to hijack control flow."
  },
  {
    id: 3011,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "An XML parsing flaw that lets an attacker define external entities and make the parser read local files or fetch internal URLs.",
    options: null,
    correctAnswer: "XXE",
    acceptedAnswers: ["xxe", "xmlexternalentity", "xml external entity"],
    explanation: "XXE enables local file disclosure, SSRF and denial of service; disabling external entity resolution in the parser closes it."
  },
  {
    id: 3012,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "Turning a stream of bytes back into objects; when untrusted data is deserialized it can trigger code execution.",
    options: null,
    correctAnswer: "Deserialization",
    acceptedAnswers: ["deserialization", "insecure deserialization", "unsafe deserialization"],
    explanation: "Some formats (Java serialization, PHP objects, Python pickles) can instantiate arbitrary classes or call magic methods, so they must never be fed untrusted input."
  },
  {
    id: 3013,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A flaw where attacker input is inserted into an LDAP query, changing the filter and exposing or bypassing authentication.",
    options: null,
    correctAnswer: "LDAP Injection",
    acceptedAnswers: ["ldapinjection", "ldap injection"],
    explanation: "Like SQL injection, escaping or parameterising the LDAP filter stops a crafted string from rewriting the query's logic."
  },
  {
    id: 3014,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "Tricking a user into clicking a control on a transparent overlay that is placed on top of a legitimate page.",
    options: null,
    correctAnswer: "Clickjacking",
    acceptedAnswers: ["clickjacking", "click hijacking", "ui redress"],
    explanation: "Frames and overlays make a click land on an invisible button; the standard defence is a Content-Security-Policy frame-ancestors rule."
  },
  {
    id: 3015,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "Forcing a connection to negotiate a weaker protocol or cipher version than both sides actually support.",
    options: null,
    correctAnswer: "TLS Downgrade",
    acceptedAnswers: ["tlsdowngrade", "tls downgrade", "downgrade attack", "protocol downgrade"],
    explanation: "Downgrade attacks such as POODLE and Logjam force an old protocol version and then rely on that version's weaknesses."
  },
  {
    id: 3016,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A tamper-resistant device that generates, stores and performs cryptographic operations on keys.",
    options: null,
    correctAnswer: "HSM",
    acceptedAnswers: ["hsm", "hardwaresecuritymodule", "hardware security module"],
    explanation: "An HSM keeps private keys inside protected hardware, so they are never exposed to the host system or a memory dump."
  },
  {
    id: 3017,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A chip on the motherboard that stores platform keys and measures what boots, supporting secure boot and disk encryption.",
    options: null,
    correctAnswer: "TPM",
    acceptedAnswers: ["tpm", "trustedplatformmodule", "trusted platform module"],
    explanation: "The TPM seals disk-encryption keys to the measured boot state, so the drive cannot be decrypted outside the original machine."
  },
  {
    id: 3018,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A firmware feature that only allows the operating system to start if it is signed by a trusted key.",
    options: null,
    correctAnswer: "Secure Boot",
    acceptedAnswers: ["secureboot", "secure boot"],
    explanation: "Secure Boot blocks bootloader rootkits and unsigned kernels by verifying the signature chain at startup."
  },
  {
    id: 3019,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A decoy credential or record that, when used or opened, quietly alerts defenders that it was discovered.",
    options: null,
    correctAnswer: "Canary Token",
    acceptedAnswers: ["canarytoken", "canary token", "honeytoken", "honey token"],
    explanation: "Canary tokens reveal an intrusion faster than a real account would, because touching one triggers an immediate alert."
  },
  {
    id: 3020,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A deliberately attractive fake system that records the activity of attackers who interact with it.",
    options: null,
    correctAnswer: "Honeypot",
    acceptedAnswers: ["honeypot", "honey pot", "honeypot system"],
    explanation: "Honeypots never hold real data; their value is the attacker behaviour they record, which is used to build detection rules."
  },
  {
    id: 3021,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "Systematically probing a host's TCP or UDP ports to discover which services are exposed.",
    options: null,
    correctAnswer: "Port Scanning",
    acceptedAnswers: ["portscanning", "port scanning", "port scan"],
    explanation: "The results build a service map of the target, and unexpected open ports are a classic sign of an exposed or forgotten service."
  },
  {
    id: 3022,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A widely used open-source network scanner that discovers hosts, open ports, service versions and some vulnerabilities.",
    options: null,
    correctAnswer: "Nmap",
    acceptedAnswers: ["nmap"],
    explanation: "Nmap supports scan templates, script scanning and OS fingerprinting, so it is both a defender's tool and an attacker's."
  },
  {
    id: 3023,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A graphical network protocol analyser used to capture and inspect packets frame by frame.",
    options: null,
    correctAnswer: "Wireshark",
    acceptedAnswers: ["wireshark"],
    explanation: "Wireshark decodes hundreds of protocols, making it the go-to tool for troubleshooting traffic and for hunting indicators of compromise."
  },
  {
    id: 3024,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A precomputed table of password hashes that lets an attacker test a password far faster than cracking it algorithm by algorithm.",
    options: null,
    correctAnswer: "Rainbow Table",
    acceptedAnswers: ["raintable", "rainbow table", "rainbowtables"],
    explanation: "Rainbow tables trade memory for speed; salting and modern memory-hard hashes such as Argon2 are what make them impractical."
  },
  {
    id: 3025,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "Malware that harvests saved credentials, cookies and wallet data from a compromised browser and exfiltrates it.",
    options: null,
    correctAnswer: "Infostealer",
    acceptedAnswers: ["infostealer", "info stealer", "stealer"],
    explanation: "Infostealers are sold in bulk as logs, and because they steal session cookies they often bypass multi-factor authentication entirely."
  },
  {
    id: 3026,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "Malware that opens a controlled channel so an attacker can run commands, move files and spy on the host.",
    options: null,
    correctAnswer: "RAT",
    acceptedAnswers: ["rat", "remoteaccesstrojan", "remote access trojan"],
    explanation: "RATs are the payload behind many hands-on-keyboard intrusions, and they typically blend into normal remote-management traffic."
  },
  {
    id: 3027,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "Malicious code that installs in the boot process so it runs before the operating system and survives a reinstall.",
    options: null,
    correctAnswer: "Bootkit",
    acceptedAnswers: ["bootkit"],
    explanation: "Because it lives below the operating system, a bootkit is invisible to ordinary file scanning and can hide other malware."
  },
  {
    id: 3028,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A recurring outbound connection from an implant to its controller that often imitates normal application traffic.",
    options: null,
    correctAnswer: "Beacon",
    acceptedAnswers: ["beacon", "c2 beacon", "beaconing"],
    explanation: "Beacons are usually periodic and jittered, so a steady heartbeat to a rarely visited domain is a strong detection signal."
  },
  {
    id: 3029,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "A system kept physically separated from untrusted networks so that it cannot be reached remotely.",
    options: null,
    correctAnswer: "Air Gap",
    acceptedAnswers: ["airgap", "air gap", "airgapped", "air gapped"],
    explanation: "Air gaps reduce remote access but are not inviolable - USB devices, supply chain tampering and even acoustic or electromagnetic channels have bridged them."
  },
  {
    id: 3030,
    type: "scramble",
    difficulty: "tiebreaker",
    text: "Collected information about adversaries, their infrastructure and tactics, used to guide defensive decisions.",
    options: null,
    correctAnswer: "Threat Intelligence",
    acceptedAnswers: ["threatintelligence", "threat intelligence"],
    explanation: "Threat intelligence turns scattered indicators into context: who is attacking, why, how, and what to prioritise."
  },
  {
    id: 3031,
    type: "multiple-choice",
    difficulty: "tiebreaker",
    text: "A developer accidentally commits a .env file with live API keys to a public repository. What is the correct first response?",
    options: [
      "Revoke and rotate the exposed keys immediately, then purge them from the repository history",
      "Delete the repository and recreate it under a private account",
      "Add a .gitignore file so the file is not committed again",
      "Wait for the hosting provider to scan and remove the file automatically",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Once a secret is public it must be treated as compromised: rotating the key is the only reliable fix, because a deleted file can still exist in forks, clones and caches."
  },
  {
    id: 3032,
    type: "multiple-choice",
    difficulty: "tiebreaker",
    text: "A Windows workstation opens SMB connections to file servers it has no business contacting. What does this most likely indicate?",
    options: [
      "Lateral movement using harvested credentials or a stolen remote access tool",
      "Normal behaviour of a scheduled antivirus definition update",
      "A misconfigured screen-saver timeout on the workstation",
      "An expired software licence on the file servers",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Unexpected SMB traffic between peers is a classic sign of an attacker pivoting through the network; the credentials involved should be treated as stolen."
  },
  {
    id: 3033,
    type: "multiple-choice",
    difficulty: "tiebreaker",
    text: "A signed application loads an unsigned library from a writable directory. What attack does this suggest?",
    options: [
      "DLL search-order hijacking, where attacker-controlled code runs inside the trusted process",
      "A normal debug build that skipped code signing checks",
      "A failed antivirus update that left the file unscanned",
      "An expired code-signing certificate on the build server",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Unsigned or writable-path libraries let an attacker run code inside a signed, trusted process, which defeats allow-listing and signature checks."
  },
  {
    id: 3034,
    type: "multiple-choice",
    difficulty: "tiebreaker",
    text: "Authentication logs show tens of thousands of failed logins for one account across unrelated sites, followed by a success. What is happening?",
    options: [
      "Credential stuffing using a password list leaked from another breach",
      "A brute-force attack on a single firewall device",
      "A misconfigured monitoring agent retrying an expired credential",
      "A scheduled backup client with an outdated key",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "The scale and the spread across unrelated targets are the giveaway: the same username and password pairs are being replayed at scale, so multi-factor authentication is the primary defence."
  },
  {
    id: 3035,
    type: "multiple-choice",
    difficulty: "tiebreaker",
    text: "Guest Wi-Fi clients can reach the internal server subnet directly. Which control is missing?",
    options: [
      "Network segmentation between the guest network and internal systems",
      "Endpoint antivirus on the guest laptops",
      "A longer password policy for guest accounts",
      "Full-disk encryption on the file servers",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Guest and internal networks should be separated by firewalls or VLANs with deny-by-default rules; otherwise anyone on the guest SSID can reach servers directly."
  },
  {
    id: 3036,
    type: "multiple-choice",
    difficulty: "tiebreaker",
    text: "An endpoint on the accounting VLAN contacts a rarely visited domain every 60 seconds with a small encrypted payload. What is the most likely explanation?",
    options: [
      "Command-and-control beaconing from an implant",
      "A scheduled software update check from a vendor CDN",
      "A misconfigured DNS resolver retrying a lookup",
      "Telemetry from the operating system's crash reporter",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Regular, small, periodic outbound connections to a low-reputation domain are the classic shape of implant beaconing, which is why egress logging matters as much as perimeter defence."
  },
  {
    id: 3037,
    type: "multiple-choice",
    difficulty: "tiebreaker",
    text: "A nightly backup job reports success, but restoring the latest snapshot proves the data is six months old. Which control is missing?",
    options: [
      "Restore testing and monitoring of the actual age of the newest restorable copy",
      "A second backup target in a different building",
      "Encryption of the backup volume at rest",
      "A larger retention window on the backup server",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "A backup that has never been restored is only a hope. Regular restore tests and alerts on the age of the newest copy turn successful backups into real recoverability."
  },
  {
    id: 3038,
    type: "multiple-choice",
    difficulty: "tiebreaker",
    text: "A contractor arrives with a personal laptop that has full administrator rights and no disk encryption. Which principle is being violated?",
    options: [
      "Least privilege and device trust for third-party access",
      "The separation of development and production environments",
      "The principle of two-person integrity for all changes",
      "The requirement for hardware-based key storage",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Third parties should get the minimum access needed, on a managed and encrypted device, for a limited time. Full admin rights on an unmanaged personal laptop makes exfiltration and lateral movement trivial."
  },
  {
    id: 3039,
    type: "multiple-choice",
    difficulty: "tiebreaker",
    text: "A web application returns a full stack trace, including server file paths, to any visitor. What is the risk and the fix?",
    options: [
      "Information disclosure that aids further attacks; suppress details and log them server-side",
      "A slow denial of service that the trace itself causes; add caching",
      "A broken TLS certificate that should be renewed",
      "A missing password policy on the affected route",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Stack traces reveal frameworks, paths and occasionally credentials. Returning a generic error page while logging the detail server-side keeps the troubleshooting value without handing the attacker a map."
  },
  {
    id: 3040,
    type: "multiple-choice",
    difficulty: "tiebreaker",
    text: "A shared administrator account has multi-factor authentication disabled so that several people can log in. What is the biggest problem?",
    options: [
      "Shared credentials break attribution and remove the second factor for every user",
      "The account will exceed its licence limit over time",
      "Multi-factor authentication is slower than password-only login",
      "Shared accounts cannot be backed up properly",
    ],
    correctAnswer: 0,
    acceptedAnswers: [],
    explanation: "Shared accounts destroy accountability - every action is unattributable - and disabling the second factor means one leaked password is enough to reach the account."
  }
];
