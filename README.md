# ⛏ Bitcoin Caveman Lab

> **Bitcoin não deveria parecer mágica.**  
> Um laboratório interativo para ver, mexer e entender o protocolo — blocos, UTXOs, mempool, mineração e autocustódia, na prática.

---

## O que é isso?

O **Caveman Lab** é um ambiente de aprendizado que conecta uma interface moderna a um nó Bitcoin real (regtest). Você não lê sobre blocos — você vê eles chegando. Você não estuda UTXOs num slide — você assiste inputs sendo consumidos e outputs nascendo.

Tudo roda localmente. Sem KYC. Sem mágica.

---

## Estrutura

```
bitcoin-lab/
├── web/      → Next.js 15  (frontend interativo)
└── api/      → Fastify     (ponte com o Bitcoin Core)
```

Monorepo com npm workspaces. Um `npm run dev` sobe os dois.

---

## As 9 Estações do Lab

| # | Estação | O que você faz |
|---|---------|----------------|
| I | **Blockchain** | Vê blocos encadeando em tempo real. Inspeciona hashes, altura, prova-de-trabalho. |
| II | **Mempool** | Acompanha transações esperando confirmação. Taxas brigando por espaço. |
| III | **UTXOs** | Visualiza inputs sendo consumidos e outputs nascendo a cada tx. |
| IV | **Transações** | Monta uma transação peça por peça — inputs, outputs, troco, taxa — e faz broadcast. |
| V | **Carteiras & Seeds** | 12 palavras → bilhões de chaves. Deriva endereços, entende a árvore HD (BIP39). |
| VI | **Redes** | Compara regtest, signet e mainnet. Aprende quando usar cada uma. |
| VII | **Bitcoin Core** | Terminal real. Digita comandos, lê respostas, conversa com o nó. |
| VIII | **Mineração** | Vê o nonce dançando, o hash tentando bater no alvo. Mine um bloco na mão. |
| IX | **Desafios** | 9 missões progressivas — recupere fundos, decifre scripts, prove que entende. |

---

## Stack

**Frontend**
- [Next.js 15](https://nextjs.org/) + React 19 + TypeScript
- Tailwind CSS v4 + Radix UI (shadcn-style)
- Three.js (moeda 3D), Recharts, TanStack Query

**API**
- [Fastify](https://fastify.dev/) + TypeScript
- ZeroMQ (eventos do Core em tempo real)
- SSE (Server-Sent Events para o browser)
- Zod (validação)

**Bitcoin**
- Bitcoin Core via JSON-RPC
- Regtest (leitura + escrita — sua rede local)

---

## Rodando localmente

### Pré-requisitos

- Node.js 20+
- Bitcoin Core rodando em modo regtest

### 1. Clone e instale

```bash
git clone https://github.com/seu-usuario/bitcoin-lab.git
cd bitcoin-lab
npm install
```

### 2. Configure o ambiente da API

```bash
cp api/.env.example api/.env
```

Edite `api/.env` com os dados do seu Bitcoin Core:

```env
PORT=3001

REGTEST_RPC_HOST=127.0.0.1
REGTEST_RPC_PORT=18443
REGTEST_RPC_USER=dev
REGTEST_RPC_PASS=devpass

ZMQ_HASHBLOCK_URL=tcp://127.0.0.1:28332
ZMQ_HASHTX_URL=tcp://127.0.0.1:28333

CORS_ORIGIN=http://localhost:3000
```

### 3. Sobe tudo

```bash
npm run dev
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:3001 |

---

## Scripts disponíveis

```bash
npm run dev          # web + api juntos
npm run dev:web      # só o frontend
npm run dev:api      # só a API
npm run build        # build completo
```

---

## Filosofia

```
01 / ver       → Cada bloco, UTXO e assinatura renderizados na tela. Sem caixas-pretas.
02 / mexer     → Tudo em regtest. Quebre coisas, reinicie, mine blocos sozinho.
03 / entender  → Conceitos explicados como na fogueira. Direto, visual, prático.
04 / soberano  → Seeds BIP39, derivação de chaves, assinatura local. Suas chaves, seu Bitcoin.
```

---

## Segurança

- **Regtest** → leitura + escrita (rede local isolada)
- Comandos RPC expostos pela API passam por whitelist — os destrutivos estão bloqueados

---

*Pegue uma pedra. Comece a quebrar.*
