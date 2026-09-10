import { 
  Faculty, 
  Student, 
  Project, 
  EventItem, 
  Achievement, 
  NoteItem, 
  SyllabusItem, 
  Announcement, 
  SkillHubCourse 
} from './types';

export const COLLEGE_INFO = {
  name: "St. Berchmans College (Autonomous)",
  nameMl: "സെന്റ് ബെർക്ക്മാൻസ് കോളേജ് (ഓട്ടോണമസ്)",
  departmentName: "Department of Artificial Intelligence & Data Science",
  departmentNameMl: "ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസ് & ഡാറ്റ സയൻസ് വകുപ്പ്",
  location: "Changanassery, Kottayam District, Kerala - 686101",
  established: 1922,
  founder: "Venerable Mar Thomas Kurialacherry (Bishop of Changanassery)",
  management: "Archdiocesan Educational and Charitable Trust of Changanacherry",
  accreditation: "NAAC Re-accredited with A+ Grade | NIRF Top 100 Indian Colleges",
  autonomyYear: 2014,
  patronSaint: "St. John Berchmans (1599 - 1621)",
  motto: "Maximi facere minima",
  mottoTranslation: "Do the most with the least / Perfection in ordinary duties",
  email: "aids@sbcollege.ac.in",
  phone: "+91 481 2420025",
  website: "https://sbcollege.ac.in",
  images: {
    hero: "/images/sb college centre full.jpg",
    aboutCampus: "/images/sb college left full.jpg",
    logo: "/images/sb college logo.jpg",
    missionVision: "/images/Mission and vission.png",
  }
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Applications Open for B.Voc & M.Sc AI & Data Science 2026-27 Batch",
    titleMl: "2026-27 ബാച്ചിലേക്കുള്ള ബി.വോക് & എം.എസ്.സി എ.ഐ പ്രവേശനത്തിന് അപേക്ഷ ക്ഷണിച്ചു",
    date: "September 05, 2026",
    category: "academic",
    content: "Online registration for undergraduate and postgraduate admissions in the Department of AI and Data Science is now live on the college admission portal.",
    link: "/portal",
    isUrgent: true,
  },
  {
    id: "ann-2",
    title: "SB AI Datathon 2026 Announced — Cash Prize Pool of ₹50,000",
    titleMl: "എസ്.ബി എ.ഐ ഡാറ്റാത്തോൺ 2026 പ്രഖ്യാപിച്ചു — ₹50,000 സമ്മാനത്തുക",
    date: "August 28, 2026",
    category: "event",
    content: "Annual 36-hour hackathon hosted by the Tech Team focusing on Malayalam NLP and Computer Vision for precision farming.",
    link: "/events",
    isUrgent: false,
  },
  {
    id: "ann-3",
    title: "Semester IV & VI Autonomous End-Semester Examination Schedule Published",
    titleMl: "സെമസ്റ്റർ 4, 6 ഓട്ടോണമസ് പരീക്ഷാ ടൈംടേബിൾ പ്രസിദ്ധീകരിച്ചു",
    date: "August 20, 2026",
    category: "exam",
    content: "Theory and practical examination schedules for academic year 2025-26 have been uploaded under the Downloads & Syllabus section.",
    link: "/academics/downloads",
    isUrgent: false,
  }
];

export const FACULTY_MEMBERS: Faculty[] = [];

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_PROJECTS: Project[] = [];

export const EVENTS: EventItem[] = [];

export const ACHIEVEMENTS: Achievement[] = [];

export const LECTURE_NOTES: NoteItem[] = [];

export const SYLLABUS_LIST: SyllabusItem[] = [
  {
    id: "syl-1",
    title: "B.Voc Artificial Intelligence & Data Science Curriculum (Regulations 2024)",
    programme: "B.Voc AI & Data Science",
    academicYear: "2024 - 2027",
    semester: 1,
    fileUrl: "/downloads/syllabus/BVoc_AIDS_Syllabus_2024_2027.pdf",
    fileSize: "2.8 MB",
  },
  {
    id: "syl-2",
    title: "M.Sc Artificial Intelligence Post-Graduate Syllabus (Autonomous Framework)",
    programme: "M.Sc AI",
    academicYear: "2024 - 2026",
    fileUrl: "/downloads/syllabus/MSc_AI_Syllabus_2024_2026.pdf",
    fileSize: "3.1 MB",
  },
  {
    id: "syl-3",
    title: "B.Voc Artificial Intelligence & Data Science (Regulations 2022 Archive)",
    programme: "B.Voc AI & Data Science",
    academicYear: "2022 - 2025",
    fileUrl: "/downloads/syllabus/BVoc_AIDS_Syllabus_2022_2025.pdf",
    fileSize: "2.4 MB",
  }
];

export const SKILL_HUB_COURSES: SkillHubCourse[] = [
  {
    id: "sk-1",
    title: "Generative AI & Enterprise LLM Engineering",
    partner: "EY GDS & ICT Academy of Kerala (ICTAK)",
    durationHours: 45,
    mode: "Hybrid (Centenary Lab + Online)",
    category: "Artificial Intelligence",
    description: "Hands-on instruction in fine-tuning, RAG pipelines, prompt engineering, and deploying cost-effective LLMs."
  },
  {
    id: "sk-2",
    title: "Full-Stack AI Application Development",
    partner: "Additional Skill Acquisition Programme (ASAP Kerala)",
    durationHours: 45,
    mode: "Campus Lab",
    category: "Software Development",
    description: "Building production web apps connecting Next.js, FastAPI, PostgreSQL, and deployed machine learning APIs."
  },
  {
    id: "sk-3",
    title: "Advanced Data Analytics & Financial Intelligence",
    partner: "Ernst & Young (EY)",
    durationHours: 45,
    mode: "Hybrid",
    category: "Data Science",
    description: "Predictive financial modeling, Power BI enterprise dashboards, and time-series risk prediction algorithms."
  },
  {
    id: "sk-4",
    title: "Digital Media Production & Visual Effects for AI",
    partner: "Centre for Development of Imaging Technology (CDIT)",
    durationHours: 45,
    mode: "Multimedia Lab",
    category: "Media & Imaging",
    description: "Digital imaging workflows, generative video editing, 3D visualization, and synthetic dataset creation."
  },
  {
    id: "sk-5",
    title: "Professional Corporate English & International Communication",
    partner: "Burlington English",
    durationHours: 45,
    mode: "Language Lab (Interactive)",
    category: "Communication",
    description: "Business communication, technical presentation polish, and global corporate interview readiness."
  },
  {
    id: "sk-6",
    title: "Defence Technology & Strategic Aptitude",
    partner: "Berchmans Defence Academy (BEDA)",
    durationHours: 45,
    mode: "Campus Classroom",
    category: "Defence & Leadership",
    description: "Preparation for defence technical entries, physical fitness leadership, and strategic data technologies."
  }
];

export const WINGS_INFO = [
  {
    id: "nss",
    name: "National Service Scheme (NSS)",
    tagline: "Not Me But You — Social Impact through Technology",
    description: "Empowering rural communities around Changanassery through digital literacy camps, blood donation drives, and environmental sustainability initiatives.",
    color: "#2E7D50",
    iconName: "HeartHandshake",
  },
  {
    id: "ncc",
    name: "National Cadet Corps (NCC)",
    tagline: "Unity and Discipline",
    description: "Army and Naval wings instilling leadership, character, resilience, and readiness to serve the nation.",
    color: "#12192B",
    iconName: "Shield",
  },
  {
    id: "sports",
    name: "Department Sports Wing",
    tagline: "Excellence, Teamwork & Athletic Vigour",
    description: "Representing St. Berchmans in inter-collegiate football, basketball, cricket, and athletic tournaments.",
    color: "#FA7538",
    iconName: "Trophy",
  },
  {
    id: "tech_team",
    name: "Tech Team",
    tagline: "Building Open Source & Campus Innovation",
    description: "The technical spearhead of the department managing web infrastructure, hosting hackathons, and developing automation tools for college administration.",
    color: "#FA7538",
    iconName: "Code",
  },
  {
    id: "media_team",
    name: "Media Wing",
    tagline: "Creative Storytelling, Podcasting & Design",
    description: "Curating the department's visual identity, event photography, tech recap videos, newsletters, and social media outreach.",
    color: "#12192B",
    iconName: "Video",
  },
];
