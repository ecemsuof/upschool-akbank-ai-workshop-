import { TrainingItem } from './types';

export interface PresetProfile {
  id: string;
  label: string;
  subtitle: string;
  interviewerTitle: string;
  candidateRole: string;
  experienceLevel: string;
  companyOrIndustry: string;
  interviewType: string;
  targetCareerGoal: string;
  currentRole: string;
  trainings: TrainingItem[];
  rawTrainingsText: string;
}

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'frontend-to-senior',
    label: 'Frontend Developer ➔ Senior Full-Stack / Team Lead',
    subtitle: 'Mülakatçı: Engineering Manager | Hedef: Mikro-frontends, Mimari ve Ekip Liderliği',
    interviewerTitle: 'Engineering Manager',
    candidateRole: 'Senior Frontend Engineer',
    experienceLevel: 'Mid-Level (3 Yıl)',
    companyOrIndustry: 'Global B2B FinTech SaaS',
    interviewType: 'Teknik Mimari & Davranışsal Liderlik',
    targetCareerGoal: 'Senior Full-Stack Engineer / Tech Lead',
    currentRole: 'Frontend Developer (React)',
    trainings: [
      {
        id: 't1',
        title: 'Modern React & TypeScript Masterclass',
        provider: 'Udemy & Frontend Masters',
        topics: 'React Hooks, Custom Hooks, Redux Toolkit, Context API, TypeScript Generics, Component Design Patterns',
        skills: 'React, TypeScript, State Management, Responsive UI, Unit Testing (Jest)',
        year: '2023',
      },
      {
        id: 't2',
        title: 'Full-Stack Web Development Bootcamp (MERN)',
        provider: 'Kodluyoruz / Patika',
        topics: 'Node.js, Express.js REST API geliştirme, MongoDB veri modelleme, JWT Kimlik Doğrulama, Git/GitHub',
        skills: 'Node.js, Express, MongoDB, REST APIs, Git Branching',
        year: '2022',
      },
      {
        id: 't3',
        title: 'Temel Docker & CI/CD Pipeline Giriş',
        provider: 'Coursera',
        topics: 'Container mantığı, Dockerfile hazırlama, Docker Compose ile çoklu servisler, GitHub Actions ile temel test otomasyonu',
        skills: 'Docker, Containerization, GitHub Actions basics',
        year: '2024',
      },
    ],
    rawTrainingsText: `1. Modern React & TypeScript Masterclass (Udemy - 2023): React 18, Custom Hooks, Redux Toolkit, TypeScript ileri tipler, Jest testleri.
2. MERN Full-Stack Bootcamp (Patika - 2022): Node.js, Express REST API, MongoDB şemaları, JWT Auth, Git.
3. Temel Docker & CI/CD Pipeline (Coursera - 2024): Dockerfile, Compose, temel GitHub Actions.`,
  },
  {
    id: 'data-to-ml',
    label: 'Veri Analisti ➔ Machine Learning / AI Engineer',
    subtitle: 'Mülakatçı: Chief Data Officer / Head of AI | Hedef: ML Pipeline ve LLM Çözümleri',
    interviewerTitle: 'Head of Data / Chief Data Officer',
    candidateRole: 'Data Scientist / Machine Learning Engineer',
    experienceLevel: 'Mid-Level (2 Yıl)',
    companyOrIndustry: 'E-Ticaret & Perakende Analitiği',
    interviewType: 'Vaka Çözümü & İleri Veri Mimarisi',
    targetCareerGoal: 'Machine Learning Engineer & AI Specialist',
    currentRole: 'Business & Data Analyst',
    trainings: [
      {
        id: 'd1',
        title: 'İleri Seviye SQL ve Veri Ambarı Modellemesi',
        provider: 'DataCamp',
        topics: 'Window functions, CTE, Indexing, PostgreSQL, Snowflake temelleri, Star/Snowflake schema',
        skills: 'Advanced SQL, Query Optimization, Data Warehousing',
        year: '2023',
      },
      {
        id: 'd2',
        title: 'Python for Data Analysis & Visualization',
        provider: 'Coursera (IBM)',
        topics: 'Pandas, NumPy, Matplotlib, Seaborn, Keşifçi Veri Analizi (EDA), İstatistiksel hipotez testleri',
        skills: 'Python, Pandas, Veri Temizleme, İstatistik',
        year: '2023',
      },
      {
        id: 'd3',
        title: 'Temel Makine Öğrenmesi (Supervised Learning)',
        provider: 'Kaggle Learn & Udemy',
        topics: 'Lineer Regresyon, Lojistik Regresyon, Karar Ağaçları, Scikit-Learn kütüphanesi, Train/Test ayrımı, Metrikler (RMSE, F1-Score)',
        skills: 'Scikit-Learn, Sınıflandırma, Regresyon, Model Doğrulama',
        year: '2024',
      },
    ],
    rawTrainingsText: `1. İleri SQL & Veri Ambarı (DataCamp): Window functions, CTE, Indexing, Snowflake temelleri.
2. Python for Data Analysis (IBM/Coursera): Pandas, NumPy, Seaborn, EDA, İstatistiksel analiz.
3. Temel Makine Öğrenmesi (Kaggle & Udemy): Scikit-learn, Regresyon, Random Forest, Model Değerlendirme.`,
  },
  {
    id: 'pm-to-cpo',
    label: 'Ürün Uzmanı ➔ Senior Product Manager',
    subtitle: 'Mülakatçı: VP of Product / CPO | Hedef: Ürün Stratejisi, Büyüme & P&L',
    interviewerTitle: 'VP of Product / CPO',
    candidateRole: 'Senior Product Manager',
    experienceLevel: 'Mid-Level (3 Yıl)',
    companyOrIndustry: 'B2B SaaS & Pazaryeri',
    interviewType: 'Ürün Vizyonu, Metrikler & Önceliklendirme',
    targetCareerGoal: 'Principal PM / Group Product Manager',
    currentRole: 'Associate Product Manager',
    trainings: [
      {
        id: 'p1',
        title: 'Professional Scrum Product Owner (PSPO I)',
        provider: 'Scrum.org',
        topics: 'Agile felsefesi, Scrum ritüelleri, Product Backlog yönetimi, User Story mapping, Sprint hedefi belirleme',
        skills: 'Agile/Scrum, Backlog Prioritization, User Stories',
        year: '2023',
      },
      {
        id: 'p2',
        title: 'Product Discovery & Müşteri Görüşmeleri',
        provider: 'Teresa Torres Continuous Discovery Habiti',
        topics: 'Fırsat Çözüm Ağacı (Opportunity Solution Tree), Müşteri mülakatları, Varsayım testi, Hızlı prototipleme',
        skills: 'Product Discovery, User Research, Assumption Testing',
        year: '2024',
      },
      {
        id: 'p3',
        title: 'Ürün Analitiği ve Metrik Takibi',
        provider: 'Amplitude & Mixpanel Academy',
        topics: 'Funnel analizi, Retention cohortları, Kuzey Yıldızı Metriği (North Star), A/B test tasarımı',
        skills: 'Amplitude, Funnel Analysis, Retention, A/B Testing',
        year: '2024',
      },
    ],
    rawTrainingsText: `1. PSPO I Scrum Product Owner (Scrum.org): Backlog yönetimi, Agile ritüeller, User Story.
2. Product Discovery & Opportunity Trees (Continuous Discovery): Müşteri mülakatları, varsayım testleri.
3. Product Analytics Masterclass (Mixpanel & Amplitude): Funnels, Retention, A/B testleri, North Star metriği.`,
  },
];
