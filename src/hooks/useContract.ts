import { createPublicClient, getContract, http } from "viem";
import { stakeAbi } from "../assets/abis/stake.ts";
import { useAccount, useWalletClient } from "wagmi";
import 'dotenv/config';
import { sepolia } from "viem/chains";
import { wytokenAbi } from "../assets/abis/wytoken.ts";

export const useStakeContract = () => {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    if (!address || !walletClient) return null;

    return getContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: stakeAbi,
        client: walletClient,
    });
}

export const client = createPublicClient({
  chain: sepolia,
  transport: http("https://sepolia.infura.io/v3/bd53db44b045458e827701c6bc02a161"),
})

export const useRewardContract = () => {
  return getContract({
      address: process.env.NEXT_PUBLIC_WYTOKEN_ADDRESS as `0x${string}`,
      abi: wytokenAbi,
      client: client,
  });
}
