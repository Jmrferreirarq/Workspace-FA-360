# FA-360 | MÓDULO DE RELATÓRIO TÉCNICO LEGAL

## Análise de Conformidade Urbanística por Município

Versão 1.0 | Janeiro 2025

---

## 1. VISÃO GERAL DO MÓDULO

## Objectivo

Criar uma ferramenta automatizada que gere relatórios técnicos de conformidade legal para projectos de arquitectura, analisando a aplicabilidade de toda a legislação urbanística portuguesa (nacional e municipal) à localização específica do projecto.

## Valor para o Arquitecto

- **Redução de tempo:** De 4-8 horas de pesquisa manual para 15 minutos
- **Redução de erros:** Verificação sistemática de todas as condicionantes
- **Profissionalismo:** Relatório técnico formatado para entrega ao cliente
- **Actualização:** Base de dados mantida actualizada com alterações legais

---

## 2. ENQUADRAMENTO LEGAL PORTUGUÊS

## 2.1 Hierarquia do Sistema de Gestão Territorial

```text
┌─────────────────────────────────────────────────────────────┐
│                    NÍVEL NACIONAL                            │
│  • Lei de Bases (Lei 31/2014)                               │
│  • RJIGT (DL 80/2015 + alterações)                          │
│  • RJUE (DL 555/99 + DL 10/2024)                            │
│  • RGEU (DL 38382/51) - Revogado em Jun/2026                │
│  • Programas Especiais (POOC, POA, etc.)                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    NÍVEL REGIONAL                            │
│  • PROT (Planos Regionais de OT)                            │
│  • Programas Sectoriais                                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   NÍVEL MUNICIPAL                            │
│  • PDM (Plano Director Municipal)                           │
│  • PU (Planos de Urbanização)                               │
│  • PP (Planos de Pormenor)                                  │
│  • RMUE (Regulamento Municipal de Urbanização/Edificação)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2.2 LEGISLAÇÃO NACIONAL APLICÁVEL

### A) Regime Jurídico da Urbanização e Edificação (RJUE)

**Diploma:** DL 555/99 de 16/12, alterado pelo DL 10/2024 de 08/01 (Simplex Urbanístico)

**Principais alterações DL 10/2024:**

- Eliminação de alvarás (substituídos por certidões)
- Ampliação das isenções de controlo prévio
- Deferimento tácito generalizado
- Plataforma Electrónica dos Procedimentos Urbanísticos (PEPU)
- Revogação do RGEU a partir de 01/06/2026

**Artigos-chave:**

| Artigo | Conteúdo | Aplicação |
| :--- | :--- | :--- |
| Art. 4º | Licença e comunicação prévia | Determina tipo de procedimento |
| Art. 6º | Isenções de controlo prévio | Obras dispensadas |
| Art. 7º | Isenções subjectivas | Entidades dispensadas |
| Art. 20º | Apreciação de projectos | Requisitos técnicos |
| Art. 23º | Prazos e deferimento tácito | Prazos de decisão |
| Art. 43º | Áreas para espaços verdes | Cedências obrigatórias |
| Art. 62º-A | Utilização após operação | Autorização de utilização |

### B) Regime Jurídico dos Instrumentos de Gestão Territorial (RJIGT)

**Diploma:** DL 80/2015 de 14/05, alterado pelo DL 117/2024 e Lei 53-A/2025

**Conceitos fundamentais:**

- **Solo Urbano:** Total ou parcialmente urbanizado/edificado, afecto à urbanização
- **Solo Rústico:** Vocação para actividades agrícolas, florestais, conservação da natureza
- **Reclassificação:** Processo de alteração da classificação do solo

**Artigos-chave:**

| Artigo | Conteúdo |
| :--- | :--- |
| Art. 71º | Classificação do solo |
| Art. 72º | Reclassificação (requisitos) |
| Art. 72º-B | Reclassificação para habitação |
| Art. 95º-103º | Plano Director Municipal |
| Art. 123º | Alteração simplificada |

### C) Lei de Bases (LBPPSOTU)

**Diploma:** Lei 31/2014 de 30/05

**Princípios fundamentais:**

- Desenvolvimento sustentável
- Economia, eficiência e eficácia
- Responsabilidade
- Contratualização
- Concertação e participação
- Segurança jurídica

### D) Regulamento Geral das Edificações Urbanas (RGEU)

**Diploma:** DL 38382/51 de 07/08
**Estado:** Em vigor até 01/06/2026 (revogação pelo DL 10/2024)

**Parâmetros ainda aplicáveis:**

- Pé-direito mínimo
- Áreas mínimas de compartimentos
- Iluminação e ventilação natural
- Instalações sanitárias
- Afastamentos a confrontações

---

## 2.3 SERVIDÕES E RESTRIÇÕES DE UTILIDADE PÚBLICA (SRUP)

### Categorias Principais

#### A) Recursos Naturais

| Servidão | Diploma | Condicionamentos |
| :--- | :--- | :--- |
| **REN** (Reserva Ecológica Nacional) | DL 166/2008 | Proibição de edificação, excepto usos compatíveis |
| **RAN** (Reserva Agrícola Nacional) | DL 73/2009, DL 199/2015 | Proibição de utilização não agrícola |
| **Domínio Público Hídrico** | Lei 54/2005 | Faixas de protecção, margens |
| **Áreas Protegidas** | DL 142/2008 | Regime específico de cada área |

#### B) Património Cultural

| Servidão | Diploma | Condicionamentos |
| :--- | :--- | :--- |
| **Monumentos Nacionais** | Lei 107/2001, DL 309/2009 | Zona de protecção 50m |
| **Imóveis de Interesse Público** | Lei 107/2001 | Zona especial de protecção |
| **Imóveis em Vias de Classificação** | Lei 107/2001 | Protecção provisória |

#### C) Infra-estruturas

| Servidão | Diploma | Condicionamentos |
| :--- | :--- | :--- |
| **Rede Eléctrica AT/MT** | DL 42895/60 | Faixas de protecção |
| **Rede Viária Nacional** | Estatuto das Estradas Nacionais | Zonas non aedificandi |
| **Rede Ferroviária** | DL 276/2003 | Faixas de protecção |
| **Gasodutos** | DL 374/89 | Faixas de segurança |
| **Aeroportos** | DL 45987/64 | Servidões aeronáuticas |

#### D) Riscos Naturais

| Servidão | Diploma | Condicionamentos |
| :--- | :--- | :--- |
| **Zonas Inundáveis** | DL 468/71, DL 89/87 | Restrições de edificação |
| **Perigosidade Sísmica** | DL 235/83, Eurocódigo 8 | Requisitos estruturais |
| **Incêndios Florestais** | DL 124/2006 | Faixas de gestão combustível |

---

## 2.4 REGULAMENTAÇÃO TÉCNICA ESPECÍFICA

| Área | Diploma | Aplicação |
| :--- | :--- | :--- |
| **Acessibilidades** | DL 163/2006, alterado | Espaços públicos e edifícios |
| **Segurança Incêndio** | DL 220/2008, Portaria 1532/2008 | SCIE - Todas as edificações |
| **Acústica** | DL 96/2008, RRAE | Requisitos acústicos |
| **Térmica** | DL 101-D/2020 | REH/RECS |
| **Gás** | DL 97/2017 | Instalações de gás |
| **Águas e Esgotos** | DR 23/95 | RGSPPDADAR |

---

## 3. PLANOS DIRECTORES MUNICIPAIS (PDM)

## 3.1 Estrutura de um PDM

Cada PDM contém obrigatoriamente:

### Elementos Fundamentais

1. **Regulamento** - Normas de ocupação, uso e transformação do solo
2. **Planta de Ordenamento** - Classificação e qualificação do solo
3. **Planta de Condicionantes** - Servidões e restrições

### Categorias de Solo Típicas

#### Solo Urbano

- Espaços Centrais
- Espaços Residenciais
- Espaços de Actividades Económicas
- Espaços Verdes
- Espaços de Uso Especial (equipamentos)
- Espaços Urbanos de Baixa Densidade

#### Solo Rústico

- Espaços Agrícolas
- Espaços Florestais
- Espaços de Exploração de Recursos
- Espaços Naturais
- Aglomerados Rurais

### Parâmetros Urbanísticos Típicos

- Índice de Utilização (Iu)
- Índice de Ocupação (Io)
- Índice de Impermeabilização
- Cércea máxima / Número de pisos
- Afastamentos (frontal, lateral, posterior)
- Área mínima de lote
- Frente mínima de lote

---

## 3.2 Lista dos 308 Municípios de Portugal

(Lista completa conforme documento original omitida para brevidade no índice, mas considerada na íntegra para implementação)

---

## 4. ESTRUTURA DO RELATÓRIO TÉCNICO

## 4.1 Modelo de Relatório Gerado

(Ver template no documento original)

---

## 5. IMPLEMENTAÇÃO TÉCNICA

## 5.1 Arquitectura do Módulo

```text
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Selector   │  │   Mapa      │  │  Gerador    │          │
│  │  Município  │  │  Interativo │  │  Relatório  │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVIÇOS (API)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   SNIT      │  │   DGT       │  │   DGPC      │          │
│  │   (PDM)     │  │   (SRUP)    │  │ (Património)│          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  BASE DE DADOS LOCAL                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  • 308 PDM (regulamentos + parâmetros)              │    │
│  │  • Legislação nacional (RJUE, RJIGT, RGEU...)       │    │
│  │  • Catálogo SRUP por município                      │    │
│  │  • Templates de relatório                           │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 5.2 Fontes de Dados

| Fonte | URL | Dados |
| :--- | :--- | :--- |
| **SNIT** | snit.dgterritorio.pt | PDM, PU, PP em vigor |
| **DGT Geoportal** | snig.dgterritorio.pt | SRUP georreferenciadas |
| **SIPA/DGPC** | monumentos.gov.pt | Património classificado |
| **e-Geo** | geo.cm-[municipio].pt | SIG municipais |
| **DRE** | dre.pt | Legislação actualizada |

## 5.3 Fluxo de Utilização

```text
1. SELECCIONAR MUNICÍPIO
   └─> Lista dropdown com 308 municípios
   └─> Carrega automaticamente PDM em vigor

2. INTRODUZIR LOCALIZAÇÃO
   └─> Morada + código postal
   └─> OU coordenadas GPS
   └─> OU clicar no mapa

3. CARACTERIZAR PRETENSÃO
   └─> Tipo de operação (construção nova, ampliação, etc.)
   └─> Uso pretendido (habitação, comércio, etc.)
   └─> Área de construção estimada

4. GERAR ANÁLISE
   └─> Sistema cruza localização com:
       • Planta de Ordenamento do PDM
       • Planta de Condicionantes
       • SRUP nacionais
       • Património classificado

5. EXPORTAR RELATÓRIO
   └─> PDF formatado
   └─> Anexos cartográficos
   └─> Checklist de documentos
```

---

## 6. DADOS PRÉ-CARREGADOS POR MUNICÍPIO

## Exemplo: Aveiro

```javascript
{
  "municipio": "Aveiro",
  "distrito": "Aveiro",
  "nuts3": "Região de Aveiro",
  "pdm": {
    "publicacao": "Aviso n.º 2957/2019, DR 2ª série de 20/02",
    "estado": "Em vigor",
    "ultima_alteracao": "2023",
    "link_snit": "https://snit.dgterritorio.gov.pt/..."
  },
  "categorias_solo_urbano": [
    {
      "nome": "Espaços Centrais",
      "sigla": "EC",
      "iu_max": 2.0,
      "io_max": 0.8,
      "cércea_max": "Variável",
      "observacoes": "Ver Art. 45º do Regulamento"
    },
    {
      "nome": "Espaços Residenciais de Tipo I",
      "sigla": "ER-I",
      "iu_max": 1.2,
      "io_max": 0.6,
      "cércea_max": "4 pisos",
      "observacoes": "Densificação moderada"
    }
    // ... outras categorias
  ],
  "srup_activas": [
    "REN",
    "Domínio Público Hídrico (Ria de Aveiro)",
    "Zona de Protecção ao Farol da Barra",
    "Rede Eléctrica AT"
  ],
  "entidades_consulta": [
    {
      "entidade": "APA - Agência Portuguesa do Ambiente",
      "motivo": "Ria de Aveiro / POOC"
    },
    {
      "entidade": "DGPC",
      "motivo": "Património classificado"
    }
  ],
  "rmue": {
    "publicacao": "DR 2ª série de XX/XX/XXXX",
    "taxas_2024": {
      "licenca_construcao_m2": 15.50,
      "comunicacao_previa_m2": 8.00
    }
  }
}
```

---

## 7. ROADMAP DE IMPLEMENTAÇÃO

## Fase 1 - MVP (4 semanas)

- [ ] Selector de município (308)
- [ ] Base de dados PDM (parâmetros principais)
- [ ] Legislação nacional (RJUE, RJIGT)
- [ ] Template de relatório básico
- [ ] Export PDF

## Fase 2 - SRUP (6 semanas)

- [ ] Integração com geoportal SNIT
- [ ] Cruzamento com REN/RAN
- [ ] Base de dados de património classificado
- [ ] Cálculo de zonas de protecção

## Fase 3 - Inteligência (4 semanas)

- [ ] Determinação automática do procedimento
- [ ] Checklist de documentos por tipo de obra
- [ ] Identificação de entidades a consultar
- [ ] Alertas de condicionantes críticas

## Fase 4 - Georreferenciação (6 semanas)

- [ ] Mapa interactivo com layers
- [ ] Sobreposição de plantas do PDM
- [ ] Visualização de SRUP
- [ ] Extracção automática de localização

---

## 8. LIMITAÇÕES E DISCLAIMERS

## Importante

1. **Actualização:** Os PDM e legislação estão em constante actualização. O sistema requer manutenção periódica.

2. **Carácter informativo:** O relatório gerado não substitui a consulta oficial às câmaras municipais e entidades competentes.

3. **Interpretação:** Algumas disposições regulamentares requerem interpretação técnica especializada.

4. **Georreferenciação:** A precisão da localização depende da qualidade dos dados de entrada.

5. **SRUP:** Algumas servidões podem não estar completamente digitalizadas no SNIT.
