'use client';

import React from 'react';

export interface TickerItem {
  id: string;
  text: string;
  isNew: boolean;
  link: string;
}

const DEFAULT_TICKERS: TickerItem[] = [
  { id: '1', text: "Admissions Open 2025-26: B.Sc (Hons.) Artificial Intelligence & Data Science (4-Year FYUGP)", isNew: true, link: "#admission-section" },
  { id: '2', text: "National AI Symposium & Hackathon 'SYNAPSE 2025' - Cash Prizes worth ₹1,00,000. Register now!", isNew: true, link: "#student-club" },
  { id: '3', text: "MG University Semester Examinations: Linways Portal Hall Ticket Downloads Available", isNew: false, link: "https://examinations.sbcollege.ac.in/" },
  { id: '4', text: "Congratulations: Dept Research Paper on 'Early Cardiac Anomaly Detection with ResNet' accepted at IEEE CIST 2025", isNew: false, link: "#faculty" },
  { id: '5', text: "Industry Immersion: Guest Lecture on 'Building Production LLM Agents' by Google Cloud AI Architect on Sept 18", isNew: true, link: "#events" }
];

export default function LiveTicker({ items = DEFAULT_TICKERS }: { items?: TickerItem[] }) {
  return (
    <div className="ticker-wrap" role="region" aria-label="Announcements Ticker">
      <div className="ticker-badge">WHAT'S NEW</div>
      <div className="ticker-marquee">
        <div className="ticker-content">
          {items.map((item, index) => (
            <a key={`${item.id}-${index}`} href={item.link} className="ticker-item">
              <span className="ticker-dot"></span>
              {item.isNew && <span className="ticker-new-pill">NEW</span>}
              <span>{item.text}</span>
            </a>
          ))}
          {/* Duplicate loop for continuous marquee effect */}
          {items.map((item, index) => (
            <a key={`dup-${item.id}-${index}`} href={item.link} className="ticker-item">
              <span className="ticker-dot"></span>
              {item.isNew && <span className="ticker-new-pill">NEW</span>}
              <span>{item.text}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
