import type { FastifyInstance } from 'fastify';
import { blocksService } from '../../services/blocks.service.js';
import { networkService } from '../../services/network.service.js';
import { cache } from '../../lib/cache.js';

export async function blocksRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/blocks/latest', async () => {
    if (cache.blocks.length > 0) {
      return { blocks: cache.blocks };
    }
    const blocks = await blocksService.getLatestBlocks(5);
    cache.setBlocks(blocks);
    return { blocks };
  });

  app.get('/api/blocks/stats', async () => {
    return networkService.getStats();
  });
}
