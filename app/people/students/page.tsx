'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { INITIAL_STUDENTS } from '@/lib/mockData';
import { Student } from '@/lib/types';
import { 
  Search, 
  User, 
  ArrowRight, 
  Droplet, 
  ExternalLink,
  Sparkles,
  Filter
} from 'lucide-react';

export default function StudentsDirectoryPage() {
  const [studentsList, setStudentsList] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWing, setSelectedWing] = useState('all');

  React.useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch('/api/students', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.students)) {
            setStudentsList(data.students);
          }
        }
      } catch (err) {
        console.warn('Could not fetch students from API, using initial store:', err);
      }
    }
    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return studentsList.filter(s => {
      const matchQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.rollNo.includes(searchQuery) ||
                         s.skills.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchWing = selectedWing === 'all' || s.wings.includes(selectedWing as any);
      return matchQuery && matchWing;
    });
  }, [studentsList, searchQuery, selectedWing]);

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
            Student Showcase
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Students Directory & Portfolios
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Meet the innovators, data engineers, and student leaders of St. Berchmans Department of AI & Data Science.
          </p>
        </div>
      </section>

      {/* Directory Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Search & Filter Bar */}
          <div className="bg-[#F7F8F9] p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, roll number, or skill (e.g. PyTorch)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#FA7538]"
              />
            </div>

            {/* Wing filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs">
              {[
                { id: 'all', label: 'All Students' },
                { id: 'tech_team', label: 'Tech Team' },
                { id: 'media_team', label: 'Media Wing' },
                { id: 'nss', label: 'NSS' },
                { id: 'ncc', label: 'NCC' },
                { id: 'sports', label: 'Sports' },
              ].map(w => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWing(w.id)}
                  className={`px-3.5 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                    selectedWing === w.id
                      ? 'bg-[#FA7538] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
              <div
                key={student.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-200 shadow-sm">
                      <Image
                        src={student.photo}
                        alt={student.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#1A1A1A] group-hover:text-[#FA7538] transition-colors">
                        {student.name}
                      </h3>
                      <div className="text-xs text-slate-400">
                        Roll: {student.rollNo} • {student.batch.split('(')[0]}
                      </div>
                      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 mt-1 bg-rose-50 px-2 py-0.5 rounded-full">
                        <Droplet className="w-3 h-3" /> Blood: {student.bloodGroup}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#5C6470] leading-relaxed mb-4 line-clamp-2">
                    {student.bio}
                  </p>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {student.skills.slice(0, 4).map(skill => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {student.skills.length > 4 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] text-slate-400">
                        +{student.skills.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Wings */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {student.wings.map(wing => (
                      <span
                        key={wing}
                        className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-[#FFF5F0] text-[#FA7538]"
                      >
                        {wing.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/people/students/${student.id}`}
                    className="text-xs font-bold text-[#12192B] group-hover:text-[#FA7538] flex items-center gap-1 transition-colors"
                  >
                    View Academic Profile <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm bg-[#F7F8F9] rounded-3xl border border-dashed border-slate-200">
              No students found matching your criteria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
