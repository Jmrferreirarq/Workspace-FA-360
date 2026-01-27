export interface Municipality {
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

export const municipalities: Municipality[] = [
    {
        "id": "abrantes",
        "name": "Abrantes",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "agueda",
        "name": "Agueda",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "aguiar-da-beira",
        "name": "Aguiar da Beira",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "alandroal",
        "name": "Alandroal",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "albergaria-a-velha",
        "name": "Albergaria-a-Velha",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "albufeira",
        "name": "Albufeira",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "alcacer-do-sal",
        "name": "Alcacer do Sal",
        "district": "Setubal",
        "region": "Alentejo"
    },
    {
        "id": "alcanena",
        "name": "Alcanena",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "alcobaca",
        "name": "Alcobaca",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "alcochete",
        "name": "Alcochete",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "alcoutim",
        "name": "Alcoutim",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "alenquer",
        "name": "Alenquer",
        "district": "Lisboa",
        "region": "Regiao do Centro"
    },
    {
        "id": "alfandega-da-fe",
        "name": "Alfandega da Fe",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "alijo",
        "name": "Alijo",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "aljezur",
        "name": "Aljezur",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "aljustrel",
        "name": "Aljustrel",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "almada",
        "name": "Almada",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "almeida",
        "name": "Almeida",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "almeirim",
        "name": "Almeirim",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "almodovar",
        "name": "Almodovar",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "alpiarca",
        "name": "Alpiarca",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "alter-do-chao",
        "name": "Alter do Chao",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "alvaiazere",
        "name": "Alvaiazere",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "alvito",
        "name": "Alvito",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "amadora",
        "name": "Amadora",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "amarante",
        "name": "Amarante",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "amares",
        "name": "Amares",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "anadia",
        "name": "Anadia",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "ansiao",
        "name": "Ansiao",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "arcos-de-valdevez",
        "name": "Arcos de Valdevez",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "arganil",
        "name": "Arganil",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "armamar",
        "name": "Armamar",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "arouca",
        "name": "Arouca",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "arraiolos",
        "name": "Arraiolos",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "arronches",
        "name": "Arronches",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "arruda-dos-vinhos",
        "name": "Arruda dos Vinhos",
        "district": "Lisboa",
        "region": "Regiao do Centro"
    },
    {
        "id": "aveiro",
        "name": "Aveiro",
        "district": "Aveiro",
        "region": "Regiao do Centro",
        "verified": true,
        "pdm_links": {
            "landing_page": "https://www.cm-aveiro.pt/servicos/ordenamento-do-territorio-e-urbanismo/instrumentos-de-gestao-territorial/plano-diretor-municipal",
            "regulation_pdf": "https://www.cm-aveiro.pt/terras-do-municipio/ordenamento-do-territorio/plano-diretor-municipal-1-a-revisao/regulamento-1-a-revisao",
            "geoportal": "https://cmasmiga.pt/"
        }
    },
    {
        "id": "avis",
        "name": "Avis",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "azambuja",
        "name": "Azambuja",
        "district": "Lisboa",
        "region": "Alentejo"
    },
    {
        "id": "baiao",
        "name": "Baiao",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "barcelos",
        "name": "Barcelos",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "barrancos",
        "name": "Barrancos",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "barreiro",
        "name": "Barreiro",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "batalha",
        "name": "Batalha",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "beja",
        "name": "Beja",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "belmonte",
        "name": "Belmonte",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "benavente",
        "name": "Benavente",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "bombarral",
        "name": "Bombarral",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "borba",
        "name": "Borba",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "boticas",
        "name": "Boticas",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "braga",
        "name": "Braga",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "braganca",
        "name": "Braganca",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "cabeceiras-de-basto[2]",
        "name": "Cabeceiras de Basto[2]",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "cadaval",
        "name": "Cadaval",
        "district": "Lisboa",
        "region": "Regiao do Centro"
    },
    {
        "id": "caldas-da-rainha",
        "name": "Caldas da Rainha",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "caminha",
        "name": "Caminha",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "campo-maior",
        "name": "Campo Maior",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "cantanhede",
        "name": "Cantanhede",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "carrazeda-de-ansiaes",
        "name": "Carrazeda de Ansiaes",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "carregal-do-sal",
        "name": "Carregal do Sal",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "cartaxo",
        "name": "Cartaxo",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "cascais",
        "name": "Cascais",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "castanheira-de-pera",
        "name": "Castanheira de Pera",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "castelo-branco",
        "name": "Castelo Branco",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "castelo-de-paiva",
        "name": "Castelo de Paiva",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "castelo-de-vide",
        "name": "Castelo de Vide",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "castro-daire",
        "name": "Castro Daire",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "castro-marim",
        "name": "Castro Marim",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "castro-verde",
        "name": "Castro Verde",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "celorico-da-beira",
        "name": "Celorico da Beira",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "celorico-de-basto",
        "name": "Celorico de Basto",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "chamusca",
        "name": "Chamusca",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "chaves",
        "name": "Chaves",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "cinfaes",
        "name": "Cinfaes",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "coimbra",
        "name": "Coimbra",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "condeixa-a-nova",
        "name": "Condeixa-a-Nova",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "constancia",
        "name": "Constancia",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "coruche",
        "name": "Coruche",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "covilha",
        "name": "Covilha",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "crato",
        "name": "Crato",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "cuba",
        "name": "Cuba",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "elvas",
        "name": "Elvas",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "entroncamento",
        "name": "Entroncamento",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "espinho",
        "name": "Espinho",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "esposende",
        "name": "Esposende",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "estarreja",
        "name": "Estarreja",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "estremoz",
        "name": "Estremoz",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "evora",
        "name": "Evora",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "fafe",
        "name": "Fafe",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "faro",
        "name": "Faro",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "felgueiras",
        "name": "Felgueiras",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "ferreira-do-alentejo",
        "name": "Ferreira do Alentejo",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "ferreira-do-zezere",
        "name": "Ferreira do Zezere",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "figueira-da-foz",
        "name": "Figueira da Foz",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "figueira-de-castelo-rodrigo",
        "name": "Figueira de Castelo Rodrigo",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "figueiro-dos-vinhos",
        "name": "Figueiro dos Vinhos",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "fornos-de-algodres",
        "name": "Fornos de Algodres",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "freixo-de-espada-a-cinta",
        "name": "Freixo de Espada a Cinta",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "fronteira",
        "name": "Fronteira",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "fundao",
        "name": "Fundao",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "gaviao",
        "name": "Gaviao",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "gois",
        "name": "Gois",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "golega",
        "name": "Golega",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "gondomar",
        "name": "Gondomar",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "gouveia",
        "name": "Gouveia",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "grandola",
        "name": "Grandola",
        "district": "Setubal",
        "region": "Alentejo"
    },
    {
        "id": "guarda",
        "name": "Guarda",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "guimaraes",
        "name": "Guimaraes",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "idanha-a-nova",
        "name": "Idanha-a-Nova",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "ilhavo",
        "name": "Ilhavo",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "lagoa",
        "name": "Lagoa",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "lagos",
        "name": "Lagos",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "lamego",
        "name": "Lamego",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "leiria",
        "name": "Leiria",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "lisboa",
        "name": "Lisboa",
        "district": "Lisboa",
        "region": "Regiao de Lisboa",
        "verified": true,
        "pdm_links": {
            "landing_page": "https://www.lisboa.pt/cidade/urbanismo/planeamento-urbano/pdm-em-vigor",
            "regulation_pdf": "https://www.lisboa.pt/fileadmin/cidade_temas/urbanismo/planeamento_urbano/pdm_em_vigor/regulamento/Regulamento_PDM_2012_Consolidado_com_Alteracoes_2020.pdf",
            "geoportal": "https://geoportal.cm-lisboa.pt/"
        }
    },
    {
        "id": "loule",
        "name": "Loule",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "loures",
        "name": "Loures",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "lourinha",
        "name": "Lourinha",
        "district": "Lisboa",
        "region": "Regiao do Centro"
    },
    {
        "id": "lousa",
        "name": "Lousa",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "lousada",
        "name": "Lousada",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "macao-[5]",
        "name": "Macao [5]",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "macedo-de-cavaleiros",
        "name": "Macedo de Cavaleiros",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "mafra",
        "name": "Mafra",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "maia",
        "name": "Maia",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "mangualde",
        "name": "Mangualde",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "manteigas",
        "name": "Manteigas",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "marco-de-canaveses",
        "name": "Marco de Canaveses",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "marinha-grande",
        "name": "Marinha Grande",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "marvao",
        "name": "Marvao",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "matosinhos",
        "name": "Matosinhos",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "mealhada[2]",
        "name": "Mealhada[2]",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "meda",
        "name": "Meda",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "melgaco",
        "name": "Melgaco",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "mertola",
        "name": "Mertola",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "mesao-frio",
        "name": "Mesao Frio",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "mira",
        "name": "Mira",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "miranda-do-corvo",
        "name": "Miranda do Corvo",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "miranda-do-douro",
        "name": "Miranda do Douro",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "mirandela",
        "name": "Mirandela",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "mogadouro",
        "name": "Mogadouro",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "moimenta-da-beira",
        "name": "Moimenta da Beira",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "moita",
        "name": "Moita",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "moncao",
        "name": "Moncao",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "monchique",
        "name": "Monchique",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "mondim-de-basto[2]",
        "name": "Mondim de Basto[2]",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "monforte",
        "name": "Monforte",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "montalegre",
        "name": "Montalegre",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "montemor-o-novo",
        "name": "Montemor-o-Novo",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "montemor-o-velho",
        "name": "Montemor-o-Velho",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "montijo",
        "name": "Montijo",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "mora[4]",
        "name": "Mora[4]",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "mortagua[2]",
        "name": "Mortagua[2]",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "moura",
        "name": "Moura",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "mourao",
        "name": "Mourao",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "murca",
        "name": "Murca",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "murtosa",
        "name": "Murtosa",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "nazare",
        "name": "Nazare",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "nelas",
        "name": "Nelas",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "nisa",
        "name": "Nisa",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "obidos",
        "name": "Obidos",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "odemira",
        "name": "Odemira",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "odivelas",
        "name": "Odivelas",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "oeiras",
        "name": "Oeiras",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "oleiros",
        "name": "Oleiros",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "olhao",
        "name": "Olhao",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "oliveira-de-azemeis",
        "name": "Oliveira de Azemeis",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "oliveira-de-frades",
        "name": "Oliveira de Frades",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "oliveira-do-bairro",
        "name": "Oliveira do Bairro",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "oliveira-do-hospital",
        "name": "Oliveira do Hospital",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "ourem",
        "name": "Ourem",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "ourique",
        "name": "Ourique",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "ovar",
        "name": "Ovar",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "pacos-de-ferreira",
        "name": "Pacos de Ferreira",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "palmela",
        "name": "Palmela",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "pampilhosa-da-serra",
        "name": "Pampilhosa da Serra",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "paredes",
        "name": "Paredes",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "paredes-de-coura",
        "name": "Paredes de Coura",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "pedrogao-grande",
        "name": "Pedrogao Grande",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "penacova",
        "name": "Penacova",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "penafiel",
        "name": "Penafiel",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "penalva-do-castelo",
        "name": "Penalva do Castelo",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "penamacor",
        "name": "Penamacor",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "penedono",
        "name": "Penedono",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "penela",
        "name": "Penela",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "peniche",
        "name": "Peniche",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "peso-da-regua",
        "name": "Peso da Regua",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "pinhel",
        "name": "Pinhel",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "pombal",
        "name": "Pombal",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "ponte-da-barca",
        "name": "Ponte da Barca",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "ponte-de-lima",
        "name": "Ponte de Lima",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "ponte-de-sor",
        "name": "Ponte de Sor",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "portalegre",
        "name": "Portalegre",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "portel",
        "name": "Portel",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "portimao",
        "name": "Portimao",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "porto",
        "name": "Porto",
        "district": "Porto",
        "region": "Regiao do Norte",
        "verified": true,
        "pdm_links": {
            "landing_page": "https://pdm.cm-porto.pt/",
            "regulation_pdf": "https://pdm.cm-porto.pt/documentos/regulamento-do-pdm-do-porto",
            "geoportal": "https://pdm.cm-porto.pt/mapas-interativos"
        }
    },
    {
        "id": "porto-de-mos",
        "name": "Porto de Mos",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "povoa-de-lanhoso",
        "name": "Povoa de Lanhoso",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "povoa-de-varzim",
        "name": "Povoa de Varzim",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "proenca-a-nova",
        "name": "Proenca-a-Nova",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "redondo",
        "name": "Redondo",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "reguengos-de-monsaraz",
        "name": "Reguengos de Monsaraz",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "resende",
        "name": "Resende",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "ribeira-de-pena",
        "name": "Ribeira de Pena",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "rio-maior",
        "name": "Rio Maior",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "sabrosa",
        "name": "Sabrosa",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "sabugal",
        "name": "Sabugal",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "salvaterra-de-magos",
        "name": "Salvaterra de Magos",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "santa-comba-dao",
        "name": "Santa Comba Dao",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "santa-maria-da-feira",
        "name": "Santa Maria da Feira",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "santa-marta-de-penaguiao",
        "name": "Santa Marta de Penaguiao",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "santarem",
        "name": "Santarem",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "santiago-do-cacem",
        "name": "Santiago do Cacem",
        "district": "Setubal",
        "region": "Alentejo"
    },
    {
        "id": "santo-tirso[2]",
        "name": "Santo Tirso[2]",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "sao-bras-de-alportel",
        "name": "Sao Bras de Alportel",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "sao-joao-da-madeira",
        "name": "Sao Joao da Madeira",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "sao-joao-da-pesqueira",
        "name": "Sao Joao da Pesqueira",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "sao-pedro-do-sul",
        "name": "Sao Pedro do Sul",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "sardoal",
        "name": "Sardoal",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "satao",
        "name": "Satao",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "seia",
        "name": "Seia",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "seixal",
        "name": "Seixal",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "sernancelhe",
        "name": "Sernancelhe",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "serpa",
        "name": "Serpa",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "serta",
        "name": "Serta",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "sesimbra",
        "name": "Sesimbra",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "setubal",
        "name": "Setubal",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "sever-do-vouga",
        "name": "Sever do Vouga",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "silves",
        "name": "Silves",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "sines",
        "name": "Sines",
        "district": "Setubal",
        "region": "Alentejo"
    },
    {
        "id": "sintra",
        "name": "Sintra",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "sobral-de-monte-agraco",
        "name": "Sobral de Monte Agraco",
        "district": "Lisboa",
        "region": "Regiao do Centro"
    },
    {
        "id": "soure",
        "name": "Soure",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "sousel[4]",
        "name": "Sousel[4]",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "tabua",
        "name": "Tabua",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "tabuaco",
        "name": "Tabuaco",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "tarouca",
        "name": "Tarouca",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "tavira",
        "name": "Tavira",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "terras-de-bouro",
        "name": "Terras de Bouro",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "tomar",
        "name": "Tomar",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "tondela",
        "name": "Tondela",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "torre-de-moncorvo",
        "name": "Torre de Moncorvo",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "torres-novas",
        "name": "Torres Novas",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "torres-vedras",
        "name": "Torres Vedras",
        "district": "Lisboa",
        "region": "Regiao do Centro"
    },
    {
        "id": "trancoso",
        "name": "Trancoso",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "trofa[2]",
        "name": "Trofa[2]",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "vagos",
        "name": "Vagos",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "vale-de-cambra",
        "name": "Vale de Cambra",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "valenca",
        "name": "Valenca",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "valongo",
        "name": "Valongo",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "valpacos",
        "name": "Valpacos",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "vendas-novas",
        "name": "Vendas Novas",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "viana-do-alentejo",
        "name": "Viana do Alentejo",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "viana-do-castelo",
        "name": "Viana do Castelo",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "vidigueira",
        "name": "Vidigueira",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "vieira-do-minho",
        "name": "Vieira do Minho",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-de-rei",
        "name": "Vila de Rei",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "vila-do-bispo",
        "name": "Vila do Bispo",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "vila-do-conde",
        "name": "Vila do Conde",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-flor[2]",
        "name": "Vila Flor[2]",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-franca-de-xira",
        "name": "Vila Franca de Xira",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "vila-nova-da-barquinha",
        "name": "Vila Nova da Barquinha",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "vila-nova-de-cerveira",
        "name": "Vila Nova de Cerveira",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-nova-de-famalicao",
        "name": "Vila Nova de Famalicao",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-nova-de-foz-coa",
        "name": "Vila Nova de Foz Coa",
        "district": "Guarda",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-nova-de-gaia",
        "name": "Vila Nova de Gaia",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-nova-de-paiva",
        "name": "Vila Nova de Paiva",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "vila-nova-de-poiares",
        "name": "Vila Nova de Poiares",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "vila-pouca-de-aguiar",
        "name": "Vila Pouca de Aguiar",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-real",
        "name": "Vila Real",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-real-de-santo-antonio",
        "name": "Vila Real de Santo Antonio",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "vila-velha-de-rodao",
        "name": "Vila Velha de Rodao",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "vila-verde",
        "name": "Vila Verde",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-vicosa",
        "name": "Vila Vicosa",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "vimioso",
        "name": "Vimioso",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "vinhais",
        "name": "Vinhais",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "viseu",
        "name": "Viseu",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "vizela",
        "name": "Vizela",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "vouzela",
        "name": "Vouzela",
        "district": "Viseu",
        "region": "Regiao do Centro"
    }
];