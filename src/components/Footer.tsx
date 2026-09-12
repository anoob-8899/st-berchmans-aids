'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer({ onOpenLogin }: { onOpenLogin?: () => void }) {
  return (
    <footer className="main-footer" style={{ background: '#1C1917', color: '#EFEAE3', paddingTop: '60px', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img src="/sbc-crest.svg" alt="SBC Crest" style={{ width: '52px', height: 'auto' }} />
              <div>
                <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.15rem', fontFamily: 'Playfair Display, serif' }}>
                  St. Berchmans College
                </div>
                <div style={{ fontSize: '0.76rem', color: '#FDB27C', fontWeight: 700, letterSpacing: '0.05em' }}>
                  AUTONOMOUS &bull; ESTD 1922
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#756860', lineHeight: 1.6, marginBottom: '14px' }}>
              Department of Artificial Intelligence & Data Science<br />
              Changanassery, Kottayam, Kerala - 686101
            </p>
            <div style={{ fontSize: '0.84rem', color: '#EFEAE3' }}>
              Email: <a href="mailto:aids@sbcollege.ac.in" style={{ color: '#FDB27C' }}>aids@sbcollege.ac.in</a><br />
              Phone: <a href="tel:+919961231314" style={{ color: '#FDB27C' }}>+91 9961231314</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '16px', fontFamily: 'Playfair Display, serif', fontSize: '1.1rem' }}>
              Public Navigation
            </h4>
            <ul style={{ fontSize: '0.88rem', lineHeight: 2.1, listStyle: 'none', padding: 0 }}>
              <li><Link href="/" style={{ color: '#EFEAE3', textDecoration: 'none' }}>Home</Link></li>
              <li><Link href="/about" style={{ color: '#EFEAE3', textDecoration: 'none' }}>About Department</Link></li>
              <li><Link href="/course" style={{ color: '#FDB27C', fontWeight: 600, textDecoration: 'none' }}>B.Sc (Hons.) AI & DS</Link></li>
              <li><Link href="/faculty" style={{ color: '#EFEAE3', textDecoration: 'none' }}>Faculty Directory</Link></li>
              <li><Link href="/students" style={{ color: '#EFEAE3', textDecoration: 'none' }}>Student Profiles</Link></li>
              <li><Link href="/academics" style={{ color: '#EFEAE3', textDecoration: 'none' }}>Academics & Notes</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '16px', fontFamily: 'Playfair Display, serif', fontSize: '1.1rem' }}>
              Student & Campus Hub
            </h4>
            <ul style={{ fontSize: '0.88rem', lineHeight: 2.1, listStyle: 'none', padding: 0 }}>
              <li><Link href="/cocurricular" style={{ color: '#EFEAE3', textDecoration: 'none' }}>Co-curricular Wings</Link></li>
              <li><Link href="/projects" style={{ color: '#EFEAE3', textDecoration: 'none' }}>Student Projects</Link></li>
              <li><Link href="/events" style={{ color: '#EFEAE3', textDecoration: 'none' }}>Department Events</Link></li>
              <li><Link href="/gallery" style={{ color: '#EFEAE3', textDecoration: 'none' }}>Campus Gallery</Link></li>
              <li><Link href="/contact" style={{ color: '#EFEAE3', textDecoration: 'none' }}>Contact & Admission</Link></li>
              <li><Link href="/search" style={{ color: '#FDB27C', fontWeight: 600, textDecoration: 'none' }}>Search Database</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '16px', fontFamily: 'Playfair Display, serif', fontSize: '1.1rem' }}>
              Portal Access
            </h4>
            <ul style={{ fontSize: '0.88rem', lineHeight: 2.1, listStyle: 'none', padding: 0, marginBottom: '16px' }}>
              <li>
                <button onClick={onOpenLogin} style={{ color: '#FDB27C', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
                  Student & Faculty Portal Sign In &rarr;
                </button>
              </li>
              <li><a href="https://sbcollege.ac.in/virtual-tour/" target="_blank" rel="noopener noreferrer" style={{ color: '#EFEAE3', textDecoration: 'none' }}>360° Virtual Campus Tour</a></li>
              <li><a href="https://sbcollege.ac.in/other-payments/" target="_blank" rel="noopener noreferrer" style={{ color: '#EFEAE3', textDecoration: 'none' }}>Online Fee Payments</a></li>
            </ul>
            <div style={{ background: '#231F1C', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: '#756860', border: '1px solid #EFEAE3' }}>
              Autonomous Institution Affiliated to Mahatma Gandhi University, Kottayam &bull; NAAC A++ Re-accredited.
            </div>
          </div>
        </div>

        <div style={{ background: '#141210', padding: '16px 0', textAlign: 'center', fontSize: '0.82rem', color: '#756860', borderTop: '1px solid #231F1C' }}>
          <div className="container">
            Women Helpline: 1091 &nbsp;|&nbsp; Anti-Ragging Toll Free: 1800 180 5522 &nbsp;|&nbsp; Police Emergency: 100
          </div>
        </div>

        <div style={{ padding: '20px 0', textAlign: 'center', fontSize: '0.82rem', color: '#756860' }}>
          &copy; {new Date().getFullYear()} St. Berchmans College (Autonomous) &bull; Department of Artificial Intelligence & Data Science.
        </div>
      </div>
    </footer>
  );
}
