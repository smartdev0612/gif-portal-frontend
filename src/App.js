import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'danieldev0612';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = ["https://blog.hubspot.com/hubfs/Smiling%20Leo%20Perfect%20GIF.gif",
                    "https://i.gifer.com/7rF1.gif",
                    "https://i.gifer.com/NtJd.gif"
                    ]
                    
const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const checkIfWalletIsConnected = async () => {
    try {
      const {solana} = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!')

          const response = await solana.connect({onlyIfTrusted: true})
          console.log("Connect with public key: ", response.publicKey.toString())
          setWalletAddress(response.publicKey.toString())
        }
      } else {
        alert('Solana object not found! Get a Phantom wallet')
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    const {solana} = window;
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key: ', response.publicKey.toString())
      setWalletAddress(response.publicKey.toString())
    }
  }

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}>
        Connect to Wallet
    </button>
  )

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <div className="gif-grid">
        {TEST_GIFS.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  )

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected()
    }

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, [])

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
