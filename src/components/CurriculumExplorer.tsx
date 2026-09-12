'use client';

import React, { useState, useEffect } from 'react';

interface Course {
  code: string;
  title: string;
  type: string;
  credits: number;
  hours: number;
}

interface SemesterData {
  semester: number;
  name: string;
  focus: string;
  totalCredits: number;
  courses: Course[];
}

const CURRICULUM_DATA: SemesterData[] = [
  {
    semester: 1,
    name: "Semester 1",
    focus: "Foundations of AI & Computational Problem Solving",
    totalCredits: 22,
    courses: [
      { code: "AIDS101", title: "Introduction to Artificial Intelligence & Modern Intelligent Agents", type: "Major Core", credits: 4, hours: 4 },
      { code: "AIDS102", title: "Algorithmic Problem Solving & Python Programming", type: "Major Core", credits: 4, hours: 4 },
      { code: "MATH101", title: "Linear Algebra & Vector Calculus for Machine Learning", type: "Minor Allied", credits: 4, hours: 4 },
      { code: "ENG101", title: "Communicative English & Technical Writing", type: "AEC (Ability Enhancement)", credits: 3, hours: 3 },
      { code: "AIDS103P", title: "Python for Data Analytics Lab (NumPy, Pandas, Matplotlib)", type: "Practical Lab", credits: 3, hours: 4 },
      { code: "SEC101", title: "Digital Tools, Git/GitHub & Open Source Collaboration", type: "Skill Enhancement", credits: 2, hours: 2 },
      { code: "VAC101", title: "Environmental Sustainability & Green Computing", type: "Value Added", credits: 2, hours: 2 }
    ]
  },
  {
    semester: 2,
    name: "Semester 2",
    focus: "Data Structures, Discrete Math & Statistical Inference",
    totalCredits: 22,
    courses: [
      { code: "AIDS201", title: "Data Structures & Algorithms in Python & C++", type: "Major Core", credits: 4, hours: 4 },
      { code: "AIDS202", title: "Probability Theory & Mathematical Statistics for Data Science", type: "Major Core", credits: 4, hours: 4 },
      { code: "MATH201", title: "Optimization Techniques & Multivariable Calculus", type: "Minor Allied", credits: 4, hours: 4 },
      { code: "AIDS203P", title: "Data Structures & Algorithmic Efficiency Lab", type: "Practical Lab", credits: 3, hours: 4 },
      { code: "AIDS204P", title: "Statistical Modeling & R Computing Lab", type: "Practical Lab", credits: 3, hours: 4 },
      { code: "SEC201", title: "Interactive BI & Data Storytelling with Tableau & Power BI", type: "Skill Enhancement", credits: 2, hours: 2 },
      { code: "VAC202", title: "Ethics, Cyber Privacy & Professional Human Values", type: "Value Added", credits: 2, hours: 2 }
    ]
  },
  {
    semester: 3,
    name: "Semester 3",
    focus: "Core Machine Learning, SQL & Modern Databases",
    totalCredits: 22,
    courses: [
      { code: "AIDS301", title: "Supervised & Unsupervised Machine Learning Algorithms", type: "Major Core", credits: 4, hours: 4 },
      { code: "AIDS302", title: "Database Management Systems (RDBMS & NoSQL/MongoDB)", type: "Major Core", credits: 4, hours: 4 },
      { code: "AIDS303", title: "Discrete Mathematical Structures & Graph Theory", type: "Allied Major", credits: 4, hours: 4 },
      { code: "AIDS304P", title: "Machine Learning with Scikit-Learn & Feature Engineering Lab", type: "Practical Lab", credits: 3, hours: 4 },
      { code: "AIDS305P", title: "Advanced SQL, Indexing & NoSQL Engineering Lab", type: "Practical Lab", credits: 3, hours: 4 },
      { code: "SEC301", title: "Linux System Programming, Bash & Containerization", type: "Skill Enhancement", credits: 2, hours: 2 }
    ]
  },
  {
    semester: 4,
    name: "Semester 4",
    focus: "Deep Learning, Big Data & Cloud Architecture",
    totalCredits: 22,
    courses: [
      { code: "AIDS401", title: "Deep Neural Networks, CNNs & PyTorch Framework", type: "Major Core", credits: 4, hours: 4 },
      { code: "AIDS402", title: "Big Data Processing with Apache Spark & Distributed Systems", type: "Major Core", credits: 4, hours: 4 },
      { code: "AIDS403", title: "Software Engineering Principles, Design Patterns & Agile", type: "Major Core", credits: 3, hours: 3 },
      { code: "AIDS404P", title: "Deep Learning & Neural Network Modeling Lab", type: "Practical Lab", credits: 3, hours: 4 },
      { code: "AIDS405P", title: "Big Data Pipelines & Apache Spark Lab", type: "Practical Lab", credits: 3, hours: 4 },
      { code: "SEC401", title: "Cloud Infrastructure (AWS Cloud Practitioner & GCP)", type: "Skill Enhancement", credits: 3, hours: 3 }
    ]
  },
  {
    semester: 5,
    name: "Semester 5",
    focus: "Computer Vision, Natural Language Processing & Electives",
    totalCredits: 22,
    courses: [
      { code: "AIDS501", title: "Natural Language Processing (NLP) & Text Analytics", type: "Major Core", credits: 4, hours: 4 },
      { code: "AIDS502", title: "Computer Vision & Visual Perception with OpenCV", type: "Major Core", credits: 4, hours: 4 },
      { code: "AIDS503A", title: "Elective I: Reinforcement Learning & Autonomous Agents", type: "Professional Elective", credits: 4, hours: 4 },
      { code: "AIDS504P", title: "NLP, Sentiment Mining & Word Embeddings Lab", type: "Practical Lab", credits: 3, hours: 4 },
      { code: "AIDS505P", title: "Computer Vision, Object Detection & Segmentation Lab", type: "Practical Lab", credits: 3, hours: 4 },
      { code: "RES501", title: "Research Methodology, Experimental Design & IPR", type: "Research Foundation", credits: 4, hours: 4 }
    ]
  },
  {
    semester: 6,
    name: "Semester 6",
    focus: "Generative AI, MLOps, AI Ethics & Capstone Phase I",
    totalCredits: 22,
    courses: [
      { code: "AIDS601", title: "Generative AI, Transformers & Large Language Models (LLMs)", type: "Major Core", credits: 4, hours: 4 },
      { code: "AIDS602", title: "MLOps: Model CI/CD, Monitoring, Docker & Kubernetes", type: "Major Core", credits: 4, hours: 4 },
      { code: "AIDS603B", title: "Elective II: TinyML & Edge AI for Embedded Hardware", type: "Professional Elective", credits: 4, hours: 4 },
      { code: "AIDS604", title: "Responsible AI, Bias Mitigation, Data Governance & Law", type: "Major Core", credits: 3, hours: 3 },
      { code: "PROJ601", title: "Undergraduate Capstone Industry Project (Phase I)", type: "Project Work", credits: 4, hours: 6 }
    ]
  },
  {
    semester: 7,
    name: "Semester 7",
    focus: "Advanced Honours Specializations & Research Colloquium",
    totalCredits: 22,
    courses: [
      { code: "AIDS701", title: "Autonomous Robotics & Intelligent Cyber-Physical Systems", type: "Honours Core", credits: 4, hours: 4 },
      { code: "AIDS702", title: "Bioinformatics, Genomics & Precision Health AI", type: "Honours Core", credits: 4, hours: 4 },
      { code: "AIDS703C", title: "Advanced Elective: Multimodal Diffusion & Generative Audio/Video", type: "Honours Elective", credits: 4, hours: 4 },
      { code: "RES701", title: "Honours Research Proposal, Literature Survey & Seminar", type: "Honours Research", credits: 6, hours: 8 }
    ]
  },
  {
    semester: 8,
    name: "Semester 8",
    focus: "Honours Research Dissertation / Full-Semester Corporate Internship",
    totalCredits: 22,
    courses: [
      { code: "RES801", title: "Honours Research Dissertation (Peer-Reviewed Publication Mandate)", type: "Research Thesis", credits: 12, hours: 16 },
      { code: "INT802", title: "Full-Semester Industry Immersion / Corporate AI Internship", type: "Corporate Internship", credits: 8, hours: 12 },
      { code: "VIVA801", title: "Comprehensive Viva Voce & Academic Defense", type: "Final Defense", credits: 2, hours: 2 }
    ]
  }
];

export default function CurriculumExplorer() {
  const [activeSem, setActiveSem] = useState(1);
  const [notes, setNotes] = useState<any[]>([]);
  const [downloadMsg, setDownloadMsg] = useState('');

  const activeData = CURRICULUM_DATA.find((s) => s.semester === activeSem) || CURRICULUM_DATA[0];

  useEffect(() => {
    fetch(`/api/academic/notes?semester=${activeSem}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.notes) {
          setNotes(data.notes);
        }
      })
      .catch(() => setNotes([]));
  }, [activeSem]);

  const handleDownload = async (noteId: string) => {
    setDownloadMsg('');
    try {
      const res = await fetch(`/api/academic/notes/download/${noteId}`);
      const data = await res.json();

      if (!res.ok) {
        setDownloadMsg(data.error || 'Authentication required for protected downloads.');
        return;
      }

      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err) {
      setDownloadMsg('Failed to process download request');
    }
  };

  return (
    <section className="section-padding" id="curriculum">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Detailed Syllabus</span>
          <h2 className="section-title">Interactive 8-Semester Curriculum & Notes Explorer</h2>
          <p className="section-desc">
            Browse course modules, theory credits, practical lab sessions, and download faculty lecture materials across all eight semesters of the B.Sc (Hons.) programme.
          </p>
        </div>

        <div className="curriculum-container">
          <div className="semester-tabs-wrapper">
            <div className="semester-tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }}>
              {CURRICULUM_DATA.map((sem) => (
                <button
                  key={sem.semester}
                  className={`sem-tab-btn ${sem.semester === activeSem ? 'active' : ''}`}
                  onClick={() => setActiveSem(sem.semester)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: sem.semester === activeSem ? '#005691' : '#f1f5f9',
                    color: sem.semester === activeSem ? '#ffffff' : '#475569'
                  }}
                >
                  Semester {sem.semester}
                </button>
              ))}
            </div>
          </div>

          <div id="semesterViewContainer" style={{ marginTop: '20px' }}>
            <div className="semester-view-header">
              <div>
                <div className="sem-view-title">{activeData.name} ({activeData.focus})</div>
                <div className="sem-view-focus">Four-Year Undergraduate Programme (FYUGP) • National Education Policy Framework</div>
              </div>
              <div className="sem-view-credits">Total Credits: {activeData.totalCredits}</div>
            </div>

            <div className="curriculum-table-responsive" style={{ marginTop: '16px' }}>
              <table className="curriculum-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textTransform: 'uppercase', fontSize: '0.84rem' }}>
                    <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1' }}>Course Code</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1' }}>Course Title</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1' }}>Category</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1' }}>Credits</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1' }}>Instruction</th>
                  </tr>
                </thead>
                <tbody>
                  {activeData.courses.map((c) => (
                    <tr key={c.code} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px' }}><span className="course-code-badge">{c.code}</span></td>
                      <td style={{ padding: '12px' }}><strong>{c.title}</strong></td>
                      <td style={{ padding: '12px' }}>
                        <span className={`course-type-pill ${c.type.includes('Lab') ? 'lab' : (c.type.includes('Major') ? 'major' : '')}`}>
                          {c.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}><strong>{c.credits}</strong> Credits</td>
                      <td style={{ padding: '12px' }}>{c.hours} Hrs/Wk</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Academic Notes & Resources Download Section */}
            <div style={{ marginTop: '32px', background: '#FBF9F7', padding: '24px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: '#1C1917', marginBottom: '14px' }}>
                Semester {activeSem} Faculty Lecture Notes & Protected Resources
              </h3>

              {downloadMsg && (
                <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '8px', fontSize: '0.86rem', marginBottom: '16px' }}>
                  {downloadMsg}
                </div>
              )}

              {notes.length === 0 ? (
                <div style={{ color: '#756860', fontSize: '0.88rem' }}>
                  No published lecture notes yet for Semester {activeSem}. Approved faculty members can upload lecture notes via the Faculty Portal.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {notes.map((n) => (
                    <div key={n.id} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EFEAE3' }}>
                      <div style={{ fontWeight: 700, color: '#1C1917', fontSize: '0.95rem' }}>{n.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#756860', marginTop: '4px' }}>Subject: {n.subjectName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#a8a29e', marginTop: '2px' }}>By: {n.uploadedByName}</div>
                      <button
                        onClick={() => handleDownload(n.id)}
                        style={{
                          marginTop: '12px',
                          padding: '6px 14px',
                          background: '#1C1917',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Download PDF Resource &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
