'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { 
  Camera, 
  Upload, 
  X, 
  Calendar, 
  User, 
  Heart, 
  Sparkles,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface MemoryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  caption: string;
  uploadedBy: string;
  likes: number;
}

const DEFAULT_MEMORIES: MemoryItem[] = [];

export default function GalleryPage() {
  const [memories, setMemories] = useState<MemoryItem[]>(DEFAULT_MEMORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<MemoryItem | null>(null);

  // Form fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Campus Life');
  const [newDate, setNewDate] = useState('September 2026');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newUploadedBy, setNewUploadedBy] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sb_memories_gallery');
      if (saved) {
        setMemories(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const saveMemories = (updated: MemoryItem[]) => {
    setMemories(updated);
    try {
      localStorage.setItem('sb_memories_gallery', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleUploadMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) return;

    const newMem: MemoryItem = {
      id: `mem-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      date: newDate.trim(),
      imageUrl: newImageUrl.trim(),
      caption: newCaption.trim(),
      uploadedBy: newUploadedBy.trim() || 'Student / Faculty',
      likes: 1
    };

    const updated = [newMem, ...memories];
    saveMemories(updated);
    setUploadSuccess(true);

    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadModalOpen(false);
      setNewTitle('');
      setNewImageUrl('');
      setNewCaption('');
      setNewUploadedBy('');
    }, 1200);
  };

  const handleLike = (id: string) => {
    const updated = memories.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m);
    saveMemories(updated);
  };

  const categories = ['All', 'Tech & Hackathons', 'Campus Life', 'Workshops', 'Cultural & Sports'];

  const filteredMemories = selectedCategory === 'All' 
    ? memories 
    : memories.filter(m => m.category === selectedCategory);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
                Memories & Moments
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Department Memories Gallery
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
                Reliving our hackathons, research summits, campus traditions, and celebratory victories.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] shadow-lg hover:shadow-xl transition-all self-start md:self-auto"
            >
              <Upload className="w-4 h-4" /> Upload a Memory
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider transition ${
                  selectedCategory === cat
                    ? 'bg-[#12192B] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Memories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMemories.map(mem => (
              <div
                key={mem.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between group cursor-pointer"
                onClick={() => setPreviewImage(mem)}
              >
                <div>
                  <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={mem.imageUrl}
                      alt={mem.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FA7538] text-white shadow">
                        {mem.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {mem.date}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        by {mem.uploadedBy}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#FA7538] transition-colors leading-snug">
                      {mem.title}
                    </h3>

                    <p className="text-xs text-[#5C6470] leading-relaxed line-clamp-2">
                      {mem.caption}
                    </p>
                  </div>
                </div>

                <div 
                  className="px-6 py-3.5 bg-[#F7F8F9] border-t border-slate-100 flex items-center justify-between text-xs"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => handleLike(mem.id)}
                    className="flex items-center gap-1.5 font-semibold text-slate-600 hover:text-rose-500 transition"
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span>{mem.likes} Likes</span>
                  </button>
                  <span className="text-[#FA7538] font-bold uppercase tracking-wider text-[11px]">
                    Click to view →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox / Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl border border-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-80 sm:h-[420px] w-full bg-black">
              <Image
                src={previewImage.imageUrl}
                alt={previewImage.title}
                fill
                className="object-contain"
              />
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFF5F0] text-[#FA7538]">
                  {previewImage.category}
                </span>
                <span className="text-xs text-slate-400">
                  {previewImage.date} • by {previewImage.uploadedBy}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">{previewImage.title}</h3>
              <p className="text-sm text-[#5C6470]">{previewImage.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Memory Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A]">Upload Department Memory</h3>
                <p className="text-xs text-slate-400">Add photos of fests, hackathons, seminars or campus life</p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-slate-800">Memory Uploaded to Gallery!</h4>
                <p className="text-xs text-slate-500">Your photo has been preserved in the department memories archive.</p>
              </div>
            ) : (
              <form onSubmit={handleUploadMemory} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Memory Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. AI Datathon 2026 Finals Night"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                  >
                    <option>Tech & Hackathons</option>
                    <option>Campus Life</option>
                    <option>Workshops</option>
                    <option>Cultural & Sports</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Image URL * (Unsplash or direct image link)</label>
                  <input
                    type="url"
                    required
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop')}
                      className="px-2.5 py-1 rounded bg-slate-100 text-[10px] text-slate-600 hover:bg-slate-200"
                    >
                      Sample Photo 1 (Coding Team)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop')}
                      className="px-2.5 py-1 rounded bg-slate-100 text-[10px] text-slate-600 hover:bg-slate-200"
                    >
                      Sample Photo 2 (Auditorium)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Date / Month</label>
                    <input
                      type="text"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      placeholder="e.g. August 2026"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Name / Wing</label>
                    <input
                      type="text"
                      value={newUploadedBy}
                      onChange={e => setNewUploadedBy(e.target.value)}
                      placeholder="e.g. Media Wing / Kevin"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Caption / Story</label>
                  <textarea
                    rows={3}
                    value={newCaption}
                    onChange={e => setNewCaption(e.target.value)}
                    placeholder="Short description of this moment..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] shadow-sm"
                  >
                    Post to Gallery
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
