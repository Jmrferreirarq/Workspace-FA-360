
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
        title: 'Regime Jurídico da Urbanização e da Edificação (RJUE)',
        year: 'DL 555/99 (Consolidado 2024)',
        official_link: 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/1999-34533075',
        summary: 'O diploma central que regula os procedimentos de licenciamento, comunicação prévia e autorização de obras em Portugal.',
        applicability: ['Licenciamentos', 'Loteamentos', 'Obras de Edificação'],
        key_points: [
            'Define os tipos de controlo prévio (Licença vs Comunicação)',
            'Regula os prazos de decisão dos municípios',
            'Estabelece o regime de isenções (Art. 6º)'
        ]
    },
    'simplex-2024': {
        id: 'simplex-2024',
        title: 'Simplex Urbanístico',
        year: 'Decreto-Lei n.º 10/2024',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/10-2024-836176377',
        summary: 'Reforma profunda que elimina licenças, simplifica pareceres e introduz o deferimento tácito em larga escala.',
        applicability: ['Agilização de Processos', 'Habitação'],
        key_points: [
            'Eliminação de alvarás de construção e utilização',
            'Novas isenções para obras de alteração interior',
            'Unicidade de pareceres e prazos mais rígidos'
        ]
    },
    'rgeu': {
        id: 'rgeu',
        title: 'Regulamento Geral das Edificações Urbanas (RGEU)',
        year: 'DL 38382/1951',
        official_link: 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/1951-34442175',
        summary: 'Conjunto de regras sobre salubridade, iluminação, ventilação e estética das construções.',
        applicability: ['Higiene', 'Salubridade', 'Dimensionamento'],
        key_points: [
            'Áreas mínimas de compartimentos',
            'Pé-direito livre mínimo (2.70m habitação)',
            'Regras de ventilação natural e iluminação'
        ]
    },
    'acessibilidades': {
        id: 'acessibilidades',
        title: 'Regime da Acessibilidade',
        year: 'Decreto-Lei n.º 163/2006',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/163-2006-538446',
        summary: 'Normas técnicas de acessibilidade a edifícios e espaços públicos para pessoas com mobilidade condicionada.',
        applicability: ['Mobilidade', 'Espaço Público', 'Edifícios Coletivos'],
        key_points: [
            'Largura útil de portas (mín. 0.77m)',
            'Rampas (declives máximos)',
            'Isenções para edifícios existentes'
        ]
    },
    'scie': {
        id: 'scie',
        title: 'Segurança Contra Incêndios em Edifícios (SCIE)',
        year: 'DL 220/2008 + Portaria 1532/2008',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/220-2008-439976',
        summary: 'Regime jurídico da segurança contra incêndios, classificado por categorias de risco.',
        applicability: ['Segurança', 'Proteção Civil'],
        key_points: [
            'Categorias de Risco (1ª a 4ª)',
            'Vias de evacuação e compartimentação',
            'Sinalética e meios de extinção'
        ]
    },
    'reru': {
        id: 'reru',
        title: 'Regime Excecional de Reabilitação Urbana (RERU)',
        year: 'Decreto-Lei n.º 95/2019',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/95-2019-123232145',
        summary: 'Flexibiliza normas técnicas (RGEU, Térmica, Acústica) para promover a reabilitação de edifícios antigos.',
        applicability: ['Reabilitação', 'Centros Históricos'],
        key_points: [
            'Critério da não sobrecarga',
            'Dispensa de requisitos impossíveis em preexistências',
            'Foco na melhoria progressiva do desempenho'
        ]
    },
    'lei-solos': {
        id: 'lei-solos',
        title: 'Lei de Bases de Ordenamento do Território e Urbanismo',
        year: 'Lei n.º 31/2014',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/lei/31-2014-25407001',
        summary: 'Define a classificação (urbano/rústico) e qualificação dos solos.',
        applicability: ['Planeamento', 'PDM'],
        key_points: [
            'Classificação do solo',
            'Direitos de edificabilidade',
            'Execução de planos'
        ]
    },
    'reh': {
        id: 'reh',
        title: 'Regulamento de Desempenho Energético dos Edifícios de Habitação (REH)',
        year: 'Decreto-Lei n.º 101-D/2020',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/101-d-2020-150495804',
        summary: 'Regras sobre comportamento térmico e eficiência energética para edifícios de habitação.',
        applicability: ['Térmica', 'Eficiência Energética', 'Habitação'],
        key_points: [
            'Requisitos mínimos de isolamento',
            'Sistemas de climatização e energias renováveis',
            'Certificação Energética obrigatória'
        ]
    },
    'recs': {
        id: 'recs',
        title: 'Regulamento de Desempenho Energético dos Edifícios de Comércio e Serviços (RECS)',
        year: 'Decreto-Lei n.º 101-D/2020',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/101-d-2020-150495804',
        summary: 'Aplicação de regras de eficiência energética a edifícios não habitacionais.',
        applicability: ['Térmica', 'Serviços', 'Comércio'],
        key_points: [
            'Sistemas de Ventilação e QAI',
            ' Auditorias energéticas periódicas',
            'Metas de descarbonização'
        ]
    },
    'ited': {
        id: 'ited',
        title: 'Infraestruturas de Telecomunicações em Edifícios (ITED)',
        year: 'Decreto-Lei n.º 123/2009 (Consolidado)',
        official_link: 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2009-34509176',
        summary: 'Regulamenta o projeto e instalação de redes de telecomunicações.',
        applicability: ['Telecomunicações', 'Redes'],
        key_points: [
            'Obrigatoriedade de fibra ótica',
            'Dimensionamento de armários (ATI/ATE)',
            'Certificação por instalador credenciado'
        ]
    },
    'gas': {
        id: 'gas',
        title: 'Instalações de Gás em Edifícios',
        year: 'Decreto-Lei n.º 97/2017',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/97-2017-107981313',
        summary: 'Segurança e execução de redes de gás combustível.',
        applicability: ['Gás', 'Segurança Técnica'],
        key_points: [
            'Ventilação de locais com aparelhos a gás',
            'Inspeções periódicas',
            'Materiais e traçados permitidos'
        ]
    }
};
