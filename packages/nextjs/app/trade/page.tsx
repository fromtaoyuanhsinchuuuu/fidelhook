"use client";

import { useEffect, useState } from "react";
import { Address } from "@scaffold-ui/components";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { ArrowPathIcon, ClockIcon, FireIcon, BeakerIcon, BoltIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

/**
 * FIDELHOOK: CYBER-UTILITARIAN REDESIGN
 * Theme: Inferno-to-Ice
 * Aesthetic: Sharp, Data-Dense, High-Contrast
 */

const TradePage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [tradeAmount, setTradeAmount] = useState("0.01");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [isLoading, setIsLoading] = useState(false);

  // Read user streak info from contract
  const { data: streakInfo, refetch: refetchStreakInfo } = useScaffoldReadContract({
    contractName: "LoyaltyHook",
    functionName: "getUserStreakInfo",
    args: connectedAddress ? [connectedAddress] : undefined,
  });

  // Read current fee for user
  const { data: currentFee } = useScaffoldReadContract({
    contractName: "LoyaltyHook",
    functionName: "getFeeForUser",
    args: connectedAddress ? [connectedAddress] : undefined,
  });

  // Watch streak update events
  const { data: streakEvents } = useScaffoldEventHistory({
    contractName: "LoyaltyHook",
    eventName: "StreakUpdated",
    fromBlock: 0n,
    watch: true,
    filters: connectedAddress ? { user: connectedAddress } : undefined,
  });

  // Write contract for simulating trade
  const { writeContractAsync: simulateTrade, isPending } = useScaffoldWriteContract({
    contractName: "LoyaltyHook",
  });

  // Format streak info
  const lastTradeTime = streakInfo?.[0] ? Number(streakInfo[0]) : 0;
  const streakCount = streakInfo?.[1] ? Number(streakInfo[1]) : 0;
  const totalVolume = streakInfo?.[2] ? Number(formatEther(streakInfo[2])) : 0;
  const currentFeeBps = currentFee ? Number(currentFee) : 30;
  const nextDeadline = streakInfo?.[4] ? Number(streakInfo[4]) : 0;

  // Calculate time until deadline
  const [timeLeft, setTimeLeft] = useState<{h: string, m: string, s: string} | null>(null);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  useEffect(() => {
    if (nextDeadline > 0) {
      const updateTimer = () => {
        const now = Math.floor(Date.now() / 1000);
        const diff = nextDeadline - now;

        if (diff > 0) {
          const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
          const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
          const seconds = String(diff % 60).padStart(2, '0');
          setTimeLeft({ h: hours, m: minutes, s: seconds });
          setIsExpiringSoon(diff < 3600); // Pulse if less than 1 hour
        } else {
          setTimeLeft(null);
          setIsExpiringSoon(false);
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [nextDeadline]);

  const feePercentage = currentFeeBps / 100;
  const isHot = streakCount >= 3;

  const handleSimulateTrade = async () => {
    if (!connectedAddress) return;
    try {
      setIsLoading(true);
      const amountInWei = parseEther(tradeAmount);
      await simulateTrade({
        functionName: "simulateTrade",
        args: [connectedAddress, amountInWei],
      });
      setTimeout(() => refetchStreakInfo(), 2000);
    } catch (error) {
      console.error("Trade failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500 selection:text-black font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-500 font-mono text-sm tracking-widest uppercase animate-pulse">
              <BoltIcon className="h-4 w-4" />
              Direct Protocol Access
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">
              FIDEL<span className="text-transparent stroke-white" style={{ WebkitTextStroke: '1px white' }}>HOOK</span>
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs font-mono uppercase text-neutral-500 tracking-tighter">Terminal Instance</span>
            <div className="bg-neutral-900 border border-neutral-800 rounded-none px-4 py-2 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <Address address={connectedAddress} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Controls - Left 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className={`relative p-8 border ${isHot ? 'border-orange-500/30' : 'border-neutral-800'} bg-neutral-900/50 backdrop-blur-md overflow-hidden transition-all duration-700`}>
              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_50%,black_50%)] bg-[size:100%_4px]" />

              <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 italic">
                <BeakerIcon className="h-6 w-6 text-neutral-400" />
                Execution Module
              </h2>

              <div className="space-y-8">
                <div className="group">
                  <label className="text-[10px] items-center mb-1 font-mono uppercase text-neutral-500 flex justify-between tracking-widest">
                    <span>Input Asset Parameter</span>
                    <span className="text-neutral-700 italic">Available: Unrestricted</span>
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={tradeAmount}
                      onChange={e => setTradeAmount(e.target.value)}
                      className="bg-black border border-neutral-800 group-hover:border-neutral-600 focus:border-white w-full py-6 px-6 text-4xl font-mono outline-none transition-all placeholder:text-neutral-800"
                    />
                    <select
                      value={selectedToken}
                      onChange={e => setSelectedToken(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 px-6 font-mono text-xl outline-none"
                    >
                      <option>ETH</option>
                      <option>USDC</option>
                      <option>DAI</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-neutral-800 p-4 bg-black/40">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Impact Analysis</span>
                    <div className="flex justify-between items-baseline font-mono">
                      <span className="text-sm">Fee Applied</span>
                      <span className={`text-xl font-bold ${isHot ? 'text-orange-500' : 'text-white'}`}>
                        {feePercentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="border border-neutral-800 p-4 bg-black/40">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Status Code</span>
                    <div className="flex justify-between items-baseline font-mono uppercase">
                      <span className="text-sm">Verified</span>
                      <span className="text-green-500 text-xl font-bold">OKAY</span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={!connectedAddress || isLoading || isPending}
                  onClick={handleSimulateTrade}
                  className={`w-full py-8 text-2xl font-black uppercase italic tracking-tighter transition-all relative group
                    ${isLoading || isPending
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-orange-500'}`}
                >
                  <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                    <ArrowPathIcon className={`h-4 w-4 ${isLoading || isPending ? 'animate-spin' : ''}`} />
                  </div>
                  {isLoading || isPending ? "Processing..." : "Commit Transaction"}
                </button>
              </div>
            </div>

            {/* Events Log */}
            <div className="bg-[#0a0a0a] border border-neutral-900 p-6 overflow-hidden">
               <h3 className="text-xs font-mono uppercase text-neutral-500 mb-6 flex items-center gap-2 tracking-widest leading-none">
                  <span className="w-1 h-4 bg-neutral-800 inline-block" />
                  Protocol Telemetry [Recent Events]
               </h3>
               {streakEvents && streakEvents.length > 0 ? (
                 <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                   {streakEvents.slice(0, 10).map((event, index) => (
                     <div key={index} className="flex justify-between items-center py-3 px-4 bg-neutral-900/30 border-l border-neutral-800 group hover:bg-neutral-900 transition-colors">
                       <div className="flex flex-col">
                         <span className="text-[10px] font-mono text-neutral-600 mb-0.5">
                           {new Date(Number(event.block.timestamp) * 1000).toLocaleTimeString()}
                         </span>
                         <span className="font-mono text-sm uppercase tracking-tighter">
                           Streak Update: <span className="text-white">{Number(event.args.newStreak)}D</span>
                         </span>
                       </div>
                       <div className="text-right">
                         <span className={`text-xs font-mono font-bold px-2 py-0.5 border ${Number(event.args.discountApplied) === 15 ? 'border-orange-500 text-orange-500' : 'border-neutral-700 text-neutral-400'}`}>
                           {(Number(event.args.discountApplied) / 100).toFixed(2)}%
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-neutral-700 font-mono text-sm italic py-12 text-center border border-dashed border-neutral-900">
                    Waiting for telemetry data...
                 </div>
               )}
            </div>
          </div>

          {/* Sidebar - Right 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            {/* Condition Module (Streak) */}
            <div className={`relative p-8 bg-[#0a0a0a] border ${isHot ? 'border-orange-500' : 'border-neutral-800'} transition-all duration-1000`}>
              {isHot && (
                <div className="absolute -top-4 -right-4 bg-orange-500 text-black font-black text-[10px] px-2 py-1 uppercase italic tracking-widest z-20 shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                  Active Inferno
                </div>
              )}

              <div className="flex items-start justify-between mb-12">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.3em]">Consistency Rank</span>
                  <div className={`text-5xl font-black italic tracking-tighter uppercase ${isHot ? 'text-orange-500' : 'text-neutral-700'}`}>
                    Day {streakCount}
                  </div>
                </div>
                <div className={`p-4 rounded-full border ${isHot ? 'border-orange-500/20 bg-orange-500/10 shadow-[0_0_40px_rgba(249,115,22,0.2)]' : 'border-neutral-800 bg-neutral-900 opacity-20'} transition-all duration-700`}>
                  <FireIcon className={`h-12 w-12 ${isHot ? 'text-orange-500 animate-pulse' : 'text-neutral-600'}`} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-neutral-900 bg-black/60 relative">
                  <span className="text-[10px] font-mono text-neutral-600 uppercase mb-2 block tracking-widest">Temporal Window</span>
                  {timeLeft ? (
                    <div className={`flex items-baseline gap-2 font-mono ${isExpiringSoon ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                      <span className="text-4xl font-black">{timeLeft.h}</span>
                      <span className="text-xl opacity-30">H</span>
                      <span className="text-4xl font-black">{timeLeft.m}</span>
                      <span className="text-xl opacity-30">M</span>
                      <span className="text-4xl font-black">{timeLeft.s}</span>
                      <span className="text-xl opacity-30">S</span>
                    </div>
                  ) : (
                    <div className="text-xl font-mono text-neutral-800 uppercase italic">Awaiting First Entry</div>
                  )}
                  {isExpiringSoon && (
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-red-500 uppercase tracking-tighter font-bold">
                       <ExclamationTriangleIcon className="h-3 w-3" />
                       Streak Degradation Imminent
                    </div>
                  )}
                </div>

                <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-tight leading-relaxed">
                  Loyalty system detects consecutive 24H activity. <br/>
                  Target: 3D Streak for 50% Fee Subtraction.
                </p>
              </div>
            </div>

            {/* Loyalty Guide */}
            <div className="p-8 border border-neutral-900 bg-[#050505] space-y-6">
              <h3 className="text-xs font-mono uppercase tracking-[0.4em] text-neutral-600 underline underline-offset-8">Directives</h3>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Activity Check", desc: "Commit a transaction to the protocol within the 24H window." },
                  { step: "02", title: "Rank Elevation", desc: "Successfully chain 3 consecutive days of verified activity." },
                  { step: "03", title: "Benefit Unlock", desc: "Access the Inferno Fee Tier (0.15%) as long as chain holds." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <span className="text-xs font-mono text-neutral-700 mt-1 group-hover:text-orange-500 transition-colors tracking-tighter italic">{item.step}</span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase text-neutral-300 tracking-tight">{item.title}</h4>
                      <p className="text-[10px] text-neutral-600 leading-normal tracking-tight uppercase">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-orange-500 text-black border-2 border-orange-500 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 rotate-12 translate-x-12 -translate-y-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <FireIcon className="h-32 w-32" />
              </div>
              <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none mb-4">Master Consistency</h3>
              <p className="text-xs font-bold leading-relaxed uppercase tracking-tight max-w-[80%]">
                FidelHook architecture bridges protocol efficiency with user dedication. Your chain is your power.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default TradePage;
