
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
    title: 'Regime Juridico da Urbanizacao e da Edificacao (RJUE)',
    description: 'Decreto-Lei n.º 555/99, de 16 de dezembro (Republicacao pelo DL 10/2024).',
    articles: [
        {
            id: 'art-4',
            number: 'Artigo 4.º',
            title: 'Licenca e Comunicacao Previa',
            content: 'As operacoes urbanisticas dependem de licenciamento ou de comunicacao previa, ressalvadas as situacoes de isencao previstas no presente diploma.',
            architect_note: 'Este artigo define a "porta de entrada" de qualquer projeto. O licenciamento e a regra para obras complexas, enquanto a comunicacao previa e usada para operacoes em loteamentos ou areas com plano de pormenor.',
            simplex_2024_update: 'O Simplex 2024 reforcou a utilizacao da comunicacao previa em detrimento da licenca em diversas situacoes.'
        },
        {
            id: 'art-6',
            number: 'Artigo 6.º',
            title: 'Isencao de controlo previo',
            content: 'Estao isentas de qualquer procedimento de controlo previo: \n a) Obras de conservacao; \n b) Obras de alteracao no interior de edificios se nao afetarem a estrutura, a cercea ou a fachada; \n c) Pequenas obras de escassa relevancia.',
            architect_note: 'As isencoes do Artigo 6º sao fundamentais. Obras de interiores em apartamentos (desde que estruturalmente intactos) nao precisam de submissao a Camara.',
            simplex_2024_update: 'O Simplex 2024 alargou significativamente as isencoes, eliminando a necessidade de controlo em situacoes que anteriormente exigiam licenciamento.'
        },
        {
            id: 'art-6A',
            number: 'Artigo 6.º-A',
            title: 'Obras de escassa relevancia urbanistica',
            content: 'Consideram-se obras de escassa relevancia as que consistam na edificacao de muros, vedacoes, estufas, e outras de pequena dimensao.',
            architect_note: 'Cada municipio pode definir o que entende por escassa relevancia no seu proprio regulamento municipal, baseando-se neste artigo.',
            simplex_2024_update: 'Introduziu-se maior clareza sobre o que constitui escassa relevancia a nivel nacional.'
        },
        {
            id: 'art-10',
            number: 'Artigo 10.º',
            title: 'Instrucao do pedido',
            content: 'O pedido de licenciamento ou a comunicacao previa devem ser instruidos com os projetos de arquitetura e especialidades, termos de responsabilidade e outros elementos definidos em portaria.',
            architect_note: 'A instrucao correta e a chave para evitar rejeicoes liminares. Verifique sempre a Portaria n.º 71-A/2024 para a lista atualizada de documentos.',
            simplex_2024_update: 'Foram eliminados varios documentos "burocraticos", como o alvara de construcao, que foi substituido pelo comprovativo de pagamento.'
        },
        {
            id: 'art-23',
            number: 'Artigo 23.º',
            title: 'Prazos de decisao',
            content: 'A decisao sobre o licenciamento deve ser proferida no prazo maximo de 120 dias para projetos de arquitetura.',
            architect_note: 'O cumprimento destes prazos e muitas vezes o maior problema pratico. O sistema atual de deferimento tacito tenta mitigar este atraso.',
            simplex_2024_update: 'O Simplex 2024 tornou os prazos mais vinculativos e reforcou o mecanismo de deferimento tacito.'
        }
    ]
};
