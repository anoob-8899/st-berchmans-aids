'use client';

import React, { useState } from 'react';
import LoginModal from './LoginModal';

interface NoteItem {
  id: string;
  title: string;
  subjectName: string;
  semester: number;
  fileType: string;
  fileSize: string | null;
  uploadedByName: string;
  createdAt: string | Date;
  facultyProfile?: { name: string } | null;
}

export default function AcademicNotesClient({ initialNotes }: { initialNotes: NoteItem[] }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<number | 'ALL'>('ALL');
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const filteredNotes = selectedSemester === 'ALL'
    ? initialNotes
    : initialNotes.filter((n) => n.semester === selectedSemester);

  const handleDownload = async (noteId: string) => {
    setDownloadError(null);
    try {
      const res = await fetch(`/api/academic/notes/download/${noteId}`);
      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        setDownloadError(data.error || 'Please log in with an approved student/faculty account to download protected lecture files.');
        setIsLoginOpen(true);
        return;
      }

      if (!res.ok) {
        setDownloadError(data.error || 'Failed to download note');
        return;
      }

      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Download error:', err);
      setDownloadError('An unexpected error occurred while initiating file download.');
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Semester Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <button
          onClick={() => setSelectedSemester('ALL')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1.5px solid #EFEAE3',
            background: selectedSemester === 'ALL' ? '#005691' : '#ffffff',
            color: selectedSemester === 'ALL' ? '#ffffff' : '#1C1917',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
          }}
        >
          All Semesters ({initialNotes.length})
        </button>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
          const count = initialNotes.filter((n) => n.semester === sem).length;
          return (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1.5px solid #EFEAE3',
                background: selectedSemester === sem ? '#005691' : '#ffffff',
                color: selectedSemester === sem ? '#ffffff' : '#1C1917',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
              }}
            >
              Sem {sem} ({count})
            </button>
          );
        })}
      </div>

      {/* Alert banner if error occurs */}
      {downloadError && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '14px 20px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>🔒 {downloadError}</div>
          <button onClick={() => setDownloadError(null)} style={{ color: '#991b1b', fontWeight: 'bold' }}>&times;</button>
        </div>
      )}

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div style={{ background: '#ffffff', border: '1.5px solid #EFEAE3', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#1C1917', marginBottom: '8px' }}>
            No Academic Notes Found
          </h4>
          <p style={{ color: '#756860', fontSize: '0.9rem' }}>
            No published lecture notes or study materials exist for this semester filter yet.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredNotes.map((note) => (
            <div key={note.id} style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #EFEAE3', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ background: '#E5F0F9', color: '#005691', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}>
                  Sem {note.semester}
                </span>
                <span style={{ background: '#FBF9F7', color: '#756860', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #EFEAE3' }}>
                  {note.fileType} {note.fileSize ? `(${note.fileSize})` : ''}
                </span>
              </div>

              <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: '#1C1917', fontWeight: 700, marginBottom: '6px' }}>
                {note.title}
              </h4>
              <div style={{ fontSize: '0.86rem', color: '#756860', marginBottom: '16px' }}>
                Subject: <strong>{note.subjectName}</strong> &bull; Uploaded by {note.uploadedByName}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #EFEAE3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#8E827A' }}>
                  🔒 Protected File Access
                </span>
                <button
                  onClick={() => handleDownload(note.id)}
                  className="btn btn-primary btn-sm"
                  style={{ background: '#005691', border: 'none', color: '#ffffff' }}
                >
                  Download File
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={() => {
          setIsLoginOpen(false);
          setDownloadError(null);
        }}
      />
    </div>
  );
}
