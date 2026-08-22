import { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';

export default function OwnershipVerifier() {
  const [assetHash, setAssetHash] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const { activeAddress, signTransactions, sendTransactions } = useWallet();
  const [transferTo, setTransferTo] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [transferMsg, setTransferMsg] = useState(null);

  const isOwner = verifiedData && verifiedData.owner === activeAddress;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVerifiedData(null);
    setErrorMsg(null);

    try {
      let hashToVerify = assetHash;
      
      // If they uploaded a file instead of pasting a hash, ideally we'd hash it here.
      // For this prototype, we'll assume they pasted the hash.
      if (!hashToVerify && selectedFile) {
        setErrorMsg("Please paste the Asset Hash for verification.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ownership/verify/${hashToVerify}`);
      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.detail || "Asset not found or unregistered.");
      } else {
        setVerifiedData({
          status: 'AUTHENTIC',
          owner: data.wallet_address,
          asset_hash: data.asset_hash,
          asa_id: data.asa_id ? data.asa_id.toString() : 'N/A',
          block_timestamp: new Date(data.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          title: data.title || 'Untitled',
          category: data.category || 'N/A'
        });
      }
    } catch (error) {
      setErrorMsg("Network error while verifying.");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferTo || transferTo.length !== 58) {
      setTransferMsg({ type: 'error', text: 'Invalid Algorand destination address.' });
      return;
    }
    
    setTransferring(true);
    setTransferMsg(null);

    try {
      // 1. Build unsigned transaction
      const buildRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ownership/transfer/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: parseInt(verifiedData.asa_id),
          asset_hash: verifiedData.asset_hash,
          from_wallet: activeAddress,
          to_wallet: transferTo
        })
      });
      const buildData = await buildRes.json();
      
      if (!buildRes.ok) throw new Error(buildData.detail || 'Failed to build transaction');

      // 2. Decode and sign with Wallet
      const decodedTxn = algosdk.decodeUnsignedTransaction(
        new Uint8Array(atob(buildData.unsigned_txn_b64).split('').map(c => c.charCodeAt(0)))
      );
      
      const signedTxns = await signTransactions([decodedTxn.toByte()]);

      // 3. Send to network
      const { id } = await sendTransactions(signedTxns);
      
      setTransferMsg({ type: 'success', text: `Transaction Sent! TX ID: ${id}` });

      // 4. Confirm with backend
      const confirmRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ownership/transfer/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_hash: verifiedData.asset_hash,
          from_wallet: activeAddress,
          to_wallet: transferTo,
          tx_id: id
        })
      });
      
      if (!confirmRes.ok) throw new Error('Failed to update registry.');

      // Refresh data
      setVerifiedData(prev => ({ ...prev, owner: transferTo }));
      setTransferTo('');
      setTransferMsg({ type: 'success', text: 'Ownership successfully transferred!' });
    } catch (err) {
      setTransferMsg({ type: 'error', text: err.message || 'Transfer failed.' });
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Clean Title Header */}
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Artwork Ownership Authenticator</h1>
          <p className="text-xs text-slate-400 mt-1">
            Instantly verify original creation records, digital signatures, and ownership proof.
          </p>
        </div>

        {/* Balanced 2-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 min-h-[480px] shadow-2xl">
          
          {/* Left Column: Verification Form (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6 border-r-0 lg:border-r border-slate-800/80 pr-0 lg:pr-8">
            <form onSubmit={handleVerify} className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Verification Input</span>

                {/* Optional File Upload */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Asset File (Optional)</label>
                  <div className="border border-dashed border-slate-700/80 hover:border-emerald-500 rounded-xl p-4 text-center transition-all bg-slate-950/60 relative cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <span className="text-xs text-slate-300 font-semibold block">
                      {selectedFile ? selectedFile.name : 'Click to select asset file (PNG, JPG, ZIP)'}
                    </span>
                  </div>
                </div>

                {/* Asset Hash */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Asset Fingerprint (SHA-256)</label>
                  <input
                    type="text"
                    value={assetHash}
                    onChange={(e) => setAssetHash(e.target.value)}
                    placeholder="e.g. 8f2a4e9b7c1d3a5e6f8b9a0c..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 cursor-pointer transition-all active:scale-[0.99] mt-4"
              >
                {loading ? 'Querying Blockchain Registry...' : 'Verify Asset Ownership'}
              </button>
            </form>
          </div>

          {/* Right Column: Live On-Chain Certificate (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between pl-0 lg:pl-8 space-y-6">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center justify-between">
                <span>🛡️ Ownership Certificate</span>
                {verifiedData && (
                  <span className="text-emerald-400 text-[10px] font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    ✓ Verified
                  </span>
                )}
              </h2>

              {!verifiedData && !loading && !errorMsg && (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-4xl opacity-30">🔐</span>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Enter an Asset Hash on the left to verify on-chain registration history.
                  </p>
                </div>
              )}

              {errorMsg && !loading && (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-4xl opacity-30">❌</span>
                  <p className="text-xs text-red-500 max-w-xs font-bold">
                    {errorMsg}
                  </p>
                </div>
              )}

              {loading && (
                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-mono text-emerald-400">Verifying cryptographic signatures...</p>
                </div>
              )}

              {verifiedData && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-3">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Status</span>
                      <span className="text-emerald-400 font-bold">{verifiedData.status}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Asset Title</span>
                      <span className="text-slate-200 font-bold">{verifiedData.title}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Category</span>
                      <span className="text-slate-200 font-bold">{verifiedData.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500 whitespace-nowrap mr-4">Registered Owner</span>
                      <span className="text-slate-200 font-bold truncate" title={verifiedData.owner}>{verifiedData.owner}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Algorand ASA ID</span>
                      <span className="text-emerald-400 font-bold">{verifiedData.asa_id !== 'null' ? verifiedData.asa_id : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Block Timestamp</span>
                      <span className="text-slate-300">{verifiedData.block_timestamp}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">SHA-256 Signature Hash</span>
                      <p className="text-[11px] text-teal-300 bg-slate-900 p-3 rounded-xl border border-slate-800 break-all leading-relaxed">
                        {verifiedData.asset_hash}
                      </p>
                    </div>
                  </div>

                  {/* Transfer Ownership Section */}
                  {isOwner && verifiedData.asa_id !== 'N/A' && (
                    <div className="mt-6 p-5 bg-slate-900 rounded-2xl border border-indigo-500/30 space-y-4 shadow-inner">
                      <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                        <span className="mr-2">↗️</span> Transfer Ownership
                      </h3>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        As the verified owner, you can transfer this Algorand Standard Asset (ASA) and all associated copyright claims to another wallet address.
                      </p>
                      
                      <form onSubmit={handleTransfer} className="space-y-3 pt-2">
                        <div>
                          <input
                            type="text"
                            value={transferTo}
                            onChange={(e) => setTransferTo(e.target.value)}
                            placeholder="Destination Algorand Address"
                            className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </div>
                        
                        {transferMsg && (
                          <div className={`p-2.5 text-[10px] rounded-xl font-medium border ${transferMsg.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                            {transferMsg.text}
                          </div>
                        )}
                        
                        <button
                          type="submit"
                          disabled={transferring}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all disabled:opacity-50"
                        >
                          {transferring ? 'Signing Transaction...' : 'Sign & Transfer'}
                        </button>
                      </form>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}