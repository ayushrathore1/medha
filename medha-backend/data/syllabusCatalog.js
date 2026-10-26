/**
 * Curated syllabus catalog containing structured units, topics, and YouTube lectures.
 * Used by the search engine for instant, structured matching alongside MongoDB database models.
 */

const SYLLABUS_CATALOG = {
  // ─── 4th Semester ───────────────────────────────────────────
  "Discrete Mathematics Structure": {
    semester: 4,
    code: "4CS2-01",
    department: "Computer Science & Engineering",
    units: [
      {
        unitNumber: 1,
        title: "Introduction to Discrete Mathematics",
        topics: ["Objective, scope and outcome of the course", "Foundations of discrete structures"],
        videos: [
          {
            videoId: "wGLTV8MgLlA",
            title: "Discrete Mathematics | Overview & Concept Of SET Theory By Dr.Gajendra Purohit",
            thumbnail: "https://i.ytimg.com/vi/wGLTV8MgLlA/mqdefault.jpg",
            duration: "25m 30s",
            channelTitle: "Dr.Gajendra Purohit",
          },
        ],
      },
      {
        unitNumber: 2,
        title: "Set Theory, Relations & Functions",
        topics: [
          "Definition of sets",
          "Countable and uncountable sets",
          "Set operations, Partition of set",
          "Cardinality (Inclusion-Exclusion & Addition Principles)",
          "Venn Diagrams",
          "Definition & types of relations",
          "Composition of relations",
          "Equivalence relation, Partial ordering relation",
          "Job-Scheduling problem",
          "Functions: one to one, into, onto",
          "Inverse function, Composition of functions",
          "Recursively defined functions",
          "Pigeonhole principle",
          "Mathematical induction, Proof by contradiction",
        ],
        videos: [
          {
            videoId: "1lDfp1j9yzA",
            title: "Principle of Mathematical Induction | Discrete Mathematics Lecture 2",
            thumbnail: "https://i.ytimg.com/vi/1lDfp1j9yzA/mqdefault.jpg",
            duration: "19m 45s",
            channelTitle: "Dr.Gajendra Purohit",
          },
          {
            videoId: "2QsVqsPrlm8",
            title: "VENN DIAGRAM Concept | Principle of Inclusion & Exclusion",
            thumbnail: "https://i.ytimg.com/vi/2QsVqsPrlm8/mqdefault.jpg",
            duration: "21m 10s",
            channelTitle: "Dr.Gajendra Purohit",
          },
          {
            videoId: "XDSO-lVDFxQ",
            title: "Relation Concept | Domain & Range | Equivalence Relation",
            thumbnail: "https://i.ytimg.com/vi/XDSO-lVDFxQ/mqdefault.jpg",
            duration: "20m 05s",
            channelTitle: "Dr.Gajendra Purohit",
          },
          {
            videoId: "a-O-ioYy1rI",
            title: "What is Pigeon Hole Principle | Discrete Mathematics Lecture 7",
            thumbnail: "https://i.ytimg.com/vi/a-O-ioYy1rI/mqdefault.jpg",
            duration: "11m 40s",
            channelTitle: "Dr.Gajendra Purohit",
          },
          {
            videoId: "UCcaU7a5P-o",
            title: "Domain & Range Of Function | One-One and Onto Function | Lecture 8",
            thumbnail: "https://i.ytimg.com/vi/UCcaU7a5P-o/mqdefault.jpg",
            duration: "23m 15s",
            channelTitle: "Dr.Gajendra Purohit",
          },
        ],
      },
      {
        unitNumber: 3,
        title: "Propositional Logic & Proofs",
        topics: [
          "Propositional logic",
          "Truth tables, Tautology, Contradiction",
          "Logical equivalence",
          "Algebra of propositions",
          "Predicates and quantifiers",
          "Rules of inference",
          "Direct proof, Proof by contraposition",
        ],
        videos: [
          {
            videoId: "xlUFkM4PEiU",
            title: "Propositional Logic in Discrete Mathematics | Truth Table & Connectives",
            thumbnail: "https://i.ytimg.com/vi/xlUFkM4PEiU/mqdefault.jpg",
            duration: "22m 14s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 4,
        title: "Algebraic Structures & Group Theory",
        topics: [
          "Algebraic systems, Semi groups and Monoids",
          "Groups, Subgroups, Cosets",
          "Lagrange's Theorem",
          "Homomorphism and Isomorphism of Groups",
          "Rings, Integral Domains and Fields",
        ],
        videos: [
          {
            videoId: "n3uM8Hvh9w8",
            title: "Group Theory in Discrete Mathematics | Semigroup, Monoid, Group, Abelian Group",
            thumbnail: "https://i.ytimg.com/vi/n3uM8Hvh9w8/mqdefault.jpg",
            duration: "28m 40s",
            channelTitle: "Dr.Gajendra Purohit",
          },
        ],
      },
      {
        unitNumber: 5,
        title: "Posets, Lattices & Boolean Algebra",
        topics: [
          "Partial order relations and Hasse diagrams",
          "Lattices as Posets and algebraic systems",
          "Properties of Lattices: Complete, Bounded, Complemented, Modular, Distributive",
          "Boolean algebra definition and representation",
        ],
        videos: [
          {
            videoId: "1G9nOQk4k4E",
            title: "Hasse Diagram in Discrete Mathematics | POSET & Examples",
            thumbnail: "https://i.ytimg.com/vi/1G9nOQk4k4E/mqdefault.jpg",
            duration: "18m 50s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 6,
        title: "Graph Theory & Trees",
        topics: [
          "Graphs and Graph models",
          "Isomorphism of graphs",
          "Euler and Hamiltonian paths and circuits",
          "Trees, Spanning trees, Minimal spanning trees",
          "Planar graphs and Graph coloring",
        ],
        videos: [
          {
            videoId: "m9msQ4Q91hE",
            title: "Introduction to Graph Theory | Types of Graphs | Discrete Mathematics",
            thumbnail: "https://i.ytimg.com/vi/m9msQ4Q91hE/mqdefault.jpg",
            duration: "24m 10s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
    ],
  },

  "Database Management System": {
    semester: 4,
    code: "4CS4-05",
    department: "Computer Science & Engineering",
    units: [
      {
        unitNumber: 1,
        title: "Introduction to DBMS & Data Models",
        topics: [
          "Database system concepts and architecture",
          "Data models, schemas and instances",
          "Three-schema architecture and data independence",
          "Entity-Relationship (ER) model: Entities, Attributes, Relationships, Keys, ER diagrams",
          "Enhanced ER model: Specialization, Generalization",
        ],
        videos: [
          {
            videoId: "kBdlM6hNDAE",
            title: "Introduction to DBMS (Database Management System) with Real Life Examples",
            thumbnail: "https://i.ytimg.com/vi/kBdlM6hNDAE/mqdefault.jpg",
            duration: "15m 20s",
            channelTitle: "Gate Smashers",
          },
          {
            videoId: "gbbe9Z4X0l4",
            title: "ER Model in DBMS | Entity Relationship Diagram Concepts",
            thumbnail: "https://i.ytimg.com/vi/gbbe9Z4X0l4/mqdefault.jpg",
            duration: "18m 45s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 2,
        title: "Relational Model & Relational Algebra",
        topics: [
          "Relational model concepts and constraints",
          "Relational Database schemas",
          "Relational Algebra: Select, Project, Join, Set operations",
          "Tuple Relational Calculus and Domain Relational Calculus",
          "SQL DDL, DML, DCL, Views, Triggers, Joins, Subqueries",
        ],
        videos: [
          {
            videoId: "wS_8H3m5e1k",
            title: "Relational Algebra Operations in DBMS | Select, Project, Cartesian Product",
            thumbnail: "https://i.ytimg.com/vi/wS_8H3m5e1k/mqdefault.jpg",
            duration: "22m 10s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 3,
        title: "Database Design & Normalization",
        topics: [
          "Functional dependencies and inference rules",
          "Lossless join decomposition, Dependency preservation",
          "Normal forms: 1NF, 2NF, 3NF, BCNF",
          "Multi-valued dependencies and 4NF",
          "Join dependencies and 5NF",
        ],
        videos: [
          {
            videoId: "5dsfYz078g8",
            title: "Database Normalization (1NF, 2NF, 3NF, BCNF) with Real Examples",
            thumbnail: "https://i.ytimg.com/vi/5dsfYz078g8/mqdefault.jpg",
            duration: "30m 15s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 4,
        title: "Transaction Processing & Concurrency Control",
        topics: [
          "Transaction concepts, ACID properties",
          "Schedules and serializability",
          "Concurrency control protocols: Two-Phase Locking (2PL), Timestamp ordering",
          "Deadlock detection, prevention and recovery",
        ],
        videos: [
          {
            videoId: "4u3a1j5tL5c",
            title: "Transaction and Concurrency Control in DBMS | ACID Properties & Schedules",
            thumbnail: "https://i.ytimg.com/vi/4u3a1j5tL5c/mqdefault.jpg",
            duration: "25m 05s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 5,
        title: "Recovery System, Storage & Indexing",
        topics: [
          "Failure classification and recovery techniques",
          "Log-based recovery, Checkpoints, Shadow paging",
          "File organization, Indexing techniques",
          "B-Trees and B+ Trees indexing",
        ],
        videos: [
          {
            videoId: "a1a8c7v2k7m",
            title: "B Tree and B+ Tree in DBMS with Construction and Searching",
            thumbnail: "https://i.ytimg.com/vi/a1a8c7v2k7m/mqdefault.jpg",
            duration: "27m 40s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
    ],
  },

  "Theory Of Computation": {
    semester: 4,
    code: "4CS4-06",
    department: "Computer Science & Engineering",
    units: [
      {
        unitNumber: 1,
        title: "Finite Automata & Regular Languages",
        topics: [
          "Deterministic Finite Automata (DFA)",
          "Nondeterministic Finite Automata (NFA) and equivalence",
          "NFA with epsilon transitions",
          "Regular expressions and conversion to FA",
          "Pumping Lemma for Regular Languages",
          "Minimization of Finite Automata",
        ],
        videos: [
          {
            videoId: "58N2N7zJGrQ",
            title: "Theory of Computation Full Course | Introduction to TOC, DFA, NFA",
            thumbnail: "https://i.ytimg.com/vi/58N2N7zJGrQ/mqdefault.jpg",
            duration: "35m 20s",
            channelTitle: "Gate Smashers",
          },
          {
            videoId: "XSLW4ZXPHjo",
            title: "DFA Construction with Tricks | Theory of Computation",
            thumbnail: "https://i.ytimg.com/vi/XSLW4ZXPHjo/mqdefault.jpg",
            duration: "20m 15s",
            channelTitle: "Knowledge Gate",
          },
        ],
      },
      {
        unitNumber: 2,
        title: "Context-Free Grammars & Languages",
        topics: [
          "Context-Free Grammars (CFG) definition and derivations",
          "Parse trees and ambiguity in grammars",
          "Simplification of CFG (removal of useless symbols, unit productions, null productions)",
          "Chomsky Normal Form (CNF) and Greibach Normal Form (GNF)",
          "Pumping Lemma for CFLs",
        ],
        videos: [
          {
            videoId: "3rQzG5F5h3c",
            title: "Context Free Grammar (CFG) and Parse Tree with Examples",
            thumbnail: "https://i.ytimg.com/vi/3rQzG5F5h3c/mqdefault.jpg",
            duration: "18m 40s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 3,
        title: "Pushdown Automata",
        topics: [
          "Pushdown Automata (PDA) definition and transition model",
          "Deterministic PDA (DPDA) vs Nondeterministic PDA (NPDA)",
          "Acceptance by final state and empty stack",
          "Equivalence of PDA and CFG",
        ],
        videos: [
          {
            videoId: "Y2p9m6K8Q5k",
            title: "Pushdown Automata (PDA) Construction & Working in TOC",
            thumbnail: "https://i.ytimg.com/vi/Y2p9m6K8Q5k/mqdefault.jpg",
            duration: "24m 50s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 4,
        title: "Turing Machines & Computability",
        topics: [
          "Turing Machine (TM) definition and model",
          "Design of Turing Machines for standard languages",
          "Techniques for TM construction: Storage in state, Multi-track, Multi-tape",
          "Church-Turing Thesis",
          "Universal Turing Machine",
        ],
        videos: [
          {
            videoId: "P1c6k7q5j3c",
            title: "Turing Machine Explained with Construction & State Table",
            thumbnail: "https://i.ytimg.com/vi/P1c6k7q5j3c/mqdefault.jpg",
            duration: "29m 30s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 5,
        title: "Chomsky Hierarchy & Undecidability",
        topics: [
          "Chomsky Hierarchy of Languages (Type 0, Type 1, Type 2, Type 3)",
          "Decidability and Undecidability",
          "Halting Problem of Turing Machine",
          "Post Correspondence Problem (PCP)",
          "P, NP, NP-Complete and NP-Hard classes",
        ],
        videos: [
          {
            videoId: "X3p4r5t6y7u",
            title: "Chomsky Hierarchy & Undecidability | Halting Problem",
            thumbnail: "https://i.ytimg.com/vi/X3p4r5t6y7u/mqdefault.jpg",
            duration: "21m 15s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
    ],
  },

  "Data Communication & Computer Networks": {
    semester: 4,
    code: "4CS4-07",
    department: "Computer Science & Engineering",
    units: [
      {
        unitNumber: 1,
        title: "Physical Layer & Network Models",
        topics: [
          "Network hardware, Network software, Topologies",
          "OSI reference model, TCP/IP model comparison",
          "Transmission media: Guided and unguided",
          "Data rate limits: Nyquist and Shannon theorems",
          "Digital transmission, Line coding, Modulation",
        ],
        videos: [
          {
            videoId: "IPvYjXCsTg8",
            title: "Computer Networks Full Course | OSI Model, TCP/IP, Protocols",
            thumbnail: "https://i.ytimg.com/vi/IPvYjXCsTg8/mqdefault.jpg",
            duration: "32m 10s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 2,
        title: "Data Link Layer & Medium Access",
        topics: [
          "Framing, Flow control protocols",
          "Error detection and correction: Parity, Checksum, CRC",
          "Sliding Window protocols: Stop-and-Wait, Go-Back-N, Selective Repeat",
          "Multiple access: Pure ALOHA, Slotted ALOHA, CSMA, CSMA/CD, CSMA/CA",
        ],
        videos: [
          {
            videoId: "q3B8X5vJ4y1",
            title: "Error Detection CRC (Cyclic Redundancy Check) Calculation",
            thumbnail: "https://i.ytimg.com/vi/q3B8X5vJ4y1/mqdefault.jpg",
            duration: "17m 45s",
            channelTitle: "Gate Smashers",
          },
          {
            videoId: "A9p7q2r5s1x",
            title: "ALOHA Protocol: Pure ALOHA vs Slotted ALOHA with Throughput",
            thumbnail: "https://i.ytimg.com/vi/A9p7q2r5s1x/mqdefault.jpg",
            duration: "16m 20s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 3,
        title: "Network Layer & Routing",
        topics: [
          "Network layer design issues, Virtual circuits vs Datagram",
          "Routing algorithms: Distance Vector, Link State, Dijkstra",
          "IPv4 addressing, Subnetting, CIDR, NAT, IPv6 basics",
          "Congestion control algorithms: Leaky Bucket, Token Bucket",
        ],
        videos: [
          {
            videoId: "P5u3q1m8v2n",
            title: "IP Addressing & Subnetting Explained Step-by-Step",
            thumbnail: "https://i.ytimg.com/vi/P5u3q1m8v2n/mqdefault.jpg",
            duration: "26m 10s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 4,
        title: "Transport Layer",
        topics: [
          "Transport service, Port numbers, Sockets",
          "UDP segment structure and checksum",
          "TCP connection management: Three-way handshake, Termination",
          "TCP Flow Control, TCP Congestion Control (Slow Start, Congestion Avoidance)",
        ],
        videos: [
          {
            videoId: "C8a7b6c5d4e",
            title: "TCP 3-Way Handshake and Connection Termination in Computer Networks",
            thumbnail: "https://i.ytimg.com/vi/C8a7b6c5d4e/mqdefault.jpg",
            duration: "19m 40s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 5,
        title: "Application Layer & Network Security",
        topics: [
          "Domain Name System (DNS)",
          "Electronic Mail: SMTP, POP3, IMAP",
          "World Wide Web: HTTP, HTTPS, Cookies",
          "File Transfer Protocol (FTP)",
          "Network Security fundamentals: Firewalls, Cryptography",
        ],
        videos: [
          {
            videoId: "D9e8f7g6h5i",
            title: "DNS (Domain Name System) Working, Hierarchy & Resolvers",
            thumbnail: "https://i.ytimg.com/vi/D9e8f7g6h5i/mqdefault.jpg",
            duration: "15m 50s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
    ],
  },

  "Microprocessor & Interfaces": {
    semester: 4,
    code: "4CS4-04",
    department: "Computer Science & Engineering",
    units: [
      {
        unitNumber: 1,
        title: "8085 Microprocessor Architecture",
        topics: [
          "Internal architecture of 8085, Pin diagram and signals",
          "Registers, ALU, Control and timing unit",
          "Bus structure, Memory interfacing, I/O mapped I/O vs Memory mapped I/O",
        ],
        videos: [
          {
            videoId: "liRPtvj9bFU",
            title: "8085 Microprocessor Architecture & Functional Block Diagram",
            thumbnail: "https://i.ytimg.com/vi/liRPtvj9bFU/mqdefault.jpg",
            duration: "28m 10s",
            channelTitle: "Bharat Acharya Education",
          },
        ],
      },
      {
        unitNumber: 2,
        title: "8085 Programming & Instruction Set",
        topics: [
          "Instruction classification, Addressing modes of 8085",
          "Data transfer, Arithmetic, Logical, Branching instructions",
          "Assembly language programming examples",
          "Timing diagrams: Machine cycles and T-states",
        ],
        videos: [
          {
            videoId: "A7b6c5d4e3f",
            title: "Addressing Modes of 8085 Microprocessor with Examples",
            thumbnail: "https://i.ytimg.com/vi/A7b6c5d4e3f/mqdefault.jpg",
            duration: "21m 30s",
            channelTitle: "Bharat Acharya Education",
          },
        ],
      },
      {
        unitNumber: 3,
        title: "8086 Microprocessor Architecture",
        topics: [
          "Architecture of 8086: Bus Interface Unit (BIU) and Execution Unit (EU)",
          "Memory segmentation, Physical address generation",
          "Register organization, Flag register",
          "Minimum mode and Maximum mode operations",
        ],
        videos: [
          {
            videoId: "B8c7d6e5f4g",
            title: "8086 Microprocessor Architecture | BIU and EU Explained",
            thumbnail: "https://i.ytimg.com/vi/B8c7d6e5f4g/mqdefault.jpg",
            duration: "26m 45s",
            channelTitle: "Bharat Acharya Education",
          },
        ],
      },
      {
        unitNumber: 4,
        title: "Interrupts & Peripheral Interfacing",
        topics: [
          "Interrupt structure of 8085 and 8086",
          "Programmable Peripheral Interface 8255",
          "Programmable Interval Timer 8254/8253",
          "Programmable Interrupt Controller 8259",
          "DMA Controller 8257/8237",
        ],
        videos: [
          {
            videoId: "C9d8e7f6g5h",
            title: "8255 Programmable Peripheral Interface (PPI) Working & Modes",
            thumbnail: "https://i.ytimg.com/vi/C9d8e7f6g5h/mqdefault.jpg",
            duration: "24m 20s",
            channelTitle: "Bharat Acharya Education",
          },
        ],
      },
    ],
  },

  "Technical Communication": {
    semester: 4,
    code: "4CS1-03",
    department: "Computer Science & Engineering",
    units: [
      {
        unitNumber: 1,
        title: "Foundations of Technical Communication",
        topics: [
          "Communication process, Types of communication",
          "Barriers to communication and remedies",
          "Verbal vs Non-verbal communication",
          "Cross-cultural and corporate communication",
        ],
        videos: [
          {
            videoId: "D1e2f3g4h5i",
            title: "Technical Communication: Process, Types and Barriers",
            thumbnail: "https://i.ytimg.com/vi/D1e2f3g4h5i/mqdefault.jpg",
            duration: "20m 10s",
            channelTitle: "NPTEL",
          },
        ],
      },
      {
        unitNumber: 2,
        title: "Technical Writing & Reports",
        topics: [
          "Technical reports: Structure, Style, Format",
          "Research proposals, Project proposals",
          "Business correspondence: Letters, Memos, Emails",
          "Resume and CV writing, Cover letters",
        ],
        videos: [
          {
            videoId: "E2f3g4h5i6j",
            title: "Technical Report Writing & Effective Business Correspondence",
            thumbnail: "https://i.ytimg.com/vi/E2f3g4h5i6j/mqdefault.jpg",
            duration: "22m 30s",
            channelTitle: "NPTEL",
          },
        ],
      },
    ],
  },

  // ─── 3rd Semester ───────────────────────────────────────────
  "Digital Electronics": {
    semester: 3,
    code: "3CS4-05",
    department: "Computer Science & Engineering",
    playlistUrl: "https://youtube.com/playlist?list=PLxCzCOWd7aiGmXg4NoX6R31AsC5LeCPHe",
    channelTitle: "Code Smashers",
    units: [
      {
        unitNumber: 1,
        title: "Number Systems & Boolean Algebra",
        topics: [
          "Binary, Octal, Decimal, Hexadecimal number systems",
          "Complements (1's, 2's, 9's, 10's)",
          "Binary arithmetic and codes (BCD, Gray code, Excess-3)",
          "Boolean algebra theorems, DeMorgan's laws",
          "Canonical and standard forms: SOP and POS",
        ],
        videos: [
          {
            videoId: "M0ox87LNd60",
            title: "Number Systems Conversion (Binary, Decimal, Octal, Hexadecimal)",
            thumbnail: "https://i.ytimg.com/vi/M0ox87LNd60/mqdefault.jpg",
            duration: "23m 15s",
            channelTitle: "Code Smashers",
          },
        ],
      },
      {
        unitNumber: 2,
        title: "Karnaugh Map (K-Map) & Logic Minimization",
        topics: [
          "2, 3, 4, 5-variable K-Maps",
          "Prime implicants, Essential prime implicants",
          "Don't care conditions",
          "Quine-McCluskey (Tabular) minimization method",
          "NAND and NOR gate implementation",
        ],
        videos: [
          {
            videoId: "RO5alU6PpSU",
            title: "Karnaugh Map (K-Map) Simplification with Easy Examples | Digital Logic",
            thumbnail: "https://i.ytimg.com/vi/RO5alU6PpSU/mqdefault.jpg",
            duration: "25m 40s",
            channelTitle: "Code Smashers",
          },
        ],
      },
      {
        unitNumber: 3,
        title: "Combinational Logic Circuits",
        topics: [
          "Half Adder, Full Adder, Half Subtractor, Full Subtractor",
          "Parallel Binary Adder, Carry Lookahead Adder",
          "Multiplexers (MUX) and Demultiplexers (DEMUX)",
          "Decoders, Encoders, Priority Encoders",
          "Code Converters, Parity Generator and Checker",
        ],
        videos: [
          {
            videoId: "4BQuJ4vM6qE",
            title: "Multiplexer (MUX) Design & Implementation | Digital Electronics",
            thumbnail: "https://i.ytimg.com/vi/4BQuJ4vM6qE/mqdefault.jpg",
            duration: "22m 10s",
            channelTitle: "Code Smashers",
          },
        ],
      },
      {
        unitNumber: 4,
        title: "Sequential Logic Circuits & Flip Flops",
        topics: [
          "Latches vs Flip-Flops",
          "SR, D, JK, T Flip-Flops and Truth tables",
          "Master-Slave JK Flip-Flop and Race-around condition",
          "Conversion between flip-flops",
          "Shift Registers: SISO, SIPO, PISO, PIPO",
          "Synchronous and Asynchronous Counters, Ring counter, Johnson counter",
        ],
        videos: [
          {
            videoId: "Qz8a5b7c8d9",
            title: "Flip-Flops Explained: SR, JK, D, T & Master-Slave JK",
            thumbnail: "https://i.ytimg.com/vi/Qz8a5b7c8d9/mqdefault.jpg",
            duration: "28m 30s",
            channelTitle: "Code Smashers",
          },
        ],
      },
      {
        unitNumber: 5,
        title: "Semiconductor Memories & Programmable Logic",
        topics: [
          "Memory organization: RAM (SRAM, DRAM), ROM (PROM, EPROM, EEPROM)",
          "Programmable Logic Devices: PAL, PLA, CPLD, FPGA",
          "Digital-to-Analog (DAC) and Analog-to-Digital (ADC) converters",
        ],
        videos: [
          {
            videoId: "R1s2t3u4v5w",
            title: "PLA vs PAL in Digital Electronics | Architecture & Examples",
            thumbnail: "https://i.ytimg.com/vi/R1s2t3u4v5w/mqdefault.jpg",
            duration: "19m 50s",
            channelTitle: "Code Smashers",
          },
        ],
      },
    ],
  },

  "Data Structures and Algorithms": {
    semester: 3,
    code: "3CS4-04",
    department: "Computer Science & Engineering",
    playlistUrl: "https://youtube.com/playlist?list=PLdo5W4Nhv31bbKJzrsKfMpo_grxuLl8LU",
    channelTitle: "Jenny's Lectures / Neso Academy",
    units: [
      {
        unitNumber: 1,
        title: "Arrays, Pointers & Recursion",
        topics: [
          "Array representations and operations",
          "Pointers and dynamic memory allocation",
          "Time and Space complexity, Big-O notation",
          "Recursion principles, Tower of Hanoi",
        ],
        videos: [
          {
            videoId: "AT14lCXuMKI",
            title: "Data Structures & Algorithms Full Course | Arrays & Complexity",
            thumbnail: "https://i.ytimg.com/vi/AT14lCXuMKI/mqdefault.jpg",
            duration: "30m 10s",
            channelTitle: "Jenny's Lectures CS IT",
          },
        ],
      },
      {
        unitNumber: 2,
        title: "Linked Lists, Stacks & Queues",
        topics: [
          "Singly, Doubly, and Circular Linked Lists",
          "Stack operations: Push, Pop, Infix to Postfix conversion, Evaluation",
          "Queue operations: Linear queue, Circular queue, Deque, Priority queue",
        ],
        videos: [
          {
            videoId: "q3Z3v3k6q5p",
            title: "Linked List in Data Structures | Singly, Doubly, Circular Linked List",
            thumbnail: "https://i.ytimg.com/vi/q3Z3v3k6q5p/mqdefault.jpg",
            duration: "26m 40s",
            channelTitle: "Jenny's Lectures CS IT",
          },
          {
            videoId: "w7c4f1e5g9h",
            title: "Infix to Postfix Conversion using Stack with Step-by-Step Examples",
            thumbnail: "https://i.ytimg.com/vi/w7c4f1e5g9h/mqdefault.jpg",
            duration: "21m 15s",
            channelTitle: "Jenny's Lectures CS IT",
          },
        ],
      },
      {
        unitNumber: 3,
        title: "Trees & Binary Search Trees",
        topics: [
          "Binary Tree properties and traversals (Inorder, Preorder, Postorder)",
          "Binary Search Trees (BST): Insertion, Deletion, Search",
          "Balanced trees: AVL Tree rotations, Red-Black tree introduction",
          "B-Trees, B+ Trees, Heap data structure (Min-Heap, Max-Heap)",
        ],
        videos: [
          {
            videoId: "b3q5w7e9r1t",
            title: "Binary Tree Traversals (Inorder, Preorder, Postorder) Made Easy",
            thumbnail: "https://i.ytimg.com/vi/b3q5w7e9r1t/mqdefault.jpg",
            duration: "24m 30s",
            channelTitle: "Jenny's Lectures CS IT",
          },
          {
            videoId: "c4r6t8y1u3i",
            title: "AVL Tree Rotations (LL, RR, LR, RL) Explained with Examples",
            thumbnail: "https://i.ytimg.com/vi/c4r6t8y1u3i/mqdefault.jpg",
            duration: "27m 50s",
            channelTitle: "Jenny's Lectures CS IT",
          },
        ],
      },
      {
        unitNumber: 4,
        title: "Graphs & Graph Algorithms",
        topics: [
          "Graph representations: Adjacency Matrix and Adjacency List",
          "Graph traversals: Breadth First Search (BFS), Depth First Search (DFS)",
          "Shortest path algorithms: Dijkstra's, Bellman-Ford",
          "Minimum Spanning Trees: Kruskal's, Prim's algorithms",
        ],
        videos: [
          {
            videoId: "d5e7f9g1h3j",
            title: "Dijkstra's Algorithm Shortest Path with Full Numerical Example",
            thumbnail: "https://i.ytimg.com/vi/d5e7f9g1h3j/mqdefault.jpg",
            duration: "25m 20s",
            channelTitle: "Jenny's Lectures CS IT",
          },
        ],
      },
      {
        unitNumber: 5,
        title: "Sorting & Searching Algorithms",
        topics: [
          "Bubble, Selection, Insertion Sort",
          "Merge Sort, Quick Sort, Heap Sort",
          "Linear Search, Binary Search",
          "Hashing techniques, Collision resolution (Chaining, Open Addressing)",
        ],
        videos: [
          {
            videoId: "e6f8g1h3j5k",
            title: "Quick Sort Algorithm Step-by-Step with Partitioning",
            thumbnail: "https://i.ytimg.com/vi/e6f8g1h3j5k/mqdefault.jpg",
            duration: "22m 10s",
            channelTitle: "Jenny's Lectures CS IT",
          },
        ],
      },
    ],
  },

  "Object Oriented Programming": {
    semester: 3,
    code: "3CS4-06",
    department: "Computer Science & Engineering",
    playlistUrl: "https://youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL",
    channelTitle: "CodeWithHarry",
    units: [
      {
        unitNumber: 1,
        title: "OOP Paradigm & C++ Basics",
        topics: [
          "Procedural vs Object-Oriented Programming",
          "OOP Concepts: Encapsulation, Abstraction, Inheritance, Polymorphism",
          "C++ Tokens, Expressions, Control structures, Functions, Inline functions",
        ],
        videos: [
          {
            videoId: "j8nAHeVKL08",
            title: "C++ Programming Full Course | Object Oriented Programming in C++",
            thumbnail: "https://i.ytimg.com/vi/j8nAHeVKL08/mqdefault.jpg",
            duration: "31m 20s",
            channelTitle: "CodeWithHarry",
          },
        ],
      },
      {
        unitNumber: 2,
        title: "Classes, Objects & Constructors",
        topics: [
          "Class declaration, Member functions, Access specifiers",
          "Static data members and member functions",
          "Friend functions and friend classes",
          "Constructors: Default, Parameterized, Copy, Dynamic",
          "Destructors",
        ],
        videos: [
          {
            videoId: "f7g9h1j3k5l",
            title: "Constructors and Destructors in C++ | Types of Constructors",
            thumbnail: "https://i.ytimg.com/vi/f7g9h1j3k5l/mqdefault.jpg",
            duration: "20m 45s",
            channelTitle: "CodeWithHarry",
          },
        ],
      },
      {
        unitNumber: 3,
        title: "Inheritance & Polymorphism",
        topics: [
          "Types of inheritance: Single, Multilevel, Multiple, Hierarchical, Hybrid",
          "Visibility modes: public, protected, private",
          "Function overloading and Operator overloading",
          "Virtual functions, Pure virtual functions, Abstract classes",
          "Early binding vs Late binding",
        ],
        videos: [
          {
            videoId: "g8h1j3k5l7m",
            title: "Virtual Functions & Run-Time Polymorphism in C++",
            thumbnail: "https://i.ytimg.com/vi/g8h1j3k5l7m/mqdefault.jpg",
            duration: "24m 15s",
            channelTitle: "CodeWithHarry",
          },
        ],
      },
      {
        unitNumber: 4,
        title: "Templates, Exceptions & File Handling",
        topics: [
          "Function templates and Class templates",
          "Exception handling mechanism: try, catch, throw",
          "File streams, Reading and writing files in C++",
          "Standard Template Library (STL) overview",
        ],
        videos: [
          {
            videoId: "h9j1k3l5m7n",
            title: "Exception Handling in C++ (try, catch, throw) Explained",
            thumbnail: "https://i.ytimg.com/vi/h9j1k3l5m7n/mqdefault.jpg",
            duration: "18m 30s",
            channelTitle: "CodeWithHarry",
          },
        ],
      },
    ],
  },

  "Software Engineering": {
    semester: 3,
    code: "3CS4-07",
    department: "Computer Science & Engineering",
    units: [
      {
        unitNumber: 1,
        title: "Software Process Models",
        topics: [
          "Software Engineering paradigms and challenges",
          "SDLC Models: Waterfall, Prototype, Spiral, Incremental, RAD",
          "Agile methodology, Scrum, Extreme Programming",
        ],
        videos: [
          {
            videoId: "u9i1j3k5l7m",
            title: "Software Engineering Full Course | SDLC Models Explained",
            thumbnail: "https://i.ytimg.com/vi/u9i1j3k5l7m/mqdefault.jpg",
            duration: "27m 40s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 2,
        title: "Software Requirements & Design",
        topics: [
          "Software Requirements Specification (SRS)",
          "Functional and Non-functional requirements",
          "Data Flow Diagrams (DFD), Use case diagrams",
          "Architectural design, Cohesion and Coupling",
        ],
        videos: [
          {
            videoId: "v1j3k5l7m9n",
            title: "Coupling and Cohesion in Software Engineering with Real Examples",
            thumbnail: "https://i.ytimg.com/vi/v1j3k5l7m9n/mqdefault.jpg",
            duration: "19m 20s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
      {
        unitNumber: 3,
        title: "Testing & Maintenance",
        topics: [
          "Verification and Validation",
          "Testing techniques: Black-box and White-box testing",
          "Unit, Integration, System, and Acceptance testing",
          "Software maintenance types, Reverse engineering",
        ],
        videos: [
          {
            videoId: "w2k4l6m8n0p",
            title: "Black Box Testing vs White Box Testing Explained",
            thumbnail: "https://i.ytimg.com/vi/w2k4l6m8n0p/mqdefault.jpg",
            duration: "17m 55s",
            channelTitle: "Gate Smashers",
          },
        ],
      },
    ],
  },
};

module.exports = SYLLABUS_CATALOG;
