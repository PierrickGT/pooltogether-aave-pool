# pooltogether-aave-pool

Project built for the ETH Online hackathon.

PoolTogether Aave Pool is a PoolTogether Pool built using version 3 of the protocol. The aptly named Aave Pool uses Aave protocol to generate and pool the yield prize money.

## Pool Contracts

Contracts for the Pool are available in the following branch and repo: https://github.com/PierrickGT/pooltogether-pool-contracts/tree/features/aave_pool

And deployed on Ropsten at the following address:

| Contract | Address |
| -------  | ------- |
| AavePool | [0xBCCAd3c8BC0E081318F444C15C0263B212b8C7a3](https://ropsten.etherscan.io/address/0xbccad3c8bc0e081318f444c15c0263b212b8c7a3) |

## Pool Builder UI

I've also updated the PoolTogether Pool Builder UI so you can easily deploy your own Aave Pool.

Code for the Builder UI is available in the following branch and repo: https://github.com/PierrickGT/pooltogether-pool-builder-ui/tree/features/aave_pool

## ⏱ Quickstart:

First, you'll need [NodeJS>=12](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads) installed.

💾 Clone/fork repo, install and then start:

```
git clone https://github.com/PierrickGT/pooltogether-aave-pool.git

cd pooltogether-aave-pool

yarn install
```

Copy `.env.example` and replace API keys by yours:

```
cd packages/react-app
cp .example.env .env
```

Start localhost:3000

```
yarn start
```

## Live
https://pooltogether-aave-pool.vercel.app/
