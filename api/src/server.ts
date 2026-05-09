import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "./config/index.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { statusRoutes } from "./modules/status/status.routes.js";
import { blocksRoutes } from "./modules/blocks/blocks.routes.js";
import { mempoolRoutes } from "./modules/mempool/mempool.routes.js";
import { walletsRoutes } from "./modules/wallets/wallets.routes.js";
import { utxosRoutes } from "./modules/utxos/utxos.routes.js";
import { coreRoutes } from "./modules/core/core.routes.js";
import { sseRoutes } from "./modules/sse/sse.routes.js";
import { initZMQ } from "./lib/zmq.js";
import { blocksService } from "./services/blocks.service.js";
import { mempoolService } from "./services/mempool.service.js";
import { networkService } from "./services/network.service.js";
import { cache } from "./lib/cache.js";
import { bus } from "./lib/event-bus.js";

const app = Fastify({ logger: { level: "info" } });

await app.register(cors, {
  origin: (origin, cb) => {
    // Allow configured origin and same-host (no Origin header = non-browser)
    if (!origin || origin === config.CORS_ORIGIN) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: false,
});

// Global error handler for Zod validation errors
app.setErrorHandler((error, _req, reply) => {
  if (error.name === "ZodError") {
    return reply.status(400).send({ error: "Validation error", details: error.message });
  }
  app.log.error(error);
  return reply.status(500).send({ error: error.message || "Internal server error" });
});

// Register all route modules
await app.register(healthRoutes);
await app.register(statusRoutes);
await app.register(blocksRoutes);
await app.register(mempoolRoutes);
await app.register(walletsRoutes);
await app.register(utxosRoutes);
await app.register(coreRoutes);
await app.register(sseRoutes);

async function warmCache(): Promise<void> {
  try {
    const [blocks, txs, status] = await Promise.allSettled([
      blocksService.getLatestBlocks(5),
      mempoolService.getLatestTxs(8),
      networkService.getMainnetStatus(),
    ]);

    if (blocks.status === "fulfilled") {
      cache.setBlocks(blocks.value);
      app.log.info({ count: blocks.value.length }, "[cache] blocks loaded");
    } else {
      app.log.warn("[cache] mainnet blocks unavailable — is mainnet node running?");
    }

    if (txs.status === "fulfilled") {
      cache.setTxs(txs.value);
      app.log.info({ count: txs.value.length }, "[cache] mempool txs loaded");
    }

    if (status.status === "fulfilled") {
      cache.setMainnetOnline(status.value.online);
      bus.emit("mainnet:status", status.value.online);
    }
  } catch (err) {
    app.log.warn({ err }, "[cache] warm failed");
  }
}

// Status polling every 60s
setInterval(async () => {
  const [mainnet, regtest] = await Promise.allSettled([
    networkService.getMainnetStatus(),
    networkService.getRegtestStatus(),
  ]);
  if (mainnet.status === "fulfilled") {
    cache.setMainnetOnline(mainnet.value.online);
    bus.emit("mainnet:status", mainnet.value.online);
  }
  if (regtest.status === "fulfilled") {
    cache.setRegtestOnline(regtest.value.online);
    bus.emit("regtest:status", regtest.value.online);
  }
}, 60_000);

await app.listen({ port: config.PORT, host: "0.0.0.0" });
app.log.info(`Bitcoin Lab API listening on :${config.PORT}`);

await warmCache();
await initZMQ();
