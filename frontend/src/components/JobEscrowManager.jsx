import { useState } from 'react';

export default function JobEscrowManager() {
  const [activeTab, setActiveTab] = useState('deliverables'); // 'summary', 'deliverables', 'financials'
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for New Job
  const [newTitle, setNewTitle] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newAssignee, setNewAssignee] = useState('');

  // Active Escrow Contracts Dataset
  const [contracts, setContracts] = useState([
    {
      id: 'ESC-91824',
      title: 'Brand Identity & Logo Redesign for PARVA',
      client: 'PES Cultural Committee',
      assignee: 'Sania Nadaf',
      startDate: '12/08/2026',
      totalBudget: '₹15,000',
      remainingBalance: '₹5,000',
      status: 'In Progress',
      deliverables: [
        { id: '#1077', name: 'Vector Logo Assets & Guidelines', type: 'ZIP', category: 'Brand Assets', date: '15/08/2026', status: 'Approved', amount: '₹5,000' },
        { id: '#1078', name: 'Social Media Banner Templates', type: 'FIG', category: 'Design Files', date: '16/08/2026', status: 'Under Review', amount: '₹5,000' },
        { id: '#1079', name: 'Merchandise Print Files & Mockups', type: 'PDF', category: 'Print Ready', date: 'Pending', status: 'Locked', amount: '₹5,000' }
      ]
    },
    {
      id: 'ESC-91825',
      title: 'AI Energy Consumption Prediction Pipeline',
      client: 'CleanGrid Systems',
      assignee: 'Sania Nadaf',
      startDate: '01/08/2026',
      totalBudget: '₹45,000',
      remainingBalance: '₹0',
      status: 'Fully Paid',
      deliverables: [
        { id: '#2041', name: 'Multivariate PyTorch Model Code', type: 'PY', category: 'Source Code', date: '08/08/2026', status: 'Approved', amount: '₹25,000' },
        { id: '#2042', name: 'Data Pipeline Integration & API', type: 'ZIP', category: 'Backend', date: '10/08/2026', status: 'Approved', amount: '₹20,000' }
      ]
    }
  ]);

  const [selectedContractId, setSelectedContractId] = useState('ESC-91824');
  const activeContract = contracts.find((c) => c.id === selectedContractId) || contracts[0];

  const handleCreateContract = (e) => {
    e.preventDefault();
    if (!newTitle || !newBudget) return;

    const newContract = {
      id: `ESC-${Math.floor(10000 + Math.random() * 90000)}`,
      title: newTitle,
      client: 'Self (Employer)',
      assignee: newAssignee || 'Unassigned',
      startDate: '17/08/2026',
      totalBudget: `₹${newBudget}`,
      remainingBalance: `₹${newBudget}`,
      status: 'Funded',
      deliverables: [
        { id: `#${Math.floor(1000 + Math.random() * 9000)}`, name: 'Initial Project Deliverable', type: 'ZIP', category: 'Milestone 1', date: 'Pending', status: 'Locked', amount: `₹${newBudget}` }
      ]
    };

    setContracts([newContract, ...contracts]);
    setSelectedContractId(newContract.id);
    setNewTitle('');
    setNewBudget('');
    setNewAssignee('');
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* 1. CONTRACT SELECTOR BAR & QUICK ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💼</span>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">Escrow Contract Hub</h1>
              <p className="text-xs text-slate-400">Manage active gig escrows, milestones, and instant payout releases.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedContractId}
              onChange={(e) => setSelectedContractId(e.target.value)}
              className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.title.substring(0, 25)}...
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
            >
              + Create Escrow Job
            </button>
          </div>
        </div>

        {/* 2. MAIN DASHBOARD BOARD (IMAGE REFERENCE STYLE) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Header Row & Print Options */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{activeContract.id}</h2>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold rounded-full border border-indigo-200 dark:border-indigo-900">
                ⚡ {activeContract.status}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <button className="hover:text-slate-900 dark:hover:text-white cursor-pointer">🖨️ Print</button>
              <button className="hover:text-slate-900 dark:hover:text-white cursor-pointer">📤 Export PDF</button>
              <button className="hover:text-slate-900 dark:hover:text-white cursor-pointer">ℹ️ Support</button>
            </div>
          </div>

          {/* Contract Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[10px]">Client / Organization</span>
              <strong className="text-slate-800 dark:text-slate-200">{activeContract.client}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px]">Contractor / Assignee</span>
              <strong className="text-slate-800 dark:text-slate-200">👤 {activeContract.assignee}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px]">Start Date</span>
              <strong className="text-slate-800 dark:text-slate-200">📅 {activeContract.startDate}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px]">Security Vault</span>
              <strong className="text-emerald-600 dark:text-emerald-400">🔒 Smart Contract Secured</strong>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Contract Title</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{activeContract.title}</h3>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Contract Budget</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{activeContract.totalBudget}</div>
            </div>

            <div className="p-5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl space-y-1">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Vault Remaining Balance</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activeContract.remainingBalance}</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex space-x-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('deliverables')}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'deliverables'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Deliverables & Files ({activeContract.deliverables.length})
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'summary'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Contract Terms & Details
            </button>
          </div>

          {/* TAB 1: DELIVERABLES TABLE (IMAGE REFERENCE MATCH) */}
          {activeTab === 'deliverables' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Milestone Submissions</h3>
                <button className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-900 cursor-pointer">
                  + Add Milestone File
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-3 pl-2">Item ID</th>
                      <th className="pb-3">Deliverable Name</th>
                      <th className="pb-3">File Type</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Submitted On</th>
                      <th className="pb-3">Milestone Value</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {activeContract.deliverables.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 pl-2 font-bold text-indigo-600 dark:text-indigo-400">{item.id}</td>
                        <td className="py-3.5 font-bold text-slate-900 dark:text-slate-100">{item.name}</td>
                        <td className="py-3.5 font-semibold text-slate-500">{item.type}</td>
                        <td className="py-3.5 text-slate-500">{item.category}</td>
                        <td className="py-3.5 text-slate-500">{item.date}</td>
                        <td className="py-3.5 font-extrabold text-slate-900 dark:text-slate-100">{item.amount}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              item.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                : item.status === 'Under Review'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right pr-2 space-x-2">
                          {item.status === 'Under Review' && (
                            <button
                              onClick={() => alert(`Milestone ${item.id} approved! Released ${item.amount} from Escrow.`)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg shadow cursor-pointer"
                            >
                              Release Funds
                            </button>
                          )}
                          <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">👁️ View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: SUMMARY DETAILS */}
          {activeTab === 'summary' && (
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Escrow Vault Rules</h3>
              <p>
                Funds for this job contract are stored safely inside an automated smart escrow vault. Milestone payouts are released immediately to the contractor upon client approval of each deliverable.
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Dispute Protection Active</span>
                <span>Both parties are protected against unverified work and non-payment through cryptographic proof-of-work timestamps.</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* CREATE NEW ESCROW JOB MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">Create New Job & Lock Escrow</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Logo Redesign or AI Model Development"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Total Escrow Budget (INR)</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Assignee / Freelancer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sania Nadaf"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Lock Funds & Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}