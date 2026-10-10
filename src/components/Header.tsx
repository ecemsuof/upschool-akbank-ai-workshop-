import React from 'react';
import { Sparkles, MessageSquare, GraduationCap, Target, Layers, PlayCircle } from 'lucide-react';
import { PRESET_PROFILES, PresetProfile } from '../mockPresets';

interface HeaderProps {
  activeTab: 'interview' | 'trainings' | 'evaluator' | 'bridge';
  setActiveTab: (tab: 'interview' | 'trainings' | 'evaluator' | 'bridge') => void;
  onSelectPreset: (preset: PresetProfile) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSelectPreset,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  TalentForge <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">AI</span>
                </h1>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Career & Interview Agent
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mülakatçı Unvanına Özel Soru Simülasyonu & Müfredat Tabanlı Eğitim Pusulası
              </p>
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium px-2 flex items-center gap-1 shrink-0">
              <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
              Hızlı Örnekler:
            </span>
            {PRESET_PROFILES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-700/50 hover:bg-indigo-600/30 hover:text-indigo-200 text-slate-300 border border-slate-600/40 hover:border-indigo-500/40 transition-all shrink-0 text-left"
                title={preset.subtitle}
              >
                {preset.label.split('➔')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 sm:space-x-2 border-t border-slate-800/80 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'interview'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>1. Mülakatçı Title Soruları</span>
          </button>

          <button
            onClick={() => setActiveTab('trainings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'trainings'
                ? 'border-violet-500 text-violet-400 bg-violet-500/10 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>2. Eğitim Analizi & Sonraki Adım</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'evaluator'
                ? 'border-sky-500 text-sky-400 bg-sky-500/10 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>3. Cevap Simülatörü (Mock)</span>
          </button>

          <button
            onClick={() => setActiveTab('bridge')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'bridge'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4. Bütünleşik Köprü Analizi</span>
          </button>
        </div>
      </div>
    </header>
  );
};
