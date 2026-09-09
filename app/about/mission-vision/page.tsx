'use client';

import React from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { EditableText } from '@/components/shared/EditableText';
import { Target, Compass, CheckCircle2, Shield, Heart, Award, ArrowRight } from 'lucide-react';

export default function MissionVisionPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
            Institutional Purpose & Charter
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            <EditableText 
              contentKey="mission.title" 
              defaultValue="Mission & Vision" 
            />
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            <EditableText 
              contentKey="mission.subtitle" 
              defaultValue="Guiding principles for academic excellence, ethical technology development, and transformative human formation." 
              multiline
            />
          </p>
        </div>
      </section>

      {/* Main Content (Image Removed as requested in Requirement 6) */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          
          {/* Vision & Mission Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#12192B] text-white space-y-5 shadow-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#FA7538] text-white flex items-center justify-center mb-6 shadow-md">
                  <Compass className="w-7 h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Vision</h2>
                <div className="text-base text-slate-300 leading-relaxed space-y-3">
                  <EditableText
                    contentKey="vision.text"
                    defaultValue="To be a premier center of intellectual illumination and technological transformation, moulding young men and women of unimpeachable character, creative technical vision, and dedication to God and humanity."
                    as="p"
                    multiline
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 italic">
                St. Berchmans College (Autonomous) • Changanassery
              </div>
            </div>

            {/* Mission Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#F7F8F9] border border-slate-200 space-y-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#2E7D50] text-white flex items-center justify-center mb-6 shadow-md">
                  <Target className="w-7 h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4">Our Mission</h2>
                <div className="space-y-3 text-sm text-[#5C6470] leading-relaxed">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2E7D50] flex-shrink-0 mt-0.5" />
                    <EditableText
                      contentKey="mission.item1"
                      defaultValue="Deliver rigorous, autonomous curriculum grounded in mathematical clarity and cutting-edge AI applications."
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2E7D50] flex-shrink-0 mt-0.5" />
                    <EditableText
                      contentKey="mission.item2"
                      defaultValue="Foster interdisciplinary research addressing regional agrarian, clinical, and environmental sustainability challenges."
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2E7D50] flex-shrink-0 mt-0.5" />
                    <EditableText
                      contentKey="mission.item3"
                      defaultValue="Instill ethical leadership and the motto 'Maximi facere minima' into every student engineer and scholar."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
                Archdiocese of Changanacherry • Est. 1922
              </div>
            </div>
          </div>

          {/* Core Institutional Values */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#1A1A1A] text-center">
              Core Values of the Department
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-[#FFF5F0] border border-[#FA7538]/20 text-center space-y-2">
                <div className="text-base font-bold text-[#12192B]">Maximi Facere Minima</div>
                <p className="text-xs text-[#5C6470] leading-relaxed">
                  Perfection in ordinary duties. We believe that mastery in machine learning stems from meticulous attention to data purity and code rigor.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#EEF8F2] border border-[#2E7D50]/20 text-center space-y-2">
                <div className="text-base font-bold text-[#12192B]">Ethical AI & Social Good</div>
                <p className="text-xs text-[#5C6470] leading-relaxed">
                  Technological innovations must uplift society, protect human dignity, and assist local agrarian and public health communities.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 text-center space-y-2">
                <div className="text-base font-bold text-[#12192B]">Academic Integrity</div>
                <p className="text-xs text-[#5C6470] leading-relaxed">
                  Uncompromising scientific honesty, collaborative open-source values, and relentless pursuit of research excellence.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center pt-4">
            <Link
              href="/about/department"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#12192B] text-white hover:bg-[#FA7538] transition shadow-md"
            >
              Learn More About Our Department <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
