'use client';
import { EditableText } from '@/components/shared/EditableText';


import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { SYLLABUS_LIST } from '@/lib/mockData';
import { 
  BookOpen, 
  Download, 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  CheckCircle2 
} from 'lucide-react';

export default function SyllabusPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState('all');
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const filteredSyllabus = useMemo(() => {
    return SYLLABUS_LIST.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.academicYear.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProgramme = selectedProgramme === 'all' || item.programme === selectedProgramme;
      return matchesSearch && matchesProgramme;
    });
  }, [searchQuery, selectedProgramme]);

  const handleDownload = (item: typeof SYLLABUS_LIST[0]) => {
    setDownloadedId(item.id);
    // Create simulated file download
    const blob = new Blob([
      `ST. BERCHMANS COLLEGE (AUTONOMOUS)\nDEPARTMENT OF AI & DATA SCIENCE\n\n${item.title}\nProgramme: ${item.programme}\nAcademic Year: ${item.academicYear}\n\nCurriculum & Regulation Document downloaded successfully.`
    ], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloadedId(null), 2500);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
            Curriculum Structure
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Academic Syllabus & Regulations
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Official autonomous course blueprints, semester credit distributions, and elective lists approved by the Board of Studies.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Filter Bar */}
          <div className="bg-[#F7F8F9] p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by regulation, year, program..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#FA7538]"
              />
            </div>

            {/* Programme Filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
              {['all', 'B.Sc. AI & Data Science'].map(prog => (
                <button
                  key={prog}
                  type="button"
                  onClick={() => setSelectedProgramme(prog)}
                  className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                    selectedProgramme === prog
                      ? 'bg-[#12192B] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {prog === 'all' ? 'All Programmes' : prog}
                </button>
              ))}
            </div>
          </div>

          {/* Syllabus Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSyllabus.map(item => (
              <div
                key={item.id}
                className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFF5F0] text-[#FA7538]">
                      {item.programme}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {item.academicYear}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1A1A1A] mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>File size: {item.fileSize} • PDF format</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleDownload(item)}
                    className={`w-full py-2.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${
                      downloadedId === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#12192B] text-white hover:bg-[#FA7538]'
                    }`}
                  >
                    {downloadedId === item.id ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Downloaded
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> Download Syllabus PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredSyllabus.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm bg-[#F7F8F9] rounded-3xl border border-dashed border-slate-200">
              No syllabus matches found for &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
