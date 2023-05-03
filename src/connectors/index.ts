import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { NetworkConnector } from "./NetworkConnector";

// export const NETWORK_CHAIN_ID = 107
// const NETWORK_URL = 'http://testnet.rpc.novanetwork.io:8545/'
export const NETWORK_CHAIN_ID = 87;
export const TEST_CHAIN_ID = 107;
const FTM_CHAIN_ID = 250;
const NETWORK_URL = "https://dev.rpc.novanetwork.io/";
const TESTNETWORK_URL = "https://testnet-0.rpc.novanetwork.io:8545/";
const FTM_NETWORK_URL = "https://rpc.ftm.tools";

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL },
});

let networkLibrary: Web3Provider | undefined;
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary =
    networkLibrary ?? new Web3Provider(network.provider as any));
}

export const injected = new InjectedConnector({
  supportedChainIds: [NETWORK_CHAIN_ID, TEST_CHAIN_ID, 61, FTM_CHAIN_ID],
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 87: NETWORK_URL, 107: TESTNETWORK_URL, 250: FTM_NETWORK_URL },
  chainId: 87,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});
