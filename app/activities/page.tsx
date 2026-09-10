'use client';
import { EditableText } from '@/components/shared/EditableText';


import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { WINGS_INFO, INITIAL_STUDENTS } from '@/lib/mockData';
import { CollegeWing } from '@/lib/types';
import { 
  Code2, 
  Video, 
  HeartHandshake, 
  Shield, 
  Trophy, 
  Users, 
  ArrowRight 
} from 'lucide-react';

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState<string>('nss');

  // Find students belonging to a wing
  const getStudentsForWing = (wingId: string) => {
    return INITIAL_STUDENTS.filter(s => s.wings.includes(wingId as CollegeWing));
  };

  const selectedWing = WINGS_INFO.find(w => w.id === activeTab) || WINGS_INFO[0];
  const wingStudents = getStudentsForWing(selectedWing.id);

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
            Co-Curricular Life
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Department Wings & Activities
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            A vibrant ecosystem where students lead technology hackathons, media production, national service, cadet drills, and athletics.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Wing Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
            {WINGS_INFO.map(wing => (
              <button
                key={wing.id}
                type="button"
                onClick={() => setActiveTab(wing.id)}
                className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === wing.id
                    ? 'bg-[#12192B] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {wing.id === 'tech_team' && <Code2 className="w-4 h-4" />}
                {wing.id === 'media_team' && <Video className="w-4 h-4" />}
                {wing.id === 'nss' && <HeartHandshake className="w-4 h-4" />}
                {wing.id === 'ncc' && <Shield className="w-4 h-4" />}
                {wing.id === 'sports' && <Trophy className="w-4 h-4" />}
                <span>{wing.name}</span>
              </button>
            ))}
          </div>

          {/* Active Wing Highlight Card */}
          <div className="bg-[#F7F8F9] p-8 sm:p-10 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FA7538]">
                  Featured Wing Overview
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] mt-1">
                  {selectedWing.name}
                </h2>
                <div className="text-sm font-semibold text-[#2E7D50] mt-1">
                  {selectedWing.tagline}
                </div>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FA7538]" />
                <span className="font-bold text-[#1A1A1A]">{wingStudents.length}</span> Participating Members
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#5C6470] leading-relaxed max-w-3xl">
              {selectedWing.description}
            </p>
          </div>

          {/* Connected Students in this Wing (Per PRD: Name & Profile Picture only) */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">
                Affiliated Student Members
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically connected from student profile preferences.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {wingStudents.map(student => (
                <Link
                  key={student.id}
                  href={`/people/students/${student.id}`}
                  className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition text-center group"
                >
                  <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-slate-200 mb-3 border border-slate-100 shadow-sm">
                    <Image
                      src={student.photo}
                      alt={student.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A] group-hover:text-[#FA7538] transition-colors line-clamp-1">
                    {student.name}
                  </h4>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Roll: {student.rollNo}
                  </div>
                </Link>
              ))}
            </div>

            {wingStudents.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm bg-slate-50 rounded-2xl">
                No students currently registered under this wing.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
