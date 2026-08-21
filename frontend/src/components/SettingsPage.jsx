import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const { darkMode, setDarkMode } = useTheme();
  const [publicPortfolio, setPublicPortfolio] = useState(true);
  const [indexAi, setIndexAi] = useState(true);
  const [displayWallet, setDisplayWallet] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [tutorialUpdates, setTutorialUpdates] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 sm:p-10 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Account & Studio Settings</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage your portfolio visibility, notification preferences, and account security.
            </p>
          </div>
          {savedMessage && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full animate-fade-in">
              ✓ Preferences Saved
            </span>
          )}
        </div>

        {/* Settings Sections Stack */}
        <div className="space-y-6">

          {/* Appearance & Theme Preference */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-2xl transition-colors duration-200">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appearance</h2>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">Theme Preference</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Switch between Light Mode and Dark Mode across the entire studio interface.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  darkMode ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform flex items-center justify-center text-[8px] ${
                    darkMode ? 'left-7' : 'left-1'
                  }`}
                >
                  {darkMode ? '🌙' : '☀️'}
                </span>
              </button>
            </div>
          </div>

          {/* Portfolio & Visibility Settings */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-2xl transition-colors duration-200">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Portfolio & Visibility</h2>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">Public Portfolio Access</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Allow visitors and clients to view your uploaded artwork.</span>
                </div>
                <button
                  onClick={() => { setPublicPortfolio(!publicPortfolio); handleSave(); }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${publicPortfolio ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${publicPortfolio ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80 pt-4">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">Index in AI Matcher</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Allow employers to discover your portfolio via AI ranking.</span>
                </div>
                <button
                  onClick={() => { setIndexAi(!indexAi); handleSave(); }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${indexAi ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${indexAi ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80 pt-4">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">Display Wallet Address</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Show connected Web3 wallet address publicly on profile cards.</span>
                </div>
                <button
                  onClick={() => { setDisplayWallet(!displayWallet); handleSave(); }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${displayWallet ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${displayWallet ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-2xl transition-colors duration-200">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notifications</h2>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">Job & Escrow Alerts</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Receive instant email notifications for new job offers and escrow payouts.</span>
                </div>
                <button
                  onClick={() => { setEmailAlerts(!emailAlerts); handleSave(); }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${emailAlerts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${emailAlerts ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80 pt-4">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">Community Updates</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Get notified when new tutorial guides or platform features launch.</span>
                </div>
                <button
                  onClick={() => { setTutorialUpdates(!tutorialUpdates); handleSave(); }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${tutorialUpdates ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${tutorialUpdates ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-slate-900/60 border border-red-200 dark:border-red-900/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm dark:shadow-2xl transition-colors duration-200">
            <div>
              <span className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wider block">Danger Zone</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Permanently remove your studio profile and unindex your portfolio.</span>
            </div>
            <button
              onClick={() => alert('Account deletion requested.')}
              className="px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 dark:text-red-400 hover:text-white font-bold text-xs rounded-xl border border-red-500/20 transition-all cursor-pointer"
            >
              Delete Account
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}