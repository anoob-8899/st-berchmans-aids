'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminEdit } from '@/lib/AdminEditContext';
import { MARIO_KNOWLEDGE_BASE, queryMarioKnowledge, KnowledgeAnswer } from '@/lib/marioKnowledge';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  FolderGit2, 
  MessageSquare, 
  FileText, 
  BookOpen, 
  Bell, 
  LogOut,
  Trash2,
  Edit,
  Globe,
  Save,
  RotateCcw,
  Sparkles,
  Users,
  Key,
  Lock,
  Unlock,
  UserPlus,
  UserX,
  Search,
  Filter,
  ShieldAlert,
  Plus,
  AlertTriangle,
  RefreshCw,
  Copy,
  Mail,
  User,
  Bot,
  Brain
} from 'lucide-react';

interface PendingItem {
  id: string;
  type: 'profile_edit' | 'project_submission' | 'comment';
  applicant: string;
  title: string;
  details: string;
  date: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  identifier: string;
  department: string;
  status: 'active' | 'suspended';
  lastLogin: string;
  tempPassword?: string;
}

const DEFAULT_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'admin-main',
    name: 'Chief Administrator',
    email: 'adminaids',
    role: 'admin',
    identifier: 'Staff: ADM-SYS-01',
    department: 'Artificial Intelligence & Data Science',
    status: 'active',
    lastLogin: 'Active Now',
  }
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdminMode, setIsAdminMode, getContent, updateContent, resetAllContent, setIsAdminLoggedIn } = useAdminEdit();

  useEffect(() => {
    setIsAdminLoggedIn(true);
  }, []);

  const [pendingQueue, setPendingQueue] = useState<PendingItem[]>([]);

  const [activeTab, setActiveTab] = useState<'approvals' | 'logins' | 'content_editor' | 'notes' | 'announcements' | 'mario_trainer'>('logins');
  const [notification, setNotification] = useState<string | null>(null);

  // Content state
    // MARIO AI Training States
  const [customKnowledge, setCustomKnowledge] = useState<KnowledgeAnswer[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sb_mario_custom_knowledge');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [aiKeywords, setAiKeywords] = useState('');
  const [aiAnswerEn, setAiAnswerEn] = useState('');
  const [aiAnswerMl, setAiAnswerMl] = useState('');
  const [aiRelatedLink, setAiRelatedLink] = useState('');
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState<{ answer: string; relatedLink?: string } | null>(null);

  const saveCustomKnowledge = (updated: KnowledgeAnswer[]) => {
    setCustomKnowledge(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sb_mario_custom_knowledge', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const handleAddAiRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiKeywords.trim() || !aiAnswerEn.trim()) {
      notify('Please provide trigger keywords and English answer.');
      return;
    }

    const keywordsArray = aiKeywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    const newRule: KnowledgeAnswer = {
      id: `custom-kb-${Date.now()}`,
      keywords: keywordsArray,
      answerEn: aiAnswerEn.trim(),
      answerMl: aiAnswerMl.trim() || aiAnswerEn.trim(),
      relatedLink: aiRelatedLink.trim() || undefined,
      isCustom: true,
    };

    const updated = [newRule, ...customKnowledge];
    saveCustomKnowledge(updated);
    setAiKeywords('');
    setAiAnswerEn('');
    setAiAnswerMl('');
    setAiRelatedLink('');
    notify('Successfully trained MARIO with new AI Q&A rule!');
  };

  const handleDeleteAiRule = (ruleId: string) => {
    const updated = customKnowledge.filter(k => k.id !== ruleId);
    saveCustomKnowledge(updated);
    notify('Trained AI rule removed from MARIO knowledge base.');
  };

  const handleTestAiQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;
    const res = queryMarioKnowledge(testQuery, 'en');
    setTestResult(res);
  };

  const [heroTitle, setHeroTitle] = useState(getContent('home.hero.title', 'Department of Artificial Intelligence & Data Science'));
  const [heroSubtitle, setHeroSubtitle] = useState(getContent('home.hero.subtitle', 'Moulding future innovators through cutting-edge AI research, industry-ready data science mastery, and holistic ethical leadership.'));
  const [visionText, setVisionText] = useState(getContent('vision.text', 'To be a premier center of intellectual illumination and technological transformation, moulding young men and women of unimpeachable character, creative technical vision, and dedication to God and humanity.'));

  // User & Login Management States
  const [userLogins, setUserLogins] = useState<ManagedUser[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sb_managed_logins');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_MANAGED_USERS;
  });

  const [loginSearch, setLoginSearch] = useState('');
  const [loginRoleFilter, setLoginRoleFilter] = useState<'all' | 'student' | 'faculty' | 'admin'>('all');
  const [loginStatusFilter, setLoginStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Add User Form States
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [newUserIdentifier, setNewUserIdentifier] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('SBCollege@2026');

  const saveUserLogins = (updatedUsers: ManagedUser[]) => {
    setUserLogins(updatedUsers);
    try {
      localStorage.setItem('sb_managed_logins', JSON.stringify(updatedUsers));
    } catch (e) {}
  };

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Toggle user active / suspended status
  const handleToggleStatus = (userId: string) => {
    const updated = userLogins.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: newStatus as 'active' | 'suspended' };
      }
      return u;
    });
    saveUserLogins(updated);
    const target = updated.find(u => u.id === userId);
    notify(`Account status updated: ${target?.name} is now ${target?.status.toUpperCase()}`);
  };

  // Reset password
  const handleResetPassword = (userId: string) => {
    const tempPass = `SB#AI-${Math.floor(1000 + Math.random() * 9000)}!`;
    const updated = userLogins.map(u => {
      if (u.id === userId) {
        return { ...u, tempPassword: tempPass };
      }
      return u;
    });
    saveUserLogins(updated);
    const target = updated.find(u => u.id === userId);
    notify(`Temporary password generated for ${target?.name}: ${tempPass}`);
  };

  // Delete user login
  const handleDeleteUser = (userId: string, name: string) => {
    if (confirm(`Are you sure you want to revoke login access and remove ${name}?`)) {
      const updated = userLogins.filter(u => u.id !== userId);
      saveUserLogins(updated);
      notify(`Login credentials deleted for ${name}`);
    }
  };

  // Create new user login
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      notify('Please fill in all required fields.');
      return;
    }

    const newUser: ManagedUser = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      role: newUserRole,
      identifier: newUserIdentifier.trim() || (newUserRole === 'student' ? 'Roll: ' + Math.floor(240000 + Math.random() * 999) : 'Staff ID: ' + Math.floor(100 + Math.random() * 900)),
      department: 'Artificial Intelligence & Data Science',
      status: 'active',
      lastLogin: 'Never logged in',
      tempPassword: newUserPassword.trim()
    };

    const updated = [newUser, ...userLogins];
    saveUserLogins(updated);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserIdentifier('');
    notify(`Successfully created and provisioned login for ${newUser.name}!`);
  };

  // Filtered users list
  const filteredUsers = userLogins.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(loginSearch.toLowerCase()) ||
                        u.email.toLowerCase().includes(loginSearch.toLowerCase()) ||
                        u.identifier.toLowerCase().includes(loginSearch.toLowerCase());
    const matchRole = loginRoleFilter === 'all' || u.role === loginRoleFilter;
    const matchStatus = loginStatusFilter === 'all' || u.status === loginStatusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleApprove = (id: string, title: string) => {
    setPendingQueue(prev => prev.filter(item => item.id !== id));
    notify(`Approved: ${title}`);
  };

  const handleReject = (id: string, title: string) => {
    setPendingQueue(prev => prev.filter(item => item.id !== id));
    notify(`Rejected submission: ${title}`);
  };

  const handleSaveAllContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent('home.hero.title', heroTitle);
    updateContent('home.hero.subtitle', heroSubtitle);
    updateContent('vision.text', visionText);
    notify('Website content changes saved and published live!');
  };

  return (
    <div className="bg-[#F7F8F9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header Console Banner */}
        <div className="bg-[#12192B] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FA7538] text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FA7538]">
                Chief Content & System Administrator
              </span>
              <h1 className="text-2xl font-extrabold text-white">
                Department Management Console
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                St. Berchmans College Department of AI & Data Science
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${
                isAdminMode 
                  ? 'bg-[#FA7538] text-white' 
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isAdminMode ? 'In-Place Edit: ON' : 'Enable In-Place Edit'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAdminLoggedIn(false);
                router.push('/portal');
              }}
              className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {notification && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 border border-emerald-200 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
        )}

        {/* Tabs Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
          {/* TAB: LOGIN & ACCESS CONTROLS (Requirement 4) */}
          <button
            type="button"
            onClick={() => setActiveTab('logins')}
            className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'logins'
                ? 'bg-[#FA7538] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Login & Access Controls ({userLogins.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('approvals')}
            className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'approvals'
                ? 'bg-[#FA7538] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Approvals Queue ({pendingQueue.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('content_editor')}
            className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'content_editor'
                ? 'bg-[#FA7538] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Website Content Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-[#FA7538] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes & Syllabus</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('announcements')}
            className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'announcements'
                ? 'bg-[#FA7538] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Announcements</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mario_trainer')}
            className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'mario_trainer'
                ? 'bg-[#FA7538] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>🤖 MARIO AI Trainer ({customKnowledge.length})</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB CONTENT: LOGIN & ACCESS CONTROLS (Requirement 4)     */}
        {/* ========================================================= */}
        {activeTab === 'logins' && (
          <div className="space-y-6">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total User Accounts</span>
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#12192B] mt-2">{userLogins.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">Students, Faculty & Staff</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Logins</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-600 mt-2">
                  {userLogins.filter(u => u.status === 'active').length}
                </div>
                <div className="text-[11px] text-emerald-600 mt-1">Authorized for full access</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suspended Logins</span>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <UserX className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-rose-600 mt-2">
                  {userLogins.filter(u => u.status === 'suspended').length}
                </div>
                <div className="text-[11px] text-rose-500 mt-1">Blocked from login portal</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Security State</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#12192B] mt-2">Active</div>
                <div className="text-[11px] text-slate-400 mt-1">Role-Based Access Enforcement</div>
              </div>
            </div>

            {/* Action Bar: Search, Filters & Add User CTA */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#FA7538]" />
                    User Credentials & Access Control Center
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Directly govern credentials for students, professors, and administrators. Suspend access, reset passwords, or provision new login accounts.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddUserModal(!showAddUserModal)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] shadow-sm flex items-center gap-2 transition self-start md:self-auto cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{showAddUserModal ? 'Cancel' : '+ Provision New User Login'}</span>
                </button>
              </div>

              {/* Add User Drawer / Modal */}
              {showAddUserModal && (
                <form onSubmit={handleCreateUser} className="p-5 rounded-2xl bg-[#F7F8F9] border border-slate-200 space-y-4 text-xs">
                  <div className="font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-[#FA7538]" />
                    Create New Official User Login
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newUserName}
                        onChange={e => setNewUserName(e.target.value)}
                        placeholder="e.g. Thomas Mathew"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#FA7538]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Official Email Address *</label>
                      <input
                        type="email"
                        required
                        value={newUserEmail}
                        onChange={e => setNewUserEmail(e.target.value)}
                        placeholder="id@sbcollege.ac.in"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#FA7538]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Access Role *</label>
                      <select
                        value={newUserRole}
                        onChange={e => setNewUserRole(e.target.value as 'student' | 'faculty' | 'admin')}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white focus:ring-2 focus:ring-[#FA7538]"
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Roll No / Staff ID</label>
                      <input
                        type="text"
                        value={newUserIdentifier}
                        onChange={e => setNewUserIdentifier(e.target.value)}
                        placeholder="e.g. Roll 240105 / FAC-AI-04"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#FA7538]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Key className="w-3.5 h-3.5 text-[#FA7538]" />
                      <span>Initial Default Password: <strong>{newUserPassword}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddUserModal(false)}
                        className="px-4 py-2 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-200 font-bold"
                      >
                        Dismiss
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-full bg-[#12192B] hover:bg-[#FA7538] text-white font-bold transition shadow-sm"
                      >
                        Save & Activate Login
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={loginSearch}
                    onChange={e => setLoginSearch(e.target.value)}
                    placeholder="Search by name, email, or ID..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#FA7538]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                    {(['all', 'student', 'faculty', 'admin'] as const).map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setLoginRoleFilter(role)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition ${
                          loginRoleFilter === role
                            ? 'bg-white text-[#12192B] shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                    {(['all', 'active', 'suspended'] as const).map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setLoginStatusFilter(status)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition ${
                          loginStatusFilter === status
                            ? 'bg-white text-[#12192B] shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">User & Identity</th>
                      <th className="py-3 px-3">Access Role</th>
                      <th className="py-3 px-3">Account Status</th>
                      <th className="py-3 px-3">Last Active</th>
                      <th className="py-3 px-3 text-right">Admin Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                              user.role === 'admin' ? 'bg-[#FA7538]' :
                              user.role === 'faculty' ? 'bg-[#2E7D50]' :
                              'bg-slate-700'
                            }`}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-[#1A1A1A]">{user.name}</div>
                              <div className="text-[11px] text-slate-400">{user.email}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{user.identifier}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user.role === 'admin' ? 'bg-[#FFF5F0] text-[#FA7538] border border-[#FA7538]/20' :
                            user.role === 'faculty' ? 'bg-[#EEF8F2] text-[#2E7D50] border border-[#2E7D50]/20' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                            }`} />
                            <span className={`font-semibold capitalize text-[11px] ${
                              user.status === 'active' ? 'text-emerald-700' : 'text-rose-600'
                            }`}>
                              {user.status}
                            </span>
                          </div>
                          {user.tempPassword && (
                            <div className="mt-1 text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-mono">
                              Temp Key: {user.tempPassword}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                          {user.lastLogin}
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Suspend / Enable Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(user.id)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 transition ${
                                user.status === 'active'
                                  ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                              title={user.status === 'active' ? 'Suspend user login' : 'Restore user login'}
                            >
                              {user.status === 'active' ? (
                                <>
                                  <UserX className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Suspend</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Activate</span>
                                </>
                              )}
                            </button>

                            {/* Reset Password */}
                            <button
                              type="button"
                              onClick={() => handleResetPassword(user.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                              title="Reset user password & generate temporary credentials"
                            >
                              <Key className="w-3.5 h-3.5 text-amber-600" />
                            </button>

                            {/* Delete User Login */}
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete user login"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          No user accounts match your search or filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB CONTENT: APPROVALS QUEUE                              */}
        {/* ========================================================= */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1A1A1A]">Moderation & Approval Pipeline</h3>
                <p className="text-xs text-slate-400">Review student profile edits, submitted projects, and written comments.</p>
              </div>

              <div className="divide-y divide-slate-100">
                {pendingQueue.map(item => (
                  <div key={item.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          item.type === 'profile_edit' ? 'bg-blue-100 text-blue-800' :
                          item.type === 'project_submission' ? 'bg-amber-100 text-amber-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {item.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">{item.date}</span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1A1A1A]">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.details}</p>
                      <div className="text-[11px] text-slate-400">Applicant: <strong>{item.applicant}</strong></div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleReject(item.id, item.title)}
                        className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-rose-200 text-rose-600 hover:bg-rose-50 transition flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(item.id, item.title)}
                        className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                    </div>
                  </div>
                ))}

                {pendingQueue.length === 0 && (
                  <div className="py-12 text-center text-xs text-slate-400">
                    🎉 All moderation items approved! The queue is clean.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB CONTENT: WEBSITE CONTENT EDITOR                       */}
        {/* ========================================================= */}
        {activeTab === 'content_editor' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#FA7538]" />
                  Universal Website Text & Content Editor
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update any text on the website directly from here, or toggle In-Place Edit Mode to click and edit any sentence directly on the live pages.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetAllContent}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isAdminMode 
                      ? 'bg-[#FA7538] text-white' 
                      : 'bg-[#12192B] text-white hover:bg-[#FA7538]'
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  {isAdminMode ? 'In-Place Mode: ON' : 'Turn On In-Place Mode'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveAllContent} className="space-y-5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Homepage Hero Headline:
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={e => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Homepage Hero Subtitle / Philosophy:
                </label>
                <textarea
                  rows={3}
                  value={heroSubtitle}
                  onChange={e => setHeroSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Institutional Vision Statement:
                </label>
                <textarea
                  rows={3}
                  value={visionText}
                  onChange={e => setVisionText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save & Publish Live Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB CONTENT: NOTES & SYLLABUS                             */}
        {/* ========================================================= */}
        {activeTab === 'notes' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#1A1A1A]">Upload Notes to Department Cloud Storage</h3>
              <p className="text-xs text-slate-400">Upload PDF notes or autonomous curriculum files.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Transformers & Self-Attention Guide"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject & Code</label>
                <input
                  type="text"
                  placeholder="e.g. Natural Language Processing (AID5103)"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#12192B] text-white hover:bg-[#FA7538] transition shadow-sm cursor-pointer"
            >
              Upload Document to Cloud Storage
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB CONTENT: PUBLISH ANNOUNCEMENTS                        */}
        {/* ========================================================= */}
        {activeTab === 'announcements' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#1A1A1A]">Publish Campus Announcement</h3>
              <p className="text-xs text-slate-400">Appears immediately in the live homepage announcement ticker.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Announcement Title (English)</label>
                <input
                  type="text"
                  placeholder="e.g. SB AI Hackathon 2026 Registration Open"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Announcement Title (Malayalam)</label>
                <input
                  type="text"
                  placeholder="e.g. എസ്.ബി എ.ഐ ഹാക്കത്തോൺ രജിസ്ട്രേഷൻ ആരംഭിച്ചു"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Content Details</label>
                <textarea
                  rows={3}
                  placeholder="Full announcement text..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm outline-none"
                />
              </div>

              <button
                type="button"
                className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] transition shadow-sm cursor-pointer"
              >
                Publish Live Announcement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}