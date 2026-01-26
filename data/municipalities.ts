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
        "district": "Santarém",
        "region": "Região do Centro"
    },
    {
        "id": "agueda",
        "name": "Águeda",
        "district": "Aveiro",
        "region": "Região do Centro"
    },
    {
        "id": "aguiar-da-beira",
        "name": "Aguiar da Beira",
        "district": "Guarda",
        "region": "Região do Centro"
    },
    {
        "id": "alandroal",
        "name": "Alandroal",
        "district": "Évora",
        "region": "Alentejo"
    },
    {
        "id": "albergaria-a-velha",
        "name": "Albergaria-a-Velha",
        "district": "Aveiro",
        "region": "Região do Centro"
    },
    {
        "id": "albufeira",
        "name": "Albufeira",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "alcacer-do-sal",
        "name": "Alcácer do Sal",
        "district": "Setúbal",
        "region": "Alentejo"
    },
    {
        "id": "alcanena",
        "name": "Alcanena",
        "district": "Santarém",
        "region": "Região do Centro"
    },
    {
        "id": "alcobaca",
        "name": "Alcobaça",
        "district": "Leiria",
        "region": "Região do Centro"
    },
    {
        "id": "alcochete",
        "name": "Alcochete",
        "district": "Setúbal",
        "region": "Região de Lisboa"
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
        "region": "Região do Centro"
    },
    {
        "id": "alfandega-da-fe",
        "name": "Alfândega da Fé",
        "district": "Bragança",
        "region": "Região do Norte"
    },
    {
        "id": "alijo",
        "name": "Alijó",
        "district": "Vila Real",
        "region": "Região do Norte"
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
        "district": "Setúbal",
        "region": "Região de Lisboa"
    },
    {
        "id": "almeida",
        "name": "Almeida",
        "district": "Guarda",
        "region": "Região do Centro"
    },
    {
        "id": "almeirim",
        "name": "Almeirim",
        "district": "Santarém",
        "region": "Alentejo"
    },
    {
        "id": "almodovar",
        "name": "Almodôvar",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "alpiarca",
        "name": "Alpiarça",
        "district": "Santarém",
        "region": "Alentejo"
    },
    {
        "id": "alter-do-chao",
        "name": "Alter do Chão",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "alvaiazere",
        "name": "Alvaiázere",
        "district": "Leiria",
        "region": "Região do Centro"
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
        "region": "Região de Lisboa"
    },
    {
        "id": "amarante",
        "name": "Amarante",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "amares",
        "name": "Amares",
        "district": "Braga",
        "region": "Região do Norte"
    },
    {
        "id": "anadia",
        "name": "Anadia",
        "district": "Aveiro",
        "region": "Região do Centro"
    },
    {
        "id": "ansiao",
        "name": "Ansião",
        "district": "Leiria",
        "region": "Região do Centro"
    },
    {
        "id": "arcos-de-valdevez",
        "name": "Arcos de Valdevez",
        "district": "Viana do Castelo",
        "region": "Região do Norte"
    },
    {
        "id": "arganil",
        "name": "Arganil",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "armamar",
        "name": "Armamar",
        "district": "Viseu",
        "region": "Região do Norte"
    },
    {
        "id": "arouca",
        "name": "Arouca",
        "district": "Aveiro",
        "region": "Região do Norte"
    },
    {
        "id": "arraiolos",
        "name": "Arraiolos",
        "district": "Évora",
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
        "region": "Região do Centro"
    },
    {
        "id": "aveiro",
        "name": "Aveiro",
        "district": "Aveiro",
        "region": "Região do Centro",
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
        "name": "Baião",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "barcelos",
        "name": "Barcelos",
        "district": "Braga",
        "region": "Região do Norte"
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
        "district": "Setúbal",
        "region": "Região de Lisboa"
    },
    {
        "id": "batalha",
        "name": "Batalha",
        "district": "Leiria",
        "region": "Região do Centro"
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
        "region": "Região do Centro"
    },
    {
        "id": "benavente",
        "name": "Benavente",
        "district": "Santarém",
        "region": "Alentejo"
    },
    {
        "id": "bombarral",
        "name": "Bombarral",
        "district": "Leiria",
        "region": "Região do Centro"
    },
    {
        "id": "borba",
        "name": "Borba",
        "district": "Évora",
        "region": "Alentejo"
    },
    {
        "id": "boticas",
        "name": "Boticas",
        "district": "Vila Real",
        "region": "Região do Norte"
    },
    {
        "id": "braga",
        "name": "Braga",
        "district": "Braga",
        "region": "Região do Norte"
    },
    {
        "id": "braganca",
        "name": "Bragança",
        "district": "Bragança",
        "region": "Região do Norte"
    },
    {
        "id": "cabeceiras-de-basto[2]",
        "name": "Cabeceiras de Basto[2]",
        "district": "Braga",
        "region": "Região do Norte"
    },
    {
        "id": "cadaval",
        "name": "Cadaval",
        "district": "Lisboa",
        "region": "Região do Centro"
    },
    {
        "id": "caldas-da-rainha",
        "name": "Caldas da Rainha",
        "district": "Leiria",
        "region": "Região do Centro"
    },
    {
        "id": "caminha",
        "name": "Caminha",
        "district": "Viana do Castelo",
        "region": "Região do Norte"
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
        "region": "Região do Centro"
    },
    {
        "id": "carrazeda-de-ansiaes",
        "name": "Carrazeda de Ansiães",
        "district": "Bragança",
        "region": "Região do Norte"
    },
    {
        "id": "carregal-do-sal",
        "name": "Carregal do Sal",
        "district": "Viseu",
        "region": "Região do Centro"
    },
    {
        "id": "cartaxo",
        "name": "Cartaxo",
        "district": "Santarém",
        "region": "Alentejo"
    },
    {
        "id": "cascais",
        "name": "Cascais",
        "district": "Lisboa",
        "region": "Região de Lisboa"
    },
    {
        "id": "castanheira-de-pera",
        "name": "Castanheira de Pera",
        "district": "Leiria",
        "region": "Região do Centro"
    },
    {
        "id": "castelo-branco",
        "name": "Castelo Branco",
        "district": "Castelo Branco",
        "region": "Região do Centro"
    },
    {
        "id": "castelo-de-paiva",
        "name": "Castelo de Paiva",
        "district": "Aveiro",
        "region": "Região do Norte"
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
        "region": "Região do Centro"
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
        "region": "Região do Centro"
    },
    {
        "id": "celorico-de-basto",
        "name": "Celorico de Basto",
        "district": "Braga",
        "region": "Região do Norte"
    },
    {
        "id": "chamusca",
        "name": "Chamusca",
        "district": "Santarém",
        "region": "Alentejo"
    },
    {
        "id": "chaves",
        "name": "Chaves",
        "district": "Vila Real",
        "region": "Região do Norte"
    },
    {
        "id": "cinfaes",
        "name": "Cinfães",
        "district": "Viseu",
        "region": "Região do Norte"
    },
    {
        "id": "coimbra",
        "name": "Coimbra",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "condeixa-a-nova",
        "name": "Condeixa-a-Nova",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "constancia",
        "name": "Constância",
        "district": "Santarém",
        "region": "Região do Centro"
    },
    {
        "id": "coruche",
        "name": "Coruche",
        "district": "Santarém",
        "region": "Alentejo"
    },
    {
        "id": "covilha",
        "name": "Covilhã",
        "district": "Castelo Branco",
        "region": "Região do Centro"
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
        "district": "Santarém",
        "region": "Região do Centro"
    },
    {
        "id": "espinho",
        "name": "Espinho",
        "district": "Aveiro",
        "region": "Região do Norte"
    },
    {
        "id": "esposende",
        "name": "Esposende",
        "district": "Braga",
        "region": "Região do Norte"
    },
    {
        "id": "estarreja",
        "name": "Estarreja",
        "district": "Aveiro",
        "region": "Região do Centro"
    },
    {
        "id": "estremoz",
        "name": "Estremoz",
        "district": "Évora",
        "region": "Alentejo"
    },
    {
        "id": "evora",
        "name": "Évora",
        "district": "Évora",
        "region": "Alentejo"
    },
    {
        "id": "fafe",
        "name": "Fafe",
        "district": "Braga",
        "region": "Região do Norte"
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
        "region": "Região do Norte"
    },
    {
        "id": "ferreira-do-alentejo",
        "name": "Ferreira do Alentejo",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "ferreira-do-zezere",
        "name": "Ferreira do Zêzere",
        "district": "Santarém",
        "region": "Região do Centro"
    },
    {
        "id": "figueira-da-foz",
        "name": "Figueira da Foz",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "figueira-de-castelo-rodrigo",
        "name": "Figueira de Castelo Rodrigo",
        "district": "Guarda",
        "region": "Região do Centro"
    },
    {
        "id": "figueiro-dos-vinhos",
        "name": "Figueiró dos Vinhos",
        "district": "Leiria",
        "region": "Região do Centro"
    },
    {
        "id": "fornos-de-algodres",
        "name": "Fornos de Algodres",
        "district": "Guarda",
        "region": "Região do Centro"
    },
    {
        "id": "freixo-de-espada-a-cinta",
        "name": "Freixo de Espada à Cinta",
        "district": "Bragança",
        "region": "Região do Norte"
    },
    {
        "id": "fronteira",
        "name": "Fronteira",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "fundao",
        "name": "Fundão",
        "district": "Castelo Branco",
        "region": "Região do Centro"
    },
    {
        "id": "gaviao",
        "name": "Gavião",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "gois",
        "name": "Góis",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "golega",
        "name": "Golegã",
        "district": "Santarém",
        "region": "Alentejo"
    },
    {
        "id": "gondomar",
        "name": "Gondomar",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "gouveia",
        "name": "Gouveia",
        "district": "Guarda",
        "region": "Região do Centro"
    },
    {
        "id": "grandola",
        "name": "Grândola",
        "district": "Setúbal",
        "region": "Alentejo"
    },
    {
        "id": "guarda",
        "name": "Guarda",
        "district": "Guarda",
        "region": "Região do Centro"
    },
    {
        "id": "guimaraes",
        "name": "Guimarães",
        "district": "Braga",
        "region": "Região do Norte"
    },
    {
        "id": "idanha-a-nova",
        "name": "Idanha-a-Nova",
        "district": "Castelo Branco",
        "region": "Região do Centro"
    },
    {
        "id": "ilhavo",
        "name": "Ílhavo",
        "district": "Aveiro",
        "region": "Região do Centro"
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
        "region": "Região do Norte"
    },
    {
        "id": "leiria",
        "name": "Leiria",
        "district": "Leiria",
        "region": "Região do Centro"
    },
    {
        "id": "lisboa",
        "name": "Lisboa",
        "district": "Lisboa",
        "region": "Região de Lisboa",
        "verified": true,
        "pdm_links": {
            "landing_page": "https://www.lisboa.pt/cidade/urbanismo/planeamento-urbano/pdm-em-vigor",
            "regulation_pdf": "https://www.lisboa.pt/fileadmin/cidade_temas/urbanismo/planeamento_urbano/pdm_em_vigor/regulamento/Regulamento_PDM_2012_Consolidado_com_Alteracoes_2020.pdf",
            "geoportal": "https://geoportal.cm-lisboa.pt/"
        }
    },
    {
        "id": "loule",
        "name": "Loulé",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "loures",
        "name": "Loures",
        "district": "Lisboa",
        "region": "Região de Lisboa"
    },
    {
        "id": "lourinha",
        "name": "Lourinhã",
        "district": "Lisboa",
        "region": "Região do Centro"
    },
    {
        "id": "lousa",
        "name": "Lousã",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "lousada",
        "name": "Lousada",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "macao-[5]",
        "name": "Mação [5]",
        "district": "Santarém",
        "region": "Região do Centro"
    },
    {
        "id": "macedo-de-cavaleiros",
        "name": "Macedo de Cavaleiros",
        "district": "Bragança",
        "region": "Região do Norte"
    },
    {
        "id": "mafra",
        "name": "Mafra",
        "district": "Lisboa",
        "region": "Região de Lisboa"
    },
    {
        "id": "maia",
        "name": "Maia",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "mangualde",
        "name": "Mangualde",
        "district": "Viseu",
        "region": "Região do Centro"
    },
    {
        "id": "manteigas",
        "name": "Manteigas",
        "district": "Guarda",
        "region": "Região do Centro"
    },
    {
        "id": "marco-de-canaveses",
        "name": "Marco de Canaveses",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "marinha-grande",
        "name": "Marinha Grande",
        "district": "Leiria",
        "region": "Região do Centro"
    },
    {
        "id": "marvao",
        "name": "Marvão",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "matosinhos",
        "name": "Matosinhos",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "mealhada[2]",
        "name": "Mealhada[2]",
        "district": "Aveiro",
        "region": "Região do Centro"
    },
    {
        "id": "meda",
        "name": "Mêda",
        "district": "Guarda",
        "region": "Região do Centro"
    },
    {
        "id": "melgaco",
        "name": "Melgaço",
        "district": "Viana do Castelo",
        "region": "Região do Norte"
    },
    {
        "id": "mertola",
        "name": "Mértola",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "mesao-frio",
        "name": "Mesão Frio",
        "district": "Vila Real",
        "region": "Região do Norte"
    },
    {
        "id": "mira",
        "name": "Mira",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "miranda-do-corvo",
        "name": "Miranda do Corvo",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "miranda-do-douro",
        "name": "Miranda do Douro",
        "district": "Bragança",
        "region": "Região do Norte"
    },
    {
        "id": "mirandela",
        "name": "Mirandela",
        "district": "Bragança",
        "region": "Região do Norte"
    },
    {
        "id": "mogadouro",
        "name": "Mogadouro",
        "district": "Bragança",
        "region": "Região do Norte"
    },
    {
        "id": "moimenta-da-beira",
        "name": "Moimenta da Beira",
        "district": "Viseu",
        "region": "Região do Norte"
    },
    {
        "id": "moita",
        "name": "Moita",
        "district": "Setúbal",
        "region": "Região de Lisboa"
    },
    {
        "id": "moncao",
        "name": "Monção",
        "district": "Viana do Castelo",
        "region": "Região do Norte"
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
        "region": "Região do Norte"
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
        "region": "Região do Norte"
    },
    {
        "id": "montemor-o-novo",
        "name": "Montemor-o-Novo",
        "district": "Évora",
        "region": "Alentejo"
    },
    {
        "id": "montemor-o-velho",
        "name": "Montemor-o-Velho",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "montijo",
        "name": "Montijo",
        "district": "Setúbal",
        "region": "Região de Lisboa"
    },
    {
        "id": "mora[4]",
        "name": "Mora[4]",
        "district": "Évora",
        "region": "Alentejo"
    },
    {
        "id": "mortagua[2]",
        "name": "Mortágua[2]",
        "district": "Viseu",
        "region": "Região do Centro"
    },
    {
        "id": "moura",
        "name": "Moura",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "mourao",
        "name": "Mourão",
        "district": "Évora",
        "region": "Alentejo"
    },
    {
        "id": "murca",
        "name": "Murça",
        "district": "Vila Real",
        "region": "Região do Norte"
    },
    {
        "id": "murtosa",
        "name": "Murtosa",
        "district": "Aveiro",
        "region": "Região do Centro"
    },
    {
        "id": "nazare",
        "name": "Nazaré",
        "district": "Leiria",
        "region": "Região do Centro"
    },
    {
        "id": "nelas",
        "name": "Nelas",
        "district": "Viseu",
        "region": "Região do Centro"
    },
    {
        "id": "nisa",
        "name": "Nisa",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "obidos",
        "name": "Óbidos",
        "district": "Leiria",
        "region": "Região do Centro"
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
        "region": "Região de Lisboa"
    },
    {
        "id": "oeiras",
        "name": "Oeiras",
        "district": "Lisboa",
        "region": "Região de Lisboa"
    },
    {
        "id": "oleiros",
        "name": "Oleiros",
        "district": "Castelo Branco",
        "region": "Região do Centro"
    },
    {
        "id": "olhao",
        "name": "Olhão",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "oliveira-de-azemeis",
        "name": "Oliveira de Azeméis",
        "district": "Aveiro",
        "region": "Região do Norte"
    },
    {
        "id": "oliveira-de-frades",
        "name": "Oliveira de Frades",
        "district": "Viseu",
        "region": "Região do Centro"
    },
    {
        "id": "oliveira-do-bairro",
        "name": "Oliveira do Bairro",
        "district": "Aveiro",
        "region": "Região do Centro"
    },
    {
        "id": "oliveira-do-hospital",
        "name": "Oliveira do Hospital",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "ourem",
        "name": "Ourém",
        "district": "Santarém",
        "region": "Região do Centro"
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
        "region": "Região do Centro"
    },
    {
        "id": "pacos-de-ferreira",
        "name": "Paços de Ferreira",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "palmela",
        "name": "Palmela",
        "district": "Setúbal",
        "region": "Região de Lisboa"
    },
    {
        "id": "pampilhosa-da-serra",
        "name": "Pampilhosa da Serra",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "paredes",
        "name": "Paredes",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "paredes-de-coura",
        "name": "Paredes de Coura",
        "district": "Viana do Castelo",
        "region": "Região do Norte"
    },
    {
        "id": "pedrogao-grande",
        "name": "Pedrógão Grande",
        "district": "Leiria",
        "region": "Região do Centro"
    },
    {
        "id": "penacova",
        "name": "Penacova",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "penafiel",
        "name": "Penafiel",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "penalva-do-castelo",
        "name": "Penalva do Castelo",
        "district": "Viseu",
        "region": "Região do Centro"
    },
    {
        "id": "penamacor",
        "name": "Penamacor",
        "district": "Castelo Branco",
        "region": "Região do Centro"
    },
    {
        "id": "penedono",
        "name": "Penedono",
        "district": "Viseu",
        "region": "Região do Norte"
    },
    {
        "id": "penela",
        "name": "Penela",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "peniche",
        "name": "Peniche",
        "district": "Leiria",
        "region": "Região do Centro"
    },
    {
        "id": "peso-da-regua",
        "name": "Peso da Régua",
        "district": "Vila Real",
        "region": "Região do Norte"
    },
    {
        "id": "pinhel",
        "name": "Pinhel",
        "district": "Guarda",
        "region": "Região do Centro"
    },
    {
        "id": "pombal",
        "name": "Pombal",
        "district": "Leiria",
        "region": "Região do Centro"
    },
    {
        "id": "ponte-da-barca",
        "name": "Ponte da Barca",
        "district": "Viana do Castelo",
        "region": "Região do Norte"
    },
    {
        "id": "ponte-de-lima",
        "name": "Ponte de Lima",
        "district": "Viana do Castelo",
        "region": "Região do Norte"
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
        "district": "Évora",
        "region": "Alentejo"
    },
    {
        "id": "portimao",
        "name": "Portimão",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "porto",
        "name": "Porto",
        "district": "Porto",
        "region": "Região do Norte",
        "verified": true,
        "pdm_links": {
            "landing_page": "https://pdm.cm-porto.pt/",
            "regulation_pdf": "https://pdm.cm-porto.pt/documentos/regulamento-do-pdm-do-porto",
            "geoportal": "https://pdm.cm-porto.pt/mapas-interativos"
        }
    },
    {
        "id": "porto-de-mos",
        "name": "Porto de Mós",
        "district": "Leiria",
        "region": "Região do Centro"
    },
    {
        "id": "povoa-de-lanhoso",
        "name": "Póvoa de Lanhoso",
        "district": "Braga",
        "region": "Região do Norte"
    },
    {
        "id": "povoa-de-varzim",
        "name": "Póvoa de Varzim",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "proenca-a-nova",
        "name": "Proença-a-Nova",
        "district": "Castelo Branco",
        "region": "Região do Centro"
    },
    {
        "id": "redondo",
        "name": "Redondo",
        "district": "Évora",
        "region": "Alentejo"
    },
    {
        "id": "reguengos-de-monsaraz",
        "name": "Reguengos de Monsaraz",
        "district": "Évora",
        "region": "Alentejo"
    },
    {
        "id": "resende",
        "name": "Resende",
        "district": "Viseu",
        "region": "Região do Norte"
    },
    {
        "id": "ribeira-de-pena",
        "name": "Ribeira de Pena",
        "district": "Vila Real",
        "region": "Região do Norte"
    },
    {
        "id": "rio-maior",
        "name": "Rio Maior",
        "district": "Santarém",
        "region": "Alentejo"
    },
    {
        "id": "sabrosa",
        "name": "Sabrosa",
        "district": "Vila Real",
        "region": "Região do Norte"
    },
    {
        "id": "sabugal",
        "name": "Sabugal",
        "district": "Guarda",
        "region": "Região do Centro"
    },
    {
        "id": "salvaterra-de-magos",
        "name": "Salvaterra de Magos",
        "district": "Santarém",
        "region": "Alentejo"
    },
    {
        "id": "santa-comba-dao",
        "name": "Santa Comba Dão",
        "district": "Viseu",
        "region": "Região do Centro"
    },
    {
        "id": "santa-maria-da-feira",
        "name": "Santa Maria da Feira",
        "district": "Aveiro",
        "region": "Região do Norte"
    },
    {
        "id": "santa-marta-de-penaguiao",
        "name": "Santa Marta de Penaguião",
        "district": "Vila Real",
        "region": "Região do Norte"
    },
    {
        "id": "santarem",
        "name": "Santarém",
        "district": "Santarém",
        "region": "Alentejo"
    },
    {
        "id": "santiago-do-cacem",
        "name": "Santiago do Cacém",
        "district": "Setúbal",
        "region": "Alentejo"
    },
    {
        "id": "santo-tirso[2]",
        "name": "Santo Tirso[2]",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "sao-bras-de-alportel",
        "name": "São Brás de Alportel",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "sao-joao-da-madeira",
        "name": "São João da Madeira",
        "district": "Aveiro",
        "region": "Região do Norte"
    },
    {
        "id": "sao-joao-da-pesqueira",
        "name": "São João da Pesqueira",
        "district": "Viseu",
        "region": "Região do Norte"
    },
    {
        "id": "sao-pedro-do-sul",
        "name": "São Pedro do Sul",
        "district": "Viseu",
        "region": "Região do Centro"
    },
    {
        "id": "sardoal",
        "name": "Sardoal",
        "district": "Santarém",
        "region": "Região do Centro"
    },
    {
        "id": "satao",
        "name": "Sátão",
        "district": "Viseu",
        "region": "Região do Centro"
    },
    {
        "id": "seia",
        "name": "Seia",
        "district": "Guarda",
        "region": "Região do Centro"
    },
    {
        "id": "seixal",
        "name": "Seixal",
        "district": "Setúbal",
        "region": "Região de Lisboa"
    },
    {
        "id": "sernancelhe",
        "name": "Sernancelhe",
        "district": "Viseu",
        "region": "Região do Norte"
    },
    {
        "id": "serpa",
        "name": "Serpa",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "serta",
        "name": "Sertã",
        "district": "Castelo Branco",
        "region": "Região do Centro"
    },
    {
        "id": "sesimbra",
        "name": "Sesimbra",
        "district": "Setúbal",
        "region": "Região de Lisboa"
    },
    {
        "id": "setubal",
        "name": "Setúbal",
        "district": "Setúbal",
        "region": "Região de Lisboa"
    },
    {
        "id": "sever-do-vouga",
        "name": "Sever do Vouga",
        "district": "Aveiro",
        "region": "Região do Centro"
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
        "district": "Setúbal",
        "region": "Alentejo"
    },
    {
        "id": "sintra",
        "name": "Sintra",
        "district": "Lisboa",
        "region": "Região de Lisboa"
    },
    {
        "id": "sobral-de-monte-agraco",
        "name": "Sobral de Monte Agraço",
        "district": "Lisboa",
        "region": "Região do Centro"
    },
    {
        "id": "soure",
        "name": "Soure",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "sousel[4]",
        "name": "Sousel[4]",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "tabua",
        "name": "Tábua",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "tabuaco",
        "name": "Tabuaço",
        "district": "Viseu",
        "region": "Região do Norte"
    },
    {
        "id": "tarouca",
        "name": "Tarouca",
        "district": "Viseu",
        "region": "Região do Norte"
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
        "region": "Região do Norte"
    },
    {
        "id": "tomar",
        "name": "Tomar",
        "district": "Santarém",
        "region": "Região do Centro"
    },
    {
        "id": "tondela",
        "name": "Tondela",
        "district": "Viseu",
        "region": "Região do Centro"
    },
    {
        "id": "torre-de-moncorvo",
        "name": "Torre de Moncorvo",
        "district": "Bragança",
        "region": "Região do Norte"
    },
    {
        "id": "torres-novas",
        "name": "Torres Novas",
        "district": "Santarém",
        "region": "Região do Centro"
    },
    {
        "id": "torres-vedras",
        "name": "Torres Vedras",
        "district": "Lisboa",
        "region": "Região do Centro"
    },
    {
        "id": "trancoso",
        "name": "Trancoso",
        "district": "Guarda",
        "region": "Região do Centro"
    },
    {
        "id": "trofa[2]",
        "name": "Trofa[2]",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "vagos",
        "name": "Vagos",
        "district": "Aveiro",
        "region": "Região do Centro"
    },
    {
        "id": "vale-de-cambra",
        "name": "Vale de Cambra",
        "district": "Aveiro",
        "region": "Região do Norte"
    },
    {
        "id": "valenca",
        "name": "Valença",
        "district": "Viana do Castelo",
        "region": "Região do Norte"
    },
    {
        "id": "valongo",
        "name": "Valongo",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "valpacos",
        "name": "Valpaços",
        "district": "Vila Real",
        "region": "Região do Norte"
    },
    {
        "id": "vendas-novas",
        "name": "Vendas Novas",
        "district": "Évora",
        "region": "Alentejo"
    },
    {
        "id": "viana-do-alentejo",
        "name": "Viana do Alentejo",
        "district": "Évora",
        "region": "Alentejo"
    },
    {
        "id": "viana-do-castelo",
        "name": "Viana do Castelo",
        "district": "Viana do Castelo",
        "region": "Região do Norte"
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
        "region": "Região do Norte"
    },
    {
        "id": "vila-de-rei",
        "name": "Vila de Rei",
        "district": "Castelo Branco",
        "region": "Região do Centro"
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
        "region": "Região do Norte"
    },
    {
        "id": "vila-flor[2]",
        "name": "Vila Flor[2]",
        "district": "Bragança",
        "region": "Região do Norte"
    },
    {
        "id": "vila-franca-de-xira",
        "name": "Vila Franca de Xira",
        "district": "Lisboa",
        "region": "Região de Lisboa"
    },
    {
        "id": "vila-nova-da-barquinha",
        "name": "Vila Nova da Barquinha",
        "district": "Santarém",
        "region": "Região do Centro"
    },
    {
        "id": "vila-nova-de-cerveira",
        "name": "Vila Nova de Cerveira",
        "district": "Viana do Castelo",
        "region": "Região do Norte"
    },
    {
        "id": "vila-nova-de-famalicao",
        "name": "Vila Nova de Famalicão",
        "district": "Braga",
        "region": "Região do Norte"
    },
    {
        "id": "vila-nova-de-foz-coa",
        "name": "Vila Nova de Foz Côa",
        "district": "Guarda",
        "region": "Região do Norte"
    },
    {
        "id": "vila-nova-de-gaia",
        "name": "Vila Nova de Gaia",
        "district": "Porto",
        "region": "Região do Norte"
    },
    {
        "id": "vila-nova-de-paiva",
        "name": "Vila Nova de Paiva",
        "district": "Viseu",
        "region": "Região do Centro"
    },
    {
        "id": "vila-nova-de-poiares",
        "name": "Vila Nova de Poiares",
        "district": "Coimbra",
        "region": "Região do Centro"
    },
    {
        "id": "vila-pouca-de-aguiar",
        "name": "Vila Pouca de Aguiar",
        "district": "Vila Real",
        "region": "Região do Norte"
    },
    {
        "id": "vila-real",
        "name": "Vila Real",
        "district": "Vila Real",
        "region": "Região do Norte"
    },
    {
        "id": "vila-real-de-santo-antonio",
        "name": "Vila Real de Santo António",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "vila-velha-de-rodao",
        "name": "Vila Velha de Ródão",
        "district": "Castelo Branco",
        "region": "Região do Centro"
    },
    {
        "id": "vila-verde",
        "name": "Vila Verde",
        "district": "Braga",
        "region": "Região do Norte"
    },
    {
        "id": "vila-vicosa",
        "name": "Vila Viçosa",
        "district": "Évora",
        "region": "Alentejo"
    },
    {
        "id": "vimioso",
        "name": "Vimioso",
        "district": "Bragança",
        "region": "Região do Norte"
    },
    {
        "id": "vinhais",
        "name": "Vinhais",
        "district": "Bragança",
        "region": "Região do Norte"
    },
    {
        "id": "viseu",
        "name": "Viseu",
        "district": "Viseu",
        "region": "Região do Centro"
    },
    {
        "id": "vizela",
        "name": "Vizela",
        "district": "Braga",
        "region": "Região do Norte"
    },
    {
        "id": "vouzela",
        "name": "Vouzela",
        "district": "Viseu",
        "region": "Região do Centro"
    }
];