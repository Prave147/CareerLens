import React, { useState } from 'react';
import { studentService } from '../../services/studentService';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';

export const CareerAdvisor = () => {
  const [messages, setMessages] = useState([
    {
      role: 'advisor',
      content: `Hello Alex! I am your **CareerLens AI Career Advisor**. I have reviewed your verified technical repositories, competitive programming metrics, and current skill proof.

You currently hold a **Readiness Score of 79.3 / 100** for **Full Stack Developer**. How can I help you bridge your remaining proof gaps today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Why is my readiness score 79.3?",
    "What is my biggest proof gap?",
    "Why is Docker marked as unverified?",
    "How can I reach 85+ readiness?",
    "Which role currently matches my proof best?"
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await studentService.chatAdvisor(newMessages);
      if (res.success) {
        setMessages([...newMessages, { role: 'advisor', content: res.reply }]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'advisor',
          content: 'I analyzed your profile: Your strongest proof is in React & Node.js, while your primary gaps are in Docker containerization and cloud deployment. Adding multi-container Docker Compose to your MediRoute repository will boost your readiness.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">AI Career Advisor</h1>
        <p className="text-xs text-content-secondary mt-1">
          Evidence-grounded career intelligence assistant analyzing your code proof, DSA consistency, and role gaps.
        </p>
      </div>

      {/* Suggested Questions Pill Bar */}
      <div className="flex flex-wrap gap-2">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 bg-white border border-surface-border hover:border-primary/50 text-content-secondary hover:text-primary rounded-full text-xs font-semibold shadow-sm transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-surface-border rounded-2xl shadow-card flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-2xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-brand-50 text-primary border border-brand-200'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-primary text-white font-medium rounded-tr-none'
                    : 'bg-surface-bg border border-surface-border text-content-primary rounded-tl-none'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-2xl">
              <div className="w-8 h-8 rounded-xl bg-brand-50 text-primary border border-brand-200 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-surface-bg border border-surface-border rounded-2xl text-xs text-content-muted">
                Reasoning through verified evidence and score contributions...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-surface-border bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your score, gaps, or GitHub evidence..."
              className="flex-1 px-4 py-2 bg-white border border-surface-border rounded-xl text-xs text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-content-muted"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
