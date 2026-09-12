'use client';

import React, { useState, useEffect } from 'react';

interface AdminDashboardProps {
  user: any;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pending' | 'users' | 'events' | 'moderation' | 'provision' | 'analytics'>('overview');
  
  // Stats & Users State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [actionMsg, setActionMsg] = useState({ text: '', isError: false });

  // Moderation State
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [allGallery, setAllGallery] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  
  // Events State
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventSlug, setEventSlug] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCategory, setEventCategory] = useState('ACADEMIC');
  const [eventBanner, setEventBanner] = useState('');
  const [eventRegUrl, setEventRegUrl] = useState('');
  const [eventFeatured, setEventFeatured] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);

  // Faculty Provisioning State
  const [facUsername, setFacUsername] = useState('');
  const [facPassword, setFacPassword] = useState('');
  const [facEmail, setFacEmail] = useState('');
  const [facName, setFacName] = useState('');
  const [facDesignation, setFacDesignation] = useState('Assistant Professor');
  const [facDegrees, setFacDegrees] = useState('M.Tech');
  const [facExp, setFacExp] = useState('5+ Years');
  const [facSpec, setFacSpec] = useState('AI & Machine Learning');
  const [facInitials, setFacInitials] = useState('');
  const [facPhone, setFacPhone] = useState('');
  const [facPubs, setFacPubs] = useState('');
  const [provisioning, setProvisioning] = useState(false);

  // Chat Analytics State
  const [chatSummary, setChatSummary] = useState<any>(null);
  const [loadingChat, setLoadingChat] = useState(false);

  // Edit Student Profile Modal State
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  // Confirmation Modal State
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

  // Fetch Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) {
        setUsersList(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch user directory', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (res.ok) setEventsList(data.events || []);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  // Fetch Moderation Data
  const fetchModerationData = async () => {
    try {
      const resNotes = await fetch('/api/faculty/notes');
      const dataNotes = await resNotes.json();
      if (resNotes.ok) setAllNotes(dataNotes.notes || []);

      const resGal = await fetch('/api/gallery');
      const dataGal = await resGal.json();
      if (resGal.ok) setAllGallery(dataGal.items || []);

      const resProj = await fetch('/api/projects');
      const dataProj = await resProj.json();
      if (resProj.ok) setAllProjects(dataProj.projects || []);
    } catch (err) {
      console.error('Failed to fetch moderation content', err);
    }
  };

  // Fetch Chat Analytics
  const fetchChatAnalytics = async () => {
    setLoadingChat(true);
    try {
      const res = await fetch('/api/admin/chat-analytics');
      const data = await res.json();
      if (res.ok) setChatSummary(data);
    } catch (err) {
      console.error('Failed to fetch chat analytics', err);
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (activeTab === 'moderation') fetchModerationData();
    if (activeTab === 'analytics') fetchChatAnalytics();
  }, [activeTab]);

  // Update Status or Role
  const handleUpdateUser = async (userId: string, status?: string, role?: string) => {
    setActionMsg({ text: '', isError: false });
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');

      setActionMsg({ text: `User account updated successfully.`, isError: false });
      fetchUsers();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Error updating user account', isError: true });
    }
  };

  // Delete User Account (Destructive with Confirmation)
  const handleDeleteUser = (userId: string, username: string) => {
    triggerConfirm(
      'Remove Account',
      `Are you sure you want to permanently remove the user account "${username}"? All associated profile data will be deleted.`,
      async () => {
        try {
          const res = await fetch(`/api/admin/users?userId=${userId}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to delete account');

          setActionMsg({ text: `User account "${username}" removed.`, isError: false });
          fetchUsers();
        } catch (err: any) {
          setActionMsg({ text: err.message || 'Error deleting account', isError: true });
        }
      }
    );
  };

  // Save Corrected Student Profile
  const handleSaveStudentProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      const res = await fetch(`/api/admin/student-profile/${editingStudent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editingStudent.studentProfile.fullName,
          registerNumber: editingStudent.studentProfile.registerNumber,
          batch: editingStudent.studentProfile.batch,
          phone: editingStudent.studentProfile.phone,
          bio: editingStudent.studentProfile.bio,
          semester: Number(editingStudent.studentProfile.semester || 1),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update student profile');

      setEditingStudent(null);
      setActionMsg({ text: 'Student profile corrected successfully.', isError: false });
      fetchUsers();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Error correcting profile', isError: true });
    }
  };

  // Create Event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingEvent(true);
    setActionMsg({ text: '', isError: false });

    try {
      const slug = eventSlug || eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle,
          slug,
          description: eventDesc,
          venue: eventVenue,
          eventDate,
          category: eventCategory,
          bannerUrl: eventBanner,
          registrationUrl: eventRegUrl,
          isFeatured: eventFeatured,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');

      setEventTitle('');
      setEventSlug('');
      setEventDesc('');
      setEventVenue('');
      setEventDate('');
      setEventBanner('');
      setEventRegUrl('');
      setEventFeatured(false);

      setActionMsg({ text: 'Department event created successfully!', isError: false });
      fetchEvents();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Error creating event', isError: true });
    } finally {
      setCreatingEvent(false);
    }
  };

  // Delete Event (Destructive with Confirmation)
  const handleDeleteEvent = (eventId: string, title: string) => {
    triggerConfirm(
      'Delete Event',
      `Are you sure you want to delete the event "${title}" from the department calendar?`,
      async () => {
        try {
          const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to delete event');

          setActionMsg({ text: `Event "${title}" deleted.`, isError: false });
          fetchEvents();
        } catch (err: any) {
          setActionMsg({ text: err.message || 'Error deleting event', isError: true });
        }
      }
    );
  };

  // Delete Academic Note (Admin Moderation)
  const handleDeleteNoteAdmin = (noteId: string, title: string) => {
    triggerConfirm(
      'Moderate Academic Note',
      `Are you sure you want to remove the note "${title}" from department publications?`,
      async () => {
        try {
          const res = await fetch(`/api/faculty/notes/${noteId}`, { method: 'DELETE' });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to delete note');
          fetchModerationData();
          setActionMsg({ text: 'Academic note removed by admin moderation.', isError: false });
        } catch (err: any) {
          setActionMsg({ text: err.message || 'Error deleting note', isError: true });
        }
      }
    );
  };

  // Delete Gallery Item (Admin Moderation)
  const handleDeleteGalleryAdmin = (itemId: string) => {
    triggerConfirm(
      'Moderate Gallery Photo',
      'Are you sure you want to remove this photo from the gallery?',
      async () => {
        try {
          const res = await fetch(`/api/gallery/${itemId}`, { method: 'DELETE' });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to delete gallery item');
          fetchModerationData();
          setActionMsg({ text: 'Gallery item removed by admin moderation.', isError: false });
        } catch (err: any) {
          setActionMsg({ text: err.message || 'Error deleting photo', isError: true });
        }
      }
    );
  };

  // Provision Faculty Account
  const handleProvisionFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvisioning(true);
    setActionMsg({ text: '', isError: false });

    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: facUsername,
          password: facPassword,
          email: facEmail,
          name: facName,
          designation: facDesignation,
          degrees: facDegrees,
          experience: facExp,
          specialization: facSpec,
          initials: facInitials,
          phone: facPhone,
          publications: facPubs,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to provision faculty');

      setFacUsername('');
      setFacPassword('');
      setFacEmail('');
      setFacName('');
      setFacInitials('');
      setFacPhone('');
      setFacPubs('');

      setActionMsg({ text: 'Faculty member account provisioned and approved!', isError: false });
      fetchUsers();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Error provisioning faculty account', isError: true });
    } finally {
      setProvisioning(false);
    }
  };

  const pendingUsers = usersList.filter((u) => u.status === 'PENDING');
  const studentCount = usersList.filter((u) => u.role === 'STUDENT').length;
  const facultyCount = usersList.filter((u) => u.role === 'FACULTY').length;
  const adminCount = usersList.filter((u) => u.role === 'ADMIN').length;

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Admin Header */}
      <div style={{ background: '#1C1917', color: '#FFFFFF', padding: '32px', borderRadius: '16px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ display: 'inline-block', padding: '4px 10px', background: '#FDB27C', color: '#1C1917', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px' }}>
            ADMINISTRATION PORTAL
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>
            System Administrator Control Center
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#EFEAE3', marginTop: '6px', margin: 0 }}>
            St. Berchmans College AI & DS Department Governance
          </p>
        </div>
        <div style={{ background: '#231F1C', padding: '12px 18px', borderRadius: '12px', border: '1px solid #756860', fontSize: '0.84rem' }}>
          <div>Pending Approvals: <strong style={{ color: '#FDB27C' }}>{pendingUsers.length}</strong></div>
          <div>Total Registered Accounts: <strong>{usersList.length}</strong></div>
        </div>
      </div>

      {actionMsg.text && (
        <div style={{ padding: '12px 16px', background: actionMsg.isError ? '#fef2f2' : '#f0fdf4', border: actionMsg.isError ? '1px solid #fca5a5' : '1px solid #bbf7d0', color: actionMsg.isError ? '#991b1b' : '#166534', borderRadius: '8px', fontSize: '0.86rem', marginBottom: '20px' }}>
          {actionMsg.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #EFEAE3', marginBottom: '24px', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { key: 'overview', label: 'Summary Overview' },
          { key: 'pending', label: `Pending Approvals (${pendingUsers.length})` },
          { key: 'users', label: `User Accounts & Roles (${usersList.length})` },
          { key: 'events', label: 'Department Events' },
          { key: 'moderation', label: 'Content Moderation' },
          { key: 'provision', label: 'Provision Faculty Account' },
          { key: 'analytics', label: 'Chatbot Analytics' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            style={{
              padding: '10px 14px',
              fontWeight: 600,
              fontSize: '0.88rem',
              color: activeTab === t.key ? '#1C1917' : '#756860',
              borderBottom: activeTab === t.key ? '3px solid #FDB27C' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Summary Overview */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '28px' }}>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #EFEAE3', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.8rem', color: '#756860', fontWeight: 600 }}>PENDING APPROVALS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', marginTop: '6px' }}>{pendingUsers.length}</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #EFEAE3', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.8rem', color: '#756860', fontWeight: 600 }}>STUDENT ACCOUNTS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6b21a8', marginTop: '6px' }}>{studentCount}</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #EFEAE3', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.8rem', color: '#756860', fontWeight: 600 }}>FACULTY MEMBERS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0369a1', marginTop: '6px' }}>{facultyCount}</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #EFEAE3', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.8rem', color: '#756860', fontWeight: 600 }}>ADMINISTRATORS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#92400e', marginTop: '6px' }}>{adminCount}</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #EFEAE3', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.8rem', color: '#756860', fontWeight: 600 }}>TOTAL EVENTS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#166534', marginTop: '6px' }}>{eventsList.length}</div>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>
              System Governance Summary
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#756860', lineHeight: 1.6 }}>
              Welcome to the administrator dashboard. From here, you have full operational governance over account approvals, personnel role updates, event announcements, department content moderation, and AI chatbot interaction logs.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: Pending Approvals */}
      {activeTab === 'pending' && (
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
            Pending Registration Requests
          </h2>

          {loadingUsers ? (
            <p style={{ color: '#756860' }}>Loading user directory...</p>
          ) : pendingUsers.length === 0 ? (
            <div style={{ background: '#FBF9F7', padding: '32px', textAlign: 'center', borderRadius: '12px', color: '#756860' }}>
              No pending student approvals at this time.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#FBF9F7', borderBottom: '2px solid #EFEAE3', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>Full Name</th>
                    <th style={{ padding: '12px' }}>Username</th>
                    <th style={{ padding: '12px' }}>Batch / Reg No</th>
                    <th style={{ padding: '12px' }}>Email / Phone</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #EFEAE3' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{u.studentProfile?.fullName || 'N/A'}</td>
                      <td style={{ padding: '12px', color: '#756860' }}>{u.username}</td>
                      <td style={{ padding: '12px' }}>
                        {u.studentProfile?.batch || '2026-2030'} {u.studentProfile?.registerNumber ? `(${u.studentProfile.registerNumber})` : ''}
                      </td>
                      <td style={{ padding: '12px', color: '#756860' }}>
                        {u.email || u.studentProfile?.email || 'N/A'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleUpdateUser(u.id, 'APPROVED')}
                            style={{ padding: '6px 14px', background: '#166534', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Approve Account
                          </button>
                          <button
                            onClick={() => handleUpdateUser(u.id, 'REJECTED')}
                            style={{ padding: '6px 14px', background: '#991b1b', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: User Accounts & Roles */}
      {activeTab === 'users' && (
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
            Registered Users &amp; Role Management Matrix
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: '#FBF9F7', borderBottom: '2px solid #EFEAE3', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Username / Name</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Role</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Actions &amp; Corrections</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #EFEAE3' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600, color: '#1C1917' }}>{u.username}</div>
                      <div style={{ fontSize: '0.78rem', color: '#756860' }}>
                        {u.studentProfile?.fullName || u.facultyProfile?.name || ''}
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#756860' }}>{u.email || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUser(u.id, undefined, e.target.value)}
                        style={{ padding: '4px 8px', border: '1px solid #EFEAE3', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: u.role === 'ADMIN' ? '#fef3c7' : u.role === 'FACULTY' ? '#e0f2fe' : '#f3e8ff' }}
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="FACULTY">FACULTY</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={u.status}
                        onChange={(e) => handleUpdateUser(u.id, e.target.value, undefined)}
                        style={{ padding: '4px 8px', border: '1px solid #EFEAE3', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: u.status === 'APPROVED' ? '#dcfce7' : u.status === 'PENDING' ? '#fef9c3' : '#fee2e2' }}
                      >
                        <option value="APPROVED">APPROVED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {u.role === 'STUDENT' && u.studentProfile && (
                          <button
                            onClick={() => setEditingStudent(u)}
                            style={{ padding: '4px 10px', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Correct Profile
                          </button>
                        )}
                        {u.id !== user.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            style={{ padding: '4px 10px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Remove Account
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Student Profile Modal */}
      {editingStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '16px', maxWidth: '540px', width: '100%' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>
              Correct Student Profile: {editingStudent.username}
            </h3>
            <form onSubmit={handleSaveStudentProfile}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingStudent.studentProfile?.fullName || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, studentProfile: { ...editingStudent.studentProfile, fullName: e.target.value } })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #EFEAE3', borderRadius: '6px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Register Number</label>
                  <input
                    type="text"
                    value={editingStudent.studentProfile?.registerNumber || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, studentProfile: { ...editingStudent.studentProfile, registerNumber: e.target.value } })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #EFEAE3', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Batch</label>
                  <input
                    type="text"
                    value={editingStudent.studentProfile?.batch || '2026-2030'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, studentProfile: { ...editingStudent.studentProfile, batch: e.target.value } })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #EFEAE3', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Semester</label>
                  <select
                    value={editingStudent.studentProfile?.semester || 1}
                    onChange={(e) => setEditingStudent({ ...editingStudent, studentProfile: { ...editingStudent.studentProfile, semester: Number(e.target.value) } })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #EFEAE3', borderRadius: '6px' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Phone</label>
                  <input
                    type="text"
                    value={editingStudent.studentProfile?.phone || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, studentProfile: { ...editingStudent.studentProfile, phone: e.target.value } })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #EFEAE3', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', background: '#1C1917', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: Department Events Management */}
      {activeTab === 'events' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              Create Department Event
            </h2>
            <form onSubmit={handleCreateEvent}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. SYNAPSE 2026 National AI Hackathon"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                  >
                    <option value="ACADEMIC">Academic / Symposium</option>
                    <option value="HACKATHON">Hackathon / Contest</option>
                    <option value="WORKSHOP">Workshop / Hands-on</option>
                    <option value="SEMINAR">Guest Lecture</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Event Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Venue *</label>
                <input
                  type="text"
                  required
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  placeholder="e.g. Archbishop Powathil Hall / AI Computing Lab"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Description *</label>
                <textarea
                  rows={3}
                  required
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Detailed agenda, eligibility, prizes, and schedule..."
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Registration Form URL</label>
                <input
                  type="url"
                  value={eventRegUrl}
                  onChange={(e) => setEventRegUrl(e.target.value)}
                  placeholder="https://forms.gle/..."
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={eventFeatured}
                  onChange={(e) => setEventFeatured(e.target.checked)}
                />
                <label htmlFor="featuredCheck" style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1C1917' }}>
                  Mark as Featured Department Event
                </label>
              </div>
              <button
                type="submit"
                disabled={creatingEvent}
                style={{ padding: '10px 20px', background: '#1C1917', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                {creatingEvent ? 'Creating...' : 'Publish Event'}
              </button>
            </form>
          </div>

          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              Scheduled Events ({eventsList.length})
            </h2>
            {eventsList.length === 0 ? (
              <div style={{ background: '#FBF9F7', padding: '32px', textAlign: 'center', borderRadius: '16px', border: '1px border-dashed #EFEAE3', color: '#756860' }}>
                No events posted yet. Use the form on the left to schedule department events.
              </div>
            ) : (
              eventsList.map((e: any) => (
                <div key={e.id} style={{ background: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #EFEAE3', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C1917', margin: 0 }}>{e.title}</h3>
                    <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#e0f2fe', color: '#0369a1', borderRadius: '12px', fontWeight: 700 }}>
                      {e.category}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#756860', marginTop: '6px' }}>
                    Date: {new Date(e.eventDate).toLocaleDateString()} | Venue: {e.venue}
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleDeleteEvent(e.id, e.title)}
                      style={{ padding: '4px 10px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Content Moderation */}
      {activeTab === 'moderation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Notes Moderation */}
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              Academic Notes Moderation ({allNotes.length})
            </h2>
            {allNotes.length === 0 ? (
              <p style={{ color: '#756860' }}>No academic notes found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ background: '#FBF9F7', borderBottom: '2px solid #EFEAE3', textAlign: 'left' }}>
                      <th style={{ padding: '10px' }}>Title</th>
                      <th style={{ padding: '10px' }}>Subject</th>
                      <th style={{ padding: '10px' }}>Semester</th>
                      <th style={{ padding: '10px' }}>Uploaded By</th>
                      <th style={{ padding: '10px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allNotes.map((n) => (
                      <tr key={n.id} style={{ borderBottom: '1px solid #EFEAE3' }}>
                        <td style={{ padding: '10px', fontWeight: 600 }}>{n.title}</td>
                        <td style={{ padding: '10px', color: '#756860' }}>{n.subjectName}</td>
                        <td style={{ padding: '10px' }}>Sem {n.semester}</td>
                        <td style={{ padding: '10px', color: '#756860' }}>{n.uploadedByName || n.uploader?.username || 'Faculty'}</td>
                        <td style={{ padding: '10px' }}>
                          <button
                            onClick={() => handleDeleteNoteAdmin(n.id, n.title)}
                            style={{ padding: '4px 10px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Delete Note
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Gallery Moderation */}
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              Gallery Moderation ({allGallery.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {allGallery.map((item) => (
                <div key={item.id} style={{ background: '#FBF9F7', padding: '12px', borderRadius: '12px', border: '1px solid #EFEAE3' }}>
                  <img src={item.imageUrl} alt={item.title || 'Photo'} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{item.title || 'Untitled'}</div>
                  <div style={{ fontSize: '0.76rem', color: '#756860', marginBottom: '8px' }}>{item.category}</div>
                  <button
                    onClick={() => handleDeleteGalleryAdmin(item.id)}
                    style={{ width: '100%', padding: '4px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Delete Photo
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Provision Faculty Account */}
      {activeTab === 'provision' && (
        <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '16px', border: '1px solid #EFEAE3', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>
            Provision Faculty Member Account
          </h2>
          <p style={{ color: '#756860', fontSize: '0.88rem', marginBottom: '20px' }}>
            Faculty members cannot self-register. Department administrators provision verified faculty accounts here.
          </p>

          <form onSubmit={handleProvisionFaculty}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Account Username *</label>
                <input
                  type="text"
                  required
                  value={facUsername}
                  onChange={(e) => setFacUsername(e.target.value)}
                  placeholder="e.g. antony.joseph"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Initial Password *</label>
                <input
                  type="password"
                  required
                  value={facPassword}
                  onChange={(e) => setFacPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={facName}
                  onChange={(e) => setFacName(e.target.value)}
                  placeholder="e.g. Dr. Antony Joseph"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={facEmail}
                  onChange={(e) => setFacEmail(e.target.value)}
                  placeholder="e.g. antony.joseph@sbcollege.ac.in"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Designation *</label>
                <input
                  type="text"
                  required
                  value={facDesignation}
                  onChange={(e) => setFacDesignation(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Degrees *</label>
                <input
                  type="text"
                  required
                  value={facDegrees}
                  onChange={(e) => setFacDegrees(e.target.value)}
                  placeholder="B.Tech, M.Tech, Ph.D."
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Initials *</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={facInitials}
                  onChange={(e) => setFacInitials(e.target.value)}
                  placeholder="AJ"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#756860', marginBottom: '4px' }}>Specialization *</label>
              <input
                type="text"
                required
                value={facSpec}
                onChange={(e) => setFacSpec(e.target.value)}
                placeholder="Deep Learning, Computer Vision..."
                style={{ width: '100%', padding: '10px', border: '1.5px solid #EFEAE3', borderRadius: '8px' }}
              />
            </div>

            <button
              type="submit"
              disabled={provisioning}
              style={{ padding: '12px 24px', background: '#1C1917', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              {provisioning ? 'Provisioning...' : 'Provision Faculty Account'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: Chatbot Analytics */}
      {activeTab === 'analytics' && (
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #EFEAE3' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
            Department Chatbot Usage Analytics
          </h2>

          {loadingChat ? (
            <p style={{ color: '#756860' }}>Loading analytics metrics...</p>
          ) : !chatSummary ? (
            <p style={{ color: '#756860' }}>No chatbot interaction data available yet.</p>
          ) : (
            <div>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#FBF9F7', padding: '16px 24px', borderRadius: '12px', border: '1px solid #EFEAE3' }}>
                  <div style={{ fontSize: '0.8rem', color: '#756860', fontWeight: 600 }}>TOTAL SESSIONS</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1C1917', marginTop: '4px' }}>{chatSummary.totalSessions}</div>
                </div>
                <div style={{ background: '#FBF9F7', padding: '16px 24px', borderRadius: '12px', border: '1px solid #EFEAE3' }}>
                  <div style={{ fontSize: '0.8rem', color: '#756860', fontWeight: 600 }}>TOTAL MESSAGES LOGGED</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0369a1', marginTop: '4px' }}>{chatSummary.totalMessages}</div>
                </div>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: '#1C1917' }}>Recent Chat Sessions Log</h3>
              {chatSummary.recentSessions.length === 0 ? (
                <p style={{ color: '#756860', fontSize: '0.88rem' }}>No recent chat sessions recorded.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {chatSummary.recentSessions.map((session: any) => (
                    <div key={session.id} style={{ background: '#FBF9F7', padding: '16px', borderRadius: '12px', border: '1px solid #EFEAE3' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#756860', marginBottom: '8px' }}>
                        <span>Session: <strong>{session.sessionId.substring(0, 12)}...</strong></span>
                        <span>User: <strong>{session.user?.username || 'Anonymous Guest'}</strong></span>
                        <span>Date: {new Date(session.updatedAt).toLocaleString()}</span>
                      </div>
                      <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', fontSize: '0.84rem' }}>
                        {session.messages.map((m: any) => (
                          <div key={m.id} style={{ marginBottom: '6px' }}>
                            <strong style={{ color: m.role === 'user' ? '#1C1917' : '#0369a1' }}>
                              {m.role === 'user' ? 'User' : 'Assistant'}:
                            </strong>{' '}
                            <span style={{ color: '#374151' }}>{m.content}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Destructive Action Confirmation Modal */}
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
                Confirm Destructive Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
