const { ethers } = require("ethers");
const { getContractAt } = require("@nomiclabs/hardhat-ethers/internal/helpers");

function getEnvVariable(key, defaultValue) {
  if (process.env[key]) {
    return process.env[key];
  }
  if (!defaultValue) {
    throw `${key} is not defined and no default value was provided`;
  }
  return defaultValue;
}

function getProvider() {
  if (getEnvVariable("NETWORK") === "localhost") {
    return ethers.getDefaultProvider("http://127.0.0.1:8545");
  }
  return ethers.getDefaultProvider(getEnvVariable("NETWORK", "rinkeby"), {
    alchemy: getEnvVariable("ALCHEMY_KEY"),
  });
}

function getAccount() {
  return new ethers.Wallet(
    getEnvVariable("ACCOUNT_PRIVATE_KEY"),
    getProvider()
  );
}

function getContract(contractName, hre) {
  const account = getAccount();
  return getContractAt(
    hre,
    contractName,
    getEnvVariable("NFT_CONTRACT_ADDRESS"),
    account
  );
}

module.exports = {
  getEnvVariable,
  getProvider,
  getAccount,
  getContract,
};
