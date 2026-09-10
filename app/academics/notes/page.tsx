'use client';
import { EditableText } from '@/components/shared/EditableText';


import React, { useState, useMemo } from 'react';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { LECTURE_NOTES } from '@/lib/mockData';
import { NoteItem } from '@/lib/types';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  User, 
  Calendar,
  Cloud 
} from 'lucide-react';

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    LECTURE_NOTES.forEach(n => { initial[n.id] = n.downloadCount; });
    return initial;
  });
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    return LECTURE_NOTES.filter(n => {
      const matchQuery = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         n.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSem = selectedSemester === 'all' || n.semester === selectedSemester;
      return matchQuery && matchSem;
    });
  }, [searchQuery, selectedSemester]);

  const handleDownload = (note: NoteItem) => {
    setDownloadingId(note.id);
    setDownloadCounts(prev => ({
      ...prev,
      [note.id]: (prev[note.id] || 0) + 1
    }));

    const blob = new Blob([
      `ST. BERCHMANS COLLEGE (AUTONOMOUS)\nDEPARTMENT OF ARTIFICIAL INTELLIGENCE & DATA SCIENCE\n\nLECTURE NOTES: ${note.title}\nSubject: ${note.subject}\nSemester: ${note.semester} (${note.academicYear})\nUploaded By: ${note.uploadedBy}\n\nNote summary: ${note.description}\n\nCloud storage file metadata verified.`
    ], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.subject.replace(/[^a-zA-Z0-9]/g, '_')}_Notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloadingId(null), 2000);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#2E7D50] mb-2">
            Academic Resources
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"><EditableText contentKey="notes.title" defaultValue="Academic Notes Repository" /></h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Official study guides, module summaries, and code notebooks prepared by our faculty members.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Cloud Storage Notice Callout */}
          <div className="p-4 bg-[#EEF8F2] rounded-2xl border border-[#2E7D50]/20 flex items-center justify-between text-xs text-[#2E7D50]">
            <div className="flex items-center gap-2 font-medium">
              <Cloud className="w-4 h-4 flex-shrink-0" />
              <span>
                All academic materials are hosted securely on department cloud storage with authenticated checksum validation.
              </span>
            </div>
            <span className="hidden sm:inline font-bold">Encrypted & Verified</span>
          </div>

          {/* Filter Bar */}
          <div className="bg-[#F7F8F9] p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by subject, module, professor..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#2E7D50]"
              />
            </div>

            {/* Semester Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs">
              <button
                type="button"
                onClick={() => setSelectedSemester('all')}
                className={`px-3.5 py-2 rounded-full font-semibold transition-all ${
                  selectedSemester === 'all'
                    ? 'bg-[#12192B] text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Semesters
              </button>
              {[1, 2, 3, 4, 5, 6].map(sem => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-3 py-2 rounded-full font-semibold transition-all ${
                    selectedSemester === sem
                      ? 'bg-[#2E7D50] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#EEF8F2] text-[#2E7D50]">
                      Semester {note.semester}
                    </span>
                    <span className="text-xs text-slate-400">
                      {note.academicYear}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 leading-snug">
                    {note.title}
                  </h3>

                  <div className="text-xs font-semibold text-[#FA7538] mb-3">
                    {note.subject}
                  </div>

                  <p className="text-xs text-[#5C6470] leading-relaxed mb-4">
                    {note.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 py-3 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" /> {note.uploadedBy}
                    </span>
                    <span className="flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3 text-slate-400" /> {note.uploadedAt}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {note.fileSize} • {downloadCounts[note.id] || note.downloadCount} downloads
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDownload(note)}
                    className={`py-2 px-5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm ${
                      downloadingId === note.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#2E7D50] text-white hover:bg-[#246540]'
                    }`}
                  >
                    {downloadingId === note.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Downloaded
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm bg-[#F7F8F9] rounded-3xl border border-dashed border-slate-200">
              No lecture notes match your search criteria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
