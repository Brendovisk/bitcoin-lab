import { regtest } from '../lib/rpc.js';
import type { Block, RawBlock, RawBlockchainInfo } from '../types/index.js';

function formatAge(timestamp: number): string {
  const diff = Math.floor((Date.now() / 1000 - timestamp) / 60);
  if (diff < 1) return '<1min';
  if (diff < 60) return `${diff}min`;
  const h = Math.floor(diff / 60);
  return `${h}h`;
}

function formatSize(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(2)} MB`;
}

function toBlock(raw: RawBlock): Block {
  return {
    height: raw.height,
    hash: raw.hash,
    txs: raw.nTx,
    size: formatSize(raw.size),
    time: formatAge(raw.time),
  };
}

async function getLatestBlocks(count = 5): Promise<Block[]> {
  const info = await regtest.call<RawBlockchainInfo>('getblockchaininfo');
  const tipHeight = info.blocks;

  const blocks: Block[] = [];
  for (let i = 0; i < count; i++) {
    const height = tipHeight - i;
    if (height < 0) break;
    const hash = await regtest.call<string>('getblockhash', [height]);
    const raw = await regtest.call<RawBlock>('getblock', [hash, 1]);
    blocks.push(toBlock(raw));
  }

  return blocks;
}

async function getBlockByHash(hash: string): Promise<Block | null> {
  try {
    const raw = await regtest.call<RawBlock>('getblock', [hash, 1]);
    return toBlock(raw);
  } catch {
    return null;
  }
}

async function getCurrentHeight(): Promise<number> {
  return regtest.call<number>('getblockcount');
}

export const blocksService = { getLatestBlocks, getBlockByHash, getCurrentHeight };
