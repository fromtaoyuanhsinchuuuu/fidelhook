"use client";

import { useEffect, useState } from "react";
import { Address } from "@scaffold-ui/components";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { ArrowPathIcon, BeakerIcon, BoltIcon, ExclamationTriangleIcon, FireIcon } from "@heroicons/react/24/solid";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

/**
 * FIDELHOOK: CYBER-UTILITARIAN TERMINAL v2.0
 * Theme: Fractal Command Interface
 * Aesthetic: Industrial-Grade Data Terminal with Plasma Effects
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
    args: [connectedAddress],
  });

  // Read current fee for user
  const { data: currentFee } = useScaffoldReadContract({
    contractName: "LoyaltyHook",
    functionName: "getFeeForUser",
    args: [connectedAddress],
  });

  // Watch streak update events
  const { data: streakEvents } = useScaffoldEventHistory({
    contractName: "LoyaltyHook",
    eventName: "StreakUpdated",
    fromBlock: 0n,
    watch: true,
    filters: connectedAddress ? { user: connectedAddress } : undefined,
    blockData: true,
  });

  // Write contract for simulating trade
  const { writeContractAsync: simulateTrade, isPending } = useScaffoldWriteContract({
    contractName: "LoyaltyHook",
  });

  // Format streak info
  const streakCount = streakInfo?.[1] ? Number(streakInfo[1]) : 0;
  const currentFeeBps = currentFee ? Number(currentFee) : 300; // Base 0.30%
  const nextDeadline = streakInfo?.[4] ? Number(streakInfo[4]) : 0;

  // Calculate time until deadline
  const [timeLeft, setTimeLeft] = useState<{ h: string; m: string; s: string } | null>(null);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  useEffect(() => {
    if (nextDeadline > 0) {
      const updateTimer = () => {
        const now = Math.floor(Date.now() / 1000);
        const diff = nextDeadline - now;

        if (diff > 0) {
          const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
          const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
          const seconds = String(diff % 60).padStart(2, "0");
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
    <div className="min-h-screen bg-[#010101] text-white selection:bg-[#ff9900] selection:text-black font-mono relative overflow-hidden">
      {/* Industrial Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.8)_2px,rgba(0,0,0,0.8)_4px)] opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.1)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-[radial-gradient(ellipse_at_center,rgba(255,153,0,0.1)_0%,transparent_70%)] blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[radial-gradient(ellipse_at_center,rgba(163,230,53,0.05)_0%,transparent_70%)] blur-3xl animate-pulse"
            style={{ animationDuration: "3.5s" }}
          ></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative z-10">
        {/* Command Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#A3E635] font-mono text-sm tracking-[0.3em] uppercase">
              <div className="w-3 h-3 bg-[#A3E635] shadow-[0_0_8px_#A3E635] animate-pulse"></div>
              <span className="font-bold whitespace-nowrap">EXECUTIVE COMMAND INTERFACE</span>
              <div className="w-8 h-px bg-[#333] ml-2 hidden sm:block"></div>
              <span className="text-xs text-[#666] hidden sm:inline">PROTOCOL v4.0</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-[-0.05em] uppercase leading-[0.8] flex flex-wrap items-baseline">
              <span className="text-white">FIDEL</span>
              <span className="text-[#ff9900] ml-2">HOOK</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-xs font-mono text-[#666] uppercase tracking-widest border border-[#333] px-3 py-1">
                <span className="inline-block w-2 h-2 bg-[#0f0] rounded-full mr-2 animate-pulse"></span>
                STATUS: OPERATIONAL
              </div>
              <div className="text-xs font-mono text-[#666] uppercase tracking-widest">
                SERIAL: {streakCount > 0 ? `S${streakCount.toString().padStart(3, "0")}` : "S000"}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 w-full md:w-auto">
            <div className="text-xs font-mono text-[#666] uppercase tracking-[0.3em] border-b border-[#333] pb-1">
              CONNECTION PROFILE
            </div>
            <div className="bg-black border border-[#333] rounded-none px-6 py-4 flex items-center gap-4 w-full md:min-w-80 group hover:border-[#A3E635] transition-all duration-300">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-[#0f0] shadow-[0_0_8px_#0f0] animate-pulse"></div>
                <div
                  className="absolute -inset-2 border border-[#0f0]/20 rounded-full animate-ping"
                  style={{ animationDuration: "2s" }}
                ></div>
              </div>
              <div className="flex-1 font-mono text-sm tracking-tight truncate">
                <div className="text-[#888] text-[10px] uppercase mb-1">ACTIVE ADDRESS</div>
                <Address address={connectedAddress} />
              </div>
              <div className="text-[10px] text-[#666] uppercase border border-[#333] px-2 py-1">LIVE</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Controls - Left 7 cols */}
          <div className="lg:col-span-7 space-y-8">
            <div
              className={`relative p-10 border-2 ${isHot ? "border-[#ff9900]/40" : "border-[#333]"} bg-black/80 backdrop-blur-sm overflow-hidden transition-all duration-700 group`}
            >
              {/* Panel Decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[200%] h-px bg-[#333] rotate-45 transform translate-y-8"></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl font-black uppercase mb-10 flex items-center gap-5 tracking-tight">
                  <div className="w-12 h-12 border-2 border-[#333] flex items-center justify-center group-hover:border-[#ff9900] transition-colors duration-500">
                    <BeakerIcon className="h-6 w-6 text-[#888] group-hover:text-[#ff9900] transition-colors duration-500" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#666] uppercase tracking-[0.4em] mb-1 leading-none font-bold">
                      EXECUTION CONTROL
                    </div>
                    <div className="text-white">SWAP COMMAND MODULE</div>
                  </div>
                </h2>

                <div className="space-y-10">
                  <div className="group/input">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[10px] font-mono uppercase text-[#666] tracking-[0.3em] flex items-center gap-2 font-bold">
                        <div className="w-2 h-2 bg-[#ff9900] animate-pulse"></div>
                        PARAMETER: AMOUNT_INPUT
                      </label>
                      <span className="text-[10px] font-mono text-[#444] uppercase tracking-widest italic">
                        MAX: UNRESTRICTED
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={tradeAmount}
                          onChange={e => setTradeAmount(e.target.value)}
                          className="bg-[#0a0a0a] border-2 border-[#333] group-hover/input:border-[#A3E635] focus:border-[#ff9900] w-full py-8 px-8 text-5xl font-mono outline-none transition-all duration-300 placeholder:text-[#222] tracking-tighter font-black"
                          placeholder="0.00"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#444] font-mono text-xs font-bold tracking-widest">
                          WEI
                        </div>
                      </div>
                      <div className="relative">
                        <select
                          value={selectedToken}
                          onChange={e => setSelectedToken(e.target.value)}
                          className="bg-[#0a0a0a] border-2 border-[#333] px-10 py-8 font-mono text-2xl outline-none appearance-none cursor-pointer hover:border-[#A3E635] transition-colors duration-300 font-black tracking-tighter min-w-[140px] text-center"
                        >
                          <option className="bg-black">ETH</option>
                          <option className="bg-black">USDC</option>
                          <option className="bg-black">DAI</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none text-xs">
                          ▼
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-[#222] p-8 bg-[#050505] relative overflow-hidden group/card hover:border-[#ff9900]/50 transition-all duration-500">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <BoltIcon className="h-10 w-10 text-[#ff9900]" />
                      </div>
                      <span className="text-[10px] font-mono text-[#555] uppercase block mb-4 tracking-[0.3em] font-bold">
                        ANALYSIS: CURRENT_FEE
                      </span>
                      <div className="flex justify-between items-end font-mono">
                        <span className="text-[10px] text-[#444] uppercase font-bold">NET_APPLIED</span>
                        <span
                          className={`text-5xl font-black tracking-tighter ${isHot ? "text-[#ff9900] drop-shadow-[0_0_10px_rgba(255,153,0,0.3)]" : "text-white"}`}
                        >
                          {feePercentage.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="border-2 border-[#222] p-8 bg-[#050505] relative overflow-hidden group/card hover:border-[#A3E635]/50 transition-all duration-500">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <div className="w-10 h-10 border-4 border-[#A3E635] rounded-full"></div>
                      </div>
                      <span className="text-[10px] font-mono text-[#555] uppercase block mb-4 tracking-[0.3em] font-bold">
                        SYSTEM: VALIDATION
                      </span>
                      <div className="flex justify-between items-end font-mono uppercase">
                        <span className="text-[10px] text-[#444] uppercase font-bold">INTEGRITY</span>
                        <span className="text-[#A3E635] text-5xl font-black tracking-tighter underline decoration-4 underline-offset-8">
                          NOMINAL
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!connectedAddress || isLoading || isPending}
                    onClick={handleSimulateTrade}
                    className={`w-full py-12 text-3xl font-black uppercase tracking-[-0.05em] transition-all relative group overflow-hidden border-2 duration-500
                      ${
                        isLoading || isPending
                          ? "bg-[#111] text-[#333] border-[#222] cursor-not-allowed"
                          : "bg-white text-black border-white hover:bg-[#ff9900] hover:text-black hover:border-[#ff9900] active:scale-[0.98]"
                      }`}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-6">
                      {isLoading || isPending ? (
                        <>
                          <ArrowPathIcon className="h-10 w-10 animate-spin" />
                          <span className="tracking-tighter">PROCESSING_COMMAND...</span>
                        </>
                      ) : (
                        <>
                          <div className="relative">
                            <BoltIcon className="h-10 w-10 relative z-10" />
                            <div className="absolute inset-0 bg-[#ff9900] blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                          </div>
                          <span className="tracking-tighter">COMMIT_TRADE_TELEMETRY</span>
                        </>
                      )}
                    </div>
                    {/* Scan effect on hover */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Terminal Feed (Events) */}
            <div className="bg-[#050505] border-2 border-[#1a1a1a] p-10 relative group">
              <div className="absolute top-4 right-6 flex gap-1">
                <div className="w-2 h-2 bg-[#333] rounded-full"></div>
                <div className="w-2 h-2 bg-[#333] rounded-full"></div>
                <div className="w-2 h-2 bg-[#333] rounded-full"></div>
              </div>
              <h3 className="text-[11px] font-bold font-mono uppercase text-[#444] mb-8 flex items-center gap-3 tracking-[0.5em]">
                <div className="w-4 h-[2px] bg-[#A3E635]"></div>
                PROTOCOL_LOGS [STREAK_TELEMETRY]
              </h3>
              {streakEvents && streakEvents.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                  {streakEvents.slice(0, 15).map((event, index) => (
                    <div
                      key={index}
                      className="group/event grid grid-cols-[100px_1fr_80px] gap-6 items-center py-5 px-6 bg-[#0a0a0a] border border-[#111] hover:border-[#333] transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="font-mono text-[10px] text-[#444] font-bold tracking-widest">
                        {/* Event index and simplified timestamp */}
                        0x{index.toString(16).padStart(2, "0")} [{event.blockNumber?.toString().slice(-4) || "----"}]
                      </div>
                      <div className="font-mono text-sm tracking-tighter uppercase font-bold text-[#888] group-hover/event:text-white transition-colors">
                        STREAK_STABLE |{" "}
                        <span className={`${Number(event.args.newStreak) >= 3 ? "text-[#ff9900]" : "text-white"}`}>
                          {Number(event.args.newStreak)}D_CONTINUITY
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-[10px] font-mono font-black px-3 py-1 border-2 ${Number(event.args.discountApplied) === 150 ? "border-[#ff9900] text-[#ff9900]" : "border-[#333] text-[#444]"}`}
                        >
                          {((event.args.discountApplied ? Number(event.args.discountApplied) : 300) / 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[#222] font-mono text-sm font-black py-20 text-center border-2 border-dashed border-[#111] uppercase tracking-[0.4em]">
                  WAITING_FOR_UPLINK...
                </div>
              )}
            </div>
          </div>

          {/* Infrastructure Stats - Right 5 cols */}
          <div className="lg:col-span-5 space-y-8">
            {/* Core Status Module */}
            <div
              className={`relative p-10 bg-[#050505] border-2 ${isHot ? "border-[#ff9900]" : "border-[#222]"} transition-all duration-1000 overflow-hidden`}
            >
              {/* Animated Flare if Hot */}
              {isHot && <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9900]/10 blur-3xl animate-pulse"></div>}

              <div className="flex items-start justify-between mb-16">
                <div className="space-y-3">
                  <span className="text-[11px] font-black font-mono text-[#555] uppercase tracking-[0.5em] leading-none block">
                    CONSISTENCY_RANK
                  </span>
                  <div
                    className={`text-7xl font-black tracking-tighter uppercase leading-none ${isHot ? "text-[#ff9900]" : "text-[#444]"}`}
                  >
                    DAY_{streakCount}
                  </div>
                </div>
                <div
                  className={`w-24 h-24 flex items-center justify-center border-2 ${isHot ? "border-[#ff9900] shadow-[0_0_30px_rgba(255,153,0,0.2)] bg-[#ff9900]/5" : "border-[#222] bg-[#111]/50"} transition-all duration-700`}
                >
                  <FireIcon className={`h-16 w-16 ${isHot ? "text-[#ff9900] animate-pulse" : "text-[#222]"}`} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-8 border-2 border-[#111] bg-[#020202] relative group/timer">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#333] group-hover/timer:bg-[#ff9900] transition-colors"></div>
                  <span className="text-[10px] font-black font-mono text-[#444] uppercase mb-4 block tracking-[0.4em]">
                    TEMPORAL_WINDOW_CLOSURE
                  </span>
                  {timeLeft ? (
                    <div
                      className={`flex items-baseline gap-3 font-mono ${isExpiringSoon ? "text-red-600 font-black animate-pulse" : "text-white"}`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-5xl font-black tracking-tighter">{timeLeft.h}</span>
                        <span className="text-[10px] text-[#444] mt-1">HRS</span>
                      </div>
                      <span className="text-4xl opacity-20">:</span>
                      <div className="flex flex-col items-center">
                        <span className="text-5xl font-black tracking-tighter">{timeLeft.m}</span>
                        <span className="text-[10px] text-[#444] mt-1">MIN</span>
                      </div>
                      <span className="text-4xl opacity-20">:</span>
                      <div className="flex flex-col items-center">
                        <span className="text-5xl font-black tracking-tighter">{timeLeft.s}</span>
                        <span className="text-[10px] text-[#444] mt-1">SEC</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-2xl font-black font-mono text-[#222] uppercase tracking-[0.2em] py-2">
                      UPLINK_REQUIRED
                    </div>
                  )}
                  {isExpiringSoon && (
                    <div className="mt-6 flex items-center gap-3 py-3 px-4 bg-red-950/20 border border-red-900/40 text-[11px] font-black font-mono text-red-500 uppercase tracking-widest">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      STREAK_DEGRADATION_IMMINENT
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-mono text-[#555] uppercase tracking-tighter leading-relaxed border-l-2 border-[#111] pl-6 py-2">
                  PROTOCOL ACCEPTS CONSECUTIVE 24H UPLINKS. <br />
                  <span className="text-[#888]">THRESHOLD: 3D STREAK FOR 50% FEE DISCOUNT.</span>
                </div>
              </div>
            </div>

            {/* Operational Directives */}
            <div className="p-10 border-2 border-[#1a1a1a] bg-[#010101] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#fff]/5 rotate-45 transform translate-x-16 -translate-y-16"></div>
              <h3 className="text-[11px] font-black font-mono uppercase tracking-[0.6em] text-[#444] mb-10 border-b border-[#111] pb-4">
                DIRECTIVES
              </h3>
              <div className="space-y-10">
                {[
                  {
                    id: "0X01",
                    title: "ACTIVITY_SYNC",
                    desc: "INITIATE SWAP COMMAND WITHIN 24H WINDOW TO MAINTAIN CONTINUITY.",
                  },
                  {
                    id: "0X02",
                    title: "RANK_ELEVATION",
                    desc: "COMPLETE 3 CONSECUTIVE SYNC CYCLES TO REACH INFERNO TIER.",
                  },
                  {
                    id: "0X03",
                    title: "VALUATION_BONUS",
                    desc: "CONTINUOUS UPLINK GRANTS 0.15% FEE ACCESS IN PERPETUITY.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group cursor-default">
                    <span className="text-[11px] font-mono text-[#333] group-hover:text-[#ff9900] transition-colors font-bold">
                      {item.id}
                    </span>
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase text-[#888] tracking-widest group-hover:text-white transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-[#444] leading-relaxed tracking-tight font-bold uppercase w-full">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Industrial Banner */}
            <div className="p-10 bg-[#ff9900] text-black group overflow-hidden relative border-2 border-[#ff9900] active:scale-[0.99] transition-transform cursor-pointer">
              <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:scale-150 group-hover:-rotate-12 transition-all duration-1000">
                <FireIcon className="h-48 w-48" />
              </div>
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 opacity-60">
                  SYSTEM_MOTIVATOR
                </div>
                <h3 className="text-5xl font-black tracking-tighter uppercase leading-[0.9] mb-6">
                  FORGE_YOUR <br /> CONSISTENCY
                </h3>
                <p className="text-[11px] font-bold leading-relaxed uppercase tracking-tight max-w-[85%] border-t border-black/20 pt-4">
                  THE FIDELHOOK CORE OPTIMIZES FOR DEDICATED ACTORS. YOUR STREAK IS THE ULTIMATE PROTOCOL LEVERAGE.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #010101;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #111;
          border-radius: 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #222;
        }
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default TradePage;
