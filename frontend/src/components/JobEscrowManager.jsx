import { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';

export default function JobEscrowManager() {
  const { activeAddress } = useWallet();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (activeAddress) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [activeAddress]);

  const fetchHistory = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/escrow/history?wallet=${activeAddress}`);
      if (!res.ok) throw new Error("Failed to fetch escrow history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!activeAddress) {
    return (
      <div className="w-full max-w-4xl mx-auto p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center shadow-sm">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Wallet Not Connected</h2>
        <p className="text-slate-500 text-sm">Please connect your Algorand wallet to view your active and past escrow positions.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-3">
            <span className="text-3xl">💎</span> Escrow Vault
          </h2>
          <p className="text-indigo-200 text-sm mt-2 font-medium">
            Manage your securely held funds for marketplace purchases and bounty postings.
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm text-center min-w-[200px]">
          <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider block mb-1">Positions Found</span>
          <span className="text-3xl font-black">{history.length}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Transaction History</h3>
          <button 
            onClick={fetchHistory} 
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500 text-sm">Loading history...</div>
        ) : errorMsg ? (
          <div className="p-10 text-center text-red-500 text-sm font-bold bg-red-50 dark:bg-red-900/10">{errorMsg}</div>
        ) : history.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="text-5xl opacity-50">📭</div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Escrow Positions Found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              You haven't participated in any Marketplace sales or Bounty challenges yet. When you do, the smart contract transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID & Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Your Role</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Explorer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.id} • {new Date(item.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {item.type === 'Marketplace Sale' ? '🛒 Marketplace' : '🎯 Bounty'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-semibold">
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-indigo-600 dark:text-indigo-400">
                      {item.amount_algo} ALGO
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'Funded' ? (
                        <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          🔒 Funded
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          ✅ Released
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={`https://lora.algonode.network/testnet/transaction/${item.tx_id}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-500 hover:text-indigo-600 font-bold text-xs flex items-center gap-1 group"
                      >
                        View Tx <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}