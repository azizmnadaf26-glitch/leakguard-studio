import { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';

export default function WalletConnect({ walletAddress, setWalletAddress }) {
  const { wallets, activeAddress, activeWallet } = useWallet();
  const [showModal, setShowModal] = useState(false);

  // Sync use-wallet's activeAddress with the global app state
  useEffect(() => {
    if (activeAddress !== walletAddress) {
      setWalletAddress(activeAddress || null);
    }
  }, [activeAddress, walletAddress, setWalletAddress]);

  const disconnectWallet = () => {
    if (activeWallet) {
      activeWallet.disconnect();
    }
  };

  return (
    <div className="flex items-center space-x-2 font-mono text-xs">
      {!activeAddress ? (
        <div className="relative">
          <button
            onClick={() => setShowModal(!showModal)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
          >
            <span>🦊</span>
            <span>Connect Wallet</span>
          </button>
          
          {showModal && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs font-semibold">
              <div className="px-4 py-2 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                Select a Wallet
              </div>
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => {
                    wallet.connect();
                    setShowModal(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center space-x-3 cursor-pointer"
                >
                  <img src={wallet.metadata.icon} alt={wallet.metadata.name} className="w-5 h-5 rounded-md" />
                  <span>{wallet.metadata.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-2 bg-slate-800/90 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
          <span className="text-slate-200 font-bold">
            {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}
          </span>
          <button
            onClick={disconnectWallet}
            className="text-slate-400 hover:text-rose-400 text-[10px] ml-1 transition-colors cursor-pointer"
            title="Disconnect Wallet"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}