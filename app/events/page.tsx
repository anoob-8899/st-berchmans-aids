'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { EVENTS } from '@/lib/mockData';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredEvents = EVENTS.filter(e => {
    if (activeTab === 'all') return true;
    return e.status === activeTab;
  });

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#12192B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FA7538] mb-2">
            Academic Calendar
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Department Events & Workshops
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            State-level symposiums, PyTorch bootcamps, AI hackathons, and guest lectures by world-class researchers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
            {[
              { id: 'all', label: 'All Events' },
              { id: 'upcoming', label: 'Upcoming Events' },
              { id: 'completed', label: 'Completed Archives' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#12192B] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(evt => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={evt.posterImage}
                      alt={evt.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow ${
                        evt.status === 'upcoming' ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}>
                        {evt.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#FA7538] transition-colors leading-snug">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-[#5C6470] leading-relaxed line-clamp-2">
                      {evt.description}
                    </p>

                    <div className="space-y-1.5 pt-2 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#FA7538]" />
                        <span className="font-semibold text-slate-800">{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.venue}</span>
                      </div>
                      {evt.guestSpeaker && (
                        <div className="flex items-center gap-2 text-[#2E7D50] font-semibold">
                          <User className="w-3.5 h-3.5 text-[#2E7D50]" />
                          <span>Guest: {evt.guestSpeaker}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {evt.registrationUrl ? (
                    <a
                      href={evt.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-full bg-[#12192B] text-white hover:bg-[#FA7538] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
                    >
                      Register Now <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="py-2 text-center text-xs text-slate-400 italic">
                      Event Concluded
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
