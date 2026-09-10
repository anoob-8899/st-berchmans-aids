'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { COLLEGE_INFO } from '@/lib/mockData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  Award 
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#12192B] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full bg-white p-1 overflow-hidden flex-shrink-0">
                <Image
                  src="/images/sb college logo.jpg"
                  alt="St. Berchmans Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">
                  St. Berchmans College
                </h3>
                <p className="text-xs uppercase tracking-wider text-[#FA7538] font-semibold">
                  Department of AI & Data Science
                </p>
                <p className="text-xs text-slate-400">Autonomous • Changanassery, Kerala</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Moulding ethical tech innovators and skilled data scientists equipped with industry-aligned rigor, autonomous flexibility, and holistic human excellence.
            </p>

            <div className="pt-2">
              <div className="inline-block bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  Patron Saint Motto
                </div>
                <div className="text-sm font-semibold text-emerald-400 italic">
                  &ldquo;Maximi facere minima&rdquo;
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Do the most with the least • St. John Berchmans
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Academics
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/academics/programs" className="hover:text-[#FA7538] transition-colors">
                  B.Sc. AI & Data Science
                </Link>
              </li>
              <li>
                <Link href="/academics/programs" className="hover:text-[#FA7538] transition-colors">
                  M.Sc Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link href="/academics/syllabus" className="hover:text-[#FA7538] transition-colors">
                  Course Syllabus (2024-28)
                </Link>
              </li>
              <li>
                <Link href="/academics/notes" className="hover:text-[#FA7538] transition-colors">
                  Notes
                </Link>
              </li>
              <li>
                <Link href="/academics/downloads" className="hover:text-[#FA7538] transition-colors">
                  Academic Downloads & Forms
                </Link>
              </li>
              <li>
                <Link href="/about/skill-hub" className="hover:text-[#FA7538] transition-colors">
                  SB Skill Hub
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Campus Life
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                {/* Camera icon removed (Requirement 3) */}
                <Link href="/gallery" className="text-[#FA7538] font-medium hover:underline">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-[#FA7538] transition-colors">
                  Tech Team & Hackathons
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-[#FA7538] transition-colors">
                  Media Wing & Podcasts
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-[#FA7538] transition-colors">
                  NSS & Community Camps
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-[#FA7538] transition-colors">
                  NCC Army & Naval Wings
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#FA7538] transition-colors">
                  Student Research Projects
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-[#FA7538] transition-colors">
                  Hall of Achievements
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Contact & Office
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FA7538] flex-shrink-0 mt-0.5" />
                <span>Department of AI & DS, St. Berchmans College, Changanassery, Kerala - 686101</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+91 481 2420025</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>aids@sbcollege.ac.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <a
                  href="https://sbcollege.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white flex items-center gap-1"
                >
                  sbcollege.ac.in <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              UGC Autonomous College (2014)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Award className="w-4 h-4 text-amber-400" />
              NAAC Five Star (1999) & A+ (2006)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Award className="w-4 h-4 text-blue-400" />
              NIRF Top 100 Indian Colleges
            </span>
            <span>•</span>
            <span className="text-slate-300">
              DST-FIST Supported
            </span>
          </div>
          <div className="text-slate-400">
            Founded 1922 by Ven. Mar Thomas Kurialacherry
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} Department of Artificial Intelligence & Data Science, St. Berchmans College. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/about/department" className="hover:text-slate-300">Privacy Policy</Link>
            <span>•</span>
            <Link href="/portal" className="hover:text-slate-300">Administrator Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
