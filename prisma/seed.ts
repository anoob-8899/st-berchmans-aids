import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding St. Berchmans AI & DS Portal Database...');

  // 1. Seed Initial Admin Account
  const adminUsername = process.env.ADMIN_INITIAL_USERNAME || 'adminaids';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

  if (!adminPassword || adminPassword.trim() === '') {
    throw new Error(
      'SECURITY ERROR: ADMIN_INITIAL_PASSWORD environment variable is required to run database seed. Please set ADMIN_INITIAL_PASSWORD.'
    );
  }

  // Remove legacy "admin" account if present to avoid duplicate admin accounts
  await prisma.user.deleteMany({
    where: { username: 'admin' },
  });

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const adminUser = await prisma.user.upsert({
    where: { username: adminUsername },
    update: {
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'APPROVED',
    },
    create: {
      username: adminUsername,
      email: 'aids@sbcollege.ac.in',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'APPROVED',
    },
  });
  console.log('Admin user initialized with username:', adminUser.username);

  // 2. Clean legacy unverified faculty records
  console.log('Skipping fake faculty profiles. Official profiles can be created via Admin Portal.');

  // 3. Seed Department Subjects (FYUGP Syllabus Structure)
  const subjects = [
    { code: 'AIDS101', name: 'Fundamentals of Artificial Intelligence', semester: 1, credits: 3 },
    { code: 'AIDS102', name: 'Programming & Data Structures with Python', semester: 1, credits: 4 },
    { code: 'AIDS201', name: 'Data Mining & Warehouse Systems', semester: 2, credits: 3 },
    { code: 'AIDS202', name: 'Linear Algebra & Statistics for AI', semester: 2, credits: 4 },
    { code: 'AIDS301', name: 'Machine Learning Algorithms & Applications', semester: 3, credits: 4 },
    { code: 'AIDS302', name: 'Database Engineering & SQL Systems', semester: 3, credits: 3 },
    { code: 'AIDS401', name: 'Deep Neural Networks & Architectures', semester: 4, credits: 4 },
    { code: 'AIDS402', name: 'Computer Vision & Image Analytics', semester: 4, credits: 3 },
  ];

  for (const s of subjects) {
    await prisma.subject.upsert({
      where: { code: s.code },
      update: s,
      create: s,
    });
  }
  console.log('Department subjects seeded.');

  // 4. Seed Co-Curricular Wings
  const wings = [
    { name: 'SYNAPSE AI Club', slug: 'synapse-ai-club', description: 'Department student association organizing hackathons, workshops, and AI projects.' },
    { name: 'Data Science Forum', slug: 'data-science-forum', description: 'Student interest group focused on Kaggle competitions, analytics, and data visualization.' },
    { name: 'Robotics & TinyML Wing', slug: 'robotics-tinyml-wing', description: 'Hardware lab group deploying edge AI on microcontroller platforms.' },
    { name: 'Competitive Coding Society', slug: 'competitive-coding-society', description: 'Algorithmic problem solving and coding contest training group.' },
    { name: 'NSS (National Service Scheme)', slug: 'nss', description: 'Community outreach, social service, and leadership development.' },
    { name: 'Sports Wing', slug: 'sports-wing', description: 'Department athletics, football, basketball, and intra-college sports teams.' },
    { name: 'Tech Team', slug: 'tech-team', description: 'Department web portal maintenance, cloud infrastructure, and technical operations.' },
    { name: 'NCC (National Cadet Corps)', slug: 'ncc', description: 'National Cadet Corps discipline, fitness, and national service training.' },
  ];

  for (const w of wings) {
    await prisma.coCurricularWing.upsert({
      where: { slug: w.slug },
      update: w,
      create: w,
    });
  }
  console.log('Co-curricular wings seeded.');

  // 5. Seed Live Ticker Announcements
  const tickers = [
    { text: 'Admissions Open 2026-2027: B.Sc (Hons.) Artificial Intelligence & Data Science (4-Year FYUGP)', isNew: true, link: '#admission-section', displayOrder: 1 },
    { text: "National AI Symposium & Hackathon 'SYNAPSE 2026' - Cash Prizes worth ₹1,00,000. Register now!", isNew: true, link: '#student-club', displayOrder: 2 },
    { text: 'MG University Semester Examinations: Linways Portal Hall Ticket Downloads Available', isNew: false, link: 'https://examinations.sbcollege.ac.in/', displayOrder: 3 },
  ];

  await prisma.tickerItem.deleteMany({});
  for (const t of tickers) {
    await prisma.tickerItem.create({ data: t });
  }
  console.log('Ticker announcements seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
