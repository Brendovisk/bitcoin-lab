import { EventEmitter } from 'node:events';
import type { Block, MempoolTx } from '../types/index.js';

type Events = {
  block: [block: Block];
  tx: [tx: MempoolTx];
  'signet:status': [online: boolean];
  'regtest:status': [online: boolean];
};

class TypedEmitter extends EventEmitter {
  emit<K extends keyof Events>(event: K, ...args: Events[K]): boolean {
    return super.emit(event, ...args);
  }
  on<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this {
    return super.on(event, listener as (...args: unknown[]) => void);
  }
  off<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this {
    return super.off(event, listener as (...args: unknown[]) => void);
  }
}

export const bus = new TypedEmitter();
bus.setMaxListeners(100);
