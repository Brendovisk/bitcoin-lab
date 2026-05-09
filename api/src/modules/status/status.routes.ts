import type { FastifyInstance } from 'fastify';
import { networkService } from '../../services/network.service.js';
import { cache } from '../../lib/cache.js';

export async function statusRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/status', async () => {
    const [signet, regtest] = await Promise.all([
      networkService.getSignetStatus(),
      networkService.getRegtestStatus(),
    ]);

    cache.setSignetOnline(signet.online);
    cache.setRegtestOnline(regtest.online);

    return { signet, regtest };
  });

  app.get('/api/status/block', async () => {
    return { height: cache.signetBlock };
  });
}
