import { bus } from "./event-bus.js";
import { blocksService } from "../services/blocks.service.js";
import { mempoolService } from "../services/mempool.service.js";
import { config } from "../config/index.js";
import { cache } from "./cache.js";
import { regtest } from "./rpc.js";

let zmqAvailable = false;

// Poll regtest mempool and emit tx events for new entries
const seenTxids = new Set<string>();
const txQueue: string[] = [];

function startRegtestMempoolPolling(): void {
  setInterval(async () => {
    const txid = txQueue.shift();
    if (!txid) return;
    try {
      const tx = await mempoolService.getTx(txid);
      if (tx) {
        cache.pushTx(tx);
        bus.emit("tx", tx);
      }
    } catch {
      // tx may have been confirmed or evicted
    }
  }, 1800);

  setInterval(async () => {
    try {
      const txids = await regtest.call<string[]>("getrawmempool", [false]);
      const current = new Set(txids);

      for (const txid of current) {
        if (!seenTxids.has(txid)) {
          seenTxids.add(txid);
          txQueue.push(txid);
          if (txQueue.length > 50) txQueue.shift();
        }
      }

      for (const txid of seenTxids) {
        if (!current.has(txid)) seenTxids.delete(txid);
      }
    } catch {
      // regtest may be offline
    }
  }, 3_000);
}

async function startZMQ(): Promise<void> {
  const { Subscriber } = await import("zeromq");

  const blockSock = new Subscriber();
  blockSock.connect(config.ZMQ_HASHBLOCK_URL);
  blockSock.subscribe("hashblock");

  zmqAvailable = true;
  console.log("[zmq] connected — hashblock %s", config.ZMQ_HASHBLOCK_URL);

  startRegtestMempoolPolling();

  void (async () => {
    for await (const [, msg] of blockSock) {
      const hash = Buffer.from(msg as Uint8Array).toString("hex");
      try {
        const block = await blocksService.getBlockByHash(hash);
        if (block) {
          cache.pushBlock(block);
          bus.emit("block", block);
        }
      } catch (err) {
        console.error("[zmq] block fetch error:", err);
      }
    }
  })();
}

async function startPolling(): Promise<void> {
  console.log("[zmq] unavailable — falling back to polling");

  async function pollBlocks() {
    try {
      const blocks = await blocksService.getLatestBlocks(6);
      if (blocks.length > 0 && blocks[0].height !== cache.signetBlock) {
        const newBlock = blocks[0];
        cache.pushBlock(newBlock);
        bus.emit("block", newBlock);
      }
    } catch {
      // signet may be offline
    }
  }

  setInterval(pollBlocks, 30_000);
  startRegtestMempoolPolling();
}

export async function initZMQ(): Promise<void> {
  try {
    await startZMQ();
  } catch (err) {
    console.warn("[zmq] init failed:", err);
    await startPolling();
  }
}

export { zmqAvailable };
