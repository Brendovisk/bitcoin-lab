import type { Block, MempoolTx } from '../types/index.js';

const MAX_BLOCKS = 5;
const MAX_TXS = 8;

class Cache {
  private _blocks: Block[] = [];
  private _txs: MempoolTx[] = [];
  private _mainnetBlock = 0;
  private _mainnetOnline = false;
  private _regtestOnline = false;

  get blocks(): Block[] {
    return this._blocks;
  }

  get txs(): MempoolTx[] {
    return this._txs;
  }

  get mainnetBlock(): number {
    return this._mainnetBlock;
  }

  get mainnetOnline(): boolean {
    return this._mainnetOnline;
  }

  get regtestOnline(): boolean {
    return this._regtestOnline;
  }

  pushBlock(block: Block): void {
    this._blocks = [block, ...this._blocks.slice(0, MAX_BLOCKS - 1)];
    this._mainnetBlock = block.height;
  }

  setBlocks(blocks: Block[]): void {
    this._blocks = blocks.slice(0, MAX_BLOCKS);
    if (blocks.length > 0) {
      this._mainnetBlock = blocks[0].height;
    }
  }

  pushTx(tx: MempoolTx): void {
    const exists = this._txs.some((t) => t.id === tx.id);
    if (!exists) {
      this._txs = [tx, ...this._txs.slice(0, MAX_TXS - 1)];
    }
  }

  setTxs(txs: MempoolTx[]): void {
    this._txs = txs.slice(0, MAX_TXS);
  }

  setMainnetOnline(v: boolean): void {
    this._mainnetOnline = v;
  }

  setRegtestOnline(v: boolean): void {
    this._regtestOnline = v;
  }
}

export const cache = new Cache();
