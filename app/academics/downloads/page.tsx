'use client';

import React, { useState } from 'react';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const DOWNLOAD_ITEMS = [
  {
    id: "dl-1",
    title: "Autonomous End-Semester Examination Timetable (2025-26)",
    category: "Exam Timetable",
    date: "August 20, 2026",
    size: "1.2 MB",
    type: "PDF"
  },
  {
    id: "dl-2",
    title: "Department of AI & Data Science Academic Calendar 2026-27",
    category: "Academic Calendar",
    date: "July 15, 2026",
    size: "850 KB",
    type: "PDF"
  },
  {
    id: "dl-3",
    title: "Student Project Submission Guidelines & Documentation Template",
    category: "Guidelines",
    date: "August 01, 2026",
    size: "2.1 MB",
    type: "PDF"
  },
  {
    id: "dl-4",
    title: "B.Sc. Internship & Industrial Training Assessment Form",
    category: "Forms",
    date: "August 10, 2026",
    size: "450 KB",
    type: "DOCX"
  },
  {
    id: "dl-5",
    title: "St. Berchmans Department Brochure & Research Compendium",
    category: "Brochure",
    date: "June 28, 2026",
    size: "6.4 MB",
    type: "PDF"
  }
];

export default function DownloadsPage() {
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleDownload = (item: typeof DOWNLOAD_ITEMS[0]) => {
    setDownloadedId(item.id);
    const blob = new Blob([
      `ST. BERCHMANS COLLEGE (AUTONOMOUS)\nDEPARTMENT OF AI & DATA SCIENCE\n\nDocument: ${item.title}\nCategory: ${item.category}\nDate Published: ${item.date}`
    ], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloadedId(null), 2000);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
            Official Forms & Files
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Academic Downloads Center
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Download official exam schedules, application forms, academic calendars, and department documentation.
          </p>
        </div>
      </section>

      {/* Main List */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {DOWNLOAD_ITEMS.map(item => (
              <div
                key={item.id}
                className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F7F8F9] transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] text-[#FA7538] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 mb-1 inline-block">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-[#1A1A1A]">
                      {item.title}
                    </h3>
                    <div className="text-xs text-slate-400 mt-1">
                      Published: {item.date} • Size: {item.size} • Format: {item.type}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload(item)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all flex-shrink-0 ${
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
                      <Download className="w-4 h-4" /> Download File
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
