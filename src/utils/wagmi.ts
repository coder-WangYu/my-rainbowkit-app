import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {
  sepolia,
} from 'wagmi/chains';
import 'dotenv/config';

export const config = getDefaultConfig({
  appName: 'WYStake',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
  chains: [
    sepolia,
  ],
  transports: {
    [sepolia.id]: http("https://sepolia.infura.io/v3/bd53db44b045458e827701c6bc02a161")
  },
  ssr: true,
});
