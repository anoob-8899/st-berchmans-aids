'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ACHIEVEMENTS, INITIAL_STUDENTS } from '@/lib/mockData';
import { Trophy, Award, Calendar, ExternalLink } from 'lucide-react';

export default function AchievementsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
            Excellence Recognition
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Hall of Achievements
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Celebrating national hackathon honors, international research papers, and prestigious student recognitions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          {ACHIEVEMENTS.length === 0 && (
            <div className="py-16 text-center text-xs text-slate-400 bg-[#F7F8F9] rounded-3xl border border-dashed border-slate-200">
              No achievements or awards posted yet.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ACHIEVEMENTS.map(ach => (
              <div
                key={ach.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={ach.image}
                      alt={ach.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow">
                        {ach.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{ach.date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#FA7538] transition-colors leading-snug">
                      {ach.title}
                    </h3>

                    <p className="text-xs text-[#5C6470] leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>

                {/* Tagged Student Mentions (PRD Section 18: @ symbol connection) */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 pt-4">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Tagged Students:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ach.studentNames.map((name, i) => {
                      const studentMatch = INITIAL_STUDENTS.find(s => s.name === name);
                      return studentMatch ? (
                        <Link
                          key={name}
                          href={`/people/students/${studentMatch.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D50] bg-[#EEF8F2] px-2.5 py-1 rounded-full hover:bg-[#2E7D50] hover:text-white transition"
                        >
                          @{name}
                        </Link>
                      ) : (
                        <span
                          key={name}
                          className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full"
                        >
                          @{name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
