# FA-360 ROADMAP ESTRATÉGICO

## Orientações de Melhoria, Usabilidade e Funcionalidade

### Ferreira Arquitetos | Janeiro 2025 | Versão 1.0

---

## 1. VISÃO GERAL

A FA-360 é uma plataforma de gestão completa para ateliers de arquitetura. Este roadmap define o caminho para a transformar de uma ferramenta funcional numa solução verdadeiramente indispensável.

## Princípios Orientadores

- **Menos cliques, mais contexto** — cada acção deve estar a no máximo 2 cliques de distância
- **Dados que orientam acção** — não mostrar informação passiva, mas insights accionáveis
- **Fluxos completos** — não funcionalidades isoladas, mas workflows de ponta a ponta
- **Mobile-first para consulta** — desktop-first para criação

## Métricas de Sucesso

| Métrica | Atual | Objectivo |

| Métrica | Atual | Objectivo |
| :--- | :--- | :--- |
| Tempo médio para criar proposta | 45 min | 15 min |
| Cliques para registar despesa | 8 cliques | 3 cliques |
| Projectos com horas registadas | 0% | 100% |
| Taxa de conversão de propostas | Desconhecida | Tracking activo |

---

## 2. FASE 1 — FUNDAÇÕES

### ⏱️ DURAÇÃO: 4 SEMANAS | 🔴 PRIORIDADE: CRÍTICA

*Objectivo: Estabelecer as bases para captura de dados essenciais e melhorar os fluxos de trabalho diários.*

---

## 1.1 Painel do Dia no Dashboard

### 1.1.1 Problema

O dashboard actual mostra métricas estáticas mas não responde à pergunta fundamental: "O que preciso fazer hoje?"

### 1.1.2 Solução

Criar um componente "Painel do Dia" que agregue automaticamente:

- Tarefas com deadline nas próximas 24 horas
- Reuniões agendadas para hoje (integração calendário)
- Facturas pendentes há mais de 30 dias
- Projectos sem actualização há mais de 14 dias

### Implementação Técnica

```text
1. Criar componente DayPanel.tsx
2. Adicionar queries agregadas no fa360.ts
3. Integrar no topo do DashboardPage.tsx
```

### 1.1.4 Esforço Estimado

Estimativa: 8-12 horas de desenvolvimento

---

## 1.2 Sistema de Registo de Horas

### 1.2.1 Problema

Não existe forma de saber se os honorários calculados correspondem ao esforço real investido. Isto impede análise de rentabilidade.

### 1.2.2 Solução

Implementar registo de horas simples e não-intrusivo:

- Botão "Registar Tempo" em cada página de projecto
- Timer opcional para tracking em tempo real
- Categorização por fase RJUE (automática baseada no estado do projecto)
- Relatório semanal de horas por projecto

### Modelo de Dados

| Campo | Tipo | Descrição |

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| project_id | string | Referência ao projecto |
| user | string | Quem registou |
| date | date | Data do trabalho |
| hours | number | Horas trabalhadas |
| phase | enum | Fase RJUE (EP, LIC, PE...) |
| description | string | Descrição opcional |

### 1.2.4 Esforço Estimado

Estimativa: 16-20 horas de desenvolvimento

---

## 1.3 Timeline de Projecto

### 1.3.1 Problema

Os projectos de arquitectura duram 1-3 anos mas não há visualização temporal. Impossível ver histórico ou planear marcos futuros.

### 1.3.2 Solução

Criar timeline visual interactiva na página de detalhe do projecto:

- Marcos automáticos: adjudicação, mudanças de fase, submissões
- Marcos manuais: reuniões importantes, aprovações, visitas de obra
- Vista horizontal scrollável com zoom (mês/trimestre/ano)
- Cores por tipo de evento (administrativo, técnico, cliente)

### 1.3.4 Esforço Estimado

Estimativa: 20-24 horas de desenvolvimento

---

## 1.4 Fluxo Proposta → Projecto

### 1.4.1 Problema

Quando uma proposta é aceite, é necessário criar manualmente o projecto e duplicar dados.

### 1.4.2 Solução

Workflow automático:

1. Na lista de propostas, adicionar botão "Adjudicar"
2. Ao clicar, abrir modal de confirmação com dados pré-preenchidos
3. Criar projecto automaticamente com: cliente, tipo, área, honorários
4. Gerar tarefas iniciais da Fase 1 (Programa Base)
5. Arquivar proposta com link para o projecto criado

### 1.4.4 Esforço Estimado

Estimativa: 12-16 horas de desenvolvimento

---

## 1.5 Templates Básicos de Proposta

### 1.5.1 Problema

Cada proposta é criada do zero, sem consistência de branding ou conteúdo.

### 1.5.2 Solução

- 3 templates iniciais: Proposta Completa, Orçamento Simplificado, Adenda
- Placeholders dinâmicos: {{cliente}}, {{area}}, {{valor}}, {{data}}
- Export para PDF com branding FA

### 1.5.4 Esforço Estimado

Estimativa: 8-12 horas de desenvolvimento

---

## 3. FASE 2 — PROFUNDIDADE

### ⏱️ DURAÇÃO: 6 SEMANAS | 🟠 PRIORIDADE: ALTA

*Objectivo: Transformar dados em insights accionáveis e criar ferramentas de análise.*

---

## 2.1 Dashboard Financeiro por Projecto

Cada projecto deve ter uma secção financeira dedicada mostrando:

- **Honorários:** adjudicados vs facturados vs recebidos (com percentagens)
- **Custos directos:** especialidades, taxas camarárias, deslocações
- **Margem real:** (recebido - custos) / adjudicado
- **Comparação** com estimativa inicial da calculadora
- **Alertas** automáticos quando custos ultrapassam 80% da margem prevista

### 2.1.2 Esforço Estimado

Estimativa: 24-32 horas de desenvolvimento

---

## 2.2 Cashflow Forecast

Previsão de fluxo de caixa baseada em:

- Honorários adjudicados × calendário típico de faturação por fase
- Histórico de tempo médio de pagamento por cliente
- Despesas fixas mensais (configuráveis)
- **Visualização:** gráfico de barras empilhadas (entradas vs saídas) próximos 6 meses
- **Alertas:** meses com saldo previsto negativo

### 2.2.2 Esforço Estimado

Estimativa: 32-40 horas de desenvolvimento

---

## 2.3 Portal do Cliente (v1)

Área dedicada onde o cliente acompanha o seu projecto.

### 2.3.1 Funcionalidades v1

- Vista de progresso com timeline simplificada
- Acesso a documentos aprovados (não rascunhos internos)
- Estado de pagamentos e facturas pendentes
- Formulário de contacto estruturado (não email)
- Autenticação simples: link único por projecto + código

### 2.3.2 Benefícios

- ✅ Reduz 60%+ do tempo gasto em "updates" ao cliente
- ✅ Profissionaliza a imagem do atelier
- ✅ Cria registo de comunicações

### 2.3.4 Esforço Estimado

Estimativa: 40-50 horas de desenvolvimento

---

## 2.4 Sistema de Automações

Motor de regras configuráveis para automatizar tarefas repetitivas:

| Trigger | Acção |

| Trigger | Acção |
| :--- | :--- |
| Projecto muda para "Licenciamento" | Criar tarefas standard dessa fase |
| Faltam 30 dias para deadline | Enviar reminder ao responsável |
| Pagamento atrasado 15 dias | Gerar alerta + sugerir email |
| Proposta sem resposta há 7 dias | Lembrar follow-up |
| Primeiro dia do mês | Gerar relatório de faturação |

### 2.4.2 Esforço Estimado

Estimativa: 32-40 horas de desenvolvimento

---

## 2.5 Integração Google Calendar

Sincronização bidireccional:

- Deadlines de projectos aparecem automaticamente no Google Calendar
- Reuniões criadas no Calendar aparecem na FA-360 associadas ao projecto
- Notificações de lembrete unificadas
- Vista de calendário na FA-360 mostra eventos de todas as fontes

### 2.5.2 Esforço Estimado

Estimativa: 24-32 horas de desenvolvimento

---

## 4. FASE 3 — INTELIGÊNCIA

### ⏱️ DURAÇÃO: 6 SEMANAS | 🟡 PRIORIDADE: MÉDIA

*Objectivo: Implementar analytics avançadas e ferramentas estratégicas.*

---

## 3.1 Dashboard de Business Intelligence

Métricas estratégicas que o atelier deve acompanhar:

- **Taxa de conversão** de propostas (enviadas vs adjudicadas)
- **Tempo médio por fase** RJUE (identificar bottlenecks)
- **Rentabilidade por tipo** de projecto (moradias vs reabilitações vs comercial)
- **Sazonalidade** de adjudicações (planear recursos)
- **Concentração de clientes** (risco de dependência)

### 3.1.1 Visualizações

- Gráfico de funil de propostas
- Heatmap de actividade por mês/ano
- Ranking de projectos por rentabilidade
- Evolução do pipeline ao longo do tempo

### 3.1.3 Esforço Estimado

Estimativa: 40-48 horas de desenvolvimento

---

## 3.2 Templates de Proposta Avançados

Sistema de templates personalizáveis:

- Editor visual de templates com placeholders dinâmicos
- Biblioteca de cláusulas reutilizáveis (condições de pagamento, exclusões)
- Templates por tipo de projecto (moradia, reabilitação, comercial)
- Geração de PDF com branding consistente
- **Comparação de cenários** (básico vs standard vs premium)

### 3.2.2 Esforço Estimado

Estimativa: 32-40 horas de desenvolvimento

---

## 3.3 CRM Avançado

Evoluir a gestão de clientes:

- **Timeline de relacionamento:** cada email, reunião, proposta registada
- **Scoring de cliente:** baseado em valor, pontualidade, potencial
- **Alertas de relacionamento:** sem contacto há 60+ dias
- **Rede de referências:** quem referenciou quem

### 3.3.2 Esforço Estimado

Estimativa: 24-32 horas de desenvolvimento

---

## 3.4 Tracking de Propostas

Análise do processo comercial:

- Quantas propostas enviadas por mês
- Taxa de conversão (tendência temporal)
- Valor médio por proposta
- Motivos de recusa mais comuns
- Tempo médio até decisão do cliente

### 3.4.2 Esforço Estimado

Estimativa: 16-20 horas de desenvolvimento

---

## 5. FASE 4 — ESCALA

### ⏱️ DURAÇÃO: 8 SEMANAS | 🔵 PRIORIDADE: FUTURA

*Objectivo: Preparar a plataforma para crescimento do atelier e equipas maiores.*

---

## 4.1 Gestão de Equipa e Alocação

- Perfis de utilizador com permissões diferenciadas
- Vista de carga de trabalho por pessoa
- Alocação de recursos a projectos
- Relatórios de produtividade individual

### 4.1.2 Esforço Estimado

Estimativa: 40-50 horas de desenvolvimento

---

## 4.2 Portal do Cliente v2

Evolução com funcionalidades avançadas:

- Sistema de aprovações com assinatura digital
- Upload de documentos pelo cliente
- Notificações push
- Histórico completo de comunicações
- Chat integrado

### 4.2.2 Esforço Estimado

Estimativa: 50-60 horas de desenvolvimento

---

## 4.3 App Mobile / PWA

Optimização para uso em mobilidade:

- Consulta de projectos e documentos em obra
- Registo fotográfico com associação automática ao projecto
- Notas de voz transcritas automaticamente
- Notificações push de deadlines e mensagens
- Modo offline para consulta básica

### 4.3.2 Esforço Estimado

Estimativa: 60-80 horas de desenvolvimento

---

## 4.4 Integrações Avançadas

### 4.4.1 Prioridade Alta

- **Facturação** (Moloni, InvoiceXpress)
- **Assinatura digital** (DocuSign, Autentika)

### 4.4.2 Prioridade Média

- **Armazenamento cloud** (Drive, Dropbox)
- **Email** (Gmail API para associação automática)

### 4.4.3 Prioridade Futura

- **BIM viewers** para modelos 3D
- **Câmaras municipais** (quando APIs disponíveis)

### 4.4.5 Esforço Estimado

Estimativa: 80-100 horas de desenvolvimento (total)

---

## 6. QUICK WINS IMEDIATOS

Melhorias que podem ser implementadas em menos de 4 horas cada, com alto impacto imediato.

| # | Melhoria | Impacto | Tempo |

| # | Melhoria | Impacto | Tempo |
| :--- | :--- | :--- | :--- |
| 1 | Campo "Próxima Acção" em cada projecto | Clareza operacional | 2h |
| 2 | Contador de dias desde última actualização | Visibilidade | 2h |
| 3 | Botão "Nota Rápida" global | Captura de info | 3h |
| 4 | Export PDF do estado do projecto | Reuniões | 4h |
| 5 | Modo "Apresentação" do portfolio | Comercial | 3h |
| 6 | Atalhos de teclado (Ctrl+P, Ctrl+C) | Produtividade | 2h |
| 7 | Indicador visual de projectos "parados" | Gestão | 2h |
| 8 | Breadcrumbs em todas as páginas | Navegação | 2h |
| 9 | Pesquisa global melhorada | Descoberta | 4h |
| 10 | Loading states em todas as acções | UX | 3h |

Total Quick Wins: ~27 horas

---

## 7. CHECKLIST DE IMPLEMENTAÇÃO

Use esta checklist para acompanhar o progresso de cada fase.

## ☐ Fase 1 — Fundações

- [ ] Painel do Dia implementado no Dashboard
- [ ] Sistema de registo de horas funcional
- [ ] Timeline de projecto criada
- [ ] Fluxo Proposta → Projecto automatizado
- [ ] Templates básicos de proposta criados

## ☐ Fase 2 — Profundidade

- [ ] Dashboard financeiro por projecto
- [ ] Cashflow forecast implementado
- [ ] Portal do Cliente v1 lançado
- [ ] Sistema de automações configurado
- [ ] Integração Google Calendar activa

## ☐ Fase 3 — Inteligência

- [ ] Dashboard de BI funcional
- [ ] Templates de proposta avançados
- [ ] CRM avançado implementado
- [ ] Analytics de conversão activas
- [ ] Relatórios automáticos mensais

## ☐ Fase 4 — Escala

- [ ] Gestão de equipa implementada
- [ ] Portal do Cliente v2 com aprovações
- [ ] App mobile / PWA lançada
- [ ] Integrações de facturação activas

---

## 8. RESUMO DE ESFORÇOS

| Fase | Duração | Horas Estimadas |
| :--- | :--- | :--- |
| Fase 1 — Fundações | 4 semanas | 64-84h |
| Fase 2 — Profundidade | 6 semanas | 152-194h |
| Fase 3 — Inteligência | 6 semanas | 112-140h |
| Fase 4 — Escala | 8 semanas | 230-290h |
| Quick Wins | Contínuo | 27h |
| **TOTAL** | **24 semanas** | **585-735h** |

---

## 9. PRÓXIMOS PASSOS

1. **Semana 1:** Implementar Quick Wins #1, #2, #7 (projectos parados)
2. **Semana 2:** Iniciar Painel do Dia
3. **Semana 3-4:** Sistema de registo de horas
4. **Revisão mensal:** Avaliar progresso e ajustar prioridades

**FA-360 Studio Manager**
*Abrimos Portas, Fechamos Projetos.*
