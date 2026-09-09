'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FACULTY_MEMBERS, LECTURE_NOTES, INITIAL_PROJECTS } from '@/lib/mockData';
import { 
  User, 
  BookOpen, 
  FileText, 
  FolderGit2, 
  LogOut, 
  Award,
  UploadCloud,
  CheckCircle2 
} from 'lucide-react';

export default function FacultyDashboardPage() {
  const faculty = FACULTY_MEMBERS[0]; // Dr. Joseph Varghese (HOD)

  return (
    <div className="bg-[#F7F8F9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm bg-slate-100 flex-shrink-0">
              <Image
                src={faculty.photo}
                alt={faculty.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#12192B]">{faculty.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                  Faculty Lead
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {faculty.designation} • {faculty.qualification}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>{faculty.email}</span>
                <span>•</span>
                <span>{faculty.experience}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/academics/notes"
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#12192B] text-white hover:bg-[#FA7538] transition flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" /> Upload Notes
            </Link>
            <Link
              href="/portal"
              className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Notes Published by Faculty */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FA7538]" />
              My Published Notes
            </h3>
            <div className="space-y-3 text-xs">
              {LECTURE_NOTES.map(n => (
                <div key={n.id} className="p-3 bg-[#F7F8F9] rounded-2xl border border-slate-200/80">
                  <div className="font-bold text-slate-800">{n.subject}</div>
                  <div className="text-slate-400 mt-0.5 text-[11px]">
                    Sem {n.semester} • {n.downloadCount} downloads
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mentored Student Projects */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-[#2E7D50]" />
              Mentored Projects
            </h3>
            <div className="space-y-3 text-xs">
              {INITIAL_PROJECTS.slice(0, 2).map(p => (
                <div key={p.id} className="p-3 bg-[#F7F8F9] rounded-2xl border border-slate-200/80">
                  <div className="font-bold text-slate-800">{p.title}</div>
                  <div className="text-slate-400 mt-0.5 text-[11px]">
                    Rating: ★ {p.rating.toFixed(1)} ({p.ratingCount} reviews)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research & Publications */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Research & Specializations
            </h3>
            <div className="space-y-2">
              {faculty.researchInterests.map(r => (
                <div key={r} className="p-2.5 bg-slate-50 rounded-xl text-xs font-medium text-slate-700">
                  ✓ {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
