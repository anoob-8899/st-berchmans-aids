import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTicker from '@/components/LiveTicker';
import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Students & Batch Profiles | AI & Data Science - St. Berchmans College',
  description: 'Explore approved student profiles and batch highlights for B.Sc (Hons.) AI & Data Science (2026–2030).',
};

export default async function StudentsPage() {
  let students: any[] = [];
  try {
    students = await prisma.studentProfile.findMany({
      where: {
        user: {
          status: 'APPROVED',
        },
      },
      include: {
        projects: true,
        coCurricularMemberships: {
          include: { wing: true },
        },
      },
      orderBy: { fullName: 'asc' },
    });
  } catch (err) {
    console.error('Students page data fetch error:', err);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF9F7' }}>
      <Header />
      <LiveTicker />

      <main style={{ flex: 1 }}>
        {/* Page Banner */}
        <section style={{ background: 'linear-gradient(135deg, #1C1917 0%, #231F1C 100%)', color: '#ffffff', padding: '60px 0', borderBottom: '4px solid #FDB27C' }}>
          <div className="container">
            <div style={{ maxWidth: '800px' }}>
              <span style={{ display: 'inline-block', background: 'rgba(253, 178, 124, 0.2)', color: '#FDB27C', padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Batch 2026&ndash;2030
              </span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
                Student Directory &amp; Community
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#EFEAE3', lineHeight: 1.6 }}>
                Meet the inaugural cohort of AI &amp; Data Science scholars at St. Berchmans College Autonomous.
              </p>
            </div>
          </div>
        </section>

        {/* Student Directory Grid */}
        <section style={{ padding: '70px 0' }}>
          <div className="container">
            {students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', background: '#ffffff', borderRadius: '24px', border: '1.5px solid #EFEAE3', maxWidth: '720px', margin: '0 auto' }}>
                <div style={{ width: '64px', height: '64px', background: '#FFDFCA', color: '#1C1917', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '1.6rem', fontWeight: 'bold' }}>
                  SBC
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#1C1917', marginBottom: '12px', fontWeight: 700 }}>
                  No Approved Public Student Profiles Yet
                </h3>
                <p style={{ color: '#756860', lineHeight: 1.65, fontSize: '0.96rem', marginBottom: '24px' }}>
                  Newly admitted students can register their student accounts on the portal. Once reviewed and approved by the department administrator, student profiles will appear here.
                </p>
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/course" className="btn btn-primary btn-sm">
                    View Course Details
                  </Link>
                  <Link href="/contact" className="btn btn-gold btn-sm">
                    Admission Enquiries
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
                {students.map((student) => (
                  <div key={student.id} style={{ background: '#ffffff', borderRadius: '20px', padding: '28px', border: '1.5px solid #EFEAE3', boxShadow: '0 4px 16px rgba(28,25,23,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#005691', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Playfair Display, serif' }}>
                        {student.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: '#1C1917', fontWeight: 700 }}>
                          {student.fullName}
                        </h3>
                        <div style={{ fontSize: '0.82rem', color: '#756860' }}>
                          Batch {student.batch} &bull; Semester {student.semester}
                        </div>
                      </div>
                    </div>

                    {student.bio && (
                      <p style={{ fontSize: '0.9rem', color: '#756860', lineHeight: 1.5, marginBottom: '16px' }}>
                        "{student.bio}"
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px', borderTop: '1px solid #EFEAE3', paddingTop: '14px', fontSize: '0.84rem' }}>
                      {student.githubUrl && (
                        <a href={student.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#005691', fontWeight: 600 }}>
                          GitHub Profile &rarr;
                        </a>
                      )}
                      {student.linkedinUrl && (
                        <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#005691', fontWeight: 600 }}>
                          LinkedIn Profile &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
