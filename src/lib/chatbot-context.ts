import { prisma } from './prisma';

export async function getGroundedDepartmentContext(): Promise<{
  systemPrompt: string;
  sources: string;
}> {
  // Fetch live grounded department data from PostgreSQL / Prisma database
  const [faculty, subjects, events, tickers, projects, wings, notes] = await Promise.all([
    prisma.facultyProfile.findMany({
      orderBy: { displayOrder: 'asc' },
      select: {
        name: true,
        designation: true,
        degrees: true,
        experience: true,
        specialization: true,
        email: true,
        publications: true,
      },
    }),
    prisma.subject.findMany({
      orderBy: [{ semester: 'asc' }, { code: 'asc' }],
      select: {
        code: true,
        name: true,
        semester: true,
        credits: true,
        description: true,
      },
    }),
    prisma.event.findMany({
      orderBy: { eventDate: 'asc' },
      select: {
        title: true,
        description: true,
        venue: true,
        eventDate: true,
        category: true,
      },
    }),
    prisma.tickerItem.findMany({
      where: { active: true },
      select: { text: true },
    }),
    prisma.studentProject.findMany({
      where: { approved: true },
      select: {
        title: true,
        domain: true,
        summary: true,
        team: true,
      },
    }),
    prisma.coCurricularWing.findMany({
      select: {
        name: true,
        description: true,
      },
    }),
    prisma.academicNote.findMany({
      where: { approved: true },
      select: {
        title: true,
        subjectName: true,
        semester: true,
      },
    }),
  ]);

  const departmentContext = `
ST. BERCHMANS COLLEGE - DEPARTMENT OF ARTIFICIAL INTELLIGENCE & DATA SCIENCE
=============================================================================
Institution: St. Berchmans College (Autonomous), Changanassery, Kottayam District, Kerala, India - 686101
Accreditation: Autonomous Status conferred by UGC; NAAC A++ Grade in Cycle 5; College with Potential for Excellence.
Programme Offered: B.Sc (Hons.) Artificial Intelligence & Data Science (4-Year FYUGP Degree under Mahatma Gandhi University, Kottayam)
Batch: First Batch 2026-2030
Official Department Email: aids@sbcollege.ac.in
General College Email: sbc@sbcollege.ac.in
Official Contact Phone: +91 9961231314 | College Office: 0481 2420025
Official College Website: https://sbcollege.ac.in

DEPARTMENT FACULTY DIRECTORY:
${
  faculty.length > 0
    ? faculty
        .map(
          (f) =>
            `- ${f.name} (${f.designation}): Degrees: ${f.degrees}. Specialization: ${f.specialization}. Experience: ${f.experience}. Email: ${f.email}.${
              f.publications ? ` Publications: ${f.publications}` : ''
            }`
        )
        .join('\n')
    : 'No faculty profiles currently listed in official database.'
}

CURRICULUM & COURSES (B.Sc Hons AI & DS):
${
  subjects.length > 0
    ? subjects
        .map(
          (s) =>
            `- ${s.code}: ${s.name} (Semester ${s.semester}, ${s.credits} Credits)${
              s.description ? ` - ${s.description}` : ''
            }`
        )
        .join('\n')
    : 'No course records currently listed in official database.'
}

DEPARTMENT EVENTS & SYMPOSIA:
${
  events.length > 0
    ? events
        .map(
          (e) =>
            `- ${e.title} [Category: ${e.category}]: ${e.description} (Venue: ${e.venue}, Date: ${new Date(e.eventDate).toLocaleDateString()})`
        )
        .join('\n')
    : 'No upcoming department events scheduled at this time.'
}

ACTIVE ANNOUNCEMENTS:
${tickers.length > 0 ? tickers.map((t) => `- ${t.text}`).join('\n') : 'No active announcement tickers.'}

APPROVED STUDENT PROJECTS:
${
  projects.length > 0
    ? projects.map((p) => `- "${p.title}" (${p.domain}): ${p.summary} [Team: ${p.team}]`).join('\n')
    : 'No approved student projects currently published.'
}

CO-CURRICULAR WINGS & CLUBS:
${
  wings.length > 0
    ? wings.map((w) => `- ${w.name}: ${w.description}`).join('\n')
    : 'No co-curricular wings currently listed.'
}

ACADEMIC NOTES & STUDY MATERIAL DIRECTORY:
${
  notes.length > 0
    ? notes.map((n) => `- ${n.title} (Subject: ${n.subjectName}, Semester ${n.semester})`).join('\n')
    : 'No public study notes uploaded yet.'
}
`;

  const systemPrompt = `
You are the official AI Chatbot Assistant for the Department of Artificial Intelligence & Data Science at St. Berchmans College (Autonomous), Changanassery.
Your duty is to assist students, prospective applicants, and visitors by providing accurate department information based strictly on official records.

STRICT GROUNDING & SECURITY RULES:
1. Grounding Limit: Answer queries using ONLY the official approved department data provided below.
2. Fact Invention Prohibited: NEVER invent, extrapolate, or guess facts, admission dates, grade requirements, faculty names, projects, or fee policies not present in the context.
3. Handling Unknown Information: If a question cannot be answered using the provided official data below, reply clearly and politely:
"I do not have official department information regarding that topic. Please contact the department office directly at aids@sbcollege.ac.in or +91 9961231314."
4. Privacy & Confidentiality: Do NOT expose or reveal any private user information, passwords, student phone numbers, registration numbers, admin privileges, internal database schemas, or API keys under any circumstances. If requested, state:
"I cannot disclose private account or internal administrative information."
5. Tone: Be helpful, accurate, concise, professional, and friendly.

OFFICIAL APPROVED DEPARTMENT DATA:
${departmentContext}
`;

  return {
    systemPrompt,
    sources: 'St. Berchmans College AI & DS Department Live Database',
  };
}
