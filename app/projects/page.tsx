'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { RatingStars } from '@/components/shared/RatingStars';
import { INITIAL_PROJECTS } from '@/lib/mockData';
import { Project } from '@/lib/types';
import { 
  FolderGit2, 
  Plus, 
  ExternalLink, 
  ArrowRight, 
  Search, 
  Sparkles,
  X,
  CheckCircle2
} from 'lucide-react';

export default function ProjectsDirectoryPage() {
  const [projectsList, setProjectsList] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State for new project submission
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Computer Vision',
    status: 'upcoming' as 'upcoming' | 'completed',
    teamMembers: '',
    techStack: '',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop',
    githubUrl: '',
    demoUrl: '',
    submittedBy: 'Current Student',
  });

  const filteredProjects = useMemo(() => {
    return projectsList.filter(p => {
      const matchTab = activeTab === 'all' || p.status === activeTab;
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchTab && matchSearch;
    });
  }, [projectsList, activeTab, searchQuery]);

  const handleSubmitNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: formData.status,
      teamMembers: formData.teamMembers.split(',').map(m => m.trim()).filter(Boolean),
      techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
      image: formData.image,
      githubUrl: formData.githubUrl,
      demoUrl: formData.demoUrl,
      rating: 5.0,
      ratingCount: 1,
      comments: [],
      submittedBy: formData.submittedBy,
      submittedAt: 'Just now',
      isApproved: true,
    };

    setProjectsList(prev => [newProject, ...prev]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setFormData({
        title: '',
        description: '',
        category: 'Computer Vision',
        status: 'upcoming',
        teamMembers: '',
        techStack: '',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop',
        githubUrl: '',
        demoUrl: '',
        submittedBy: 'Current Student',
      });
    }, 1500);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
                Innovation Hub
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Department AI & DS Projects
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
                Showcasing upcoming prototypes and completed artificial intelligence deployments by our students and faculty.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] shadow-lg hover:shadow-xl transition-all self-start md:self-auto"
            >
              <Plus className="w-4 h-4" /> Submit Your Project
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Controls: Tabs & Search */}
          <div className="bg-[#F7F8F9] p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'upcoming', label: 'Upcoming / In-Progress' },
                { id: 'completed', label: 'Completed Innovations' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#12192B] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by tech or title..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-slate-200 text-xs sm:text-sm text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#FA7538]"
              />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image Top */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FA7538] text-white shadow">
                        {project.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow ${
                        project.status === 'completed' ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#1A1A1A] group-hover:text-[#FA7538] transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <div className="text-xs text-slate-400 mt-1">
                        Team: <span className="font-semibold text-slate-700">{project.teamMembers.join(', ')}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5C6470] leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map(tech => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Rating & Link */}
                <div className="px-6 py-4 bg-[#F7F8F9] border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={project.rating} totalCount={project.ratingCount} size="sm" />
                  </div>

                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#12192B] group-hover:text-[#FA7538] transition-colors"
                  >
                    Inspect & Rate <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm bg-[#F7F8F9] rounded-3xl border border-dashed border-slate-200">
              No projects found matching your search.
            </div>
          )}
        </div>
      </section>

      {/* Project Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A]">Submit Student Project</h3>
                <p className="text-xs text-slate-400">Add an upcoming prototype or completed AI deployment</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-slate-800">Project Submitted Successfully!</h4>
                <p className="text-xs text-slate-500">Your project has been recorded and published to the showcase.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitNewProject} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Malayalam Speech AI Assistant"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                  >
                    <option>Computer Vision</option>
                    <option>Natural Language Processing</option>
                    <option>Robotics & Edge AI</option>
                    <option>Healthcare AI</option>
                    <option>Agriculture AI</option>
                    <option>Big Data & Analytics</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === 'upcoming'}
                        onChange={() => setFormData({ ...formData, status: 'upcoming' })}
                      />
                      <span>Upcoming / In-Progress</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === 'completed'}
                        onChange={() => setFormData({ ...formData, status: 'completed' })}
                      />
                      <span>Completed</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Team Members (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.teamMembers}
                    onChange={e => setFormData({ ...formData, teamMembers: e.target.value })}
                    placeholder="e.g. Kevin Paul, Ananya Roy"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                    placeholder="e.g. PyTorch, FastAPI, React, Docker"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the problem solved and model architecture..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Demo / Video URL</label>
                    <input
                      type="url"
                      value={formData.demoUrl}
                      onChange={e => setFormData({ ...formData, demoUrl: e.target.value })}
                      placeholder="https://demo..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] shadow-sm"
                  >
                    Submit Project
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
