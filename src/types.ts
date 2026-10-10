export interface InterviewerPersona {
  title: string;
  mindset: string;
  keyEvaluationCriteria: string[];
  proTipForCandidate: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  whyTheyAskThis: string;
  difficulty: 'Temel' | 'Orta' | 'İleri Seviye' | string;
  evaluationCriteria: string;
  suggestedFramework: string;
  keyPointsToHighlight: string[];
  sampleAnswer: string;
  redFlagsToAvoid: string[];
}

export interface ReverseQuestion {
  question: string;
  whyAskThis: string;
}

export interface InterviewGenerationResult {
  interviewerPersona: InterviewerPersona;
  questions: InterviewQuestion[];
  interviewerSpecificQuestionsToAsk: ReverseQuestion[];
}

export interface TrainingItem {
  id: string;
  title: string;
  provider?: string;
  topics?: string;
  skills?: string;
  year?: string;
}

export interface RecommendedTraining {
  priority: string;
  title: string;
  category: string;
  reasoning: string;
  mustHaveSyllabusModules: string[];
  recommendedPlatformsOrCerts: string[];
  estimatedDuration: string;
  capstoneProjectRecommendation: string;
}

export interface RoadmapPhase {
  phase: string;
  timeframe: string;
  mainGoal: string;
  actionItems: string[];
}

export interface TrainingAnalysisResult {
  currentSkillProfile: {
    summary: string;
    masteredSkills: string[];
    transferableStrengths: string[];
    readinessScoreForNextLevel: number;
  };
  gapAnalysis: {
    criticalGaps: string[];
    whyCurrentTrainingsAreNotEnough: string;
    industryContext: string;
  };
  recommendedNextTrainings: RecommendedTraining[];
  learningRoadmapPhases: RoadmapPhase[];
  mentorshipAdvice: string;
}

export interface AnswerEvaluationResult {
  score: number;
  verdict: string;
  interviewerImpression: string;
  strengths: string[];
  areasToImprove: string[];
  rewrittenStarAnswer: string;
  followUpTrapQuestion: string;
}

export interface BridgeAuditResult {
  interviewerLikelyAppreciation: string;
  vulnerabilitiesTheyWillTarget: string[];
  howToPitchYourLearningJourney: string[];
  keyDefenseTip: string;
}
