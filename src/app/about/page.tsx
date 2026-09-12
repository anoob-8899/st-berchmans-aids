import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTicker from '@/components/LiveTicker';
import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';

export const metadata = {
  title: 'About Department | AI & Data Science - St. Berchmans College',
  description: 'Learn about the Department of Artificial Intelligence & Data Science at St. Berchmans College Autonomous, Changanassery.',
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF9F7' }}>
      <Header />
      <LiveTicker />

      <main style={{ flex: 1 }}>
        {/* Page Banner */}
        <section style={{ background: 'linear-gradient(135deg, #1C1917 0%, #231F1C 100%)', color: '#ffffff', padding: '60px 0', borderBottom: '4px solid #FDB27C' }}>
          <div className="container">
            <div style={{ maxWidth: '800px' }}>
              <span style={{ display: 'inline-block', background: 'rgba(253, 178, 124, 0.2)', color: '#FDB27C', padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Department Profile
              </span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
                Pioneering AI & Data Science Education
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#EFEAE3', lineHeight: 1.6 }}>
                Combining hundred-year academic legacy with high-performance computing, neural networks, and ethically grounded technological innovation.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section style={{ padding: '70px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '36px', border: '1.5px solid #EFEAE3', boxShadow: '0 4px 20px rgba(28,25,23,0.05)' }}>
                <div style={{ width: '48px', height: '48px', background: '#E5F0F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#005691', fontWeight: 800, fontSize: '1.2rem' }}>
                  01
                </div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700, color: '#1C1917', marginBottom: '16px' }}>
                  Our Vision
                </h2>
                <p style={{ color: '#756860', lineHeight: 1.7, fontSize: '0.98rem' }}>
                  To be a premier global center of excellence in Artificial Intelligence and Data Science education, research, and application—fostering ethically committed, socially responsible, and technically competent innovators capable of addressing real-world socio-economic challenges.
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '36px', border: '1.5px solid #EFEAE3', boxShadow: '0 4px 20px rgba(28,25,23,0.05)' }}>
                <div style={{ width: '48px', height: '48px', background: '#FFDFCA', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#1C1917', fontWeight: 800, fontSize: '1.2rem' }}>
                  02
                </div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700, color: '#1C1917', marginBottom: '16px' }}>
                  Our Mission
                </h2>
                <ul style={{ color: '#756860', lineHeight: 1.7, fontSize: '0.95rem', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>Deliver strong theoretical foundations and practical skills in AI algorithms, data engineering, and machine learning.</li>
                  <li style={{ marginBottom: '8px' }}>Cultivate interdisciplinary research, industrial collaborations, and innovative problem-solving capability.</li>
                  <li>Inculcate ethical AI governance, human-centered design, and professional integrity.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Institutional Legacy */}
        <section style={{ background: '#EFEAE3', padding: '70px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
              <div>
                <span className="section-tag" style={{ background: '#ffffff', color: '#005691' }}>St. Berchmans Heritage</span>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', color: '#1C1917', fontWeight: 800, marginTop: '10px', marginBottom: '20px' }}>
                  A Century of Academic Excellence & Integrity
                </h2>
                <p style={{ color: '#756860', lineHeight: 1.7, marginBottom: '16px' }}>
                  Founded in 1922, St. Berchmans College (Autonomous) is a premier higher education institution affiliated with Mahatma Gandhi University, Kottayam. Recognized as a <strong>College with Potential for Excellence</strong> by UGC and accredited with an <strong>A++ Grade in Cycle 5 by NAAC</strong>.
                </p>
                <p style={{ color: '#756860', lineHeight: 1.7 }}>
                  The Department of Artificial Intelligence & Data Science represents the modern spearhead of SBC’s academic vision—bridging foundational mathematics, advanced deep learning, and practical cloud AI deployments.
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '24px', padding: '30px', border: '1px solid #E2DBD0', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '20px' }}>
                  Key Accreditation & Milestones
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ background: '#005691', color: '#ffffff', padding: '8px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem' }}>
                      NAAC A++
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#1C1917' }}>Re-accredited with highest distinction in Cycle 5</div>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ background: '#b91c1c', color: '#ffffff', padding: '8px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem' }}>
                      AUTONOMOUS
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#1C1917' }}>Conferred academic autonomy for curriculum innovation</div>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ background: '#FDB27C', color: '#1C1917', padding: '8px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem' }}>
                      FYUGP 2026
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#1C1917' }}>4-Year B.Sc (Hons.) AI & Data Science Degree Program</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Labs & Infrastructure */}
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-tag">High-Performance Computing</span>
              <h2 className="section-title">Labs & Computing Infrastructure</h2>
              <p className="section-desc">
                Equipped with dedicated GPU clusters, edge compute platforms, and modern development software.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'Playfair Display, serif', color: '#1C1917', marginBottom: '10px' }}>
                  NVIDIA AI GPU Workstations
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#756860', lineHeight: 1.6 }}>
                  Dedicated deep learning rigs optimized for training Computer Vision transformers, LLMs, and large neural network models.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'Playfair Display, serif', color: '#1C1917', marginBottom: '10px' }}>
                  TinyML & IoT Hardware Lab
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#756860', lineHeight: 1.6 }}>
                  Microcontroller platforms (Raspberry Pi 5, ESP32-S3, Arduino Portenta) for deploying real-time edge AI models.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'Playfair Display, serif', color: '#1C1917', marginBottom: '10px' }}>
                  Cloud & MLOps Environment
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#756860', lineHeight: 1.6 }}>
                  High-speed campus network with Docker, Kubernetes, and JupyterHub server for collaborative data science experiments.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
