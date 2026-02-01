# FA-360 Platform - Quick Start Guide

## 🚀 Comandos Essenciais

### Desenvolvimento Local

```bash
npm run dev
```

Abre em: `http://localhost:3000/`

### Build de Produção

```bash
npm run build
```

### Validar TypeScript

```bash
npm run type-check
```

### Deploy Rápido

```bash
.\deploy.bat
```

Ou manualmente:

```bash
git add .
git commit -m "sua mensagem"
git push origin main
```

---

## 📍 Rotas Principais

| Rota            | Descrição                  |
| --------------- | -------------------------- |
| `/`             | Dashboard principal        |
| `/#/calculator` | Calculadora de honorários  |
| `/#/tasks`      | Gestão de tarefas          |
| `/#/proposals`  | Gerador de propostas       |
| `/#/clients`    | Gestão de clientes         |
| `/#/projects`   | Gestão de projetos         |

---

## ✅ Status Atual (30 Jan 2026)

- ✅ **TypeScript:** Sem erros
- ✅ **Build:** Funcional (5.74s)
- ✅ **Servidor Local:** Rodando em `localhost:3000`
- ✅ **Dependências:** Atualizadas (`@vercel/node` instalado)
- ✅ **Deploy:** Pronto para produção

---

## 🔧 Troubleshooting

### Servidor não inicia

```bash
# Reinstalar dependências
npm install
npm run dev
```

### Erros de TypeScript

```bash
# Validar tipos
npm run type-check
```

### Build falha

```bash
# Limpar cache e rebuildar
rm -rf dist node_modules
npm install
npm run build
```

---

## 🌐 URLs

**Local:** `http://localhost:3000/`  
**Produção:** `https://360-puce.vercel.app/`

---

**Última Atualização:** 30 Janeiro 2026  
**Status:** ✅ Produção Ready
