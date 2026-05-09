import type { FastifyInstance } from 'fastify';
import { mempoolService } from '../../services/mempool.service.js';
import { cache } from '../../lib/cache.js';

export async function mempoolRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/mempool/txs', async (_req, reply) => {
    reply.header('Cache-Control', 'no-store');

    const txs = await mempoolService.getLatestTxs(8);
    cache.setTxs(txs);
    return { txs };
  });
}
