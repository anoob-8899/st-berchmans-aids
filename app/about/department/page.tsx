'use client';
import { EditableText } from '@/components/shared/EditableText';


import React from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { 
  Cpu, 
  Database, 
  Terminal, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Users
} from 'lucide-react';

export default function DepartmentPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
            Academic Unit
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"><EditableText contentKey="dept.title" defaultValue="Department of AI & Data Science" /></h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Cultivating next-generation machine learning practitioners, deep learning researchers, and ethical data leaders.
          </p>
        </div>
      </section>

      {/* Overview & Mission */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          <div className="max-w-3xl">
            <SectionHeading
              eyebrow="Department Genesis"
              title="Autonomous Curriculum Driven by Modern Industry Reality"
              subtitle="Instituted to bridge the widening demand for artificial intelligence specialization in South India, the department offers rigorous training encompassing foundational linear algebra, neural network architectures, big data distributed systems, and real-world edge robotics."
            />
          </div>

          {/* Three Key Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F7F8F9] p-8 rounded-3xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] text-[#FA7538] flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">AI & Deep Learning</h3>
              <p className="text-xs sm:text-sm text-[#5C6470] leading-relaxed">
                Hands-on exposure to PyTorch, Hugging Face Transformers, Computer Vision (YOLO/ViT), and local language speech processing.
              </p>
            </div>

            <div className="bg-[#F7F8F9] p-8 rounded-3xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF8F2] text-[#2E7D50] flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">Data Science & Cloud</h3>
              <p className="text-xs sm:text-sm text-[#5C6470] leading-relaxed">
                Big data engineering utilizing PostgreSQL, Apache Spark, distributed clusters, and scalable predictive modeling.
              </p>
            </div>

            <div className="bg-[#F7F8F9] p-8 rounded-3xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#12192B] flex items-center justify-center">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">Edge & Robotics Lab</h3>
              <p className="text-xs sm:text-sm text-[#5C6470] leading-relaxed">
                Deployment of embedded neural nets on NVIDIA Jetson, Raspberry Pi 5, and autonomous rovers for real-time inference.
              </p>
            </div>
          </div>

          {/* Quick links to Programs & Faculty */}
          <div className="bg-[#12192B] text-white p-8 sm:p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Want to meet our professors or explore degree options?</h3>
              <p className="text-sm text-slate-300">Discover B.Sc. AI & Data Science and M.Sc AI autonomous programs.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/academics/programs"
                className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] transition"
              >
                Degree Programs
              </Link>
              <Link
                href="/people/faculty"
                className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white hover:bg-white/20 transition"
              >
                Faculty Directory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
