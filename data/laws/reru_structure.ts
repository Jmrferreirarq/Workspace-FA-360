
import { LawStructure } from './rjue_structure';

export const reruStructure: LawStructure = {
    id: 'reru',
    title: 'Regime Excecional de Reabilitação Urbana (RERU)',
    description: 'Decreto-Lei n.º 95/2019, de 18 de julho.',
    articles: [
        {
            id: 'art-4',
            number: 'Artigo 4.º',
            title: 'Princípio da não sobrecarga',
            content: 'As obras de reabilitação não devem agravar as condições de segurança ou salubridade do edifício existente, mesmo que não atinjam os níveis exigíveis para construção nova.',
            architect_note: 'O princípio mais importante da reabilitação. Se o edifício já existe e funciona, não somos obrigados a "destruí-lo" para cumprir normas de 2024, desde que não piore o que está.'
        },
        {
            id: 'art-5',
            number: 'Artigo 5.º',
            title: 'Dispensa de requisitos',
            content: 'É permitida a dispensa de requisitos técnicos relativos a acessibilidades, acústica e térmica quando a sua aplicação for tecnicamente inviável ou prejudicar o valor patrimonial.',
            architect_note: 'Crucial para reabilitação em Centros Históricos. Permite manter escadas originais ou janelas de madeira por razões patrimoniais.'
        },
        {
            id: 'art-7',
            number: 'Artigo 7.º',
            title: 'Relatório de Diagnóstico',
            content: 'As operações de reabilitação devem ser precedidas de um diagnóstico preliminar sobre o estado de conservação do edifício.',
            architect_note: 'Um bom diagnóstico poupa imensas surpresas em obra e facilita a aprovação da dispensa de normas.'
        }
    ]
};
