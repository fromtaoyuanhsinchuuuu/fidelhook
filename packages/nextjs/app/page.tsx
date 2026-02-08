"use client";

import Link from "next/link";
import { Address } from "@scaffold-ui/components";
import type { NextPage } from "next";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { BoltIcon, FireIcon } from "@heroicons/react/24/outline";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">FidelHook - Loyalty Rewards</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address
              address={connectedAddress}
              chain={targetNetwork}
              blockExplorerAddressLink={
                targetNetwork.id === hardhat.id ? `/blockexplorer/address/${connectedAddress}` : undefined
              }
            />
          </div>

          <p className="text-center text-lg">
            Trade consistently and earn <span className="text-primary font-bold">discounted fees</span>!
          </p>
          <p className="text-center text-lg">
            Maintain your trading streak to unlock <span className="text-accent font-bold">0.15% fees</span> instead of
            0.30%.
          </p>
          <div className="text-center mt-4">
            <Link href="/trade" className="btn btn-primary btn-lg">
              Start Trading →
            </Link>
          </div>
        </div>

        <div className="grow bg-[#050505] w-full mt-16 px-8 py-24 border-t-2 border-[#1a1a1a]">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row max-w-7xl mx-auto">
            <div className="flex flex-col bg-black border-2 border-[#1a1a1a] p-10 text-center items-center max-w-xs rounded-none hover:border-[#ff9900] transition-colors duration-500">
              <BoltIcon className="h-10 w-10 text-[#ff9900] mb-6" />
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Streak Engine</h3>
              <p className="text-sm text-[#888] font-mono">
                Automated on-chain tracking of user interaction frequency.
              </p>
            </div>
            <div className="flex flex-col bg-black border-2 border-[#1a1a1a] p-10 text-center items-center max-w-xs rounded-none hover:border-[#A3E635] transition-colors duration-500">
              <FireIcon className="h-10 w-10 text-[#A3E635] mb-6" />
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Inferno Fees</h3>
              <p className="text-sm text-[#888] font-mono">Dynamic fee scaling based on proven consistent liquidity.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
