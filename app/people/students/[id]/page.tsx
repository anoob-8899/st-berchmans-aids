'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  ExternalLink,
  User,
  Trash2
} from 'lucide-react';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminSaved = localStorage.getItem('sb_admin_logged_in');
      const currentUser = localStorage.getItem('sb_current_user');
      if (adminSaved === 'true' || (currentUser && JSON.parse(currentUser).role === 'admin')) {
        setIsAdmin(true);
      }
    }
  }, []);

  const [student, setStudent] = React.useState<any>(() => {
    return INITIAL_STUDENTS.find(s => s.id === studentId || s.rollNo === studentId) || INITIAL_STUDENTS[0];
  });
  const [allProjects, setAllProjects] = React.useState<any[]>(INITIAL_PROJECTS);

  React.useEffect(() => {
    async function loadData() {
      if (!studentId) return;
      try {
        const [stuRes, projRes] = await Promise.all([
          fetch(`/api/students?id=${encodeURIComponent(studentId)}`, { cache: 'no-store' }),
          fetch('/api/projects', { cache: 'no-store' })
        ]);
        if (stuRes.ok) {
          const stuData = await stuRes.json();
          if (stuData.success && stuData.student) {
            setStudent(stuData.student);
          }
        }
        if (projRes.ok) {
          const projData = await projRes.json();
          if (projData.success && Array.isArray(projData.projects)) {
            setAllProjects(projData.projects);
          }
        }
      } catch (err) {
        console.warn('Error loading dynamic student detail:', err);
      }
    }
    loadData();
  }, [studentId]);

  if (!student) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Student Profile Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">The requested student profile is unavailable or undergoing update.</p>
        <Link href="/people/students" className="mt-4 px-5 py-2.5 rounded-full bg-[#12192B] text-white text-xs font-bold uppercase tracking-wider">
          Return to Students Directory
        </Link>
      </div>
    );
  }

  // Projects where this student is a team member or submitter
  const studentProjects = allProjects.filter(p => 
    p.teamMembers?.includes(student.name) || p.submittedBy === student.name
  );

  // Achievements where this student is tagged
  const studentAchievements = ACHIEVEMENTS.filter(a => 
    a.taggedStudentIds.includes(student.id) || a.studentNames.includes(student.name)
  );

  const handleDeleteThisProfile = async () => {
    if (!student) return;
    if (confirm(`Are you sure you want to permanently delete profile for ${student.name}?`)) {
      try {
        await Promise.all([
          fetch(`/api/students?id=${encodeURIComponent(student.id)}`, { method: 'DELETE' }),
          fetch(`/api/students?id=${encodeURIComponent(student.name)}`, { method: 'DELETE' }),
          fetch(`/api/users?id=${encodeURIComponent(student.id)}`, { method: 'DELETE' })
        ]);
        alert(`Profile for ${student.name} deleted.`);
        router.push('/people/students');
      } catch (err) {
        alert('Failed to delete profile.');
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Top Banner */}
      <section className="bg-[#12192B] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/people/students"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Students Directory
            </Link>

            {isAdmin && (
              <button
                type="button"
                onClick={handleDeleteThisProfile}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Permanently delete this student profile (Admin)"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Profile (Admin)
              </button>
            )}
          </div>

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
                  {(student.skills || []).map((sk: string) => (
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
                {(student.wings || []).map((wing: string) => (
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
