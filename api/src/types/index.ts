export type Block = {
  height: number;
  hash: string;
  txs: number;
  size: string;
  time: string;
};

export type MempoolTx = {
  id: string;
  sats: number;
  fee: number;
  vsize: number;
};

export type NetworkStats = {
  hashrate: string;
  difficulty: string;
  halvingDays: number;
  nextHalvingBlock: number;
  currentBlock: number;
};

export type NodeStatus = {
  online: boolean;
  chain: string;
  blocks: number;
  synced: boolean;
};

export type Utxo = {
  txid: string;
  vout: number;
  address: string;
  amount: number;
  sats: number;
  confirmations: number;
};

export type WalletInfo = {
  name: string;
  balance: number;
  txCount: number;
};

export type SendResult = {
  txid: string;
};

export type RPCResponse<T> = {
  result: T;
  error: { code: number; message: string } | null;
  id: number;
};

// Raw Bitcoin Core RPC shapes
export type RawBlock = {
  hash: string;
  height: number;
  nTx: number;
  size: number;
  time: number;
  tx?: string[];
};

export type RawMempoolEntry = {
  vsize: number;
  weight: number;
  time: number;
  fees: {
    base: number;
    modified: number;
  };
};

export type RawMempoolVerbose = Record<string, RawMempoolEntry>;

export type RawTransaction = {
  txid: string;
  vsize: number;
  size: number;
  vout: Array<{
    value: number;
    n: number;
    scriptPubKey: { address?: string };
  }>;
};

export type RawBlockchainInfo = {
  chain: string;
  blocks: number;
  headers: number;
  bestblockhash: string;
  difficulty: number;
  verificationprogress: number;
  pruned: boolean;
};

export type RawMiningInfo = {
  blocks: number;
  difficulty: number;
  networkhashps: number;
};

export type RawNetworkInfo = {
  version: number;
  subversion: string;
  connections: number;
  relayfee: number;
};

export type RawWalletInfo = {
  walletname: string;
  balance: number;
  txcount: number;
};

export type RawUnspent = {
  txid: string;
  vout: number;
  address: string;
  amount: number;
  confirmations: number;
};
