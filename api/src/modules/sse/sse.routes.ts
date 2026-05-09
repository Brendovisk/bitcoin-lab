import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { bus } from '../../lib/event-bus.js';
import type { Block, MempoolTx } from '../../types/index.js';
import { cache } from '../../lib/cache.js';
import { config } from '../../config/index.js';

function openSSE(req: FastifyRequest, reply: FastifyReply): ServerResponse {
  const origin = req.headers.origin;
  const allowOrigin =
    origin === config.CORS_ORIGIN ? origin : config.CORS_ORIGIN;

  // writeHead flushes status + headers immediately to the socket.
  // This must happen before reply.hijack() so headers reach the client
  // before Fastify's pipeline (including CORS plugin) can interfere.
  reply.raw.writeHead(200, {
    'Access-Control-Allow-Origin': allowOrigin,
    'Vary': 'Origin',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  reply.hijack();
  return reply.raw;
}

function send(raw: ServerResponse, event: string, data: unknown): void {
  raw.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function keepAlive(raw: ServerResponse): NodeJS.Timeout {
  return setInterval(() => raw.write(': ping\n\n'), 30_000);
}

function onClose(req: { raw: IncomingMessage }, cb: () => void): void {
  req.raw.on('close', cb);
}

export async function sseRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/sse/blocks', (req, reply) => {
    const raw = openSSE(req, reply);

    if (cache.blocks.length > 0) send(raw, 'init', { blocks: cache.blocks });

    const onBlock = (block: Block) => send(raw, 'block', block);
    bus.on('block', onBlock);
    const timer = keepAlive(raw);

    onClose(req, () => {
      bus.off('block', onBlock);
      clearInterval(timer);
    });
  });

  app.get('/api/sse/mempool', (req, reply) => {
    const raw = openSSE(req, reply);

    if (cache.txs.length > 0) send(raw, 'init', { txs: cache.txs });

    const onTx = (tx: MempoolTx) => send(raw, 'tx', tx);
    bus.on('tx', onTx);
    const timer = keepAlive(raw);

    onClose(req, () => {
      bus.off('tx', onTx);
      clearInterval(timer);
    });
  });

  app.get('/api/sse/status', (req, reply) => {
    const raw = openSSE(req, reply);

    const onBlock = (block: Block) => send(raw, 'block-height', { height: block.height });
    const onMainnet = (online: boolean) => send(raw, 'mainnet-status', { online });
    const onRegtest = (online: boolean) => send(raw, 'regtest-status', { online });

    bus.on('block', onBlock);
    bus.on('mainnet:status', onMainnet);
    bus.on('regtest:status', onRegtest);
    const timer = keepAlive(raw);

    onClose(req, () => {
      bus.off('block', onBlock);
      bus.off('mainnet:status', onMainnet);
      bus.off('regtest:status', onRegtest);
      clearInterval(timer);
    });
  });
}
