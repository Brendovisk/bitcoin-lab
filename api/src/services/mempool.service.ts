import { signet } from '../lib/rpc.js';
import type { MempoolTx, RawMempoolVerbose, RawTransaction } from '../types/index.js';

function toSatoshis(btc: number): number {
  return Math.round(btc * 1e8);
}

async function getTx(txid: string): Promise<MempoolTx | null> {
  try {
    const [entry, raw] = await Promise.all([
      signet.call<{ vsize: number; fees: { base: number } }>('getmempoolentry', [txid]),
      signet.call<RawTransaction>('getrawtransaction', [txid, true]),
    ]);

    const feeSats = toSatoshis(entry.fees.base);
    const feeRate = Math.round(feeSats / entry.vsize);
    const totalOut = raw.vout.reduce((acc, o) => acc + toSatoshis(o.value), 0);

    return {
      id: txid.slice(0, 16),
      sats: totalOut,
      fee: feeRate,
      vsize: entry.vsize,
    };
  } catch {
    return null;
  }
}

async function getLatestTxs(count = 8): Promise<MempoolTx[]> {
  const mempool = await signet.call<RawMempoolVerbose>('getrawmempool', [true]);
  const entries = Object.entries(mempool)
    .sort(([, a], [, b]) => b.time - a.time)
    .slice(0, count * 2); // fetch extra to account for failures

  const results: MempoolTx[] = [];
  for (const [txid] of entries) {
    if (results.length >= count) break;
    const tx = await getTx(txid);
    if (tx) results.push(tx);
  }

  return results;
}

export const mempoolService = { getTx, getLatestTxs };
