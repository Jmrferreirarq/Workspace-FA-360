
import { LawStructure } from './rjue_structure';

export const reruStructure: LawStructure = {
    id: 'reru',
    title: 'Regime Excecional de Reabilitacao Urbana (RERU)',
    description: 'Decreto-Lei n.º 95/2019, de 18 de julho.',
    articles: [
        {
            id: 'art-4',
            number: 'Artigo 4.º',
            title: 'Principio da nao sobrecarga',
            content: 'As obras de reabilitacao nao devem agravar as condicoes de seguranca ou salubridade do edificio existente, mesmo que nao atinjam os niveis exigiveis para construcao nova.',
            architect_note: 'O principio mais importante da reabilitacao. Se o edificio ja existe e funciona, nao somos obrigados a "destrui-lo" para cumprir normas de 2024, desde que nao piore o que esta.'
        },
        {
            id: 'art-5',
            number: 'Artigo 5.º',
            title: 'Dispensa de requisitos',
            content: 'E permitida a dispensa de requisitos tecnicos relativos a acessibilidades, acustica e termica quando a sua aplicacao for tecnicamente inviavel ou prejudicar o valor patrimonial.',
            architect_note: 'Crucial para reabilitacao em Centros Historicos. Permite manter escadas originais ou janelas de madeira por razoes patrimoniais.'
        },
        {
            id: 'art-7',
            number: 'Artigo 7.º',
            title: 'Relatorio de Diagnostico',
            content: 'As operacoes de reabilitacao devem ser precedidas de um diagnostico preliminar sobre o estado de conservacao do edificio.',
            architect_note: 'Um bom diagnostico poupa imensas surpresas em obra e facilita a aprovacao da dispensa de normas.'
        }
    ]
};
