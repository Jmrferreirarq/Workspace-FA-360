
import { LawStructure } from './rjue_structure';

export const rgeuStructure: LawStructure = {
    id: 'rgeu',
    title: 'Regulamento Geral das Edificacoes Urbanas (RGEU)',
    description: 'Decreto-Lei n.º 38 382, de 7 de agosto de 1951 (com atualizacoes sucessivas).',
    articles: [
        {
            id: 'art-40',
            number: 'Artigo 40.º',
            title: 'Higiene e Salubridade',
            content: 'As edificacoes devem ser construidas e mantidas de forma a garantir as condicoes de higiene, salubridade e seguranca dos seus ocupantes.',
            architect_note: 'Este e o artigo "chapeu" para todas as questoes de saude publica em edificios.'
        },
        {
            id: 'art-65',
            number: 'Artigo 65.º',
            title: 'Pe-direito livre',
            content: 'O pe-direito livre minimo nas habitacoes e de 2,70 m, podendo ser de 2,20 m em corredores e instalacoes sanitarias.',
            architect_note: 'Atencao: Esta e uma das regras mais infringidas em reabilitacoes. O RERU permite flexibilizar este valor em casos especificos.',
            simplex_2024_update: 'O Simplex 2024 nao alterou o valor, mas simplificou a fiscalizacao.'
        },
        {
            id: 'art-66',
            number: 'Artigo 66.º',
            title: 'Dimensionamento de compartimentos',
            content: 'As areas minimas dos compartimentos sao: Sala 12m2, Quarto (casal) 10.5m2, Cozinha 6m2.',
            architect_note: 'Valores base para qualquer projeto de habitacao (T1, T2, etc). Verifique sempre o somatorio total para a tipologia.',
            simplex_2024_update: 'Houve clarificacoes sobre a fusao de cozinha e sala (kitchenettes).'
        },
        {
            id: 'art-71',
            number: 'Artigo 71.º',
            title: 'Iluminacao e Ventilacao',
            content: 'Todos os compartimentos habitaveis devem ser dotados de iluminacao e ventilacao naturais.',
            architect_note: 'A regra de ouro: 1/10 da area do pavimento para janelas. Quartos e salas nunca podem ser interiores sem janela.',
            simplex_2024_update: 'Introduziu-se maior abertura para mecanismos de ventilacao forcada em casos de impossibilidade tecnica.'
        }
    ]
};
