import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {
  mainnet,
  sepolia,
} from 'wagmi/chains';
import 'dotenv/config';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    mainnet,
    sepolia,
  ],
  transports: {
    [mainnet.id]: http("https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY),
    [sepolia.id]: http("https://sepolia.infura.io/v3/" + process.env.INFURA_API_KEY)
  },
  ssr: true,
});
