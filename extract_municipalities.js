
const fs = require('fs');
const municipalities = require('portuguese-municipalities');

// The package usually returns an array or object. Let's inspect.
// Assuming array of { name, district, ... }

// Manual map for verified ones to preserve their data
const verifiedMap = {
    'Aveiro': {
        verified: true,
        pdm_links: {
            landing_page: 'https://www.cm-aveiro.pt/servicos/ordenamento-do-territorio-e-urbanismo/instrumentos-de-gestao-territorial/plano-diretor-municipal',
            regulation_pdf: 'https://www.cm-aveiro.pt/terras-do-municipio/ordenamento-do-territorio/plano-diretor-municipal-1-a-revisao/regulamento-1-a-revisao',
            geoportal: 'https://cmasmiga.pt/'
        }
    },
    'Lisboa': {
        verified: true,
        pdm_links: {
            landing_page: 'https://www.lisboa.pt/cidade/urbanismo/planeamento-urbano/pdm-em-vigor',
            regulation_pdf: 'https://www.lisboa.pt/fileadmin/cidade_temas/urbanismo/planeamento_urbano/pdm_em_vigor/regulamento/Regulamento_PDM_2012_Consolidado_com_Alteracoes_2020.pdf',
            geoportal: 'https://geoportal.cm-lisboa.pt/'
        }
    },
    'Porto': {
        verified: true,
        pdm_links: {
            landing_page: 'https://pdm.cm-porto.pt/',
            regulation_pdf: 'https://pdm.cm-porto.pt/documentos/regulamento-do-pdm-do-porto',
            geoportal: 'https://pdm.cm-porto.pt/mapas-interativos'
        }
    }
};

const municipalityList = municipalities.map(m => {
    // Basic sanitization
    const name = m.name || m; // Handle if it's just strings or object
    const district = m.district || 'Desconhecido';

    // Create ID (slug)
    const id = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');

    const verifiedData = verifiedMap[name];

    return {
        id: id,
        name: name,
        district: district,
        region: 'Portugal', // Default region if missing
        ...verifiedData
    };
});

const tsContent = `export interface Municipality {
    id: string;
    name: string;
    district: string;
    region: string; // NUTS II or similar
    pdm_links?: {
        landing_page?: string;
        regulation_pdf?: string;
        geoportal?: string;
    };
    verified?: boolean;
}

export const municipalities: Municipality[] = ${JSON.stringify(municipalityList, null, 4)};`;

console.log(tsContent);
