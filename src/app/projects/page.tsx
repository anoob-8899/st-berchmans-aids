import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTicker from '@/components/LiveTicker';
import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Student Projects & Innovation Gallery | AI & Data Science - SBC',
  description: 'Explore research projects, Computer Vision applications, and Machine Learning prototypes built by SBC students.',
};

export default async function ProjectsPage() {
  let projects: any[] = [];
  try {
    projects = await prisma.studentProject.findMany({
      where: { approved: true },
      include: {
        studentProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Projects page data fetch error:', err);
  }

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
                Applied Research & Prototyping
              </span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
                Student Projects & Showcase
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#EFEAE3', lineHeight: 1.6 }}>
                Highlighting real-world AI applications, machine learning experiments, and computer vision systems built by our undergraduate researchers.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section style={{ padding: '70px 0' }}>
          <div className="container">
            {projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', background: '#ffffff', borderRadius: '24px', border: '1.5px solid #EFEAE3', maxWidth: '720px', margin: '0 auto' }}>
                <div style={{ width: '64px', height: '64px', background: '#E5F0F9', color: '#005691', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '1.6rem', fontWeight: 'bold' }}>
                  💻
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#1C1917', marginBottom: '12px', fontWeight: 700 }}>
                  No Approved Student Projects Published Yet
                </h3>
                <p style={{ color: '#756860', lineHeight: 1.65, fontSize: '0.96rem', marginBottom: '24px' }}>
                  Student projects undergo peer review and department approval before publication. Enrolled students can submit their capstone projects via the portal dashboard.
                </p>
                <Link href="/course" className="btn btn-primary btn-sm">
                  View B.Sc AI & DS Course Details
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
                {projects.map((p) => (
                  <div key={p.id} style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', border: '1.5px solid #EFEAE3', boxShadow: '0 4px 16px rgba(28,25,23,0.04)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ background: '#FDB27C', color: '#1C1917', padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        {p.domain}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1C1917', fontWeight: 700, marginBottom: '10px' }}>
                      {p.title}
                    </h3>
                    <p style={{ color: '#756860', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '16px' }}>
                      {p.summary}
                    </p>

                    {p.description && (
                      <p style={{ color: '#8E827A', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
                        {p.description}
                      </p>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #EFEAE3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ fontSize: '0.82rem', color: '#756860' }}>
                        Team: <strong>{p.team}</strong>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        {p.githubUrl && (
                          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#005691', fontWeight: 700, fontSize: '0.86rem', textDecoration: 'none' }}>
                            Code Repo &rarr;
                          </a>
                        )}
                        {p.demoUrl && (
                          <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#b91c1c', fontWeight: 700, fontSize: '0.86rem', textDecoration: 'none' }}>
                            Live Demo &rarr;
                          </a>
                        )}
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
