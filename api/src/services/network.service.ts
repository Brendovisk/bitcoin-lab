import { signet, regtest } from '../lib/rpc.js';
import type { NetworkStats, NodeStatus, RawBlockchainInfo, RawMiningInfo } from '../types/index.js';

const HALVING_INTERVAL = 210_000;

function formatHashrate(hps: number): string {
  if (hps >= 1e18) return `${(hps / 1e18).toFixed(0)} EH/s`;
  if (hps >= 1e15) return `${(hps / 1e15).toFixed(0)} PH/s`;
  if (hps >= 1e12) return `${(hps / 1e12).toFixed(0)} TH/s`;
  return `${hps.toFixed(0)} H/s`;
}

function formatDifficulty(d: number): string {
  if (d >= 1e12) return `${(d / 1e12).toFixed(2)} T`;
  if (d >= 1e9) return `${(d / 1e9).toFixed(2)} G`;
  return d.toFixed(2);
}

function nextHalvingBlock(currentHeight: number): number {
  const epoch = Math.floor(currentHeight / HALVING_INTERVAL);
  return (epoch + 1) * HALVING_INTERVAL;
}

function halvingDays(currentHeight: number): number {
  const blocksLeft = nextHalvingBlock(currentHeight) - currentHeight;
  return Math.round((blocksLeft * 10) / (60 * 24));
}

async function getStats(): Promise<NetworkStats> {
  const [info, mining] = await Promise.all([
    signet.call<RawBlockchainInfo>('getblockchaininfo'),
    signet.call<RawMiningInfo>('getmininginfo'),
  ]);

  return {
    hashrate: formatHashrate(mining.networkhashps),
    difficulty: formatDifficulty(info.difficulty),
    halvingDays: halvingDays(info.blocks),
    nextHalvingBlock: nextHalvingBlock(info.blocks),
    currentBlock: info.blocks,
  };
}

async function getSignetStatus(): Promise<NodeStatus> {
  try {
    const info = await signet.call<RawBlockchainInfo>('getblockchaininfo');
    return {
      online: true,
      chain: info.chain,
      blocks: info.blocks,
      synced: info.verificationprogress > 0.9999,
    };
  } catch {
    return { online: false, chain: 'main', blocks: 0, synced: false };
  }
}

async function getRegtestStatus(): Promise<NodeStatus> {
  try {
    const info = await regtest.call<RawBlockchainInfo>('getblockchaininfo');
    return {
      online: true,
      chain: info.chain,
      blocks: info.blocks,
      synced: true,
    };
  } catch {
    return { online: false, chain: 'regtest', blocks: 0, synced: false };
  }
}

export const networkService = { getStats, getSignetStatus, getRegtestStatus };

