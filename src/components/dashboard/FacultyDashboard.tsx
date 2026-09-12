'use client';

import React, { useState, useEffect } from 'react';

interface FacultyDashboardProps {
  user: any;
  profile: any;
}

export default function FacultyDashboard({ user, profile: initialProfile }: FacultyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'gallery' | 'profile' | 'directories'>('notes');
  
  // Faculty Profile State
  const [profile, setProfile] = useState(initialProfile || {});
  const [profName, setProfName] = useState(initialProfile?.name || user?.fullName || '');
  const [profDesignation, setProfDesignation] = useState(initialProfile?.designation || 'Assistant Professor');
  const [profDegrees, setProfDegrees] = useState(initialProfile?.degrees || 'M.Tech');
  const [profExp, setProfExp] = useState(initialProfile?.experience || '5+ Years');
  const [profSpec, setProfSpec] = useState(initialProfile?.specialization || 'Artificial Intelligence');
  const [profPubs, setProfPubs] = useState(initialProfile?.publications || '');
  const [profPhone, setProfPhone] = useState(initialProfile?.phone || '');
  const [profInitials, setProfInitials] = useState(initialProfile?.initials || 'FC');
  const [profAvatar, setProfAvatar] = useState(initialProfile?.avatarUrl || '');
  const [profEmail, setProfEmail] = useState(initialProfile?.email || user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: '', isError: false });

  // Notes State
  const [noteTitle, setNoteTitle] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [semester, setSemester] = useState(1);
  const [fileUrl, setFileUrl] = useState('');
  const [noteFileType, setNoteFileType] = useState('PDF');
  const [noteFileSize, setNoteFileSize] = useState('');
  const [uploadingNoteFile, setUploadingNoteFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [noteMsg, setNoteMsg] = useState({ text: '', isError: false });
  const [notesList, setNotesList] = useState<any[]>(initialProfile?.notes || []);
  const [editingNote, setEditingNote] = useState<any | null>(null);

  // Gallery State
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('CAMPUS');
  const [galleryImageUrl, setGalleryImageUrl] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryMsg, setGalleryMsg] = useState({ text: '', isError: false });
  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  // Directories State
  const [students, setStudents] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentSem, setStudentSem] = useState<string>('');
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loadingDirectory, setLoadingDirectory] = useState(false);
  const [directoryTab, setDirectoryTab] = useState<'students' | 'faculty'>('students');

  // Confirmation modal state for destructive actions
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const triggerConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Fetch Own Notes
  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/faculty/notes');
      const data = await res.json();
      if (res.ok) setNotesList(data.notes || []);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    }
  };

  // Fetch Gallery Items
  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (res.ok) {
        // filter gallery items uploaded by this faculty
        const myItems = (data.items || []).filter((i: any) => i.uploaderId === user.id);
        setGalleryItems(myItems);
      }
    } catch (err) {
      console.error('Failed to fetch gallery', err);
    }
  };

  // Fetch Directories
  const fetchStudentDirectory = async () => {
    setLoadingDirectory(true);
    try {
      const params = new URLSearchParams();
      if (studentSearch) params.set('search', studentSearch);
      if (studentSem) params.set('semester', studentSem);
      const res = await fetch(`/api/directories/students?${params.toString()}`);
      const data = await res.json();
      if (res.ok) setStudents(data.students || []);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoadingDirectory(false);
    }
  };

  const fetchFacultyDirectory = async () => {
    try {
      const res = await fetch('/api/directories/faculty');
      const data = await res.json();
      if (res.ok) setFaculties(data.faculty || []);
    } catch (err) {
      console.error('Failed to fetch faculty directory', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (activeTab === 'gallery') fetchGallery();
    if (activeTab === 'directories') {
      fetchStudentDirectory();
      fetchFacultyDirectory();
    }
  }, [activeTab]);

  // Handle Update Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ text: '', isError: false });

    try {
      const res = await fetch('/api/faculty/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profName,
          designation: profDesignation,
          degrees: profDegrees,
          experience: profExp,
          specialization: profSpec,
          publications: profPubs,
          email: profEmail,
          phone: profPhone,
          initials: profInitials,
          avatarUrl: profAvatar,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setProfile(data.profile);
      setProfileMsg({ text: 'Faculty profile updated successfully!', isError: false });
    } catch (err: any) {
      setProfileMsg({ text: err.message || 'Error updating profile', isError: true });
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Note File Upload
  const handleNoteFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingNoteFile(true);
    setNoteMsg({ text: '', isError: false });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload document file');

      setFileUrl(data.fileUrl);
      if (data.fileType) setNoteFileType(data.fileType);
      if (data.fileSize) setNoteFileSize(data.fileSize);
      setNoteMsg({ text: `Document uploaded: ${data.fileName} (${data.fileSize || 'Durable Storage'}). Ready to publish!`, isError: false });
    } catch (err: any) {
      setNoteMsg({ text: err.message || 'Error uploading document file', isError: true });
    } finally {
      setUploadingNoteFile(false);
    }
  };

  // Handle Gallery Photo File Upload
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGallery(true);
    setGalleryMsg({ text: '', isError: false });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image file');

      setGalleryImageUrl(data.fileUrl);
      setGalleryMsg({ text: 'Photo uploaded to durable storage! Ready to publish.', isError: false });
    } catch (err: any) {
      setGalleryMsg({ text: err.message || 'Error uploading photo file', isError: true });
    } finally {
      setUploadingGallery(false);
    }
  };

  // Handle Publish Note
  const handleUploadNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setNoteMsg({ text: '', isError: false });

    try {
      if (!fileUrl) {
        throw new Error('Please select a document file to upload or enter a file URL');
      }

      const res = await fetch('/api/faculty/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noteTitle,
          subjectName,
          semester: Number(semester),
          fileUrl,
          fileType: noteFileType || 'PDF',
          fileSize: noteFileSize || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setNotesList([data.note, ...notesList]);
      setNoteTitle('');
      setSubjectName('');
      setFileUrl('');
      setNoteFileSize('');
      setNoteMsg({ text: 'Academic note published successfully!', isError: false });
    } catch (err: any) {
      setNoteMsg({ text: err.message || 'Error uploading note', isError: true });
    } finally {
      setUploading(false);
    }
  };

  // Handle Edit Note
  const handleSaveEditNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    try {
      const res = await fetch(`/api/faculty/notes/${editingNote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingNote.title,
          subjectName: editingNote.subjectName,
          semester: Number(editingNote.semester),
          fileUrl: editingNote.fileUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update note');

      setEditingNote(null);
      fetchNotes();
      setNoteMsg({ text: 'Academic note updated successfully.', isError: false });
    } catch (err: any) {
      setNoteMsg({ text: err.message || 'Error updating note', isError: true });
    }
  };

  // Handle Delete Note (Destructive with Confirmation)
  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    triggerConfirm(
      'Delete Academic Resource',
      `Are you sure you want to permanently delete the note "${noteTitle}"?`,
      async () => {
        try {
          const res = await fetch(`/api/faculty/notes/${noteId}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to delete note');
          fetchNotes();
          setNoteMsg({ text: 'Academic note deleted successfully.', isError: false });
        } catch (err: any) {
          setNoteMsg({ text: err.message || 'Error deleting note', isError: true });
        }
      }
    );
  };

  // Handle Upload Gallery Image
  const handleUploadGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingGallery(true);
    setGalleryMsg({ text: '', isError: false });

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: galleryTitle,
          caption: galleryCaption,
          category: galleryCategory,
          imageUrl: galleryImageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gallery upload failed');

      setGalleryTitle('');
      setGalleryCaption('');
      setGalleryImageUrl('');
      setGalleryMsg({ text: 'Gallery photo published!', isError: false });
      fetchGallery();
    } catch (err: any) {
      setGalleryMsg({ text: err.message || 'Error uploading gallery item', isError: true });
    } finally {
      setUploadingGallery(false);
    }
  };

  // Handle Delete Gallery Photo (Destructive with Confirmation)
  const handleDeleteGallery = (itemId: string) => {
    triggerConfirm(
      'Delete Gallery Photo',
      'Are you sure you want to remove this photo from the department gallery?',
      async () => {
        try {
          const res = await fetch(`/api/gallery/${itemId}`, { method: 'DELETE' });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Delete failed');
          fetchGallery();
          setGalleryMsg({ text: 'Gallery photo deleted.', isError: false });
        } catch (err: any) {
          setGalleryMsg({ text: err.message || 'Error deleting photo', isError: true });
        }
      }
    );
  };

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Faculty Banner */}
      <div style={{ background: '#1C1917', color: '#FFFFFF', padding: '32px', borderRadius: '16px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ display: 'inline-block', padding: '4px 10px', background: '#FDB27C', color: '#1C1917', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px' }}>
            FACULTY PORTAL
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>
            {profile?.name || user.fullName || user.username}
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#EFEAE3', marginTop: '6px', margin: 0 }}>
            {profile?.designation || 'Faculty Member'} | {profile?.degrees || 'Dept of AI & DS'}
          </p>
        </div>
        <div style={{ background: '#231F1C', padding: '12px 18px', borderRadius: '12px', border: '1px solid #756860', fontSize: '0.84rem' }}>
          <div>Email: <strong>{profile?.email || user.email || user.username}</strong></div>
          <div style={{ fontSize: '0.78rem', color: '#a8a29e', marginTop: '4px' }}>St. Berchmans Dept. of AI & DS</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #EFEAE3', marginBottom: '24px', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('notes')}
          style={{
            padding: '10px 18px',
            fontWeight: 600,
            fontSize: '0.92rem',
            color: activeTab === 'notes' ? '#1C1917' : '#756860',
            borderBottom: activeTab === 'notes' ? '3px solid #FDB27C' : 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Notes & Lecture Resources ({notesList.length})
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          style={{
            padding: '10px 18px',
            fontWeight: 600,
            fontSize: '0.92rem',
            color: activeTab === 'gallery' ? '#1C1917' : '#756860',
            borderBottom: activeTab === 'gallery' ? '3px solid #FDB27C' : 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Gallery Photo Uploads
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '10px 18px',
            fontWeight: 600,
            fontSize: '0.92rem',
            color: activeTab === 'profile' ? '#1C1917' : '#756860',
            borderBottom: activeTab === 'profile' ? '3px solid #FDB27C' : 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Edit Faculty Profile
        </button>
        <button
          onClick={() => setActiveTab('directories')}
          style={{
            padding: '10px 18px',
            fontWeight: 600,
            fontSize: '0.92rem',
            color: activeTab === 'directories' ? '#1C1917' : '#756860',
            borderBottom: activeTab === 'directories' ? '3px solid #FDB27C' : 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Directories View (Students / Faculty)
        </button>
      </div>

      {/* TAB 1: Academic Notes & Lecture Resources */}
      {activeTab === 'notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Form */}
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              Publish Academic Note / Resource
            </h2>
            <form onSubmit={handleUploadNote}>
              {noteMsg.text && (
                <div style={{ padding: '10px', background: noteMsg.isError ? '#fef2f2' : '#f0fdf4', color: noteMsg.isError ? '#991b1b' : '#166534', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '14px' }}>
                  {noteMsg.text}
                </div>
              )}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Note Title *</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Unit 3 - Transformer Attention Mechanisms"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="e.g. Deep Neural Networks"
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Semester *</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>
                  Document File Upload (PDF, DOC, PPT, TXT max 10MB) *
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={handleNoteFileUpload}
                    disabled={uploadingNoteFile}
                    style={{ fontSize: '0.82rem' }}
                  />
                  {uploadingNoteFile && <span style={{ fontSize: '0.78rem', color: '#756860' }}>Uploading file...</span>}
                </div>
                <input
                  type="text"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="Document file URL or path (/uploads/...)"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                style={{ padding: '10px 20px', background: '#1C1917', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                {uploading ? 'Publishing...' : 'Publish Academic Resource'}
              </button>
            </form>
          </div>

          {/* List of permitted own notes */}
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              My Published Resources
            </h2>
            {notesList.length === 0 ? (
              <div style={{ background: '#FBF9F7', padding: '32px', textAlign: 'center', borderRadius: '16px', border: '1px border-dashed #EFEAE3', color: '#756860' }}>
                No notes published yet. Fill in the resource details on the left to share lecture materials.
              </div>
            ) : (
              notesList.map((n: any) => (
                <div key={n.id} style={{ background: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #EFEAE3', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C1917', margin: 0 }}>{n.title}</h3>
                    <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#fef3c7', color: '#92400e', borderRadius: '12px', fontWeight: 600 }}>
                      Sem {n.semester}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#756860', marginTop: '6px' }}>Subject: {n.subjectName}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f5f5f5' }}>
                    <a href={n.fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
                      View Document &rarr;
                    </a>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setEditingNote(n)}
                        style={{ padding: '4px 10px', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(n.id, n.title)}
                        style={{ padding: '4px 10px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '16px', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>Edit Academic Note</h3>
            <form onSubmit={handleSaveEditNote}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  required
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #EFEAE3', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Subject Name</label>
                <input
                  type="text"
                  required
                  value={editingNote.subjectName}
                  onChange={(e) => setEditingNote({ ...editingNote, subjectName: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #EFEAE3', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Semester</label>
                <select
                  value={editingNote.semester}
                  onChange={(e) => setEditingNote({ ...editingNote, semester: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #EFEAE3', borderRadius: '6px' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Document Link</label>
                <input
                  type="url"
                  required
                  value={editingNote.fileUrl}
                  onChange={(e) => setEditingNote({ ...editingNote, fileUrl: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #EFEAE3', borderRadius: '6px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', background: '#1C1917', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: Gallery Photo Uploads */}
      {activeTab === 'gallery' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              Upload Department Gallery Photo
            </h2>
            <form onSubmit={handleUploadGallery}>
              {galleryMsg.text && (
                <div style={{ padding: '10px', background: galleryMsg.isError ? '#fef2f2' : '#f0fdf4', color: galleryMsg.isError ? '#991b1b' : '#166534', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '14px' }}>
                  {galleryMsg.text}
                </div>
              )}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Photo Title</label>
                <input
                  type="text"
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  placeholder="e.g. AI Lab Inauguration Ceremony"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Category</label>
                <select
                  value={galleryCategory}
                  onChange={(e) => setGalleryCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                >
                  <option value="CAMPUS">Campus & Infrastructure</option>
                  <option value="EVENTS">Department Events & Hackathons</option>
                  <option value="LABS">Computing & GPU Labs</option>
                  <option value="STUDENT_LIFE">Student Activities</option>
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Caption / Description</label>
                <textarea
                  rows={3}
                  value={galleryCaption}
                  onChange={(e) => setGalleryCaption(e.target.value)}
                  placeholder="Short description of the event or activity..."
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>
                  Photo File Upload (JPEG, PNG, WEBP, GIF max 5MB) *
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleGalleryFileUpload}
                    disabled={uploadingGallery}
                    style={{ fontSize: '0.82rem' }}
                  />
                  {uploadingGallery && <span style={{ fontSize: '0.78rem', color: '#756860' }}>Uploading image...</span>}
                </div>
                <input
                  type="text"
                  required
                  value={galleryImageUrl}
                  onChange={(e) => setGalleryImageUrl(e.target.value)}
                  placeholder="Image URL or file path (/uploads/...)"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>
              <button
                type="submit"
                disabled={uploadingGallery}
                style={{ padding: '10px 20px', background: '#1C1917', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                {uploadingGallery ? 'Uploading...' : 'Upload Photo'}
              </button>
            </form>
          </div>

          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              My Gallery Uploads
            </h2>
            {galleryItems.length === 0 ? (
              <div style={{ background: '#FBF9F7', padding: '32px', textAlign: 'center', borderRadius: '16px', border: '1px border-dashed #EFEAE3', color: '#756860' }}>
                No gallery photos uploaded yet. Use the upload form on the left to contribute to the department gallery.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {galleryItems.map((item: any) => (
                  <div key={item.id} style={{ background: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #EFEAE3' }}>
                    <img src={item.imageUrl} alt={item.title || 'Gallery item'} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 4px 0' }}>{item.title || 'Untitled Photo'}</h4>
                    <p style={{ fontSize: '0.78rem', color: '#756860', margin: '0 0 8px 0' }}>{item.caption || item.category}</p>
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      style={{ padding: '4px 8px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Delete Photo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Edit Faculty Profile */}
      {activeTab === 'profile' && (
        <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '16px', border: '1px solid #EFEAE3', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}>
            Edit Faculty Profile Details
          </h2>
          {profileMsg.text && (
            <div style={{ padding: '12px', background: profileMsg.isError ? '#fef2f2' : '#f0fdf4', color: profileMsg.isError ? '#991b1b' : '#166534', borderRadius: '8px', fontSize: '0.86rem', marginBottom: '20px' }}>
              {profileMsg.text}
            </div>
          )}
          <form onSubmit={handleUpdateProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Designation *</label>
                <input
                  type="text"
                  required
                  value={profDesignation}
                  onChange={(e) => setProfDesignation(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Academic Degrees *</label>
                <input
                  type="text"
                  required
                  value={profDegrees}
                  onChange={(e) => setProfDegrees(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Experience *</label>
                <input
                  type="text"
                  required
                  value={profExp}
                  onChange={(e) => setProfExp(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Specialization *</label>
              <input
                type="text"
                required
                value={profSpec}
                onChange={(e) => setProfSpec(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Key Publications / Patents</label>
              <textarea
                rows={3}
                value={profPubs}
                onChange={(e) => setProfPubs(e.target.value)}
                placeholder="e.g. 15 International Journals (IEEE, Elsevier), 2 Patents..."
                style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={profEmail}
                  onChange={(e) => setProfEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Phone Number</label>
                <input
                  type="text"
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Initials (1-5 chars) *</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={profInitials}
                  onChange={(e) => setProfInitials(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              style={{ padding: '12px 24px', background: '#1C1917', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Directories View */}
      {activeTab === 'directories' && (
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDirectoryTab('students')}
                style={{ padding: '8px 16px', background: directoryTab === 'students' ? '#1C1917' : '#f3f4f6', color: directoryTab === 'students' ? '#FFFFFF' : '#374151', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Student Directory
              </button>
              <button
                onClick={() => setDirectoryTab('faculty')}
                style={{ padding: '8px 16px', background: directoryTab === 'faculty' ? '#1C1917' : '#f3f4f6', color: directoryTab === 'faculty' ? '#FFFFFF' : '#374151', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Faculty Directory
              </button>
            </div>
            <span style={{ fontSize: '0.8rem', background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
              Faculty Read-Only Directory Mode
            </span>
          </div>

          {directoryTab === 'students' && (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search students by name, reg no, or email..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  style={{ flex: 1, minWidth: '240px', padding: '8px 12px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
                <select
                  value={studentSem}
                  onChange={(e) => setStudentSem(e.target.value)}
                  style={{ padding: '8px 12px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
                <button
                  onClick={fetchStudentDirectory}
                  style={{ padding: '8px 16px', background: '#1C1917', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Search
                </button>
              </div>

              {loadingDirectory ? (
                <p style={{ color: '#756860' }}>Loading student directory...</p>
              ) : students.length === 0 ? (
                <div style={{ padding: '24px', background: '#FBF9F7', borderRadius: '12px', textAlign: 'center', color: '#756860' }}>
                  No students found matching the search criteria.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ background: '#FBF9F7', borderBottom: '2px solid #EFEAE3', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Student Name</th>
                        <th style={{ padding: '10px' }}>Reg No</th>
                        <th style={{ padding: '10px' }}>Batch</th>
                        <th style={{ padding: '10px' }}>Semester</th>
                        <th style={{ padding: '10px' }}>Email / Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #EFEAE3' }}>
                          <td style={{ padding: '10px', fontWeight: 600 }}>{s.fullName}</td>
                          <td style={{ padding: '10px', color: '#756860' }}>{s.registerNumber || 'N/A'}</td>
                          <td style={{ padding: '10px' }}>{s.batch}</td>
                          <td style={{ padding: '10px' }}>Sem {s.semester}</td>
                          <td style={{ padding: '10px', color: '#756860' }}>{s.email || s.phone || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {directoryTab === 'faculty' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {faculties.map((f) => (
                <div key={f.id} style={{ background: '#FBF9F7', padding: '16px', borderRadius: '12px', border: '1px solid #EFEAE3' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1C1917' }}>{f.name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#756860', marginTop: '2px' }}>{f.designation}</div>
                  <div style={{ fontSize: '0.78rem', color: '#a8a29e', marginTop: '4px' }}>{f.degrees}</div>
                  <div style={{ fontSize: '0.8rem', color: '#1C1917', marginTop: '8px', fontWeight: 600 }}>Specialization:</div>
                  <div style={{ fontSize: '0.78rem', color: '#756860' }}>{f.specialization}</div>
                  <div style={{ fontSize: '0.78rem', color: '#2563eb', marginTop: '8px' }}>{f.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal Component */}
      {confirmModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: '#991b1b' }}>
              {confirmModal.title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#756860', marginBottom: '20px', lineHeight: 1.5 }}>
              {confirmModal.message}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                style={{ padding: '8px 18px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                style={{ padding: '8px 18px', background: '#991b1b', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
