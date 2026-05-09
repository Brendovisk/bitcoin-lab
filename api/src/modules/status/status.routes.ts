import type { FastifyInstance } from 'fastify';
import { networkService } from '../../services/network.service.js';
import { cache } from '../../lib/cache.js';

export async function statusRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/status', async () => {
    const [mainnet, regtest] = await Promise.all([
      networkService.getMainnetStatus(),
      networkService.getRegtestStatus(),
    ]);

    cache.setMainnetOnline(mainnet.online);
    cache.setRegtestOnline(regtest.online);

    return { mainnet, regtest };
  });

  app.get('/api/status/block', async () => {
    return { height: cache.mainnetBlock };
  });
}
