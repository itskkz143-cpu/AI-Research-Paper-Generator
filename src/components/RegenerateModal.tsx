import React, { useState } from 'react';
import { PaperSectionKey, PAPER_SECTIONS } from '../types/paper';
import { RefreshCw, Sparkles, X, AlertCircle } from 'lucide-react';

interface RegenerateModalProps {
  sectionKey: PaperSectionKey;
  currentContent: string;
  topic: string;
  domain: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (instructions: string) => Promise<void>;
}

export const RegenerateModal: React.FC<RegenerateModalProps> = ({
  sectionKey,
  currentContent,
  topic,
  domain,
  isLoading,
  onClose,
  onConfirm,
}) => {
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sectionMeta = PAPER_SECTIONS.find((s) => s.key === sectionKey);
  const sectionLabel = sectionMeta ? sectionMeta.label : sectionKey;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onConfirm(instructions);
    } catch (err: any) {
      setError(err?.message || 'Failed to regenerate section.');
    }
  };

  const presetPrompts = [
    'Deepen the mathematical formalism and quantitative definitions.',
    'Focus heavily on real-world constraints, noise, and scalability.',
    'Provide a more thorough critical comparison against conventional baselines.',
    'Ensure all citations and simulated findings are rigorously qualified.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden text-slate-100">
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Regenerate Section
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono">
                {sectionLabel}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Topic: <span className="text-slate-300 font-medium">{topic}</span> ({domain})
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-500/40 text-red-200 text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Previous Snippet */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Current Draft Preview
            </label>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300 max-h-28 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed">
              {currentContent ? currentContent.slice(0, 500) + (currentContent.length > 500 ? '...' : '') : '(Empty section)'}
            </div>
          </div>

          {/* User Custom Prompt / Instructions */}
          <div>
            <label htmlFor="regen-instructions" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Specific Revision Guidance <span className="text-slate-500 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              id="regen-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Focus on computational complexity, add step-by-step algorithms, or strengthen the literature comparison..."
              rows={3}
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Quick preset suggestion buttons */}
          <div>
            <span className="text-xs text-slate-400 block mb-1.5">Suggested refinement angles:</span>
            <div className="flex flex-wrap gap-1.5">
              {presetPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInstructions(p)}
                  disabled={isLoading}
                  className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700/60 transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Regenerate {sectionLabel}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
