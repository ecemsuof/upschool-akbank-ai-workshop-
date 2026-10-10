import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  HelpCircle,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Send,
  Copy,
  Check,
  Lightbulb,
  Briefcase,
  Layers,
  ArrowRight,
  Filter,
  Flame,
  Award
} from 'lucide-react';
import { InterviewGenerationResult, InterviewQuestion } from '../types';

interface InterviewGeneratorProps {
  interviewerTitle: string;
  setInterviewerTitle: (val: string) => void;
  candidateRole: string;
  setCandidateRole: (val: string) => void;
  experienceLevel: string;
  setExperienceLevel: (val: string) => void;
  companyOrIndustry: string;
  setCompanyOrIndustry: (val: string) => void;
  interviewType: string;
  setInterviewType: (val: string) => void;
  focusNotes: string;
  setFocusNotes: (val: string) => void;
  result: InterviewGenerationResult | null;
  setResult: (res: InterviewGenerationResult | null) => void;
  onPracticeQuestion: (question: InterviewQuestion) => void;
}

const COMMON_TITLES = [
  'Engineering Manager',
  'VP of Tech / CTO',
  'Head of Product (CPO)',
  'HR / Talent Partner',
  'Senior Tech Lead',
  'Lead Data Scientist',
  'Founder / Co-Founder',
  'Scrum Master / Agile Coach',
];

const EXPERIENCE_LEVELS = [
  'Junior (0-2 Yıl)',
  'Mid-Level (2-4 Yıl)',
  'Senior (5+ Yıl)',
  'Staff / Principal',
  'Ekip Lideri / Yönetici',
];

const INTERVIEW_FORMATS = [
  'Kapsamlı Mülakat (Teknik + Davranışsal)',
  'Davranışsal & Kültür Uyumu (STAR Metodu)',
  'Teknik Derinlik & Mimari Tasarım',
  'Vaka / Problem Çözme & Senaryo',
  'Yönetici & Vizyon Mülakatı',
];

export const InterviewGenerator: React.FC<InterviewGeneratorProps> = ({
  interviewerTitle,
  setInterviewerTitle,
  candidateRole,
  setCandidateRole,
  experienceLevel,
  setExperienceLevel,
  companyOrIndustry,
  setCompanyOrIndustry,
  interviewType,
  setInterviewType,
  focusNotes,
  setFocusNotes,
  result,
  setResult,
  onPracticeQuestion,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!interviewerTitle.trim() || !candidateRole.trim()) {
      setError('Lütfen mülakatçı unvanı ve başvurulan pozisyon alanlarını doldurun.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerTitle,
          candidateRole,
          experienceLevel,
          companyOrIndustry,
          interviewType,
          focusNotes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Sorular üretilemedi.');
      }

      setResult(data);
      if (data.questions && data.questions.length > 0) {
        setExpandedQuestionId(data.questions[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (!result) return;
    const textToCopy = `Mülakatçı Unvanı: ${result.interviewerPersona.title}
Hedef Pozisyon: ${candidateRole} (${experienceLevel})
Mülakatçının Zihniyeti: ${result.interviewerPersona.mindset}
Altın Taktik: ${result.interviewerPersona.proTipForCandidate}

--- POTANSİYEL SORULAR ---
${result.questions
  .map(
    (q, i) => `
${i + 1}. [${q.category} - ${q.difficulty}] ${q.question}
• Neden Bu Title Sorar?: ${q.whyTheyAskThis}
• Önerilen Model: ${q.suggestedFramework}
• Vurgulanacaklar: ${q.keyPointsToHighlight.join(', ')}
• Örnek Cevap: ${q.sampleAnswer}
• Kırmızı Bayraklar: ${q.redFlagsToAvoid.join('; ')}`
  )
  .join('\n')}

--- MÜLAKATÇIYA SORULACAK TERS SORULAR ---
${result.interviewerSpecificQuestionsToAsk
  .map((rq, i) => `${i + 1}. Soru: ${rq.question}\n   Amaç: ${rq.whyAskThis}`)
  .join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = result
    ? ['Tümü', ...Array.from(new Set(result.questions.map((q) => q.category)))]
    : ['Tümü'];

  const filteredQuestions = result
    ? selectedCategory === 'Tümü'
      ? result.questions
      : result.questions.filter((q) => q.category === selectedCategory)
    : [];

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Unvan Odaklı Soru Simülasyonu
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mülakatı Yapan Kişinin Unvanına Göre Hazırlanın
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Aynı pozisyon için bir <strong>Engineering Manager</strong> teslimat güvenilirliği ve kod disiplini sorarken, bir <strong>CTO</strong> ölçeklenebilirlik ve mimari vizyonu, bir <strong>HR Partner</strong> ise kriz yönetimi ve motivasyonu sorgular. Katılımcının unvanını girin; ajanın o kişinin zihniyetini deşifre etmesini sağlayın.
          </p>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interviewer Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">
                Mülakatı Yapacak Kişinin Unvanı (Interviewer Title) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={interviewerTitle}
                  onChange={(e) => setInterviewerTitle(e.target.value)}
                  placeholder="örn: Engineering Manager, VP of Tech, CPO, HR Lead..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                  required
                />
              </div>

              {/* Title Quick Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-xs text-slate-500 py-0.5">Önerilenler:</span>
                {COMMON_TITLES.map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setInterviewerTitle(title)}
                    className={`text-xs px-2.5 py-0.5 rounded-md transition-all ${
                      interviewerTitle.toLowerCase() === title.toLowerCase()
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                    }`}
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>

            {/* Candidate Role */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">
                Başvurulan Pozisyon (Candidate Target Role) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={candidateRole}
                onChange={(e) => setCandidateRole(e.target.value)}
                placeholder="örn: Senior Frontend Developer, Data Analyst, Product Manager..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                required
              />
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">
                Deneyim Seviyeniz
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl} className="bg-slate-900">
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Company / Industry */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">
                Şirket Türü / Sektör (Opsiyonel)
              </label>
              <input
                type="text"
                value={companyOrIndustry}
                onChange={(e) => setCompanyOrIndustry(e.target.value)}
                placeholder="örn: B2B FinTech SaaS, E-Ticaret, Kurumsal Banka, Startup..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
              />
            </div>

            {/* Interview Format */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-200">
                Mülakat Formatı & Ağırlığı
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {INTERVIEW_FORMATS.map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => setInterviewType(format)}
                    className={`p-2.5 rounded-xl text-xs text-left border transition-all ${
                      interviewType === format
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold shadow-sm'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra Focus Notes */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-200">
                Özel Odak veya Kaygılarınız (Opsiyonel)
              </label>
              <input
                type="text"
                value={focusNotes}
                onChange={(e) => setFocusNotes(e.target.value)}
                placeholder="örn: Bootcampten mezun oldum teorim iyi ama büyük ölçekli tecrübem az, bunu nasıl dengelerim?"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Mülakatçı Zihniyeti ve Sorular Analiz Ediliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Potansiyel Soruları ve Stratejiyi Üret</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Interviewer Persona Card */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    Mülakatçı Persona Analizi
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {result.interviewerPersona.title} Gözünden Mülakat
                  </h3>
                </div>
              </div>

              <button
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all self-start md:self-auto cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Tüm Raporu Kopyala</span>
                  </>
                )}
              </button>
            </div>

            {/* Mindset & Evaluation Criteria */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Bu Kişinin Masadaki Zihniyeti & Asıl Kaygısı
                  </h4>
                  <p className="text-slate-200 text-sm leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    {result.interviewerPersona.mindset}
                  </p>
                </div>

                {/* Pro Tip */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-500/30">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Bu Unvana Karşı Altın Taktik (Pro Tip)
                  </h4>
                  <p className="text-sm text-slate-200 font-medium">
                    {result.interviewerPersona.proTipForCandidate}
                  </p>
                </div>
              </div>

              {/* Key Criteria */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  En Çok Aradığı 4 Kriter
                </h4>
                <div className="space-y-2">
                  {result.interviewerPersona.keyEvaluationCriteria.map((criterion, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {i + 1}
                      </span>
                      <span className="leading-tight pt-0.5">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section Header & Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-400" />
                  {result.interviewerPersona.title} Tarafından Gelebilecek Potansiyel Sorular ({result.questions.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Her sorunun arkasındaki gizli niyet, önerilen yanıt çerçevesi ve model cevap senaryosu.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => {
                const isExpanded = expandedQuestionId === q.id;

                return (
                  <div
                    key={q.id || idx}
                    className={`rounded-2xl border transition-all ${
                      isExpanded
                        ? 'bg-slate-900/95 border-indigo-500/50 shadow-xl shadow-indigo-950/20'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-medium text-slate-300 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                            {q.category}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-md font-medium border ${
                              q.difficulty === 'İleri Seviye'
                                ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                                : q.difficulty === 'Orta'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                          "{q.question}"
                        </h4>

                        {!isExpanded && (
                          <p className="text-xs text-slate-400 line-clamp-1">
                            🎯 <strong>Neden sorar:</strong> {q.whyTheyAskThis}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPracticeQuestion(q);
                          }}
                          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold transition-all cursor-pointer"
                          title="Cevabımı Simülatörde Dene"
                        >
                          <span>Cevabımı Dene</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-5 pb-6 pt-1 border-t border-slate-800/80 space-y-5 animate-fadeIn">
                        {/* Why they ask this */}
                        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                            <TargetIcon className="w-4 h-4" />
                            Bu Unvan Neden Bu Soruyu Sorar? (Gizli Beklenti)
                          </h5>
                          <p className="text-sm text-slate-200 leading-relaxed">{q.whyTheyAskThis}</p>
                          <div className="pt-1 text-xs text-slate-400">
                            <strong>Değerlendirme Kriteri:</strong> {q.evaluationCriteria}
                          </div>
                        </div>

                        {/* Framework & Key Points */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                              <Layers className="w-4 h-4" />
                              Önerilen Yanıt Çerçevesi
                            </h5>
                            <p className="text-xs text-slate-300 font-medium">{q.suggestedFramework}</p>
                            <div className="pt-1 space-y-1">
                              <span className="text-[11px] font-semibold text-slate-400 block">
                                Mutlaka Vurgulanacak 3 Nokta:
                              </span>
                              {q.keyPointsToHighlight.map((pt, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                                  <span className="text-violet-400 font-bold">•</span>
                                  <span>{pt}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Red flags to avoid */}
                          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                              <ShieldAlert className="w-4 h-4" />
                              Ölümcül Kırmızı Bayraklar (Uzak Durun)
                            </h5>
                            <div className="space-y-1.5">
                              {q.redFlagsToAvoid.map((flag, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-xs text-rose-200/90">
                                  <span className="text-rose-400 font-bold">✕</span>
                                  <span>{flag}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Model Sample Answer */}
                        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <Check className="w-4 h-4" />
                            İdeal Model Cevap Senaryosu
                          </h5>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/60 p-3.5 rounded-lg border border-emerald-950 font-normal">
                            {q.sampleAnswer}
                          </p>
                        </div>

                        {/* Mobile Practice Button */}
                        <div className="flex sm:hidden justify-end">
                          <button
                            type="button"
                            onClick={() => onPracticeQuestion(q)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
                          >
                            <span>Bu Soruya Cevabımı Dene</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reverse Questions to Ask the Interviewer */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Mülakatın Sonunda Siz Sorun
              </span>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
                <Briefcase className="w-5 h-5 text-amber-400" />
                {result.interviewerPersona.title} Unvanına Sorabileceğiniz Stratejik Ters Sorular
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                "Bize sormak istediğiniz bir soru var mı?" dendiğinde bu sorular adayı sıradan bir başvuru sahibi değil, eşit düzeyde bir stratejik ortak gibi gösterir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {result.interviewerSpecificQuestionsToAsk.map((rq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      Soru #{idx + 1}
                    </span>
                    <p className="text-sm font-semibold text-white mt-2">"{rq.question}"</p>
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/60">
                    <strong className="text-slate-300">Neden İşe Yarar:</strong> {rq.whyAskThis}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TargetIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="9" strokeWidth="2" />
    <circle cx="12" cy="12" r="5" strokeWidth="2" />
    <circle cx="12" cy="12" r="1" strokeWidth="2" />
  </svg>
);
