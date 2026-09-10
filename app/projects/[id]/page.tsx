'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_PROJECTS } from '@/lib/mockData';
import { Project, ProjectComment } from '@/lib/types';
import { RatingStars } from '@/components/shared/RatingStars';
import { 
  ArrowLeft, 
  ExternalLink, 
  Code2, 
  Star, 
  MessageSquare, 
  User, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(() => {
    return INITIAL_PROJECTS.find(p => p.id === projectId) || INITIAL_PROJECTS[0] || null;
  });

  const [comments, setComments] = useState<ProjectComment[]>(project?.comments || []);
  const [userRating, setUserRating] = useState<number>(5);
  const [userName, setUserName] = useState('');
  const [userComment, setUserComment] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  React.useEffect(() => {
    async function loadProject() {
      if (!projectId) return;
      try {
        const res = await fetch(`/api/projects?id=${encodeURIComponent(projectId)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.project) {
            setProject(data.project);
            setComments(data.project.comments || []);
          }
        }
      } catch (err) {
        console.warn('Error loading dynamic project detail:', err);
      }
    }
    loadProject();
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <Code2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Project Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">The project you are looking for does not exist or has been removed.</p>
        <Link href="/projects" className="mt-4 px-5 py-2.5 rounded-full bg-[#12192B] text-white text-xs font-bold uppercase tracking-wider">
          Return to Projects Directory
        </Link>
      </div>
    );
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userComment.trim()) return;

    const newC: ProjectComment = {
      id: `c-${Date.now()}`,
      projectId: project.id,
      userName: userName.trim(),
      userRole: 'student',
      rating: userRating,
      comment: userComment.trim(),
      createdAt: 'Just now',
      approved: true,
    };

    setComments(prev => [newC, ...prev]);

    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, comment: newC }),
      });
    } catch (err) {
      console.error('Failed to post project comment:', err);
    }

    setSubmittedMessage(true);
    setUserName('');
    setUserComment('');
    setTimeout(() => setSubmittedMessage(false), 3000);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Top Banner */}
      <section className="bg-[#12192B] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects Directory
          </Link>

          <div className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white">
                {project.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white">
                {project.status}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span>Submitted by: <strong className="text-white">{project.submittedBy}</strong></span>
              <span>•</span>
              <span>Date: {project.submittedAt}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <RatingStars rating={project.rating} totalCount={project.ratingCount} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Image & Description */}
            <div className="lg:col-span-8 space-y-8">
              <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#1A1A1A]">Project Overview</h2>
                <p className="text-base text-[#5C6470] leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Interactive Rating & Review Form (PRD Section 16) */}
              <div className="bg-[#F7F8F9] p-8 rounded-3xl border border-slate-200 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    Rate this Project & Leave Remarks
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your evaluation helps students improve their models and deployment readiness.
                  </p>
                </div>

                {submittedMessage && (
                  <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" /> Thank you! Your rating and remarks have been published.
                  </div>
                )}

                <form onSubmit={handleAddComment} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-2">Select Your Rating (1–5 Stars)</label>
                    <RatingStars
                      rating={userRating}
                      interactive
                      onRate={r => setUserRating(r)}
                      size="lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Your Name / Title *</label>
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        placeholder="e.g. Dr. Faculty / Student Name"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Written Remarks *</label>
                    <textarea
                      required
                      rows={3}
                      value={userComment}
                      onChange={e => setUserComment(e.target.value)}
                      placeholder="Write constructive technical remarks on model architecture, inference speed, dataset..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] shadow-sm"
                  >
                    Submit Rating & Review
                  </button>
                </form>

                {/* Published Reviews List */}
                <div className="pt-6 border-t border-slate-200 space-y-4">
                  <h4 className="font-bold text-sm text-[#1A1A1A]">
                    Community Reviews ({comments.length})
                  </h4>

                  {comments.map(c => (
                    <div
                      key={c.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800">{c.userName}</span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            {c.userRole}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{c.createdAt}</span>
                      </div>

                      <RatingStars rating={c.rating} size="sm" />

                      <p className="text-xs text-[#5C6470] leading-relaxed">
                        {c.comment}
                      </p>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <div className="text-xs text-slate-400 italic">
                      No reviews yet. Be the first to rate this project!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Metadata & Links */}
            <div className="lg:col-span-4 space-y-6">
              {/* External Action Links */}
              <div className="bg-[#12192B] text-white p-7 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold">Project Repositories</h3>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-full bg-slate-800 hover:bg-[#FA7538] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                  >
                    <Code2 className="w-4 h-4" /> Source Code (GitHub)
                  </a>
                )}

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-full bg-[#FA7538] hover:bg-[#E86326] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Interactive Demo
                  </a>
                )}
              </div>

              {/* Team Members */}
              <div className="bg-[#F7F8F9] p-7 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-[#1A1A1A]">Project Contributors</h3>
                <div className="space-y-2">
                  {project.teamMembers.map(member => (
                    <div key={member} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <User className="w-4 h-4 text-[#FA7538]" />
                      <span>{member}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-[#F7F8F9] p-7 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-[#1A1A1A]">Technologies Deployed</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map(tech => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
