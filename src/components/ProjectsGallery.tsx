'use client';

import React, { useState, useEffect } from 'react';

export default function ProjectsGallery() {
  const [projects, setProjects] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data?.projects) setProjects(data.projects);
      })
      .catch(() => {});

    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (data?.items) setGallery(data.items);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding" id="student-club" style={{ background: '#FBF9F7' }}>
      <div className="container">
        {/* SYNAPSE Student Projects Section */}
        <div className="section-header">
          <span className="section-tag" style={{ background: '#FDB27C', color: '#1C1917' }}>SYNAPSE Innovation Lab</span>
          <h2 className="section-title">Student Portfolio & AI Projects</h2>
          <p className="section-desc">
            Explore cutting-edge Machine Learning, Computer Vision, Indic NLP, and IoT projects engineered by students in the Department of Artificial Intelligence & Data Science.
          </p>
        </div>

        {projects.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '60px' }}>
            {projects.map((p) => (
              <div key={p.id} style={{ background: '#FFFFFF', padding: '24px', borderRadius: '18px', border: '1px solid #EFEAE3', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', background: '#ecfdf5', color: '#047857', borderRadius: '12px', fontWeight: 700, display: 'inline-block' }}>
                    {p.domain}
                  </span>
                  {p.isFeatured && (
                    <span style={{ fontSize: '0.75rem', padding: '4px 10px', background: '#FDB27C', color: '#1C1917', borderRadius: '12px', fontWeight: 800 }}>
                      ★ FEATURED PROJECT
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: '#1C1917', marginBottom: '8px' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#756860', lineHeight: 1.5, marginBottom: '14px' }}>
                  {p.summary}
                </p>
                <div style={{ borderTop: '1px solid #EFEAE3', paddingTop: '10px', fontSize: '0.8rem', color: '#1C1917', fontWeight: 600, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>Team: {p.team}</div>
                  <div>
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noreferrer" style={{ color: '#0284c7', marginRight: '10px', textDecoration: 'underline' }}>
                        GitHub
                      </a>
                    )}
                    {p.demoUrl && (
                      <a href={p.demoUrl} target="_blank" rel="noreferrer" style={{ color: '#0284c7', textDecoration: 'underline' }}>
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px', color: '#756860', fontSize: '0.9rem', marginBottom: '40px' }}>
            SYNAPSE Student Innovation Projects are updated periodically after faculty review.
          </div>
        )}

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <div>
            <div className="section-header" style={{ marginBottom: '24px' }}>
              <span className="section-tag">Campus Life</span>
              <h2 className="section-title">Department Gallery</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              {gallery.map((g) => (
                <div key={g.id} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #EFEAE3', background: '#FFFFFF' }}>
                  <img src={g.imageUrl} alt={g.title || 'Department Gallery'} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1C1917' }}>{g.title}</div>
                    {g.caption && <div style={{ fontSize: '0.8rem', color: '#756860', marginTop: '4px' }}>{g.caption}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
