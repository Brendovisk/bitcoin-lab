import { bus } from './event-bus.js';
import { blocksService } from '../services/blocks.service.js';
import { mempoolService } from '../services/mempool.service.js';
import { config } from '../config/index.js';
import { cache } from './cache.js';

let zmqAvailable = false;

async function startZMQ(): Promise<void> {
  const { Subscriber } = await import('zeromq');

  const blockSock = new Subscriber();
  const txSock = new Subscriber();

  blockSock.connect(config.ZMQ_HASHBLOCK_URL);
  blockSock.subscribe('hashblock');

  txSock.connect(config.ZMQ_HASHTX_URL);
  txSock.subscribe('hashtx');

  zmqAvailable = true;
  console.log('[zmq] connected — hashblock %s · hashtx %s', config.ZMQ_HASHBLOCK_URL, config.ZMQ_HASHTX_URL);

  // Tx queue: process one tx per 1.8s to match frontend stream rate
  const txQueue: string[] = [];
  setInterval(async () => {
    const txid = txQueue.shift();
    if (!txid) return;
    try {
      const tx = await mempoolService.getTx(txid);
      if (tx) {
        cache.pushTx(tx);
        bus.emit('tx', tx);
      }
    } catch {
      // tx may have been confirmed or evicted
    }
  }, 1800);

  void (async () => {
    for await (const [, msg] of blockSock) {
      const hash = Buffer.from(msg as Uint8Array).toString('hex');
      try {
        const block = await blocksService.getBlockByHash(hash);
        if (block) {
          cache.pushBlock(block);
          bus.emit('block', block);
        }
      } catch (err) {
        console.error('[zmq] block fetch error:', err);
      }
    }
  })();

  void (async () => {
    for await (const [, msg] of txSock) {
      const txid = Buffer.from(msg as Uint8Array).toString('hex');
      txQueue.push(txid);
      if (txQueue.length > 50) txQueue.shift(); // cap queue
    }
  })();
}

async function startPolling(): Promise<void> {
  console.log('[zmq] unavailable — falling back to polling');

  async function pollBlocks() {
    try {
      const blocks = await blocksService.getLatestBlocks(5);
      if (blocks.length > 0 && blocks[0].height !== cache.mainnetBlock) {
        const newBlock = blocks[0];
        cache.pushBlock(newBlock);
        bus.emit('block', newBlock);
      }
    } catch {
      // mainnet may be offline
    }
  }

  async function pollTxs() {
    try {
      const txs = await mempoolService.getLatestTxs(8);
      txs.forEach((tx) => {
        if (!cache.txs.some((t) => t.id === tx.id)) {
          cache.pushTx(tx);
          bus.emit('tx', tx);
        }
      });
    } catch {
      // mainnet may be offline
    }
  }

  setInterval(pollBlocks, 30_000);
  setInterval(pollTxs, 4_000);
}

export async function initZMQ(): Promise<void> {
  try {
    await startZMQ();
  } catch (err) {
    console.warn('[zmq] init failed:', err);
    await startPolling();
  }
}

export { zmqAvailable };
