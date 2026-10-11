// ============================================================
//  EDIT THIS FILE ONLY — all site content lives here.
// ============================================================
const SITE = {
  name: "Yehonatan Abramovitch",
  role: "Computer Science Student & Developer",
  tagline: "From kernel schedulers to full-stack apps — I combine low-level systems knowledge with hands-on production experience.",
  email: "yona132132@gmail.com",
  cvFile: "cv.pdf", // put your CV PDF next to index.html with this name
  photo: "",        // e.g. "me.jpg" — leave empty to show initials
  socials: {
    github: "https://github.com/YehonatanAbramovitch",
    linkedin: "https://www.linkedin.com/in/yehonatan-abramovitch",
  },

  about: [
    "I'm a Computer Science student at Bar-Ilan University (graduating 2027), with strong foundations in Operating Systems, Data Structures & Algorithms, Computer Networks and Object-Oriented Programming.",
    "Today I troubleshoot live telecom infrastructure as a NOC Analyst at WeCom. Before that, I served as a Sergeant in the Artillery Corps' C4I department, managing embedded, electronic and encrypted communication systems in real-time environments.",
    "I work with AI-assisted development workflows (Claude Code, Cursor) for architecture, test automation and data analysis.",
  ],

  skills: {
    "Languages": ["Python", "C++", "C", "Java", "JavaScript"],
    "Systems & OS": ["Linux", "xv6 kernel", "Multitasking OS", "Embedded Systems"],
    "Networking & Security": ["TCP/IP", "OSI Model", "Encryption", "JWT Auth", "Monitoring"],
    "DevOps & Tools": ["Git", "GitHub", "CI/CD", "REST APIs", "JetBrains", "VS Code"],
    "AI & Applied": ["Claude Code", "Cursor", "Test Automation", "Log Analysis", "Root Cause Analysis"],
  },

  projects: [
    {
      title: "Priority Scheduler (xv6)",
      description: "Modified the xv6 kernel to implement a priority-based process scheduler, including Process Control Block changes and OS-level debugging of resource management, MMU and system calls.",
      tags: ["C", "xv6", "Operating Systems", "Kernel"],
      github: "",
      demo: "",
      image: "",
    },
    {
      title: "Full-Stack Security App",
      description: "A secure web/mobile application with JWT authentication and email verification, 15+ REST API endpoints and optimized MongoDB schemas. Built with Claude Code for architecture and automated testing.",
      tags: ["JavaScript", "REST API", "MongoDB", "JWT"],
      github: "",
      demo: "",
      image: "",
    },
    {
      title: "Enhanced Arkanoid",
      description: "A Java Arkanoid game refactored with advanced OOP design patterns, with optimized physics and collision detection for stable frame rates — from algorithmic design to deployment.",
      tags: ["Java", "OOP", "Design Patterns"],
      github: "",
      demo: "",
      image: "",
    },
  ],

  experience: [
    {
      when: "2026 — Present",
      title: "NOC Analyst",
      place: "WeCom",
      text: "Monitor network performance and availability, and troubleshoot real-time connectivity and infrastructure issues across telecom infrastructure using failure-pattern recognition.",
    },
    {
      when: "2023 — 2027",
      title: "B.Sc. Computer Science",
      place: "Bar-Ilan University",
      text: "Operating Systems, Data Structures & Algorithms, Computer Networks, Object-Oriented Programming.",
    },
    {
      when: "2017 — 2020",
      title: "Sergeant, C4I Department",
      place: "IDF Artillery Corps",
      text: "Managed embedded computing, electronics and encrypted wireless communication systems in mission-critical, real-time environments.",
    },
  ],
};
