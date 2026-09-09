'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { FACULTY_MEMBERS } from '@/lib/mockData';
import { Mail, Phone, ExternalLink, Award, BookOpen, GraduationCap } from 'lucide-react';

export default function FacultyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
            Academic Faculty
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Faculty Directory & Researchers
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Mentoring scholars and engineering innovators through premier research and holistic academic stewardship.
          </p>
        </div>
      </section>

      {/* Faculty Cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FACULTY_MEMBERS.map(fac => (
              <div
                key={fac.id}
                className="bg-[#F7F8F9] rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start hover:bg-white hover:border-[#FA7538]/40 hover:shadow-md transition-all group"
              >
                {/* Photo */}
                <div className="relative w-full sm:w-44 h-52 rounded-2xl overflow-hidden shadow bg-slate-200 flex-shrink-0">
                  <Image
                    src={fac.photo}
                    alt={fac.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] group-hover:text-[#FA7538] transition-colors">
                      {fac.name}
                    </h3>
                    <div className="text-xs font-bold text-[#FA7538]">
                      {fac.designation}
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 font-medium">
                    <span className="text-slate-400 block font-normal text-[11px]">Qualification:</span>
                    {fac.qualification}
                  </div>

                  <div className="text-xs text-[#5C6470]">
                    <span className="text-slate-400 block font-normal text-[11px]">Specialization:</span>
                    {fac.specialization}
                  </div>

                  {/* Research Interests Tags */}
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Research Areas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {fac.researchInterests.map(item => (
                        <span
                          key={item}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white text-slate-700 border border-slate-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <a
                      href={`mailto:${fac.email}`}
                      className="flex items-center gap-1 hover:text-[#FA7538]"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{fac.email}</span>
                    </a>
                    {fac.phone && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{fac.phone}</span>
                      </span>
                    )}
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
