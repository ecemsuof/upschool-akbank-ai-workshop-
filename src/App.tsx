/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InterviewGenerator } from './components/InterviewGenerator';
import { TrainingAnalyzer } from './components/TrainingAnalyzer';
import { AnswerEvaluator } from './components/AnswerEvaluator';
import { IntegratedBridge } from './components/IntegratedBridge';
import { PRESET_PROFILES, PresetProfile } from './mockPresets';
import {
  InterviewGenerationResult,
  TrainingItem,
  TrainingAnalysisResult,
  InterviewQuestion,
} from './types';
import { MessageSquare, GraduationCap, Target, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'interview' | 'trainings' | 'evaluator' | 'bridge'>('interview');

  // Initial default profile from first preset
  const defaultPreset = PRESET_PROFILES[0];

  // Interview state
  const [interviewerTitle, setInterviewerTitle] = useState(defaultPreset.interviewerTitle);
  const [candidateRole, setCandidateRole] = useState(defaultPreset.candidateRole);
  const [experienceLevel, setExperienceLevel] = useState(defaultPreset.experienceLevel);
  const [companyOrIndustry, setCompanyOrIndustry] = useState(defaultPreset.companyOrIndustry);
  const [interviewType, setInterviewType] = useState(defaultPreset.interviewType);
  const [focusNotes, setFocusNotes] = useState('');
  const [interviewResult, setInterviewResult] = useState<InterviewGenerationResult | null>(null);

  // Training state
  const [trainings, setTrainings] = useState<TrainingItem[]>(defaultPreset.trainings);
  const [rawTrainingsText, setRawTrainingsText] = useState(defaultPreset.rawTrainingsText);
  const [targetCareerGoal, setTargetCareerGoal] = useState(defaultPreset.targetCareerGoal);
  const [currentRole, setCurrentRole] = useState(defaultPreset.currentRole);
  const [trainingResult, setTrainingResult] = useState<TrainingAnalysisResult | null>(null);

  // Evaluator practice state
  const [selectedQuestionForPractice, setSelectedQuestionForPractice] = useState<InterviewQuestion | null>(null);

  // Load preset handler
  const handleSelectPreset = (preset: PresetProfile) => {
    setInterviewerTitle(preset.interviewerTitle);
    setCandidateRole(preset.candidateRole);
    setExperienceLevel(preset.experienceLevel);
    setCompanyOrIndustry(preset.companyOrIndustry);
    setInterviewType(preset.interviewType);
    setTrainings(preset.trainings);
    setRawTrainingsText(preset.rawTrainingsText);
    setTargetCareerGoal(preset.targetCareerGoal);
    setCurrentRole(preset.currentRole);
  };

  const handlePracticeQuestion = (question: InterviewQuestion) => {
    setSelectedQuestionForPractice(question);
    setActiveTab('evaluator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectPreset={handleSelectPreset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'interview' && (
          <InterviewGenerator
            interviewerTitle={interviewerTitle}
            setInterviewerTitle={setInterviewerTitle}
            candidateRole={candidateRole}
            setCandidateRole={setCandidateRole}
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
            companyOrIndustry={companyOrIndustry}
            setCompanyOrIndustry={setCompanyOrIndustry}
            interviewType={interviewType}
            setInterviewType={setInterviewType}
            focusNotes={focusNotes}
            setFocusNotes={setFocusNotes}
            result={interviewResult}
            setResult={setInterviewResult}
            onPracticeQuestion={handlePracticeQuestion}
          />
        )}

        {activeTab === 'trainings' && (
          <TrainingAnalyzer
            trainings={trainings}
            setTrainings={setTrainings}
            rawTrainingsText={rawTrainingsText}
            setRawTrainingsText={setRawTrainingsText}
            targetCareerGoal={targetCareerGoal}
            setTargetCareerGoal={setTargetCareerGoal}
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
            result={trainingResult}
            setResult={setTrainingResult}
          />
        )}

        {activeTab === 'evaluator' && (
          <AnswerEvaluator
            initialQuestion={selectedQuestionForPractice}
            interviewerTitle={interviewerTitle}
            candidateRole={candidateRole}
          />
        )}

        {activeTab === 'bridge' && (
          <IntegratedBridge
            trainings={trainings}
            rawTrainingsText={rawTrainingsText}
            interviewerTitle={interviewerTitle}
            candidateRole={candidateRole}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>TalentForge AI • Mülakat & Kariyer Pusulası Ajanı</span>
          </div>
          <p className="text-slate-500">
            Unvan odaklı soru simülasyonu ve müfredat tabanlı eğitim açığı analizi ile mülakatlara hazırlanın.
          </p>
        </div>
      </footer>
    </div>
  );
}
