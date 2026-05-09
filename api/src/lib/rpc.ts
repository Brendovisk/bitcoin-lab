import { config } from '../config/index.js';
import type { RPCResponse } from '../types/index.js';

type RPCConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
};

class BitcoinRPC {
  private readonly auth: string;
  private readonly baseUrl: string;
  private reqId = 0;

  constructor(cfg: RPCConfig) {
    this.auth = Buffer.from(`${cfg.user}:${cfg.pass}`).toString('base64');
    this.baseUrl = `http://${cfg.host}:${cfg.port}`;
  }

  async call<T>(method: string, params: unknown[] = [], wallet?: string): Promise<T> {
    const url = wallet ? `${this.baseUrl}/wallet/${encodeURIComponent(wallet)}` : this.baseUrl;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${this.auth}`,
      },
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: ++this.reqId,
        method,
        params,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(`Bitcoin RPC HTTP ${res.status}: ${text}`);
    }

    const data = (await res.json()) as RPCResponse<T>;

    if (data.error) {
      throw new Error(`Bitcoin RPC error (${data.error.code}): ${data.error.message}`);
    }

    return data.result;
  }

  async ping(): Promise<boolean> {
    try {
      await this.call('getblockcount');
      return true;
    } catch {
      return false;
    }
  }
}

export const mainnet = new BitcoinRPC({
  host: config.MAINNET_RPC_HOST,
  port: config.MAINNET_RPC_PORT,
  user: config.MAINNET_RPC_USER,
  pass: config.MAINNET_RPC_PASS,
});

export const regtest = new BitcoinRPC({
  host: config.REGTEST_RPC_HOST,
  port: config.REGTEST_RPC_PORT,
  user: config.REGTEST_RPC_USER,
  pass: config.REGTEST_RPC_PASS,
});
