'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { useAdminEdit } from '@/lib/AdminEditContext';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  User,
  LogOut, 
  Sparkles, 
  Edit3
} from 'lucide-react';
import { GlobalSearchModal } from '@/components/search/GlobalSearchModal';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isAdminLoggedIn, isAdminMode, toggleAdminMode, setIsAdminLoggedIn } = useAdminEdit();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('sb_current_role') || localStorage.getItem('sb_user_role');
      setCurrentUserRole(role);
    }
  }, [isAdminLoggedIn, pathname]);

  const isLoggedIn = isAdminLoggedIn || !!currentUserRole;

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sb_current_role');
      localStorage.removeItem('sb_user_role');
      localStorage.removeItem('sb_current_user');
      localStorage.removeItem('sb_current_username');
      localStorage.removeItem('sb_admin_mode');
    }
    setCurrentUserRole(null);
    closeMenus();
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-[#12192B] text-slate-300 text-xs py-1.5 px-3 sm:px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {t('badge.autonomous')}
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              {t('badge.accreditation')}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Limit Admin Edit Toggle: ONLY visible when logged in as Admin (Requirement 1) */}
            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={toggleAdminMode}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition ${
                  isAdminMode 
                    ? 'bg-[#FA7538] text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
                title="Toggle In-Place Page Editing"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isAdminMode ? 'Admin Edit: ON' : 'Admin Edit'}</span>
              </button>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800/80 rounded-full p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-full transition-all ${
                  language === 'en'
                    ? 'bg-[#FA7538] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ml')}
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-full transition-all ${
                  language === 'ml'
                    ? 'bg-[#FA7538] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                മലയാളം
              </button>
            </div>

            {/* Login / Dashboard / Logout Link */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href={isAdminLoggedIn || currentUserRole === 'admin' ? "/portal/admin" : currentUserRole === 'faculty' ? "/portal/faculty" : "/portal/student"}
                  className="flex items-center gap-1 text-[#FA7538] hover:underline font-semibold text-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="capitalize">{isAdminLoggedIn ? 'Admin Console' : (currentUserRole || 'Dashboard')}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-white text-[10px] uppercase font-bold"
                  title="Logout"
                >
                  (Exit)
                </button>
              </div>
            ) : (
              <Link
                href="/portal"
                className="flex items-center gap-1 text-slate-200 hover:text-[#FA7538] transition font-medium"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2'
            : 'bg-white shadow-sm py-2.5'
        }`}
      >
        {/* Halved horizontal space on both sides (Requirement 5) */}
        <div className="max-w-7xl mx-auto px-2 sm:px-3 flex items-center justify-between">
          
          {/* Logo only - enlarged and crisp (Requirement 3) */}
          <Link href="/" className="flex items-center group px-1" onClick={closeMenus}>
            <div className="relative h-13 sm:h-14 md:h-16 w-60 sm:w-72 md:w-84 flex-shrink-0">
              <Image
                src="/images/college icon.png"
                alt="St Berchmans College Autonomous"
                fill
                className="object-contain object-left group-hover:scale-101 transition-transform duration-200"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-2.5 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                pathname === '/'
                  ? 'text-[#FA7538] bg-[#FFF5F0]'
                  : 'text-[#1A1A1A] hover:text-[#FA7538] hover:bg-slate-50'
              }`}
            >
              {t('nav.home')}
            </Link>

            {/* About Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className={`px-2.5 py-1.5 text-sm font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                  pathname.startsWith('/about')
                    ? 'text-[#FA7538] bg-[#FFF5F0]'
                    : 'text-[#1A1A1A] hover:text-[#FA7538] hover:bg-slate-50'
                }`}
              >
                <span>{t('nav.about')}</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 top-full pt-1.5 w-64 hidden group-hover:block transition-all z-50">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2">
                  <Link
                    href="/about/college-profile"
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-[#F7F8F9] hover:text-[#FA7538] rounded-xl"
                  >
                    <div className="font-medium">{t('nav.collegeProfile')}</div>
                    <div className="text-xs text-slate-400">Heritage, UGC & NIRF history</div>
                  </Link>
                  <Link
                    href="/about/department"
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-[#F7F8F9] hover:text-[#FA7538] rounded-xl"
                  >
                    <div className="font-medium">{t('nav.department')}</div>
                    <div className="text-xs text-slate-400">Vision, labs & leadership</div>
                  </Link>
                  <Link
                    href="/about/patron-saint"
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-[#F7F8F9] hover:text-[#FA7538] rounded-xl"
                  >
                    <div className="font-medium">{t('nav.patronSaint')}</div>
                    <div className="text-xs text-slate-400">St. John Berchmans & motto</div>
                  </Link>
                  <Link
                    href="/about/mission-vision"
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-[#F7F8F9] hover:text-[#FA7538] rounded-xl"
                  >
                    <div className="font-medium">{t('nav.missionVision')}</div>
                    <div className="text-xs text-slate-400">Charter, vision & values</div>
                  </Link>
                  <Link
                    href="/about/skill-hub"
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-[#F7F8F9] hover:text-[#FA7538] rounded-xl"
                  >
                    <div className="font-medium">{t('nav.skillHub')}</div>
                    <div className="text-xs text-slate-400">Industry certification courses</div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Academics Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className={`px-2.5 py-1.5 text-sm font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                  pathname.startsWith('/academics')
                    ? 'text-[#FA7538] bg-[#FFF5F0]'
                    : 'text-[#1A1A1A] hover:text-[#FA7538] hover:bg-slate-50'
                }`}
              >
                <span>{t('nav.academics')}</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 top-full pt-1.5 w-60 hidden group-hover:block transition-all z-50">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2">
                  <Link
                    href="/academics/programs"
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-[#F7F8F9] hover:text-[#FA7538] rounded-xl"
                  >
                    <div className="font-medium">{t('nav.programs')}</div>
                    <div className="text-xs text-slate-400">B.Sc. & M.Sc AI & DS</div>
                  </Link>
                  <Link
                    href="/academics/syllabus"
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-[#F7F8F9] hover:text-[#FA7538] rounded-xl"
                  >
                    <div className="font-medium">{t('nav.syllabus')}</div>
                    <div className="text-xs text-slate-400">Curriculum & regulations</div>
                  </Link>
                  <Link
                    href="/academics/notes"
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-[#F7F8F9] hover:text-[#FA7538] rounded-xl"
                  >
                    <div className="font-medium">{t('nav.notes')}</div>
                    <div className="text-xs text-slate-400">Semester notes & study guides</div>
                  </Link>
                  <Link
                    href="/academics/downloads"
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-[#F7F8F9] hover:text-[#FA7538] rounded-xl"
                  >
                    <div className="font-medium">{t('nav.downloads')}</div>
                    <div className="text-xs text-slate-400">Timetables, forms & notices</div>
                  </Link>
                </div>
              </div>
            </div>

            {/* People */}
            <div className="relative group">
              <button
                type="button"
                className={`px-2.5 py-1.5 text-sm font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                  pathname.startsWith('/people')
                    ? 'text-[#FA7538] bg-[#FFF5F0]'
                    : 'text-[#1A1A1A] hover:text-[#FA7538] hover:bg-slate-50'
                }`}
              >
                <span>{t('nav.people')}</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 top-full pt-1.5 w-48 hidden group-hover:block transition-all z-50">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2">
                  <Link
                    href="/people/faculty"
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-[#F7F8F9] hover:text-[#FA7538] rounded-xl"
                  >
                    {t('nav.faculty')}
                  </Link>
                  <Link
                    href="/people/students"
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-[#F7F8F9] hover:text-[#FA7538] rounded-xl"
                  >
                    {t('nav.students')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Activities */}
            <Link
              href="/activities"
              className={`px-2.5 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                pathname === '/activities'
                  ? 'text-[#FA7538] bg-[#FFF5F0]'
                  : 'text-[#1A1A1A] hover:text-[#FA7538] hover:bg-slate-50'
              }`}
            >
              {t('nav.activities')}
            </Link>

            {/* Projects */}
            <Link
              href="/projects"
              className={`px-2.5 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                pathname.startsWith('/projects')
                  ? 'text-[#FA7538] bg-[#FFF5F0]'
                  : 'text-[#1A1A1A] hover:text-[#FA7538] hover:bg-slate-50'
              }`}
            >
              {t('nav.projects')}
            </Link>

            {/* Events */}
            <Link
              href="/events"
              className={`px-2.5 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                pathname === '/events'
                  ? 'text-[#FA7538] bg-[#FFF5F0]'
                  : 'text-[#1A1A1A] hover:text-[#FA7538] hover:bg-slate-50'
              }`}
            >
              {t('nav.events')}
            </Link>

            {/* Achievements */}
            <Link
              href="/achievements"
              className={`px-2.5 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                pathname === '/achievements'
                  ? 'text-[#FA7538] bg-[#FFF5F0]'
                  : 'text-[#1A1A1A] hover:text-[#FA7538] hover:bg-slate-50'
              }`}
            >
              {t('nav.achievements')}
            </Link>

            {/* Gallery (Camera icon removed as requested in Requirement 3) */}
            <Link
              href="/gallery"
              className={`px-2.5 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                pathname === '/gallery'
                  ? 'text-[#FA7538] bg-[#FFF5F0]'
                  : 'text-[#1A1A1A] hover:text-[#FA7538] hover:bg-slate-50'
              }`}
            >
              Gallery
            </Link>
          </nav>

          {/* Right Action Icons: Search + Login CTA */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors border border-slate-200 cursor-pointer"
              title="Search (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded font-mono text-slate-500">
                ⌘K
              </kbd>
            </button>

            {isLoggedIn ? (
              <Link
                href={isAdminLoggedIn || currentUserRole === 'admin' ? "/portal/admin" : currentUserRole === 'faculty' ? "/portal/faculty" : "/portal/student"}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-[#12192B] text-white hover:bg-[#FA7538] shadow-sm transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/portal"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-[#FA7538] text-white hover:bg-[#E86326] shadow-sm hover:shadow transition-all"
              >
                Login
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col space-y-2 pt-2">
              <Link
                href="/"
                onClick={closeMenus}
                className="px-3 py-2 font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                {t('nav.home')}
              </Link>
              
              <div className="border-t border-slate-100 pt-2 font-semibold text-xs text-slate-400 uppercase tracking-wider px-3">
                {t('nav.about')}
              </div>
              <Link
                href="/about/college-profile"
                onClick={closeMenus}
                className="pl-6 pr-3 py-1.5 text-sm text-slate-600 hover:text-[#FA7538]"
              >
                {t('nav.collegeProfile')}
              </Link>
              <Link
                href="/about/department"
                onClick={closeMenus}
                className="pl-6 pr-3 py-1.5 text-sm text-slate-600 hover:text-[#FA7538]"
              >
                {t('nav.department')}
              </Link>
              <Link
                href="/about/patron-saint"
                onClick={closeMenus}
                className="pl-6 pr-3 py-1.5 text-sm text-slate-600 hover:text-[#FA7538]"
              >
                {t('nav.patronSaint')}
              </Link>
              <Link
                href="/about/mission-vision"
                onClick={closeMenus}
                className="pl-6 pr-3 py-1.5 text-sm text-slate-600 hover:text-[#FA7538]"
              >
                {t('nav.missionVision')}
              </Link>
              <Link
                href="/about/skill-hub"
                onClick={closeMenus}
                className="pl-6 pr-3 py-1.5 text-sm text-slate-600 hover:text-[#FA7538]"
              >
                {t('nav.skillHub')}
              </Link>

              <div className="border-t border-slate-100 pt-2 font-semibold text-xs text-slate-400 uppercase tracking-wider px-3">
                {t('nav.academics')}
              </div>
              <Link
                href="/academics/programs"
                onClick={closeMenus}
                className="pl-6 pr-3 py-1.5 text-sm text-slate-600 hover:text-[#FA7538]"
              >
                {t('nav.programs')}
              </Link>
              <Link
                href="/academics/syllabus"
                onClick={closeMenus}
                className="pl-6 pr-3 py-1.5 text-sm text-slate-600 hover:text-[#FA7538]"
              >
                {t('nav.syllabus')}
              </Link>
              <Link
                href="/academics/notes"
                onClick={closeMenus}
                className="pl-6 pr-3 py-1.5 text-sm text-slate-600 hover:text-[#FA7538]"
              >
                {t('nav.notes')}
              </Link>
              <Link
                href="/academics/downloads"
                onClick={closeMenus}
                className="pl-6 pr-3 py-1.5 text-sm text-slate-600 hover:text-[#FA7538]"
              >
                {t('nav.downloads')}
              </Link>

              <div className="border-t border-slate-100 pt-2 font-semibold text-xs text-slate-400 uppercase tracking-wider px-3">
                Community & Life
              </div>
              <Link
                href="/people/faculty"
                onClick={closeMenus}
                className="pl-6 pr-3 py-1.5 text-sm text-slate-600 hover:text-[#FA7538]"
              >
                {t('nav.faculty')}
              </Link>
              <Link
                href="/people/students"
                onClick={closeMenus}
                className="pl-6 pr-3 py-1.5 text-sm text-slate-600 hover:text-[#FA7538]"
              >
                {t('nav.students')}
              </Link>
              <Link
                href="/activities"
                onClick={closeMenus}
                className="px-3 py-2 font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                {t('nav.activities')}
              </Link>
              <Link
                href="/projects"
                onClick={closeMenus}
                className="px-3 py-2 font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                {t('nav.projects')}
              </Link>
              <Link
                href="/events"
                onClick={closeMenus}
                className="px-3 py-2 font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                {t('nav.events')}
              </Link>
              <Link
                href="/achievements"
                onClick={closeMenus}
                className="px-3 py-2 font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                {t('nav.achievements')}
              </Link>
              <Link
                href="/gallery"
                onClick={closeMenus}
                className="px-3 py-2 font-medium text-slate-800 hover:bg-slate-50 rounded-lg text-[#FA7538]"
              >
                Gallery
              </Link>

              <div className="pt-3 flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <Link
                      href={isAdminLoggedIn || currentUserRole === 'admin' ? "/portal/admin" : currentUserRole === 'faculty' ? "/portal/faculty" : "/portal/student"}
                      onClick={closeMenus}
                      className="w-full flex items-center justify-center py-2.5 px-4 rounded-full bg-[#12192B] text-white font-bold uppercase tracking-wider text-xs"
                    >
                      My Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center py-2.5 px-4 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold uppercase tracking-wider text-xs"
                    >
                      Logout / Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/portal"
                    onClick={closeMenus}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-full bg-[#FA7538] text-white font-bold uppercase tracking-wider text-xs"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal Component */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
};
