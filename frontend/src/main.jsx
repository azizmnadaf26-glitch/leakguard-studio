import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WalletManager, NetworkId } from '@txnlab/use-wallet'
import { WalletProvider } from '@txnlab/use-wallet-react'
import { pera } from '@txnlab/use-wallet-pera'
import { defly } from '@txnlab/use-wallet-defly'
import { lute } from '@txnlab/use-wallet-lute'
import './index.css'
import App from './App.jsx'

const walletManager = new WalletManager({
  wallets: [
    pera(),
    defly(),
    lute()
  ],
  defaultNetwork: NetworkId.TESTNET
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WalletProvider manager={walletManager}>
      <App />
    </WalletProvider>
  </StrictMode>,
)
