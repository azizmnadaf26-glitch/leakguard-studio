import { useState } from 'react';

export default function PostOpportunity({ onJobCreated, onCancel }) {
  const [step, setStep] = useState(1);
  const [roleTitle, setRoleTitle] = useState('');
  const [category, setCategory] = useState('UI/UX Design');
  const [budget, setBudget] = useState(25000);
  const [workType, setWorkType] = useState('Remote');
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(['Figma', 'UI/UX']);

  const availableSkills = ['Figma', 'UI/UX', 'React', 'PyTorch', 'Python', 'Branding', 'Vector Art', 'Tailwind'];

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onJobCreated) {
      onJobCreated({
        title: roleTitle || 'Untitled Role',
        category,
        budget: `₹${budget.toLocaleString()}`,
        workType,
        skills: selectedSkills,
        description
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
      
      {/* LEFT: STEPPER FORM BUILDER (7 Cols) */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Post a New Opportunity</h2>
            <p className="text-xs text-slate-400">Specify requirements to find top AI & design talent.</p>
          </div>
          <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-900">
            Step {step} of 2
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. AI Model Visualizer or Brand Designer"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
                  >
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="AI / ML Development">AI / ML Development</option>
                    <option value="Logo & Branding">Logo & Branding</option>
                    <option value="Digital Art & Concept">Digital Art & Concept</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Location</label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-Site">On-Site</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Description & Requirements</label>
                <textarea
                  rows={4}
                  placeholder="Details about deliverables..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
              >
                Continue to Budget & Skills →
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Budget / Stipend (₹)</label>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{budget.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="2500"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">Required Skill Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((sk) => (
                    <button
                      type="button"
                      key={sk}
                      onClick={() => toggleSkill(sk)}
                      className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-semibold ${
                        selectedSkills.includes(sk)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {selectedSkills.includes(sk) ? '✓ ' : '+ '}{sk}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
                >
                  Publish Opportunity
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* RIGHT: LIVE CARD PREVIEW (5 Cols) */}
      <div className="lg:col-span-5 space-y-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Live Applicant Card Preview
        </span>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-900">
              {category}
            </span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
              ₹{budget.toLocaleString()}
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {roleTitle || 'Your Role Title Here'}
            </h3>
            <p className="text-xs text-slate-400 pt-0.5">Posted by You • {workType}</p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {description || 'Details about deliverables will appear here...'}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {selectedSkills.map((s) => (
              <span key={s} className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                #{s}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}