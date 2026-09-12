import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTicker from '@/components/LiveTicker';
import ChatWidget from '@/components/ChatWidget';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Campus Gallery & Infrastructure | AI & Data Science - St. Berchmans College',
  description: 'View photos of high-performance computing labs, AI workshops, campus events, and student hackathons.',
};

export default async function GalleryPage() {
  let items: any[] = [];
  try {
    items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Gallery page data fetch error:', err);
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
                Visual Showcase
              </span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
                Campus &amp; Department Gallery
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#EFEAE3', lineHeight: 1.6 }}>
                A visual journey through our computing labs, academic events, student project expos, and campus life.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section style={{ padding: '70px 0' }}>
          <div className="container">
            {items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', background: '#ffffff', borderRadius: '24px', border: '1.5px solid #EFEAE3', maxWidth: '720px', margin: '0 auto' }}>
                <div style={{ width: '64px', height: '64px', background: '#E5F0F9', color: '#005691', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  MEDIA
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#1C1917', marginBottom: '12px', fontWeight: 700 }}>
                  No Gallery Images Uploaded Yet
                </h3>
                <p style={{ color: '#756860', lineHeight: 1.65, fontSize: '0.96rem' }}>
                  The photo gallery is currently empty. Authorized department faculty and administrators can upload campus photos and event highlights through the portal.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {items.map((item) => (
                  <div key={item.id} style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #EFEAE3', boxShadow: '0 4px 16px rgba(28,25,23,0.04)' }}>
                    <div style={{ height: '200px', width: '100%', overflow: 'hidden', background: '#EFEAE3' }}>
                      <img src={item.imageUrl} alt={item.title || 'Gallery image'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '18px' }}>
                      <span style={{ background: '#FDB27C', color: '#1C1917', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        {item.category}
                      </span>
                      {item.title && (
                        <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#1C1917', fontWeight: 700, marginTop: '8px', marginBottom: '4px' }}>
                          {item.title}
                        </h4>
                      )}
                      {item.caption && (
                        <p style={{ fontSize: '0.86rem', color: '#756860', margin: 0 }}>
                          {item.caption}
                        </p>
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
