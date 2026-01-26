
import { LawStructure } from './rjue_structure';

export const rgeuStructure: LawStructure = {
    id: 'rgeu',
    title: 'Regulamento Geral das Edificações Urbanas (RGEU)',
    description: 'Decreto-Lei n.º 38 382, de 7 de agosto de 1951 (com atualizações sucessivas).',
    articles: [
        {
            id: 'art-40',
            number: 'Artigo 40.º',
            title: 'Higiene e Salubridade',
            content: 'As edificações devem ser construídas e mantidas de forma a garantir as condições de higiene, salubridade e segurança dos seus ocupantes.',
            architect_note: 'Este é o artigo "chapéu" para todas as questões de saúde pública em edifícios.'
        },
        {
            id: 'art-65',
            number: 'Artigo 65.º',
            title: 'Pé-direito livre',
            content: 'O pé-direito livre mínimo nas habitações é de 2,70 m, podendo ser de 2,20 m em corredores e instalações sanitárias.',
            architect_note: 'Atenção: Esta é uma das regras mais infringidas em reabilitações. O RERU permite flexibilizar este valor em casos específicos.',
            simplex_2024_update: 'O Simplex 2024 não alterou o valor, mas simplificou a fiscalização.'
        },
        {
            id: 'art-66',
            number: 'Artigo 66.º',
            title: 'Dimensionamento de compartimentos',
            content: 'As áreas mínimas dos compartimentos são: Sala 12m2, Quarto (casal) 10.5m2, Cozinha 6m2.',
            architect_note: 'Valores base para qualquer projeto de habitação (T1, T2, etc). Verifique sempre o somatório total para a tipologia.',
            simplex_2024_update: 'Houve clarificações sobre a fusão de cozinha e sala (kitchenettes).'
        },
        {
            id: 'art-71',
            number: 'Artigo 71.º',
            title: 'Iluminação e Ventilação',
            content: 'Todos os compartimentos habitáveis devem ser dotados de iluminação e ventilação naturais.',
            architect_note: 'A regra de ouro: 1/10 da área do pavimento para janelas. Quartos e salas nunca podem ser interiores sem janela.',
            simplex_2024_update: 'Introduziu-se maior abertura para mecanismos de ventilação forçada em casos de impossibilidade técnica.'
        }
    ]
};
