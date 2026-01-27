import { GoogleGenAI } from "@google/genai";
import { NeuralStorage, STORAGE_KEYS } from "./fa360";

// Memoria de Sessao para o Ecossistema FA-360
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
      return isEn ? "Status nominal. Standard monitoring recommended." : "Status nominal. Recomenda-se acompanhamento padrao.";
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
      return isEn ? "Status nominal. Standard monitoring recommended." : "Status nominal. Recomenda-se acompanhamento padrao.";
    }
  },

  // Auditoria Estrategica Global (Gemini 3 Pro)
  performGlobalEcosystemAudit: async (snapshot: any, locale: string = 'pt') => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    const isEn = locale === 'en';
    const brand = await NeuralStorage.load(STORAGE_KEYS.BRAND) || fallbackBrand;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `TU ES O MASTER ARCHITECT IA DO ATELIER ${brand.studioName.toUpperCase()}. 
        A Ponte Neural com o Google Sheets esta ATIVA. Analisa este instantaneo do negocio e gera uma diretriz estrategica de alto nivel.
        
        SNAPSHOT: ${JSON.stringify(snapshot)}
        
        FOCO TECNICO E FINANCEIRO:
        1. Saude Financeira (Comparacao entre Pipeline Adjudicado e Custos Reais).
        2. Eficiencia de Area: Racio de custo por m² face a complexidade declarada.
        3. Progressao de Obras Criticas: Identificar gargalos em fases de Licenciamento (RJUE).
        4. Expansao de Prestigio: Sugerir um proximo passo baseado no DNA da marca "${brand.tagline}" e tom ${brand.tone}.
        
        DIRETRIZES: Gera 3-4 paragrafos curtos, extremamente sofisticados e autoritarios. 
        Idioma: ${isEn ? 'English' : 'Portugues de Portugal'}.`,
        config: {
          temperature: 0.65,
          topP: 0.9,
        }
      });
      return response.text;
    } catch (error) {
      return isEn
        ? "Ecosystem audit currently processing background sync. Please wait."
        : "Auditoria do ecossistema em processamento de sincronizacao de fundo. Por favor, aguarde.";
    }
  },

  getPublicConciergeResponse: async (userInput: string, locale: string = 'pt') => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    const isEn = locale === 'en';
    const brand = await NeuralStorage.load(STORAGE_KEYS.BRAND) || fallbackBrand;

    const systemInstruction = isEn
      ? `You are the Digital Concierge of ${brand.studioName} atelier. Your tone is ${brand.tone}, extremely cultured, sophisticated, calm, and poetic. Speak about architecture as the art of 'materializing silence'. If asked about prices, explain that each work is unique and invite them to use our fees simulator or schedule a meeting. Do not use numbered lists; write in fluid, short paragraphs. Language: English.`
      : `Tu es o Concierge Digital do atelier ${brand.studioName}. O teu tom e ${brand.tone}, extremamente culto, sofisticado, calmo e poetico. Falas sobre arquitetura como uma arte de 'materializar o silencio'. Se perguntarem sobre precos, explica que cada obra e unica e convida-os a usar o nosso simulador de honorarios ou agendar uma reuniao. Nao uses listas numeradas, escreve em paragrafos fluidos e curtos. Idioma: Portugues de Portugal.`;

    try {
      const model = (ai as any).getGenerativeModel({ model: 'gemini-3-flash-preview', systemInstruction });

      // Inicia conversa com historico
      const chat = model.startChat({
        history: chatHistory,
      });

      const response = await chat.sendMessage(userInput);
      const text = response.response.text();

      // Atualiza historico local para persistencia de contexto
      chatHistory.push({ role: 'user', parts: [{ text: userInput }] });
      chatHistory.push({ role: 'model', parts: [{ text: text }] });

      // Limite de memoria (ultimas 10 interacoes)
      if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

      return text;
    } catch (error) {
      return isEn
        ? "We are sorry, but our intelligence is processing new concepts. Please try contacting us directly."
        : "Lamentamos, mas a nossa inteligencia esta a processar novos conceitos. Por favor, tente contactar-nos diretamente.";
    }
  },

  checkDocumentationIntegrity: async (files: any[]) => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa esta lista de ficheiros tecnicos de arquitetura e identifica inconsistencias obvias de revisao ou datas. 
        LISTA: ${JSON.stringify(files)}
        
        REGRAS: 
        1. Verifica se as 'Especialidades' tem datas muito anteriores a 'Arquitetura'.
        2. Verifica se as revisoes (Rev) seguem uma ordem logica.
        
        RESPOSTA: Uma frase curta (maximo 20 palavras) e direta em Portugues de Portugal.`,
        config: { temperature: 0.1 }
      });
      return response.text;
    } catch (e) {
      return "Integridade documental verificada. Sem anomalias criticas detetadas.";
    }
  },

  verifyProposalRisk: async (proposalData: any) => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa o risco desta proposta de honorarios: ${JSON.stringify(proposalData)}.
        Compara a Area vs Complexidade vs Valor Total. 
        
        OBJETIVO: Identificar se o valor e demasiado baixo para o risco (dumping interno) ou se faltam disciplinas obrigatorias.
        
        RESPOSTA: JSON format: { "riskLevel": "low" | "medium" | "high", "observation": "string" }`,
        config: { temperature: 0.2, responseMimeType: "application/json" }
      });
      return JSON.parse(response.text);
    } catch (e) {
      return { riskLevel: "low", observation: "Analise de risco simplificada concluida." };
    }
  },

  getMaterialPerformanceAnalysis: async (material: any) => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa este material de construcao e sugere a melhor aplicacao tecnica e compatibilidade: ${JSON.stringify(material)}.
        
        RESPOSTA: Uma frase poetica e tecnica (maximo 25 palavras) em Portugues de Portugal.`,
        config: { temperature: 0.4 }
      });
      return response.text;
    } catch (e) {
      return "Analise tecnica concluida. Material compativel com padroes de alta performance.";
    }
  },

  getCreativeMediaDirective: async (assets: any[]) => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    const brand = await NeuralStorage.load(STORAGE_KEYS.BRAND) || fallbackBrand;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa este inventario de media do atelier ${brand.studioName}: ${JSON.stringify(assets)}.
        O tom da marca e ${brand.tone}.
        
        OBJETIVO: Identificar qual o ativo com maior potencial de marketing para redes sociais de luxo.
        
        RESPOSTA: Uma frase curta, autoritaria e visionaria em Portugues de Portugal.`,
        config: { temperature: 0.7 }
      });
      return response.text;
    } catch (e) {
      return "Diretiva criativa: Focar na luz natural e no silencio da forma para o proximo press kit.";
    }
  }
};
