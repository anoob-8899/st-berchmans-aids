'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from './types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.collegeProfile': 'College Profile',
    'nav.department': 'AI & DS Department',
    'nav.patronSaint': 'Patron Saint',
    'nav.missionVision': 'Mission & Vision',
    'nav.skillHub': 'SB Skill Hub',
    'nav.academics': 'Academics',
    'nav.programs': 'Programs Offered',
    'nav.syllabus': 'Syllabus',
    'nav.notes': 'Notes',
    'nav.downloads': 'Downloads',
    'nav.people': 'People',
    'nav.faculty': 'Faculty',
    'nav.students': 'Students',
    'nav.activities': 'Co-Curricular',
    'nav.projects': 'Projects',
    'nav.events': 'Events',
    'nav.achievements': 'Achievements',
    'nav.portal': 'Login',
    'nav.search': 'Search...',
    
    // Hero & Home
    'hero.title': 'Department of Artificial Intelligence & Data Science',
    'hero.subtitle': 'Moulding future innovators through cutting-edge AI research, industry-ready data science mastery, and holistic ethical leadership.',
    'hero.motto': 'Maximi facere minima — St. John Berchmans',
    'hero.cta.explore': 'Explore Department',
    'hero.cta.portal': 'Access Portal',
    'home.announcements': 'Latest Announcements',
    'home.quickLinks': 'Quick Academic Access',
    'home.featuredProjects': 'Featured Student Innovations',
    'home.wings': 'Co-Curricular Wings',
    'home.events': 'Upcoming Events & Seminars',
    'home.faculty': 'Distinguished Faculty',
    'home.skillHubTitle': 'Empowering Industry Skills at SB Skill Hub',
    'home.skillHubSubtitle': '26 industry-certified courses conducted in partnership with EY, ICTAK, ASAP, and CDIT.',
    
    // Common
    'btn.viewAll': 'View All',
    'btn.download': 'Download PDF',
    'btn.submit': 'Submit',
    'btn.rate': 'Rate Project',
    'btn.filter': 'Filter',
    'badge.autonomous': 'UGC Autonomous College',
    'badge.accreditation': 'NAAC Re-accredited A+ | NIRF Ranked',
  },
  ml: {
    // Nav
    'nav.home': 'ഹോം',
    'nav.about': 'കോളേജ് വിവരങ്ങൾ',
    'nav.collegeProfile': 'കോളേജ് പ്രൊഫൈൽ',
    'nav.department': 'എ.ഐ & ഡാറ്റ സയൻസ് വകുപ്പ്',
    'nav.patronSaint': 'വിശുദ്ധ ബെർക്ക്മാൻസ്',
    'nav.missionVision': 'ലക്ഷ്യവും കാഴ്ചപ്പാടും',
    'nav.skillHub': 'എസ്.ബി സ്കിൽ ഹബ്ബ്',
    'nav.academics': 'അക്കാദമിക്സ്',
    'nav.programs': 'കോഴ്സുകൾ',
    'nav.syllabus': 'സിലബസ്',
    'nav.notes': 'നോട്ടുകൾ',
    'nav.downloads': 'ഡൗൺലോഡുകൾ',
    'nav.people': 'അംഗങ്ങൾ',
    'nav.faculty': 'അധ്യാപകർ',
    'nav.students': 'വിദ്യാർത്ഥികൾ',
    'nav.activities': 'പ്രവർത്തനങ്ങൾ',
    'nav.projects': 'പ്രോജക്റ്റുകൾ',
    'nav.events': 'ഇവന്റുകൾ',
    'nav.achievements': 'നേട്ടങ്ങൾ',
    'nav.portal': 'ലോഗിൻ',
    'nav.search': 'തിരയുക...',
    
    // Hero & Home
    'hero.title': 'ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസ് & ഡാറ്റ സയൻസ് വകുപ്പ്',
    'hero.subtitle': 'നൂതന സാങ്കേതികവിദ്യ, ഗവേഷണ മികവ്, മൂല്യാധിഷ്ഠിത വിദ്യാഭ്യാസം എന്നിവയിലൂടെ ഭാവിയുടെ സാങ്കേതിക വിദഗ്ദ്ധരെ വാർത്തെടുക്കുന്നു.',
    'hero.motto': 'മാക്സിമി ഫാസറെ മിനിമ — വി. ജോൺ ബെർക്ക്മാൻസ്',
    'hero.cta.explore': 'ഡിപ്പാർട്ട്‌മെന്റ് അറിയുക',
    'hero.cta.portal': 'പോർട്ടൽ പ്രവേശിക്കുക',
    'home.announcements': 'പുതിയ അറിയിപ്പുകൾ',
    'home.quickLinks': 'അക്കാദമിക് ലിങ്കുകൾ',
    'home.featuredProjects': 'വിദ്യാർത്ഥി പ്രോജക്റ്റുകൾ',
    'home.wings': 'സഹപാഠ്യ പ്രവർത്തന വിഭാഗങ്ങൾ',
    'home.events': 'വരാനിരിക്കുന്ന ഇവന്റുകൾ',
    'home.faculty': 'അധ്യാപക നിര',
    'home.skillHubTitle': 'എസ്.ബി സ്കിൽ ഹബ്ബ് തൊഴിൽ നൈപുണ്യ പരിശീലനങ്ങൾ',
    'home.skillHubSubtitle': 'EY, ICTAK, ASAP, CDIT പങ്കാളിത്തത്തോടെ 26 തൊഴിലധിഷ്ഠിത കോഴ്സുകൾ.',
    
    // Common
    'btn.viewAll': 'എല്ലാം കാണുക',
    'btn.download': 'ഡൗൺലോഡ് ചെയ്യുക',
    'btn.submit': 'സമർപ്പിക്കുക',
    'btn.rate': 'റേറ്റിംഗ് നൽകുക',
    'btn.filter': 'ഫിൽട്ടർ',
    'badge.autonomous': 'യു.ജി.സി ഓട്ടോണമസ് കോളേജ്',
    'badge.accreditation': 'നാക് A+ ഗ്രേഡ് | എൻ.ഐ.ആർ.എഫ് അംഗീകൃത',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('sb_lang') as Language;
    if (saved && (saved === 'en' || saved === 'ml')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sb_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
