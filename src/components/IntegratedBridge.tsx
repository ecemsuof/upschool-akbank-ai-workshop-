import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { BridgeAuditResult, TrainingItem } from '../types';

interface IntegratedBridgeProps {
  trainings: TrainingItem[];
  rawTrainingsText: string;
  interviewerTitle: string;
  candidateRole: string;
}

export const IntegratedBridge: React.FC<IntegratedBridgeProps> = ({
  trainings,
  rawTrainingsText,
  interviewerTitle,
  candidateRole,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BridgeAuditResult | null>(null);

  const trainingsSummary =
    trainings.length > 0
      ? trainings
          .map((t) => `${t.title} (${t.provider || 'Platform'}): ${t.topics || ''} - ${t.skills || ''}`)
          .join('\n')
      : rawTrainingsText;

  const handleAudit = async () => {
    if (!trainingsSummary.trim() || !interviewerTitle.trim()) {
      setError('Lütfen önce eğitimlerinizi ve mülakatçı unvanını belirleyin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/integrated/bridge-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainingsSummary,
          interviewerTitle,
          candidateRole,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Köprü analizi yapılamadı.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Analiz sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            Bütünleşik Köprü Analizi
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Eğitim Geçmişiniz Bu Mülakatçı Karşısında Nasıl Duruyor?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Tamamladığınız eğitim içerikleri ile mülakatı yapacak olan <strong>{interviewerTitle || 'Mülakatçı'}</strong> unvanını çapraz eşleştirin. Bu unvan eğitim geçmişinizde neyi takdir eder, hangi boşluğunuzdan vurmaya çalışır ve eğitimlerinizi mülakatta nasıl sağlam bir avantaja çevirebilirsiniz?
          </p>
        </div>
      </div>

      {/* Snapshot Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold uppercase tracking-wider block">
              Mülakatı Yapacak Kişi:
            </span>
            <span className="text-white font-bold text-sm block">
              {interviewerTitle || 'Belirtilmedi'}
            </span>
            <span className="text-slate-500 block">Hedef: {candidateRole || 'Aday'}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold uppercase tracking-wider block">
              Değerlendirilecek Eğitimler:
            </span>
            <span className="text-white font-bold text-sm block">
              {trainings.length > 0 ? `${trainings.length} Adet Kayıtlı Eğitim` : 'Metin Olarak Girildi'}
            </span>
            <span className="text-slate-500 block truncate">
              {trainingsSummary ? trainingsSummary.substring(0, 80) + '...' : 'Henüz eğitim eklenmedi.'}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAudit}
            disabled={loading || !trainingsSummary.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Çapraz Eşleştirme Yapılıyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Eğitimlerim & Mülakatçı Köprüsünü Analiz Et</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          {/* Interviewer Appreciation */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-emerald-900/40 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {interviewerTitle} Bu Eğitim Geçmişinizde Neyi Takdir Eder?
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {result.interviewerLikelyAppreciation}
            </p>
          </div>

          {/* Vulnerabilities they will target */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-amber-900/40 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Bu Unvanın Eğitim Geçmişinizde Hemen Fark Edeceği ve Zorlayacağı Zayıf Noktalar
            </h4>
            <div className="space-y-2">
              {result.vulnerabilitiesTheyWillTarget.map((vuln, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-amber-200/90 bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/40"
                >
                  <span className="text-amber-400 font-bold shrink-0">⚠</span>
                  <span>{vuln}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to pitch */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Eğitimlerinizi "Sadece Bir Kurs" Değil, Gerçek İş Kabiliyeti Gibi Sunma Taktikleri
            </h4>
            <div className="space-y-2.5">
              {result.howToPitchYourLearningJourney.map((tactic, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{tactic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Defense tip */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-slate-950 to-transparent border border-emerald-500/30">
            <h5 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Mülakattaki En Önemli Savunma & Özgüven Kuralı
            </h5>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              {result.keyDefenseTip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
