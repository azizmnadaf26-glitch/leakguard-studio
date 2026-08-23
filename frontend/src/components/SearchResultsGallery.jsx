import React from 'react';

export default function SearchResultsGallery({ searchResults, isLoggedIn, onOpenAuth }) {
  if (!searchResults || !searchResults.results) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center pt-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold">Extracting tags and querying network...</p>
      </div>
    );
  }

  const { extracted_tags, results, type } = searchResults;
  const isCreators = type === 'creators';

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Banner */}
      <section className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI {isCreators ? 'Creator' : 'Artwork'} Search Results
          </h1>
          <div className="flex flex-wrap justify-center gap-2">
            {extracted_tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-full border border-indigo-200 dark:border-indigo-800/50 shadow-sm">
                #{tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 font-bold">
            Found {results.length} matching {isCreators ? 'creators' : 'artworks'}
          </p>
        </div>
      </section>

      <main className="p-4 sm:p-6 bg-white dark:bg-slate-900 min-h-screen">
        {results.length > 0 ? (
          isCreators ? (
            // Creator Profiles Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {results.map((creator) => (
                <div key={creator.freelancer_id} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                        {creator.freelancer_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{creator.freelancer_name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{creator.freelancer_id}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-xs font-black rounded-lg">
                      {creator.match_score}% Match
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                    {creator.summary}
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {creator.skills.map(skill => (
                        <span 
                          key={skill} 
                          className={`px-2 py-1 text-[10px] font-bold rounded border ${
                            creator.matched_skills.includes(skill)
                              ? 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-700'
                              : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="mt-6 w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-colors">
                    View Portfolio
                  </button>
                </div>
              ))}
            </div>
          ) : (
            // Artwork Masonry Gallery Grid
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {results.map((post) => (
                <div
                  key={post.asset_hash}
                  onClick={() => {
                    if (!isLoggedIn) onOpenAuth();
                    else alert(`Full View for ${post.title}`);
                  }}
                  className="relative group overflow-hidden rounded-xl break-inside-avoid cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 shadow-sm"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="font-bold text-white text-sm leading-tight drop-shadow-md">
                            {post.title}
                          </h3>
                          <p className="text-[10px] font-semibold text-slate-300">
                            {post.wallet_address.substring(0, 6)}...{post.wallet_address.substring(post.wallet_address.length - 4)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-emerald-400 bg-slate-950/50 px-2 py-1 rounded-md backdrop-blur-md">
                            {post.match_score}% Match
                          </span>
                          {post.asa_id && (
                            <span className="text-[10px] font-bold text-amber-400 bg-slate-950/50 px-2 py-1 rounded-md backdrop-blur-md mt-1">
                              ASA: {post.asa_id}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-4xl mb-4">{isCreators ? '👤' : '🎨'}</span>
            <p className="text-slate-500 font-bold text-sm">No {isCreators ? 'creators' : 'artworks'} match this query.</p>
          </div>
        )}
      </main>
    </div>
  );
}
