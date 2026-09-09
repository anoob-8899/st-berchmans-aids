'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { RatingStars } from '@/components/shared/RatingStars';
import { EditableText } from '@/components/shared/EditableText';
import { 
  COLLEGE_INFO, 
  ANNOUNCEMENTS, 
  INITIAL_PROJECTS, 
  EVENTS, 
  ACHIEVEMENTS, 
  FACULTY_MEMBERS, 
  WINGS_INFO 
} from '@/lib/mockData';
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  FileText, 
  FolderGit2, 
  Calendar, 
  CheckCircle2, 
  Award, 
  Cpu, 
  Database, 
  Layers, 
  ExternalLink,
  Code2,
  Video,
  HeartHandshake,
  Shield,
  Trophy,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#12192B] text-white min-h-[540px] sm:min-h-[600px] flex items-center overflow-hidden">
        {/* Campus Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={COLLEGE_INFO.images.hero}
            alt="St. Berchmans College Heritage Campus"
            fill
            className="object-cover object-center opacity-25 scale-105 transition-transform duration-1000 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#12192B] via-[#12192B]/90 to-[#12192B]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12192B] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Main Headline (Admin in-place editable) */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                <EditableText
                  contentKey="home.hero.title"
                  defaultValue={t('hero.title')}
                  as="span"
                  multiline
                />
              </h1>

              {/* Subtitle (Admin in-place editable) */}
              <div className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
                <EditableText
                  contentKey="home.hero.subtitle"
                  defaultValue={t('hero.subtitle')}
                  as="p"
                  multiline
                />
              </div>

              {/* Dual CTA Buttons - Explore Department with ONLY orange border (Requirement 7) */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Link
                  href="/about/department"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider bg-transparent text-white border-2 border-[#FA7538] hover:bg-[#FA7538] hover:text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  {t('hero.cta.explore')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <Link
                  href="/portal"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider bg-transparent text-white border-2 border-slate-400 hover:border-white hover:bg-white/10 transition-all"
                >
                  Login
                </Link>
              </div>
            </div>

            {/* Right Column: Beautifully Aligned & Framed Architectural Watermark Showcase (Requirement 5) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative pt-6 lg:pt-0">
              {/* Subtle ambient light aura */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#FA7538]/25 via-emerald-500/15 to-blue-500/20 blur-3xl opacity-60 pointer-events-none" />
              
              {/* Concentric Glassmorphism Framed Medallion */}
              <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] rounded-full p-3 border-2 border-white/20 bg-[#1A243B]/40 backdrop-blur-md shadow-2xl transition-all duration-500 hover:scale-[1.02] group">
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/25 shadow-inner">
                  <Image
                    src="/images/sb college centre full.jpg"
                    alt="St. Berchmans Heritage Central Tower"
                    fill
                    className="object-cover object-center filter contrast-115 group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LIVE ANNOUNCEMENTS TICKER */}
      <section className="bg-white py-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-[#F7F8F9] rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="px-3 py-1 bg-[#FA7538] text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                Notice
              </span>
              <span className="font-bold text-sm text-[#1A1A1A]">
                {t('home.announcements')}:
              </span>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-1">
                {ANNOUNCEMENTS.map(ann => (
                  <Link
                    key={ann.id}
                    href={ann.link || '/academics/downloads'}
                    className="flex-shrink-0 text-sm font-medium text-slate-700 hover:text-[#FA7538] flex items-center gap-2 group transition-colors"
                  >
                    <span className="text-xs text-slate-400 font-normal">[{ann.date}]</span>
                    <span>{language === 'ml' && ann.titleMl ? ann.titleMl : ann.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FA7538] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/academics/downloads"
              className="text-xs font-bold text-[#FA7538] hover:underline flex items-center gap-1 flex-shrink-0"
            >
              {t('btn.viewAll')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. QUICK ACADEMIC ACCESS */}
      <section className="bg-[#F7F8F9] py-16 sm:py-20 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Direct Resources"
            title="Fast-Track Academic Resources"
            subtitle="Access autonomous curriculum syllabi, verified lecture guides, and student research repositories with a single click."
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/academics/syllabus"
              className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] text-[#FA7538] flex items-center justify-center mb-5 group-hover:bg-[#FA7538] group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#FA7538] transition-colors">
                Autonomous Syllabus
              </h3>
              <p className="text-xs text-[#5C6470] leading-relaxed mb-4">
                Regulations 2024-2028 with semester credit splits, elective choices, and lab guidelines.
              </p>
              <span className="inline-flex items-center text-xs font-bold text-[#FA7538]">
                Explore Syllabus <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </Link>

            <Link
              href="/academics/notes"
              className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EEF8F2] text-[#2E7D50] flex items-center justify-center mb-5 group-hover:bg-[#2E7D50] group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#2E7D50] transition-colors">
                Notes
              </h3>
              <p className="text-xs text-[#5C6470] leading-relaxed mb-4">
                Semester-wise PDF notes and code notebooks uploaded directly by professors.
              </p>
              <span className="inline-flex items-center text-xs font-bold text-[#2E7D50]">
                Download Notes <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </Link>

            <Link
              href="/projects"
              className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#12192B] flex items-center justify-center mb-5 group-hover:bg-[#12192B] group-hover:text-white transition-colors">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#FA7538] transition-colors">
                Student Projects
              </h3>
              <p className="text-xs text-[#5C6470] leading-relaxed mb-4">
                Showcasing upcoming & completed AI innovations with star ratings and feedback.
              </p>
              <span className="inline-flex items-center text-xs font-bold text-[#12192B]">
                View Projects <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </Link>

            <Link
              href="/about/skill-hub"
              className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-amber-600 transition-colors">
                SB Skill Hub (26)
              </h3>
              <p className="text-xs text-[#5C6470] leading-relaxed mb-4">
                Industry certifications with EY, ICTAK, ASAP Kerala, and CDIT after class hours.
              </p>
              <span className="inline-flex items-center text-xs font-bold text-amber-600">
                Explore Courses <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. DEPARTMENT PILLARS & STATS */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeading
                eyebrow="Department Overview"
                title="Pioneering AI Research & Practical Data Science"
                subtitle="Instituted under the autonomous framework of St. Berchmans College, our department merges rigorous mathematical foundations with modern GPU-accelerated computing to prepare graduates for high-impact careers."
              />

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2E7D50] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1A1A]">Autonomous Curriculum Agility</h4>
                    <p className="text-xs text-[#5C6470] leading-relaxed">
                      Syllabus updated annually with industry advisory panels from Google DeepMind, EY, and IIT Madras.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2E7D50] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1A1A]">High-Performance AI Infrastructure</h4>
                    <p className="text-xs text-[#5C6470] leading-relaxed">
                      Equipped with dedicated NVIDIA RTX GPUs, Jetson edge devices, and cloud computing credits for LLM training.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2E7D50] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1A1A]">Holistic Co-Curricular Wings</h4>
                    <p className="text-xs text-[#5C6470] leading-relaxed">
                      Students thrive across Tech Team, Media Wing, NSS social outreach, NCC defence training, and competitive athletics.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  href="/about/department"
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#12192B] text-white hover:bg-[#1C2640] transition"
                >
                  Read Full Department Profile
                </Link>
                <Link
                  href="/about/patron-saint"
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  Patron Saint Biography
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative h-[380px] sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src={COLLEGE_INFO.images.aboutCampus}
                  alt="St. Berchmans College Archdiocesan Campus"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12192B]/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wider font-bold text-[#FA7538]">
                        Historical Legacy
                      </div>
                      <div className="text-sm font-bold text-[#1A1A1A]">
                        Founded 1922 by Ven. Mar Thomas Kurialacherry
                      </div>
                    </div>
                    <Link
                      href="/about/college-profile"
                      className="p-2 rounded-full bg-[#12192B] text-white hover:bg-[#FA7538] transition-colors"
                      title="Learn more"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-4 sm:-right-6 bg-[#FA7538] text-white p-4 rounded-2xl shadow-xl hidden sm:block">
                <div className="text-2xl font-black">100+</div>
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-90">
                  Years of Excellence
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FULL-BLEED DARK SECTION: STUDENT INNOVATIONS & PROJECTS */}
      <section className="bg-[#12192B] text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <SectionHeading
              eyebrow="Student Showcase"
              title="Featured AI & Data Science Projects"
              subtitle="From Malayalam dialect speech-to-text to autonomous campus rovers, explore innovations engineered by our student developers."
              dark
            />
            <div className="flex items-center gap-3">
              <Link
                href="/projects"
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] transition shadow-md whitespace-nowrap"
              >
                View All Projects
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {INITIAL_PROJECTS.slice(0, 2).map(project => (
              <div
                key={project.id}
                className="bg-[#1A243B] rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col group hover:border-[#FA7538]/50 transition-all"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A243B] via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FA7538] text-white shadow">
                      {project.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow">
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-[#FA7538] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.techStack.map(tech => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RatingStars rating={project.rating} totalCount={project.ratingCount} size="sm" />
                    </div>

                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#FA7538] hover:text-white transition-colors"
                    >
                      Inspect & Rate <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CO-CURRICULAR WINGS */}
      <section className="bg-[#F7F8F9] py-16 sm:py-24 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Co-Curricular Wings"
            title="A Truly Connected Campus Ecosystem"
            subtitle="Student profiles dynamically power our department wings. Whether coding for the Tech Team or serving through NSS, activities celebrate student leadership."
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WINGS_INFO.map(wing => (
              <div
                key={wing.id}
                className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] text-[#FA7538] flex items-center justify-center">
                      {wing.id === 'tech_team' && <Code2 className="w-6 h-6" />}
                      {wing.id === 'media_team' && <Video className="w-6 h-6" />}
                      {wing.id === 'nss' && <HeartHandshake className="w-6 h-6" />}
                      {wing.id === 'ncc' && <Shield className="w-6 h-6" />}
                      {wing.id === 'sports' && <Trophy className="w-6 h-6" />}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      Active Wing
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">
                    {wing.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#FA7538] mb-3">
                    {wing.tagline}
                  </div>
                  <p className="text-xs text-[#5C6470] leading-relaxed mb-6">
                    {wing.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/activities#${wing.id}`}
                    className="text-xs font-bold text-[#12192B] hover:text-[#FA7538] flex items-center gap-1 transition-colors"
                  >
                    View Members <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. UPCOMING EVENTS & ACHIEVEMENTS */}
      <section className="bg-white py-16 sm:py-24 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Events */}
            <div className="lg:col-span-6 space-y-6">
              <SectionHeading
                eyebrow="Department Calendar"
                title="Upcoming Events & Workshops"
                subtitle="Participate in hands-on workshops, conferences, and technical hackathons."
              />

              <div className="space-y-4">
                {EVENTS.slice(0, 2).map(evt => (
                  <div
                    key={evt.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-[#F7F8F9] hover:bg-white hover:border-[#FA7538]/40 hover:shadow-md transition-all flex flex-col sm:flex-row items-start gap-4"
                  >
                    <div className="p-3 rounded-2xl bg-[#FA7538] text-white text-center flex-shrink-0 w-20">
                      <Calendar className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs font-bold uppercase tracking-wider">
                        {evt.date.split(',')[0]}
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 mb-2 inline-block">
                        {evt.status}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-[#1A1A1A] mb-1">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-[#5C6470] mb-3 line-clamp-2">
                        {evt.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>📍 {evt.venue}</span>
                        {evt.registrationUrl && (
                          <Link
                            href="/events"
                            className="font-bold text-[#FA7538] hover:underline"
                          >
                            Register →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/events"
                className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#12192B] hover:text-[#FA7538] transition-colors"
              >
                Explore Complete Events Calendar <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Achievements */}
            <div className="lg:col-span-6 space-y-6">
              <SectionHeading
                eyebrow="Hall of Fame"
                title="Student & Faculty Achievements"
                subtitle="Celebrating national awards, hackathon victories, and academic publications."
              />

              <div className="space-y-4">
                {ACHIEVEMENTS.slice(0, 2).map(ach => (
                  <div
                    key={ach.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-[#F7F8F9] hover:bg-white hover:border-[#2E7D50]/40 hover:shadow-md transition-all flex flex-col sm:flex-row items-start gap-4"
                  >
                    <div className="relative w-full sm:w-28 h-24 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                      <Image
                        src={ach.image}
                        alt={ach.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 mb-2 inline-block">
                        {ach.category}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-[#1A1A1A] mb-1">
                        {ach.title}
                      </h4>
                      <p className="text-xs text-[#5C6470] mb-2 line-clamp-2">
                        {ach.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-slate-400 font-medium">Honorees:</span>
                        {ach.studentNames.map(name => (
                          <span
                            key={name}
                            className="inline-flex items-center text-xs font-semibold text-[#2E7D50] bg-[#EEF8F2] px-2 py-0.5 rounded-full hover:underline cursor-pointer"
                          >
                            @{name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/achievements"
                className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#12192B] hover:text-[#2E7D50] transition-colors"
              >
                View Full Hall of Achievements <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FACULTY SPOTLIGHT */}
      <section className="bg-[#F7F8F9] py-16 sm:py-24 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Academic Leadership"
            title="Distinguished Faculty Mentors"
            subtitle="Led by doctoral researchers from premier institutes committed to guiding undergraduate and postgraduate students."
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACULTY_MEMBERS.map(fac => (
              <div
                key={fac.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={fac.photo}
                    alt={fac.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="text-sm font-bold leading-tight">{fac.name}</div>
                    <div className="text-[11px] text-slate-200 leading-tight">{fac.designation}</div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="text-xs text-[#5C6470]">
                    <span className="font-semibold text-slate-700">Specialization:</span> {fac.specialization}
                  </div>

                  <div className="text-xs text-[#5C6470]">
                    <span className="font-semibold text-slate-700">Experience:</span> {fac.experience}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href="/people/faculty"
                      className="text-xs font-bold text-[#FA7538] hover:underline"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SB SKILL HUB BANNER SECTION */}
      <section className="bg-[#12192B] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-slate-900 to-[#1A243B] p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-block">
                Industry Certification Partnership
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t('home.skillHubTitle')}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t('home.skillHubSubtitle')}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["EY", "ICTAK", "ASAP Kerala", "CDIT", "Burlington English", "BEDA"].map(p => (
                  <span
                    key={p}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700"
                  >
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link
                href="/about/skill-hub"
                className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                View 26 Skill Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
