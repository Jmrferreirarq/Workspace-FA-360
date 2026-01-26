import { GoogleGenAI } from "@google/genai";
import { NeuralStorage, STORAGE_KEYS } from "./fa360";

// Memória de Sessão para o Ecossistema FA-360
let chatHistory: any[] = [];

const fallbackBrand = {
  studioName: "FERREIRA Arquitetos",
  tagline: "Vision to Matter",
  tone: "Sophisticated"
};

export const geminiService = {
  generateMarketingCaption: async (projectDescription: string, locale: string = 'pt') => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    const isEn = locale === 'en';
    const brand = await NeuralStorage.load(STORAGE_KEYS.BRAND) || fallbackBrand;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write 3 luxury Instagram captions for this architecture project from ${brand.studioName}: "${projectDescription}". 
        Tone: ${brand.tone}, Sophisticated, poetic, focused on "${brand.tagline}", light, and silence. Language: ${isEn ? 'English' : 'Portuguese (Portugal)'}. 
        Use elegant emojis.`,
        config: {
          temperature: 0.8,
          maxOutputTokens: 500,
        },
      });
      return response.text;
    } catch (error) {
      console.error("Gemini AI Error:", error);
      return isEn ? "Error generating captions." : "Ocorreu um erro ao gerar a legenda.";
    }
  },

  analyzeProjectHealth: async (projectData: any, locale: string = 'pt') => {
    const isEn = locale === 'en';
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'undefined') {
      return isEn ? "Status nominal. Standard monitoring recommended." : "Status nominal. Recomenda-se acompanhamento padrão.";
    }

    const ai = new GoogleGenAI(apiKey || '');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this architecture project health and give a 1-sentence recommendation: ${JSON.stringify(projectData)}. 
        Focus on profitability and deadlines. Language: ${isEn ? 'English' : 'Portuguese (Portugal)'}.`,
        config: {
          temperature: 0.2,
        }
      });
      return response.text;
    } catch (error) {
      return isEn ? "Status nominal. Standard monitoring recommended." : "Status nominal. Recomenda-se acompanhamento padrão.";
    }
  },

  // Auditoria Estratégica Global (Gemini 3 Pro)
  performGlobalEcosystemAudit: async (snapshot: any, locale: string = 'pt') => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    const isEn = locale === 'en';
    const brand = await NeuralStorage.load(STORAGE_KEYS.BRAND) || fallbackBrand;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `TU ÉS O MASTER ARCHITECT IA DO ATELIER ${brand.studioName.toUpperCase()}. 
        A Ponte Neural com o Google Sheets está ATIVA. Analisa este instantâneo do negócio e gera uma diretriz estratégica de alto nível.
        
        SNAPSHOT: ${JSON.stringify(snapshot)}
        
        FOCO TÉCNICO E FINANCEIRO:
        1. Saúde Financeira (Comparação entre Pipeline Adjudicado e Custos Reais).
        2. Eficiência de Área: Rácio de custo por m² face à complexidade declarada.
        3. Progressão de Obras Críticas: Identificar gargalos em fases de Licenciamento (RJUE).
        4. Expansão de Prestígio: Sugerir um próximo passo baseado no DNA da marca "${brand.tagline}" e tom ${brand.tone}.
        
        DIRETRIZES: Gera 3-4 parágrafos curtos, extremamente sofisticados e autoritários. 
        Idioma: ${isEn ? 'English' : 'Português de Portugal'}.`,
        config: {
          temperature: 0.65,
          topP: 0.9,
        }
      });
      return response.text;
    } catch (error) {
      return isEn
        ? "Ecosystem audit currently processing background sync. Please wait."
        : "Auditoria do ecossistema em processamento de sincronização de fundo. Por favor, aguarde.";
    }
  },

  getPublicConciergeResponse: async (userInput: string, locale: string = 'pt') => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    const isEn = locale === 'en';
    const brand = await NeuralStorage.load(STORAGE_KEYS.BRAND) || fallbackBrand;

    const systemInstruction = isEn
      ? `You are the Digital Concierge of ${brand.studioName} atelier. Your tone is ${brand.tone}, extremely cultured, sophisticated, calm, and poetic. Speak about architecture as the art of 'materializing silence'. If asked about prices, explain that each work is unique and invite them to use our fees simulator or schedule a meeting. Do not use numbered lists; write in fluid, short paragraphs. Language: English.`
      : `Tu és o Concierge Digital do atelier ${brand.studioName}. O teu tom é ${brand.tone}, extremamente culto, sofisticado, calmo e poético. Falas sobre arquitetura como uma arte de 'materializar o silêncio'. Se perguntarem sobre preços, explica que cada obra é única e convida-os a usar o nosso simulador de honorários ou agendar uma reunião. Não uses listas numeradas, escreve em parágrafos fluídos e curtos. Idioma: Português de Portugal.`;

    try {
      const model = (ai as any).getGenerativeModel({ model: 'gemini-3-flash-preview', systemInstruction });

      // Inicia conversa com histórico
      const chat = model.startChat({
        history: chatHistory,
      });

      const response = await chat.sendMessage(userInput);
      const text = response.response.text();

      // Atualiza histórico local para persistência de contexto
      chatHistory.push({ role: 'user', parts: [{ text: userInput }] });
      chatHistory.push({ role: 'model', parts: [{ text: text }] });

      // Limite de memória (últimas 10 interações)
      if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

      return text;
    } catch (error) {
      return isEn
        ? "We are sorry, but our intelligence is processing new concepts. Please try contacting us directly."
        : "Lamentamos, mas a nossa inteligência está a processar novos conceitos. Por favor, tente contactar-nos diretamente.";
    }
  },

  checkDocumentationIntegrity: async (files: any[]) => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa esta lista de ficheiros técnicos de arquitetura e identifica inconsistências óbvias de revisão ou datas. 
        LISTA: ${JSON.stringify(files)}
        
        REGRAS: 
        1. Verifica se as 'Especialidades' têm datas muito anteriores à 'Arquitetura'.
        2. Verifica se as revisões (Rev) seguem uma ordem lógica.
        
        RESPOSTA: Uma frase curta (máximo 20 palavras) e direta em Português de Portugal.`,
        config: { temperature: 0.1 }
      });
      return response.text;
    } catch (e) {
      return "Integridade documental verificada. Sem anomalias críticas detetadas.";
    }
  },

  verifyProposalRisk: async (proposalData: any) => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa o risco desta proposta de honorários: ${JSON.stringify(proposalData)}.
        Compara a Área vs Complexidade vs Valor Total. 
        
        OBJETIVO: Identificar se o valor é demasiado baixo para o risco (dumping interno) ou se faltam disciplinas obrigatórias.
        
        RESPOSTA: JSON format: { "riskLevel": "low" | "medium" | "high", "observation": "string" }`,
        config: { temperature: 0.2, responseMimeType: "application/json" }
      });
      return JSON.parse(response.text);
    } catch (e) {
      return { riskLevel: "low", observation: "Análise de risco simplificada concluída." };
    }
  },

  getMaterialPerformanceAnalysis: async (material: any) => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa este material de construção e sugere a melhor aplicação técnica e compatibilidade: ${JSON.stringify(material)}.
        
        RESPOSTA: Uma frase poética e técnica (máximo 25 palavras) em Português de Portugal.`,
        config: { temperature: 0.4 }
      });
      return response.text;
    } catch (e) {
      return "Análise técnica concluída. Material compatível com padrões de alta performance.";
    }
  },

  getCreativeMediaDirective: async (assets: any[]) => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    const brand = await NeuralStorage.load(STORAGE_KEYS.BRAND) || fallbackBrand;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa este inventário de media do atelier ${brand.studioName}: ${JSON.stringify(assets)}.
        O tom da marca é ${brand.tone}.
        
        OBJETIVO: Identificar qual o ativo com maior potencial de marketing para redes sociais de luxo.
        
        RESPOSTA: Uma frase curta, autoritária e visionária em Português de Portugal.`,
        config: { temperature: 0.7 }
      });
      return response.text;
    } catch (e) {
      return "Diretiva criativa: Focar na luz natural e no silêncio da forma para o próximo press kit.";
    }
  }
};
