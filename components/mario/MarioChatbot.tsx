'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { queryMarioKnowledge } from '@/lib/marioKnowledge';

interface ChatMessage {
  id: string;
  sender: 'user' | 'mario';
  text: string;
  relatedLink?: string;
  timestamp: string;
}

export const MarioChatbot: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'mario',
      text: language === 'ml' 
        ? "നമസ്കാരം! ഞാൻ മരിയോ (MARIO) — AI & Data Science വകുപ്പിന്റെ എ.ഐ അസിസ്റ്റന്റ്. അക്കാദമിക്സ്, സിലബസ്, നോട്ടുകൾ, ഫാക്കൽറ്റി, പ്രോജക്റ്റുകൾ എന്നിവയെക്കുറിച്ചുള്ള നിങ്ങളുടെ സംശയങ്ങൾ ചോദിക്കൂ!"
        : "Hello! I am MARIO — Department AI Assistant for AI & Data Science at St. Berchmans College. How can I help you today?",
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const samplePrompts = [
    { en: "Tell me about AI & DS program", ml: "എ.ഐ & ഡാറ്റ സയൻസ് കോഴ്സ് വിവരങ്ങൾ" },
    { en: "Who is the Patron Saint?", ml: "കോളേജിന്റെ വിശുദ്ധൻ ആരാണ്?" },
    { en: "What is SB Skill Hub?", ml: "എസ്.ബി സ്കിൽ ഹബ്ബ് എന്താണ്?" },
    { en: "How can I access notes?", ml: "നോട്ടുകൾ എങ്ങനെ ലഭിക്കും?" },
    { en: "Upcoming department events", ml: "വരാനിരിക്കുന്ന പ്രധാന പരിപാടികൾ" }
  ];

  const handleSendMessage = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const response = queryMarioKnowledge(q, language);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mario',
        text: response.answer,
        relatedLink: response.relatedLink,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Reduced to Small Circle Button (Requirement 5) */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <div className="relative group">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#12192B] text-white shadow-xl hover:shadow-2xl hover:bg-[#1C2640] transition-all transform hover:scale-105 border-2 border-[#FA7538] flex items-center justify-center relative cursor-pointer"
              aria-label="Open MARIO AI Chatbot"
            >
              {/* Pulsing indicator ring */}
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FA7538] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#FA7538] border-2 border-[#12192B]"></span>
              </span>

              <Bot className="w-6 h-6 text-[#FA7538] group-hover:scale-110 transition-transform" />
            </button>

            {/* Hover Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#12192B] text-white text-xs font-bold rounded-xl shadow-lg whitespace-nowrap hidden group-hover:block transition-all border border-slate-700 pointer-events-none">
              <span className="text-[#FA7538]">MARIO</span> AI Assistant
            </div>
          </div>
        )}
      </div>

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[560px] animate-scale-up">
          {/* Header */}
          <div className="bg-[#12192B] text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FA7538] flex items-center justify-center text-white shadow">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5">
                  MARIO AI Assistant
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-normal">
                    Online
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  St. Berchmans College AI & DS Knowledge Agent
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F7F8F9]">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#FA7538] text-white rounded-br-none shadow-sm'
                      : 'bg-white text-[#1A1A1A] rounded-bl-none shadow-sm border border-slate-200/70'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.relatedLink && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <Link
                        href={msg.relatedLink}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#FA7538] hover:underline"
                      >
                        Visit Related Page <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-2xl rounded-bl-none w-16 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(language === 'ml' ? p.ml : p.en)}
                className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-[#FFF5F0] hover:text-[#FA7538] whitespace-nowrap transition-colors border border-slate-200"
              >
                {language === 'ml' ? p.ml : p.en}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                language === 'ml' 
                  ? "ചോദ്യങ്ങൾ ഇവിടെ ചോദിക്കൂ..." 
                  : "Ask MARIO anything about AI & DS department..."
              }
              className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FA7538] text-[#1A1A1A]"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim()}
              className="p-2 rounded-full bg-[#FA7538] text-white hover:bg-[#E86326] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
