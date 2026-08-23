import { useState, useEffect } from 'react';

export default function HomePage({ setActivePage, isLoggedIn, onOpenAuth, setSelectedArtistProfile, walletAddress }) {
  const [categories, setCategories] = useState([
    { name: 'Siesta', following: false },
    { name: 'Digital Art', following: false },
    { name: 'Fan Art', following: false },
    { name: 'Photography', following: false },
    { name: 'Fantasy', following: false },
    { name: 'Anime & Manga', following: false },
    { name: 'Cosplay', following: false },
    { name: 'Adoptables', following: false },
    { name: 'Character Design', following: false }
  ]);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newArtTitle, setNewArtTitle] = useState('');
  const [newArtCategory, setNewArtCategory] = useState('Digital Art');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');

  const [posts, setPosts] = useState([
    {
      id: 14,
      artist: 'Yuji Itadori Art',
      badge: 'PRO',
      date: '8/15/26',
      title: 'Manga Sketch Practice',
      category: 'Fan Art',
      likes: 520,
      comments: ['Incredible line work!'],
      image: 'https://i.pinimg.com/originals/a2/a7/b1/a2a7b113690d02aec5e9f35cbf54dcf7.jpg'
    },
    {
      id: 16,
      artist: 'Sunset Studio',
      badge: 'PRO',
      date: '8/15/26',
      title: 'Watercolor Sunset Study',
      category: 'Digital Art',
      likes: 295,
      comments: ['Beautiful blending!'],
      image: 'https://paintingvalley.com/image/watercolor-sunset-for-beginners-10.jpg'
    },
    {
      id: 2,
      artist: 'dainbramage1',
      badge: 'PRO+',
      date: '7/25/26',
      title: 'Echoes of Reflection',
      category: 'Concept Art',
      likes: 246,
      comments: ['Mindblowing surrealism!'],
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      artist: 'Alex Rivera',
      badge: 'PRO',
      date: '8/02/26',
      title: 'Prismatic Corridor',
      category: '3D Art',
      likes: 98,
      comments: ['Super crisp details!'],
      image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      artist: 'Mei Lin',
      badge: 'PRO+',
      date: '8/10/26',
      title: 'Golden Kaleidoscope Dreams',
      category: 'Digital Art',
      likes: 312,
      comments: ['Insane patterns'],
      image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      artist: 'Kaito Takahashi',
      badge: '',
      date: '8/11/26',
      title: 'Spirit Guardian Character Design',
      category: 'Anime & Manga',
      likes: 420,
      comments: ['Love the character expression!'],
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
    }
    }
  ]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ownership/feed`);
        if (response.ok) {
          const feedData = await response.json();
          setPosts(prevPosts => {
            // Filter out any mock posts that might have the same ID to avoid duplicates (though unlikely)
            const newPosts = feedData.filter(fp => !prevPosts.some(p => p.id === fp.id));
            return [...newPosts, ...prevPosts];
          });
        }
      } catch (err) {
        console.error("Failed to fetch feed:", err);
      }
    };
    fetchFeed();
  }, []);

  const toggleCategoryFollow = (index) => {
    if (!isLoggedIn) onOpenAuth();
    else {
      const updated = [...categories];
      updated[index].following = !updated[index].following;
      setCategories(updated);
    }
  };

  const handleArtSubmit = async (e) => {
    e.preventDefault();
    setUploadError(null);

    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    
    if (!walletAddress) {
      setUploadError('Please connect your wallet first to publish artwork.');
      return;
    }

    if (!selectedFile) {
      setUploadError('Please select an artwork file.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', newArtTitle);
      formData.append('category', newArtCategory);
      formData.append('wallet_address', walletAddress);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ownership/register`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.status === 409) {
        setUploadError(`🚨 AI Similarity Alert: This artwork matches an existing piece registered by ${data.detail.original_owner} on ${data.detail.registered_at}. Similarity score: ${(data.detail.similarity * 100).toFixed(2)}%.`);
        setIsUploading(false);
        return;
      }

      if (!response.ok) {
        setUploadError(data.detail || 'Failed to publish artwork.');
        setIsUploading(false);
        return;
      }

      // Success
      const newPost = {
        id: Date.now(),
        artist: 'Sania Nadaf', // Mock display name for prototype
        badge: 'CREATOR',
        date: 'Today',
        title: newArtTitle,
        category: newArtCategory,
        likes: 0,
        comments: [],
        image: URL.createObjectURL(selectedFile) // show uploaded image locally
      };
      setPosts([newPost, ...posts]);
      setNewArtTitle('');
      setSelectedFile(null);
      setShowSubmitModal(false);
    } catch (err) {
      setUploadError('Network error while uploading.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedPost) return;
    
    // Create new comment array
    const updatedComments = [...selectedPost.comments, newComment];
    
    // Update local selectedPost state
    setSelectedPost({ ...selectedPost, comments: updatedComments });
    
    // Update main posts array
    setPosts(posts.map(p => 
      p.id === selectedPost.id ? { ...p, comments: updatedComments } : p
    ));
    
    setNewComment('');
  };

  const navigateToProfile = (artistName) => {
    setSelectedArtistProfile(artistName);
    setActivePage('profile');
    setSelectedPost(null);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Banner */}
      <section className="p-4 sm:p-6 bg-white dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Share & Discover Amazing Artwork</h1>
            <p className="text-xs text-indigo-100 max-w-xl">
              Upload your latest creations, follow your favorite categories, and connect with fellow artists.
            </p>
          </div>
          <button
            onClick={() => {
              if (!isLoggedIn) onOpenAuth();
              else setShowSubmitModal(true);
            }}
            className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-2xl text-xs hover:bg-opacity-90 transition-all shadow-md shrink-0 cursor-pointer"
          >
            📤 Submit Your Art
          </button>
        </div>
      </section>    

      {/* Category Pills Bar */}
      <section className="px-6 py-3 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto">
        {categories.map((cat, idx) => (
          <button
            key={cat.name}
            onClick={() => toggleCategoryFollow(idx)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              cat.following
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700/60'
            }`}
          >
            <span>{cat.name}</span>
            <span className="ml-1 text-[10px] opacity-70">{cat.following ? '✓' : '+'}</span>
          </button>
        ))}
      </section>

      {/* Edge-to-Edge Visual Gallery Grid */}
      <main className="p-4 sm:p-6 bg-white dark:bg-slate-900">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                if (!isLoggedIn) onOpenAuth();
                else setSelectedPost(post);
              }}
              className="relative group overflow-hidden rounded-xl break-inside-avoid cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 shadow-sm"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Hover Dark Overlay (DeviantArt Style) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-slate-900/80 text-indigo-400 backdrop-blur-md rounded border border-indigo-500/20">
                    {post.category}
                  </span>
                  <span className="p-1.5 bg-black/40 rounded-full text-xs text-white backdrop-blur-sm">
                    🔍
                  </span>
                </div>

                <div className="flex items-end justify-between w-full text-white text-xs pt-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-slate-300 drop-shadow">
                      {post.date}
                    </p>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-xs text-white drop-shadow truncate max-w-[120px]">
                        {post.artist}
                      </span>
                      {post.badge && (
                        <span className="text-[9px] font-extrabold px-1 bg-indigo-600 text-white rounded shrink-0">
                          {post.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-200 font-semibold text-xs shrink-0">
                    <span className="flex items-center space-x-1 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
                      <span>{post.likes}</span>
                      <span>⭐</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Instagram-Style Artwork Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-6 lg:p-12">
          <div className="bg-white dark:bg-slate-900 w-full h-full sm:h-auto max-h-full sm:rounded-2xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm cursor-pointer transition-colors"
            >
              ✕
            </button>

            {/* Left Column: Artwork Image */}
            <div className="w-full md:w-[60%] lg:w-[65%] h-[40vh] md:h-[80vh] bg-black flex items-center justify-center relative">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Right Column: Social Feed & Details */}
            <div className="w-full md:w-[40%] lg:w-[35%] h-[60vh] md:h-[80vh] flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
              
              {/* Header: Artist Info */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div 
                  onClick={() => navigateToProfile(selectedPost.artist)}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border border-slate-200 dark:border-slate-700 group-hover:border-indigo-500 transition-colors">
                    {selectedPost.artist.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {selectedPost.artist}
                    </h3>
                    <span className="text-[10px] text-slate-500">{selectedPost.date}</span>
                  </div>
                </div>
                <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 cursor-pointer">
                  Follow
                </button>
              </div>

              {/* Scrollable Comments & Description */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {/* Description block */}
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 flex justify-center items-center font-bold text-slate-500 text-xs">
                    {selectedPost.artist.charAt(0)}
                  </div>
                  <div className="text-sm">
                    <span 
                      onClick={() => navigateToProfile(selectedPost.artist)}
                      className="font-bold text-slate-900 dark:text-white cursor-pointer hover:underline mr-2"
                    >
                      {selectedPost.artist}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      Presenting <strong>{selectedPost.title}</strong>! Check out the details and let me know your thoughts. 
                    </span>
                    <div className="text-indigo-500 text-xs mt-1 font-semibold">
                      #{selectedPost.category.replace(/\s+/g, '')} #DigitalArt #LeakGuard
                    </div>
                  </div>
                </div>

                {/* Render Comments */}
                {selectedPost.comments.map((comment, idx) => (
                  <div key={idx} className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0" />
                    <div className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white mr-2">user_{Math.floor(Math.random()*900)+100}</span>
                      {comment}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer: Actions & Add Comment */}
              <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xl">
                    <button className="hover:text-slate-500 cursor-pointer">❤️</button>
                    <button className="hover:text-slate-500 cursor-pointer">💬</button>
                    <button className="hover:text-slate-500 cursor-pointer">↗️</button>
                  </div>
                  <span className="font-bold text-sm">{selectedPost.likes} likes</span>
                </div>
                
                {/* Purchase Action Button */}
                <button 
                  onClick={() => {
                    setSelectedPost(null);
                    setActivePage('shop');
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  🛒 Purchase Art License
                </button>

                <form onSubmit={handleCommentSubmit} className="relative pt-2">
                  <input 
                    type="text" 
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-transparent text-sm p-2 outline-none border-b border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:text-white"
                  />
                  <button 
                    type="submit" 
                    disabled={!newComment.trim()}
                    className="absolute right-2 top-4 text-sm font-bold text-indigo-600 disabled:opacity-50 cursor-pointer"
                  >
                    Post
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Submit Art Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Upload Artwork</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleArtSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Artwork Title</label>
                <input
                  type="text"
                  value={newArtTitle}
                  onChange={(e) => setNewArtTitle(e.target.value)}
                  placeholder="e.g. Surreal Digital Landscape"
                  className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Category</label>
                <select
                  value={newArtCategory}
                  onChange={(e) => setNewArtCategory(e.target.value)}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Artwork File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  required
                />
                {selectedFile && (
                  <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                    Selected: {selectedFile.name}
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium">
                  {uploadError}
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isUploading ? 'Publishing...' : 'Publish Artwork'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Explore Recent Deviations */}
      <section className="p-4 sm:p-6 space-y-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
            Explore <span className="text-indigo-500 dark:text-indigo-400">Recent Deviations</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">Submit</span>
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-4 no-scrollbar">
          {[
            'https://rapi.pixai.art/img/media/572610478361001589/thumbnail',
            'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80',
            'https://i.pinimg.com/736x/80/07/6d/80076d988cee1933bac958b76d99203c.jpg',
            'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80'
          ].map((imgUrl, i) => (
            <div
              key={i}
              className="min-w-[160px] h-36 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              <img src={imgUrl} alt="Recent deviation" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Community Callout & Features Section */}
      <section className="py-16 px-6 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center space-y-12">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            There's so much more art to discover.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Join the world's biggest online art community and scroll to your art's content.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg cursor-pointer"
            >
              Join LeakGuard Studio to Continue
            </button>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200">
          Join 100 million creators and art lovers to share work and find your audience.
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          <div className="space-y-2 p-4">
            <div className="text-2xl mb-2">🎨</div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Share your art</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload your works, get feedback, and get discovered in the world's largest creative gallery.
            </p>
          </div>

          <div className="space-y-2 p-4">
            <div className="text-2xl mb-2">👁️</div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Browse unlimited art style</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Follow artists, save the work that inspires you, and discover new favorites through recommendations built around your taste.
            </p>
          </div>

          <div className="space-y-2 p-4">
            <div className="text-2xl mb-2">👥</div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Find your people</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Join groups, dive into fandoms, and connect with artists who love what you love.
            </p>
          </div>

          <div className="space-y-2 p-4">
            <div className="text-2xl mb-2">💎</div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Earn from your art</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Turn your passion into profit by offering subscriptions, exclusive downloads, and so much more.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}