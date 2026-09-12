import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTicker from '@/components/LiveTicker';
import ChatWidget from '@/components/ChatWidget';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Co-curricular Wings & Clubs | AI & Data Science - St. Berchmans College',
  description: 'Student associations, robotics clubs, hackathons, and competitive coding forums at SBC AI & DS.',
};

export default async function CoCurricularPage() {
  let wings: any[] = [];
  try {
    wings = await prisma.coCurricularWing.findMany({
      include: {
        memberships: {
          include: {
            studentProfile: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  } catch (err) {
    console.error('Co-curricular page data fetch error:', err);
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
                Student Clubs &amp; Innovations
              </span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
                Co-curricular Wings &amp; Hubs
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#EFEAE3', lineHeight: 1.6 }}>
                Student-driven technical societies fostering AI hackathons, open-source projects, edge hardware prototyping, and competitive problem solving.
              </p>
            </div>
          </div>
        </section>

        {/* Wings Display */}
        <section style={{ padding: '70px 0' }}>
          <div className="container">
            {wings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', background: '#ffffff', borderRadius: '20px', border: '1px solid #EFEAE3' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '8px' }}>
                  No Co-curricular Wings Registered
                </h3>
                <p style={{ color: '#756860', fontSize: '0.95rem' }}>
                  Co-curricular wing details are being initialized in the database.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                {wings.map((wing) => (
                  <div key={wing.id} style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', border: '1.5px solid #EFEAE3', boxShadow: '0 4px 16px rgba(28,25,23,0.04)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FFDFCA', color: '#1C1917', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', marginBottom: '20px' }}>
                      HUB
                    </div>

                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#1C1917', fontWeight: 700, marginBottom: '12px' }}>
                      {wing.name}
                    </h3>
                    <p style={{ color: '#756860', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '24px' }}>
                      {wing.description}
                    </p>

                    <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #EFEAE3' }}>
                      <div style={{ fontSize: '0.82rem', color: '#756860', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                        Active Members ({wing.memberships.length})
                      </div>
                      {wing.memberships.length === 0 ? (
                        <div style={{ fontSize: '0.86rem', color: '#8E827A', fontStyle: 'italic' }}>
                          No student members registered yet for this wing. Admitted students can join via their portal profile.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {wing.memberships.map((m: any) => (
                            <div key={m.id} style={{ fontSize: '0.88rem', color: '#1C1917', background: '#FBF9F7', padding: '6px 12px', borderRadius: '8px', border: '1px solid #EFEAE3', display: 'flex', justifyContent: 'space-between' }}>
                              <span>{m.studentProfile.fullName}</span>
                              <span style={{ color: '#005691', fontWeight: 600 }}>{m.role}</span>
                            </div>
                          ))}
                        </div>
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
