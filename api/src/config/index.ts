import 'dotenv/config';
import { z } from 'zod';

const Schema = z.object({
  PORT: z.coerce.number().default(3001),

  MAINNET_RPC_HOST: z.string().default('127.0.0.1'),
  MAINNET_RPC_PORT: z.coerce.number().default(8332),
  MAINNET_RPC_USER: z.string().default('dev'),
  MAINNET_RPC_PASS: z.string().default('devpass'),

  REGTEST_RPC_HOST: z.string().default('127.0.0.1'),
  REGTEST_RPC_PORT: z.coerce.number().default(18443),
  REGTEST_RPC_USER: z.string().default('dev'),
  REGTEST_RPC_PASS: z.string().default('devpass'),

  ZMQ_HASHBLOCK_URL: z.string().default('tcp://127.0.0.1:28332'),
  ZMQ_HASHTX_URL: z.string().default('tcp://127.0.0.1:28333'),

  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export const config = Schema.parse(process.env);
