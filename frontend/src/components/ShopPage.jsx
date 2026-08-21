import { useState } from 'react';

export default function ShopPage({ isLoggedIn, onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Art & Craft Dataset
  const sampleProducts = [
    {
      id: 1,
      title: 'Custom Botanical Watercolor Painting',
      tabCategory: 'artforms',
      subCategory: 'Paintings',
      price: 1200,
      rating: 4.9,
      reviews: 48,
      creator: 'Sania Nadaf',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      description: 'Hand-painted botanical artwork on cold-press paper using natural watercolor pigments.',
      tags: ['Watercolor', 'Botanical', 'Original Art'],
      budgetGroup: 'Under ₹2,499'
    },
    {
      id: 2,
      title: 'Handmade Floral Embroidery Hoop Art',
      tabCategory: 'artforms',
      subCategory: 'Embroidery',
      price: 850,
      rating: 5.0,
      reviews: 32,
      creator: 'Ananya Studio',
      image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
      description: 'Intricate hand-stitched floral pattern on natural linen stretched in an 8-inch wooden hoop.',
      tags: ['Needlework', 'Hoop Art', 'Wall Decor'],
      budgetGroup: 'Under ₹999'
    },
    {
      id: 3,
      title: 'Handcrafted Crochet Flower Keychains & Plushies',
      tabCategory: 'gifting',
      subCategory: 'Crochet & Keychains',
      price: 399,
      rating: 4.8,
      reviews: 75,
      creator: 'Crafts by Maya',
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
      description: 'Soft hand-knit cotton yarn plush keychains. Durable, lightweight, and perfect for gifting.',
      tags: ['Crochet', 'Keychains', 'Gifts'],
      budgetGroup: 'Under ₹499'
    },
    {
      id: 4,
      title: 'Ornamented Miniature Postcard Painting',
      tabCategory: 'gifting',
      subCategory: 'Custom Keepsakes',
      price: 1800,
      rating: 4.9,
      reviews: 54,
      creator: 'PARVA Creative Hub',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      description: 'Hand-painted fine miniature artwork on authentic vintage postcard paper in a teak frame.',
      tags: ['Miniature', 'Custom Frame', 'Keepsake'],
      budgetGroup: 'Under ₹2,499'
    }
  ];

  // Visual Category Tiles
  const categoriesGrid = [
    {
      name: 'Original Paintings',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      subtitle: 'Watercolor, Oil & Canvas'
    },
    {
      name: 'Embroidery & Hoop Art',
      image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80',
      subtitle: 'Custom Stitches & Wall Threads'
    },
    {
      name: 'Crochet & Fiber Art',
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80',
      subtitle: 'Keychains, Plushies & Decor'
    },
    {
      name: 'Custom Keepsakes & Gifts',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      subtitle: 'Personalized Portraits & Miniatures'
    }
  ];

  // Media Creator Stories & Customer Testimonials (MeMeraki Style)
  const creatorStories = [
    {
      id: 1,
      name: 'Riddhi Khosla Jalan',
      role: 'Interior Designer & Educator',
      quote: 'Loved learning about the authentic roots of Indian art and receiving custom framed pieces.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      name: 'Devika Narain',
      role: 'Event Stylist & Wedding Planner',
      quote: 'My first custom art commission was so stunning. The craftsmanship is truly unmatched.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      name: 'Prachi Popat',
      role: 'Craft Enthusiast & Creator',
      quote: 'The threadwork and wooden hoop art are exquisite. Perfect for home decor gifts.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const addToCart = (product) => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    setCart((prev) => [...prev, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const filteredProducts = sampleProducts.filter((product) => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'artforms' && (product.tabCategory === 'artforms' || selectedSubCategory === 'Paintings' || selectedSubCategory === 'Embroidery')) ||
      (activeTab === 'gifting' && product.tabCategory === 'gifting') ||
      (activeTab === 'budget' && (selectedSubCategory === 'All' || product.budgetGroup === selectedSubCategory));
    
    const matchesSubCategory = selectedSubCategory === 'All' || 
                               product.subCategory === selectedSubCategory || 
                               product.budgetGroup === selectedSubCategory;

    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTab && matchesSubCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header & Sub-Tab Navigation Bar (Jobs Board Style) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Artisan & Handcrafted Marketplace
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Shop authentic student paintings, embroidered hoop art, crochet keychains, and custom gifts.
            </p>
          </div>

          <div className="flex p-1 bg-slate-200 dark:bg-slate-900 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-800 self-start md:self-auto overflow-x-auto">
            <button
              onClick={() => { setActiveTab('all'); setSelectedSubCategory('All'); }}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🖼️ All Artworks
            </button>
            <button
              onClick={() => { setActiveTab('artforms'); setSelectedSubCategory('Paintings'); }}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'artforms'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🎨 Artforms
            </button>
            <button
              onClick={() => { setActiveTab('gifting'); setSelectedSubCategory('Custom Keepsakes'); }}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'gifting'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🎁 Gifting & Occasion
            </button>
            <button
              onClick={() => { setActiveTab('budget'); setSelectedSubCategory('Under ₹499'); }}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'budget'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              💰 Budget Studio
            </button>
          </div>
        </div>

        {/* Filter Pills & Search Input */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto text-xs">
            <span className="text-slate-400 text-[11px] font-bold uppercase">Filter:</span>
            
            {activeTab === 'all' && (
              ['All', 'Paintings', 'Embroidery', 'Crochet & Keychains', 'Custom Keepsakes'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSubCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedSubCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))
            )}

            {activeTab === 'artforms' && (
              ['Paintings', 'Embroidery', 'Crochet & Crafts'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSubCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedSubCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))
            )}

            {activeTab === 'gifting' && (
              ['Custom Keepsakes', 'Crochet & Keychains', 'Personalized Frames'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSubCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedSubCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))
            )}

            {activeTab === 'budget' && (
              ['Under ₹499', 'Under ₹999', 'Under ₹2,499'].map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedSubCategory(b)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedSubCategory === b
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search art, crochet, gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute left-2.5 top-2 text-xs text-slate-400">🔍</span>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <span>Cart</span>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                {cart.length}
              </span>
            </button>
          </div>
        </div>

        {/* Visual Category Tiles */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Featured Art Disciplines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoriesGrid.map((cat) => (
              <div
                key={cat.name}
                onClick={() => {
                  if (cat.name.includes('Paintings')) setSelectedCategory('Paintings');
                  else if (cat.name.includes('Embroidery')) setSelectedCategory('Embroidery');
                  else if (cat.name.includes('Crochet')) setSelectedCategory('Crochet & Crafts');
                  else setSelectedCategory('Custom Gifts');
                }}
                className="group relative h-40 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-4 flex flex-col justify-end">
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ARTISAN PICK OF THE DAY (Spotlight Card) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
              alt="Artisan Pick of the Day"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/40">
              Artisan Pick of the Day
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              Ornamented Miniature Artwork on Vintage Paper
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Hand-painted by student artisans using traditional fine-detail brushes on authentic vintage paper backing. Includes an organic teak frame.
            </p>
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹1,800</span>
              <span className="text-xs text-slate-400 line-through">₹2,200</span>
            </div>
            <button
              onClick={() => addToCart(sampleProducts[3])}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase bg-slate-900/80 text-white backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700">
                    {product.subCategory}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>By {product.creator}</span>
                    <span className="text-amber-500 font-bold">★ {product.rating}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {product.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  ₹{product.price}
                </span>

                <button
                  onClick={() => addToCart(product)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CREATOR STORIES & BUYER REVIEWS (MeMeraki Style) */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Endorsed by Industry Leaders & Art Collectors
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hear what leading voices in design and craft have to say about our artisan community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creatorStories.map((story) => (
              <div
                key={story.id}
                className="relative h-80 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm group"
              >
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end space-y-2">
                  <p className="text-xs text-slate-200 italic leading-relaxed">
                    "{story.quote}"
                  </p>
                  <div>
                    <h3 className="text-sm font-bold text-white">{story.name}</h3>
                    <p className="text-[11px] text-indigo-300 font-medium">{story.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TRUST & COMMUNITY STATS BAR (Exact screenshot match) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 block">4.9 ★</span>
            <span className="text-xs text-slate-400">Average Rating</span>
          </div>
          <div>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 block">1,200+</span>
            <span className="text-xs text-slate-400">Handcrafted Pieces</span>
          </div>
          <div>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 block">350+</span>
            <span className="text-xs text-slate-400">Custom Gifts Delivered</span>
          </div>
          <div>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block">100% Verified</span>
            <span className="text-xs text-slate-400">On-Chain Ownership</span>
          </div>
        </div>

        {/* Slide-over Cart Drawer */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Your Cart ({cart.length})
                  </h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-10">Your cart is empty.</p>
                ) : (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div
                        key={`${item.id}-${idx}`}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{item.title}</h4>
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{item.subCategory}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{item.price}</span>
                          <button
                            onClick={() => removeFromCart(idx)}
                            className="text-red-500 hover:text-red-600 font-bold cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100">
                  <span>Total Amount</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹{cartTotal}</span>
                </div>

                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    alert('Order confirmed! We will contact you for delivery details.');
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md ${
                    cart.length > 0
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Checkout Now (₹{cartTotal})
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}