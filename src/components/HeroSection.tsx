'use client';

import React from 'react';

export default function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <img src="/campus-hero.png" alt="St Berchmans College Campus Aerial" className="hero-bg-media" />
      <div className="hero-overlay-gradient"></div>
      <div className="hero-particles"></div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-badge-row" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <div className="hero-dept-badge">
              <span className="hero-live-pulse"></span>
              Department of Artificial Intelligence & Data Science
            </div>
            <span className="badge-autonomous">Autonomous Excellence</span>
          </div>

          <h1 className="hero-headline">
            Where Century-Old Legacy Meets the Frontier of <span className="gold-highlight">Artificial Intelligence</span>
          </h1>

          <p className="hero-lead">
            St. Berchmans College introduces the premier 4-Year <strong>B.Sc (Hons.) in Artificial Intelligence and Data Science</strong> under Mahatma Gandhi University FYUGP. Empowering next-generation data architects, deep learning engineers, and ethical innovators with high-performance GPU supercomputing and industry immersion.
          </p>

          <div className="hero-actions">
            <a href="#admission-section" className="btn btn-gold">
              Apply for Admission 2025-26 &rarr;
            </a>
            <a href="#curriculum" className="btn btn-outline-white">
              Explore 8-Sem Curriculum
            </a>
            <button className="btn btn-outline-white" onClick={() => window.print()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Print Syllabus Summary
            </button>
          </div>

          <div className="hero-stats-strip">
            <div className="stat-item">
              <div className="stat-num">1922</div>
              <div className="stat-label">100+ Years Academic Heritage</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">A++</div>
              <div className="stat-label">NAAC Re-accredited Grade</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">4-Year</div>
              <div className="stat-label">Honours with Research FYUGP</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">100%</div>
              <div className="stat-label">Placement & Internship Guidance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
