import React, { useState, useEffect } from 'react';
import {
  Target,
  Sparkles,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  Flame,
  Award,
  RefreshCw
} from 'lucide-react';
import { AnswerEvaluationResult, InterviewQuestion } from '../types';

interface AnswerEvaluatorProps {
  initialQuestion?: InterviewQuestion | null;
  interviewerTitle: string;
  candidateRole: string;
}

export const AnswerEvaluator: React.FC<AnswerEvaluatorProps> = ({
  initialQuestion,
  interviewerTitle,
  candidateRole,
}) => {
  const [questionText, setQuestionText] = useState(
    initialQuestion?.question ||
      'Büyük bir teknik borç (technical debt) veya teslimat kriziyle karşılaştığınız bir durumu ve bunu nasıl yönettiğinizi anlatır mısınız?'
  );
  const [targetTitle, setTargetTitle] = useState(interviewerTitle || 'Engineering Manager');
  const [targetRole, setTargetRole] = useState(candidateRole || 'Senior Frontend Engineer');
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerEvaluationResult | null>(null);

  // Sync if initialQuestion changed from outside
  useEffect(() => {
    if (initialQuestion) {
      setQuestionText(initialQuestion.question);
    }
  }, [initialQuestion]);

  useEffect(() => {
    if (interviewerTitle) setTargetTitle(interviewerTitle);
    if (candidateRole) setTargetRole(candidateRole);
  }, [interviewerTitle, candidateRole]);

  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!questionText.trim() || !candidateAnswer.trim() || !targetTitle.trim()) {
      setError('Lütfen soru, mülakatçı unvanı ve cevabınızı girin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/interview/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          interviewerTitle: targetTitle,
          candidateAnswer,
          candidateRole: targetRole,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Cevap değerlendirilemedi.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Değerlendirme sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillSampleDraftAnswer = () => {
    setCandidateAnswer(
      `Geçen yıl çalıştığım projede canlıya çıkışa 2 hafta kala ciddi performans sorunları yaşamıştık. Sayfa yükleme süreleri 6 saniyenin üzerine çıkmıştı. Ben hemen ekiple konuştum ve sorunun büyük state nesnelerinin gereksiz yeniden render edilmesinden kaynaklandığını fark ettim. Hafta sonu fazla mesai yaparak bundle boyutunu küçülttüm, memoization ekledim ve sorunu çözdük. Ürün zamanında yayına girdi ve müşteri memnundu.`
    );
  };

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
            <Target className="w-3.5 h-3.5" />
            İnteraktif Cevap Simülatörü & Mülakatçı Gözü
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cevabınızı Yazın, Mülakatçı Gözüyle Not & Revizyon Alın
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Mülakat sorusuna kendi yanıtınızı yazın. Ajan, seçtiğiniz unvandaki kişinin (örn: <strong>{targetTitle}</strong>) masada otururken cevabınızı nasıl yorumlayacağını, hangi zayıf noktalara takılacağını analiz etsin ve yanıtınızı <strong>STAR metoduna uygun kusursuz bir versiyona</strong> dönüştürsün.
          </p>
        </div>
      </div>

      {/* Simulator Input Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <form onSubmit={handleEvaluate} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mülakatı Yapan Unvan (Interviewer Title)
              </label>
              <input
                type="text"
                value={targetTitle}
                onChange={(e) => setTargetTitle(e.target.value)}
                placeholder="örn: Engineering Manager, VP of Tech, HR..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs sm:text-sm focus:ring-1 focus:ring-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hedef Pozisyonunuz
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="örn: Senior Frontend Engineer"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs sm:text-sm focus:ring-1 focus:ring-sky-500"
                required
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-200">
              Mülakat Sorusu <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Mülakatta sorulacak soruyu buraya yazın..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          {/* Candidate Answer */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-200">
                Sizin Vereceğiniz Cevap (Taslak) <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={handleFillSampleDraftAnswer}
                className="text-xs text-sky-400 hover:text-sky-300 underline cursor-pointer"
              >
                Taslak Örnek Cevap Doldur
              </button>
            </div>
            <textarea
              rows={5}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="Bu soruya mülakatta nasıl cevap verirdiniz? Kendi deneyiminizi, attığınız adımları ve sonucu doğal dilinizle yazın..."
              className="w-full p-4 rounded-xl bg-slate-950/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm leading-relaxed focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-600/30 hover:shadow-sky-600/50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>{targetTitle} Zihniyetiyle Değerlendiriliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Cevabı {targetTitle} Gözüyle Değerlendir</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Evaluation Results */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Score & Verdict Card */}
          <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-sky-600/20 border border-sky-500/40 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-sky-300">{result.score}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">/ 100</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">Değerlendirme:</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        result.score >= 80
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : result.score >= 60
                          ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {result.verdict}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {targetTitle} Masadaki İzlenimi
                  </h3>
                </div>
              </div>
            </div>

            {/* Interviewer Inner Voice */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Mülakatçının İç Sesi (Cevabınızı Dinlerken Kafasından Geçenler)
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                "{result.interviewerImpression}"
              </p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Cevabınızdaki Güçlü Noktalar
                </h5>
                <div className="space-y-1.5">
                  {result.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Eksik Kalan / Geliştirilmesi Gerekenler
                </h5>
                <div className="space-y-1.5">
                  {result.areasToImprove.map((a, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                      <span className="text-amber-400 font-bold shrink-0">!</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* THE REWRITTEN STAR VERSION (GOLD STANDARD) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-950 to-slate-950 border border-indigo-500/40 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Cilalanmış & STAR Formatına Sokulmuş Kusursuz Versiyon
                </h4>
                <span className="text-[10px] text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  Model Cevap
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed whitespace-pre-line bg-slate-900/80 p-4 rounded-xl border border-slate-800 font-normal">
                {result.rewrittenStarAnswer}
              </p>
            </div>

            {/* Follow-up trap question */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-rose-400" />
                Mülakatçının Bu Cevaptan Sonra Sorabileceği Tuzak Takip Sorusu
              </h5>
              <p className="text-xs sm:text-sm text-slate-200 font-semibold">
                "{result.followUpTrapQuestion}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
