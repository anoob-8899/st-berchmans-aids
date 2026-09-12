'use client';

import React, { useState } from 'react';

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    stream: 'science-maths',
    marks: '',
    city: ''
  });

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setStatusMsg({
        type: 'success',
        text: `Thank you ${formData.fullName}! Your admission enquiry for B.Sc (Hons.) AI & DS has been received.`
      });

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        stream: 'science-maths',
        marks: '',
        city: ''
      });
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'An error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-padding" id="admission-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag gold">Admissions 2025-26</span>
          <h2 className="section-title">Apply for B.Sc (Hons.) AI & Data Science</h2>
          <p className="section-desc">
            Admissions are conducted transparently based on academic merit in Higher Secondary examinations, adhering to MG University autonomous norms.
          </p>
        </div>

        <div className="admission-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', borderRadius: '24px', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
          <div className="admission-info-col" style={{ background: 'linear-gradient(135deg, #005691 0%, #004170 100%)', color: '#ffffff', padding: '42px' }}>
            <h3 className="admission-info-title" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '14px' }}>Admission Guidelines</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Applications are invited from prospective candidates for the upcoming academic cohort. Seats are allocated through Merit and Management quota.
            </p>

            <div className="admission-checklist" style={{ margin: '22px 0' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>&#10004;</span>
                <div><strong>Eligibility:</strong> Plus Two / Higher Secondary with Mathematics / CS (Min 50% Marks).</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>&#10004;</span>
                <div><strong>Approved Intake:</strong> 40 Students per academic year.</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>&#10004;</span>
                <div><strong>Scholarships:</strong> Merit-cum-Means and fee concessions available.</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '16px', marginTop: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>Helpline:</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>+91 9961231314 / 0481-2420025</div>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Email: aids@sbcollege.ac.in</div>
            </div>
          </div>

          <div className="admission-form-col" style={{ padding: '42px', background: '#ffffff' }}>
            <h3 className="form-title" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#004170', marginBottom: '4px' }}>Submit Admission Enquiry</h3>
            <p className="form-subtitle" style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '22px' }}>Fill in your details below for personalized counseling.</p>

            {statusMsg && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.9rem',
                background: statusMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color: statusMsg.type === 'success' ? '#047857' : '#b91c1c',
                border: `1px solid ${statusMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`
              }}>
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '5px' }}>Applicant Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Varghese"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '5px' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '5px' }}>Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '5px' }}>+2 Stream *</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #cbd5e1', borderRadius: '8px' }}
                  >
                    <option value="science-maths">Science (Computer Science + Maths)</option>
                    <option value="science-bio">Science (Biology + Maths)</option>
                    <option value="commerce-maths">Commerce with Maths</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '5px' }}>+2 Percentage *</label>
                  <input
                    type="text"
                    required
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                    placeholder="e.g. 88%"
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '5px' }}>City / Location</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Kottayam / Kochi"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-gold" style={{ width: '100%' }}>
                {isSubmitting ? 'Submitting...' : 'Submit Enquiry & Download Prospectus'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
