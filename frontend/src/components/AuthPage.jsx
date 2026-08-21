import { useState } from 'react';

export default function AuthPage({ isOpen, onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({ name: 'Sania Nadaf', email });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Full-Screen Shooting Stars CSS Animation */}
      <style>{`
       @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 1;
            width: 0px;
          }
          40% {
            width: 220px;
            opacity: 1;
          }
          100% {
            transform: translateX(-1000px) translateY(1000px) rotate(-45deg);
            opacity: 0;
            width: 0px;
          }
        }
        .bg-star {
          position: fixed;
          height: 2px;
          background: linear-gradient(-45deg, #38bdf8, rgba(0, 0, 0, 0));
          filter: drop-shadow(0 0 10px #38bdf8);
          animation: shootingStar 4s linear infinite;
        }
        /* Top Left & Outer Left Screen Spread */
        .bg-star-1 { top: -5%; left: 15%; animation-delay: 0s; }
        .bg-star-2 { top: 15%; left: 5%; animation-delay: 1.8s; }
        .bg-star-3 { top: 40%; left: -2%; animation-delay: 3.1s; }
        .bg-star-4 { top: 70%; left: 8%; animation-delay: 0.7s; }
        .bg-star-11 { top: 12%; left: 25%; animation-delay: 0.9s; }
        .bg-star-12 { top: 45%; left: 15%; animation-delay: 2.8s; }
        .bg-star-13 { top: 80%; left: 30%; animation-delay: 1.4s; }
        .bg-star-14 { top: 5%; right: 25%; animation-delay: 0.3s; }
        .bg-star-15 { top: 25%; right: 45%; animation-delay: 3.3s; }

        /* Top Right & Outer Right Screen Spread */
        .bg-star-5 { top: -8%; right: -5%; animation-delay: 1.2s; }
        .bg-star-6 { top: 10%; right: 12%; animation-delay: 2.5s; }
        .bg-star-7 { top: 35%; right: -2%; animation-delay: 0.4s; }
        .bg-star-8 { top: 60%; right: 8%; animation-delay: 3.5s; }
        .bg-star-9 { top: 85%; right: -5%; animation-delay: 2.0s; }
        .bg-star-10 { top: 2%; left: 45%; animation-delay: 1.0s; }
        .bg-star-16 { top: 55%; right: 20%; animation-delay: 1.7s; }
        .bg-star-17 { top: 75%; right: 40%; animation-delay: 2.9s; }
        .bg-star-18 { top: 95%; left: 10%; animation-delay: 0.6s; }
        .bg-star-19 { top: 65%; left: 50%; animation-delay: 3.6s; }
        .bg-star-20 { top: 18%; left: 65%; animation-delay: 2.1s; }
      `}</style>

      {/* Full Backdrop Shooting Stars Animation */}
      <div className="absolute inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden"> 
        <div className="bg-star bg-star-1"></div>
        <div className="bg-star bg-star-2"></div>
        <div className="bg-star bg-star-3"></div>
        <div className="bg-star bg-star-4"></div>
        <div className="bg-star bg-star-5"></div>
        <div className="bg-star bg-star-6"></div>
        <div className="bg-star bg-star-7"></div>
        <div className="bg-star bg-star-8"></div>
        <div className="bg-star bg-star-9"></div>
        <div className="bg-star bg-star-10"></div>
        <div className="bg-star bg-star-11"></div>
        <div className="bg-star bg-star-12"></div>
        <div className="bg-star bg-star-13"></div>
        <div className="bg-star bg-star-14"></div>
        <div className="bg-star bg-star-15"></div>
        <div className="bg-star bg-star-16"></div>
        <div className="bg-star bg-star-17"></div>
        <div className="bg-star bg-star-18"></div>
        <div className="bg-star bg-star-19"></div>
        <div className="bg-star bg-star-20"></div>
      </div>

      {/* Modal Card */}
      <div className="relative bg-white rounded-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl animate-fadeIn min-h-[560px] z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold z-20 cursor-pointer p-2"
        >
          ✕
        </button>

        {/* Left Side: Dark Blue Poster Section */}
        <div className="md:w-1/2 bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 p-8 text-white flex flex-col justify-start space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

          {/* Header Branding */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-400 text-2xl font-black">✦</span>
              <h1 className="text-xl font-extrabold tracking-wider uppercase text-white">
                LeakGuard Studio
              </h1>
            </div>

            {/* Shifted down slightly with pt-6 */}
            <h2 className="text-2xl font-black uppercase tracking-tight text-white pt-6 leading-snug">
              Join the largest art community in the world
            </h2>
          </div>

          {/* 4 Feature Tag Lines List (Moved up with py-4 and tighter margins) */}
          <div className="relative z-10 grid grid-cols-2 gap-4 py-4 border-t border-white/10">
            <div className="space-y-1">
              <div className="text-base">🎨</div>
              <h4 className="font-bold text-xs text-white">Share your art</h4>
              <p className="text-[10px] text-slate-300 leading-tight">
                Upload your work & get discovered.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-base">👁️</div>
              <h4 className="font-bold text-xs text-white">Browse unlimited art style</h4>
              <p className="text-[10px] text-slate-300 leading-tight">
                Explore diverse styles & concepts.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-base">👥</div>
              <h4 className="font-bold text-xs text-white">Find your people</h4>
              <p className="text-[10px] text-slate-300 leading-tight">
                Connect with artists who share your passion.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-base">💎</div>
              <h4 className="font-bold text-xs text-white">Earn from your art</h4>
              <p className="text-[10px] text-slate-300 leading-tight">
                Turn your creative passion into profit.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Clean White Form */}
        <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-between bg-white text-slate-800">
          <div className="space-y-5">
            <h3 className="text-xl font-extrabold text-slate-900">
              {isSignUp ? 'Join LeakGuard Studio' : 'Sign In to LeakGuard Studio'}
            </h3>

            {/* Social Logins */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => onLoginSuccess({ name: 'Google User', email: 'user@gmail.com' })}
                className="w-full py-2.5 px-4 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-3 transition-colors cursor-pointer"
              >
                <span>🌐</span>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                className="w-full py-2.5 px-4 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-3 transition-colors cursor-pointer"
              >
                <span>🍎</span>
                <span>Continue with Apple</span>
              </button>

              <button
                type="button"
                className="w-full py-2.5 px-4 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-3 transition-colors cursor-pointer"
              >
                <span>📘</span>
                <span>Continue with Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400">or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Add your email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Choose a password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500 bg-slate-50"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
              >
                {isSignUp ? 'Continue with Email' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Bottom Switcher */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-1">
            <p className="text-xs text-slate-500">
              {isSignUp ? 'Already a member?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-emerald-600 font-bold hover:underline cursor-pointer"
              >
                {isSignUp ? 'Log In' : 'Join'}
              </button>
            </p>
            <p className="text-[10px] text-slate-400">
              By joining, you accept the Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}