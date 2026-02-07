# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

This repository maintains detailed agent guidance in `AGENTS.md` to avoid duplication. Please refer to `AGENTS.md` for full implementation patterns, hooks, and style guides.

## Common Commands

### Development

- `yarn install`: Install all dependencies
- `yarn chain`: Start local Foundry blockchain (Anvil)
- `yarn deploy`: Deploy contracts to local network
- `yarn start`: Start Next.js frontend (http://localhost:3000)
- `yarn compile`: Compile Solidity contracts

### Code Quality

- `yarn lint`: Run linting for both frontend and contracts
- `yarn format`: Format both frontend and contracts
- `yarn next:check-types`: Run TypeScript type check on frontend

### Testing

- `yarn test`: Run all contract tests (Foundry)
- `yarn foundry:test`: Run contract tests
- `forge test --match-path packages/foundry/test/LoyaltyHook.t.sol`: Run specific test file

## Architecture

FidelHook is a Uniswap v4 Hook implementation built with Scaffold-ETH 2 (Foundry flavor).

### Directory Structure

- `packages/foundry/`: Smart contract development
  - `contracts/`: Solidity source files (e.g., `LoyaltyHook.sol`)
  - `script/`: Forge deployment and interaction scripts
  - `test/`: Foundry tests
- `packages/nextjs/`: React frontend (Next.js 15 App Router)
  - `app/trade/`: Core trading and loyalty interface
  - `hooks/scaffold-eth/`: Custom Wagmi hooks (e.g., `useScaffoldReadContract`)
  - `contracts/deployedContracts.ts`: Generated ABIs and addresses

### Tech Stack

- **Contracts**: Solidity 0.8.x, Foundry, Uniswap v4 Hooks
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, DaisyUI
- **Web3**: Wagmi, Viem, RainbowKit, @scaffold-ui/components

### Key Logic & Patterns

- **LoyaltyHook**: Implements `beforeSwap` logic to track user streaks. A "streak" requires a trade every 24 hours. After a 3-day streak, the swap fee is reduced from 0.30% to 0.15%.
- **State Management**: User streaks and timestamps are stored on-chain in the `LoyaltyHook` contract.
- **Frontend Sync**: Uses SE-2's auto-generation to keep frontend ABIs in sync with contract changes via `yarn deploy`.
