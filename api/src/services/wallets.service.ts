import { regtest } from '../lib/rpc.js';
import type { Utxo, WalletInfo, SendResult, RawWalletInfo, RawUnspent } from '../types/index.js';

async function listWallets(): Promise<string[]> {
  return regtest.call<string[]>('listwallets');
}

async function createWallet(name: string): Promise<WalletInfo> {
  await regtest.call<{ name: string }>('createwallet', [name]);
  return getWalletInfo(name);
}

async function loadWallet(name: string): Promise<WalletInfo> {
  await regtest.call<{ name: string }>('loadwallet', [name]);
  return getWalletInfo(name);
}

async function getWalletInfo(name: string): Promise<WalletInfo> {
  const info = await regtest.call<RawWalletInfo>('getwalletinfo', [], name);
  return {
    name: info.walletname,
    balance: info.balance,
    txCount: info.txcount,
  };
}

async function getNewAddress(wallet: string, label = ''): Promise<string> {
  return regtest.call<string>('getnewaddress', [label, 'bech32'], wallet);
}

async function getBalance(wallet: string): Promise<number> {
  return regtest.call<number>('getbalance', [], wallet);
}

async function listUnspent(wallet: string): Promise<Utxo[]> {
  const raw = await regtest.call<RawUnspent[]>('listunspent', [0], wallet);
  return raw.map((u) => ({
    txid: u.txid,
    vout: u.vout,
    address: u.address,
    amount: u.amount,
    sats: Math.round(u.amount * 1e8),
    confirmations: u.confirmations,
  }));
}

async function sendToAddress(wallet: string, address: string, amount: number): Promise<SendResult> {
  const txid = await regtest.call<string>('sendtoaddress', [address, amount], wallet);
  return { txid };
}

async function generateToAddress(wallet: string, blocks: number): Promise<string[]> {
  const address = await getNewAddress(wallet);
  return regtest.call<string[]>('generatetoaddress', [blocks, address]);
}

export const walletsService = {
  listWallets,
  createWallet,
  loadWallet,
  getWalletInfo,
  getNewAddress,
  getBalance,
  listUnspent,
  sendToAddress,
  generateToAddress,
};
