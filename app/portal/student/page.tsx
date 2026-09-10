'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { INITIAL_STUDENTS, INITIAL_PROJECTS, ACHIEVEMENTS } from '@/lib/mockData';
import { Student, CollegeWing } from '@/lib/types';
import { saveUserAccount } from '@/lib/userApi';
import { 
  User, 
  Edit3, 
  FolderGit2, 
  Trophy, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  LogOut,
  Droplet,
  Globe,
  ShieldCheck,
  AlertCircle,
  Upload,
  Camera
} from 'lucide-react';

export default function StudentDashboardPage() {
  const defaultStudent: Student = INITIAL_STUDENTS[0] || {
    id: 'stu-default',
    name: 'Student Portal User',
    rollNo: '240101',
    batch: 'B.Sc. AI & DS (2024 - 2027)',
    bloodGroup: 'O+ve',
    email: 'student@student.sbcollege.ac.in',
    photo: '/images/sb college logo.jpg',
    skills: ['Python', 'Data Science', 'Machine Learning'],
    wings: ['tech_team'],
    bio: 'Student in Department of AI & Data Science.',
    approvalStatus: 'approved',
  };
  const [student, setStudent] = useState<Student>(defaultStudent);
  const [isEditing, setIsEditing] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'pending' | 'approved'>('approved');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sb_current_user');
        if (saved) {
          const user = JSON.parse(saved);
          const activeStudent: Student = {
            id: user.id || defaultStudent.id,
            name: user.name || defaultStudent.name,
            rollNo: user.identifier || defaultStudent.rollNo,
            batch: 'B.Sc. AI & DS (2024 - 2027)',
            bloodGroup: 'O+ve',
            email: user.email || defaultStudent.email,
            photo: user.photo || '/images/sb college logo.jpg',
            skills: ['Python', 'Data Science', 'AI Foundations'],
            wings: ['tech_team'],
            bio: 'Active student registered in the Department of AI & Data Science.',
            approvalStatus: 'approved',
          };
          setStudent(activeStudent);
          setName(activeStudent.name);
          setPhoto(activeStudent.photo);
        }
      } catch (e) {}
    }
  }, []);

  // Edit form fields
  const [name, setName] = useState(student.name);
  const [photo, setPhoto] = useState(student.photo);
  const [bloodGroup, setBloodGroup] = useState(student.bloodGroup);
  const [linkedIn, setLinkedIn] = useState(student.linkedIn || '');
  const [portfolioUrl, setPortfolioUrl] = useState(student.portfolioUrl || '');
  const [skills, setSkills] = useState(student.skills.join(', '));
  const [selectedWings, setSelectedWings] = useState<CollegeWing[]>(student.wings);
  const [bio, setBio] = useState(student.bio);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleWing = (wing: CollegeWing) => {
    setSelectedWings(prev => 
      prev.includes(wing) ? prev.filter(w => w !== wing) : [...prev, wing]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStudent: Student = {
      ...student,
      name,
      photo,
      bloodGroup,
      linkedIn: linkedIn || undefined,
      portfolioUrl: portfolioUrl || undefined,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      wings: selectedWings,
      bio,
    };
    setStudent(updatedStudent);

    // Save to localStorage and API
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('sb_current_user');
        if (savedUser) {
          const userObj = JSON.parse(savedUser);
          userObj.name = name;
          userObj.photo = photo;
          localStorage.setItem('sb_current_user', JSON.stringify(userObj));
          await saveUserAccount(userObj);
        }

        const savedLogins = localStorage.getItem('sb_managed_logins');
        if (savedLogins) {
          const logins: any[] = JSON.parse(savedLogins);
          const updatedLogins = logins.map(u => {
            if (u.id === student.id || u.name === student.name) {
              return { ...u, name, photo };
            }
            return u;
          });
          localStorage.setItem('sb_managed_logins', JSON.stringify(updatedLogins));
          window.dispatchEvent(new Event('storage'));
        }
      } catch (err) {}
    }

    setSubmissionStatus('pending');
    setIsEditing(false);
  };

  const studentProjects = INITIAL_PROJECTS.filter(p => 
    p.teamMembers.includes(student.name) || p.submittedBy === student.name
  );

  return (
    <div className="bg-[#F7F8F9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm bg-slate-100 flex-shrink-0">
              <Image
                src={student.photo}
                alt={student.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#12192B]">{student.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Active Student
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Roll No: <strong className="text-slate-800">{student.rollNo}</strong> • {student.batch}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="text-rose-600 font-semibold">Blood: {student.bloodGroup}</span>
                <span>•</span>
                <span>{student.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#12192B] text-white hover:bg-[#FA7538] transition flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <Link
              href="/portal"
              className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Admin Review Status Banner (PRD Section 12 & 24) */}
        {submissionStatus === 'pending' && (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
              <span>
                <strong>Profile Edits Submitted for Admin Moderation:</strong> Your updated skills, bio, and wings are currently awaiting administrator verification before going live.
              </span>
            </div>
            <span className="font-bold bg-amber-200/80 px-2.5 py-0.5 rounded-full">
              Status: Pending Approval
            </span>
          </div>
        )}

        {/* Profile Edit Form Modal / Inline Box */}
        {isEditing && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#1A1A1A]">Edit Student Academic Profile</h3>
              <p className="text-xs text-slate-400">Updates are moderated by the department administration.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Profile Picture File Upload */}
              <div className="p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs flex-shrink-0">
                  <Image src={photo} alt={name} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="font-bold text-slate-800 block">Change Profile Picture</span>
                  <p className="text-[11px] text-slate-500">Upload a new photo for your profile (JPEG, PNG, WebP up to 5MB).</p>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-700 hover:bg-slate-100 transition mt-1">
                    <Upload className="w-3.5 h-3.5 text-[#FA7538]" /> Choose Image File
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                  >
                    <option>A+ve</option>
                    <option>A-ve</option>
                    <option>B+ve</option>
                    <option>B-ve</option>
                    <option>O+ve</option>
                    <option>O-ve</option>
                    <option>AB+ve</option>
                    <option>AB-ve</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedIn}
                    onChange={e => setLinkedIn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Portfolio / Personal Website</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={e => setPortfolioUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-2">
                  Select Affiliated College Wings (Automatically links to Activities page)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'tech_team', label: 'Tech Team' },
                    { id: 'media_team', label: 'Media Wing' },
                    { id: 'nss', label: 'NSS' },
                    { id: 'ncc', label: 'NCC' },
                    { id: 'sports', label: 'Sports' },
                  ].map(w => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => toggleWing(w.id as CollegeWing)}
                      className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-xs transition ${
                        selectedWings.includes(w.id as CollegeWing)
                          ? 'bg-[#FA7538] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {selectedWings.includes(w.id as CollegeWing) ? '✓ ' : '+ '}
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Bio / Ambition</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-full text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] shadow-sm"
                >
                  Submit Changes for Review
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: My Profile Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <User className="w-5 h-5 text-[#FA7538]" />
              My Profile Details
            </h3>
            <div className="space-y-2 text-xs text-[#5C6470]">
              <div><span className="font-semibold text-slate-700">Roll Number:</span> {student.rollNo}</div>
              <div><span className="font-semibold text-slate-700">Blood Group:</span> {student.bloodGroup}</div>
              <div><span className="font-semibold text-slate-700">Program:</span> {student.batch}</div>
              <div><span className="font-semibold text-slate-700">Portfolio:</span> <a href={student.portfolioUrl} target="_blank" className="text-[#FA7538] hover:underline">kevinpaul.dev</a></div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase mb-1">My Skills:</div>
              <div className="flex flex-wrap gap-1">
                {student.skills.map(sk => (
                  <span key={sk} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px]">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: My Projects */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-[#2E7D50]" />
                My Projects ({studentProjects.length})
              </h3>
              <Link href="/projects" className="text-xs font-bold text-[#2E7D50] hover:underline">
                + New
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {studentProjects.map(p => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="p-3 bg-[#F7F8F9] rounded-2xl block hover:bg-white hover:border-[#2E7D50] border border-slate-200/80 transition"
                >
                  <div className="font-bold text-slate-800">{p.title}</div>
                  <div className="text-slate-400 mt-0.5 text-[11px]">
                    Rating: ★ {p.rating.toFixed(1)} • Status: {p.status}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Card 3: Quick Study Materials */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Academic Hub
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                href="/academics/syllabus"
                className="p-3 bg-[#F7F8F9] rounded-2xl block hover:bg-purple-50 transition border border-slate-200/80"
              >
                <div className="font-bold text-slate-800">B.Sc. Semester 4 Syllabus</div>
                <div className="text-slate-400 text-[11px]">Regulations 2024-2027 • Approved</div>
              </Link>
              <Link
                href="/academics/notes"
                className="p-3 bg-[#F7F8F9] rounded-2xl block hover:bg-purple-50 transition border border-slate-200/80"
              >
                <div className="font-bold text-slate-800">Deep Learning Lecture Notes</div>
                <div className="text-slate-400 text-[11px]">Uploaded by Dr. Arun Kumar R.</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
