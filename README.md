# 🏗 FidelHook - Loyalty Rewards for DeFi

<h4 align="center">
  <a href="http://localhost:3001">Live Demo</a> |
  <a href="https://docs.uniswap.org/sdk/v4/overview">Uniswap v4 Docs</a> |
  <a href="https://docs.scaffoldeth.io">Scaffold-ETH 2 Docs</a>
</h4>

🔥 **FidelHook** is a Uniswap v4 Hook that rewards users with discounted trading fees for maintaining consistent trading streaks. Built for the HackMoney 2026 hackathon in just 1 day!

**Live Demo:** [http://localhost:3001](http://localhost:3001) | **Project URL:** `fidelhook.higoburo.xyz`

> [!NOTE]
> 🤖 Scaffold-ETH 2 is AI-ready! It has everything agents need to build on Ethereum. Check `.agents/`, `.claude/`, `.opencode` or `.cursor/` for more info.

⚙️ Built using NextJS, RainbowKit, Foundry, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## 🎯 What is FidelHook?

FidelHook is a loyalty incentive protocol architected on the Uniswap v4 Hook framework. We leverage v4’s custom hook capabilities to transform user trading continuity—or "streaks"—into real-time, on-chain fee discounts.

Throughout the development process, we conducted deep research into the Uniswap v4 beforeSwap and afterSwap lifecycles to implement our dynamic fee calculation engine. For the current demonstration, we utilized a high-fidelity hook simulation environment to accurately showcase the 24-hour streak logic and complex on-chain state transitions. In production, this architecture is designed to deploy directly to the Uniswap v4 PoolManager, integrating with real liquidity pools via Alchemy’s Sepolia nodes to provide a fully decentralized and personalized liquidity incentive layer.

### How It Works

1. **Trade Once Per Day**: Make at least one trade every 24 hours.
2. **Build Your Streak**: Each consecutive day adds to your streak counter.
3. **Earn Discounts**: After 3+ days, trading fees drop from 0.30% to 0.15%.
4. **Stay Loyal**: Miss a day and your streak resets. Keep trading to rebuild it!

## 🚀 Quickstart

1. Install dependencies:
```bash
yarn install
```

2. Run a local network in the first terminal:
```bash
yarn chain
```

3. On a second terminal, deploy the contracts:
```bash
yarn deploy
```

4. On a third terminal, start your NextJS app:
```bash
yarn start
```

Visit your app on: `http://localhost:3000`. Go to the `/trade` page to see the industrial Cyber-Utilitarian terminal interface.

## 🛠️ Technical Implementation

### Tech Stack
- **Smart Contracts**: Developed in **Solidity 0.8.x** using **Foundry** for compilation, deployment, and testing.
- **Frontend**: Built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**, featuring a custom **Cyber-Utilitarian** terminal design.
- **Web3 Integration**: Powered by **Wagmi**, **Viem**, and **RainbowKit**, utilizing Scaffold-ETH 2's custom hooks for seamless on-chain telemetry.
- **Infrastructure**: Supported by **Alchemy** RPC nodes on the **Sepolia** testnet.

### Smart Contract (`LoyaltyHook.sol`)

The core contract implements:
- **User Streak Tracking**: `mapping(address => UserStreak)`
- **Dynamic Fee Calculation**: Logic prepared for Uniswap v4 hook lifecycle integration.
- **24-Hour Windows**: Precise timestamp validation to ensure trading consistency.
- **Event Emission**: `StreakUpdated` and `TradeExecuted` events for real-time frontend synchronization.

### Frontend Features

1. **Streak Visualization**: Animated fire icons showing current streak
2. **Countdown Timer**: Real-time deadline for next trade
3. **Fee Comparison**: Shows base vs. discounted fees
4. **Trade History**: Recent streak updates and events
5. **Wallet Integration**: RainbowKit + Wagmi for seamless connection

## 🔮 Future Enhancements

1. **Real Uniswap v4 Integration**: Connect to actual PoolManager
2. **Multi-Pool Support**: Track streaks across different trading pairs
3. **Advanced Discount Tiers**: More granular fee reductions
4. **Token Rewards**: ERC20 rewards for high-volume traders
5. **NFT Badges**: Soulbound NFTs for milestone achievements

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd my-dapp-example
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Foundry. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/foundry/foundry.toml`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/foundry/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/foundry/script` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn foundry:test`

- Edit your smart contracts in `packages/foundry/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/foundry/script`


## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.