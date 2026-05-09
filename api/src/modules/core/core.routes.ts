import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { regtest } from '../../lib/rpc.js';

// Only safe read + regtest-write commands are allowed
const ALLOWED = new Set([
  'getblockchaininfo',
  'getblockcount',
  'getblockhash',
  'getblock',
  'getblockheader',
  'getbestblockhash',
  'getchaintips',
  'getdifficulty',
  'getmempoolinfo',
  'getrawmempool',
  'getrawtransaction',
  'decoderawtransaction',
  'getmininginfo',
  'getnetworkinfo',
  'getnettotals',
  'getwalletinfo',
  'getbalance',
  'getnewaddress',
  'getaddressinfo',
  'validateaddress',
  'listunspent',
  'listwallets',
  'listreceivedbyaddress',
  'listtransactions',
  'createwallet',
  'loadwallet',
  'sendtoaddress',
  'generatetoaddress',
  'generate',
  'createrawtransaction',
  'signrawtransactionwithwallet',
  'sendrawtransaction',
  'testmempoolaccept',
  'estimatesmartfee',
]);

// Commands blocked regardless of any allowlist
const BLOCKED = new Set([
  'stop',
  'shutdown',
  'backupwallet',
  'dumpwallet',
  'dumpprivkey',
  'importprivkey',
  'importwallet',
  'encryptwallet',
  'walletlock',
  'walletpassphrase',
  'walletpassphrasechange',
]);

const RPCBody = z.object({
  command: z.string().min(1).max(64),
  params: z.array(z.unknown()).default([]),
  wallet: z.string().optional(),
});

export async function coreRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/rpc', async (req, reply) => {
    const { command, params, wallet } = RPCBody.parse(req.body);
    const cmd = command.toLowerCase().trim();

    if (BLOCKED.has(cmd)) {
      return reply.status(403).send({ error: `Command "${cmd}" is blocked for safety.` });
    }

    if (!ALLOWED.has(cmd)) {
      return reply.status(403).send({
        error: `Command "${cmd}" is not in the whitelist. Only regtest commands are allowed.`,
        allowed: [...ALLOWED].sort(),
      });
    }

    const result = await regtest.call<unknown>(cmd, params as unknown[], wallet);
    return { result };
  });

  app.get('/api/rpc/commands', async () => {
    return { commands: [...ALLOWED].sort() };
  });
}
