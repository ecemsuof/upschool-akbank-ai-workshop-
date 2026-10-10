import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  BookOpen,
  Target,
  Clock,
  Compass,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Award,
  Layers,
  Copy,
  Check,
  FileText
} from 'lucide-react';
import { TrainingItem, TrainingAnalysisResult } from '../types';

interface TrainingAnalyzerProps {
  trainings: TrainingItem[];
  setTrainings: React.Dispatch<React.SetStateAction<TrainingItem[]>>;
  rawTrainingsText: string;
  setRawTrainingsText: (val: string) => void;
  targetCareerGoal: string;
  setTargetCareerGoal: (val: string) => void;
  currentRole: string;
  setCurrentRole: (val: string) => void;
  experienceLevel: string;
  setExperienceLevel: (val: string) => void;
  result: TrainingAnalysisResult | null;
  setResult: (res: TrainingAnalysisResult | null) => void;
}

export const TrainingAnalyzer: React.FC<TrainingAnalyzerProps> = ({
  trainings,
  setTrainings,
  rawTrainingsText,
  setRawTrainingsText,
  targetCareerGoal,
  setTargetCareerGoal,
  currentRole,
  setCurrentRole,
  experienceLevel,
  setExperienceLevel,
  result,
  setResult,
}) => {
  const [inputMode, setInputMode] = useState<'cards' | 'text'>('cards');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAddTraining = () => {
    const newItem: TrainingItem = {
      id: Date.now().toString(),
      title: '',
      provider: '',
      topics: '',
      skills: '',
      year: new Date().getFullYear().toString(),
    };
    setTrainings([...trainings, newItem]);
  };

  const handleRemoveTraining = (id: string) => {
    setTrainings(trainings.filter((t) => t.id !== id));
  };

  const handleUpdateTraining = (id: string, field: keyof TrainingItem, val: string) => {
    setTrainings(
      trainings.map((t) => (t.id === id ? { ...t, [field]: val } : t))
    );
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (inputMode === 'cards' && trainings.length === 0) {
      setError('Lütfen en az bir adet katıldığınız eğitim bilgisi ekleyin.');
      return;
    }
    if (inputMode === 'text' && !rawTrainingsText.trim()) {
      setError('Lütfen katıldığınız eğitimlerin metnini / müfredatını girin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/career/analyze-trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainingsList: inputMode === 'cards' ? trainings : [],
          trainingsText: inputMode === 'text' ? rawTrainingsText : '',
          targetCareerGoal,
          currentRole,
          experienceLevel,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Eğitim analizi yapılamadı.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Analiz sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const textToCopy = `MEVCUT EĞİTİM & YETKİNLİK PROFİLİ
Özet: ${result.currentSkillProfile.summary}
Kazanılan Beceriler: ${result.currentSkillProfile.masteredSkills.join(', ')}
Hazır Bulunuşluk Skoru: %${result.currentSkillProfile.readinessScoreForNextLevel}

EKSİK YETKİNLİKLER (GAPS):
${result.gapAnalysis.criticalGaps.map((g) => `- ${g}`).join('\n')}
Neden Mevcut Eğitimler Yetmiyor: ${result.gapAnalysis.whyCurrentTrainingsAreNotEnough}

BİR SONRAKİ ADIM İÇİN ÖNERİLEN EĞİTİMLER:
${result.recommendedNextTrainings
  .map(
    (t, i) => `
${i + 1}. [${t.priority}] ${t.title} (${t.category})
- Neden Gerekli?: ${t.reasoning}
- Zorunlu Müfredat Modülleri: ${t.mustHaveSyllabusModules.join(', ')}
- Önerilen Platformlar/Sertifikalar: ${t.recommendedPlatformsOrCerts.join(', ')}
- Süre: ${t.estimatedDuration}
- Örnek Bitirme Projesi: ${t.capstoneProjectRecommendation}`
  )
  .join('\n')}

3 FAZLI YOL HARİTASI:
${result.learningRoadmapPhases
  .map(
    (p) => `${p.phase} (${p.timeframe}): ${p.mainGoal}\n${p.actionItems.map((a) => `  * ${a}`).join('\n')}`
  )
  .join('\n')}

MENTOR TAVSİYESİ: ${result.mentorshipAdvice}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            Müfredat Analizi & Bir Sonraki Adım Pusulası
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Katıldığınız Eğitimlerden Bir Sonraki Seviyeye
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Bugüne kadar aldığınız bootcamp, sertifika ve kursların içeriklerini verin. Ajan, bu eğitimlerin kazandırdığı güçlü yönleri tespit etsin, hedef pozisyonunuz için <strong>eksik kalan kritik halkaları</strong> belirlesin ve <strong>"bir sonraki adımda tam olarak nasıl bir eğitim almanız gerektiğini"</strong> müfredatıyla çıkarsın.
          </p>
        </div>
      </div>

      {/* Main Input Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-b border-slate-800/80 pb-6">
          {/* Target Career Goal */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-200">
              Hedeflediğiniz Kariyer Pozisyonu / Seviye <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={targetCareerGoal}
              onChange={(e) => setTargetCareerGoal(e.target.value)}
              placeholder="örn: Senior Full-Stack Engineer, Machine Learning Specialist, Tech Lead..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              required
            />
            <p className="text-[11px] text-slate-400">
              Eğitim açığı analizi tam olarak bu unvanın sektör beklentilerine göre yapılacaktır.
            </p>
          </div>

          {/* Current Role */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-200">
              Mevcut Unvanınız & Deneyim
            </label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="örn: Frontend Dev (2 Yıl), Junior Analist..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
          </div>
        </div>

        {/* Training Inputs Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-400" />
                Katıldığınız Eğitimlerin İçerikleri ve Müfredatı
              </h3>
              <p className="text-xs text-slate-400">
                Kurs başlığı, aldığınız kurum, işlenen temel modüller ve kazandığınız beceriler.
              </p>
            </div>

            {/* Input Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setInputMode('cards')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  inputMode === 'cards'
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Kartlarla Ekle ({trainings.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  inputMode === 'text'
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Serbest Metin / CV Yapıştır</span>
              </button>
            </div>
          </div>

          {/* Cards Mode */}
          {inputMode === 'cards' && (
            <div className="space-y-4">
              {trainings.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 relative group hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-400 px-2.5 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20">
                      Eğitim #{index + 1}
                    </span>
                    {trainings.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTraining(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Bu Eğitimi Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Eğitim / Kurs Adı
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateTraining(item.id, 'title', e.target.value)}
                        placeholder="örn: Modern React & TypeScript Bootcamp"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Kurum / Platform
                      </label>
                      <input
                        type="text"
                        value={item.provider || ''}
                        onChange={(e) => handleUpdateTraining(item.id, 'provider', e.target.value)}
                        placeholder="örn: Udemy, Coursera, Patika..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        İşlenen Konular & Müfredat İçeriği
                      </label>
                      <textarea
                        rows={2}
                        value={item.topics || ''}
                        onChange={(e) => handleUpdateTraining(item.id, 'topics', e.target.value)}
                        placeholder="örn: State management (Redux), Custom Hooks, REST API entegrasyonu, Jest ile testler..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Kazanılan Temel Beceriler / Araçlar
                      </label>
                      <textarea
                        rows={2}
                        value={item.skills || ''}
                        onChange={(e) => handleUpdateTraining(item.id, 'skills', e.target.value)}
                        placeholder="örn: React 18, TypeScript, Redux Toolkit, Tailwind, Clean Code..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddTraining}
                className="w-full py-3 rounded-xl border border-dashed border-slate-700 hover:border-violet-500/50 bg-slate-950/40 hover:bg-violet-950/20 text-slate-400 hover:text-violet-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Bir Eğitim Daha Ekle</span>
              </button>
            </div>
          )}

          {/* Text Area Mode */}
          {inputMode === 'text' && (
            <div className="space-y-2">
              <textarea
                rows={7}
                value={rawTrainingsText}
                onChange={(e) => setRawTrainingsText(e.target.value)}
                placeholder="Örnek:
1. Full-Stack Web Development Bootcamp (Patika): Node.js, Express REST API, MongoDB, JWT Auth.
2. React & TypeScript Masterclass (Udemy): Hooks, Redux Toolkit, Typescript generics.
3. Temel Docker & CI/CD Pipeline (Coursera): Dockerfile, Compose, GitHub Actions."
                className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <p className="text-[11px] text-slate-400">
                Eğitimlerinizin müfredatını, sertifika listesini veya CV'nizdeki eğitim bölümünü doğrudan buraya yapıştırabilirsiniz.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Müfredat Analiz Ediliyor ve Yol Haritası Çıkarılıyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Eğitim İçeriklerini Analiz Et & Sonraki Adımı Söyle</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Current Skill Profile & Gap Analysis Overview */}
          <div className="bg-slate-900/90 border border-violet-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
                  Müfredat Değerlendirmesi
                </span>
                <h3 className="text-xl font-bold text-white">
                  Mevcut Yetkinlik Karnesi & Hedef Analizi
                </h3>
              </div>

              <button
                onClick={handleCopyReport}
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
                    <span>Raporu Kopyala</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
              {/* Summary and readiness score */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Genel Durum Özeti
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Hedefe Hazır Bulunuşluk:</span>
                      <span className="text-sm font-bold text-emerald-400">
                        %{result.currentSkillProfile.readinessScoreForNextLevel}
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${result.currentSkillProfile.readinessScoreForNextLevel}%` }}
                    />
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed pt-1">
                    {result.currentSkillProfile.summary}
                  </p>
                </div>

                {/* Mastered Skills Chips */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Tamamlanan Eğitimlerin Kazandırdığı Sağlam Kaslar
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.currentSkillProfile.masteredSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Critical Gaps */}
              <div className="bg-slate-950/70 p-5 rounded-xl border border-amber-900/40 space-y-3">
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Kritik Yetkinlik Açıkları (Skill Gaps)
                </h4>
                <p className="text-xs text-slate-300">
                  {result.gapAnalysis.whyCurrentTrainingsAreNotEnough}
                </p>
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  {result.gapAnalysis.criticalGaps.map((gap, i) => (
                    <div
                      key={i}
                      className="text-xs text-amber-200/90 bg-amber-950/20 p-2 rounded-lg border border-amber-900/40 flex items-start gap-1.5"
                    >
                      <span className="text-amber-400 font-bold shrink-0">!</span>
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* THE CORE DELIVERABLE: RECOMMENDED NEXT TRAININGS */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                Stratejik Cevap
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 mt-1">
                <Compass className="w-6 h-6 text-violet-400" />
                Bir Sonraki Adım İçin Almanız Gereken Eğitimler ({result.recommendedNextTrainings.length})
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Mevcut eğitimlerinizin üzerine inşa edilmesi gereken nokta atışı eğitim modülleri, müfredat içeriği ve kanıtlayıcı projeler.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {result.recommendedNextTrainings.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 hover:border-violet-500/40 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5 transition-all"
                >
                  {/* Top Bar with Priority */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                            rec.priority.includes('Acil') || rec.priority.includes('Kritik') || rec.priority.includes('1.')
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : 'bg-violet-500/10 text-violet-300 border-violet-500/30'
                          }`}
                        >
                          {rec.priority}
                        </span>
                        <span className="text-xs font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                          {rec.category}
                        </span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-white pt-1">
                        {rec.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Tahmini Süre: {rec.estimatedDuration}</span>
                    </div>
                  </div>

                  {/* Why this training? */}
                  <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-900/40 space-y-1.5">
                    <h5 className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-violet-400" />
                      Neden Geçmiş Eğitimlerin Üstüne Tam Olarak Bu Eğitim?
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                      {rec.reasoning}
                    </p>
                  </div>

                  {/* Syllabus Modules & Recommended Platforms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Must-have modules */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-indigo-400" />
                        Bu Eğitimin Müfredatında Kesinlikle Olması Gerekenler:
                      </h5>
                      <div className="space-y-1.5 pt-1">
                        {rec.mustHaveSyllabusModules.map((mod, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="text-indigo-400 font-bold shrink-0">✦</span>
                            <span>{mod}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Platforms & Certifications */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-400" />
                        Önerilen Platformlar / Sertifikalar:
                      </h5>
                      <div className="space-y-1.5 pt-1">
                        {rec.recommendedPlatformsOrCerts.map((cert, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="text-emerald-400 font-bold shrink-0">✓</span>
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Capstone Project Recommendation */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-sky-500/10 via-slate-900 to-transparent border border-sky-500/30">
                    <h5 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Target className="w-4 h-4 text-sky-400" />
                      Bu Eğitimi Mülakatta Kanıtlayacak Bitirme / Portfolyo Projesi (Capstone)
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-200">
                      {rec.capstoneProjectRecommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Phase Roadmap */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Zaman Çizelgesi
              </span>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
                <Calendar className="w-5 h-5 text-emerald-400" />
                3 Fazlı Kariyer ve Gelişim Yol Haritası
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {result.learningRoadmapPhases.map((phase, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                        {phase.phase}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{phase.timeframe}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white pt-1">{phase.mainGoal}</h4>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {phase.actionItems.map((act, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <span className="text-indigo-400 font-bold shrink-0">•</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mentor advice quote */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm text-slate-300 italic border-l-4 border-l-violet-500">
              "{result.mentorshipAdvice}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
