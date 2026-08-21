import { useState } from 'react';

export default function HomePage({ setActivePage, isLoggedIn, onOpenAuth }) {
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
  ]);

  const toggleCategoryFollow = (index) => {
    if (!isLoggedIn) onOpenAuth();
    else {
      const updated = [...categories];
      updated[index].following = !updated[index].following;
      setCategories(updated);
    }
  };

  const handleArtSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    const newPost = {
      id: Date.now(),
      artist: 'Sania Nadaf',
      badge: 'CREATOR',
      date: 'Today',
      title: newArtTitle,
      category: newArtCategory,
      likes: 0,
      comments: [],
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    };
    setPosts([newPost, ...posts]);
    setNewArtTitle('');
    setShowSubmitModal(false);
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

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 rounded-xl text-center text-xs text-slate-500 dark:text-slate-400">
                📁 Click to select file or drag & drop artwork image
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Publish Artwork
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