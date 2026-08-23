import { useState } from 'react';
import WalletConnect from './WalletConnect';
import { useWallet } from '@txnlab/use-wallet-react';
import { executeWithX402Payment } from '../utils/x402Payment';

export default function Navbar({ activePage, setActivePage, isLoggedIn, onLogout, onOpenAuth, walletAddress, setWalletAddress, setSearchResults }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [tempLang, setTempLang] = useState('English');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState('artworks');
  const [searchError, setSearchError] = useState(null);

  const { activeAddress, transactionSigner } = useWallet();

  const languages = ['English', 'Español', 'Deutsch', 'Français', 'Português', 'Nederlands'];

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'jobs', label: 'Find & Hire', icon: '💼' },
    { id: 'shop', label: 'Shop', icon: '🛍️' },
    { id: 'tutorials', label: 'Tutorials', icon: '🎨' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (!activeAddress) {
      alert("Please connect your wallet first to use AI Search.");
      return;
    }

    setSearchError(null);
    setSearchResults(null);
    
    // Switch to search view immediately so user sees loading state
    setActivePage('search');

    try {
      const endpoint = searchScope === 'creators' 
        ? '/api/ai/searchCreators' 
        : '/api/ai/searchArtworks';
        
      const result = await executeWithX402Payment(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: searchQuery }),
        },
        activeAddress,
        transactionSigner
      );
      
      // Add type to the result so the gallery knows what to render
      setSearchResults({ ...result, type: searchScope });
    } catch (err) {
      console.error("Search failed:", err);
      // If payment fails or is cancelled, we might just want to kick them back to home
      if (err.message && err.message.includes("cancel")) {
        setActivePage('home');
      } else {
        alert("Payment or search failed: " + err.message);
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between transition-colors shadow-sm">
      {/* Brand & Search */}
      <div className="flex items-center space-x-6">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-xl p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          ☰
        </button>
        <h1 
          onClick={() => setActivePage('home')} 
          className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
        >
          LeakGuard Studio
        </h1>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative flex items-center">
              <select 
                value={searchScope}
                onChange={(e) => setSearchScope(e.target.value)}
                className="absolute left-0 top-0 bottom-0 h-full pl-3 pr-6 py-1.5 text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-none rounded-l-full focus:outline-none appearance-none z-10 cursor-pointer"
              >
                <option value="artworks">Art</option>
                <option value="creators">Creators</option>
              </select>
              <div className="absolute left-[65px] top-1/2 -translate-y-1/2 text-[10px] pointer-events-none z-10 text-slate-500">▼</div>
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchScope === 'creators' ? "Search Creator Skills (e.g., ui design)..." : "Search AI Artworks (e.g., moody cyberpunk city)..."}
                className="w-64 md:w-80 pl-[90px] pr-8 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button type="submit" className="absolute right-3 top-2 text-xs text-slate-400 cursor-pointer">
                🔍
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Dropdown Drawer Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-64 bg-white dark:bg-slate-950 border-r border-b border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-2 z-50">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-3">Menu</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePage === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Right Side Actions */}
      <div className="flex items-center space-x-3">
        {/* Horizontal 3-Dots Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-base font-bold tracking-widest leading-none flex items-center justify-center"
            title="More Utilities"
          >
            ···
          </button>

          {isMoreMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs font-semibold">
              <button
                onClick={() => { setActivePage('ownership'); setIsMoreMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center space-x-2.5"
              >
                <span>🛡️</span> <span>Ownership Verifier</span>
              </button>
              <button
                onClick={() => { setActivePage('leak'); setIsMoreMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center space-x-2.5"
              >
                <span>🔍</span> <span>AI Leak Detector</span>
              </button>
              <button
                onClick={() => { setActivePage('matcher'); setIsMoreMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center space-x-2.5"
              >
                <span>🤖</span> <span>AI Portfolio Matcher</span>
              </button>
              <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
              <button
                onClick={() => { setActivePage('sell'); setIsMoreMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-2.5"
              >
                <span>🎨</span> <span>Sell Your Art</span>
              </button>
            </div>
          )}
        </div>

        {/* Language Globe Button */}
        <button
          onClick={() => {
            setTempLang(selectedLang);
            setIsLangOpen(true);
          }}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm"
          title="Select Language"
        >
          🌐
        </button>

        {/* Web3 Wallet State Module */}
        <WalletConnect walletAddress={walletAddress} setWalletAddress={setWalletAddress} />

        {/* Auth State Management */}
        {isLoggedIn ? (
          <>
            {/* Notification Icon */}
            <button 
              className="p-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 relative cursor-pointer"
              title="Notifications"
            >
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-600 cursor-pointer focus:outline-none"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs font-semibold">
                  <button
                    onClick={() => {
                      setActivePage('profile');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    👤 Profile
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('settings');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    ⚙️ Settings
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Join
            </button>
          </div>
        )}
      </div>

      {/* Language Selection Modal */}
      {isLangOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold">Select preferred language</h3>
              <button
                onClick={() => setIsLangOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              {languages.map((lang) => (
                <label
                  key={lang}
                  onClick={() => setTempLang(lang)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <span>{lang}</span>
                  <input
                    type="radio"
                    name="language"
                    checked={tempLang === lang}
                    onChange={() => setTempLang(lang)}
                    className="accent-emerald-500 cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsLangOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSelectedLang(tempLang);
                  setIsLangOpen(false);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}