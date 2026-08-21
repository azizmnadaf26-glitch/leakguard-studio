import { useState } from 'react';

export default function TutorialsPage({ isLoggedIn, onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('long'); // 'long', 'shorts', 'saved'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeVideo, setActiveVideo] = useState(null); // Active video modal player
  const [searchQuery, setSearchQuery] = useState('');

  // Subscribed Channels State
  const [subscribedChannels, setSubscribedChannels] = useState([]);

  // Comment input state
  const [newComment, setNewComment] = useState('');

  // Long-Form YouTube Style Tutorials Dataset
  const [longVideos, setLongVideos] = useState([
    {
      id: 'V-101',
      title: 'Mastering Natural Skin & Portrait Painting in Procreate',
      channel: 'Sania Studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      category: 'Digital Painting',
      duration: '18:45',
      views: '14.2k',
      timeAgo: '2 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      likes: 1240,
      isLiked: false,
      isSaved: false,
      description: 'Learn light blending, brush opacity techniques, and subtle highlight placement for clean, natural skin finishes.',
      comments: [
        { user: 'Ananya R.', text: 'The brush opacity trick at 05:20 saved my portrait rendering!', time: '1 day ago' },
        { user: 'Maya Crafts', text: 'Super clear breakdown of color theory.', time: '5 hours ago' }
      ]
    },
    {
      id: 'V-102',
      title: 'Crafting Brand Logos from Sketch to Vector (PARVA Identity)',
      channel: 'Avighnans Design Hub',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      category: 'Logo & Branding',
      duration: '24:10',
      views: '8.9k',
      timeAgo: '1 week ago',
      thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      likes: 890,
      isLiked: false,
      isSaved: false,
      description: 'A complete step-by-step masterclass on golden ratio grids, typography selection, and exporting clean SVG vector assets.',
      comments: [
        { user: 'Rahul V.', text: 'Awesome tutorial! Will apply this to our college fest branding.', time: '3 days ago' }
      ]
    },
    {
      id: 'V-103',
      title: 'Multivariate AI Time-Series Forecasting with PyTorch',
      channel: 'AI/ML Core',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      category: 'AI / Data Science',
      duration: '32:15',
      views: '22.1k',
      timeAgo: '3 weeks ago',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      likes: 2450,
      isLiked: false,
      isSaved: false,
      description: 'Build predictive machine learning pipelines for energy consumption data using PyTorch and pandas.',
      comments: [
        { user: 'Sania N.', text: 'Great explanation on multivariate model column scaling.', time: '2 weeks ago' }
      ]
    }
  ]);

  // Short-Form Reels / TikTok Style Dataset
  const [shortReels, setShortReels] = useState([
    {
      id: 'R-201',
      title: '3-Second Procreate Blending Hack 🖌️',
      creator: 'Sania Studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      views: '45.8k',
      thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      likes: 3820,
      isLiked: false,
      commentsCount: 142
    },
    {
      id: 'R-202',
      title: 'How to Finish Wooden Embroidery Hoops Fast 🪡',
      creator: 'Ananya Studio',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      views: '29.3k',
      thumbnail: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80',
      likes: 2190,
      isLiked: false,
      commentsCount: 88
    },
    {
      id: 'R-203',
      title: 'Crochet Flower Keychain Loop Trick 🧶',
      creator: 'Crafts by Maya',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      views: '62.1k',
      thumbnail: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80',
      likes: 5410,
      isLiked: false,
      commentsCount: 310
    }
  ]);

  const categories = ['All', 'Digital Painting', 'Logo & Branding', 'AI / Data Science', 'Handmade Crafts'];

  const toggleSubscribe = (channelName) => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    if (subscribedChannels.includes(channelName)) {
      setSubscribedChannels(subscribedChannels.filter((c) => c !== channelName));
    } else {
      setSubscribedChannels([...subscribedChannels, channelName]);
    }
  };

  const toggleLikeLong = (id) => {
    setLongVideos(
      longVideos.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            isLiked: !v.isLiked,
            likes: v.isLiked ? v.likes - 1 : v.likes + 1
          };
        }
        return v;
      })
    );
  };

  const toggleSaveLong = (id) => {
    setLongVideos(
      longVideos.map((v) => {
        if (v.id === id) {
          return { ...v, isSaved: !v.isSaved };
        }
        return v;
      })
    );
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !activeVideo) return;
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    const commentObj = {
      user: 'You',
      text: newComment,
      time: 'Just now'
    };

    setLongVideos(
      longVideos.map((v) => {
        if (v.id === activeVideo.id) {
          const updated = { ...v, comments: [commentObj, ...v.comments] };
          setActiveVideo(updated);
          return updated;
        }
        return v;
      })
    );
    setNewComment('');
  };

  const filteredLong = longVideos.filter((v) => {
    const matchesCat = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.channel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const savedVideos = longVideos.filter((v) => v.isSaved);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header & Sub-Tab Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Creator Learning & Video Hub
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Watch long-form masterclasses, quick short tips, and subscribe to top student creators.
            </p>
          </div>

          {/* Sub-Tab Navigation Switcher */}
          <div className="flex p-1 bg-slate-200 dark:bg-slate-900 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-800 self-start md:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('long')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'long'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📺 Masterclasses (Long-Form)
            </button>
            <button
              onClick={() => setActiveTab('shorts')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'shorts'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📱 Reels & Shorts
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'saved'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🔖 Saved ({savedVideos.length})
            </button>
          </div>
        </div>

        {/* Category Pills & Search Input */}
        {activeTab === 'long' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto text-xs">
              <span className="text-slate-400 text-[11px] font-bold uppercase">Topics:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search tutorials, channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute left-2.5 top-2 text-xs text-slate-400">🔍</span>
            </div>
          </div>
        )}

        {/* VIEW 1: YOUTUBE STYLE LONG-FORM TUTORIALS */}
        {activeTab === 'long' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLong.map((video) => (
              <div
                key={video.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div
                    onClick={() => setActiveVideo(video)}
                    className="relative h-48 overflow-hidden bg-slate-900 cursor-pointer group"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-90"
                    />
                    <span className="absolute bottom-2.5 right-2.5 text-[11px] font-extrabold bg-black/80 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                      {video.duration}
                    </span>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl shadow-lg pl-0.5">
                        ▶
                      </span>
                    </div>
                  </div>

                  {/* Details Header */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={video.avatar}
                          alt={video.channel}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                            {video.channel}
                          </h4>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {video.views} views • {video.timeAgo}
                          </span>
                        </div>
                      </div>

                      {/* Subscribe Button */}
                      <button
                        onClick={() => toggleSubscribe(video.channel)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          subscribedChannels.includes(video.channel)
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            : 'bg-red-600 hover:bg-red-500 text-white'
                        }`}
                      >
                        {subscribedChannels.includes(video.channel) ? 'Subscribed' : 'Subscribe'}
                      </button>
                    </div>

                    <h3
                      onClick={() => setActiveVideo(video)}
                      className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {video.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>

                {/* Engagement Bar Footer */}
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleLikeLong(video.id)}
                      className={`flex items-center space-x-1 font-semibold cursor-pointer ${
                        video.isLiked ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <span>{video.isLiked ? '❤️' : '🤍'}</span>
                      <span>{video.likes}</span>
                    </button>

                    <button
                      onClick={() => setActiveVideo(video)}
                      className="flex items-center space-x-1 font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
                    >
                      <span>💬</span>
                      <span>{video.comments.length}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => toggleSaveLong(video.id)}
                    className={`text-xs font-semibold cursor-pointer ${
                      video.isSaved ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {video.isSaved ? '🔖 Saved' : '🔖 Bookmark'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: TIKTOK / INSTAGRAM REELS SHORT-FORM */}
        {activeTab === 'shorts' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {shortReels.map((reel) => (
              <div
                key={reel.id}
                className="relative h-[480px] rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group"
              >
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Floating Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold uppercase bg-red-600 text-white px-2.5 py-1 rounded-full">
                      REEL SHORT
                    </span>
                    <span className="text-xs text-white/80 font-semibold">{reel.views} views</span>
                  </div>

                  {/* Reel Bottom Details & Side Action Controls */}
                  <div className="flex items-end justify-between">
                    <div className="space-y-2 max-w-[75%]">
                      <div className="flex items-center space-x-2">
                        <img
                          src={reel.avatar}
                          alt={reel.creator}
                          className="w-7 h-7 rounded-full border border-white/50 object-cover"
                        />
                        <span className="text-xs font-bold text-white">{reel.creator}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug">
                        {reel.title}
                      </h3>
                    </div>

                    {/* Side Floating Actions */}
                    <div className="flex flex-col items-center space-y-3">
                      <button
                        onClick={() => {
                          setShortReels(
                            shortReels.map((r) =>
                              r.id === reel.id
                                ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
                                : r
                            )
                          );
                        }}
                        className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex flex-col items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        <span>{reel.isLiked ? '❤️' : '🤍'}</span>
                        <span className="text-[9px]">{reel.likes}</span>
                      </button>

                      <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex flex-col items-center justify-center text-xs font-bold cursor-pointer">
                        <span>💬</span>
                        <span className="text-[9px]">{reel.commentsCount}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 3: SAVED BOOKMARKS */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Your Saved Learning Playlist
            </h2>
            {savedVideos.length === 0 ? (
              <div className="p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                No saved tutorials yet. Bookmark masterclasses to watch them anytime.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-36 object-cover rounded-xl cursor-pointer"
                      onClick={() => setActiveVideo(video)}
                    />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{video.title}</h3>
                    <p className="text-xs text-slate-400">Channel: {video.channel}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INTERACTIVE VIDEO PLAYER & COMMENTS MODAL */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
              
              {/* Left Column: Video Viewport */}
              <div className="lg:w-3/5 bg-black p-4 flex flex-col justify-between">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <video
                    controls
                    autoPlay
                    src={activeVideo.videoUrl}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="pt-4 text-white space-y-2">
                  <h2 className="text-base font-bold leading-snug">{activeVideo.title}</h2>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{activeVideo.channel} • {activeVideo.views} views</span>
                    <button
                      onClick={() => toggleLikeLong(activeVideo.id)}
                      className="text-red-400 font-bold"
                    >
                      ❤️ {activeVideo.likes} Likes
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Discussion & Live Comments Section */}
              <div className="lg:w-2/5 p-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Comments ({activeVideo.comments.length})
                    </h3>
                    <button
                      onClick={() => setActiveVideo(null)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Comment List Feed */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
                    {activeVideo.comments.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1"
                      >
                        <div className="flex justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          <span>{c.user}</span>
                          <span className="text-slate-400 font-normal">{c.time}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Comment Input Form */}
                <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <input
                    type="text"
                    placeholder="Add a public comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Post Comment
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}