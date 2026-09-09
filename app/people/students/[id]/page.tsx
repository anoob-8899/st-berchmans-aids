'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_STUDENTS, INITIAL_PROJECTS, ACHIEVEMENTS } from '@/lib/mockData';
import { 
  ArrowLeft, 
  Droplet, 
  Globe, 
  Share2, 
  FolderGit2, 
  Trophy, 
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params?.id as string;

  const student = INITIAL_STUDENTS.find(s => s.id === studentId) || INITIAL_STUDENTS[0];

  // Projects where this student is a team member or submitter
  const studentProjects = INITIAL_PROJECTS.filter(p => 
    p.teamMembers.includes(student.name) || p.submittedBy === student.name
  );

  // Achievements where this student is tagged
  const studentAchievements = ACHIEVEMENTS.filter(a => 
    a.taggedStudentIds.includes(student.id) || a.studentNames.includes(student.name)
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Top Banner */}
      <section className="bg-[#12192B] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link
            href="/people/students"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Students Directory
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl flex-shrink-0 bg-slate-700">
              <Image
                src={student.photo}
                alt={student.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white">
                  {student.batch.split('(')[0]}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <Droplet className="w-3 h-3" /> Blood: {student.bloodGroup}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                {student.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300">
                Roll Number: <span className="font-semibold text-white">{student.rollNo}</span> • St. Berchmans College
              </p>

              {/* Social Links */}
              <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
                {student.linkedIn && (
                  <a
                    href={student.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-800 hover:bg-[#FA7538] text-white transition"
                    title="LinkedIn Profile"
                  >
                    <Share2 className="w-4 h-4" />
                  </a>
                )}
                {student.portfolioUrl && (
                  <a
                    href={student.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-800 hover:bg-[#FA7538] text-white transition"
                    title="Portfolio / Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Biography & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 bg-[#F7F8F9] p-7 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-[#1A1A1A]">Student Biography</h3>
              <p className="text-sm text-[#5C6470] leading-relaxed">
                {student.bio}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Technical Competencies & Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map(sk => (
                    <span
                      key={sk}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-sm"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Active College Wings */}
            <div className="md:col-span-4 bg-[#12192B] text-white p-7 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FA7538]" />
                Affiliated College Wings
              </h3>
              <div className="space-y-2">
                {student.wings.map(wing => (
                  <Link
                    key={wing}
                    href={`/activities#${wing}`}
                    className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 block hover:border-[#FA7538] transition group"
                  >
                    <div className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-[#FA7538]">
                      {wing.replace('_', ' ')}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Active Participant
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Connected Projects */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
                <FolderGit2 className="w-6 h-6 text-[#FA7538]" />
                Projects Contributed ({studentProjects.length})
              </h2>
              <Link href="/projects" className="text-xs font-bold text-[#FA7538] hover:underline">
                View All Projects →
              </Link>
            </div>

            {studentProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {studentProjects.map(proj => (
                  <Link
                    key={proj.id}
                    href={`/projects/${proj.id}`}
                    className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFF5F0] text-[#FA7538]">
                          {proj.category}
                        </span>
                        <span className="text-xs font-bold text-amber-500">
                          ★ {proj.rating.toFixed(1)}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#1A1A1A] group-hover:text-[#FA7538] transition-colors mb-2">
                        {proj.title}
                      </h3>

                      <p className="text-xs text-[#5C6470] line-clamp-2 mb-4">
                        {proj.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>Status: {proj.status}</span>
                      <span className="font-bold text-[#12192B] group-hover:text-[#FA7538]">
                        Details →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-[#F7F8F9] rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
                No public projects linked to this student yet.
              </div>
            )}
          </div>

          {/* Connected Achievements (Tagged with @) */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Tagged Achievements & Awards ({studentAchievements.length})
            </h2>

            {studentAchievements.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {studentAchievements.map(ach => (
                  <div
                    key={ach.id}
                    className="p-6 bg-[#F7F8F9] rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4"
                  >
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 flex-shrink-0">
                      <Image
                        src={ach.image}
                        alt={ach.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 mb-1 inline-block">
                        {ach.category}
                      </span>
                      <h4 className="font-bold text-sm text-[#1A1A1A]">
                        {ach.title}
                      </h4>
                      <p className="text-xs text-[#5C6470] mt-1 line-clamp-2">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-[#F7F8F9] rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
                No achievements recorded for this student.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
