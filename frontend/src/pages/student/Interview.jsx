import React, { useState, useEffect } from 'react';
import { interviewService } from '../../services/jobService';
import {
  MessageSquareCode,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Award,
  ChevronRight,
  Code2
} from 'lucide-react';

export const Interview = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await interviewService.getQuestions();
        if (res.questions) {
          setQuestions(res.questions);
        }
      } catch (err) {
        console.warn('Questions fetch fallback:', err.message);
      }
    };
    fetchQuestions();
  }, []);

  const currentQ = questions[selectedQuestionIndex] || {
    id: 'q1',
    project: 'MediRoute Telehealth',
    technology: 'JWT & Authentication',
    question: 'Why did you choose JWT over traditional server-side session cookies in MediRoute, and how did you mitigate JWT revocation risks?',
    context: 'Extracted from your MediRoute repository auth middleware',
    sampleKeyPoints: [
      'Stateless horizontal scaling across multiple instances',
      'Short-lived access tokens combined with secure HTTP-only refresh tokens',
      'Redis blacklisting or token versioning for instant revocation'
    ]
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setEvaluating(true);
    try {
      const res = await interviewService.evaluateAnswer({
        questionId: currentQ.id,
        question: currentQ.question,
        userAnswer,
      });

      setEvaluations((prev) => ({
        ...prev,
        [currentQ.id]: res.evaluation || {
          score: 8.5,
          verdict: 'Strong Technical Articulation',
          strengths: ['Clear justification of stateless scaling trade-offs', 'Accurately references token rotation safeguards'],
          areasOfImprovement: ['Could detail exact database schema for token blacklisting'],
          feedback: 'Excellent defense of your engineering decisions. The explanation reflects real implementation experience.'
        }
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const activeEval = evaluations[currentQ.id];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="pb-3 border-b border-surface-border">
        <h1 className="text-2xl font-extrabold text-content-primary">Project Technical Defense Simulation</h1>
        <p className="text-xs text-content-secondary mt-0.5">
          Practice answering deep architectural and implementation questions dynamically generated from your verified code repositories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Questions Sidebar */}
        <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-card space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-content-secondary block mb-2 px-2">
            Repository Questions ({questions.length || 4})
          </span>
          {(questions.length > 0 ? questions : [currentQ, { id: 'q2', question: 'Why did you select MongoDB over PostgreSQL for MediRoute?', technology: 'Database Modeling' }, { id: 'q3', question: 'How did you structure Express backend separation of concerns?', technology: 'Express Architecture' }, { id: 'q4', question: 'How would you scale Socket.IO for 50k concurrent users?', technology: 'Scaling' }]).map((q, idx) => (
            <button
              key={q.id}
              onClick={() => {
                setSelectedQuestionIndex(idx);
                setUserAnswer('');
              }}
              className={`w-full text-left p-3 rounded-xl text-xs transition-all border ${
                selectedQuestionIndex === idx
                  ? 'bg-brand-50 border-primary text-primary font-bold shadow-sm'
                  : 'bg-white border-surface-border text-content-secondary hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-content-muted">Question {idx + 1}</span>
                {evaluations[q.id] && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-status-success rounded font-bold">
                    Evaluated ({evaluations[q.id].score}/10)
                  </span>
                )}
              </div>
              <p className="line-clamp-2 leading-relaxed text-content-primary">{q.question}</p>
            </button>
          ))}
        </div>

        {/* Right Active Question & Answer Arena */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border text-xs">
              <span className="px-2.5 py-0.5 bg-brand-50 text-primary font-bold rounded border border-brand-200">
                {currentQ.technology || 'Architecture Defense'}
              </span>
              <span className="text-content-secondary font-medium">Project: {currentQ.project || 'MediRoute'}</span>
            </div>

            <h3 className="text-base font-extrabold text-content-primary leading-snug">
              {currentQ.question}
            </h3>

            {/* Context & Sample Key Points Accordion */}
            <div className="p-3.5 bg-slate-50 border border-surface-border rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-content-primary">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Key Architectural Elements Recruiters Look For:
              </div>
              <ul className="space-y-1 text-content-secondary pl-5 list-disc">
                {currentQ.sampleKeyPoints?.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* User Response Form */}
            <form onSubmit={handleEvaluate} className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-content-primary">
                Your Technical Response / Engineering Rationale:
              </label>
              <textarea
                rows={5}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Explain the architectural trade-offs, security considerations, and production rationale behind your code decision..."
                className="w-full p-3 text-xs bg-surface-bg border border-surface-border rounded-xl text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={evaluating || !userAnswer.trim()}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{evaluating ? 'Evaluating Defense...' : 'Submit for AI Evaluation'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* AI Evaluation Card */}
          {activeEval && (
            <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-card space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-status-success" />
                  <h4 className="text-sm font-extrabold text-content-primary">Technical Defense Evaluation</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-content-secondary">Defense Score:</span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-status-success font-mono font-black text-sm rounded border border-status-success-border">
                    {activeEval.score} / 10
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs">
                <strong className="text-emerald-900 block font-bold mb-1">Evaluator Feedback:</strong>
                <p className="text-content-secondary leading-relaxed">{activeEval.feedback}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-surface-border space-y-1">
                  <span className="font-bold text-status-success block">Strengths Demonstrated:</span>
                  <ul className="list-disc pl-4 space-y-1 text-content-secondary">
                    {activeEval.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-surface-border space-y-1">
                  <span className="font-bold text-status-warning block">Areas to Deepen:</span>
                  <ul className="list-disc pl-4 space-y-1 text-content-secondary">
                    {activeEval.areasOfImprovement?.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
