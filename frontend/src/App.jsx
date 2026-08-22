import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import JobsPage from './components/JobsPage';
import ShopPage from './components/ShopPage';
import TutorialsPage from './components/TutorialsPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import OwnershipVerifier from './components/OwnershipVerifier';
import LeakDetectionScanner from './components/LeakDetectionScanner';
import SellArt from './components/SellArtPage';
import PortfolioMatcher from './components/PortfolioMatcher';
import SearchResultsGallery from './components/SearchResultsGallery';

function MainApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [selectedArtistProfile, setSelectedArtistProfile] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  // Line 18: IF / ELSE navigation guard
  const handlePageChange = (pageId) => {
    if (!isLoggedIn && (pageId === 'tutorials' || pageId === 'profile')) {
      setShowAuthModal(true); // IF not logged in -> Open Auth Modal
    } else {
      setActivePage(pageId);   // ELSE -> Navigate normally
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar
        activePage={activePage}
        setActivePage={handlePageChange}
        isLoggedIn={isLoggedIn}
        onLogout={() => setIsLoggedIn(false)}
        onOpenAuth={() => setShowAuthModal(true)}
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        setSearchResults={setSearchResults}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage 
            setActivePage={handlePageChange} 
            isLoggedIn={isLoggedIn}
            onOpenAuth={() => setShowAuthModal(true)} 
            setSelectedArtistProfile={setSelectedArtistProfile}
            walletAddress={walletAddress}
          />
        )}
        
        {activePage === 'jobs' && (
          <JobsPage 
            isLoggedIn={isLoggedIn} 
            onOpenAuth={() => setShowAuthModal(true)} 
          />
        )}
        
        {activePage === 'shop' && (
          <ShopPage 
            isLoggedIn={isLoggedIn} 
            onOpenAuth={() => setShowAuthModal(true)} 
          />
        )}
        
        {activePage === 'tutorials' && <TutorialsPage />}
        {activePage === 'profile' && <ProfilePage selectedArtistProfile={selectedArtistProfile} />}
        {activePage === 'settings' && <SettingsPage />}

        {activePage === 'ownership' && (
          <div className="py-8 px-4 flex justify-center">
            <OwnershipVerifier />
          </div>
        )}

        {activePage === 'leak' && (
          <div className="py-8 px-4 flex justify-center">
            <LeakDetectionScanner />
          </div>
        )}

        {activePage === 'matcher' && (
          <div className="py-8 px-4 flex justify-center">
            <div className="w-full max-w-7xl">
              <PortfolioMatcher />
            </div>
          </div>
        )}

        {activePage === 'sell' && (
          <div className="py-8 px-4 flex justify-center">
            <SellArt 
              isLoggedIn={isLoggedIn}
              onOpenAuth={() => setShowAuthModal(true)}
            />
          </div>
        )}

        {activePage === 'search' && (
          <SearchResultsGallery 
            searchResults={searchResults} 
            isLoggedIn={isLoggedIn} 
            onOpenAuth={() => setShowAuthModal(true)} 
          />
        )}
      </main>
      
      {/* Login / Sign Up Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm z-10 cursor-pointer"
            >
              ✕
            </button>
            <AuthPage
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              onLoginSuccess={() => {
                setIsLoggedIn(true);
                setShowAuthModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}