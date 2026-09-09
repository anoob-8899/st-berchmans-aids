'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { SKILL_HUB_COURSES } from '@/lib/mockData';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  GraduationCap, 
  CheckCircle2, 
  Building2,
  Filter,
  ArrowRight
} from 'lucide-react';

export default function SkillHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Artificial Intelligence', 'Software Development', 'Data Science', 'Media & Imaging', 'Communication', 'Defence & Leadership'];

  const filteredCourses = selectedCategory === 'all' 
    ? SKILL_HUB_COURSES 
    : SKILL_HUB_COURSES.filter(c => c.category === selectedCategory);

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            Skill Development Initiative
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            SB Skill Hub (26 Industry Courses)
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Empowering individuals with personal and professional skills through courses conducted in partnership with premier industry agencies.
          </p>
        </div>
      </section>

      {/* Official Narrative Section */}
      <section className="py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <SectionHeading
                eyebrow="Industry Collaborations"
                title="Practical, Industry-Relevant Upskilling After Regular Class Hours"
              />

              <div className="text-sm sm:text-base text-[#5C6470] leading-relaxed space-y-4">
                <p>
                  The <strong>SB Skill Hub</strong> is an initiative of St Berchmans College, Changanassery, aimed at fostering skill development and empowering individuals with the tools needed for personal and professional growth.
                </p>
                <p>
                  Offering a diverse selection of <strong>26 courses</strong>, the hub addresses the evolving demands of various industries through programs developed in collaboration with reputed agencies such as the <strong>ICT Academy of Kerala (ICTAK)</strong>, <strong>Additional Skill Acquisition Programme (ASAP)</strong>, <strong>Ernst & Young (EY)</strong>, <strong>Centre for Development of Imaging Technology (CDIT)</strong>, <strong>Burlington English</strong>, and <strong>Berchmans Defence Academy (BEDA)</strong>.
                </p>
                <p>
                  This collaborative approach ensures that the courses remain industry-relevant, equipping learners with up-to-date knowledge and practical skills to excel in their chosen fields.
                </p>
              </div>

              {/* Schedule Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-[#F7F8F9] rounded-2xl border border-slate-200">
                  <Clock className="w-5 h-5 text-[#FA7538] mb-2" />
                  <div className="text-xs font-bold text-slate-800">2:45 PM – 5:00 PM</div>
                  <div className="text-[11px] text-slate-500">Weekdays & Saturdays</div>
                </div>
                <div className="p-4 bg-[#F7F8F9] rounded-2xl border border-slate-200">
                  <Calendar className="w-5 h-5 text-[#2E7D50] mb-2" />
                  <div className="text-xs font-bold text-slate-800">45 Hours Avg.</div>
                  <div className="text-[11px] text-slate-500">Hands-on Duration</div>
                </div>
                <div className="p-4 bg-[#F7F8F9] rounded-2xl border border-slate-200">
                  <GraduationCap className="w-5 h-5 text-purple-600 mb-2" />
                  <div className="text-xs font-bold text-slate-800">Multiple Modes</div>
                  <div className="text-[11px] text-slate-500">Campus, Online & Hybrid</div>
                </div>
              </div>
            </div>

            {/* Partner Agency Logos Card */}
            <div className="lg:col-span-5 bg-[#12192B] text-white p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FA7538]" />
                Collaborating Agencies
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { name: "ICT Academy of Kerala (ICTAK)", role: "IT & Tech Certifications" },
                  { name: "Additional Skill Acquisition Programme (ASAP)", role: "Kerala Govt Skill Agency" },
                  { name: "Ernst & Young (EY)", role: "Financial & Corporate Analytics" },
                  { name: "Centre for Development of Imaging Technology (CDIT)", role: "Digital Media & Imaging" },
                  { name: "Burlington English", role: "International Language Mastery" },
                  { name: "Berchmans Defence Academy (BEDA)", role: "Strategic & Defence Training" },
                ].map((agency, i) => (
                  <div key={i} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{agency.name}</div>
                      <div className="text-[11px] text-slate-400">{agency.role}</div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog Grid */}
      <section className="py-16 sm:py-20 bg-[#F7F8F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Curriculum Offerings"
            title="Featured Skill Hub Courses"
            subtitle="Explore our hands-on course syllabus designed to boost your professional portfolio alongside your degree."
            centered
          />

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#FA7538] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'All 26 Courses' : cat}
              </button>
            ))}
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div
                key={course.id}
                className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFF5F0] text-[#FA7538]">
                      {course.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ⏱ {course.durationHours} hrs
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                    {course.title}
                  </h3>

                  <div className="text-xs font-semibold text-emerald-700 mb-3">
                    Partner: {course.partner}
                  </div>

                  <p className="text-xs text-[#5C6470] leading-relaxed mb-6">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Mode: {course.mode}</span>
                  <Link
                    href="/portal"
                    className="font-bold text-[#FA7538] hover:underline flex items-center gap-1"
                  >
                    Enroll via Portal →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
