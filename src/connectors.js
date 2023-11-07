import { InjectedConnector } from "@web3-react/injected-connector";
// import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import apiConfig from "./service/config";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { createConfig, configureChains, mainnet } from "wagmi";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: `${apiConfig.INFURA_KEY}` }), publicProvider()]
);

const injected = new InjectedConnector({
  supportedChainIds: [
    1, 3, 4, 5, 42, 42220, 137, 56, 43114, 250, 137, 25, 42161, 8217,
    1666600000, 1313161554, 128, 42220, 1088, 10, 100, 1285, 361, 40, 42262,
    1284, 30, 4689, 66, 288, 321, 888, 106, 10000, 19, 324, 122, 336, 820, 108,
    20, 82, 88, 246, 333999, 57, 8, 55, 269, 60, 11297108109, 1818, 2, 5, 24, 7,
    11, 14, 15, 17, 22, 27, 29, 33, 35, 38, 44, 1116, 50, 58, 59, 61, 64, 68,
    74, 76, 77, 78, 80, 256256, 42170, 86, 87, 90, 91, 92, 93, 96, 99, 101, 111,
    123, 124, 126, 127, 142, 163, 186, 188, 199, 200, 211, 222, 258, 262, 333,
    369, 385, 499, 512, 555, 558, 686, 707, 777, 787, 803, 880, 977, 998, 1010,
    1012, 1022, 1024, 1030, 1139, 1197, 1202, 1213, 1214, 1280, 1287, 1288,
    1618, 1620, 1657, 1856, 1987, 2021, 2025, 2100, 2213, 2559, 3690, 5197,
    5315, 5869, 6626, 7341, 8000, 8723, 8995, 9001, 9100, 10101, 11111, 12052,
    13381, 16000, 19845, 21816, 24484, 24734, 31102, 39797, 42069, 43110, 7700,
    740, 47805, 55555, 63000, 70000, 70001, 70002, 70103, 80001, 99999, 100000,
    100001, 100002, 100003, 100004, 100005, 100006, 100007, 100008, 108801,
    110000, 110001, 110002, 110003, 110004, 110005, 110006, 110007, 110008,
    200625, 201018, 210425, 246529, 281121, 8080, 8080, 888888, 955305, 1313114,
    1313500, 1337702, 7762959, 13371337, 18289463, 20181205, 28945486, 35855456,
    61717561, 192837465, 245022926, 245022934, 311752642, 356256156, 486217935,
    1122334455, 1313161556, 1666600001, 1666600002, 1666600003, 2021121117,
    3125659152, 197710212030, 6022140761023, 2569,
  ],
});

// const walletconnect = new WalletConnectConnector({
//   rpcUrl: `https://mainnet.infura.io/v3/${apiConfig.INFURA_KEY}`,
//   bridge: "https://bridge.walletconnect.org",
//   qrcode: true,
// });

const walletlink = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${apiConfig.INFURA_KEY}`,
  appName: "middn",
});

const config = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId: `${apiConfig.WALLETCONNECT_KEY}`,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "middn",
        reloadOnDisconnect:false
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});
export const connectors = {
  injected: injected,
  coinbaseWallet: walletlink,
};
export const walletConnectConfig = config;
