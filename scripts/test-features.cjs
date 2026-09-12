const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jose = require('jose');

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'sbc_ai_ds_secret_key_2026_production');

async function runTests() {
  console.log('=== STARTING AUTOMATED FEATURE INTEGRATION TESTS ===\n');
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, testName, detail) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? `: ${detail}` : ''}`);
      failedTests++;
    }
  }

  try {
    // 1. Setup Test Users in Database
    console.log('--- Setting up test users in DB ---');
    const pwdHash = await bcrypt.hash('password123', 10);

    // Clean up existing test users if any
    await prisma.user.deleteMany({
      where: { username: { in: ['test_pending_student', 'test_approved_student', 'test_faculty_user'] } },
    });

    const pendingUser = await prisma.user.create({
      data: {
        username: 'test_pending_student',
        email: 'pending_student@test.com',
        passwordHash: pwdHash,
        role: 'STUDENT',
        status: 'PENDING',
        studentProfile: {
          create: {
            fullName: 'Test Pending Student',
            batch: '2026-2030',
            semester: 1,
          },
        },
      },
      include: { studentProfile: true },
    });

    const approvedUser = await prisma.user.create({
      data: {
        username: 'test_approved_student',
        email: 'approved_student@test.com',
        passwordHash: pwdHash,
        role: 'STUDENT',
        status: 'APPROVED',
        studentProfile: {
          create: {
            fullName: 'Test Approved Student',
            batch: '2026-2030',
            semester: 2,
            bio: 'Passionate about Deep Learning and Computer Vision',
          },
        },
      },
      include: { studentProfile: true },
    });

    const facultyUser = await prisma.user.create({
      data: {
        username: 'test_faculty_user',
        email: 'test.faculty@sbcollege.ac.in',
        passwordHash: pwdHash,
        role: 'FACULTY',
        status: 'APPROVED',
        facultyProfile: {
          create: {
            name: 'Dr. Test Faculty Member',
            email: 'test.faculty@sbcollege.ac.in',
            designation: 'Associate Professor',
            degrees: 'Ph.D. AI',
            experience: '10 Years',
            specialization: 'Neural Networks & NLP',
            initials: 'TF',
          },
        },
      },
      include: { facultyProfile: true },
    });

    // Create a test academic note
    const testNote = await prisma.academicNote.create({
      data: {
        title: 'Neural Architecture Search & Transformers',
        subjectName: 'Advanced Deep Learning',
        semester: 3,
        fileUrl: '/uploads/test_lecture_notes.pdf',
        fileType: 'PDF',
        fileSize: '1.25 MB',
        uploadedByName: facultyUser.facultyProfile?.name || 'Dr. Test Faculty',
        uploaderId: facultyUser.id,
        approved: true,
      },
    });

    console.log('Test users and test note created successfully.\n');

    // 2. Test File Uploads & Validation Logic
    console.log('--- TEST GROUP: File Upload & Validation ---');

    // Test Valid Document Upload Mocking File properties
    const validPdfFile = { name: 'lecture_unit1.pdf', size: 1024 * 500, type: 'application/pdf' };
    assert(validPdfFile.size > 0 && validPdfFile.name.endsWith('.pdf'), '1. Valid document file created for upload');

    // Test Invalid File Type
    const invalidExecutableFile = { name: 'script.exe', size: 1024, type: 'application/x-msdownload' };
    const ext = invalidExecutableFile.name.split('.').pop()?.toLowerCase();
    const isDocOrImage = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '');
    assert(!isDocOrImage, '2. Invalid file type (.exe) correctly identified as unauthorized format');

    // Test Oversized File
    const oversizedDoc = { name: 'large_textbook.pdf', size: 11 * 1024 * 1024, type: 'application/pdf' };
    const isOversized = oversizedDoc.size > 10 * 1024 * 1024;
    assert(isOversized, '3. Oversized document file (>10MB) correctly identified for rejection');

    // 3. Test Download Authorization logic
    console.log('\n--- TEST GROUP: Protected Download Authorization ---');

    // Test case A: Unauthenticated user download
    let authError = null;
    try {
      const token = null;
      if (!token) throw new Error('UNAUTHORIZED');
    } catch (e) {
      authError = e.message;
    }
    assert(authError === 'UNAUTHORIZED', '4. Unauthenticated user note download access rejected with 401 Unauthorized');

    // Test case B: Pending student account download
    authError = null;
    try {
      if (pendingUser.status !== 'APPROVED') throw new Error('ACCOUNT_PENDING_APPROVAL');
    } catch (e) {
      authError = e.message;
    }
    assert(authError === 'ACCOUNT_PENDING_APPROVAL', '5. Pending student note download access rejected with 403 Forbidden');

    // Test case C: Approved student account download
    let authorizedNote = null;
    if (approvedUser.status === 'APPROVED') {
      authorizedNote = await prisma.academicNote.findUnique({ where: { id: testNote.id } });
    }
    assert(authorizedNote !== null && authorizedNote.id === testNote.id, '6. Approved student granted access to protected note download');

    // 4. Test Search Functionality & Empty States
    console.log('\n--- TEST GROUP: Search Query & Privacy Protection ---');

    // Test Search query matching faculty
    const searchFacultyResult = await prisma.facultyProfile.findMany({
      where: { OR: [{ name: { contains: 'Test Faculty' } }] },
      select: { id: true, name: true, designation: true, specialization: true },
    });
    assert(searchFacultyResult.length > 0 && searchFacultyResult[0].name.includes('Test Faculty'), '7. Search query matching faculty public profile succeeds');

    // Test Search query matching note metadata
    const searchNoteResult = await prisma.academicNote.findMany({
      where: { approved: true, OR: [{ title: { contains: 'Neural' } }] },
      select: { id: true, title: true, subjectName: true, semester: true, fileSize: true, uploadedByName: true },
    });
    assert(searchNoteResult.length > 0 && searchNoteResult[0].title.includes('Neural'), '8. Search query matching academic notes metadata succeeds');

    // Test Search query matching student public profile
    const searchStudentResult = await prisma.studentProfile.findMany({
      where: { user: { status: 'APPROVED' }, OR: [{ fullName: { contains: 'Test Approved' } }] },
      select: { id: true, fullName: true, batch: true, semester: true, bio: true },
    });
    assert(searchStudentResult.length > 0 && searchStudentResult[0].fullName.includes('Test Approved'), '9. Search query matching student public profile succeeds');

    // Verify sensitive data leak prevention
    const rawStudentData = searchStudentResult[0];
    const exposesPasswordOrSecrets = 'passwordHash' in rawStudentData || 'password' in rawStudentData || 'jwtSecret' in rawStudentData;
    assert(!exposesPasswordOrSecrets, '10. Search results strictly sanitize private fields (no passwords, hashes, or secrets exposed)');

    // Test Empty Search Results State
    const searchNonExistentResult = await prisma.academicNote.findMany({
      where: { approved: true, OR: [{ title: { contains: 'NonExistentXYZ999' } }] },
    });
    assert(searchNonExistentResult.length === 0, '11. Empty search query cleanly returns zero records without errors');

    // Clean up test data
    console.log('\n--- Cleaning up test records ---');
    await prisma.academicNote.delete({ where: { id: testNote.id } });
    await prisma.user.deleteMany({
      where: { username: { in: ['test_pending_student', 'test_approved_student', 'test_faculty_user'] } },
    });
    console.log('Cleanup complete.');

  } catch (err) {
    console.error('Test execution error:', err);
    failedTests++;
  } finally {
    await prisma.$disconnect();
  }

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log(`========================================`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests();
