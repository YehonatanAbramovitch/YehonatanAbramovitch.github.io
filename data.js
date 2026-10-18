// ============================================================
//  EDIT THIS FILE ONLY - all site content lives here.
// ============================================================
const SITE = {
  name: "Yehonatan Abramovitch",
  role: "Computer Science Student & Developer",
  tagline: "Building software. Solving problems. Always learning.",
  status: "Open to student developer roles", // small tag above the greeting; leave empty to hide it
  email: "yona132132@gmail.com",
  cvFile: "cv.pdf?v=3", // put your CV PDF next to index.html with this name
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
    "Development": ["Data Structures & Algorithms", "Git", "Docker", "CMake"],
    "AI & ML Foundations": ["Machine Learning", "Neural networks", "Claude Code", "AI-assisted dev"],
    "Systems & Networking": ["Linux", "TCP/IP", "Grafana", "Zabbix"],
  },

  projects: [
    {
      id: "gmail",
      title: "Gmail-Like Full-Stack Web & Mobile Application",
      // short name and one-sentence summary for the project card on the home page
      short: "Gmail-like email platform",
      summary: "An email app with a React web client, an Android app and a Node.js API, plus a C++ service that filters malicious URLs.",
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
        interactive: "bloom", // adds a "Try it" tab with the live Bloom filter (demos.js)
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
      id: "elevator",
      title: "Multi-Elevator AI: Reinforcement-Learning Elevator Lab",
      short: "Multi-Elevator AI",
      summary: "A reinforcement-learning elevator controller that learns hidden success rates and rewards while planning with A*, in a live browser lab.",
      bullets: [
        "Controller that learns hidden success probabilities and rewards online and plans with weighted A*.",
        "Browser lab where you design a building, hide its dynamics and watch the controller learn them.",
        "JavaScript port verified against the Python original: all 27,000 actions match.",
      ],
      tags: ["Python", "JavaScript", "Reinforcement Learning", "A* Search", "Web Workers"],
      github: "https://github.com/YehonatanAbramovitch/Multi-Elevator-Ai",
      demo: "",
      video: { src: "images/elevator-run.mp4", poster: "images/elevator-run-poster.jpg", fit: "contain", bg: "#11141a" },
      images: [
        { src: "images/elevator-2-running-e5_hard.jpg", caption: "Mid-run on e5_hard: a failed move triggers a replan while the estimates close in on the hidden values" },
        { src: "images/elevator-3-finished-e5_hard.jpg", caption: "Everyone delivered in 20 steps; the random policy didn't finish in 500" },
        { src: "images/elevator-4-benchmark-e5_hard.jpg", caption: "Comparison over 10 seeds: the controller finishes 10/10, the random policy 0/10" },
        { src: "images/elevator-5-full-budget-rl_med.jpg", caption: "Full step budget on rl_med: the controller switches to delivering only the most profitable person" },
        { src: "images/elevator-1-input-m4_hard.jpg", caption: "The input view on one screen (m4_hard): the building, the hidden world and how the run ends" },
      ],
      details: {
        meta: ["Course project · Intro to AI", "Python + JavaScript", "Live browser lab"],
        interactive: "embed", // the "Try it" tab shows the live lab inside the page
        embedUrl: "https://yehonatanabramovitch.github.io/Multi-Elevator-Ai/",
        problem: "Several elevators serve a building. Each reaches only some floors and has a weight limit, so some people must switch elevators on a shared floor. Actions can fail: an elevator may land on a random floor, a person may fail to board or exit, and every delivery pays a random reward. The controller sees the building but not the success rates or the rewards, and every action costs one step out of a fixed budget. It has to learn the hidden world while it is already working in it.",
        solution: "A controller that combines online learning with planning. After every action it checks what actually happened and updates success counts for each elevator and person, estimating every success rate as a Beta-posterior mean. Deliveries it hasn't seen yet are assumed to be valuable, so it explores them until real rewards replace the guess. On top of these estimates it plans with a weighted A* search in which an action that succeeds with probability p costs 1/p steps, and it replans when something fails or every few steps so new estimates get used. A browser lab runs a JavaScript port of the controller: you build a building, hide its dynamics, and watch the estimates converge to the true values while it delivers people, next to a random policy on the same world.",
        architecture: {
          text: "The algorithm was written in Python for the course environment. The lab runs a JavaScript port of the controller together with a copy of the environment's rules, inside a Web Worker so long A* searches never freeze the animation.",
          layers: [
            [
              { name: "Lab interface", tech: "HTML · CSS · JavaScript", note: "building editor, playback, charts" },
            ],
            [
              { name: "Web Worker", tech: "JavaScript", note: "runs the simulation off the main thread" },
            ],
            [
              { name: "Controller", tech: "core.js · port of controller.py", note: "online estimates + weighted A*" },
              { name: "Environment", tech: "port of the course rules", note: "elevators, failures, rewards" },
            ],
          ],
        },
        features: [
          "Design the building: floors, elevators (reachable floors, capacity) and people, or start from one of 36 course problems",
          "Hide the world: each elevator's and person's success chance and each delivery's possible rewards",
          "Side panel with the chosen action, whether it worked, and the next steps of the A* plan",
          "Every hidden number shown next to the controller's current estimate as it converges",
          "Cumulative reward compared with a random policy on the same world and seed",
          "One-click comparison averaging 10 runs against the random policy",
          "Two run modes: stop when everyone has arrived, or run the full step budget as in the assignment",
        ],
        challenges: [
          {
            challenge: "Planning with success rates it has never been told.",
            solution: "Every elevator and person keeps success/attempt counts, and each rate is estimated as the Beta-posterior mean (s+1)/(n+2). The planner turns a rate p into a cost of 1/p steps. The estimate is deterministic rather than sampled, so frequent replans after failures keep choosing a consistent route instead of thrashing.",
          },
          {
            challenge: "Finding out which deliveries are worth the most.",
            solution: "A person it hasn't delivered yet is assumed to be worth max(bonus, 1), so unexplored deliveries look attractive until real rewards replace the guess. In the full-budget mode it also compares delivering everyone with repeatedly delivering only the most profitable person, and switches strategy as its estimates change.",
          },
          {
            challenge: "A bug that hid the last person's reward.",
            solution: "When the last person of a round is delivered the building resets at once, so they reappear instead of disappearing, and the controller never noticed that delivery. Recognizing a delivery from the reward itself fixed it. Across 36 problems × 30 seeds, 24 problems improved, none got worse, and total reward rose by 5.6% (up to +70% on the hardest one).",
          },
          {
            challenge: "Proving the browser version behaves exactly like the Python one.",
            solution: "A script records the Python controller's observations and actions, and the JavaScript controller is fed the same observations. On all 36 problems × 2 seeds, all 27,000 actions match.",
          },
          {
            challenge: "Matching Python's tie-breaking.",
            solution: "Python iterates sets of floors in hash-table order (for example {2,4,6,8} comes out as 8,2,4,6), which decides ties in the search. The port reproduces CPython's set order; it matches on every set in the 36 problems and on 3,000 random sets.",
          },
        ],
      },
    },
    {
      id: "arkanoid",
      title: "Enhanced Arkanoid Game",
      short: "Enhanced Arkanoid",
      summary: "A Java brick-breaker built around reusable interfaces, collision detection and event-driven game rules.",
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
        interactive: "arkanoid", // adds a "Try it" tab with the game (demos.js)
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
      title: "Sergeant, Communications Security & Encryption Team Lead",
      place: "Artillery Corps - Brigade C4I Department",
      bullets: [
        "Led a team of soldiers in the brigade's communications security section, responsible for the brigade's encrypted communication equipment.",
        "Mapped and encrypted the brigade's communication devices, and configured military Motorola radios by loading SIM and crypto keys.",
      ],
    },
  ],
};
