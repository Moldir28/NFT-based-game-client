import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena';
import { CONTRACT_ADDRESS, transformCharacterData } from './ constants';

import MyEpicGame from './utils/MyEpicGame.json';
import { ethers } from "ethers";

import LoadingIndicator from './Components/LoadingIndicator/index'
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {

    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have a Metanask");
        setIsLoading(false);
        return;
      } else {
        console.log("We have ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    }
    catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />
    }


    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://media3.giphy.com/media/3oKHWjEarwxOfxLHQ4/giphy.gif?cid=ecf05e477go8qr9iozum92vgnzf17w0uzcp3d5rim7woturp&rid=giphy.gif&ct=g" alt="Spongebob Gif"
          />
          <button className="cta-button connect-wallet-button" onClick={connectWalletAction}>Connect Wallet to get started</button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      <SelectCharacter setCharacterNFT={setCharacterNFT} />
    }
    else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
    }
  }


  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("get Metamask!")
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts', })
      console.log("Connected", accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        MyEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log("User has NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("No character NFT found");
      }
      setIsLoading(false);
    };

    if (currentAccount) {
      console.log("CurrentAccount: ", currentAccount)
      fetchNFTMetadata();
    }
  }, [currentAccount])


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
