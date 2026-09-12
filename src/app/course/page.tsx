import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTicker from '@/components/LiveTicker';
import CurriculumExplorer from '@/components/CurriculumExplorer';
import AdmissionForm from '@/components/AdmissionForm';
import ChatWidget from '@/components/ChatWidget';

export const metadata = {
  title: 'B.Sc (Hons.) Artificial Intelligence & Data Science | St. Berchmans College',
  description: 'Program details, eligibility, syllabus, and career prospects for B.Sc (Hons.) AI & DS (FYUGP 2026–2030).',
};

export default function CoursePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF9F7' }}>
      <Header />
      <LiveTicker />

      <main style={{ flex: 1 }}>
        {/* Course Banner */}
        <section style={{ background: 'linear-gradient(135deg, #005691 0%, #002c4c 100%)', color: '#ffffff', padding: '64px 0', borderBottom: '4px solid #FDB27C' }}>
          <div className="container">
            <div style={{ maxWidth: '850px' }}>
              <span style={{ display: 'inline-block', background: '#FDB27C', color: '#1C1917', padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                4-Year FYUGP Degree &bull; Batch 2026–2030
              </span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
                B.Sc (Hons.) Artificial Intelligence & Data Science
              </h1>
              <p style={{ fontSize: '1.15rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '24px' }}>
                A flagship undergraduate program engineered for future AI architects, data engineers, and machine learning researchers.
              </p>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '12px', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#FDB27C', textTransform: 'uppercase', fontWeight: 700 }}>Duration</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>4 Years (8 Semesters)</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '12px', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#FDB27C', textTransform: 'uppercase', fontWeight: 700 }}>Eligibility</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>10+2 with Math / CS</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '12px', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#FDB27C', textTransform: 'uppercase', fontWeight: 700 }}>Affiliation</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>MG University</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Highlights */}
        <section style={{ padding: '70px 0' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Academic Excellence</span>
              <h2 className="section-title">Program Objectives & Highlights</h2>
              <p className="section-desc">
                Designed according to the UGC Four-Year Undergraduate Framework (FYUGP) with continuous practical lab learning.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '30px', border: '1px solid #EFEAE3' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#1C1917', marginBottom: '12px' }}>
                  Core Theoretical Foundations
                </h3>
                <p style={{ color: '#756860', fontSize: '0.94rem', lineHeight: 1.6 }}>
                  Deep mathematical rigors including Linear Algebra, Probability, Vector Calculus, Mathematical Logic, and Optimization algorithms necessary for modern Deep Learning models.
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '30px', border: '1px solid #EFEAE3' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#1C1917', marginBottom: '12px' }}>
                  Hands-on Systems Engineering
                </h3>
                <p style={{ color: '#756860', fontSize: '0.94rem', lineHeight: 1.6 }}>
                  Intensive coding in Python, C++, SQL, PyTorch, TensorFlow, Apache Spark, and Docker containerization for building production-grade data pipelines.
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '30px', border: '1px solid #EFEAE3' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#1C1917', marginBottom: '12px' }}>
                  Industry Research & Capstone
                </h3>
                <p style={{ color: '#756860', fontSize: '0.94rem', lineHeight: 1.6 }}>
                  Year 4 Honors research dissertation or industry internship project mentored jointly by faculty researchers and industry leaders.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <CurriculumExplorer />

        {/* Career Opportunities */}
        <section style={{ background: '#EFEAE3', padding: '70px 0' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Career Pathways</span>
              <h2 className="section-title">Where Can AI & DS Take You?</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {[
                { title: 'AI Research Scientist', desc: 'Develop novel neural network architectures and multi-modal intelligence algorithms.' },
                { title: 'Machine Learning Engineer', desc: 'Train, evaluate, and deploy scalable ML models into cloud microservices.' },
                { title: 'Data Engineer & Architect', desc: 'Design enterprise data lakes, real-time streaming pipelines, and ETL systems.' },
                { title: 'Computer Vision Engineer', desc: 'Build image segmentation, video analytics, and spatial computing software.' },
                { title: 'NLP / LLM Specialist', desc: 'Fine-tune large language models, retrieval-augmented generation (RAG), and speech agents.' },
              ].map((c, i) => (
                <div key={i} style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #E2DBD0' }}>
                  <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', color: '#1C1917', marginBottom: '8px' }}>
                    {c.title}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#756860', lineHeight: 1.5 }}>
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Admission Form Section */}
        <AdmissionForm />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
