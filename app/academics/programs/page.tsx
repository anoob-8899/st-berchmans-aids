'use client';
import { EditableText } from '@/components/shared/EditableText';


import React from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { 
  GraduationCap, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Award, 
  Briefcase,
  ArrowRight
} from 'lucide-react';

export default function ProgramsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
            Degree Offerings
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"><EditableText contentKey="programs.title" defaultValue="Academic Programs Offered" /></h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Autonomous curriculum tailored for real-world artificial intelligence and modern data science engineering.
          </p>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Program 1: B.Sc. AI & Data Science */}
          <div className="bg-[#F7F8F9] p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white">
                  Undergraduate Degree
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700">
                  UGC Recognized Autonomous
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
                B.Sc. in Artificial Intelligence & Data Science
              </h2>

              <p className="text-sm sm:text-base text-[#5C6470] leading-relaxed">
                A 3-year full-time vocational undergraduate program emphasizing 60% hands-on practical lab coursework and 40% foundational mathematical theory. Features multiple exit points, industrial internships, and deep dives into Python, Machine Learning, Computer Vision, and Big Data.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Duration:</span>
                  <span className="font-bold text-slate-800">3 Years (6 Semesters)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Eligibility:</span>
                  <span className="font-bold text-slate-800">+2 with Mathematics</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Internship:</span>
                  <span className="font-bold text-emerald-700">Mandatory Final Sem</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-center">
              <h3 className="font-bold text-sm text-slate-800">Career Trajectories</h3>
              <ul className="text-xs text-[#5C6470] space-y-2 text-left">
                <li className="flex items-center gap-2">✓ Junior Machine Learning Engineer</li>
                <li className="flex items-center gap-2">✓ Data Analyst & BI Developer</li>
                <li className="flex items-center gap-2">✓ Python Full-Stack AI Developer</li>
                <li className="flex items-center gap-2">✓ Computer Vision Specialist</li>
              </ul>
              <Link
                href="/academics/syllabus"
                className="w-full py-3 px-4 rounded-full bg-[#12192B] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#1C2640] transition block text-center"
              >
                Download B.Sc. Syllabus →
              </Link>
            </div>
          </div>

          {/* Program 2: M.Sc Artificial Intelligence */}
          <div className="bg-[#F7F8F9] p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2E7D50] text-white">
                  Postgraduate Degree
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700">
                  Advanced Autonomous Research
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
                M.Sc in Artificial Intelligence
              </h2>

              <p className="text-sm sm:text-base text-[#5C6470] leading-relaxed">
                A 2-year rigorous postgraduate degree for graduates seeking advanced research in Large Language Models, Generative Diffusion Networks, Reinforcement Learning, and Distributed High-Performance Computing.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Duration:</span>
                  <span className="font-bold text-slate-800">2 Years (4 Semesters)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Eligibility:</span>
                  <span className="font-bold text-slate-800">B.Sc / B.Sc. / B.Tech</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Research Thesis:</span>
                  <span className="font-bold text-purple-700">Scopus Publication Req.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-center">
              <h3 className="font-bold text-sm text-slate-800">Career Trajectories</h3>
              <ul className="text-xs text-[#5C6470] space-y-2 text-left">
                <li className="flex items-center gap-2">✓ AI Research Scientist</li>
                <li className="flex items-center gap-2">✓ Enterprise LLM Engineer</li>
                <li className="flex items-center gap-2">✓ Deep Learning Architect</li>
                <li className="flex items-center gap-2">✓ Ph.D. & Academic Researcher</li>
              </ul>
              <Link
                href="/academics/syllabus"
                className="w-full py-3 px-4 rounded-full bg-[#12192B] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#1C2640] transition block text-center"
              >
                Download M.Sc Syllabus →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
