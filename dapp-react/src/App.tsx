import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import contract from './contracts/NFTCollectible.json';
import './App.css';
import { TOKEN } from './types';

const abi = contract.abi;
const contractAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';
const WalletPrivateKey = '0x19454392c4c972b1c65aCd5FEecCB7D70743152e';
const loadingStatus = ['idle', 'pending', 'successed', 'failed'];
const totalTokenNumber = 10;

function App() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const nftContract = new ethers.Contract(contractAddress, abi, signer);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [loading, setLoading] = useState(loadingStatus[0]);
  const [currentTokenId, setCurrentTokenId] = useState(0);
  const [tokens, setTokens] = useState([] as TOKEN[]);

  useEffect(() => {
    const init = async () => {
      checkWalletIsConnected();
      let tokenArray: TOKEN[] = [];

      for (let i = 1; i <= currentTokenId; i++) {
        const token = await getToken(i);
        tokenArray.push(token);
      }
      tokenArray = [...tokenArray];
      setTokens([...tokenArray]);
    };
    init();
  }, [currentTokenId]);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have Metamask installed!');
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }
    setLoading(loadingStatus[1]);
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    setLoading(loadingStatus[2]);

    if (accounts.length != 0) {
      const account = accounts[0];
      console.log('Fonnd an authrized account: ', account);
      setCurrentAccount(account);
    } else {
      setLoading(loadingStatus[3]);
      console.log('No authorized account found.');
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Please install Metamask!');
    }

    try {
      setLoading(loadingStatus[1]);
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setLoading(loadingStatus[2]);
      console.log('Found an account! Address: ', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      setLoading(loadingStatus[3]);
      console.log(err);
    }
  };

  const getToken = async (tokenId: number) => {
    const response = await nftContract.tokenURI(tokenId, {
      gasLimit: 500_000,
    });
    const metadata_url = response;
    const metadata = await fetch(metadata_url).then((res) => res.json());

    return metadata;
  };

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const tokenId = parseInt(await nftContract.getTokenId());

        if (tokenId <= totalTokenNumber) {
          console.log('initialize payment');
          setLoading(loadingStatus[1]);
          let nftTxn = await nftContract.mintTo(WalletPrivateKey, {
            gasLimit: 500_000,
            value: ethers.utils.parseEther('0.01'),
          });

          console.log('Mining... please wait!');
          await nftTxn.wait();
          setLoading(loadingStatus[2]);

          const tokenId = parseInt(await nftContract.getTokenId());
          setCurrentTokenId(tokenId);

          getToken(tokenId);

          console.log(
            `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`,
          );
        } else {
          setLoading(loadingStatus[3]);
          console.log('There is no token anymore!');
        }
      } else {
        setLoading(loadingStatus[3]);
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      setLoading(loadingStatus[3]);
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-yellow-500 hover:bg-yellow-400 transition ease-in-out duration-150 cursor-not-allowed"
      >
        {loading === loadingStatus[1] && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        Connect Wallet
      </button>
    );
  };

  const mintNftButton = () => {
    return (
      <button
        onClick={mintNftHandler}
        className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"
        type="button"
        disabled={loading === loadingStatus[1]}
      >
        {loading === loadingStatus[1] && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        Mint NFT
      </button>
    );
  };

  return (
    <div className="main-app">
      <h1 className="text-3xl font-bold underline pb-5">Welcome to DApp</h1>
      <div>{currentAccount ? mintNftButton() : connectWalletButton()}</div>
      <div className="grid grid-cols-3 gap-4 mt-5">
        {tokens.map((token: TOKEN, index) => {
          return (
            <div
              key={index}
              className="max-w-sm rounded overflow-hidden shadow-lg"
            >
              <img
                className="w-full"
                src={token.image}
                alt="Sunset in the mountains"
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                  {token.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
