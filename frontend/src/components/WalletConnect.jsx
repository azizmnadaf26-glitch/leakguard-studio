import { useState } from 'react';

export default function WalletConnect({ walletAddress, setWalletAddress }) {
  const [status, setStatus] = useState(walletAddress ? 'connected' : 'disconnected'); // disconnected | pending | connected

  const connectWallet = async () => {
    setStatus('pending');
    
    // Simulate MetaMask / Web3 Provider connection delay
    setTimeout(() => {
      // Mock wallet address or real window.ethereum request
      const mockAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
      setWalletAddress(mockAddress);
      setStatus('connected');
    }, 1200);
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setStatus('disconnected');
  };

  return (
    <div className="flex items-center space-x-2 font-mono text-xs">
      {status === 'disconnected' && (
        <button
          onClick={connectWallet}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
        >
          <span>🦊</span>
          <span>Connect Wallet</span>
        </button>
      )}

      {status === 'pending' && (
        <button
          disabled
          className="px-3.5 py-1.5 bg-slate-800 text-indigo-400 border border-indigo-500/30 font-semibold rounded-xl animate-pulse flex items-center space-x-2 cursor-not-allowed"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
          <span>Connecting...</span>
        </button>
      )}

      {status === 'connected' && (
        <div className="flex items-center space-x-2 bg-slate-800/90 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
          <span className="text-slate-200 font-bold">
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '0x71C...976F'}
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