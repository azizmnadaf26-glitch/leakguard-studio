import { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';
import { executeWithX402Payment } from '../utils/x402Payment';

export default function LeakDetectionScanner() {
  const { activeAddress, transactionSigner } = useWallet();
  const [selectedFile, setSelectedFile] = useState(null);
  
  // UI States: idle -> uploading -> payment_required -> signing -> processing -> complete/error
  const [status, setStatus] = useState('idle'); 
  const [errorMsg, setErrorMsg] = useState(null);
  const [paymentReq, setPaymentReq] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  const handleFileChange = (file) => {
    setSelectedFile(file);
    setScanResult(null);
    setStatus('idle');
    setErrorMsg(null);
    setPaymentReq(null);
  };

  const runScan = async () => {
    if (!selectedFile) return;
    setStatus('uploading');
    setErrorMsg(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // 1. Initial Request
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ai/leakDetection`, {
        method: 'POST',
        body: formData
      });

      // 2. Intercept 402 Payment Required
      if (response.status === 402) {
        const header = response.headers.get('payment-required') || response.headers.get('x-payment-required');
        if (header) {
          const reqData = JSON.parse(atob(header));
          const algoReq = reqData.accepts.find(a => a.network.startsWith('algorand:'));
          if (algoReq) {
            // Convert micro-units to decimal for display
            const amount = parseInt(algoReq.amount);
            const decimals = algoReq.extra?.decimals || 6;
            const displayPrice = (amount / Math.pow(10, decimals)).toString();
            
            setPaymentReq({ ...algoReq, displayPrice });
            setStatus('payment_required');
            return;
          }
        }
        throw new Error("Received 402 but no Algorand payment requirements found.");
      }

      if (!response.ok) throw new Error("Server error: " + response.statusText);

      const result = await response.json();
      const dupScore = result.similarity_report?.duplicate_score || 0;
      setScanResult({
        leakedPercent: dupScore,
        cleanPercent: 100 - dupScore,
        threats: result.similarity_report?.is_leak_detected ? [
          { site: 'detected-on-chain-registry.algo', match: dupScore + '%' }
        ] : []
      });
      setStatus('complete');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred');
      setStatus('error');
    }
  };

  const handlePaymentAndRetry = async () => {
    if (!activeAddress || !transactionSigner) {
      setErrorMsg("Please connect your wallet first!");
      return;
    }

    setStatus('signing');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const result = await executeWithX402Payment(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ai/leakDetection`,
        {
          method: 'POST',
          body: formData
        },
        activeAddress,
        transactionSigner
      );

      // Map backend response to UI shape
      const dupScore = result.similarity_report?.duplicate_score || 0;
      setScanResult({
        leakedPercent: dupScore,
        cleanPercent: 100 - dupScore,
        threats: result.similarity_report?.is_leak_detected ? [
          { site: 'detected-on-chain-registry.algo', match: dupScore + '%' }
        ] : []
      });
      
      setStatus('complete');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Payment failed or was canceled.');
      setStatus('error');
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Artwork Leak Detector</h1>
          <p className="text-xs text-slate-400 mt-1">
            Protect your original artwork from unauthorized re-uploads and web leaks instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 min-h-[480px] shadow-2xl">
          
          {/* Left Column: Upload & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6 border-r-0 lg:border-r border-slate-800/80 pr-0 lg:pr-8">
            <div className="space-y-4 flex-1 flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Upload Artwork Asset</span>
              
              <div className="flex-1 min-h-[260px] border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 rounded-2xl p-8 text-center transition-all bg-slate-950/60 flex flex-col items-center justify-center space-y-4 relative group cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-4xl animate-bounce">
                  📁
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">
                    {selectedFile ? selectedFile.name : 'Drop artwork here or click to browse'}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">Supports PNG, JPG, WEBP, ZIP up to 50MB</span>
                </div>
              </div>
            </div>

            {status === 'idle' || status === 'uploading' || status === 'error' || status === 'complete' ? (
              <button
                onClick={runScan}
                disabled={status === 'uploading' || !selectedFile}
                className={`w-full py-4 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  status === 'uploading' || !selectedFile
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-[0.99]'
                }`}
              >
                <span>⚡</span>
                <span>{status === 'uploading' ? 'Uploading...' : 'Run Leak Detection Scan'}</span>
              </button>
            ) : null}

            {status === 'payment_required' && (
              <div className="bg-rose-950/50 border border-rose-500/30 rounded-xl p-6 text-center space-y-4 animate-fade-in">
                <div className="text-rose-400 text-3xl">🔒</div>
                <div>
                  <h3 className="text-sm font-bold text-rose-300">Payment Required</h3>
                  <p className="text-xs text-rose-400/80 mt-1">
                    This AI model requires a micro-payment of <strong className="text-white">{paymentReq.displayPrice} USDC</strong> to process.
                  </p>
                </div>
                <button
                  onClick={handlePaymentAndRetry}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-md cursor-pointer text-xs"
                >
                  Pay & Retry Request
                </button>
              </div>
            )}

            {status === 'signing' && (
              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-6 text-center space-y-4">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-indigo-300">Please approve the transaction in your connected wallet...</p>
              </div>
            )}

            {status === 'processing' && (
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-6 text-center space-y-4">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-emerald-300">Payment signed! Waiting for AI results...</p>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-950/80 border border-red-500/50 text-red-400 text-[11px] p-3 rounded-lg font-mono text-center">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Right Column: AI Results */}
          <div className="lg:col-span-6 flex flex-col justify-between pl-0 lg:pl-8 space-y-6">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center space-x-2">
                <span>🔍 AI Detection Results</span>
              </h2>

              {!scanResult && status !== 'processing' && status !== 'uploading' && (
                <div className="space-y-6 py-6 opacity-40">
                  <div className="text-center space-y-3">
                    <span className="text-xs font-bold text-slate-400 block">—% of this asset appears to be Leaked</span>
                    <div className="relative w-48 h-24 mx-auto flex items-end justify-center">
                      <div className="w-48 h-24 border-t-[10px] border-l-[10px] border-r-[10px] border-slate-800 rounded-t-full"></div>
                      <span className="absolute bottom-2 text-2xl font-black text-slate-600 font-mono">—%</span>
                    </div>
                  </div>
                </div>
              )}

              {(status === 'processing' || status === 'uploading') && (
                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-mono text-indigo-400">Computing visual embeddings...</p>
                </div>
              )}

              {scanResult && scanResult.leakedPercent !== undefined && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center space-y-3">
                    <span className="text-xs font-bold text-slate-200 block">
                      <span className="text-red-400 font-black text-base">{scanResult.leakedPercent}%</span> of this asset appears to be Leaked
                    </span>
                    <div className="relative w-48 h-24 mx-auto flex items-end justify-center">
                      <div className="w-48 h-24 border-t-[10px] border-l-[10px] border-r-[10px] border-red-500 rounded-t-full shadow-lg shadow-red-500/20"></div>
                      <span className="absolute bottom-2 text-2xl font-black text-red-400 font-mono">{scanResult.leakedPercent}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs font-semibold text-slate-300 border-t border-slate-800/60 pt-4">
                    <div className="flex justify-between">
                      <span className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                        <span>Resembles Leaked Patterns</span>
                      </span>
                      <span className="text-red-400 font-bold">{scanResult.leakedPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span>Clean & Original</span>
                      </span>
                      <span className="text-emerald-400 font-bold">{scanResult.cleanPercent}%</span>
                    </div>
                  </div>

                  {scanResult.threats && scanResult.threats.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Unauthorized Web Matches</span>
                      {scanResult.threats.map((threat, index) => (
                        <div key={index} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] flex justify-between items-center font-mono">
                          <span className="text-teal-300 truncate max-w-[200px]">{threat.site}</span>
                          <span className="text-red-400 font-bold">{threat.match}</span>
                        </div>
                      ))}
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