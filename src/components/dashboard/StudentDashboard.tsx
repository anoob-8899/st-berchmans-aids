'use client';

import React, { useState, useEffect } from 'react';

interface StudentDashboardProps {
  user: any;
  profile: any;
}

export default function StudentDashboard({ user, profile: initialProfile }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'notes' | 'gallery'>('overview');
  const [profile, setProfile] = useState(initialProfile);

  // Profile Form State
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [registerNumber, setRegisterNumber] = useState(profile?.registerNumber || '');
  const [batch, setBatch] = useState(profile?.batch || '2026-2030');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [semester, setSemester] = useState<number>(profile?.semester || 1);
  const [githubUrl, setGithubUrl] = useState(profile?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedinUrl || '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Projects State
  const [projectsList, setProjectsList] = useState<any[]>(profile?.projects || []);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDomain, setProjectDomain] = useState('');
  const [projectSummary, setProjectSummary] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectTeam, setProjectTeam] = useState(profile?.fullName || '');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectDemo, setProjectDemo] = useState('');
  const [projectIsFeatured, setProjectIsFeatured] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [projectMsg, setProjectMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Co-curricular Wings State
  const [allWings, setAllWings] = useState<any[]>([]);
  const [selectedWingIds, setSelectedWingIds] = useState<string[]>([]);
  const [savingWings, setSavingWings] = useState(false);
  const [wingsMsg, setWingsMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Notes State
  const [notes, setNotes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [noteSemesterFilter, setNoteSemesterFilter] = useState<string>('ALL');
  const [noteSubjectFilter, setNoteSubjectFilter] = useState<string>('ALL');
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [downloadingNoteId, setDownloadingNoteId] = useState<string | null>(null);
  const [notesMsg, setNotesMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Gallery & Uploads State
  const [studentUploads, setStudentUploads] = useState<any[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryCategory, setCategory] = useState('CAMPUS');
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryImageUrl, setGalleryImageUrl] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryMsg, setGalleryMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch Co-curricular wings
  useEffect(() => {
    fetch('/api/student/wings')
      .then((res) => res.json())
      .then((data) => {
        if (data.wings) setAllWings(data.wings);
        if (data.currentWingIds) setSelectedWingIds(data.currentWingIds);
      })
      .catch(() => {});
  }, []);

  // Fetch Notes
  useEffect(() => {
    setLoadingNotes(true);
    let url = '/api/academic/notes?';
    if (noteSemesterFilter !== 'ALL') url += `semester=${noteSemesterFilter}&`;
    if (noteSubjectFilter !== 'ALL') url += `subjectId=${noteSubjectFilter}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.notes) setNotes(data.notes);
      })
      .catch(() => {})
      .finally(() => setLoadingNotes(false));
  }, [noteSemesterFilter, noteSubjectFilter]);

  // Fetch Student Uploads
  useEffect(() => {
    fetch('/api/student/uploads')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setStudentUploads(data.items);
      })
      .catch(() => {});
  }, []);

  // Handle Avatar Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setProfileMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image');

      setAvatarUrl(data.fileUrl);
      setProfileMsg({ type: 'success', text: 'Profile photo uploaded! Click "Save Profile Changes" to persist.' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Error uploading photo' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Profile Submit
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    try {
      const res = await fetch('/api/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          registerNumber,
          batch,
          bio,
          avatarUrl,
          phone,
          semester: Number(semester),
          githubUrl,
          linkedinUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setProfile(data.profile);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Error updating profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  // Co-curricular Wings Toggle
  const handleWingToggle = (wingId: string) => {
    if (selectedWingIds.includes(wingId)) {
      setSelectedWingIds(selectedWingIds.filter((id) => id !== wingId));
    } else {
      setSelectedWingIds([...selectedWingIds, wingId]);
    }
  };

  // Co-curricular Wings Save
  const handleSaveWings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWings(true);
    setWingsMsg(null);

    try {
      const res = await fetch('/api/student/wings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wingIds: selectedWingIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update wings');

      setWingsMsg({ type: 'success', text: 'Co-curricular wing memberships updated!' });
    } catch (err: any) {
      setWingsMsg({ type: 'error', text: err.message || 'Error saving wing selection' });
    } finally {
      setSavingWings(false);
    }
  };

  // Add / Edit Project Submit
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProject(true);
    setProjectMsg(null);

    const payload = {
      title: projectTitle,
      domain: projectDomain,
      summary: projectSummary,
      description: projectDescription,
      team: projectTeam,
      githubUrl: projectGithub,
      demoUrl: projectDemo,
      isFeatured: projectIsFeatured,
    };

    try {
      let res;
      if (editingProjectId) {
        res = await fetch(`/api/student/projects/${editingProjectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/student/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save project');

      if (editingProjectId) {
        setProjectsList(projectsList.map((p) => (p.id === editingProjectId ? data.project : p)));
        setProjectMsg({ type: 'success', text: 'Project updated successfully!' });
      } else {
        setProjectsList([data.project, ...projectsList]);
        setProjectMsg({ type: 'success', text: 'Project submitted successfully!' });
      }

      resetProjectForm();
    } catch (err: any) {
      setProjectMsg({ type: 'error', text: err.message || 'Error saving project' });
    } finally {
      setSavingProject(false);
    }
  };

  const startEditProject = (p: any) => {
    setEditingProjectId(p.id);
    setProjectTitle(p.title);
    setProjectDomain(p.domain);
    setProjectSummary(p.summary);
    setProjectDescription(p.description || '');
    setProjectTeam(p.team);
    setProjectGithub(p.githubUrl || '');
    setProjectDemo(p.demoUrl || '');
    setProjectIsFeatured(p.isFeatured || false);
    setProjectMsg(null);
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectTitle('');
    setProjectDomain('');
    setProjectSummary('');
    setProjectDescription('');
    setProjectTeam(profile?.fullName || '');
    setProjectGithub('');
    setProjectDemo('');
    setProjectIsFeatured(false);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/student/projects/${projectId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete project');

      setProjectsList(projectsList.filter((p) => p.id !== projectId));
      setProjectMsg({ type: 'success', text: 'Project deleted successfully' });
    } catch (err: any) {
      setProjectMsg({ type: 'error', text: err.message || 'Error deleting project' });
    }
  };

  // Protected Note Download Handler
  const handleDownloadNote = async (note: any) => {
    setDownloadingNoteId(note.id);
    setNotesMsg(null);

    try {
      const res = await fetch(`/api/academic/notes/download/${note.id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to access note download');

      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      } else {
        throw new Error('Download URL not provided');
      }
    } catch (err: any) {
      setNotesMsg({ type: 'error', text: err.message || 'Could not download note' });
    } finally {
      setDownloadingNoteId(null);
    }
  };

  // Gallery Item Upload
  const handleUploadGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingGallery(true);
    setGalleryMsg(null);

    try {
      let finalImageUrl = galleryImageUrl;

      if (galleryFile) {
        const formData = new FormData();
        formData.append('file', galleryFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to upload image file');
        finalImageUrl = uploadData.fileUrl;
      }

      if (!finalImageUrl) {
        throw new Error('Please select an image file or provide an image URL');
      }

      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: galleryTitle,
          caption: galleryCaption,
          imageUrl: finalImageUrl,
          category: galleryCategory,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save gallery item');

      setStudentUploads([data.item, ...studentUploads]);
      setGalleryTitle('');
      setGalleryCaption('');
      setGalleryFile(null);
      setGalleryImageUrl('');
      setGalleryMsg({ type: 'success', text: 'Photo uploaded to department gallery!' });
    } catch (err: any) {
      setGalleryMsg({ type: 'error', text: err.message || 'Error uploading photo' });
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteUpload = async (uploadId: string) => {
    if (!confirm('Are you sure you want to delete this upload?')) return;
    try {
      const res = await fetch(`/api/student/uploads/${uploadId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete upload');

      setStudentUploads(studentUploads.filter((u) => u.id !== uploadId));
      setGalleryMsg({ type: 'success', text: 'Upload removed successfully' });
    } catch (err: any) {
      setGalleryMsg({ type: 'error', text: err.message || 'Error deleting upload' });
    }
  };

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header Shell */}
      <div
        style={{
          background: '#1C1917',
          color: '#FFFFFF',
          padding: '28px 32px',
          borderRadius: '16px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between' as any,
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName || user.username}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #FDB27C',
              }}
            />
          ) : (
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#FDB27C',
                color: '#1C1917',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 800,
              }}
            >
              {(fullName || user.username).substring(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <span
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                background: '#FDB27C',
                color: '#1C1917',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '6px',
              }}
            >
              STUDENT PORTAL
            </span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
              {fullName || user.username}
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#EFEAE3', marginTop: '4px', margin: 0 }}>
              Register No: <strong style={{ color: '#FDB27C' }}>{registerNumber || 'Unassigned'}</strong> | Batch:{' '}
              <strong>{batch}</strong> | Semester: <strong>S{semester}</strong>
            </p>
          </div>
        </div>
        <div style={{ background: '#231F1C', padding: '12px 18px', borderRadius: '12px', border: '1px solid #756860', fontSize: '0.84rem' }}>
          <div>
            Status: <span style={{ color: '#4ade80', fontWeight: 700 }}>ACTIVE (APPROVED)</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#a8a29e', marginTop: '4px' }}>St. Berchmans College AI & DS</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1.5px solid #EFEAE3', marginBottom: '28px', gap: '8px', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '12px 18px',
            fontWeight: 700,
            fontSize: '0.92rem',
            color: activeTab === 'overview' ? '#1C1917' : '#756860',
            borderBottom: activeTab === 'overview' ? '3px solid #FDB27C' : 'transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Profile & Co-Curricular
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          style={{
            padding: '12px 18px',
            fontWeight: 700,
            fontSize: '0.92rem',
            color: activeTab === 'projects' ? '#1C1917' : '#756860',
            borderBottom: activeTab === 'projects' ? '3px solid #FDB27C' : 'transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          My Portfolio & Projects ({projectsList.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          style={{
            padding: '12px 18px',
            fontWeight: 700,
            fontSize: '0.92rem',
            color: activeTab === 'notes' ? '#1C1917' : '#756860',
            borderBottom: activeTab === 'notes' ? '3px solid #FDB27C' : 'transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Lecture Notes & Downloads
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          style={{
            padding: '12px 18px',
            fontWeight: 700,
            fontSize: '0.92rem',
            color: activeTab === 'gallery' ? '#1C1917' : '#756860',
            borderBottom: activeTab === 'gallery' ? '3px solid #FDB27C' : 'transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Gallery & Uploads ({studentUploads.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & PROFILE EDITING */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px' }}>
          {/* Profile Edit Form */}
          <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>
              Edit Student Profile
            </h2>
            {profileMsg && (
              <div
                style={{
                  padding: '12px 16px',
                  background: profileMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  color: profileMsg.type === 'success' ? '#166534' : '#991b1b',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  marginBottom: '18px',
                  border: `1px solid ${profileMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                }}
              >
                {profileMsg.text}
              </div>
            )}
            <form onSubmit={handleUpdateProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                    Register Number
                  </label>
                  <input
                    type="text"
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value)}
                    placeholder="e.g. 260021001"
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                    Batch / Class
                  </label>
                  <select
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    <option value="2026-2030">2026–2030 (First Batch)</option>
                    <option value="2025-2029">2025–2029</option>
                    <option value="2027-2031">2027–2031</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                    Current Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                  Short Bio / Academic Summary
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your research interests, machine learning domain focus, or project goals..."
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                  Profile Photo (Upload or Image URL)
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    style={{ fontSize: '0.82rem' }}
                  />
                  {uploadingAvatar && <span style={{ fontSize: '0.78rem', color: '#756860' }}>Uploading photo...</span>}
                </div>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Or paste profile photo URL (https://... or /uploads/...)"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                style={{
                  padding: '12px 24px',
                  background: '#1C1917',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Co-curricular Wings Selection */}
          <div style={{ background: '#FBF9F7', padding: '28px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
              Co-Curricular Wings
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#756860', marginBottom: '18px' }}>
              Select one or more active student wings or college forums you are affiliated with.
            </p>

            {wingsMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  background: wingsMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  color: wingsMsg.type === 'success' ? '#166534' : '#991b1b',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  marginBottom: '14px',
                }}
              >
                {wingsMsg.text}
              </div>
            )}

            <form onSubmit={handleSaveWings}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {allWings.map((wing) => {
                  const isChecked = selectedWingIds.includes(wing.id);
                  return (
                    <label
                      key={wing.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px 14px',
                        background: isChecked ? '#FFFFFF' : '#FFFFFF',
                        border: isChecked ? '2px solid #FDB27C' : '1px solid #EFEAE3',
                        borderRadius: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleWingToggle(wing.id)}
                        style={{ marginTop: '3px', accentColor: '#1C1917' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>{wing.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#756860', marginTop: '2px' }}>{wing.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={savingWings}
                style={{
                  padding: '10px 20px',
                  background: '#FDB27C',
                  color: '#1C1917',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                {savingWings ? 'Updating Wings...' : 'Save Wing Memberships'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS PORTFOLIO CRUD */}
      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          {/* Project Create / Edit Form */}
          <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '18px' }}>
              {editingProjectId ? 'Edit Project Entry' : 'Create New SYNAPSE Project'}
            </h2>
            {projectMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  background: projectMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  color: projectMsg.type === 'success' ? '#166534' : '#991b1b',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  marginBottom: '16px',
                }}
              >
                {projectMsg.text}
              </div>
            )}
            <form onSubmit={handleSaveProject}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Indic NLP Malayalam Sentiment Classifier"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                  Domain / Research Field *
                </label>
                <input
                  type="text"
                  required
                  value={projectDomain}
                  onChange={(e) => setProjectDomain(e.target.value)}
                  placeholder="e.g. Computer Vision, Indic NLP, Edge AI, MLOps"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                  Short Summary * (Min 10 characters)
                </label>
                <textarea
                  rows={3}
                  required
                  value={projectSummary}
                  onChange={(e) => setProjectSummary(e.target.value)}
                  placeholder="Briefly describe the neural architecture, dataset, and performance..."
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                  Detailed Description (Optional)
                </label>
                <textarea
                  rows={4}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Full technical details, hyperparameters, system requirements..."
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                  Team Members *
                </label>
                <input
                  type="text"
                  required
                  value={projectTeam}
                  onChange={(e) => setProjectTeam(e.target.value)}
                  placeholder="e.g. Self or Team Members Names"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={projectGithub}
                    onChange={(e) => setProjectGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={projectDemo}
                    onChange={(e) => setProjectDemo(e.target.value)}
                    placeholder="https://my-app.streamlit.app"
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div
                style={{
                  marginBottom: '18px',
                  background: '#FBF9F7',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #EFEAE3',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={projectIsFeatured}
                    onChange={(e) => setProjectIsFeatured(e.target.checked)}
                    style={{ accentColor: '#1C1917' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1C1917' }}>Mark as Featured Project</span>
                    <p style={{ fontSize: '0.76rem', color: '#756860', margin: '2px 0 0 0' }}>
                      Featured projects are showcased prominently on the public SYNAPSE Innovation page.
                    </p>
                  </div>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={savingProject}
                  style={{
                    padding: '12px 20px',
                    background: '#FDB27C',
                    color: '#1C1917',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {savingProject ? 'Saving...' : editingProjectId ? 'Update Project' : 'Submit Project'}
                </button>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    style={{
                      padding: '12px 20px',
                      background: '#EFEAE3',
                      color: '#1C1917',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Project List */}
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '18px' }}>
              My Submitted Projects ({projectsList.length})
            </h2>
            {projectsList.length === 0 ? (
              <div style={{ background: '#FBF9F7', padding: '36px', textAlign: 'center', borderRadius: '16px', border: '1px dashed #EFEAE3', color: '#756860' }}>
                No projects submitted yet. Create your first SYNAPSE project on the left!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {projectsList.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: '#FFFFFF',
                      padding: '20px',
                      borderRadius: '14px',
                      border: p.isFeatured ? '2px solid #FDB27C' : '1px solid #EFEAE3',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' as any, alignItems: 'flex-start', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C1917', margin: 0 }}>{p.title}</h3>
                          {p.isFeatured && (
                            <span
                              style={{
                                padding: '2px 8px',
                                background: '#FDB27C',
                                color: '#1C1917',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                              }}
                            >
                              FEATURED
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: '0.76rem',
                            padding: '3px 8px',
                            background: '#e0f2fe',
                            color: '#0369a1',
                            borderRadius: '12px',
                            fontWeight: 600,
                            display: 'inline-block',
                            marginTop: '6px',
                          }}
                        >
                          {p.domain}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => startEditProject(p)}
                          style={{
                            padding: '4px 10px',
                            background: '#1C1917',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          style={{
                            padding: '4px 10px',
                            background: '#fee2e2',
                            color: '#991b1b',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.86rem', color: '#756860', marginTop: '10px', marginBottom: '10px', lineHeight: 1.4 }}>
                      {p.summary}
                    </p>

                    <div style={{ fontSize: '0.78rem', color: '#a8a29e', borderTop: '1px solid #EFEAE3', paddingTop: '8px' }}>
                      Team: <strong>{p.team}</strong>
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ marginLeft: '12px', color: '#0284c7', textDecoration: 'underline' }}
                        >
                          GitHub Repo
                        </a>
                      )}
                      {p.demoUrl && (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ marginLeft: '12px', color: '#0284c7', textDecoration: 'underline' }}
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: NOTES BROWSING & PROTECTED DOWNLOADS */}
      {activeTab === 'notes' && (
        <div>
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #EFEAE3', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>
              Academic Lecture Notes & Downloads
            </h2>

            {notesMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  background: notesMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  color: notesMsg.type === 'success' ? '#166534' : '#991b1b',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  marginBottom: '16px',
                }}
              >
                {notesMsg.text}
              </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#756860', marginRight: '8px' }}>Semester Filter:</label>
                <select
                  value={noteSemesterFilter}
                  onChange={(e) => setNoteSemesterFilter(e.target.value)}
                  style={{ padding: '8px 12px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                >
                  <option value="ALL">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#756860', marginRight: '8px' }}>Subject Filter:</label>
                <select
                  value={noteSubjectFilter}
                  onChange={(e) => setNoteSubjectFilter(e.target.value)}
                  style={{ padding: '8px 12px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                >
                  <option value="ALL">All Subjects</option>
                  <option value="AIDS101">AIDS101 - Fundamentals of AI</option>
                  <option value="AIDS102">AIDS102 - Python Data Structures</option>
                  <option value="AIDS201">AIDS201 - Data Mining</option>
                  <option value="AIDS202">AIDS202 - Statistics for AI</option>
                  <option value="AIDS301">AIDS301 - Machine Learning</option>
                  <option value="AIDS401">AIDS401 - Deep Neural Networks</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes Grid */}
          {loadingNotes ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#756860' }}>Loading lecture notes...</div>
          ) : notes.length === 0 ? (
            <div style={{ background: '#FBF9F7', padding: '40px', textAlign: 'center', borderRadius: '16px', border: '1px dashed #EFEAE3', color: '#756860' }}>
              No academic notes found for the selected filters.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    background: '#FFFFFF',
                    padding: '20px',
                    borderRadius: '14px',
                    border: '1px solid #EFEAE3',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between' as any,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' as any, marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          background: '#fef3c7',
                          color: '#92400e',
                          borderRadius: '10px',
                          fontWeight: 700,
                        }}
                      >
                        Semester {note.semester}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#756860', fontWeight: 600 }}>{note.fileType}</span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>{note.title}</h3>
                    <p style={{ fontSize: '0.84rem', color: '#756860', margin: '4px 0 12px 0' }}>Subject: {note.subjectName}</p>
                    <div style={{ fontSize: '0.78rem', color: '#a8a29e' }}>Uploaded by: {note.uploadedByName}</div>
                  </div>

                  <div style={{ marginTop: '16px', borderTop: '1px solid #EFEAE3', paddingTop: '12px' }}>
                    <button
                      onClick={() => handleDownloadNote(note)}
                      disabled={downloadingNoteId === note.id}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#1C1917',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      {downloadingNoteId === note.id ? 'Verifying Authorization...' : '🔒 Download Protected Note'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: GALLERY UPLOAD & MANAGEMENT */}
      {activeTab === 'gallery' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          {/* Upload Form */}
          <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '18px' }}>
              Upload Photo to Department Gallery
            </h2>
            {galleryMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  background: galleryMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  color: galleryMsg.type === 'success' ? '#166534' : '#991b1b',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  marginBottom: '16px',
                }}
              >
                {galleryMsg.text}
              </div>
            )}
            <form onSubmit={handleUploadGallery}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                  Photo Title
                </label>
                <input
                  type="text"
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  placeholder="e.g. SYNAPSE AI Hackathon 2026 Opening"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                  Caption / Description
                </label>
                <textarea
                  rows={3}
                  value={galleryCaption}
                  onChange={(e) => setGalleryCaption(e.target.value)}
                  placeholder="Add a detailed caption about the campus event, lab demo, or workshop..."
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  value={galleryCategory}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                >
                  <option value="CAMPUS">Campus Life & Facilities</option>
                  <option value="EVENTS">Hackathons & Workshops</option>
                  <option value="PROJECTS">Student Project Demos</option>
                  <option value="FACULTY">Faculty & Seminars</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#756860', marginBottom: '4px' }}>
                  Select Image File (JPEG, PNG, WEBP, GIF - Max 5MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
                  style={{ fontSize: '0.84rem', marginBottom: '8px' }}
                />
                <div style={{ fontSize: '0.78rem', color: '#a8a29e', margin: '4px 0' }}>Or enter direct image URL:</div>
                <input
                  type="text"
                  value={galleryImageUrl}
                  onChange={(e) => setGalleryImageUrl(e.target.value)}
                  placeholder="https://... or /uploads/..."
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={uploadingGallery}
                style={{
                  padding: '12px 24px',
                  background: '#1C1917',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                {uploadingGallery ? 'Uploading...' : 'Upload Photo'}
              </button>
            </form>
          </div>

          {/* Student Upload Management List */}
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '18px' }}>
              My Uploaded Photos ({studentUploads.length})
            </h2>

            {studentUploads.length === 0 ? (
              <div style={{ background: '#FBF9F7', padding: '36px', textAlign: 'center', borderRadius: '16px', border: '1px dashed #EFEAE3', color: '#756860' }}>
                You haven't uploaded any photos to the gallery yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {studentUploads.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #EFEAE3',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between' as any,
                    }}
                  >
                    <div>
                      <img src={item.imageUrl} alt={item.title || 'Upload'} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                      <div style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1C1917' }}>{item.title || 'Untitled Photo'}</div>
                        {item.caption && <div style={{ fontSize: '0.78rem', color: '#756860', marginTop: '4px' }}>{item.caption}</div>}
                      </div>
                    </div>
                    <div style={{ padding: '10px 12px', borderTop: '1px solid #EFEAE3', background: '#FBF9F7' }}>
                      <button
                        onClick={() => handleDeleteUpload(item.id)}
                        style={{
                          width: '100%',
                          padding: '6px',
                          background: '#fee2e2',
                          color: '#991b1b',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Delete Photo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
