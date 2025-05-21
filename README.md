# 🤖 Bot Pizzaria

Este é um projeto full stack monolítico para um atendente virtual de pizzaria com IA. Ele utiliza **DeepSeek** como modelo de linguagem, comunicação em tempo real com **WebSocket**, e armazena o histórico em **SQLite** via **Prisma ORM**. O projeto está containerizado com Docker e já possui **testes automatizados** para garantir a qualidade das interações.

---

## 🧱 Stack Tecnológica

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + TypeScript + WebSocket
- **IA**: DeepSeek API
- **Banco de Dados**: SQLite via Prisma ORM
- **Containerização**: Docker + Docker Compose
- **Testes**: Jest + Supertest

---

## 🚀 Como Rodar o Projeto

### ⚠️ Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- (Opcional) [pnpm](https://pnpm.io/) para gerenciamento de pacotes

---


## ⚙️ Variáveis de Ambiente

1. adicione ao `.env` sua chave de API do DeepSeek:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

> Caso não possua uma chave, entre em contato com o desenvolvedor para obter uma temporária.

---

## 🐳 Rodando com Docker

O modo mais simples de iniciar o projeto é via Docker:

```bash
docker-compose up --build
```

Acesse:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## 🧠 Prisma (uso local opcional)

```bash
cd backend
pnpm install
npx prisma generate
npx prisma migrate dev --name init
pnpm dev
```

---

## 🖥️ Frontend Local

```bash
cd frontend
pnpm install
pnpm dev
```

---

## 🔌 WebSocket

O backend expõe um WebSocket para conversas em tempo real via `socket.io`. A comunicação é iniciada automaticamente no frontend com base no `window.location.hostname`.

---

## 🧾 Histórico de Conversas

Toda troca de mensagens é armazenada no SQLite. Ao reabrir o chat, o histórico é recuperado automaticamente.

---

## 🧪 Testes Automatizados

O backend contém testes com **Jest + Supertest**.

Para executar os testes:

```bash
cd backend
pnpm test
```

---

## 📦 Build de Produção

```bash
# Backend
cd backend
pnpm build

# Frontend
cd frontend
pnpm build
```

Ou use Docker para builds automáticos.

---

## 🛡️ Licença

Projeto licenciado sob a licença MIT.