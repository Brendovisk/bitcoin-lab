import type { FastifyInstance } from 'fastify';
import { mainnet, regtest } from '../../lib/rpc.js';
import { zmqAvailable } from '../../lib/zmq.js';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => {
    const [mainnetOk, regtestOk] = await Promise.all([mainnet.ping(), regtest.ping()]);
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      nodes: {
        mainnet: mainnetOk,
        regtest: regtestOk,
      },
      zmq: zmqAvailable,
    };
  });
}
