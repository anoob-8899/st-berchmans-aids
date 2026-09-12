'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  sources?: string;
  isStreaming?: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hello! I am the SBC AI & Data Science Department Assistant. How can I help you with courses, faculty, or admissions today?',
      sources: 'St. Berchmans College AI & DS Department',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID on mount
  useEffect(() => {
    if (!sessionId) {
      setSessionId(`session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
    }
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setRateLimited(null);

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: query.trim(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    const assistantMsgId = `ast_${Date.now()}`;

    try {
      // Build API messages payload
      const payloadMessages = newMessages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages.length > 0 ? payloadMessages : [{ role: 'user', content: query.trim() }],
          sessionId,
        }),
      });

      // Handle Rate Limiting (429)
      if (res.status === 429) {
        const errorData = await res.json();
        const limitMsg = errorData.message || 'Too many chat requests. Please wait a moment before asking another question.';
        setRateLimited(limitMsg);
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: 'assistant',
            text: limitMsg,
            sources: 'System Rate Limiter',
          },
        ]);
        setLoading(false);
        return;
      }

      const contentType = res.headers.get('content-type') || '';

      // If JSON response (non-stream fallback or error message)
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.sessionId) setSessionId(data.sessionId);

        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: 'assistant',
            text: data.reply || data.message || 'I could not process your query.',
            sources: data.sources || 'Official Department Records',
          },
        ]);
        setLoading(false);
        return;
      }

      // Handle Streaming Text Response
      if (!res.body) {
        throw new Error('No response stream body available');
      }

      // Create placeholder assistant message for incoming stream
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          text: '',
          sources: 'St. Berchmans College AI & DS Database',
          isStreaming: true,
        },
      ]);
      setLoading(false);

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        // Vercel AI SDK text stream chunk cleaning (strips 0:"..." data stream prefixes if present)
        let cleanedChunk = chunk;
        if (chunk.startsWith('0:')) {
          cleanedChunk = chunk
            .split('\n')
            .filter((line) => line.startsWith('0:'))
            .map((line) => {
              try {
                return JSON.parse(line.substring(2));
              } catch {
                return line.substring(2);
              }
            })
            .join('');
        }

        accumulatedText += cleanedChunk;

        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, text: accumulatedText, isStreaming: true } : msg))
        );
      }

      // Mark streaming complete
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg))
      );
    } catch (err: any) {
      console.error('ChatWidget error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: 'Unable to connect to department AI assistant. Please contact aids@sbcollege.ac.in or call +91 9961231314.',
          sources: 'System Error Handler',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Department Assistant Chat"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          background: '#1C1917',
          color: '#FFFFFF',
          border: '2px solid #FDB27C',
          borderRadius: '50px',
          padding: '12px 20px',
          boxShadow: '0 8px 24px rgba(28, 25, 23, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          cursor: 'pointer',
          fontSize: '0.9rem',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#4ade80',
            display: 'inline-block',
            boxShadow: '0 0 8px #4ade80',
          }}
        />
        AI Dept Assistant
      </button>

      {/* Slide-Up Chat Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '84px',
            right: '24px',
            width: '390px',
            maxWidth: '92vw',
            height: '540px',
            maxHeight: '80vh',
            background: '#FFFFFF',
            borderRadius: '20px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.22)',
            border: '1px solid #EFEAE3',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Drawer Header */}
          <div
            style={{
              background: '#1C1917',
              color: '#FFFFFF',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #FDB27C',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
                SBC AI & DS Department Assistant
              </div>
              <div style={{ fontSize: '0.75rem', color: '#FDB27C', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.65rem' }}>●</span> Grounded on Live Department Data
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
              style={{
                background: 'none',
                border: 'none',
                color: '#EFEAE3',
                fontSize: '1.5rem',
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>

          {/* Quick Prompts */}
          <div
            style={{
              padding: '10px 14px',
              background: '#FBF9F7',
              borderBottom: '1px solid #EFEAE3',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
            }}
          >
            <button
              onClick={() => handleSend('Who is the HOD and faculty members?')}
              style={{
                padding: '4px 10px',
                background: '#FFFFFF',
                border: '1px solid #EFEAE3',
                borderRadius: '12px',
                fontSize: '0.75rem',
                color: '#1C1917',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Faculty List
            </button>
            <button
              onClick={() => handleSend('What subjects are in the AI & DS curriculum?')}
              style={{
                padding: '4px 10px',
                background: '#FFFFFF',
                border: '1px solid #EFEAE3',
                borderRadius: '12px',
                fontSize: '0.75rem',
                color: '#1C1917',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Curriculum
            </button>
            <button
              onClick={() => handleSend('How can I contact the department for admissions?')}
              style={{
                padding: '4px 10px',
                background: '#FFFFFF',
                border: '1px solid #EFEAE3',
                borderRadius: '12px',
                fontSize: '0.75rem',
                color: '#1C1917',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Admissions
            </button>
          </div>

          {/* Rate Limit Alert Banner */}
          {rateLimited && (
            <div
              style={{
                padding: '8px 14px',
                background: '#FEF2F2',
                color: '#991B1B',
                fontSize: '0.78rem',
                borderBottom: '1px solid #FCA5A5',
              }}
            >
              ⚠️ {rateLimited}
            </div>
          )}

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: m.role === 'user' ? '#1C1917' : '#FBF9F7',
                  color: m.role === 'user' ? '#FFFFFF' : '#1C1917',
                  fontSize: '0.86rem',
                  border: m.role === 'assistant' ? '1px solid #EFEAE3' : 'none',
                  lineHeight: '1.45',
                  boxShadow: m.role === 'user' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {m.text || (m.isStreaming ? '...' : '')}
                {m.sources && m.text && (
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: m.role === 'user' ? '#D6D3D1' : '#756860',
                      marginTop: '6px',
                      borderTop: `1px solid ${m.role === 'user' ? '#44403C' : '#EFEAE3'}`,
                      paddingTop: '4px',
                    }}
                  >
                    Source: {m.sources}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '8px 12px',
                  background: '#FBF9F7',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  color: '#756860',
                  border: '1px solid #EFEAE3',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span className="animate-pulse">●</span> Consulting official department database...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '12px',
              borderTop: '1px solid #EFEAE3',
              display: 'flex',
              gap: '8px',
              background: '#FFFFFF',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about faculty, courses, events..."
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1.5px solid #EFEAE3',
                borderRadius: '20px',
                fontSize: '0.86rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: '8px 16px',
                background: loading || !input.trim() ? '#756860' : '#1C1917',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
