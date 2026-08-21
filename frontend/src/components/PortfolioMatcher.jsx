import { useState } from 'react';

export default function PortfolioMatcher() {
  const [autoMatch, setAutoMatch] = useState(true);
  const [selectedCandidateId, setSelectedCandidateId] = useState('c-1');
  const [searchQuery, setSearchQuery] = useState('UX/UI Designer');

  // Match Candidates List
  const candidates = [
    {
      id: 'c-1',
      name: 'Product Designer',
      subtitle: 'Flowdesk • Remote (EU) • Mid',
      totalScore: 82,
      skills: ['Design Systems', 'B2B SaaS', 'Leadership'],
      metrics: { skills: 84, experience: 78, portfolio: 86, keywords: 69, confidence: 'High (91%)' },
      summary: 'Strong fit for B2B SaaS & design systems. Biggest gap: accessibility evidence.',
      strengths: [
        'Design systems ownership',
        'B2B SaaS dashboard experience',
        'Strong PM/Eng collaboration',
        'Complex workflows & permissions',
        'Discovery → prototyping → validation',
        'Design QA & handoff'
      ],
      evidence: [
        { text: 'Led design system rollout (tokens, components, documentation) across 3 squads', tag: 'Flowdesk' },
        { text: 'Case study: Admin dashboard redesign (filters, tables, permissions) — shipped v2 in 6 weeks', tag: 'Ref-v2' },
        { text: 'Partnered with PM/Engineering to define scope, run workshops, and reduce rework', tag: 'Team-Ops' }
      ]
    },
    {
      id: 'c-2',
      name: 'UX/UI Designer',
      subtitle: 'Cartly • Krakow (Hybrid) • Senior',
      totalScore: 74,
      skills: ['E-commerce', 'UI craft', 'Design QA'],
      metrics: { skills: 76, experience: 82, portfolio: 70, keywords: 65, confidence: 'Medium (84%)' },
      summary: 'Experienced in consumer app flows and micro-interactions.',
      strengths: [
        'E-commerce funnel optimization',
        'Mobile-first responsive design',
        'High-fidelity interactive prototyping',
        'User research & usability testing'
      ],
      evidence: [
        { text: 'Redesigned checkout checkout flow resulting in a 14% conversion lift', tag: 'Cartly' },
        { text: 'Built component library for mobile iOS and Android design tokens', tag: 'Mobile-UI' }
      ]
    },
    {
      id: 'c-3',
      name: 'Design Systems Lead',
      subtitle: 'Nimbus • Berlin (Remote) • Mid',
      totalScore: 69,
      skills: ['Tokens', 'Governance', 'Documentation'],
      metrics: { skills: 90, experience: 62, portfolio: 68, keywords: 58, confidence: 'Medium (79%)' },
      summary: 'Specialized token architect with deep technical documentation skills.',
      strengths: [
        'Design token architecture & automation',
        'Figma variables & multi-brand systems',
        'Developer handoff & documentation'
      ],
      evidence: [
        { text: 'Architected multi-brand token strategy supporting 4 sub-brands', tag: 'Tokens' }
      ]
    },
    {
      id: 'c-4',
      name: 'Growth Designer',
      subtitle: 'Pulse • London (Remote) • Senior',
      totalScore: 51,
      skills: ['Funnels', 'Experiments', 'A/B testing'],
      metrics: { skills: 55, experience: 60, portfolio: 48, keywords: 42, confidence: 'Low (61%)' },
      summary: 'Focuses on rapid experimentation and onboarding acquisition.',
      strengths: [
        'A/B test hypothesis generation',
        'Conversion landing page design'
      ],
      evidence: [
        { text: 'Ran 20+ A/B experiments for sign-up funnel conversion optimization', tag: 'Growth' }
      ]
    },
    {
      id: 'c-5',
      name: 'UX Researcher',
      subtitle: 'Atlas Health • Warsaw (Hybrid) • Senior',
      totalScore: 38,
      skills: ['Interviews', 'Usability tests', 'Synthesis'],
      metrics: { skills: 40, experience: 45, portfolio: 32, keywords: 30, confidence: 'Low (48%)' },
      summary: 'Qualitative researcher focused on clinical healthcare workflows.',
      strengths: [
        'User interview moderation',
        'Affinity mapping & persona synthesis'
      ],
      evidence: [
        { text: 'Conducted 35 in-depth user interviews with medical professionals', tag: 'Health-UX' }
      ]
    }
  ];

  const currentCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 1. TOP HEADER & TOOLBAR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>AI Resume & Portfolio Matcher</span>
              </h1>
            </div>

            <div className="flex items-center space-x-4 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Analyzed sources: <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-md">CV</span> <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-md ml-1">Portfolio</span>
              </span>
              <span className="text-slate-400 hidden sm:inline">• Last run: 2m ago</span>
              
              <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-4">
                <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
                  SL
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Sam Lee</span>
              </div>
            </div>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search roles, companies..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute left-2.5 top-2 text-xs text-slate-400">🔍</span>
              </div>

              <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                Location ▾
              </button>
              <button className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1 cursor-pointer">
                <span>Seniority</span> <span className="text-[10px]">✕</span>
              </button>
              <button className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1 cursor-pointer">
                <span>Industry</span> <span className="text-[10px]">✕</span>
              </button>
            </div>

            {/* Auto-Match Toggle Switch */}
            <div className="flex items-center space-x-3 w-full lg:w-auto justify-end">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Auto-match</span>
                <span className="text-[10px] text-slate-400">Autofill jobs by your profile</span>
              </div>
              <button
                type="button"
                onClick={() => setAutoMatch(!autoMatch)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  autoMatch ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    autoMatch ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 2. SPLIT-SCREEN ANALYTICS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: CANDIDATE RANKINGS LIST (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                "{searchQuery}"
              </span>
              <span className="text-xs text-slate-400 font-semibold">11 Best match ▾</span>
            </div>

            <div className="space-y-3">
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidateId(cand.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    selectedCandidateId === cand.id
                      ? 'bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Ring Score Badge */}
                    <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200 dark:text-slate-800"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-indigo-600 dark:text-indigo-400"
                          strokeDasharray={`${cand.totalScore}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-xs font-extrabold text-slate-900 dark:text-white">
                        {cand.totalScore}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{cand.name}</h3>
                      <p className="text-[10px] text-slate-400">{cand.subtitle}</p>
                    </div>
                  </div>

                  {/* Skills Chips */}
                  <div className="flex flex-wrap gap-1">
                    {cand.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[9px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER COLUMN: MATCH SCORE & STRENGTHS BREAKDOWN (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Candidate Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">{currentCandidate.name}</h2>
                <p className="text-xs text-slate-400">{currentCandidate.subtitle}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 cursor-pointer">
                  Copy link
                </button>
                <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer">
                  Save job
                </button>
              </div>
            </div>

            {/* Match Score Breakdown Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Match score</h3>
              
              <div className="flex flex-col sm:flex-row items-center gap-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl">
                {/* Large Center Ring */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200 dark:text-slate-700"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-600 dark:text-indigo-400"
                      strokeDasharray={`${currentCandidate.totalScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white block">
                      {currentCandidate.totalScore}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 block -mt-1">Total score</span>
                  </div>
                </div>

                {/* Progress Metric Bars */}
                <div className="w-full space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">Skills</span>
                    <div className="flex items-center space-x-3 w-44">
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${currentCandidate.metrics.skills}%` }} />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 w-6 text-right">{currentCandidate.metrics.skills}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">Experience</span>
                    <div className="flex items-center space-x-3 w-44">
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${currentCandidate.metrics.experience}%` }} />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 w-6 text-right">{currentCandidate.metrics.experience}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">Portfolio</span>
                    <div className="flex items-center space-x-3 w-44">
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${currentCandidate.metrics.portfolio}%` }} />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 w-6 text-right">{currentCandidate.metrics.portfolio}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">Keywords</span>
                    <div className="flex items-center space-x-3 w-44">
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${currentCandidate.metrics.keywords}%` }} />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 w-6 text-right">{currentCandidate.metrics.keywords}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700/60 pt-2">
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">Confidence</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{currentCandidate.metrics.confidence}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                "{currentCandidate.summary}"
              </p>
            </div>

            {/* Strengths Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Strengths for this role</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentCandidate.strengths.map((str, i) => (
                  <div key={i} className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: RECOMMENDED ACTIONS & EVIDENCE VIEWER (3 cols) */}
          <div className="lg:col-span-3 space-y-6">

            {/* Recommended Actions Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Recommended actions
              </h3>

              <div className="space-y-2 text-xs">
                <button className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                  <span>Generate tailored summary</span>
                  <span className="text-slate-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                  <span>Rewrite CV bullets</span>
                  <span className="text-slate-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                  <span>Reorder portfolio</span>
                  <span className="text-slate-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                  <span>Export PDF</span>
                  <span className="text-slate-400">→</span>
                </button>
              </div>
            </div>

            {/* Evidence Viewer Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Evidence viewer
              </h3>

              <div className="space-y-3">
                {currentCandidate.evidence.map((ev, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-2xl text-[11px] space-y-2"
                  >
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{ev.text}"
                    </p>
                    <span className="inline-block text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md">
                      {ev.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}