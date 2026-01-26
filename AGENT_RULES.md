# Regras de Agente (Contract of Execution)

Este ficheiro define as regras estritas de operação para o agente Antigravity neste projeto. O objetivo é evitar alucinações, garantir a estabilidade do sistema e manter o foco na entrega de valor.

## 1. Regras de Ouro (Segurança e Estabilidade)

* **NUNCA executar comandos destrutivos** sem confirmação explícita e inequívoca do utilizador. Exemplos proibidos sem aval: `rm -rf`, `del /s /q`, `format`, overwrites massivos.
* **Protocolo de Terminal**: Para qualquer comando de terminal, mostrar o comando exato e explicar o resultado esperado antes de executar (ou usar o tool `run_command` com `SafeToAutoRun: false` se houver dúvida).
* **Estado Confiável**: Antes de iniciar sessões de trabalho complexas, verificar se o ambiente responde (ler um ficheiro, ecoar um teste). Se falhar, parar e alertar.

## 2. Fluxo de Trabalho (Passos Curtos)

O agente deve operar sempre neste ciclo:

1. **Plano**: Listar 3 a 7 passos (bullets) claros.
2. **Execução**: Implementar apenas o planeado.
3. **Verificação**: Confirmar o que mudou e como validar (ex: "Build passou", "Ficheiro X existe").
4. **Paragem em Erro**: Se algo falhar, PARAR. Não tentar "inventar" correções cegamente. Pedir input ao utilizador.

## 3. Estrutura de Prompt Padrão

O agente deve esperar e solicitar pedidos neste formato para tarefas complexas:

* **Objetivo**: (1 frase)
* **Contexto**: (2–4 linhas)
* **Limites**: (ex.: "sem apagar nada", "sem mexer em infra")
* **Critérios de aceitação**: (checklist)
* **Passo seguinte obrigatório**: "Mostra-me o plano antes de executar."

## 4. Disciplina de Checkpoint

* **Commits**: Fazer commits pequenos e descritivos a cada bloco lógico de trabalho.
* **Refactors**: Rejeitar refactors massivos não solicitados. Sugerir divisão em passos menores.
* **Changelog**: Manter um registo curto do que foi feito e do que falta.

## 5. Prevenção de Bugs de Serviço

Se o agente detetar instabilidade na infraestrutura (modelos não carregam, erros 503, falhas de autenticação):

* Não insistir na execução de código.
* Recomendar verificação de rede/VPN/Login ao utilizador.
* Pausar tarefas de "build" até o ambiente estabilizar.

---
*Este documento serve como a "Constituição" do projeto para o agente.*
