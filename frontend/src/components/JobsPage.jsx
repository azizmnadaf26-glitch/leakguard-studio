import { useState } from 'react';
import PortfolioMatcher from './PortfolioMatcher';
import JobEscrowManager from './JobEscrowManager';
import PostOpportunity from './PostOpportunity';

export default function JobsPage({ isLoggedIn, onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extended jobs dataset matching the Unstop / Naukri style
  const [jobs, setJobs] = useState([
    {
      id: 'JOB-101',
      title: 'AI/ML Research Assistant & Model Developer',
      company: 'LeakGuard AI Labs',
      logo: '🤖',
      category: 'AI/ML',
      location: 'Mandya / Remote',
      experience: '0-2 Yrs',
      budget: '₹45,000 / Month',
      type: 'Full Time',
      tags: ['Python', 'PyTorch', 'Multivariate Models', 'OpenCV'],
      posted: 'Aug 16, 2026',
      daysLeft: '12 days left'
    },
    {
      id: 'JOB-102',
      title: 'PARVA Club Brand Identity & Graphic Designer',
      company: 'Avighnans / PARVA Studio',
      logo: '🎨',
      category: 'Graphic Design',
      location: 'On Campus / Flexible',
      experience: 'Fresher / Student',
      budget: '₹15,000 Project',
      type: 'Freelance',
      tags: ['Logo Design', 'Vector Art', 'Branding', 'Figma'],
      posted: 'Aug 15, 2026',
      daysLeft: '5 days left'
    },
    {
      id: 'JOB-103',
      title: 'Senior UI/UX Mobile Experience Designer',
      company: 'Swiftly Tech Solutions',
      logo: '📱',
      category: 'UI/UX Design',
      location: 'Bengaluru / Hybrid',
      experience: '1-3 Yrs',
      budget: '₹60,000 / Month',
      type: 'Full Time',
      tags: ['Figma', 'Prototyping', 'Dark Mode UI', 'User Research'],
      posted: 'Aug 14, 2026',
      daysLeft: '18 days left'
    }
  ]);

  const categories = [
    { name: 'All', icon: '⚡' },
    { name: 'UI/UX Design', icon: '🎨' },
    { name: 'AI/ML', icon: '🤖' },
    { name: 'Graphic Design', icon: '🖼️' },
    { name: '3D & Motion', icon: '🎬' }
  ];

  const handleApply = (title) => {
    if (!isLoggedIn) {
      onOpenAuth();
    } else {
      alert(`Application submitted successfully for: ${title}`);
    }
  };

  const handleJobCreated = (newJobData) => {
    const newJob = {
      id: `JOB-${jobs.length + 101}`,
      title: newJobData.title,
      company: 'Your Company / Project',
      logo: '💼',
      category: newJobData.category,
      location: newJobData.workType,
      experience: '0-1 Yrs',
      budget: newJobData.budget,
      type: 'Freelance',
      tags: newJobData.skills,
      posted: 'Just now',
      daysLeft: '30 days left'
    };
    setJobs([newJob, ...jobs]);
    setActiveTab('browse');
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header & Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Opportunities & Gigs
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Discover student projects, AI design challenges, and freelance roles.
            </p>
          </div>

          {/* Sub-Tab Navigation Bar */}
          <div className="flex p-1 bg-slate-200 dark:bg-slate-900 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'browse'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🔍 Jobs Board
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'post'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ➕ Post Opportunity
            </button>
            <button
              onClick={() => setActiveTab('matcher')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'matcher'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🧬 AI Matcher
            </button>
            <button
              onClick={() => setActiveTab('escrow')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'escrow'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              💎 Escrow Vault
            </button>
          </div>
        </div>

        {/* VIEW 1: BROWSE JOBS */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                    selectedCategory === cat.name
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-xs font-semibold">{cat.name}</span>
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search role, skills, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto text-xs">
                <span className="text-slate-400 text-[11px] font-semibold uppercase">Filters:</span>
                <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">
                  Work Type ▾
                </button>
                <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">
                  Location ▾
                </button>
                <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">
                  Sort By: Newest ▾
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                    No jobs found matching your selected filters.
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl shrink-0">
                            {job.logo}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                              {job.title}
                            </h3>
                            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                              {job.company}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block">
                            {job.budget}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {job.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        <span className="flex items-center space-x-1">
                          <span>🧰</span> <span>{job.experience}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>📍</span> <span>{job.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>📅</span> <span>Posted {job.posted}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/40 px-2.5 py-0.5 rounded-full">
                          ⏳ {job.daysLeft}
                        </span>

                        <button
                          onClick={() => handleApply(job.title)}
                          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Quick Matching Preferences
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Set your desired roles to receive tailored AI job recommendations.
                  </p>

                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">AI / ML Engineer</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold">Matched</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">UI / UX Designer</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold">Matched</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('matcher')}
                    className="w-full mt-2 py-2 border border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Run Portfolio AI Matcher
                  </button>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-sm space-y-2">
                  <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded">Featured Challenge</span>
                  <h4 className="text-sm font-bold">AI Poster Creation Challenge</h4>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    Submit your generative graphics for the PARVA rebranding event.
                  </p>
                  <div className="pt-2">
                    <button className="px-3 py-1.5 bg-white text-indigo-700 font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-indigo-50">
                      View Challenge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: POST OPPORTUNITY */}
        {activeTab === 'post' && (
          <PostOpportunity onJobCreated={handleJobCreated} />
        )}

        {/* VIEW 3: AI MATCHER */}
        {activeTab === 'matcher' && (
          <div className="flex justify-center">
            <PortfolioMatcher />
          </div>
        )}

        {/* VIEW 4: ESCROW VAULT */}
        {activeTab === 'escrow' && (
          <div className="flex justify-center">
            <JobEscrowManager />
          </div>
        )}
      </div>
    </div>
  );
}