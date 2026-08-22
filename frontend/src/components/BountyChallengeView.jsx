import { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';

export default function BountyChallengeView({ bounty, onClose, onAwarded }) {
  const { activeAddress } = useWallet();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitNote, setSubmitNote] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [fetching, setFetching] = useState(true);

  const isClient = activeAddress === bounty.client_wallet;

  useEffect(() => {
    if (isClient) {
      fetchSubmissions();
    } else {
      setFetching(false);
    }
  }, [bounty.id, isClient]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/bounties/${bounty.id}/submissions`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmitEntry = async (e) => {
    e.preventDefault();
    if (!activeAddress) {
      setErrorMsg("Please connect your wallet first.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/bounties/${bounty.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator_wallet: activeAddress,
          submission_url: submitUrl,
          note: submitNote
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Submission failed");
      }

      setSuccessMsg("Entry submitted successfully!");
      setSubmitUrl('');
      setSubmitNote('');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePickWinner = async (submissionId) => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/bounties/${bounty.id}/award`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: submissionId })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to award winner");
      }

      setSuccessMsg("Winner awarded successfully! Escrow ALGO released.");
      fetchSubmissions();
      if (onAwarded) onAwarded();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-start pt-10 px-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div>
            <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded shadow-sm">
              Featured Challenge
            </span>
            <h2 className="text-xl font-bold mt-2">{bounty.title}</h2>
            <p className="text-xs text-indigo-100 mt-1 opacity-90 font-medium">
              Prize: {bounty.prize_algo} ALGO • Posted by {bounty.client_wallet.slice(0, 6)}...
            </p>
          </div>
          <button onClick={onClose} className="text-white hover:text-indigo-200 font-bold bg-white/10 p-2 rounded-full cursor-pointer">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Challenge Details</h3>
            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{bounty.description}</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex-1 text-center">
              <span className="block text-xs font-bold text-slate-500 mb-1">Status</span>
              <span className={`font-black ${bounty.status === 'open' ? 'text-emerald-500' : 'text-slate-400'}`}>
                {bounty.status.toUpperCase()}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex-1 text-center">
              <span className="block text-xs font-bold text-slate-500 mb-1">Deadline</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {new Date(bounty.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>

          {errorMsg && <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-xs font-bold">{errorMsg}</div>}
          {successMsg && <div className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg text-xs font-bold">{successMsg}</div>}

          {/* Submission Form for Creators */}
          {!isClient && bounty.status === 'open' && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">Submit Your Entry</h3>
              <form onSubmit={handleSubmitEntry} className="space-y-3">
                <input 
                  type="url" 
                  placeholder="Link to your artwork/portfolio (e.g., https://...)" 
                  value={submitUrl}
                  onChange={e => setSubmitUrl(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <textarea 
                  placeholder="A short note about your submission..." 
                  value={submitNote}
                  onChange={e => setSubmitNote(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  rows="2"
                  required
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow cursor-pointer transition-all"
                >
                  {loading ? 'Submitting...' : 'Submit Entry'}
                </button>
              </form>
            </div>
          )}

          {/* Submissions List for Client */}
          {isClient && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">Submissions ({submissions.length})</h3>
              
              {fetching ? (
                <p className="text-slate-500 text-xs">Loading submissions...</p>
              ) : submissions.length === 0 ? (
                <p className="text-slate-500 text-xs italic bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700">No entries submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {submissions.map(sub => (
                    <div key={sub.id} className={`p-4 rounded-xl border ${sub.status === 'winner' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{sub.creator_wallet.slice(0, 8)}...</span>
                        <span className="text-[10px] text-slate-400">{new Date(sub.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">"{sub.note}"</p>
                      <a href={sub.submission_url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline text-xs font-bold block mb-3">
                        View Submission ↗
                      </a>
                      
                      {bounty.status === 'open' && sub.status !== 'winner' && (
                        <button 
                          onClick={() => handlePickWinner(sub.id)}
                          disabled={loading}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Pick as Winner & Release {bounty.prize_algo} ALGO
                        </button>
                      )}
                      
                      {sub.status === 'winner' && (
                        <div className="text-center text-emerald-600 dark:text-emerald-400 font-black text-xs pt-1">
                          ★ WINNING ENTRY ★
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
