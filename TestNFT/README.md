# Hardhat ERC721Token Test

## Requirements

- Develop and deploy the smart contracts
- Write tests for smart contracts
- Deploy smart contracts on Rinkeby testnet
- List deployed NFT on opensea

## Stacks

- Solidity
- Hardhat/Truffle

## Getting Started

Click the [`Use this here`](https://github.com/paulrberg/hardhat-template/generate) to clone this repo.

### Pre Requisites

Create a new folder on your computer and initialize a new project. After that, add the following dependencies that we will be using in this project.

Alternatively, download this starter project with some preset dependencies. Note: this tutorial assumes you have a recent version of npm (we used 8.0.0 for this tutorial) available on your computer.

```sh
$ mkdir NFT
$ cd NFT
```

Confirm the valid minumum version of npm is used.

```sh
$ npm --version
```

Response 8.0.0 or newer.

```sh
$ npm init
```

### Install

Install the node_modules for smart contracts starter.

```sh
$ npm install --save-dev hardhat
```

```
$ npm install --save-dev @nomiclabs/hardhat-ethers
```

```
$ npm install --save-dev @nomiclabs/hardhat-etherscan
```

```
$ npm install @openzeppelin/contracts
```

```
$ npm install dotenv --save
```

```
$ npm install --save-dev ethers@^5.0.0
```

```
$ npm install --save-dev node-fetch@2
```

### Compile

We are now ready to compile the contract

```sh
$ npx hardhat compile
```

### Deploy

Deploy the contracts to Hardhat Network:

```
$ npx hardhat run scripts/deploy.js --network rinkeby
```

```sh
$ yarn deploy --greeting "Bonjour, le monde!"
```

## License

[MIT](./LICENSE.md) © Donaldo James
