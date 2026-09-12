import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTicker from '@/components/LiveTicker';
import AdmissionForm from '@/components/AdmissionForm';
import ChatWidget from '@/components/ChatWidget';

export const metadata = {
  title: 'Contact Us & Admission Enquiries | AI & Data Science - SBC',
  description: 'Reach out to the Department of Artificial Intelligence & Data Science at St. Berchmans College, Changanassery.',
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF9F7' }}>
      <Header />
      <LiveTicker />

      <main style={{ flex: 1 }}>
        {/* Banner */}
        <section style={{ background: 'linear-gradient(135deg, #1C1917 0%, #231F1C 100%)', color: '#ffffff', padding: '60px 0', borderBottom: '4px solid #FDB27C' }}>
          <div className="container">
            <div style={{ maxWidth: '800px' }}>
              <span style={{ display: 'inline-block', background: 'rgba(253, 178, 124, 0.2)', color: '#FDB27C', padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Get In Touch
              </span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
                Contact & Admission Enquiries
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#EFEAE3', lineHeight: 1.6 }}>
                Have questions regarding the B.Sc (Hons.) AI & Data Science program, admission criteria, or research collaborations? We are here to assist you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section style={{ padding: '60px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', marginBottom: '60px' }}>
              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '30px', border: '1.5px solid #EFEAE3', boxShadow: '0 4px 16px rgba(28,25,23,0.04)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#E5F0F9', color: '#005691', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', marginBottom: '16px' }}>
                  📍
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#1C1917', fontWeight: 700, marginBottom: '8px' }}>
                  Campus Address
                </h3>
                <p style={{ fontSize: '0.94rem', color: '#756860', lineHeight: 1.6 }}>
                  Department of Artificial Intelligence & Data Science<br />
                  St. Berchmans College (Autonomous)<br />
                  Changanassery, Kottayam District, Kerala - 686101
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '30px', border: '1.5px solid #EFEAE3', boxShadow: '0 4px 16px rgba(28,25,23,0.04)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FFDFCA', color: '#1C1917', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', marginBottom: '16px' }}>
                  ✉️
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#1C1917', fontWeight: 700, marginBottom: '8px' }}>
                  Email Contacts
                </h3>
                <p style={{ fontSize: '0.94rem', color: '#756860', lineHeight: 1.6 }}>
                  Department Email: <a href="mailto:aids@sbcollege.ac.in" style={{ color: '#005691', fontWeight: 700 }}>aids@sbcollege.ac.in</a><br />
                  General College: <a href="mailto:sbc@sbcollege.ac.in" style={{ color: '#005691', fontWeight: 700 }}>sbc@sbcollege.ac.in</a>
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '30px', border: '1.5px solid #EFEAE3', boxShadow: '0 4px 16px rgba(28,25,23,0.04)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FDB27C', color: '#1C1917', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', marginBottom: '16px' }}>
                  📞
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#1C1917', fontWeight: 700, marginBottom: '8px' }}>
                  Phone Helpline
                </h3>
                <p style={{ fontSize: '0.94rem', color: '#756860', lineHeight: 1.6 }}>
                  Department Office: <a href="tel:+919961231314" style={{ color: '#005691', fontWeight: 700 }}>+91 9961231314</a><br />
                  College Office: 0481 2420025
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Admission Form Component */}
        <AdmissionForm />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
