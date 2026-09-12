import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTicker from '@/components/LiveTicker';
import ChatWidget from '@/components/ChatWidget';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Faculty Directory | AI & Data Science - St. Berchmans College',
  description: 'Meet our distinguished faculty members, researchers, and mentors in Artificial Intelligence and Data Science.',
};

export default async function FacultyPage() {
  let faculty: any[] = [];
  try {
    faculty = await prisma.facultyProfile.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  } catch (err) {
    console.error('Faculty page data fetch error:', err);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF9F7' }}>
      <Header />
      <LiveTicker />

      <main style={{ flex: 1 }}>
        <section style={{ background: 'linear-gradient(135deg, #1C1917 0%, #231F1C 100%)', color: '#ffffff', padding: '60px 0', borderBottom: '4px solid #FDB27C' }}>
          <div className="container">
            <div style={{ maxWidth: '800px' }}>
              <span style={{ display: 'inline-block', background: 'rgba(253, 178, 124, 0.2)', color: '#FDB27C', padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Academic Leadership
              </span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
                Faculty Directory
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#EFEAE3', lineHeight: 1.6 }}>
                Guided by experienced professors, research scholars, and industry AI consultants committed to student success.
              </p>
            </div>
          </div>
        </section>

        <section style={{ padding: '70px 0' }}>
          <div className="container">
            {faculty.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '20px', border: '1px solid #EFEAE3', margin: '40px 0' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '10px' }}>
                  No Faculty Members Listed
                </h3>
                <p style={{ color: '#756860', fontSize: '0.95rem' }}>
                  Faculty directory information is currently being updated in the department database.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
                {faculty.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '20px',
                      padding: '32px',
                      border: '1.5px solid #EFEAE3',
                      boxShadow: '0 4px 16px rgba(28,25,23,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '16px',
                          background: '#1C1917',
                          color: '#FDB27C',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.2rem',
                          fontFamily: 'Playfair Display, serif',
                          flexShrink: 0,
                        }}
                      >
                        {f.initials || f.name.substring(0, 1)}
                      </div>
                      <div>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', color: '#1C1917', fontWeight: 700, lineHeight: 1.25, margin: 0 }}>
                          {f.name}
                        </h3>
                        <div style={{ fontSize: '0.85rem', color: '#b91c1c', fontWeight: 700, marginTop: '2px' }}>
                          {f.designation}
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #EFEAE3', paddingTop: '16px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.76rem', color: '#756860', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                          Qualifications & Experience
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#1C1917', fontWeight: 600 }}>
                          {f.degrees} - {f.experience}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.76rem', color: '#756860', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                          Specialization
                        </div>
                        <div style={{ fontSize: '0.88rem', color: '#1C1917', background: '#FBF9F7', padding: '8px 12px', borderRadius: '8px', border: '1px solid #EFEAE3', marginTop: '4px' }}>
                          {f.specialization}
                        </div>
                      </div>

                      {f.publications && (
                        <div>
                          <div style={{ fontSize: '0.76rem', color: '#756860', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                            Publications & Research
                          </div>
                          <div style={{ fontSize: '0.84rem', color: '#756860', marginTop: '2px' }}>
                            {f.publications}
                          </div>
                        </div>
                      )}

                      <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #EFEAE3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
                        <a href={`mailto:${f.email}`} style={{ color: '#005691', fontWeight: 700, textDecoration: 'none' }}>
                          {f.email}
                        </a>
                      </div>
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
