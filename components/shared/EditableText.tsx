'use client';

import React, { useState } from 'react';
import { useAdminEdit } from '@/lib/AdminEditContext';
import { Edit2, Check, X } from 'lucide-react';

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  defaultValue,
  as: Component = 'span',
  className = '',
  multiline = false,
}) => {
  const { isAdminMode, getContent, updateContent } = useAdminEdit();
  const currentText = getContent(contentKey, defaultValue);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempText, setTempText] = useState(currentText);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent(contentKey, tempText);
    setIsModalOpen(false);
  };

  if (!isAdminMode) {
    return <Component className={className}>{currentText}</Component>;
  }

  return (
    <>
      <Component
        className={`${className} relative group/edit cursor-pointer border border-dashed border-[#FA7538]/60 hover:border-[#FA7538] hover:bg-[#FA7538]/10 rounded px-1 -mx-1 transition inline-block`}
        onClick={() => {
          setTempText(currentText);
          setIsModalOpen(true);
        }}
        title="Admin: Click to edit this text"
      >
        {currentText}
        <span className="inline-block ml-1 opacity-60 group-hover/edit:opacity-100 text-[#FA7538] align-middle">
          <Edit2 className="w-3.5 h-3.5 inline" />
        </span>
      </Component>

      {/* Edit Modal Popover */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Admin Content Editor: <span className="text-[#FA7538] font-mono">{contentKey}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Edit Text Content:
                </label>
                {multiline ? (
                  <textarea
                    rows={4}
                    value={tempText}
                    onChange={e => setTempText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#FA7538]"
                    autoFocus
                  />
                ) : (
                  <input
                    type="text"
                    value={tempText}
                    onChange={e => setTempText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#FA7538]"
                    autoFocus
                  />
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setTempText(defaultValue)}
                  className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  Reset to original default
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
