import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  centered = false,
  dark = false,
}) => {
  return (
    <div className={`mb-10 ${centered ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'}`}>
      {eyebrow && (
        <span
          className={`inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3 ${
            dark
              ? 'bg-[#FA7538]/20 text-[#FA7538] border border-[#FA7538]/30'
              : 'bg-[#FFF5F0] text-[#FA7538] border border-[#FA7538]/20'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 ${
          dark ? 'text-white' : 'text-[#1A1A1A]'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base sm:text-lg leading-relaxed ${
            dark ? 'text-slate-300' : 'text-[#5C6470]'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
