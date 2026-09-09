'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  X, 
  User, 
  BookOpen, 
  FolderGit2, 
  Calendar, 
  Trophy, 
  FileText,
  ArrowRight
} from 'lucide-react';
import { 
  FACULTY_MEMBERS, 
  INITIAL_STUDENTS, 
  INITIAL_PROJECTS, 
  EVENTS, 
  ACHIEVEMENTS, 
  LECTURE_NOTES, 
  SYLLABUS_LIST 
} from '@/lib/mockData';

interface SearchResultItem {
  id: string;
  type: 'student' | 'faculty' | 'project' | 'event' | 'achievement' | 'note' | 'syllabus';
  title: string;
  subtitle: string;
  url: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
  }, [isOpen]);

  const allItems: SearchResultItem[] = useMemo(() => {
    const list: SearchResultItem[] = [];

    FACULTY_MEMBERS.forEach(f => {
      list.push({
        id: f.id,
        type: 'faculty',
        title: f.name,
        subtitle: `${f.designation} • ${f.specialization}`,
        url: '/people/faculty'
      });
    });

    INITIAL_STUDENTS.forEach(s => {
      list.push({
        id: s.id,
        type: 'student',
        title: s.name,
        subtitle: `Roll: ${s.rollNo} • ${s.batch}`,
        url: `/people/students/${s.id}`
      });
    });

    INITIAL_PROJECTS.forEach(p => {
      list.push({
        id: p.id,
        type: 'project',
        title: p.title,
        subtitle: `${p.category} • by ${p.teamMembers.join(', ')}`,
        url: `/projects/${p.id}`
      });
    });

    EVENTS.forEach(e => {
      list.push({
        id: e.id,
        type: 'event',
        title: e.title,
        subtitle: `${e.date} • ${e.venue}`,
        url: '/events'
      });
    });

    ACHIEVEMENTS.forEach(a => {
      list.push({
        id: a.id,
        type: 'achievement',
        title: a.title,
        subtitle: `${a.category} • ${a.date}`,
        url: '/achievements'
      });
    });

    LECTURE_NOTES.forEach(n => {
      list.push({
        id: n.id,
        type: 'note',
        title: n.title,
        subtitle: `${n.subject} • Semester ${n.semester}`,
        url: '/academics/notes'
      });
    });

    SYLLABUS_LIST.forEach(s => {
      list.push({
        id: s.id,
        type: 'syllabus',
        title: s.title,
        subtitle: `${s.programme} • ${s.academicYear}`,
        url: '/academics/syllabus'
      });
    });

    return list;
  }, []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allItems.filter(item => {
      const matchQuery = item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
      const matchType = filterType === 'all' || item.type === filterType;
      return matchQuery && matchType;
    });
  }, [allItems, query, filterType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search students, faculty, syllabus, notes, projects, events..."
            className="w-full text-base sm:text-lg outline-none text-[#1A1A1A] placeholder-slate-400"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'student', label: 'Students' },
            { id: 'faculty', label: 'Faculty' },
            { id: 'project', label: 'Projects' },
            { id: 'note', label: 'Notes' },
            { id: 'syllabus', label: 'Syllabus' },
            { id: 'event', label: 'Events' },
            { id: 'achievement', label: 'Achievements' },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                filterType === f.id
                  ? 'bg-[#12192B] text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 flex-1 divide-y divide-slate-100">
          {query.trim().length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Type to search across St. Berchmans AI & DS department database...
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No matches found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredResults.map(item => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.url}
                onClick={onClose}
                className="py-3 px-3 flex items-center justify-between hover:bg-[#F7F8F9] rounded-xl transition group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mt-0.5 group-hover:bg-[#FA7538]/10 group-hover:text-[#FA7538] transition-colors">
                    {item.type === 'faculty' && <User className="w-4 h-4" />}
                    {item.type === 'student' && <User className="w-4 h-4" />}
                    {item.type === 'project' && <FolderGit2 className="w-4 h-4" />}
                    {item.type === 'note' && <FileText className="w-4 h-4" />}
                    {item.type === 'syllabus' && <BookOpen className="w-4 h-4" />}
                    {item.type === 'event' && <Calendar className="w-4 h-4" />}
                    {item.type === 'achievement' && <Trophy className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#FA7538] transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {item.type}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#FA7538] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
          Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-slate-600">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
};
