import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { walletsService } from '../../services/wallets.service.js';

const QuerySchema = z.object({
  wallet: z.string().default(''),
});

export async function utxosRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/utxos', async (req) => {
    const { wallet } = QuerySchema.parse(req.query);
    const utxos = await walletsService.listUnspent(wallet);
    return { utxos };
  });
}
