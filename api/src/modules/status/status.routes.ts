import type { FastifyInstance } from 'fastify';
import { networkService } from '../../services/network.service.js';
import { cache } from '../../lib/cache.js';

export async function statusRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/status', async () => {
    const regtest = await networkService.getRegtestStatus();
    cache.setRegtestOnline(regtest.online);
    return { regtest };
  });

  app.get('/api/status/block', async () => {
    return { height: cache.regtestBlock };
  });
}
