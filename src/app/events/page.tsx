import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTicker from '@/components/LiveTicker';
import ChatWidget from '@/components/ChatWidget';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Department Events & Hackathons | AI & Data Science - St. Berchmans College',
  description: 'Upcoming AI symposia, guest lectures, coding contests, and workshops organized by the Dept of AI & DS.',
};

export default async function EventsPage() {
  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
      orderBy: { eventDate: 'asc' },
    });
  } catch (err) {
    console.error('Events page data fetch error:', err);
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
                Conferences &amp; Symposia
              </span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
                Department Events &amp; Workshops
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#EFEAE3', lineHeight: 1.6 }}>
                Discover national AI hackathons, expert guest lectures, industrial workshops, and departmental academic seminars.
              </p>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section style={{ padding: '70px 0' }}>
          <div className="container">
            {events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', background: '#ffffff', borderRadius: '24px', border: '1.5px solid #EFEAE3', maxWidth: '720px', margin: '0 auto' }}>
                <div style={{ width: '64px', height: '64px', background: '#FFDFCA', color: '#1C1917', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  EVENTS
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#1C1917', marginBottom: '12px', fontWeight: 700 }}>
                  No Department Events Scheduled Currently
                </h3>
                <p style={{ color: '#756860', lineHeight: 1.65, fontSize: '0.96rem' }}>
                  There are no active upcoming events or hackathons posted in the department schedule at this time. Check back soon for announcements on SYNAPSE 2026!
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                {events.map((e) => {
                  const formattedDate = new Date(e.eventDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <div key={e.id} style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', border: '1.5px solid #EFEAE3', boxShadow: '0 4px 16px rgba(28,25,23,0.04)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ background: '#005691', color: '#ffffff', padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                          {e.category}
                        </span>
                        {e.isFeatured && (
                          <span style={{ background: '#FDB27C', color: '#1C1917', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                            FEATURED
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1C1917', fontWeight: 700, marginBottom: '12px' }}>
                        {e.title}
                      </h3>

                      <p style={{ color: '#756860', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '20px' }}>
                        {e.description}
                      </p>

                      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #EFEAE3', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem' }}>
                        <div style={{ color: '#1C1917', fontWeight: 600 }}>
                          Venue: <span style={{ color: '#756860', fontWeight: 400 }}>{e.venue}</span>
                        </div>
                        <div style={{ color: '#1C1917', fontWeight: 600 }}>
                          Date: <span style={{ color: '#005691', fontWeight: 700 }}>{formattedDate}</span>
                        </div>

                        {e.registrationUrl && (
                          <div style={{ marginTop: '12px' }}>
                            <a href={e.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ width: '100%', textDecoration: 'none' }}>
                              Register Now &rarr;
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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
