'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminEditContextType {
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  toggleAdminMode: () => void;
  getContent: (key: string, defaultValue: string) => string;
  updateContent: (key: string, value: string) => void;
  resetAllContent: () => void;
}

const AdminEditContext = createContext<AdminEditContextType>({
  isAdminLoggedIn: false,
  setIsAdminLoggedIn: () => {},
  isAdminMode: false,
  setIsAdminMode: () => {},
  toggleAdminMode: () => {},
  getContent: (_key, defaultValue) => defaultValue,
  updateContent: () => {},
  resetAllContent: () => {},
});

export const AdminEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedInState] = useState(false);
  const [isAdminMode, setIsAdminModeState] = useState(false);
  const [contentMap, setContentMap] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const role = localStorage.getItem('sb_user_role') || localStorage.getItem('sb_current_role');
      if (role === 'admin') {
        setIsAdminLoggedInState(true);
        const savedAdminMode = localStorage.getItem('sb_admin_mode');
        if (savedAdminMode === 'true') {
          setIsAdminModeState(true);
        }
      } else {
        setIsAdminLoggedInState(false);
        setIsAdminModeState(false);
      }

      const savedContent = localStorage.getItem('sb_site_custom_content');
      if (savedContent) {
        setContentMap(JSON.parse(savedContent));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setIsAdminLoggedIn = (val: boolean) => {
    setIsAdminLoggedInState(val);
    try {
      if (val) {
        localStorage.setItem('sb_user_role', 'admin');
        localStorage.setItem('sb_current_role', 'admin');
        localStorage.setItem('sb_logged_in', 'true');
      } else {
        localStorage.removeItem('sb_user_role');
        localStorage.removeItem('sb_current_role');
        localStorage.removeItem('sb_current_user');
        localStorage.removeItem('sb_logged_in');
        localStorage.removeItem('sb_admin_mode');
        setIsAdminModeState(false);
      }
    } catch (e) {}
  };

  const setIsAdminMode = (val: boolean) => {
    if (!isAdminLoggedIn && val) {
      alert('Admin edit mode is only available after logging in as an Administrator.');
      return;
    }
    setIsAdminModeState(val);
    try {
      localStorage.setItem('sb_admin_mode', val ? 'true' : 'false');
    } catch (e) {}
  };

  const toggleAdminMode = () => {
    if (!isAdminLoggedIn) {
      alert('Admin edit mode is only available after logging in as an Administrator.');
      return;
    }
    setIsAdminMode(!isAdminMode);
  };

  const getContent = (key: string, defaultValue: string): string => {
    return contentMap[key] !== undefined ? contentMap[key] : defaultValue;
  };

  const updateContent = (key: string, value: string) => {
    setContentMap(prev => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem('sb_site_custom_content', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const resetAllContent = () => {
    if (confirm('Are you sure you want to reset all customized site texts to defaults?')) {
      setContentMap({});
      try {
        localStorage.removeItem('sb_site_custom_content');
      } catch (e) {}
    }
  };

  return (
    <AdminEditContext.Provider
      value={{
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        isAdminMode: isAdminLoggedIn && isAdminMode,
        setIsAdminMode,
        toggleAdminMode,
        getContent,
        updateContent,
        resetAllContent,
      }}
    >
      {/* Top Floating Admin Banner only if logged in as Admin and Edit Mode is ON */}
      {isAdminLoggedIn && isAdminMode && (
        <div className="sticky top-0 z-50 bg-[#12192B] text-white py-2 px-4 border-b border-[#FA7538] flex flex-wrap items-center justify-between text-xs shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FA7538] animate-pulse"></span>
            <span className="font-bold text-[#FA7538]">ADMIN IN-PLACE EDITING ACTIVE:</span>
            <span className="text-slate-300 hidden sm:inline">
              Click any text highlighted with a dotted line to edit directly.
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 sm:mt-0">
            <button
              type="button"
              onClick={resetAllContent}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
            >
              Reset to Defaults
            </button>
            <button
              type="button"
              onClick={() => setIsAdminMode(false)}
              className="px-3 py-1 rounded bg-[#FA7538] hover:bg-[#E86326] font-bold text-white text-[11px]"
            >
              Exit Edit Mode
            </button>
          </div>
        </div>
      )}
      {children}
    </AdminEditContext.Provider>
  );
};

export const useAdminEdit = () => useContext(AdminEditContext);
