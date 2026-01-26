
export interface LawArticle {
    id: string;
    number: string;
    title: string;
    content: string;
    architect_note?: string;
    simplex_2024_update?: string;
}

export interface LawStructure {
    id: string;
    title: string;
    description: string;
    articles: LawArticle[];
}

export const rjueStructure: LawStructure = {
    id: 'rjue',
    title: 'Regime Jurídico da Urbanização e da Edificação (RJUE)',
    description: 'Decreto-Lei n.º 555/99, de 16 de dezembro (Republicação pelo DL 10/2024).',
    articles: [
        {
            id: 'art-4',
            number: 'Artigo 4.º',
            title: 'Licença e Comunicação Prévia',
            content: 'As operações urbanísticas dependem de licenciamento ou de comunicação prévia, ressalvadas as situações de isenção previstas no presente diploma.',
            architect_note: 'Este artigo define a "porta de entrada" de qualquer projeto. O licenciamento é a regra para obras complexas, enquanto a comunicação prévia é usada para operações em loteamentos ou áreas com plano de pormenor.',
            simplex_2024_update: 'O Simplex 2024 reforçou a utilização da comunicação prévia em detrimento da licença em diversas situações.'
        },
        {
            id: 'art-6',
            number: 'Artigo 6.º',
            title: 'Isenção de controlo prévio',
            content: 'Estão isentas de qualquer procedimento de controlo prévio: \n a) Obras de conservação; \n b) Obras de alteração no interior de edifícios se não afetarem a estrutura, a cércea ou a fachada; \n c) Pequenas obras de escassa relevância.',
            architect_note: 'As isenções do Artigo 6º são fundamentais. Obras de interiores em apartamentos (desde que estruturalmente intactos) não precisam de submissão à Câmara.',
            simplex_2024_update: 'O Simplex 2024 alargou significativamente as isenções, eliminando a necessidade de controlo em situações que anteriormente exigiam licenciamento.'
        },
        {
            id: 'art-6A',
            number: 'Artigo 6.º-A',
            title: 'Obras de escassa relevância urbanística',
            content: 'Consideram-se obras de escassa relevância as que consistam na edificação de muros, vedações, estufas, e outras de pequena dimensão.',
            architect_note: 'Cada município pode definir o que entende por escassa relevância no seu próprio regulamento municipal, baseando-se neste artigo.',
            simplex_2024_update: 'Introduziu-se maior clareza sobre o que constitui escassa relevância a nível nacional.'
        },
        {
            id: 'art-10',
            number: 'Artigo 10.º',
            title: 'Instrução do pedido',
            content: 'O pedido de licenciamento ou a comunicação prévia devem ser instruídos com os projetos de arquitetura e especialidades, termos de responsabilidade e outros elementos definidos em portaria.',
            architect_note: 'A instrução correta é a chave para evitar rejeições liminares. Verifique sempre a Portaria n.º 71-A/2024 para a lista atualizada de documentos.',
            simplex_2024_update: 'Foram eliminados vários documentos "burocráticos", como o alvará de construção, que foi substituído pelo comprovativo de pagamento.'
        },
        {
            id: 'art-23',
            number: 'Artigo 23.º',
            title: 'Prazos de decisão',
            content: 'A decisão sobre o licenciamento deve ser proferida no prazo máximo de 120 dias para projetos de arquitetura.',
            architect_note: 'O cumprimento destes prazos é muitas vezes o maior problema prático. O sistema atual de deferimento tácito tenta mitigar este atraso.',
            simplex_2024_update: 'O Simplex 2024 tornou os prazos mais vinculativos e reforçou o mecanismo de deferimento tácito.'
        }
    ]
};
