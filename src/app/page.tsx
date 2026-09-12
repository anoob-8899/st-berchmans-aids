'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import LiveTicker from '@/components/LiveTicker';
import HeroSection from '@/components/HeroSection';
import CurriculumExplorer from '@/components/CurriculumExplorer';
import FacultyGrid from '@/components/FacultyGrid';
import ProjectsGallery from '@/components/ProjectsGallery';
import AdmissionForm from '@/components/AdmissionForm';
import LoginModal from '@/components/LoginModal';
import ChatWidget from '@/components/ChatWidget';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ faculty: any[]; tickers: any[]; notes: any[] } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenSearch={handleSearch}
      />

      <LiveTicker />

      {/* User Badge if Logged In */}
      {currentUser && (
        <div style={{ background: '#ecfdf5', borderBottom: '1px solid #a7f3d0', padding: '10px 20px', fontSize: '0.88rem', color: '#047857', textAlign: 'center', fontWeight: 600 }}>
          Welcome back, {currentUser.fullName || currentUser.username} ({currentUser.role} Portal Active)
        </div>
      )}

      {/* Search Results Modal / Banner */}
      {searchResults && (
        <div style={{ background: '#ffffff', border: '2px solid #1C1917', padding: '24px', margin: '20px auto', maxWidth: '1240px', width: '90%', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1C1917', fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>
              Search Results for "{searchQuery}"
            </h3>
            <button onClick={() => setSearchResults(null)} style={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', background: 'none', border: 'none' }}>&times;</button>
          </div>

          {searchResults.faculty.length === 0 && searchResults.tickers.length === 0 && searchResults.notes.length === 0 ? (
            <p style={{ color: '#756860' }}>No exact database records found for "{searchQuery}". Try searching for course codes (e.g. AIDS101) or notes.</p>
          ) : (
            <div>
              {searchResults.faculty.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <h4 style={{ color: '#1C1917', fontWeight: 700 }}>Faculty Directory Matches:</h4>
                  <ul>
                    {searchResults.faculty.map((f: any) => (
                      <li key={f.id} style={{ fontSize: '0.9rem', margin: '4px 0', color: '#756860' }}>
                        <strong>{f.name}</strong> - {f.designation} ({f.specialization})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {searchResults.notes.length > 0 && (
                <div>
                  <h4 style={{ color: '#1C1917', fontWeight: 700 }}>Academic Note Matches:</h4>
                  <ul>
                    {searchResults.notes.map((n: any) => (
                      <li key={n.id} style={{ fontSize: '0.9rem', margin: '4px 0', color: '#756860' }}>
                        <strong>{n.title}</strong> (Subject: {n.subjectName}, Sem {n.semester})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <main style={{ flex: 1 }}>
        <HeroSection />

        {/* Dept Profile Overview */}
        <section className="section-padding" id="department-profile">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Department Profile</span>
              <h2 className="section-title">Futuristic Education Rooted in Jesuit Academic Rigor</h2>
              <p className="section-desc">
                The Department of Artificial Intelligence & Data Science at St. Berchmans College is dedicated to equipping students with cutting-edge knowledge and hands-on skills in AI, machine learning, and data analytics.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', color: '#1C1917', fontFamily: 'Playfair Display, serif', marginBottom: '14px' }}>
                  Vision & Innovation Imperative
                </h3>
                <p style={{ color: '#756860', lineHeight: 1.65, marginBottom: '16px' }}>
                  To be a premier center of excellence in Artificial Intelligence and Data Science education and research, fostering ethically committed, socially responsible, and technically competent innovators capable of addressing real-world socio-economic challenges through intelligent technologies.
                </p>
              </div>

              <div style={{ background: '#FBF9F7', border: '1.5px solid #EFEAE3', borderRadius: '18px', padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#1C1917', color: '#FDB27C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AI</div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', color: '#1C1917', fontFamily: 'Playfair Display, serif' }}>Department Leadership</h4>
                    <div style={{ fontSize: '0.82rem', color: '#b91c1c', fontWeight: 600 }}>St. Berchmans College (Autonomous)</div>
                  </div>
                </div>
                <blockquote style={{ fontStyle: 'italic', color: '#1C1917', fontSize: '0.94rem', lineHeight: 1.6, borderLeft: '3px solid #FDB27C', paddingLeft: '14px' }}>
                  "Empowering students with theoretical foundations in Artificial Intelligence and Data Science, deep learning frameworks, and an unshakeable commitment to Jesuit academic excellence and ethics."
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        <CurriculumExplorer />

        <FacultyGrid />

        <ProjectsGallery />

        <AdmissionForm />
      </main>

      <Footer onOpenLogin={() => setIsLoginOpen(true)} />

      <ChatWidget />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
}
