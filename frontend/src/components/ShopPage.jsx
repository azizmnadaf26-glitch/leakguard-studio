import { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';

export default function ShopPage({ isLoggedIn, onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { activeAddress, transactionSigner } = useWallet();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/marketplace/listings`)
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => console.error("Failed to fetch listings", err));
  }, []);

  const handleBuy = async (product) => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    
    if (activeAddress === product.seller_wallet) {
      alert("You cannot buy your own listing!");
      return;
    }

    setIsProcessing(true);
    try {
      const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");

      // 1. Opt-in Buyer to the ASA first!
      const accountInfo = await algodClient.accountInformation(activeAddress).do();
      const optedIn = accountInfo.assets?.some(a => a['asset-id'] === product.asa_id);
      
      if (!optedIn) {
        alert("First, you must sign a transaction to Opt-In to the ASA.");
        const params = await algodClient.getTransactionParams().do();
        const optinTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: activeAddress,
          to: activeAddress,
          assetIndex: product.asa_id,
          amount: 0,
          suggestedParams: params
        });
        const signedOptin = await transactionSigner([optinTxn.toByte()]);
        const { txId: optinId } = await algodClient.sendRawTransaction(signedOptin[0]).do();
        await algosdk.waitForConfirmation(algodClient, optinId, 4);
      }

      // 2. Build Buy ALGO tx
      alert("Now, sign the transaction to pay ALGO into the escrow.");
      const buildRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/marketplace/buy/build`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asa_id: product.asa_id,
          buyer_wallet: activeAddress
        })
      });
      if (!buildRes.ok) throw new Error(await buildRes.text());
      const buildData = await buildRes.json();
      
      // 3. Sign and Send ALGO Tx
      const txnBytes = Uint8Array.from(atob(buildData.transaction), c => c.charCodeAt(0));
      const signedTxn = await transactionSigner([txnBytes]);
      const { txId } = await algodClient.sendRawTransaction(signedTxn[0]).do();
      
      // 4. Confirm Buy
      const confirmRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/marketplace/buy/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asa_id: product.asa_id,
          buyer_wallet: activeAddress,
          tx_id: txId
        })
      });
      if (!confirmRes.ok) throw new Error(await confirmRes.text());
      
      alert(`Successfully purchased ${product.title}!`);
      // Remove from listings
      setListings(prev => prev.filter(l => l.asa_id !== product.asa_id));
      
    } catch (err) {
      alert("Purchase failed: " + err.message);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = listings.filter((product) => {
    return product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           product.category?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header & Sub-Tab Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Web3 Digital Art Marketplace
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Buy and sell registered ASAs securely through Algorand escrow smart contracts.
            </p>
          </div>
        </div>

        {/* Filter Pills & Search Input */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute left-2.5 top-2 text-xs text-slate-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-bold text-sm">
            No active listings found in the marketplace right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.asa_id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase bg-slate-900/80 text-white backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700">
                      {product.category || 'Digital Art'}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Seller: {product.seller_wallet.substring(0, 6)}...{product.seller_wallet.substring(product.seller_wallet.length-4)}</span>
                      <span className="text-amber-500 font-bold">ASA: {product.asa_id}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {product.title}
                    </h3>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <img src="https://cryptologos.cc/logos/algorand-algo-logo.png" className="w-4 h-4 grayscale" alt="ALGO" />
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {product.price_algo}
                    </span>
                  </div>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleBuy(product)}
                    className={`px-4 py-1.5 font-bold text-xs rounded-xl transition-all shadow-sm ${isProcessing ? 'bg-indigo-500/50 text-white cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'}`}
                  >
                    Buy (Escrow)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}