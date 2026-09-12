'use client';

import React, { useState, useEffect } from 'react';

export interface FacultyMember {
  id: string | number;
  name: string;
  designation?: string;
  role?: string;
  degrees: string;
  experience: string;
  specialization: string;
  publications?: string | null;
  email: string;
  initials?: string;
}

export default function FacultyGrid({ members: initialMembers }: { members?: FacultyMember[] }) {
  const [members, setMembers] = useState<FacultyMember[]>(initialMembers || []);
  const [loading, setLoading] = useState(!initialMembers);

  useEffect(() => {
    if (!initialMembers) {
      fetch('/api/directories/faculty')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMembers(data);
          } else if (data?.faculty && Array.isArray(data.faculty)) {
            setMembers(data.faculty);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [initialMembers]);

  return (
    <section className="section-padding" id="faculty">
      <div className="container">
        <div className="section-header">
          <span className="section-tag gold">Academic Mentors</span>
          <h2 className="section-title">Faculty & Researchers Directory</h2>
          <p className="section-desc">
            Learn from academicians and researchers guiding the Department of Artificial Intelligence & Data Science.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Loading faculty directory...
          </div>
        ) : members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', color: '#64748b' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1C1917', marginBottom: '8px', fontWeight: 700 }}>Faculty Directory Updating</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Faculty member profiles will be displayed here as official department assignments are updated.
            </p>
          </div>
        ) : (
          <div className="faculty-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {members.map((f) => {
              const displayRole = f.designation || f.role || 'Faculty';
              const displayInitials = f.initials || f.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

              return (
                <div key={f.id} className="faculty-card card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                  <div className="faculty-header" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                    <div className="faculty-avatar" style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #005691, #004170)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {displayInitials}
                    </div>
                    <div className="faculty-meta">
                      <h3 className="faculty-name" style={{ fontSize: '1.18rem', fontWeight: 700, color: '#004170' }}>{f.name}</h3>
                      <div className="faculty-role" style={{ fontSize: '0.82rem', color: '#b91c1c', fontWeight: 600 }}>{displayRole}</div>
                      <div className="faculty-degrees" style={{ fontSize: '0.8rem', color: '#64748b' }}>{f.degrees}</div>
                    </div>
                  </div>

                  <div className="faculty-details-list" style={{ fontSize: '0.86rem', color: '#475569', marginBottom: '16px' }}>
                    <div style={{ marginBottom: '6px' }}><strong>Specialization:</strong> {f.specialization}</div>
                    <div style={{ marginBottom: '6px' }}><strong>Experience:</strong> {f.experience}</div>
                    {f.publications && <div><strong>Research:</strong> {f.publications}</div>}
                  </div>

                  <div className="faculty-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                    <a href={`mailto:${f.email}`} className="faculty-email-link" style={{ color: '#005691', fontWeight: 600 }}>
                      {f.email}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
