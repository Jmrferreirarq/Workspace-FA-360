
export interface Legislation {
    id: string;
    title: string;
    year: string;
    official_link?: string;
    summary: string;
    applicability: string[];
    key_points: string[];
}

export const legislationDatabase: Record<string, Legislation> = {
    'rjue': {
        id: 'rjue',
        title: 'Regime Juridico da Urbanizacao e da Edificacao (RJUE)',
        year: 'DL 555/99 (Consolidado 2024)',
        official_link: 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/1999-34533075',
        summary: 'O diploma central que regula os procedimentos de licenciamento, comunicacao previa e autorizacao de obras em Portugal.',
        applicability: ['Licenciamentos', 'Loteamentos', 'Obras de Edificacao'],
        key_points: [
            'Define os tipos de controlo previo (Licenca vs Comunicacao)',
            'Regula os prazos de decisao dos municipios',
            'Estabelece o regime de isencoes (Art. 6º)'
        ]
    },
    'simplex-2024': {
        id: 'simplex-2024',
        title: 'Simplex Urbanistico',
        year: 'Decreto-Lei n.º 10/2024',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/10-2024-836176377',
        summary: 'Reforma profunda que elimina licencas, simplifica pareceres e introduz o deferimento tacito em larga escala.',
        applicability: ['Agilizacao de Processos', 'Habitacao'],
        key_points: [
            'Eliminacao de alvaras de construcao e utilizacao',
            'Novas isencoes para obras de alteracao interior',
            'Unicidade de pareceres e prazos mais rigidos'
        ]
    },
    'rgeu': {
        id: 'rgeu',
        title: 'Regulamento Geral das Edificacoes Urbanas (RGEU)',
        year: 'DL 38382/1951',
        official_link: 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/1951-34442175',
        summary: 'Conjunto de regras sobre salubridade, iluminacao, ventilacao e estetica das construcoes.',
        applicability: ['Higiene', 'Salubridade', 'Dimensionamento'],
        key_points: [
            'Areas minimas de compartimentos',
            'Pe-direito livre minimo (2.70m habitacao)',
            'Regras de ventilacao natural e iluminacao'
        ]
    },
    'acessibilidades': {
        id: 'acessibilidades',
        title: 'Regime da Acessibilidade',
        year: 'Decreto-Lei n.º 163/2006',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/163-2006-538446',
        summary: 'Normas tecnicas de acessibilidade a edificios e espacos publicos para pessoas com mobilidade condicionada.',
        applicability: ['Mobilidade', 'Espaco Publico', 'Edificios Coletivos'],
        key_points: [
            'Largura util de portas (min. 0.77m)',
            'Rampas (declives maximos)',
            'Isencoes para edificios existentes'
        ]
    },
    'scie': {
        id: 'scie',
        title: 'Seguranca Contra Incendios em Edificios (SCIE)',
        year: 'DL 220/2008 + Portaria 1532/2008',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/220-2008-439976',
        summary: 'Regime juridico da seguranca contra incendios, classificado por categorias de risco.',
        applicability: ['Seguranca', 'Protecao Civil'],
        key_points: [
            'Categorias de Risco (1ª a 4ª)',
            'Vias de evacuacao e compartimentacao',
            'Sinaletica e meios de extincao'
        ]
    },
    'reru': {
        id: 'reru',
        title: 'Regime Excecional de Reabilitacao Urbana (RERU)',
        year: 'Decreto-Lei n.º 95/2019',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/95-2019-123232145',
        summary: 'Flexibiliza normas tecnicas (RGEU, Termica, Acustica) para promover a reabilitacao de edificios antigos.',
        applicability: ['Reabilitacao', 'Centros Historicos'],
        key_points: [
            'Criterio da nao sobrecarga',
            'Dispensa de requisitos impossiveis em preexistencias',
            'Foco na melhoria progressiva do desempenho'
        ]
    },
    'lei-solos': {
        id: 'lei-solos',
        title: 'Lei de Bases de Ordenamento do Territorio e Urbanismo',
        year: 'Lei n.º 31/2014',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/lei/31-2014-25407001',
        summary: 'Define a classificacao (urbano/rustico) e qualificacao dos solos.',
        applicability: ['Planeamento', 'PDM'],
        key_points: [
            'Classificacao do solo',
            'Direitos de edificabilidade',
            'Execucao de planos'
        ]
    },
    'reh': {
        id: 'reh',
        title: 'Regulamento de Desempenho Energetico dos Edificios de Habitacao (REH)',
        year: 'Decreto-Lei n.º 101-D/2020',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/101-d-2020-150495804',
        summary: 'Regras sobre comportamento termico e eficiencia energetica para edificios de habitacao.',
        applicability: ['Termica', 'Eficiencia Energetica', 'Habitacao'],
        key_points: [
            'Requisitos minimos de isolamento',
            'Sistemas de climatizacao e energias renovaveis',
            'Certificacao Energetica obrigatoria'
        ]
    },
    'recs': {
        id: 'recs',
        title: 'Regulamento de Desempenho Energetico dos Edificios de Comercio e Servicos (RECS)',
        year: 'Decreto-Lei n.º 101-D/2020',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/101-d-2020-150495804',
        summary: 'Aplicacao de regras de eficiencia energetica a edificios nao habitacionais.',
        applicability: ['Termica', 'Servicos', 'Comercio'],
        key_points: [
            'Sistemas de Ventilacao e QAI',
            ' Auditorias energeticas periodicas',
            'Metas de descarbonizacao'
        ]
    },
    'ited': {
        id: 'ited',
        title: 'Infraestruturas de Telecomunicacoes em Edificios (ITED)',
        year: 'Decreto-Lei n.º 123/2009 (Consolidado)',
        official_link: 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2009-34509176',
        summary: 'Regulamenta o projeto e instalacao de redes de telecomunicacoes.',
        applicability: ['Telecomunicacoes', 'Redes'],
        key_points: [
            'Obrigatoriedade de fibra otica',
            'Dimensionamento de armarios (ATI/ATE)',
            'Certificacao por instalador credenciado'
        ]
    },
    'gas': {
        id: 'gas',
        title: 'Instalacoes de Gas em Edificios',
        year: 'Decreto-Lei n.º 97/2017',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/97-2017-107981313',
        summary: 'Seguranca e execucao de redes de gas combustivel.',
        applicability: ['Gas', 'Seguranca Tecnica'],
        key_points: [
            'Ventilacao de locais com aparelhos a gas',
            'Inspecoes periodicas',
            'Materiais e tracados permitidos'
        ]
    }
};
