
import { LawStructure } from './rjue_structure';

export const acessibilidadesStructure: LawStructure = {
    id: 'acessibilidades',
    title: 'Regime da Acessibilidade',
    description: 'Decreto-Lei n.º 163/2006, de 8 de agosto.',
    articles: [
        {
            id: 'art-10',
            number: 'Capítulo 2.1',
            title: 'Percursos Acessíveis',
            content: 'Os percursos devem ter uma largura útil não inferior a 1,20m e inclinações que não ultrapassem os limites definidos.',
            architect_note: 'A famosa regra do 1.20m. Essencial em átrios de prédios e espaços públicos.'
        },
        {
            id: 'art-22',
            number: 'Capítulo 2.2',
            title: 'Portas e Vãos',
            content: 'A largura útil das portas não deve ser inferior a 0,77m.',
            architect_note: 'Na prática, usamos folha de 80cm ou 90cm para garantir a passagem livre de cadeiras de rodas.'
        },
        {
            id: 'art-3',
            number: 'Artigo 10.º',
            title: 'Isenções e Ajustamentos razoáveis',
            content: 'Em edifícios existentes, são permitidos ajustamentos razoáveis quando a conformidade total for impossível.',
            architect_note: 'Frequentemente usado em lojas antigas onde não há espaço para rampas com a inclinação ideal. Exige termo de responsabilidade específico.',
            simplex_2024_update: 'O Simplex facilitou a aceitação de soluções alternativas de acessibilidade.'
        }
    ]
};
