import { useState } from 'react';

export default function SellArtModal() {
  const [artTitle, setArtTitle] = useState('');
  const [category, setCategory] = useState('Digital Illustration');
  const [price, setPrice] = useState('1200');
  const [licenseType, setLicenseType] = useState('Standard Commercial');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Asset "${artTitle || 'Untitled Art'}" successfully listed on the marketplace for ₹${price}!`);
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Creator Listing Studio</h1>
            <p className="text-xs text-slate-400 mt-1">
              Publish and sell your original artwork—set your price and start earning
            </p>
          </div>
          <span className="self-start sm:self-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            ⚡ 0% Platform Fee Launch
          </span>
        </div>

        {/* Main 2-Column Studio Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 min-h-[480px] shadow-2xl">
          
          {/* Left Column: Asset Details Input (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-5 border-r-0 lg:border-r border-slate-800/80 pr-0 lg:pr-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Listing Details</span>

              {/* Artwork Title */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Artwork Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cyberpunk Neon Cityscape Vector"
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none cursor-pointer"
                  >
                    <option value="Digital Illustration">Digital Illustration</option>
                    <option value="UI/UX Design Kit">UI/UX Design Kit</option>
                    <option value="AI Prompts & Models">AI Prompts & Models</option>
                    <option value="Vector & Brand Assets">Vector & Brand Assets</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Price (INR)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-emerald-400 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* License Type */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">License Type</label>
                <select
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none cursor-pointer"
                >
                  <option value="Standard Commercial">Standard Commercial License</option>
                  <option value="Extended Enterprise">Extended Enterprise License</option>
                  <option value="Personal / Student">Personal / Student Use</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Description & File Details</label>
                <textarea
                  rows={2}
                  placeholder="Describe resolution, included formats (PNG, SVG, PSD)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: File Upload + Live Preview Card (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between pl-0 lg:pl-8 space-y-6">
            <div className="space-y-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Asset File & Preview</span>

              {/* High-Res Asset Upload Box */}
              <div className="border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 rounded-2xl p-6 text-center transition-all bg-slate-950/60 relative group cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl animate-bounce">
                    📦
                  </div>
                  <span className="text-xs font-bold text-slate-200 block">
                    {selectedFile ? selectedFile.name : 'Drop ZIP or High-Res Artwork here'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Protected via LeakGuard SHA-256 Hash</span>
                </div>
              </div>

              {/* Live Listing Card Preview */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Listing Preview</span>
                <div className="w-full h-32 bg-gradient-to-tr from-indigo-900/30 to-purple-900/30 rounded-xl border border-slate-800 flex items-center justify-center text-4xl">
                  🎨
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-white text-xs truncate">{artTitle || 'Untitled Art'}</span>
                  <span className="text-emerald-400 font-mono text-xs">₹{Number(price || 0).toLocaleString()}</span>
                </div>
                <span className="text-[10px] text-slate-500 block font-mono">{category} • {licenseType}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 cursor-pointer transition-all active:scale-[0.99] mt-2"
            >
              List Asset on Marketplace
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}