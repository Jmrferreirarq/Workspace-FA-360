
import { LawStructure } from './rjue_structure';

export const acessibilidadesStructure: LawStructure = {
    id: 'acessibilidades',
    title: 'Regime da Acessibilidade',
    description: 'Decreto-Lei n.º 163/2006, de 8 de agosto.',
    articles: [
        {
            id: 'art-10',
            number: 'Capitulo 2.1',
            title: 'Percursos Acessiveis',
            content: 'Os percursos devem ter uma largura util nao inferior a 1,20m e inclinacoes que nao ultrapassem os limites definidos.',
            architect_note: 'A famosa regra do 1.20m. Essencial em atrios de predios e espacos publicos.'
        },
        {
            id: 'art-22',
            number: 'Capitulo 2.2',
            title: 'Portas e Vaos',
            content: 'A largura util das portas nao deve ser inferior a 0,77m.',
            architect_note: 'Na pratica, usamos folha de 80cm ou 90cm para garantir a passagem livre de cadeiras de rodas.'
        },
        {
            id: 'art-3',
            number: 'Artigo 10.º',
            title: 'Isencoes e Ajustamentos razoaveis',
            content: 'Em edificios existentes, sao permitidos ajustamentos razoaveis quando a conformidade total for impossivel.',
            architect_note: 'Frequentemente usado em lojas antigas onde nao ha espaco para rampas com a inclinacao ideal. Exige termo de responsabilidade especifico.',
            simplex_2024_update: 'O Simplex facilitou a aceitacao de solucoes alternativas de acessibilidade.'
        }
    ]
};
