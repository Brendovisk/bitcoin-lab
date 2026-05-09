import { regtest } from "../lib/rpc.js";
import { walletsService } from "./wallets.service.js";

async function ensureWallet(name: string): Promise<void> {
  const loaded = await regtest.call<string[]>("listwallets");
  if (loaded.includes(name)) return;
  try {
    await regtest.call("loadwallet", [name]);
  } catch {
    await regtest.call("createwallet", [name]);
  }
}

export async function seedRegtest(): Promise<void> {
  await ensureWallet("alice");
  await ensureWallet("bob");

  const [aliceUtxos, bobUtxos] = await Promise.all([
    walletsService.listUnspent("alice"),
    walletsService.listUnspent("bob"),
  ]);

  if (aliceUtxos.length > 0 && bobUtxos.length > 0) return;

  // Mine 103 blocks to alice → 3 mature coinbase UTXOs (50 BTC cada)
  const minerAddr = await walletsService.getNewAddress("alice");
  await regtest.call("generatetoaddress", [103, minerAddr]);

  // Endereços de destino para alice e bob
  const [a1, a2, a3] = await Promise.all([
    walletsService.getNewAddress("alice"),
    walletsService.getNewAddress("alice"),
    walletsService.getNewAddress("alice"),
    walletsService.getNewAddress("bob"),
    walletsService.getNewAddress("bob"),
    walletsService.getNewAddress("bob"),
  ]);

  // sendmany: uma única tx distribui para alice e bob com valores variados.
  // O troco (~88 BTC) volta para alice como UTXO extra — intencional:
  // mostra que UTXOs não precisam ser valores redondos ou iguais.
  await regtest.call(
    "sendmany",
    [
      "",
      {
        [a1]: 13.37, // alice
        [a2]: 7.77, // alice
        [a3]: 0.42, // alice
      },
    ],
    "alice",
  );

  // Confirma a tx
  await regtest.call("generatetoaddress", [1, minerAddr]);
}
