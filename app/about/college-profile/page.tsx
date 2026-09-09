'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { COLLEGE_INFO } from '@/lib/mockData';
import { 
  Award, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export default function CollegeProfilePage() {
  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
            Institutional Legacy
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            St. Berchmans College Profile
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            First higher education institution of the Archdiocese of Changanacherry, established in 1922.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                eyebrow="Founding & Vision"
                title="A Century of Educational Eminence & Spiritual Values"
              />

              <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-[#5C6470] space-y-4">
                <p>
                  St Berchmans College is the first higher education institution of the Archdiocese of Changanacherry. The college comes under The Archdiocesan Educational and Charitable Trust of Changanacherry. This institution was founded in 1922 by <strong>Venerable Mar Thomas Kurialacherry</strong>, Bishop of Changanassery diocese.
                </p>
                <p>
                  It was started, with the noble aim of the Universal Catholic Church, to mould young men and women who will strive for excellence in every walks of life and human service. The College is recognized under sections <strong>2 (f) and 12 (B) of the UGC Act 1956</strong>.
                </p>
                <p>
                  The College was first accredited with <strong>&lsquo;Five Star&rsquo;</strong> in 1999 and reaccredited with <strong>&lsquo;A+&rsquo;</strong> in 2006. In the third cycle of accreditation in 2012, the college was again graded at A. In 2017, the college was again reaccredited with &lsquo;A&rsquo; grade.
                </p>
                <p>
                  The University Grants Commission (UGC) and the Government of Kerala granted <strong>autonomy to this college in the year 2014</strong>. In 1996 and 1997, it won the coveted <strong>&ldquo;R Shankar Award&rdquo;</strong> for the Best College in the State, instituted by the Government of Kerala.
                </p>
                <p>
                  In 2004, the UGC identified the College under its <strong>&ldquo;College with Potential for Excellence&rdquo; (CPE)</strong> scheme. The National Commission for Minority Educational Institution, New Delhi has granted minority status to the college in 2010. All the Science Departments are supported by the <strong>FIST of DST, Government of India</strong>. It has been ranked among the top 100 Indian colleges by the <strong>National Institutional Ranking Framework (NIRF)</strong>, MHRD, Government of India since 2018.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="https://sbcollege.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#12192B] text-white hover:bg-[#1C2640] transition"
                >
                  Visit Institutional Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <Link
                  href="/about/department"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFF5F0] text-[#FA7538] border border-[#FA7538]/30 hover:bg-[#FA7538] hover:text-white transition"
                >
                  AI & DS Department Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Side: Visual & Accreditation Box */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative h-72 w-full rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100">
                <Image
                  src={COLLEGE_INFO.images.aboutCampus}
                  alt="St. Berchmans Heritage Main Building"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Milestone Box */}
              <div className="bg-[#F7F8F9] p-6 rounded-3xl border border-slate-200 space-y-4">
                <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FA7538]" />
                  Accreditations & Honors
                </h3>

                <div className="space-y-3 text-xs text-[#5C6470]">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">UGC Autonomous Status</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">2014</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">NAAC Re-accreditation</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">Five Star / A+</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">NIRF Ranking MHRD</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">Top 100 Indian</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Govt. of Kerala Award</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">R Shankar Award</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">DST Govt. of India</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold">FIST Supported</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
