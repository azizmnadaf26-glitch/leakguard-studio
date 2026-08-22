import { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';

export default function SellArtModal({ isLoggedIn, onOpenAuth }) {
  const [myAssets, setMyAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [price, setPrice] = useState('10'); // ALGO
  const [isListing, setIsListing] = useState(false);
  const [listingSuccess, setListingSuccess] = useState(false);

  const { activeAddress, transactionSigner } = useWallet();

  useEffect(() => {
    if (activeAddress) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ownership/my-assets?wallet=${activeAddress}`)
        .then(res => res.json())
        .then(data => setMyAssets(data))
        .catch(err => console.error("Failed to fetch assets", err));
    }
  }, [activeAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    if (!selectedAsset) {
      alert("Please select an asset to list.");
      return;
    }

    setIsListing(true);
    setListingSuccess(false);

    try {
      // 1. Build listing tx
      const buildRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/marketplace/list/build`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_hash: selectedAsset.asset_hash,
          asa_id: selectedAsset.asa_id,
          seller_wallet: activeAddress,
          price_algo: parseFloat(price)
        })
      });
      if (!buildRes.ok) throw new Error(await buildRes.text());
      const buildData = await buildRes.json();
      
      // 2. Sign tx
      const txnBytes = Uint8Array.from(atob(buildData.transaction), c => c.charCodeAt(0));
      const signedTxn = await transactionSigner([txnBytes]);
      
      // 3. Send tx directly to network
      const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
      const sendResult = await algodClient.sendRawTransaction(signedTxn[0]).do();
      const txId = sendResult.txId || sendResult.txid;
      if (!txId) {
          console.error("sendResult:", sendResult);
          throw new Error("Transaction sent but no txId returned!");
      }
      
      // 4. Confirm listing
      const confirmRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/marketplace/list/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_hash: selectedAsset.asset_hash,
          asa_id: selectedAsset.asa_id,
          seller_wallet: activeAddress,
          price_algo: parseFloat(price),
          tx_id: txId
        })
      });
      if (!confirmRes.ok) throw new Error(await confirmRes.text());
      
      setListingSuccess(true);
      setSelectedAsset(null);
      setPrice('10');
    } catch (err) {
      alert("Listing failed: " + err.message);
      console.error(err);
    } finally {
      setIsListing(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Creator Listing Studio</h1>
            <p className="text-xs text-slate-400 mt-1">
              Escrow your digital asset and list it on the marketplace!
            </p>
          </div>
          <span className="self-start sm:self-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            ⚡ 0% Platform Fee Launch
          </span>
        </div>

        {listingSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold text-sm">
            Asset successfully transferred to escrow and listed on the marketplace!
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Registered Asset</label>
            <select
              value={selectedAsset ? selectedAsset.asset_hash : ""}
              onChange={(e) => {
                const asset = myAssets.find(a => a.asset_hash === e.target.value);
                setSelectedAsset(asset || null);
              }}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none cursor-pointer"
              required
            >
              <option value="">-- Choose an Asset --</option>
              {myAssets.map(asset => (
                <option key={asset.asset_hash} value={asset.asset_hash}>
                  {asset.title || 'Untitled'} (ASA ID: {asset.asa_id})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Price (ALGO)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-emerald-400 font-bold text-xs">A</span>
              <input
                type="number"
                step="0.1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-emerald-400 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>
          
          <p className="text-xs text-slate-500">
            Note: By listing this asset, you will sign a transaction to transfer it to the platform's escrow wallet. When it sells, the ALGO will be automatically sent to your wallet.
          </p>

          <button
            type="submit"
            disabled={isListing}
            className={`w-full py-3.5 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all active:scale-[0.99] mt-2 ${isListing ? 'bg-indigo-500/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'}`}
          >
            {isListing ? 'Escrowing & Listing...' : 'List Asset on Marketplace'}
          </button>
        </form>
      </div>
    </div>
  );
}