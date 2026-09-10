export interface KnowledgeAnswer {
  id?: string;
  keywords: string[];
  answerEn: string;
  answerMl: string;
  relatedLink?: string;
  isCustom?: boolean;
}

export const MARIO_KNOWLEDGE_BASE: KnowledgeAnswer[] = [
  {
    id: "kb-1",
    keywords: ["who are you", "what is mario", "mario", "name", "who made you"],
    answerEn: "Hello! I am MARIO — the AI Department Assistant for the Department of Artificial Intelligence & Data Science at St. Berchmans College (Autonomous), Changanassery. I am here to help you with academic queries, syllabus details, notes, faculty information, projects, events, and campus activities!",
    answerMl: "നമസ്കാരം! ഞാൻ മരിയോ (MARIO) — ചങ്ങനാശ്ശേരി സെന്റ് ബെർക്ക്മാൻസ് കോളേജ് ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസ് & ഡാറ്റ സയൻസ് വകുപ്പിന്റെ ഔദ്യോഗിക എ.ഐ അസിസ്റ്റന്റ് ആണ്. അക്കാദമിക് വിവരങ്ങൾ, സിലബസ്, നോട്ടുകൾ, അധ്യാപകർ, പ്രോജക്റ്റുകൾ, ഇവന്റുകൾ എന്നിവയെക്കുറിച്ചുള്ള നിങ്ങളുടെ സംശയങ്ങൾക്ക് ഉത്തരം നൽകാൻ ഞാൻ സദാ സന്നദ്ധനാണ്!",
    relatedLink: "/about/department"
  },
  {
    id: "kb-2",
    keywords: ["patron", "saint", "berchmans", "john berchmans", "motto", "maximi facere minima"],
    answerEn: "Our college is named after St. John Berchmans (1599–1621), the patron saint of students. Born in Flanders, he is venerated for his studiousness and piety. His famous spiritual motto is 'Maximi facere minima' (Do the most with the least / Perfection in ordinary things).",
    answerMl: "വിദ്യാർത്ഥികളുടെ മധ്യസ്ഥനായ വിശുദ്ധ ജോൺ ബെർക്ക്മാൻസ് (1599–1621) ആണ് നമ്മുടെ കോളേജിന്റെ സ്വർഗ്ഗീയ നാമധാരി. 'മാക്സിമി ഫാസറെ മിനിമ' (Maximi facere minima - സാധാരണ കാര്യങ്ങൾ അത്യധികം പൂർണ്ണതയോടെ ചെയ്യുക) എന്നതാണ് അദ്ദേഹത്തിന്റെ ആപ്തവാക്യം.",
    relatedLink: "/about/patron-saint"
  },
  {
    id: "kb-3",
    keywords: ["history", "college", "founder", "kurialacherry", "1922", "nirf", "ugc", "autonomous", "accreditation"],
    answerEn: "St. Berchmans College was founded in 1922 by Venerable Mar Thomas Kurialacherry, Bishop of Changanassery. It was granted Autonomous status by UGC and the Government of Kerala in 2014. The college is NAAC Re-accredited with an 'A+' grade, supported by DST-FIST, and consistently ranked in the NIRF Top 100 Indian Colleges.",
    answerMl: "1922-ൽ ചങ്ങനാശ്ശേരി രൂപതാധ്യക്ഷൻ വന്ദ്യ മാർ തോമസ് കുര്യാളശ്ശേരിയാണ് സെന്റ് ബെർക്ക്മാൻസ് കോളേജ് സ്ഥാപിച്ചത്. 2014-ൽ യു.ജി.സി സ്വയംഭരണ പദവി (Autonomous) നൽകി. നാക് A+ ഗ്രേഡും NIRF റാങ്കിങ്ങിൽ മികച്ച 100 ഇന്ത്യൻ കോളേജുകളിലും SB കോളേജ് ഇടം നേടിയിട്ടുണ്ട്.",
    relatedLink: "/about/college-profile"
  },
  {
    id: "kb-4",
    keywords: ["skill hub", "sb skill hub", "courses", "ey", "ictak", "asap", "cdit", "burlington", "beda", "26 courses", "timing"],
    answerEn: "SB Skill Hub is an initiative offering 26 industry-certified courses in collaboration with reputed agencies including EY, ICT Academy of Kerala (ICTAK), ASAP Kerala, CDIT, Burlington English, and BEDA. Classes run on weekdays between 2:45 PM and 5:00 PM (and select Saturdays) for an average of 45 hours.",
    answerMl: "വിദ്യാർത്ഥികളുടെ തൊഴിൽ നൈപുണ്യം വർദ്ധിപ്പിക്കുന്നതിനായി EY, ICTAK, ASAP, CDIT, ബർലിംഗ്ടൺ ഇംഗ്ലീഷ്, ബെഡ (BEDA) എന്നിവയുടെ സഹകരണത്തോടെ 26 കോഴ്സുകൾ നൽകുന്ന സംരംഭമാണ് SB Skill Hub. ക്ലാസുകൾ റെഗുലർ സമയത്തിന് ശേഷം വൈകുന്നേരം 2:45 മുതൽ 5:00 വരെയാണ് നടക്കുന്നത് (ശരാശരി 45 മണിക്കൂർ ദൈർഘ്യം).",
    relatedLink: "/about/skill-hub"
  },
  {
    id: "kb-5",
    keywords: ["syllabus", "curriculum", "semester", "subjects", "regulations", "course"],
    answerEn: "You can view and download the official autonomous syllabus for B.Sc. AI & Data Science and M.Sc Artificial Intelligence directly on our Academics > Syllabus page. It contains semester-wise credit splits, core papers, and elective outlines.",
    answerMl: "ഞങ്ങളുടെ Academics > Syllabus പേജിലൂടെ ബി.എസ്.സി & എം.എസ്.സി എ.ഐ കോഴ്സുകളുടെ ഔദ്യോഗിക ഓട്ടോണമസ് സിലബസ് നിങ്ങൾക്ക് ഡൗൺലോഡ് ചെയ്യാം.",
    relatedLink: "/academics/syllabus"
  },
  {
    id: "kb-6",
    keywords: ["notes", "lecture notes", "study material", "pdf", "download notes", "materials"],
    answerEn: "Lecture notes and study materials uploaded by our faculty members are organized by semester and subject under Academics > Lecture Notes. You can search by subject name and download verified PDF guides.",
    answerMl: "അധ്യാപകർ തയ്യാറാക്കിയ ക്ലാസ് നോട്ടുകൾ സെമസ്റ്റർ തിരിച്ച് Academics > Lecture Notes പേജിൽ ലഭ്യമാണ്. വിഷയത്തിന്റെ പേര് നൽകി തിരഞ്ഞ് നിങ്ങൾക്ക് PDF ഫയലുകൾ സൗജന്യമായി ഡൗൺലോഡ് ചെയ്യാം.",
    relatedLink: "/academics/notes"
  },
  {
    id: "kb-7",
    keywords: ["faculty", "teachers", "hod", "professors", "joseph varghese", "staff"],
    answerEn: "Our Department faculty team consists of qualified researchers and educators specializing in AI, Machine Learning, Computer Vision, and Data Science. You can explore their research profiles and contact information on the Faculty page.",
    answerMl: "യോഗ്യതയുള്ള അധ്യാപകരും ഗവേഷകരുമാണ് ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസ് & ഡാറ്റ സയൻസ് ഡിപ്പാർട്ട്മെന്റിനെ നയിക്കുന്നത്. കൂടുതൽ വിവരങ്ങൾ Faculty പേജിൽ ലഭ്യമാണ്.",
    relatedLink: "/people/faculty"
  },
  {
    id: "kb-8",
    keywords: ["activities", "wings", "nss", "ncc", "tech team", "media team", "sports", "co-curricular"],
    answerEn: "The Department has active wings including Tech Team (coding & hackathons), Media Wing (content & photography), NSS (social service & outreach), NCC (cadet leadership), and Sports. When students select wings on their profile, they are automatically displayed on the Activities page!",
    answerMl: "ടെക് ടീം, മീഡിയ വിങ്, എൻ.എസ്.എസ് (NSS), എൻ.സി.സി (NCC), സ്പോർട്സ് എന്നീ വിഭാഗങ്ങൾ ഞങ്ങളുടെ വകുപ്പിൽ സജീവമാണ്. വിദ്യാർത്ഥികൾ പ്രൊഫൈലിൽ നൽകുന്ന വിവരങ്ങൾക്കനുസരിച്ച് പ്രവർത്തന പേജിൽ അവരുടെ പേരുകൾ തത്സമയം ദൃശ്യമാകും!",
    relatedLink: "/activities"
  },
  {
    id: "kb-9",
    keywords: ["projects", "project upload", "rating", "comments", "student projects", "agri malayalam"],
    answerEn: "Students can submit upcoming and completed AI/DS projects with demo URLs, GitHub repositories, and documentation. Visitors and faculty can rate projects (1 to 5 stars) and write review comments on the Projects page.",
    answerMl: "വിദ്യാർത്ഥികൾക്ക് അവരുടെ നൂതന എ.ഐ പ്രോജക്റ്റുകൾ ഇവിടെ സമർപ്പിക്കാം. പ്രോജക്റ്റുകൾക്ക് 1 മുതൽ 5 വരെ സ്റ്റാർ റേറ്റിംഗും വിലയിരുത്തൽ അഭിപ്രായങ്ങളും (Comments) നൽകാനുള്ള സംവിധാനം ലഭ്യമാണ്.",
    relatedLink: "/projects"
  },
  {
    id: "kb-10",
    keywords: ["portal", "login", "student login", "admin login", "faculty login"],
    answerEn: "We feature a unified common portal login for Students, Faculty, and Administrators. After signing in, you will be automatically routed to your respective role-based dashboard.",
    answerMl: "വിദ്യാർത്ഥികൾക്കും അധ്യാപകർക്കും അഡ്മിനുകൾക്കുമായി ഒരൊറ്റ ഏകീകൃത പോർട്ടൽ ലോഗിൻ സൗകര്യമാണ് ഉള്ളത്. ലോഗിൻ ചെയ്ത ശേഷം നിങ്ങളുടെ റോളിന് അനുസരിച്ചുള്ള ഡാഷ്‌ബോർഡിലേക്ക് പ്രവേശിക്കാം.",
    relatedLink: "/portal"
  },
  {
    id: "kb-11",
    keywords: ["events", "hackathon", "summit", "datathon", "workshop"],
    answerEn: "Upcoming events include the 'Kerala State Autonomous AI Summit & Hackathon 2026' on October 14-15 and the 'PyTorch & LLMs Hands-on Workshop' on September 26-28. Check our Events page to register!",
    answerMl: "വരാനിരിക്കുന്ന പ്രധാന ഇവന്റുകൾ: ഒക്ടോബർ 14-15 തീയതികളിൽ നടക്കുന്ന കേരള സ്റ്റേറ്റ് എ.ഐ സമ്മിറ്റ് & ഹാക്കത്തോൺ, സെപ്റ്റംബർ 26-28 തീയതികളിലെ പൈടോർച്ച് വർക്ക്ഷോപ്പ്. ഇവന്റ്സ് പേജ് വഴി ഉടൻ രജിസ്റ്റർ ചെയ്യാം.",
    relatedLink: "/events"
  },
  {
    id: "kb-12",
    keywords: ["admission", "apply", "eligibility", "fees", "contact", "phone", "email"],
    answerEn: "For admissions to B.Sc. and M.Sc AI & Data Science programs, please visit the official college admission portal at sbcollege.ac.in or contact the department office at aids@sbcollege.ac.in / +91 481 2420025.",
    answerMl: "ബി.എസ്.സി, എം.എസ്.സി എ.ഐ & ഡാറ്റ സയൻസ് കോഴ്സുകളിലേക്കുള്ള പ്രവേശനത്തിനായി sbcollege.ac.in വെബ്സൈറ്റ് സന്ദർശിക്കുകയോ വകുപ്പ് ഓഫീസുമായി ബന്ധപ്പെടുകയോ ചെയ്യുക: aids@sbcollege.ac.in / +91 481 2420025.",
    relatedLink: "https://sbcollege.ac.in"
  }
];

export function getCustomKnowledge(): KnowledgeAnswer[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('sb_mario_custom_knowledge');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
  }
  return [];
}

export function queryMarioKnowledge(question: string, lang: 'en' | 'ml' = 'en'): { answer: string; relatedLink?: string } {
  const normalized = question.toLowerCase().trim();
  const customKnowledge = getCustomKnowledge();
  const combined = [...customKnowledge, ...MARIO_KNOWLEDGE_BASE];

  let bestMatch: KnowledgeAnswer | null = null;
  let maxScore = 0;

  for (const item of combined) {
    let score = 0;
    for (const kw of item.keywords) {
      if (kw && normalized.includes(kw.toLowerCase().trim())) {
        score += kw.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore >= 2) {
    return {
      answer: lang === 'ml' ? (bestMatch.answerMl || bestMatch.answerEn) : bestMatch.answerEn,
      relatedLink: bestMatch.relatedLink
    };
  }

  return {
    answer: lang === 'ml'
      ? "ക്ഷമിക്കണം, ഈ ചോദ്യത്തിനുള്ള ഔദ്യോഗിക വിവരം എന്റെ പക്കൽ ലഭ്യമല്ല. ദയവായി ഡിപ്പാർട്ട്‌മെന്റ് ഓഫീസുമായി ബന്ധപ്പെടുക (aids@sbcollege.ac.in / +91 481 2420025) അല്ലെങ്കിൽ ബന്ധപ്പെട്ട കോളേജ് പേജ് സന്ദർശിക്കുക."
      : "I don't have verified official details regarding that specific query in my knowledge base. Please reach out to the Department of AI & Data Science office at aids@sbcollege.ac.in or call +91 481 2420025 for assistance.",
    relatedLink: "/about/department"
  };
}
