import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import idl from './idl.json';

const { SystemProgram, Keypair } = web3
let baseAccount = Keypair.generate()

const programID = new PublicKey(idl.metadata.address)
const network = clusterApiUrl('devnet')

const opts = {
  preflightCommitment: "processed"
}

// Constants
const TWITTER_HANDLE = 'danieldev0612';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = ["https://blog.hubspot.com/hubfs/Smiling%20Leo%20Perfect%20GIF.gif",
                    "https://i.gifer.com/7rF1.gif",
                    "https://i.gifer.com/NtJd.gif"
                    ]
                    
const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [inputValue, setInputValue] = useState("")
  const [gifList, setGifList] = useState([])

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

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link: ', inputValue)
      setGifList([...gifList, inputValue])
      setInputValue('')
    } else {
      console.log('Empty input. Try again!')
    }
  }

  const onInputChange = event => {
    const {value} = event.target;
    setInputValue(value)
  }

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment)
    const provider = new Provider(connection, window.solana, opts.preflightCommitment);
    return provider;
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
      <form
        onSubmit={event => {
          event.preventDefault()
          sendGif()
        }} >
          <input type="text" placeholder="Enter git link!" value={inputValue} onChange={onInputChange}/>
          <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>
      <div className="gif-grid">
        {gifList.map(gif => (
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

  const getGifList = async () => {
    try {
      const provider = getProvider()
      const program = new Program(idl, programID, provider)
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey)

      console.log('Got the account ', account)
      setGifList(account.gifList)
    } catch (error) {
      console.error(error)
      setGifList(null)
    }
  }

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...')
      getGifList()
    }
  }, [walletAddress])

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
