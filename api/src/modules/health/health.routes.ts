import type { FastifyInstance } from 'fastify';
import { signet, regtest } from '../../lib/rpc.js';
import { zmqAvailable } from '../../lib/zmq.js';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => {
    const [signetOk, regtestOk] = await Promise.all([signet.ping(), regtest.ping()]);
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      nodes: {
        signet: signetOk,
        regtest: regtestOk,
      },
      zmq: zmqAvailable,
    };
  });
}
