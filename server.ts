import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY ortam değişkeni bulunamadı. Lütfen AI Studio Secrets panelinden kontrol edin.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Mülakatçı Ünvanına Göre Soru ve Strateji Üretme
app.post('/api/interview/generate-questions', async (req: Request, res: Response) => {
  try {
    const {
      interviewerTitle,
      candidateRole,
      experienceLevel = 'Mid-Level',
      companyOrIndustry = 'Genel Teknoloji Şirketi',
      interviewType = 'Kapsamlı Mülakat',
      focusNotes = '',
    } = req.body;

    if (!interviewerTitle || !candidateRole) {
      return res.status(400).json({
        error: 'Lütfen mülakatçı unvanını (interviewerTitle) ve başvurduğunuz pozisyonu (candidateRole) girin.',
      });
    }

    const ai = getGeminiClient();

    const prompt = `Sen üst düzey bir Yönetici İşe Alım Danışmanı (Executive Career & Interview Coach) ve Mülakat Stratejistisin.
Aday şu pozisyona giriyor:
- Adayın Hedef Pozisyonu: "${candidateRole}"
- Deneyim Seviyesi: "${experienceLevel}"
- Mülakatı Yapan Kişinin Rolü / Unvanı (İnterviewer Title): "${interviewerTitle}"
- Sektör / Şirket Türü: "${companyOrIndustry}"
- Mülakat Formatı: "${interviewType}"
${focusNotes ? `- Adayın Özel Notları / Odak Alanları: "${focusNotes}"` : ''}

GÖREVİN:
"${interviewerTitle}" unvanına sahip bir kişinin zihniyetini, önceliklerini, korkularını ve ne tür sorularla adayı ölçeceğini derinlemesine analiz et.
Örneğin bir CTO ölçeklenebilirlik, sistem mimarisi ve teknik vizyon sorarken, bir HR/People Lead takım uyumu, kriz yönetimi ve motivasyon sorar; bir Product Manager ürün vizyonu ve çapraz fonksiyonel iletişim sorar; bir Engineering Manager ise teslimat güvenilirliği, kod kalitesi ve insan yönetimi sorar.

Lütfen Türkçe olarak detaylı ve profesyonel bir JSON yanıtı üret. Yanıt şunları içermelidir:
1. interviewerPersona:
   - title: Mülakatçının unvanı
   - mindset: Bu unvandaki kişinin mülakattaki temel zihniyeti, masaya otururken kafasındaki asıl kaygılar ve adayı hangi gizli lensle süzdüğü (en az 2-3 cümle).
   - keyEvaluationCriteria: Bu kişinin aradığı en kritik 4-5 özellik.
   - proTipForCandidate: Bu unvana hitap ederken adayın mutlaka uygulaması gereken en büyük taktik.
2. questions: En az 6, en fazla 8 adet, bu unvanın en sık ve en can alıcı şekilde soracağı potansiyel soru listesi.
   Her bir soru için:
   - id: benzersiz id (q1, q2, ...)
   - question: Sorunun net metni
   - category: 'Davranışsal (STAR)' | 'Teknik & Yetkinlik' | 'Problem Çözme & Vaka' | 'Strateji & Liderlik' | 'Kültürel Uyum & İletişim'
   - whyTheyAskThis: "${interviewerTitle}" unvanı bu soruyu NEDEN sorar? Bu sorunun arkasında gizlice neyi test ediyor?
   - difficulty: 'Temel' | 'Orta' | 'İleri Seviye'
   - evaluationCriteria: Başarılı bir yanıtta aranacak temel kriter.
   - suggestedFramework: Yanıtlarken izlenecek en iyi model (örn: STAR [Durum-Görev-Eylem-Sonuç], CAR, Problem-Çözüm-Etki, 5N1K).
   - keyPointsToHighlight: Yanıtta adayın mutlaka vurgulaması gereken 3 madde.
   - sampleAnswer: Bu soruya verilebilecek çok güçlü, akılda kalıcı, somut sayılar/örnekler barındıran örnek ideal cevap senaryosu.
   - redFlagsToAvoid: Adayın bu soruda kesinlikle yapmaması gereken 2-3 ölümcül hata (kırmızı bayrak).
3. interviewerSpecificQuestionsToAsk: Adayın mülakatın sonunda tam olarak "${interviewerTitle}" unvanındaki kişiye sorabileceği, adayı vizyoner ve stratejik gösterecek 3 adet güçlü ters soru (ve her birinin amacı).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interviewerPersona: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                mindset: { type: Type.STRING },
                keyEvaluationCriteria: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                proTipForCandidate: { type: Type.STRING },
              },
              required: ['title', 'mindset', 'keyEvaluationCriteria', 'proTipForCandidate'],
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  category: { type: Type.STRING },
                  whyTheyAskThis: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  evaluationCriteria: { type: Type.STRING },
                  suggestedFramework: { type: Type.STRING },
                  keyPointsToHighlight: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  sampleAnswer: { type: Type.STRING },
                  redFlagsToAvoid: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: [
                  'id',
                  'question',
                  'category',
                  'whyTheyAskThis',
                  'difficulty',
                  'evaluationCriteria',
                  'suggestedFramework',
                  'keyPointsToHighlight',
                  'sampleAnswer',
                  'redFlagsToAvoid',
                ],
              },
            },
            interviewerSpecificQuestionsToAsk: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  whyAskThis: { type: Type.STRING },
                },
                required: ['question', 'whyAskThis'],
              },
            },
          },
          required: ['interviewerPersona', 'questions', 'interviewerSpecificQuestionsToAsk'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Yapay zeka yanıtı boş döndü.');
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error('Error generating interview questions:', error);
    return res.status(500).json({
      error: error.message || 'Mülakat soruları üretilirken bir hata oluştu.',
    });
  }
});

// 2. Alınan Eğitimlerin İçerik Analizi ve Bir Sonraki Eğitim Yol Haritası
app.post('/api/career/analyze-trainings', async (req: Request, res: Response) => {
  try {
    const {
      trainingsText,
      trainingsList = [],
      targetCareerGoal,
      currentRole = 'Belirtilmedi',
      experienceLevel = 'Orta Seviye',
    } = req.body;

    if (!trainingsText && (!trainingsList || trainingsList.length === 0)) {
      return res.status(400).json({
        error: 'Lütfen katıldığınız eğitimlerin içeriklerini veya listesini girin.',
      });
    }

    const ai = getGeminiClient();

    const formattedTrainings =
      trainingsList.length > 0
        ? trainingsList
            .map(
              (t: any, i: number) =>
                `${i + 1}. Eğitim: ${t.title || 'Başlıksız'} (${t.provider || 'Platform/Kurum'})
                 - İçerik/Müfredat: ${t.topics || 'Belirtilmedi'}
                 - Kazanılan Beceriler: ${t.skills || 'Belirtilmedi'}`
            )
            .join('\n\n')
        : trainingsText;

    const prompt = `Sen Baş Kariyer Gelişim Danışmanı ve Eğitim Müfredatı Mimarı (Chief Career Architect & Learning Strategist) rolündesin.
Kullanıcı sana bugüne kadar katıldığı/tamamladığı eğitimlerin içeriklerini ve hedeflediği kariyer adımını veriyor.

KULLANICI BİLGİLERİ:
- Mevcut Rol: "${currentRole}"
- Deneyim Seviyesi: "${experienceLevel}"
- Hedef Kariyer / Bir Sonraki Seviye: "${targetCareerGoal || 'Bir sonraki uzmanlık veya kıdemli seviye'}"

KATILDIĞI EĞİTİMLER VE MÜFREDAT İÇERİKLERİ:
\"\"\"
${formattedTrainings}
\"\"\"

GÖREVİN:
1. Katılınan eğitimlerin derinlemesine içerik analizini yap:
   - Bu eğitimler adaya hangi temel taşları kazandırmış?
   - Teorik ve pratik hangi kaslar gelişmiş?
2. Eksik Kalan Kritik Noktaları (Skill Gap Analysis) tespit et:
   - Hedeflenen role ulaşmak için bu eğitimlerin yetersiz kaldığı, endüstride aranan hangi ileri seviye mimari, araç, liderlik veya sistem bilgisi eksik kalıyor?
3. "BİR SONRAKİ ADIM İÇİN NASIL BİR EĞİTİM ALMAM GEREKİR?" sorusuna kesin ve nokta atışı yanıt ver:
   - Alınması gereken 3-4 adet somut, birbiriyle tutarlı eğitim modülü öner.
   - Her eğitimin tam adı, kapsaması gereken müfredat başlıkları, neden geçmiş eğitimlerin üstüne bunu koyması gerektiği ve önerilen prestijli kaynaklar/sertifikasyonlar.
4. 3 Fazlı Aksiyon Planı ve Uygulama Projesi (Hands-on Capstone) hazırla.

Lütfen Türkçe olarak profesyonel JSON çıktısı ver:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentSkillProfile: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                masteredSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                transferableStrengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                readinessScoreForNextLevel: {
                  type: Type.INTEGER,
                  description: '0-100 arasında hazır bulunuşluk skoru',
                },
              },
              required: ['summary', 'masteredSkills', 'transferableStrengths', 'readinessScoreForNextLevel'],
            },
            gapAnalysis: {
              type: Type.OBJECT,
              properties: {
                criticalGaps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                whyCurrentTrainingsAreNotEnough: { type: Type.STRING },
                industryContext: { type: Type.STRING },
              },
              required: ['criticalGaps', 'whyCurrentTrainingsAreNotEnough', 'industryContext'],
            },
            recommendedNextTrainings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  priority: {
                    type: Type.STRING,
                    description: 'Acil / 1. Öncelik, Yüksek Öncelik veya İleri Düzey',
                  },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  reasoning: {
                    type: Type.STRING,
                    description: 'Neden geçmiş eğitimlerin üstüne bu eğitim şart?',
                  },
                  mustHaveSyllabusModules: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Bu eğitimin müfredatında kesinlikle olması gereken modüller',
                  },
                  recommendedPlatformsOrCerts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  estimatedDuration: { type: Type.STRING },
                  capstoneProjectRecommendation: {
                    type: Type.STRING,
                    description: 'Eğitimi kanıtlayacak somut portfolyo projesi',
                  },
                },
                required: [
                  'priority',
                  'title',
                  'category',
                  'reasoning',
                  'mustHaveSyllabusModules',
                  'recommendedPlatformsOrCerts',
                  'estimatedDuration',
                  'capstoneProjectRecommendation',
                ],
              },
            },
            learningRoadmapPhases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  timeframe: { type: Type.STRING },
                  mainGoal: { type: Type.STRING },
                  actionItems: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['phase', 'timeframe', 'mainGoal', 'actionItems'],
              },
            },
            mentorshipAdvice: { type: Type.STRING },
          },
          required: [
            'currentSkillProfile',
            'gapAnalysis',
            'recommendedNextTrainings',
            'learningRoadmapPhases',
            'mentorshipAdvice',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Yapay zeka yanıtı boş döndü.');
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error('Error analyzing trainings:', error);
    return res.status(500).json({
      error: error.message || 'Eğitim analizi yapılırken bir hata oluştu.',
    });
  }
});

// 3. Adayın Soruya Verdiği Cevabı Mülakatçı Gözüyle Değerlendirme (Simülasyon / Mock Feedback)
app.post('/api/interview/evaluate-answer', async (req: Request, res: Response) => {
  try {
    const { question, interviewerTitle, candidateAnswer, candidateRole } = req.body;

    if (!question || !candidateAnswer || !interviewerTitle) {
      return res.status(400).json({
        error: 'Soru, mülakatçı unvanı ve aday cevabı zorunludur.',
      });
    }

    const ai = getGeminiClient();

    const prompt = `Sen mülakatta karşımda oturan "${interviewerTitle}" kişisisin ve adayı dinledin.
Adayın Rolü: "${candidateRole || 'Aday'}"
Sorduğun Soru: "${question}"
Adayın Verdiği Yanıt:
\"\"\"
${candidateAnswer}
\"\"\"

Lütfen bu cevabı "${interviewerTitle}" unvanının beklentileri ve filtreleriyle değerlendir.
1. score: 100 üzerinden puan (0-100)
2. verdict: 'Mükemmel' | 'Güçlü ve İkna Edici' | 'Geliştirilmeli' | 'Yetersiz / Kırmızı Bayrak'
3. interviewerImpression: Bu unvandaki kişi adayın bu cevabını dinlerken içinden ne düşündü? (Gerçekçi bir mülakatçı iç sesi)
4. strengths: Yanıtın en iyi 2-3 noktası.
5. areasToImprove: Eksik veya yüzeysel kalan noktalar.
6. rewrittenStarAnswer: Adayın aynı tecrübeyi çok daha vurucu, STAR formatında ve somut metriklerle anlattığı revize edilmiş mükemmel versiyon.
7. followUpTrapQuestion: Bu cevabın ardından "${interviewerTitle}" unvanının adayı köşeye sıkıştırmak için sorabileceği muhtemel devam sorusu.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            verdict: { type: Type.STRING },
            interviewerImpression: { type: Type.STRING },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            areasToImprove: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            rewrittenStarAnswer: { type: Type.STRING },
            followUpTrapQuestion: { type: Type.STRING },
          },
          required: [
            'score',
            'verdict',
            'interviewerImpression',
            'strengths',
            'areasToImprove',
            'rewrittenStarAnswer',
            'followUpTrapQuestion',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Yapay zeka yanıtı boş döndü.');
    }

    return res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    return res.status(500).json({
      error: error.message || 'Cevap değerlendirilirken hata oluştu.',
    });
  }
});

// 4. Bütünleşik Köprü: "Eğitimlerim Bu Mülakatçı Karşısında Yeterli mi?"
app.post('/api/integrated/bridge-audit', async (req: Request, res: Response) => {
  try {
    const { trainingsSummary, interviewerTitle, candidateRole } = req.body;

    if (!trainingsSummary || !interviewerTitle) {
      return res.status(400).json({
        error: 'Eğitim özeti ve mülakatçı unvanı gereklidir.',
      });
    }

    const ai = getGeminiClient();

    const prompt = `Adayın Katıldığı Eğitimler / Yetkinlik Seti:
\"\"\"
${trainingsSummary}
\"\"\"

Aday şu unvandaki kişiyle mülakata girecek: "${interviewerTitle}" (Hedef Rol: "${candidateRole || 'Uzman'}")

Analiz et:
1. Bu mülakatçı adayın eğitim geçmişinde neyi takdir eder?
2. Bu mülakatçı adayın eğitimlerinde hangi boşluğu hemen fark edip oradan yüklenebilir?
3. Aday bu eğitimleri sadece birer kurs gibi değil, gerçek iş kabiliyeti gibi nasıl savunmalıdır? (3 taktik)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interviewerLikelyAppreciation: { type: Type.STRING },
            vulnerabilitiesTheyWillTarget: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            howToPitchYourLearningJourney: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyDefenseTip: { type: Type.STRING },
          },
          required: [
            'interviewerLikelyAppreciation',
            'vulnerabilitiesTheyWillTarget',
            'howToPitchYourLearningJourney',
            'keyDefenseTip',
          ],
        },
      },
    });

    const text = response.text;
    return res.json(JSON.parse(text || '{}'));
  } catch (error: any) {
    console.error('Error in bridge audit:', error);
    return res.status(500).json({
      error: error.message || 'Köprü analizi yapılırken hata oluştu.',
    });
  }
});

// Vite middleware veya static dosyalar
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Interview & Career Agent server running on http://localhost:${PORT}`);
});
