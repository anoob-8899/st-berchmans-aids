'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  onOpenLogin?: () => void;
  onOpenSearch?: (query: string) => void;
}

export default function Header({ onOpenLogin, onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    window.location.href = '/';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onOpenSearch) {
        onOpenSearch(searchQuery.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* 1. Top Bar */}
      <aside className="top-bar" aria-label="Quick Links and Contact">
        <div className="container top-bar-inner">
          <div className="top-bar-contacts">
            <a href="mailto:aids@sbcollege.ac.in" className="top-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              aids@sbcollege.ac.in
            </a>
            <a href="tel:+919961231314" className="top-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +91 9961231314
            </a>
          </div>

          <div className="top-bar-links">
            <a href="https://sbcollege.ac.in/virtual-tour/" target="_blank" rel="noopener noreferrer" className="top-link">
              360° Virtual Tour
            </a>
            <a href="https://sbcollege.ac.in/other-payments/" target="_blank" rel="noopener noreferrer" className="top-link payment-link">
              ONLINE PAYMENTS
            </a>
            {currentUser ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Link href="/dashboard" className="top-btn-login" style={{ textDecoration: 'none', background: '#FDB27C', color: '#1C1917', fontWeight: 700 }}>
                  Portal ({currentUser.role})
                </Link>
                <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #756860', color: '#1C1917', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <button className="top-btn-login" onClick={onOpenLogin}>Login / Register</button>
            )}
          </div>
        </div>
      </aside>

      {/* 2. Main Header */}
      <header className="main-header" role="banner">
        <div className="container header-inner">
          <Link href="/" className="header-brand">
            <img src="/sbc-crest.svg" alt="St Berchmans College Crest" className="crest-img" />
            <div className="brand-text">
              <div className="college-name">St Berchmans College</div>
              <div className="college-status">
                <span className="badge-autonomous">AUTONOMOUS</span>
                <span>Dept. of Artificial Intelligence & Data Science</span>
                <span className="badge-naac">A++ NAAC</span>
              </div>
              <div className="college-sub">
                Changanassery, Kerala - 686101 &bull; Affiliated to MG University, Kottayam
              </div>
            </div>
          </Link>

          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', background: '#FBF9F7', border: '1.5px solid #EFEAE3', borderRadius: '9999px', padding: '6px 14px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes, faculty, projects..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.86rem', color: '#1C1917', width: '180px' }}
              />
              <button type="submit" aria-label="Submit search" style={{ color: '#005691', cursor: 'pointer', background: 'none', border: 'none', display: 'flex', alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* 3. Desktop Primary Navigation Bar */}
      <nav className="primary-nav" role="navigation" style={{ background: '#005691', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 12px rgba(0, 44, 76, 0.15)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ul className="desktop-nav-menu" style={{ display: 'flex', alignItems: 'center', margin: 0, padding: 0, listStyle: 'none' }}>
            <li><Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link></li>
            <li><Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link></li>
            <li><Link href="/course" className={`nav-link highlight ${isActive('/course') ? 'active' : ''}`}>B.Sc AI & DS</Link></li>
            <li><Link href="/faculty" className={`nav-link ${isActive('/faculty') ? 'active' : ''}`}>Faculty</Link></li>
            <li><Link href="/students" className={`nav-link ${isActive('/students') ? 'active' : ''}`}>Students</Link></li>
            <li><Link href="/academics" className={`nav-link ${isActive('/academics') ? 'active' : ''}`}>Academics</Link></li>
            
            {/* Desktop More Menu Dropdown */}
            <li style={{ position: 'relative' }} onMouseEnter={() => setMoreDropdownOpen(true)} onMouseLeave={() => setMoreDropdownOpen(false)}>
              <button className="nav-link" style={{ background: 'none', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                More
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {moreDropdownOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: '#ffffff', minWidth: '200px', borderRadius: '12px', boxShadow: '0 12px 28px rgba(0,0,0,0.15)', border: '1px solid #EFEAE3', overflow: 'hidden', zIndex: 1100, padding: '8px 0' }}>
                  <Link href="/cocurricular" onClick={() => setMoreDropdownOpen(false)} style={{ display: 'block', padding: '10px 18px', color: '#1C1917', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
                    Co-curricular Wings
                  </Link>
                  <Link href="/projects" onClick={() => setMoreDropdownOpen(false)} style={{ display: 'block', padding: '10px 18px', color: '#1C1917', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
                    Student Projects
                  </Link>
                  <Link href="/events" onClick={() => setMoreDropdownOpen(false)} style={{ display: 'block', padding: '10px 18px', color: '#1C1917', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
                    Department Events
                  </Link>
                  <Link href="/gallery" onClick={() => setMoreDropdownOpen(false)} style={{ display: 'block', padding: '10px 18px', color: '#1C1917', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
                    Campus Gallery
                  </Link>
                  <Link href="/contact" onClick={() => setMoreDropdownOpen(false)} style={{ display: 'block', padding: '10px 18px', color: '#1C1917', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
                    Contact & Admissions
                  </Link>
                  <Link href="/search" onClick={() => setMoreDropdownOpen(false)} style={{ display: 'block', padding: '10px 18px', color: '#005691', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', borderTop: '1px solid #EFEAE3' }}>
                    Search Portal
                  </Link>
                </div>
              )}
            </li>
          </ul>

          <button
            className="mobile-drawer-toggle"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open mobile navigation menu"
            style={{ color: '#ffffff', fontSize: '1.4rem', padding: '10px', display: 'none', cursor: 'pointer' }}
          >
            &#9776; Menu
          </button>
        </div>
      </nav>

      {/* 4. Mobile Slide-In Navigation Drawer */}
      {mobileDrawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,25,23,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setMobileDrawerOpen(false)} />
          
          <div style={{ position: 'relative', width: '300px', maxWidth: '85%', background: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 24px rgba(0,0,0,0.2)', padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #EFEAE3' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.2rem', color: '#1C1917' }}>
                SB College AI & DS
              </div>
              <button onClick={() => setMobileDrawerOpen(false)} style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#756860' }}>
                &times;
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/" onClick={() => setMobileDrawerOpen(false)} style={{ padding: '10px 14px', borderRadius: '8px', color: '#1C1917', fontWeight: 600, background: isActive('/') ? '#FBF9F7' : 'transparent' }}>
                Home
              </Link>
              <Link href="/about" onClick={() => setMobileDrawerOpen(false)} style={{ padding: '10px 14px', borderRadius: '8px', color: '#1C1917', fontWeight: 600, background: isActive('/about') ? '#FBF9F7' : 'transparent' }}>
                About Dept
              </Link>
              <Link href="/course" onClick={() => setMobileDrawerOpen(false)} style={{ padding: '10px 14px', borderRadius: '8px', color: '#005691', fontWeight: 700, background: isActive('/course') ? '#E5F0F9' : 'transparent' }}>
                B.Sc (Hons.) AI & DS
              </Link>
              <Link href="/faculty" onClick={() => setMobileDrawerOpen(false)} style={{ padding: '10px 14px', borderRadius: '8px', color: '#1C1917', fontWeight: 600, background: isActive('/faculty') ? '#FBF9F7' : 'transparent' }}>
                Faculty Directory
              </Link>
              <Link href="/students" onClick={() => setMobileDrawerOpen(false)} style={{ padding: '10px 14px', borderRadius: '8px', color: '#1C1917', fontWeight: 600, background: isActive('/students') ? '#FBF9F7' : 'transparent' }}>
                Students
              </Link>
              <Link href="/academics" onClick={() => setMobileDrawerOpen(false)} style={{ padding: '10px 14px', borderRadius: '8px', color: '#1C1917', fontWeight: 600, background: isActive('/academics') ? '#FBF9F7' : 'transparent' }}>
                Academics & Notes
              </Link>
              <Link href="/cocurricular" onClick={() => setMobileDrawerOpen(false)} style={{ padding: '10px 14px', borderRadius: '8px', color: '#1C1917', fontWeight: 600, background: isActive('/cocurricular') ? '#FBF9F7' : 'transparent' }}>
                Co-curricular Wings
              </Link>
              <Link href="/projects" onClick={() => setMobileDrawerOpen(false)} style={{ padding: '10px 14px', borderRadius: '8px', color: '#1C1917', fontWeight: 600, background: isActive('/projects') ? '#FBF9F7' : 'transparent' }}>
                Student Projects
              </Link>
              <Link href="/events" onClick={() => setMobileDrawerOpen(false)} style={{ padding: '10px 14px', borderRadius: '8px', color: '#1C1917', fontWeight: 600, background: isActive('/events') ? '#FBF9F7' : 'transparent' }}>
                Events
              </Link>
              <Link href="/gallery" onClick={() => setMobileDrawerOpen(false)} style={{ padding: '10px 14px', borderRadius: '8px', color: '#1C1917', fontWeight: 600, background: isActive('/gallery') ? '#FBF9F7' : 'transparent' }}>
                Gallery
              </Link>
              <Link href="/contact" onClick={() => setMobileDrawerOpen(false)} style={{ padding: '10px 14px', borderRadius: '8px', color: '#1C1917', fontWeight: 600, background: isActive('/contact') ? '#FBF9F7' : 'transparent' }}>
                Contact
              </Link>
              <Link href="/search" onClick={() => setMobileDrawerOpen(false)} style={{ padding: '10px 14px', borderRadius: '8px', color: '#005691', fontWeight: 700, background: isActive('/search') ? '#E5F0F9' : 'transparent' }}>
                Search Portal
              </Link>
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #EFEAE3' }}>
              {currentUser ? (
                <Link href="/dashboard" onClick={() => setMobileDrawerOpen(false)} style={{ display: 'block', textAlign: 'center', background: '#FDB27C', color: '#1C1917', padding: '12px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
                  Open Dashboard ({currentUser.role})
                </Link>
              ) : (
                <button onClick={() => { setMobileDrawerOpen(false); if (onOpenLogin) onOpenLogin(); }} style={{ width: '100%', background: '#005691', color: '#ffffff', padding: '12px', borderRadius: '8px', fontWeight: 700 }}>
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Mobile Fixed Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        <Link href="/" className={`bottom-tab ${isActive('/') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Home</span>
        </Link>
        <Link href="/course" className={`bottom-tab ${isActive('/course') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <span>Course</span>
        </Link>
        <Link href="/faculty" className={`bottom-tab ${isActive('/faculty') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Faculty</span>
        </Link>
        <Link href="/academics" className={`bottom-tab ${isActive('/academics') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span>Notes</span>
        </Link>
        <Link href="/search" className={`bottom-tab ${isActive('/search') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Search</span>
        </Link>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .desktop-nav-menu {
            display: none !important;
          }
          .mobile-drawer-toggle {
            display: block !important;
          }
        }
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #ffffff;
          border-top: 1px solid #EFEAE3;
          z-index: 1000;
          justify-content: space-around;
          align-items: center;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
        }
        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
          }
        }
        .bottom-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          color: #756860;
          font-size: 0.72rem;
          font-weight: 600;
          text-decoration: none;
        }
        .bottom-tab.active {
          color: #005691;
          font-weight: 700;
        }
      `}</style>
    </>
  );
}
