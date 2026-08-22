export type EvidenceType = "course" | "project" | "competition" | "credential";
export type Status = "Verified" | "Pending" | "Needs Review";

export type Evidence = {
  id: string;
  title: string;
  type: EvidenceType;
  source: string;
  date: string;
  status: Status;
  skills: string[];
  detail: string;
};

export type SkillCategory = "Technical" | "Soft Skills" | "Domain Knowledge";

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  level: 1 | 2 | 3 | 4 | 5;
  verified: boolean;
  evidenceIds: string[];
};

export type Match = {
  id: string;
  title: string;
  org: string;
  kind: "Internship" | "Team";
  domain: string;
  score: number;
  summary: string;
  why: { skill: string; evidence: string }[];
  gaps: { skill: string; suggestion: string }[];
  compare: { skill: string; you: number; required: number }[];
};

export const profile = {
  name: "Admin",
  passportId: "SKP-2604821-IND",
  strength: 82,
  mrz: [
    "SKPS<<ADMIN<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<",
    "2604821<9IND2603<<<<<<<<<<<<<<<<<<<<<<<06",
  ],
};

export const evidence: Evidence[] = [
  {
    id: "ev-1",
    title: "Data Structures & Algorithms — Semester Coursework (ITER)",
    type: "course",
    source: "ITER, Siksha 'O' Anusandhan",
    date: "2026-05-14",
    status: "Verified",
    skills: ["Data Structures & Algorithms", "Python", "SQL"],
    detail: "Registrar-issued transcript, grade A, 4 credits. Includes graded lab record of 38 problem sets.",
  },
  {
    id: "ev-2",
    title: "Smart Attendance System — Capstone Project",
    type: "project",
    source: "ITER Capstone Review Board",
    date: "2026-04-28",
    status: "Verified",
    skills: ["Python", "Machine Learning Basics", "React.js", "Git & Version Control"],
    detail: "Face-recognition attendance service, 1,240 commits, reviewed and signed off by two faculty examiners.",
  },
  {
    id: "ev-3",
    title: "Smart India Hackathon — Finalist",
    type: "competition",
    source: "Ministry of Education, Govt. of India",
    date: "2026-03-09",
    status: "Verified",
    skills: ["Team Leadership", "Public Speaking", "React.js"],
    detail: "National finalist, problem statement SIH-1428. Led a five-member team through 36 hours of build and defence.",
  },
  {
    id: "ev-4",
    title: "Google Data Analytics Certificate — Coursera",
    type: "credential",
    source: "Coursera / Google",
    date: "2026-02-20",
    status: "Verified",
    skills: ["SQL", "Data Visualization", "Technical Writing"],
    detail: "Eight-course professional certificate, credential ID GDA-8842-KRT, verified through the Coursera issuer API.",
  },
  {
    id: "ev-5",
    title: "AWS Cloud Practitioner Essentials",
    type: "credential",
    source: "AWS Skill Builder",
    date: "2026-06-02",
    status: "Pending",
    skills: ["Cloud Fundamentals (AWS)"],
    detail: "Course completion recorded; issuer verification callback is still outstanding.",
  },
  {
    id: "ev-6",
    title: "Frontend Systems with React — Elective Coursework",
    type: "course",
    source: "ITER, Siksha 'O' Anusandhan",
    date: "2026-01-30",
    status: "Verified",
    skills: ["React.js", "UI/UX Design", "Git & Version Control"],
    detail: "Elective transcript entry, grade A. Four graded builds including an accessible component library.",
  },
  {
    id: "ev-7",
    title: "Kaggle Playground — Tabular Forecasting, Top 8%",
    type: "competition",
    source: "Kaggle",
    date: "2025-12-11",
    status: "Verified",
    skills: ["Machine Learning Basics", "Python", "Data Visualization"],
    detail: "Public leaderboard rank 214 of 2,806. Notebook and submission history attached as evidence.",
  },
  {
    id: "ev-8",
    title: "Open Source Contribution — Recharts Docs",
    type: "project",
    source: "GitHub",
    date: "2025-11-22",
    status: "Verified",
    skills: ["Technical Writing", "Git & Version Control", "Data Visualization"],
    detail: "Three merged pull requests improving chart accessibility documentation, verified via commit signatures.",
  },
  {
    id: "ev-9",
    title: "Departmental Tech Society — Design Lead",
    type: "project",
    source: "ITER Tech Society",
    date: "2025-10-05",
    status: "Needs Review",
    skills: ["UI/UX Design", "Team Leadership"],
    detail: "Role letter uploaded, but the issuing signatory is not yet on the recognised-issuer list.",
  },
  {
    id: "ev-10",
    title: "Inter-College Debate Championship — Runner-up",
    type: "competition",
    source: "Utkal University Debating Union",
    date: "2025-09-18",
    status: "Verified",
    skills: ["Public Speaking", "Team Leadership"],
    detail: "Runner-up certificate with adjudicator scoresheet, verified against the union's published results.",
  },
];

export const skills: Skill[] = [
  { id: "s1", name: "Python", category: "Technical", level: 5, verified: true, evidenceIds: ["ev-1", "ev-2", "ev-7"] },
  { id: "s2", name: "Data Structures & Algorithms", category: "Technical", level: 4, verified: true, evidenceIds: ["ev-1"] },
  { id: "s3", name: "SQL", category: "Technical", level: 4, verified: true, evidenceIds: ["ev-1", "ev-4"] },
  { id: "s4", name: "React.js", category: "Technical", level: 4, verified: true, evidenceIds: ["ev-2", "ev-3", "ev-6"] },
  { id: "s5", name: "Machine Learning Basics", category: "Technical", level: 3, verified: true, evidenceIds: ["ev-2", "ev-7"] },
  { id: "s6", name: "Git & Version Control", category: "Technical", level: 5, verified: true, evidenceIds: ["ev-2", "ev-6", "ev-8"] },
  { id: "s7", name: "Cloud Fundamentals (AWS)", category: "Technical", level: 2, verified: false, evidenceIds: ["ev-5"] },
  { id: "s8", name: "Data Visualization", category: "Domain Knowledge", level: 4, verified: true, evidenceIds: ["ev-4", "ev-7", "ev-8"] },
  { id: "s9", name: "UI/UX Design", category: "Domain Knowledge", level: 3, verified: false, evidenceIds: ["ev-6", "ev-9"] },
  { id: "s10", name: "Technical Writing", category: "Domain Knowledge", level: 4, verified: true, evidenceIds: ["ev-4", "ev-8"] },
  { id: "s11", name: "Public Speaking", category: "Soft Skills", level: 3, verified: true, evidenceIds: ["ev-3", "ev-10"] },
  { id: "s12", name: "Team Leadership", category: "Soft Skills", level: 4, verified: true, evidenceIds: ["ev-3", "ev-9", "ev-10"] },
];

export const matches: Match[] = [
  {
    id: "m1",
    title: "Data Analyst Intern",
    org: "Nimbus Fintech",
    kind: "Internship",
    domain: "Data & Analytics",
    score: 91,
    summary: "Six-month paid internship building lending dashboards and cohort reports for the risk team.",
    why: [
      { skill: "SQL", evidence: "Verified via DSA semester coursework (ITER) and the Google Data Analytics Certificate." },
      { skill: "Data Visualization", evidence: "Verified via the Google Data Analytics Certificate and merged Recharts documentation work." },
      { skill: "Python", evidence: "Verified via the Smart Attendance System capstone and a top-8% Kaggle tabular finish." },
    ],
    gaps: [
      { skill: "Statistical Modeling", suggestion: "Add a regression or A/B-test writeup; an inferential-statistics course would satisfy this requirement." },
    ],
    compare: [
      { skill: "SQL", you: 4, required: 4 },
      { skill: "Data Viz", you: 4, required: 3 },
      { skill: "Python", you: 5, required: 4 },
      { skill: "Stat. Modeling", you: 0, required: 3 },
    ],
  },
  {
    id: "m2",
    title: "Campus AI-for-Good Team",
    org: "Needs a frontend + data teammate",
    kind: "Team",
    domain: "Applied ML",
    score: 87,
    summary: "Four-person multidisciplinary team preparing an accessibility assistant for the state innovation grant.",
    why: [
      { skill: "React.js", evidence: "Verified via Frontend Systems elective coursework and the Smart India Hackathon finalist build." },
      { skill: "Python", evidence: "Verified via the capstone project's recognition service and Kaggle competition notebooks." },
      { skill: "Team Leadership", evidence: "Verified via leading a five-member Smart India Hackathon team to the national final." },
    ],
    gaps: [
      { skill: "Public Speaking", suggestion: "The pitch role needs a recorded 5-minute demo talk; your debate runner-up evidence covers only part of it." },
    ],
    compare: [
      { skill: "React.js", you: 4, required: 4 },
      { skill: "Python", you: 5, required: 3 },
      { skill: "Leadership", you: 4, required: 3 },
      { skill: "Speaking", you: 3, required: 5 },
    ],
  },
  {
    id: "m3",
    title: "Frontend Engineering Intern",
    org: "Kestrel Health Systems",
    kind: "Internship",
    domain: "Product Engineering",
    score: 84,
    summary: "Clinician-facing interface work on a triage console used across eleven district hospitals.",
    why: [
      { skill: "React.js", evidence: "Verified via Frontend Systems elective coursework, including an accessible component library build." },
      { skill: "Git & Version Control", evidence: "Verified via 1,240 signed capstone commits and three merged open-source pull requests." },
      { skill: "UI/UX Design", evidence: "Self-reported design-lead role plus graded elective builds; issuer verification still in review." },
    ],
    gaps: [
      { skill: "TypeScript", suggestion: "Convert one existing React project to TypeScript and attach the repository as evidence." },
      { skill: "Accessibility Testing", suggestion: "A WCAG audit writeup on any existing build would close this requirement." },
    ],
    compare: [
      { skill: "React.js", you: 4, required: 5 },
      { skill: "Git", you: 5, required: 3 },
      { skill: "UI/UX", you: 3, required: 3 },
      { skill: "TypeScript", you: 0, required: 4 },
    ],
  },
  {
    id: "m4",
    title: "Machine Learning Research Assistant",
    org: "Centre for Applied Data Science, ITER",
    kind: "Internship",
    domain: "Research",
    score: 79,
    summary: "Two-semester assistantship on vision models for low-bandwidth classroom monitoring.",
    why: [
      { skill: "Machine Learning Basics", evidence: "Verified via the capstone recognition pipeline and a top-8% Kaggle tabular forecasting result." },
      { skill: "Python", evidence: "Verified across three separate evidence items, including graded coursework." },
      { skill: "Technical Writing", evidence: "Verified via the Google Data Analytics Certificate and merged documentation contributions." },
    ],
    gaps: [
      { skill: "Linear Algebra Depth", suggestion: "A graded matrix-methods course would raise this from partial to satisfied." },
      { skill: "PyTorch", suggestion: "Reimplement one Kaggle notebook in PyTorch and attach it as project evidence." },
    ],
    compare: [
      { skill: "ML Basics", you: 3, required: 4 },
      { skill: "Python", you: 5, required: 4 },
      { skill: "Writing", you: 4, required: 3 },
      { skill: "PyTorch", you: 0, required: 3 },
    ],
  },
  {
    id: "m5",
    title: "Civic Data Storytelling Team",
    org: "Needs a visualization + writing teammate",
    kind: "Team",
    domain: "Data & Analytics",
    score: 76,
    summary: "Cross-department team publishing an open dashboard on municipal water-quality readings.",
    why: [
      { skill: "Data Visualization", evidence: "Verified via the Google Data Analytics Certificate and Kaggle notebook charts." },
      { skill: "Technical Writing", evidence: "Verified via three merged pull requests to public charting documentation." },
      { skill: "SQL", evidence: "Verified via semester coursework queries and certificate assessments." },
    ],
    gaps: [
      { skill: "Geospatial Analysis", suggestion: "Add one mapping notebook (GeoPandas or Kepler) to satisfy the spatial requirement." },
    ],
    compare: [
      { skill: "Data Viz", you: 4, required: 4 },
      { skill: "Writing", you: 4, required: 4 },
      { skill: "SQL", you: 4, required: 3 },
      { skill: "Geospatial", you: 0, required: 3 },
    ],
  },
  {
    id: "m6",
    title: "Cloud Platform Intern",
    org: "Arclight Infrastructure",
    kind: "Internship",
    domain: "Cloud & Platform",
    score: 68,
    summary: "Deployment tooling and cost-reporting automation for a managed Kubernetes platform.",
    why: [
      { skill: "Git & Version Control", evidence: "Verified via signed capstone commit history and open-source contributions." },
      { skill: "Python", evidence: "Verified via coursework and project automation scripts." },
    ],
    gaps: [
      { skill: "Cloud Fundamentals (AWS)", suggestion: "Your AWS Cloud Practitioner evidence is still Pending; verification would lift this match materially." },
      { skill: "Containers & CI/CD", suggestion: "Add a Dockerfile plus a pipeline configuration from any existing project as evidence." },
    ],
    compare: [
      { skill: "Git", you: 5, required: 4 },
      { skill: "Python", you: 5, required: 3 },
      { skill: "AWS", you: 2, required: 4 },
      { skill: "CI/CD", you: 0, required: 4 },
    ],
  },
];

export const skillGrowth = [
  { month: "Jan", proficiency: 48, verified: 4 },
  { month: "Feb", proficiency: 55, verified: 5 },
  { month: "Mar", proficiency: 63, verified: 6 },
  { month: "Apr", proficiency: 71, verified: 7 },
  { month: "May", proficiency: 78, verified: 8 },
  { month: "Jun", proficiency: 84, verified: 9 },
];

export const radarData = [
  { category: "Programming", you: 92, benchmark: 70 },
  { category: "Data", you: 80, benchmark: 68 },
  { category: "Frontend", you: 78, benchmark: 72 },
  { category: "ML", you: 62, benchmark: 65 },
  { category: "Cloud", you: 40, benchmark: 60 },
  { category: "Communication", you: 72, benchmark: 58 },
];

export const FAIRNESS_NOTE =
  "This score used only skill-evidence signals. Name, photo, gender, age, and college tier were not part of the calculation.";

export const evidenceById = (id: string) => evidence.find((e) => e.id === id);
export const skillsForEvidence = (id: string) => skills.filter((s) => s.evidenceIds.includes(id));
