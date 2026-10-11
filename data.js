// ============================================================
//  EDIT THIS FILE ONLY — all site content lives here.
// ============================================================
const SITE = {
  name: "Yehonatan Abramovitch",
  role: "Computer Science Student & Developer",
  tagline: "I build full-stack applications and Java projects — and keep live telecom production systems running.",
  email: "yona132132@gmail.com",
  cvFile: "cv.pdf", // put your CV PDF next to index.html with this name
  photo: "",        // e.g. "me.jpg" — leave empty to show initials
  socials: {
    github: "https://github.com/YehonatanAbramovitch",
    linkedin: "https://www.linkedin.com/in/yehonatan-abramovitch",
  },

  about: [
    "I'm a Computer Science student at Bar-Ilan University (expected graduation 2027), with experience building full-stack applications and Java projects, alongside monitoring live telecom production systems as a NOC Analyst at WeCom.",
    "I have strong foundations in Data Structures & Algorithms, OOP, Operating Systems, networking and Machine Learning fundamentals. I've built REST APIs, authentication flows and a C++ Bloom Filter component.",
    "Before university, I served as a Sergeant in the Artillery Corps' C4I department, managing embedded computing, electronics and encrypted wireless communication systems in mission-critical, real-time environments.",
  ],

  skills: {
    "Languages": ["Python", "C++", "C", "Java", "JavaScript"],
    "Software & Web": ["React", "Node.js/Express", "REST APIs", "MongoDB", "JWT", "OOP"],
    "Development & Testing": ["Data Structures & Algorithms", "Git", "Docker", "CMake", "GoogleTest", "Unit testing"],
    "AI & ML Foundations": ["Machine Learning", "Neural networks", "Claude Code", "AI-assisted dev"],
    "Systems & Networking": ["Linux", "TCP/IP", "Grafana", "Zabbix", "Incident triage", "Production troubleshooting"],
  },

  projects: [
    {
      title: "Gmail-Like Full-Stack App",
      description: "A web & mobile email application with a React front end and a Node.js/Express backend on MongoDB. 15+ REST API endpoints for users, mails, labels and authentication; two-step authentication with JWT and email verification; and URL validation via a blacklist and a Bloom Filter with multiple hash functions. Built with Claude Code for AI-assisted development, debugging and testing.",
      tags: ["React", "Node.js", "Express", "MongoDB", "JWT", "C++", "Android", "Docker"],
      github: "https://github.com/YehonatanAbramovitch/Gmail",
      demo: "",
      // images: list of { src, caption } — the first one is the card cover
      images: [
        { src: "images/mail-compose.jpg", caption: "Inbox & compose new email" },
        { src: "images/mail-search.jpg", caption: "Search results across mail" },
        { src: "images/mail-welcome.jpg", caption: "Welcome screen" },
        { src: "images/mail-register.jpg", caption: "Registration — choose an address" },
        { src: "images/mail-password.jpg", caption: "Registration — password setup" },
      ],
    },
    {
      title: "Enhanced Arkanoid (Java)",
      description: "An Arkanoid game built and refactored in Java using OOP principles and reusable design patterns. Implemented collision detection, game logic, levels, sprites and event-driven interactions, and improved modularity and runtime stability by separating game entities and responsibilities.",
      tags: ["Java", "OOP", "Design Patterns", "Game Dev"],
      github: "https://github.com/YehonatanAbramovitch/Akanoid-Game",
      demo: "",
      images: [
        { src: "images/arkanoid-start.jpg", caption: "Game initialization — multi-ball level" },
        { src: "images/arkanoid-play.jpg", caption: "Collision detection & score logic" },
      ],
    },
  ],

  experience: [
    {
      when: "2026 — Present",
      title: "NOC Analyst",
      place: "WeCom",
      text: "Monitor network performance and system availability using Grafana and Zabbix. Triage real-time alerts, connectivity failures and infrastructure issues in a live telecom production environment, applying structured debugging and failure-pattern analysis to find root causes, resolve incidents and escalate while maintaining service reliability.",
    },
    {
      when: "2023 — 2027 (expected)",
      title: "B.Sc. Computer Science",
      place: "Bar-Ilan University",
      text: "Data Structures & Algorithms, OOP, Operating Systems, networking, Machine Learning.",
    },
    {
      when: "2017 — 2020",
      title: "Sergeant, C4I Department",
      place: "IDF Artillery Corps",
      text: "Managed embedded computing, electronics and encrypted wireless communication systems in mission-critical, real-time military environments.",
    },
  ],
};
