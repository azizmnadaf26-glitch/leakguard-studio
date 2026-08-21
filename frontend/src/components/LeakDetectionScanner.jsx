import { useState } from 'react';

export default function LeakDetectionScanner() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleFileChange = (file) => {
    setSelectedFile(file);
    setScanResult(null);
  };

  const runScan = () => {
    if (!selectedFile) return;
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        leakedPercent: 94,
        cleanPercent: 6,
        threats: [
          { site: 'unauthorized-art-mirror.example/copy.png', match: '94%' },
          { site: 'public-file-host.example/pack-v2.zip', match: '82%' }
        ]
      });
    }, 1500);
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Artwork Leak Detector</h1>
          <p className="text-xs text-slate-400 mt-1">
            Protect your original artwork from unauthorized re-uploads and web leaks instantlly.
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 min-h-[480px] shadow-2xl">
          
          {/* Left Column: Expanded Drag & Drop Zone + Action Button (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6 border-r-0 lg:border-r border-slate-800/80 pr-0 lg:pr-8">
            <div className="space-y-4 flex-1 flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Upload Artwork Asset</span>
              
              {/* Expanded Dropzone */}
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

            <button
              onClick={runScan}
              disabled={isScanning || !selectedFile}
              className={`w-full py-4 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                isScanning || !selectedFile
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-[0.99]'
              }`}
            >
              <span>⚡</span>
              <span>{isScanning ? 'Computing Visual Embeddings...' : 'Run Leak Detection Scan'}</span>
            </button>
          </div>

          {/* Right Column: AI Detection Gauge Meter (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between pl-0 lg:pl-8 space-y-6">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center space-x-2">
                <span>🔍 AI Detection Results</span>
              </h2>

              {!scanResult && !isScanning && (
                <div className="space-y-6 py-6">
                  <div className="text-center space-y-3">
                    <span className="text-xs font-bold text-slate-400 block">—% of this asset appears to be Leaked</span>
                    
                    <div className="relative w-48 h-24 mx-auto flex items-end justify-center">
                      <div className="w-48 h-24 border-t-[10px] border-l-[10px] border-r-[10px] border-slate-800 rounded-t-full"></div>
                      <span className="absolute bottom-2 text-2xl font-black text-slate-600 font-mono">—%</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs font-semibold text-slate-500 pt-6 border-t border-slate-800/60">
                    <div className="flex justify-between">
                      <span className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500/50"></span>
                        <span>Resembles Leaked Patterns</span>
                      </span>
                      <span>—%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></span>
                        <span>Clean & Original</span>
                      </span>
                      <span>—%</span>
                    </div>
                  </div>
                </div>
              )}

              {isScanning && (
                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-mono text-indigo-400">Comparing feature vectors across web nodes...</p>
                </div>
              )}

              {scanResult && (
                <div className="space-y-6">
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

                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Unauthorized Web Matches</span>
                    {scanResult.threats.map((threat, index) => (
                      <div key={index} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] flex justify-between items-center font-mono">
                        <span className="text-teal-300 truncate max-w-[200px]">{threat.site}</span>
                        <span className="text-red-400 font-bold">{threat.match}</span>
                      </div>
                    ))}
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