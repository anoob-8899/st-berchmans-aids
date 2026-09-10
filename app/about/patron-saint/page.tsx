'use client';
import { EditableText } from '@/components/shared/EditableText';


import React from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { COLLEGE_INFO } from '@/lib/mockData';
import { Sparkles, Heart, Quote, ArrowRight } from 'lucide-react';

export default function PatronSaintPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
            Patron Saint of Students
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            St. John Berchmans (1599 – 1621)
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Heavenly patron of our institution and role model of perfection in ordinary duties.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          {/* Spiritual Motto Box */}
          <div className="bg-[#FFF5F0] p-8 rounded-3xl border border-[#FA7538]/30 text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#FA7538] font-bold">
              The Guiding Spiritual Maxim
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#12192B] italic font-serif">
              &ldquo;Maximi facere minima&rdquo;
            </div>
            <p className="text-sm font-semibold text-[#5C6470]">
              (Do the most with the least • Sanctity in ordinary everyday actions)
            </p>
          </div>

          {/* Supplied Narrative */}
          <div className="prose prose-slate max-w-none text-base sm:text-lg leading-relaxed text-[#5C6470] space-y-6">
            <p>
              <strong>St John Berchmans</strong> (13 March 1599 – 13 August 1621), venerated in the Church as the patron of students, is the patron saint of our college.
            </p>
            <p>
              He was born in the town of Diest in Flanders as the eldest son of a poor shoemaker. At a very young age, he wanted to be a priest. At the age of thirteen, he became a servant in the household of one of the cathedral canons at Malines. After his mother&rsquo;s death, his father and two brothers followed suit and entered religious life.
            </p>
            <p>
              In 1615, he enrolled in the Jesuit College at Malines. A year later, he joined the novitiate. He was an enthusiastic student, an excellent actor and an orator. He has been described as a young man of exemplary life, of pure conscience and of great perfection. John Berchmans could not complete his studies. He died of a contagious disease on 13 August 1621.
            </p>
            <p>
              He was beatified by Pope Pius IX in 1865 and canonized by Pope Leo XIII in 1888. His spiritual doctrine was that sanctity consists less in unusual dramatic actions than in the loving practice of fidelity to God in day to day living. This appreciation of the value of ordinary things is the distinctive mark of his sanctity. He expressed his way of perfection in the phrase <strong>&ldquo;Maximi facere minima&rdquo;</strong>.
            </p>
            <p>
              St John Berchmans is remembered today for his studiousness, faithfulness to the rules of his order, the holiness of his life, and his devotion to the Eucharist and to the Virgin Mary.
            </p>
          </div>

          {/* Reassurance Callout */}
          <div className="bg-[#12192B] text-white p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#FA7538] font-bold mb-1">
                Student Formation
              </div>
              <h3 className="text-lg font-bold">Applying Saint Berchmans&rsquo; Virtue in Data Science</h3>
              <p className="text-xs text-slate-300 mt-1">
                Honesty in data curation, rigorous bug-free coding, and humility in technological leadership.
              </p>
            </div>
            <Link
              href="/about/mission-vision"
              className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] transition whitespace-nowrap"
            >
              Mission & Vision →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
