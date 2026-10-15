// ============================================================
//  EDIT THIS FILE ONLY - all site content lives here.
// ============================================================
const SITE = {
  name: "Yehonatan Abramovitch",
  role: "Computer Science Student & Developer",
  tagline: "Building software. Solving problems. Always learning.",
  email: "yona132132@gmail.com",
  cvFile: "cv.pdf", // put your CV PDF next to index.html with this name
  photo: "",        // e.g. "me.jpg" - leave empty to show initials
  socials: {
    github: "https://github.com/YehonatanAbramovitch",
    linkedin: "https://www.linkedin.com/in/yehonatan-abramovitch",
  },

  about: [
    "I'm a Computer Science student at Bar-Ilan University who enjoys the entire process of building software - from designing the architecture and writing the code to debugging problems and figuring out how to make things work better.",
    "Alongside my studies, I work as a NOC Analyst at WeCom, monitoring live telecom systems, investigating alerts, and troubleshooting network incidents. This experience has taught me the importance of reliability, attention to detail, and staying focused when solving problems under pressure.",
    "My projects range from a full-stack email application with a C++ Bloom Filter component to a Java arcade game built using object-oriented design principles. Before university, I served as a Sergeant in the Artillery Corps' C4I unit, working with encrypted communication systems.",
    "I'm always curious about how things work, eager to learn new technologies, and motivated by challenging problems. I'm looking for an opportunity to contribute to meaningful projects and continue growing as a software developer.",
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
      id: "gmail",
      title: "Gmail-Like Full-Stack Web & Mobile Application",
      bullets: [
        "Built the front end with React and JavaScript and the backend with Node.js/Express, using MongoDB for persistence.",
        "Designed and implemented 15+ REST API endpoints for users, mails, labels, and authentication.",
        "Implemented a two-step login flow (email, then password) with JWT-signed tokens.",
        "Implemented blacklist and Bloom Filter logic for URL validation, using multiple hash functions for space-efficient probabilistic membership checks.",
        "Used Claude Code for AI-assisted development, debugging, testing, and analysis.",
      ],
      tags: ["React", "Node.js", "Express", "MongoDB", "JWT", "C++", "Android", "Docker"],
      github: "https://github.com/YehonatanAbramovitch/Gmail",
      demo: "",
      // short muted demo clip shown on the card and project page
      // card (optional): a different clip for the project card; fit: "contain" shows the whole frame on the card
      video: { src: "images/gmail-demo.mp4", poster: "images/gmail-demo-poster.jpg", fit: "contain", bg: "#f8fafd" },
      // images: list of { src, caption } - the first one is the card cover
      images: [
        { src: "images/mail-compose.jpg", caption: "Inbox & compose new email" },
        { src: "images/mail-search.jpg", caption: "Search results across mail" },
        { src: "images/mail-welcome.jpg", caption: "Welcome screen" },
        { src: "images/mail-register.jpg", caption: "Registration - choose an address" },
        { src: "images/mail-password.jpg", caption: "Registration - password setup" },
      ],
      details: {
        meta: ["Team project · 3 developers", "Web + Android", "Dockerized"],
        problem: "Email is one of the most-used applications in the world, and also a main channel for phishing and malicious links. The goal was to build a complete Gmail-like platform - accounts, inbox, labels, drafts and search across web and mobile - that also protects users by blocking known-malicious URLs before a message is ever delivered, without slowing the system down.",
        solution: "A multi-service system: a React web client and a native Android client talk to a Node.js/Express REST API backed by MongoDB. Every outgoing message is scanned by a dedicated C++ filtering server that keeps a Bloom filter of blacklisted URLs: checking a URL costs a fixed number of hash lookups, and only possible matches are confirmed against the exact blacklist. When a user marks a mail as spam, its URLs are added to the blacklist and blocked for everyone from then on. The backend and the web app run with a single docker compose command.",
        architecture: {
          text: "Four Docker services on one network - the React web app, the REST API, MongoDB and the C++ filter server - plus a native Android client that uses the same API. The API talks to the filter over a small custom text protocol on top of TCP.",
          layers: [
            [
              { name: "React Web App", tech: "React · JavaScript", note: "port 3000" },
              { name: "Android App", tech: "Java · Android SDK", note: "API 33+ · outside Docker" },
            ],
            [
              { name: "REST API Server", tech: "Node.js · Express · JWT", note: "18 endpoints · port 3050" },
            ],
            [
              { name: "MongoDB", tech: "Mongoose · Docker volume", note: "users, mails, labels" },
              { name: "URL Filter Server", tech: "C++ · TCP sockets · threads", note: "Bloom filter + blacklist" },
            ],
          ],
        },
        features: [
          "Multi-step registration with email-availability check, password setup and profile picture",
          "Two-step login (email, then password) issuing a JWT-signed user token",
          "Inbox, Sent, Drafts, All Mail, Spam and Trash categories",
          "Compose to multiple recipients, with drafts saved automatically on close",
          "Custom labels - create, rename, delete and apply to messages",
          "Search across subject and body of all your mail",
          "Report as spam → the mail's URLs are blacklisted and blocked in future messages",
          "Native Android client sharing the same backend",
        ],
        challenges: [
          {
            challenge: "Checking every URL in every message against a growing blacklist, fast and with little memory.",
            solution: "Implemented a Bloom filter in C++ over a configurable bit array with multiple hash functions (repeated std::hash). Each check costs k hash lookups; URLs the filter rules out never touch the blacklist, and possible matches are confirmed against the exact list so a false positive doesn't block a legitimate mail. The trade-off: with a fixed-size bit array, the false-positive rate rises as more URLs are added, and confirmations use a linear search.",
          },
          {
            challenge: "Many clients reading and updating the same filter at the same time.",
            solution: "The C++ server accepts each TCP connection on its own thread. Shared state is guarded by a mutex and persisted to file storage, and every command reloads the latest state, so all connections see a consistent blacklist. It's a simple approach that favors consistency over throughput: every command pays for file I/O and waits for a lock shared by all connections.",
          },
          {
            challenge: "Connecting a Node.js API to a C++ service.",
            solution: "Designed a lightweight line-based protocol over TCP (an initialization line with the filter size and hash settings, then POST / GET / DELETE commands) returning HTTP-style status codes, wrapped in Promises on the Node side.",
          },
          {
            challenge: "Keeping the C++ code testable and extensible.",
            solution: "Built it around interfaces and factories - parsers, commands, storage, output and formatters are all swappable - which made it possible to unit-test every component with GoogleTest and CMake.",
          },
          {
            challenge: "Running four services reliably on any machine.",
            solution: "Containerized every service with its own Dockerfile and wired them together with Docker Compose on a shared bridge network, with a persistent volume for MongoDB.",
          },
        ],
      },
    },
    {
      id: "arkanoid",
      title: "Enhanced Arkanoid Game",
      bullets: [
        "Built and refactored the game in Java using OOP principles and reusable design patterns.",
        "Implemented collision detection, game logic, levels, sprites, and event-driven interactions.",
        "Improved modularity and runtime stability by separating game entities and responsibilities.",
      ],
      tags: ["Java", "OOP", "Design Patterns", "Game Dev"],
      github: "https://github.com/YehonatanAbramovitch/Arkanoid-Game",
      demo: "",
      video: { src: "images/arkanoid-demo.mp4", poster: "images/arkanoid-demo-poster.jpg", fit: "contain", bg: "#3c3c3c" },
      images: [
        { src: "images/arkanoid-start.jpg", caption: "Game initialization - multi-ball level" },
        { src: "images/arkanoid-play.jpg", caption: "Collision detection & score logic" },
      ],
      details: {
        meta: ["Solo project", "Java desktop game", "60 FPS target"],
        problem: "A brick-breaker game looks simple, but it is a great test of software design: many objects moving and colliding every frame, events that change the game state, and rules that must stay correct at high speed. The challenge was to build it so that adding new objects, behaviors or rules doesn't mean rewriting the game.",
        solution: "A clean, object-oriented Arkanoid in Java. Everything on screen is a Sprite, everything you can hit is a Collidable, and game rules (removing blocks, losing balls, scoring) are separate listeners that react to hit events instead of being hard-coded into the objects. Geometry, physics, objects and game rules each live in their own package.",
        architecture: {
          text: "Five packages with one responsibility each. The game loop only knows the interfaces; game rules subscribe to hit events (Observer pattern).",
          layers: [
            [
              { name: "GameMain", tech: "Game · game loop", note: "initializes level, runs at 60 FPS" },
            ],
            [
              { name: "Objects", tech: "Sprite · Collidable", note: "Ball, Block, Paddle, GameEnvironment" },
              { name: "GameUpdating", tech: "HitListener implementations", note: "BlockRemover, BallRemover, Score" },
            ],
            [
              { name: "MovingAndMechanics", tech: "Velocity · CollisionInfo", note: "HitNotifier / HitListener" },
              { name: "GeometricPrimitives", tech: "Point · Line · Rectangle", note: "intersections & math" },
            ],
          ],
        },
        features: [
          "Multiple balls in play at once, each with its own velocity",
          "Keyboard-controlled paddle with 5 hit regions that change the bounce angle",
          "Pyramid of colored blocks that disappear when hit",
          "Live score indicator, with a bonus for clearing the level",
          "Game ends when all blocks are cleared or all balls are lost",
          "Animation loop targeting 60 FPS",
        ],
        challenges: [
          {
            challenge: "Fast balls passing through thin blocks between frames (\"tunneling\").",
            solution: "Each step, the ball's movement is treated as a line segment from its current to its next position. The game finds the closest intersection with any collidable's rectangle and places the ball just before that point. Compared with checking only the ball's final position, this greatly reduces balls slipping through thin blocks.",
          },
          {
            challenge: "Making the paddle feel controllable instead of a flat mirror.",
            solution: "Split the paddle into five regions; each returns a new velocity at a different angle (Velocity.fromAngleAndSpeed), so the player can aim the ball.",
          },
          {
            challenge: "Removing blocks and balls while the game is iterating over them.",
            solution: "Sprites and hit listeners are iterated over copies of their lists, so objects can safely remove themselves during a hit event.",
          },
          {
            challenge: "Keeping game rules out of the game objects.",
            solution: "Applied the Observer pattern: blocks notify HitListeners, and separate classes handle removing blocks, removing balls and updating the score - new rules can be added without touching Ball or Block.",
          },
          {
            challenge: "Keeping the animation smooth.",
            solution: "The loop targets 60 frames per second: it measures how long each frame took and sleeps only for the time left. If a frame takes longer than its 16 ms budget, that frame simply runs late.",
          },
        ],
      },
    },
  ],

  experience: [
    {
      when: "2026 - Present",
      title: "NOC Analyst",
      place: "WeCom",
      bullets: [
        "Monitor network performance and system availability using Grafana and Zabbix.",
        "Triage real-time alerts, connectivity failures, and infrastructure issues in a live telecommunications production environment.",
        "Apply structured debugging and failure-pattern analysis to identify root causes, resolve incidents, and escalate issues while maintaining service reliability.",
      ],
    },
    {
      when: "2023 - 2027 (expected)",
      title: "B.Sc. Computer Science",
      place: "Bar-Ilan University",
      text: "An expanded Computer Science program at Bar-Ilan University, covering the theoretical and practical foundations of computing, including algorithms, software development, computer systems, and mathematics.",
      bullets: [
        "Core CS: Introduction to Computer Science, Data Structures, Algorithms, Object-Oriented Programming, Programming Languages, Automata and Formal Languages, Computability and Complexity, Project Lab",
        "Systems: Operating Systems, Computer Architecture, Advanced System Programming, Database Systems, Safe Programming",
        "AI & Data: Machine Learning, Statistical Methods in Computer Science, Ethics and AI",
        "Math: Discrete Mathematics, Discrete Structures, Linear Algebra I & II, Calculus I & II, Probability, Mathematical Logic, Algebraic Structures, Number Theory",
        "Course projects include the Gmail-like platform (team, Advanced System Programming) and the Arkanoid game (Object-Oriented Programming)",
      ],
    },
    {
      when: "2017 - 2020",
      title: "Sergeant, C4I Department",
      place: "IDF Artillery Corps",
      text: "Managed embedded computing, electronics and encrypted wireless communication systems in mission-critical, real-time military environments.",
    },
  ],
};
