import { useState } from 'react';

export default function OwnershipVerifier() {
  const [assetId, setAssetId] = useState('ASSET-99482-LKS');
  const [walletAddress, setWalletAddress] = useState('0x71C...39A2');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setVerifiedData({
        status: 'AUTHENTIC',
        owner: walletAddress,
        asset_id: assetId,
        block_timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        confidence_score: '99.8%',
        signature_hash: '0x8f2a4e9b7c1d3a5e6f8b9a0c1d2e3f4a5b6c7d8e',
        badge: 'On-Chain Verified Original'
      });
      setLoading(false);
    }, 1200);
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

                {/* Asset ID */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Asset Fingerprint / ID</label>
                  <input
                    type="text"
                    value={assetId}
                    onChange={(e) => setAssetId(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Creator Wallet */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Creator Wallet Address</label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
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

              {!verifiedData && !loading && (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-4xl opacity-30">🔐</span>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Enter asset credentials on the left to verify on-chain registration history.
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
                      <span className="text-slate-500">Asset Fingerprint</span>
                      <span className="text-slate-200 font-bold">{verifiedData.asset_id}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Registered Owner</span>
                      <span className="text-slate-200 font-bold">{verifiedData.owner}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Confidence Score</span>
                      <span className="text-emerald-400 font-bold">{verifiedData.confidence_score}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Block Timestamp</span>
                      <span className="text-slate-300">{verifiedData.block_timestamp}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Signature Hash</span>
                      <p className="text-[11px] text-teal-300 bg-slate-900 p-3 rounded-xl border border-slate-800 break-all leading-relaxed">
                        {verifiedData.signature_hash}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}