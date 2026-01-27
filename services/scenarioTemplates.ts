
import { ScenarioPack } from './scenarioCatalog';

export const SCENARIO_OVERRIDES: Record<string, Record<string, Partial<ScenarioPack>>> = {
    // 1. RETAIL / COMÉRCIO
    retail: {
        essential: {
            labelPT: "Retail Fast",
            deliverablesPT: [
                "Layout Funcional",
                "Mapa de Acabamentos",
                "Iluminação Base",
                "Peças Desenhadas (2D)",
                "Estimativa Orçamental (High-Level)"
            ],
            exclusionsPT: [
                "Licenciamento Industrial",
                "Design de Mobiliário Personalizado",
                "Acompanhamento de Obra"
            ]
        },
        standard: {
            labelPT: "Retail Branding",
            deliverablesPT: [
                "Tudo do Retail Fast",
                "Moodboards & Look-and-Feel",
                "Iluminação Cénica",
                "Mobiliário Fixo (Balcões/Expositores)",
                "Visualizações 3D (2 Vistas)",
                "Mapa de Quantidades"
            ]
        },
        premium: {
            labelPT: "Flagship Experience",
            deliverablesPT: [
                "Tudo do Retail Branding",
                "Manual de Normas da Loja",
                "Design de Fachada",
                "Sinalética & Wayfinding",
                "Gestão de Concurso de Empreitada",
                "Coordenação de Especialidades"
            ]
        }
    },

    // 2. LEGALIZAÇÃO
    legalization: {
        essential: {
            labelPT: "Check-Up Legal",
            deliverablesPT: [
                "Levantamento Rigoroso",
                "Análise do PDM",
                "Relatório de Conformidade",
                "Reunião com Câmara Municipal"
            ],
            exclusionsPT: [
                "Projetos de Especialidades",
                "Obras de Alteração"
            ]
        },
        standard: {
            labelPT: "Licenciamento Base",
            deliverablesPT: [
                "Tudo do Check-Up",
                "Projeto de Arquitetura (Legal)",
                "Memória Descritiva e Justificativa",
                "Termo de Responsabilidade",
                "Instrução do Processo na CM"
            ]
        },
        premium: {
            labelPT: "Gestão Urbanística",
            deliverablesPT: [
                "Tudo do Licenciamento Base",
                "Coordenação de Especialidades (Engenharias)",
                "Resposta a Saneamentos Liminares",
                "Acompanhamento até Emissão de Alvará",
                "Pedidos de Isenção de Taxas (se aplicável)"
            ]
        }
    },

    // 3. INDUSTRIAL
    industrial: {
        essential: {
            labelPT: "Nave Base",
            deliverablesPT: [
                "Implantação Geral",
                "Estudo de Circulação Logística",
                "Volumetria Simples",
                "Cérceas e Afastamentos"
            ]
        },
        standard: {
            labelPT: "Logística Pro",
            deliverablesPT: [
                "Tudo da Nave Base",
                "Pormenorização de Coberturas",
                "Estudo de Cargas de Piso",
                "Integração de Cais de Carga",
                "Projeto de Segurança Contra Incêndios (SCIE)"
            ]
        },
        premium: {
            labelPT: "Hub Industrial",
            deliverablesPT: [
                "Tudo da Logística Pro",
                "Edifício Administrativo Integrado",
                "Projeto de Eficiência Energética",
                "Certificação BREEAM/LEED (Apoio)",
                "Gestão de Licenciamento Industrial (SIR)"
            ]
        }
    },

    // 4. INTERIORES
    interior: {
        essential: {
            labelPT: "Refresh",
            deliverablesPT: [
                "Layout de Mobiliário",
                "Paleta de Cores e Materiais",
                "Lista de Compras (Shopping List)",
                "Guia de Estilo"
            ],
            exclusionsPT: ["Obras de Construção Civil", "Desenhos Técnicos Detalhados"]
        },
        standard: {
            labelPT: "Living Design",
            deliverablesPT: [
                "Tudo do Refresh",
                "Plantas de Demolições/Construção",
                "Planta de Tetos e Iluminação",
                "Desenho de Carpintarias (Cozinha/Roupeiros)",
                "3D Realista (Sala + Suite)"
            ]
        },
        premium: {
            labelPT: "Full Concept",
            deliverablesPT: [
                "Tudo do Living Design",
                "Projeto de Execução Completo",
                "Mapa de Vãos e Ferragens",
                "Seleção de Peças de Arte",
                "Gestão de Encomendas e Montagem (FF&E)",
                "Acompanhamento Estético de Obra"
            ]
        }
    },

    // 5. TURISMO
    tourism: {
        essential: {
            labelPT: "Estudo Prévio",
            deliverablesPT: [
                "Conceito Geral",
                "Implantação no Terreno",
                "Estudo de Viabilidade Turística (Sumário)",
                "Quadro de Áreas e Tipologias"
            ]
        },
        standard: {
            labelPT: "Licenciamento Turístico",
            deliverablesPT: [
                "Projeto de Arquitetura Completo",
                "Cumprimento RJET (Regime Jurídico)",
                "Acessibilidades",
                "Arranjos Exteriores (Básico)"
            ]
        },
        premium: {
            labelPT: "Resort & Experience",
            deliverablesPT: [
                "Design de Interiores Integrado",
                "Projeto de Paisagismo Detalhado",
                "Design de Piscina e Spa",
                "Sinalética do Empreendimento",
                "Coordenação com Turismo de Portugal"
            ]
        }
    }
};
