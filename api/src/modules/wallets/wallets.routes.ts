import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { walletsService } from '../../services/wallets.service.js';

const CreateWalletBody = z.object({ name: z.string().min(1).max(64) });
const SendBody = z.object({
  address: z.string().min(10),
  amount: z.number().positive().max(21_000_000),
});
const GenerateBody = z.object({ blocks: z.number().int().min(1).max(1000) });

export async function walletsRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/wallets', async () => {
    const names = await walletsService.listWallets();
    return { wallets: names };
  });

  app.post('/api/wallets', async (req) => {
    const { name } = CreateWalletBody.parse(req.body);
    return walletsService.createWallet(name);
  });

  app.post('/api/wallets/:name/load', async (req) => {
    const { name } = req.params as { name: string };
    return walletsService.loadWallet(name);
  });

  app.get('/api/wallets/:name/info', async (req) => {
    const { name } = req.params as { name: string };
    return walletsService.getWalletInfo(name);
  });

  app.get('/api/wallets/:name/address', async (req) => {
    const { name } = req.params as { name: string };
    const address = await walletsService.getNewAddress(name);
    return { address };
  });

  app.get('/api/wallets/:name/balance', async (req) => {
    const { name } = req.params as { name: string };
    const balance = await walletsService.getBalance(name);
    const sats = Math.round(balance * 1e8);
    return { balance, sats };
  });

  app.get('/api/wallets/:name/utxos', async (req) => {
    const { name } = req.params as { name: string };
    const utxos = await walletsService.listUnspent(name);
    return { utxos };
  });

  app.post('/api/wallets/:name/send', async (req) => {
    const { name } = req.params as { name: string };
    const { address, amount } = SendBody.parse(req.body);
    return walletsService.sendToAddress(name, address, amount);
  });

  app.post('/api/wallets/:name/generate', async (req) => {
    const { name } = req.params as { name: string };
    const { blocks } = GenerateBody.parse(req.body);
    const hashes = await walletsService.generateToAddress(name, blocks);
    return { hashes, count: hashes.length };
  });
}
