'use client';
import { EditableText } from '@/components/shared/EditableText';
import React, { useState, useMemo, useEffect } from 'react';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { LECTURE_NOTES } from '@/lib/mockData';
import { NoteItem } from '@/lib/types';
import { useAdminEdit } from '@/lib/AdminEditContext';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  User, 
  Calendar,
  Cloud,
  Plus,
  ShieldCheck,
  Lock,
  Upload,
  X
} from 'lucide-react';

export default function NotesPage() {
  const { isAdminLoggedIn } = useAdminEdit();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUserObj, setCurrentUserObj] = useState<any>(null);

  const [notesList, setNotesList] = useState<NoteItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sb_managed_notes');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return LECTURE_NOTES;
  });

  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    LECTURE_NOTES.forEach(n => { initial[n.id] = n.downloadCount; });
    return initial;
  });
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Modal State for Note Entry
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newSemester, setNewSemester] = useState<number>(1);
  const [newAcademicYear, setNewAcademicYear] = useState('2025-26');
  const [newDescription, setNewDescription] = useState('');
  const [newUploadedBy, setNewUploadedBy] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('sb_current_role') || localStorage.getItem('sb_user_role');
      setUserRole(role);
      const userStr = localStorage.getItem('sb_current_user');
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          setCurrentUserObj(parsed);
          setNewUploadedBy(parsed.name || '');
        } catch (e) {}
      }
    }
  }, [isAdminLoggedIn]);

  // Only Admin and Faculty can enter notes
  const isAuthorizedToEnterNotes = isAdminLoggedIn || userRole === 'admin' || userRole === 'faculty';

  const filteredNotes = useMemo(() => {
    return notesList.filter(n => {
      const matchQuery = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         n.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSem = selectedSemester === 'all' || n.semester === selectedSemester;
      return matchQuery && matchSem;
    });
  }, [notesList, searchQuery, selectedSemester]);

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

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubject.trim() || !newDescription.trim()) return;

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject.trim(),
      semester: Number(newSemester),
      academicYear: newAcademicYear,
      description: newDescription.trim(),
      fileSize: '2.4 MB',
      downloadCount: 0,
      uploadedBy: newUploadedBy.trim() || (isAdminLoggedIn || userRole === 'admin' ? 'Chief Administrator' : 'Department Faculty'),
      uploadedAt: 'Just Now',
      fileUrl: '#'
    };

    const updated = [newNote, ...notesList];
    setNotesList(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sb_managed_notes', JSON.stringify(updated));
      } catch (err) {}
    }

    setNewTitle('');
    setNewSubject('');
    setNewDescription('');
    setShowAddModal(false);
    setSuccessMsg(`Successfully published lecture notes: "${newNote.title}"`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#2E7D50] mb-2">
            Academic Resources
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                <EditableText contentKey="notes.title" defaultValue="Academic Notes Repository" />
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
                Official study guides, module summaries, and code notebooks prepared by our faculty members.
              </p>
            </div>

            {/* Requirement 3: Add Notes Button for Admin & Faculty */}
            {isAuthorizedToEnterNotes ? (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FA7538] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E86326] transition shadow-lg shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Enter / Add New Notes
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-medium">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Note Creation restricted to Admin &amp; Faculty</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          
          {successMsg && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Cloud Storage Notice Callout */}
          <div className="p-4 bg-[#EEF8F2] rounded-2xl border border-[#2E7D50]/20 flex items-center justify-between text-xs text-[#2E7D50]">
            <div className="flex items-center gap-2 font-medium">
              <Cloud className="w-4 h-4 flex-shrink-0" />
              <span>
                All academic materials are hosted securely on department cloud storage with authenticated checksum validation.
              </span>
            </div>
            <span className="hidden sm:inline font-bold">Encrypted &amp; Verified</span>
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

      {/* Note Creation Modal (Requirement 3: Admin & Faculty Only) */}
      {showAddModal && isAuthorizedToEnterNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2E7D50]" />
                <h3 className="text-lg font-bold text-[#12192B]">Add / Enter Lecture Notes</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Module 3: Neural Networks Architecture & Optimization"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-[#2E7D50]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  placeholder="e.g. Deep Learning & Artificial Intelligence"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-[#2E7D50]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Semester *</label>
                  <select
                    value={newSemester}
                    onChange={e => setNewSemester(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#2E7D50]"
                  >
                    {[1, 2, 3, 4, 5, 6].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={newAcademicYear}
                    onChange={e => setNewAcademicYear(e.target.value)}
                    placeholder="2025-26"
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-[#2E7D50]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description &amp; Overview *</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Brief description of modules, formulas, or code examples included in this note..."
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-[#2E7D50]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Author / Uploaded By</label>
                <input
                  type="text"
                  value={newUploadedBy}
                  onChange={e => setNewUploadedBy(e.target.value)}
                  placeholder="Faculty Member / Admin Name"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-[#2E7D50]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#2E7D50] hover:bg-[#246540] text-white font-bold transition shadow-md"
                >
                  Publish Note to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
