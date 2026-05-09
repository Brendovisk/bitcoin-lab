# Bitcoin Lab API

Backend Fastify que conecta o Bitcoin Caveman Lab ao Bitcoin Core real.

## Stack

- **Fastify** — HTTP server
- **TypeScript** via `tsx` — sem build step em dev
- **ZMQ** (`zeromq@6`) — eventos realtime do Bitcoin Core
- **SSE** — Server-Sent Events para push ao frontend
- **Zod** — validação de inputs
- **fetch** nativo — cliente JSON-RPC para Bitcoin Core

## Pré-requisitos

- Node.js 20+
- Bitcoin Core rodando (mainnet e/ou regtest)

## Configuração do bitcoin.conf

Adicione os publishers ZMQ para notificações de bloco e transação:

```ini
##################################################
# GLOBAL
##################################################

server=1
daemon=1

rpcuser=dev
rpcpassword=devpass

# ZMQ — publishers hash (mais leves que raw)
zmqpubhashblock=tcp://127.0.0.1:28332
zmqpubhashtx=tcp://127.0.0.1:28333

# Manter os raw também se quiser (opcional)
zmqpubrawblock=tcp://127.0.0.1:28332
zmqpubrawtx=tcp://127.0.0.1:28333

##################################################
# MAINNET
##################################################

prune=4000

##################################################
# REGTEST
##################################################

[regtest]

rpcport=18443
fallbackfee=0.0001
txindex=1
```

> **Importante:** Após editar o bitcoin.conf, reinicie o bitcoind:
> ```bash
> bitcoin-cli stop
> bitcoind -daemon
>
> # Para regtest em processo separado:
> bitcoind -regtest -daemon
> ```

## Setup

```bash
# Na raiz do monorepo
npm install

# Copiar env
cp api/.env.example api/.env

# Editar conforme sua configuração local
nano api/.env
```

## Rodar em dev

```bash
# Apenas a API
npm run dev:api

# Ambos (frontend + API)
npm run dev
```

A API sobe em `http://localhost:3001`.

## Endpoints

### Health

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Status geral (mainnet, regtest, ZMQ) |

### Status

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/status` | Status de ambos os nós |
| `GET` | `/api/status/block` | Altura atual do bloco (mainnet) |

### Blockchain (mainnet, read-only)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/blocks/latest` | Últimos 5 blocos |
| `GET` | `/api/blocks/stats` | Hashrate, dificuldade, próximo halving |

### Mempool (mainnet, read-only)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/mempool/txs` | Últimas 8 transações da mempool |

### SSE — Realtime

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/sse/blocks` | Stream: novos blocos |
| `GET` | `/api/sse/mempool` | Stream: novas txs da mempool |
| `GET` | `/api/sse/status` | Stream: mudanças de status/bloco |

#### Eventos SSE `/api/sse/blocks`

```
event: init
data: {"blocks": [...]}

event: block
data: {"height": 895000, "hash": "...", "txs": 2341, "size": "1.45 MB", "time": "3min"}
```

#### Eventos SSE `/api/sse/mempool`

```
event: init
data: {"txs": [...]}

event: tx
data: {"id": "abcd1234...", "sats": 500000, "fee": 42, "vsize": 250}
```

### Wallets (regtest only)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/wallets` | Listar wallets carregadas |
| `POST` | `/api/wallets` | Criar wallet `{name}` |
| `POST` | `/api/wallets/:name/load` | Carregar wallet |
| `GET` | `/api/wallets/:name/info` | Info da wallet |
| `GET` | `/api/wallets/:name/address` | Gerar novo endereço |
| `GET` | `/api/wallets/:name/balance` | Saldo em BTC e sats |
| `GET` | `/api/wallets/:name/utxos` | Listar UTXOs |
| `POST` | `/api/wallets/:name/send` | Enviar BTC `{address, amount}` |
| `POST` | `/api/wallets/:name/generate` | Minerar blocos `{blocks}` |

### UTXOs (regtest)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/utxos?wallet=<name>` | Listar UTXOs da wallet |

### RPC Terminal (regtest only)

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/rpc` | Executar comando whitelisted |
| `GET` | `/api/rpc/commands` | Listar comandos permitidos |

#### Exemplo RPC

```bash
curl -X POST http://localhost:3001/api/rpc \
  -H "Content-Type: application/json" \
  -d '{"command": "getblockchaininfo", "params": []}'

curl -X POST http://localhost:3001/api/rpc \
  -H "Content-Type: application/json" \
  -d '{"command": "generatetoaddress", "params": [10, "bcrt1q..."], "wallet": "minha-wallet"}'
```

## Segurança

- Operações de escrita (send, generate) somente em **regtest**
- Mainnet é **read-only** em todos os endpoints
- RPC terminal tem whitelist explícita de comandos permitidos
- Comandos destrutivos (`stop`, `dumpwallet`, `dumpprivkey`, etc.) bloqueados
- Inputs validados com Zod em todas as rotas

## Arquitetura

```
src/
├── config/         # Variáveis de ambiente (Zod)
├── lib/
│   ├── rpc.ts      # Cliente JSON-RPC tipado (fetch nativo)
│   ├── zmq.ts      # Subscriber ZMQ + polling fallback
│   ├── event-bus.ts # EventEmitter tipado (ZMQ → SSE)
│   └── cache.ts    # Cache em memória (blocos + txs)
├── services/       # Lógica de negócio
│   ├── blocks.service.ts
│   ├── mempool.service.ts
│   ├── network.service.ts
│   └── wallets.service.ts
├── modules/        # Rotas por domínio
│   ├── blocks/
│   ├── mempool/
│   ├── wallets/
│   ├── utxos/
│   ├── core/       # RPC terminal
│   ├── sse/        # Server-Sent Events
│   ├── status/
│   └── health/
└── server.ts       # Entry point
```

## Fluxo ZMQ → SSE

```
Bitcoin Core
    │ zmqpubhashblock (novo bloco minerado)
    ↓
zmq.ts (Subscriber)
    │ hash do bloco
    ↓
blocksService.getBlockByHash(hash)
    │ dados do bloco via RPC
    ↓
cache.pushBlock(block)
bus.emit('block', block)
    │
    ↓
sse.routes.ts (todos os clientes conectados)
    │ event: block\ndata: {...}\n\n
    ↓
Frontend (EventSource)
    │ setBlocks([novoBloco, ...anteriores])
    ↓
UI atualiza em tempo real
```

Se ZMQ não estiver disponível, o sistema faz polling automático a cada 30s para blocos e 4s para mempool.
