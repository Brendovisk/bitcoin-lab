import type { FastifyInstance } from 'fastify';
import { mempoolService } from '../../services/mempool.service.js';
import { cache } from '../../lib/cache.js';

export async function mempoolRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/mempool/txs', async () => {
    if (cache.txs.length > 0) {
      return { txs: cache.txs };
    }
    const txs = await mempoolService.getLatestTxs(8);
    cache.setTxs(txs);
    return { txs };
  });
}
