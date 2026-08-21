import { useState } from 'react';

export default function ProfilePage({ isLoggedIn, onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'projects', 'store', 'posts', 'wallet', 'escrow', 'verifier'
  const [isEditing, setIsEditing] = useState(false);

  // Community Post Form State
  const [postText, setPostText] = useState('');
  const [postsList, setPostsList] = useState([
    {
      id: 1,
      author: 'Sania Nadaf',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      time: '2 hours ago',
      content: 'Just finalized the brand guidelines and logo vector assets for the PARVA rebranding! 🎨 Check out the store tab for downloads.',
      likes: 42
    },
    {
      id: 2,
      author: 'Sania Nadaf',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      time: 'Yesterday',
      content: 'Achieved 94% accuracy on the multivariate energy time-series prediction model using PyTorch! 🤖',
      likes: 89
    }
  ]);

  // Asset Leak Detection state
  const [leakFile, setLeakFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Profile Information
  const userProfile = {
    name: 'Sania Nadaf',
    handle: '@sanianadaf',
    role: 'AI/ML Student & UI/UX Designer',
    college: 'PES College of Engineering, Mandya',
    location: 'Mandya, Karnataka, India',
    bio: 'Crafting intelligent multivariate AI models, dark-mode glassmorphic UIs, and authentic traditional art.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    followers: '1.4k',
    following: '380',
    projectsCount: 12,
    skills: ['AI/ML', 'PyTorch', 'Python', 'Figma', 'UI/UX Design', 'Branding']
  };

  // Projects Dataset
  const projects = [
    {
      id: 'P-1',
      title: 'LeakGuard Studio AI Web App',
      category: 'Web App & Security',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      likes: 240,
      views: '1.2k',
      tags: ['React', 'Web3', 'Tailwind']
    },
    {
      id: 'P-2',
      title: 'PARVA Cultural Club Brand Identity',
      category: 'Logo & Graphic Design',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      likes: 185,
      views: '950',
      tags: ['Figma', 'Vector', 'Branding']
    },
    {
      id: 'P-3',
      title: 'Multivariate Energy Consumption Predictor',
      category: 'AI / ML Model',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      likes: 310,
      views: '2.4k',
      tags: ['Python', 'PyTorch', 'Time-Series']
    }
  ];

  // Store Items
  const storeItems = [
    {
      id: 'S-1',
      title: 'Procreate Natural Skin & Blend Brushes',
      price: '₹399',
      sales: '142 sales',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'S-2',
      title: 'Custom Botanical Watercolor Canvas',
      price: '₹1,200',
      sales: '18 sales',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Employer Posted Jobs
  const employerJobs = [
    {
      id: 'EJ-1',
      title: 'Brand Identity & Logo Redesign for PARVA',
      budget: '₹15,000',
      applicants: 8,
      status: 'In Progress'
    },
    {
      id: 'EJ-2',
      title: 'AI Model Data Pipeline Specialist',
      budget: '₹45,000 / Mo',
      applicants: 14,
      status: 'Open for Hiring'
    }
  ];

  // Wallet Transaction History
  const transactionHistory = [
    { id: 'T-101', title: 'PARVA Brand Redesign Milestone 1', amount: '+₹15,000', date: 'Aug 14, 2026', type: 'Design Project', status: 'Completed' },
    { id: 'T-102', title: 'Procreate Brush Pack Sales (14 Units)', amount: '+₹5,586', date: 'Aug 10, 2026', type: 'Store Sales', status: 'Completed' },
    { id: 'T-103', title: 'Custom Botanical Watercolor Art', amount: '+₹1,200', date: 'Aug 04, 2026', type: 'Art Commission', status: 'Completed' }
  ];

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postText.trim()) return;
    const newEntry = {
      id: Date.now(),
      author: userProfile.name,
      avatar: userProfile.avatar,
      time: 'Just now',
      content: postText,
      likes: 0
    };
    setPostsList([newEntry, ...postsList]);
    setPostText('');
  };

  const handleScanFile = (e) => {
    e.preventDefault();
    if (!leakFile) return;
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        status: 'Protected',
        hash: '0x8f93...4b12',
        matchedCopies: 0
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 transition-colors pb-12">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 1. FULL-WIDTH YOUTUBE/LINKEDIN STYLE PROFILE HEADER */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          {/* Banner */}
          <div className="h-44 sm:h-60 relative">
            <img src={userProfile.banner} alt="Cover Banner" className="w-full h-full object-cover" />
          </div>

          {/* Profile Details Container */}
          <div className="p-6 sm:p-8 relative pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-5">
              
              {/* Profile Avatar */}
              <div className="flex items-end space-x-4">
                <div className="relative">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-slate-900 object-cover shadow-lg"
                  />
                  <span className="absolute bottom-2 right-2 bg-indigo-600 text-white p-1 rounded-full text-xs shadow" title="Verified Creator">
                    ✓
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 self-start sm:self-auto">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  {isEditing ? 'Save Profile' : 'Edit Profile'}
                </button>
                <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer">
                  + Upload Work
                </button>
              </div>
            </div>

            {/* Profile Bio & Info Block */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <span>{userProfile.name}</span>
                  <span className="text-indigo-500 text-base">✓</span>
                </h1>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-900/40 w-max">
                  {userProfile.handle} • {userProfile.role}
                </span>
              </div>

              {/* Stats Line (YouTube Channel Style) */}
              <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span><strong className="text-slate-900 dark:text-white">{userProfile.projectsCount}</strong> Projects</span>
                <span>•</span>
                <span><strong className="text-slate-900 dark:text-white">{userProfile.followers}</strong> Followers</span>
                <span>•</span>
                <span><strong className="text-slate-900 dark:text-white">{userProfile.following}</strong> Following</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {userProfile.bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center space-x-1">
                  <span>🎓</span> <span>{userProfile.college}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>📍</span> <span>{userProfile.location}</span>
                </span>
              </div>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {userProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. YOUTUBE CHANNEL TAB NAVIGATION BAR */}
        <div className="border-b border-slate-200 dark:border-slate-800 flex items-center space-x-8 text-xs font-bold overflow-x-auto pb-1 px-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`py-2.5 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'home'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2.5 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`py-2.5 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'store'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Store ({storeItems.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-2.5 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'posts'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`py-2.5 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'wallet'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span> Wallet & Earnings</span>
          </button>
          <button
            onClick={() => setActiveTab('escrow')}
            className={`py-2.5 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'escrow'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Hiring & Orders
          </button>
          <button
            onClick={() => setActiveTab('verifier')}
            className={`py-2.5 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'verifier'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          ></button>
        </div>

        {/* 3. DYNAMIC TAB CONTENT VIEW */}
        <div className="pt-2">

          {/* TAB 1: HOME (Spotlight Overview) */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Featured Projects Spotlight
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="h-44 relative overflow-hidden bg-slate-900">
                          <img src={proj.image} alt={proj.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase bg-slate-900/80 text-white backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700">
                            {proj.category}
                          </span>
                        </div>
                        <div className="p-4 space-y-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{proj.title}</h3>
                          <div className="flex flex-wrap gap-1">
                            {proj.tags.map((t) => (
                              <span key={t} className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-400 font-semibold">
                        <span>❤️ {proj.likes} Likes</span>
                        <span>👁️ {proj.views} Views</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div>
                    <img src={proj.image} alt={proj.title} className="w-full h-44 object-cover" />
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{proj.title}</h3>
                      <div className="flex flex-wrap gap-1">
                        {proj.tags.map((t) => (
                          <span key={t} className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-400 font-semibold">
                    <span>❤️ {proj.likes} Likes</span>
                    <span>👁️ {proj.views} Views</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: STORE */}
          {activeTab === 'store' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {storeItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center space-x-4 shadow-sm">
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">{item.price}</p>
                    <span className="text-[10px] text-slate-400">{item.sales}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: POSTS (YOUTUBE COMMUNITY STYLE) */}
          {activeTab === 'posts' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={userProfile.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{userProfile.name}</span>
                </div>
                
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Give a shoutout or share a quick update! Type @ to mention..."
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex space-x-3 text-xs text-slate-400">
                      <button type="button" className="hover:text-indigo-500 cursor-pointer">📷 Image</button>
                      <button type="button" className="hover:text-indigo-500 cursor-pointer">📊 Poll</button>
                    </div>
                    <button type="submit" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer">
                      Post
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-4">
                {postsList.map((post) => (
                  <div key={post.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center space-x-3">
                      <img src={post.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{post.author}</h4>
                        <span className="text-[10px] text-slate-400">{post.time}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{post.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button className="hover:text-red-500 font-semibold cursor-pointer">❤️ {post.likes}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DEDICATED WALLET & EARNINGS VIEW */}
          {activeTab === 'wallet' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/40">
                    Available Creator Balance
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white pt-2">
                    ₹45,000 <span className="text-xs text-slate-400 font-normal">INR</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Earnings from completed design contracts, commissions, and digital product sales.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => alert('Payout request submitted! Transfer will complete in 24 hours.')}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    Request Instant Payout
                  </button>
                  <button className="px-5 py-3 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl cursor-pointer">
                    Manage Bank Account
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recent Payout & Sales History
                </h3>

                <div className="space-y-3">
                  {transactionHistory.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                          ↗
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-slate-100">{tx.title}</h4>
                          <span className="text-[10px] text-slate-400">{tx.type} • {tx.date}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block text-sm">{tx.amount}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{tx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: HIRING & ORDERS */}
          {activeTab === 'escrow' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Job Postings & Applications</h4>
                {employerJobs.map((job) => (
                  <div key={job.id} className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{job.title}</h4>
                      <span className="text-slate-400">{job.applicants} Applicants Received</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">{job.budget}</span>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded font-bold">{job.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}