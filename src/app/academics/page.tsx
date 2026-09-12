import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTicker from '@/components/LiveTicker';
import CurriculumExplorer from '@/components/CurriculumExplorer';
import AcademicNotesClient from '@/components/AcademicNotesClient';
import ChatWidget from '@/components/ChatWidget';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Academics & Study Notes | AI & Data Science - St. Berchmans College',
  description: 'Explore the FYUGP curriculum, subject syllabi, and lecture notes repository for AI & Data Science.',
};

export default async function AcademicsPage() {
  let notes: any[] = [];
  try {
    notes = await prisma.academicNote.findMany({
      where: { approved: true },
      include: {
        subject: true,
        facultyProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Academics page data fetch error:', err);
  }

  const formattedNotes = notes.map((n) => ({
    id: n.id,
    title: n.title,
    subjectName: n.subjectName,
    semester: n.semester,
    fileType: n.fileType,
    fileSize: n.fileSize,
    uploadedByName: n.uploadedByName,
    createdAt: n.createdAt ? n.createdAt.toISOString() : new Date().toISOString(),
    facultyProfile: n.facultyProfile ? { name: n.facultyProfile.name } : null,
  }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF9F7' }}>
      <Header />
      <LiveTicker />

      <main style={{ flex: 1 }}>
        {/* Banner */}
        <section style={{ background: 'linear-gradient(135deg, #1C1917 0%, #231F1C 100%)', color: '#ffffff', padding: '60px 0', borderBottom: '4px solid #FDB27C' }}>
          <div className="container">
            <div style={{ maxWidth: '800px' }}>
              <span style={{ display: 'inline-block', background: 'rgba(253, 178, 124, 0.2)', color: '#FDB27C', padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Academic Resources
              </span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
                Syllabus & Lecture Notes Repository
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#EFEAE3', lineHeight: 1.6 }}>
                Access semester subjects, core course outlines, and protected lecture materials uploaded by department faculty.
              </p>
            </div>
          </div>
        </section>

        {/* Curriculum Explorer */}
        <CurriculumExplorer />

        {/* Protected Academic Notes Listing */}
        <section style={{ padding: '70px 0', background: '#ffffff', borderTop: '1px solid #EFEAE3' }}>
          <div className="container">
            <div className="section-header" style={{ marginBottom: '30px', textAlign: 'left', maxWidth: 'none' }}>
              <span className="section-tag">Public Note Directory</span>
              <h2 className="section-title">Department Lecture Notes</h2>
              <p className="section-desc">
                Browse available course materials. Downloads require an approved student/faculty account.
              </p>
            </div>

            <AcademicNotesClient initialNotes={formattedNotes} />
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
