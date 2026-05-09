import type { FastifyInstance } from 'fastify';
import { regtest } from '../../lib/rpc.js';
import { zmqAvailable } from '../../lib/zmq.js';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => {
    const regtestOk = await regtest.ping();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      nodes: {
        regtest: regtestOk,
      },
      zmq: zmqAvailable,
    };
  });
}
