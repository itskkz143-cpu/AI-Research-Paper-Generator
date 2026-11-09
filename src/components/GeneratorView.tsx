import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  RotateCcw,
  Download,
  Copy,
  Check,
  RefreshCw,
  Edit3,
  Save,
  X,
  FileText,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Printer,
  Bookmark,
  Share2,
  Clock,
  Layers,
  Heading,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import {
  PaperSectionKey,
  PAPER_SECTIONS,
  ResearchPaper,
  GeneratePaperRequest,
} from '../types/paper';
import { RESEARCH_DOMAINS, SAMPLE_TOPICS, SampleTopic } from '../data/sampleTopics';
import {
  formatAsText,
  formatAsJson,
  formatAsBibTeX,
  calculateWordCount,
  calculateTotalPaperWords,
  estimateReadingTime,
  analyzeReferences,
} from '../utils/paperUtils';
import { RegenerateModal } from './RegenerateModal';

interface GeneratorViewProps {
  initialPreset?: SampleTopic | null;
  activePaper: ResearchPaper | null;
  onPaperGenerated: (paper: ResearchPaper) => void;
  onUpdatePaper: (paper: ResearchPaper) => void;
  onClearActivePaper: () => void;
}

const GENERATION_STEPS = [
  'Formulating Title & Conceptual Hypothesis...',
  'Structuring Abstract & Framing Problem Statement...',
  'Synthesizing Cross-Disciplinary Literature Review...',
  'Constructing Algorithmic & Experimental Methodology...',
  'Generating Controlled Simulated Results & Benchmarks...',
  'Compiling Academic Citations & Ethics Verification Tags...',
];

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  initialPreset,
  activePaper,
  onPaperGenerated,
  onUpdatePaper,
  onClearActivePaper,
}) => {
  // Form State
  const [topic, setTopic] = useState('');
  const [domain, setDomain] = useState<string>(RESEARCH_DOMAINS[0]);
  const [academicLevel, setAcademicLevel] = useState<string>('Postgraduate');
  const [focusAngle, setFocusAngle] = useState('');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepIdx, setGenerationStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Active section editing & regeneration
  const [editingSection, setEditingSection] = useState<PaperSectionKey | null>(null);
  const [editBuffer, setEditBuffer] = useState('');
  const [regeneratingSection, setRegeneratingSection] = useState<PaperSectionKey | null>(null);
  const [isRegeneratingLoading, setIsRegeneratingLoading] = useState(false);

  // Copy feedback toasts
  const [copiedSectionKey, setCopiedSectionKey] = useState<string | null>(null);
  const [copiedFull, setCopiedFull] = useState(false);

  // Download success toast notification
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const downloadTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active section scroll indicator
  const [activeSectionInView, setActiveSectionInView] = useState<PaperSectionKey>('abstract');

  // Handle Preset Selection
  useEffect(() => {
    if (initialPreset) {
      setTopic(initialPreset.topic);
      setDomain(initialPreset.domain);
      setAcademicLevel(initialPreset.academicLevel);
      setFocusAngle(initialPreset.focusAngle);
    }
  }, [initialPreset]);

  // Handle step progression animation during paper generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setGenerationStepIdx(0);
      interval = setInterval(() => {
        setGenerationStepIdx((prev) => (prev + 1) % GENERATION_STEPS.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Cleanup download notification timer on unmount
  useEffect(() => {
    return () => {
      if (downloadTimerRef.current) {
        clearTimeout(downloadTimerRef.current);
      }
    };
  }, []);

  // Clear / Reset form
  const handleResetForm = () => {
    setTopic('');
    setDomain(RESEARCH_DOMAINS[0]);
    setAcademicLevel('Postgraduate');
    setFocusAngle('');
    setError(null);
  };

  // Submit Paper Generation
  const handleGeneratePaper = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a research topic to generate a paper.');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const payload: GeneratePaperRequest = {
        topic: topic.trim(),
        domain,
        academicLevel,
        focusAngle: focusAngle.trim() || undefined,
      };

      const res = await fetch('/api/generate-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${res.status})`);
      }

      const generatedData: ResearchPaper = await res.json();
      onPaperGenerated(generatedData);
    } catch (err: any) {
      console.error('Paper generation failed:', err);
      setError(
        err.message || 'An error occurred while communicating with the AI research assistant. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate Section handler
  const handleConfirmRegenerate = async (instructions: string) => {
    if (!activePaper || !regeneratingSection) return;

    setIsRegeneratingLoading(true);
    try {
      const res = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activePaper.topic,
          domain: activePaper.domain,
          sectionKey: regeneratingSection,
          currentContent: activePaper.sections[regeneratingSection],
          instructions: instructions.trim() || undefined,
          fullContext: {
            title: activePaper.title,
            abstract: activePaper.sections.abstract,
            problemStatement: activePaper.sections.problemStatement,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to regenerate section.');
      }

      const data = await res.json();
      const updatedSections = {
        ...activePaper.sections,
        [regeneratingSection]: data.content,
      };

      const updatedWords = calculateTotalPaperWords({ sections: updatedSections });
      const updatedPaper: ResearchPaper = {
        ...activePaper,
        sections: updatedSections,
        wordCount: updatedWords,
        readingTimeMinutes: estimateReadingTime(updatedWords),
      };

      onUpdatePaper(updatedPaper);
      setRegeneratingSection(null);
    } catch (err: any) {
      console.error('Section regeneration failed:', err);
      throw err;
    } finally {
      setIsRegeneratingLoading(false);
    }
  };

  // Inline Section Editing
  const startEditing = (key: PaperSectionKey) => {
    if (!activePaper) return;
    setEditingSection(key);
    setEditBuffer(activePaper.sections[key] || '');
  };

  const saveEditing = () => {
    if (!activePaper || !editingSection) return;
    const updatedSections = {
      ...activePaper.sections,
      [editingSection]: editBuffer,
    };
    const updatedWords = calculateTotalPaperWords({ sections: updatedSections });
    const updatedPaper: ResearchPaper = {
      ...activePaper,
      sections: updatedSections,
      wordCount: updatedWords,
      readingTimeMinutes: estimateReadingTime(updatedWords),
    };
    onUpdatePaper(updatedPaper);
    setEditingSection(null);
  };

  // Copy Full Paper
  const handleCopyFull = () => {
    if (!activePaper) return;
    const text = formatAsText(activePaper);
    navigator.clipboard.writeText(text);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  // Copy Section
  const handleCopySection = (key: PaperSectionKey) => {
    if (!activePaper) return;
    const text = activePaper.sections[key] || '';
    navigator.clipboard.writeText(text);
    setCopiedSectionKey(key);
    setTimeout(() => setCopiedSectionKey(null), 2000);
  };

  // Download Research Paper as TXT (.txt)
  const handleDownloadTxt = () => {
    if (!activePaper) return;
    const text = formatAsText(activePaper);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'research_paper.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccessMessage('Successfully downloaded research_paper.txt with all 11 sections and headings.');
    if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
    downloadTimerRef.current = setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 4500);
  };

  // Download Research Paper as JSON (.json)
  const handleDownloadJson = () => {
    if (!activePaper) return;
    const json = formatAsJson(activePaper);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'research_paper.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccessMessage('Successfully downloaded research_paper.json with complete metadata and all 11 sections.');
    if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
    downloadTimerRef.current = setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 4500);
  };

  // Download BibTeX
  const handleDownloadBibTeX = () => {
    if (!activePaper) return;
    const bib = formatAsBibTeX(activePaper);
    const blob = new Blob([bib], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(activePaper.title || 'Paper').slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  // Scroll to section smoothly
  const scrollToSection = (key: PaperSectionKey) => {
    setActiveSectionInView(key);
    const el = document.getElementById(`section-${key}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const analyzedRefs = activePaper ? analyzeReferences(activePaper.sections.references) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      {/* Configuration & Input Panel */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Research Paper Generator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure your research topic and domain to synthesize a publication-structured draft
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Inputs</span>
            </button>

            {activePaper && (
              <button
                type="button"
                onClick={onClearActivePaper}
                className="px-3.5 py-1.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 rounded-xl border border-blue-500/30 transition-colors"
              >
                Start Blank Paper
              </button>
            )}
          </div>
        </div>

        {/* Sample Topics Quick-Insert Bar */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Quick Sample Topics (1-Click Fill)
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TOPICS.slice(0, 4).map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setTopic(sample.topic);
                  setDomain(sample.domain);
                  setAcademicLevel(sample.academicLevel);
                  setFocusAngle(sample.focusAngle);
                }}
                className="text-xs px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl border border-slate-700/70 transition-all text-left flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="truncate max-w-xs">{sample.topic.slice(0, 45)}...</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleGeneratePaper} className="space-y-5">
          {/* Topic Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="topic-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Research Topic <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {topic.length} characters
              </span>
            </div>
            <div className="relative">
              <textarea
                id="topic-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Federated Learning for Privacy-Preserving Collaborative Clinical Diagnostics Across Hospital Consortia..."
                rows={3}
                disabled={isGenerating}
                className="w-full px-4 py-3 bg-slate-950/90 border border-slate-700 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none shadow-inner"
              />
              {topic && (
                <button
                  type="button"
                  onClick={() => setTopic('')}
                  className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
                  title="Clear topic"
                  aria-label="Clear research topic"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Domain & Academic Level Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Domain Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="domain-select" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Research Domain <span className="text-red-400">*</span>
              </label>
              <select
                id="domain-select"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              >
                {RESEARCH_DOMAINS.map((d) => (
                  <option key={d} value={d} className="bg-slate-900 text-slate-100">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Level */}
            <div className="space-y-1.5">
              <label htmlFor="academic-level-select" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Target Academic Level
              </label>
              <select
                id="academic-level-select"
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              >
                <option value="Undergraduate">Undergraduate Thesis / Capstone</option>
                <option value="Postgraduate">Postgraduate / Master's Level</option>
                <option value="Doctoral / Ph.D.">Doctoral / Ph.D. Dissertation</option>
                <option value="Postdoc & Journal">Peer-Reviewed Journal / Conference</option>
              </select>
            </div>

            {/* Focus Angle (Optional) */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <label htmlFor="focus-angle-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Methodological Focus <span className="text-slate-500 font-normal lowercase">(optional)</span>
              </label>
              <input
                id="focus-angle-input"
                type="text"
                value={focusAngle}
                onChange={(e) => setFocusAngle(e.target.value)}
                placeholder="e.g. Asymptotic stability, empirical benchmarks..."
                disabled={isGenerating}
                className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Full 11-section publication structure with citation validation tags</span>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:via-indigo-500 hover:to-sky-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Academic Paper...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Research Paper</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Alert Banner */}
        {error && (
          <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-2xl text-red-200 text-sm flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Generation Failed</strong>
                <p className="text-xs text-red-300 mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleGeneratePaper()}
              className="px-3 py-1.5 text-xs font-semibold bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Step-by-Step Loading Animation */}
        {isGenerating && (
          <div className="p-6 bg-slate-950/80 border border-blue-500/30 rounded-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg animate-pulse">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Gemini Academic Engine Active</h4>
                  <p className="text-xs text-blue-400 font-mono mt-0.5">
                    {GENERATION_STEPS[generationStepIdx]}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Step {generationStepIdx + 1} of {GENERATION_STEPS.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 rounded-full transition-all duration-500"
                style={{
                  width: `${((generationStepIdx + 1) / GENERATION_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Generated Paper Studio */}
      {activePaper && (
        <div className="space-y-6">
          {/* Studio Header Toolbar */}
          <div className="no-print bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {activePaper.domain}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {activePaper.academicLevel}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    • {new Date(activePaper.generatedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {activePaper.title || activePaper.topic}
                </h3>
              </div>

              {/* Stats badges */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="px-3.5 py-1.5 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Word Count</div>
                  <div className="text-sm font-mono font-bold text-slate-200">
                    {activePaper.wordCount} words
                  </div>
                </div>

                <div className="px-3.5 py-1.5 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Reading Time</div>
                  <div className="text-sm font-mono font-bold text-slate-200">
                    ~{activePaper.readingTimeMinutes} min
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Export Buttons */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Export Complete Research Paper (All 11 Sections)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Instant browser download with complete structured sections, citations, and metadata.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="px-4 py-2.5 text-xs font-bold bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-sky-600/25 border border-sky-400/40 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                  aria-label="Download Research Paper as JSON (.json)"
                >
                  <Download className="w-4 h-4 text-sky-200" />
                  <span>Download Research Paper as JSON (.json)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="px-4 py-2.5 text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-indigo-600/25 border border-indigo-400/40 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                  aria-label="Download Research Paper as TXT (.txt)"
                >
                  <Download className="w-4 h-4 text-indigo-200" />
                  <span>Download Research Paper as TXT (.txt)</span>
                </button>
              </div>
            </div>

            {/* Download Success Banner */}
            {downloadSuccessMessage && (
              <div
                role="status"
                className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg shadow-emerald-950/40 animate-in fade-in"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">{downloadSuccessMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDownloadSuccessMessage(null)}
                  className="p-1 text-emerald-400 hover:text-emerald-200 rounded-lg hover:bg-emerald-900/50 transition-colors"
                  aria-label="Dismiss download message"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Secondary Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyFull}
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 transition-all flex items-center gap-1.5"
                >
                  {copiedFull ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Full Paper!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Paper</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadBibTeX}
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 transition-all flex items-center gap-1.5"
                  title="Export BibTeX citation file"
                >
                  <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Export BibTeX</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF View</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Auto-saved to Research History</span>
              </div>
            </div>
          </div>

          {/* Academic Transparency Alert Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-900/40 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-white font-semibold">
                Academic Integrity & Citation Disclosure Active:
              </strong>
              <p className="text-slate-300 leading-relaxed">
                Quantitative data in <span className="text-blue-300 font-medium">Results and Discussion</span> are marked as <span className="text-amber-300 font-mono">[Hypothetical Simulated Results - Illustrative Model Study]</span>. Citations requiring validation are tagged with <span className="text-sky-300 font-mono">[Unverified Citation - Cross-reference recommended]</span>.
              </p>
            </div>
          </div>

          {/* Studio Document Content: Sidebar Table of Contents + Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Table of Contents Sticky Column */}
            <div className="no-print hidden lg:block sticky top-20 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800 flex items-center justify-between">
                <span>Table of Contents</span>
                <span className="font-mono text-blue-400">11 Sec</span>
              </div>

              <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
                {PAPER_SECTIONS.map((sec, idx) => {
                  const isActive = activeSectionInView === sec.key;
                  const wordCount = calculateWordCount(activePaper.sections[sec.key]);
                  return (
                    <button
                      key={sec.key}
                      onClick={() => scrollToSection(sec.key)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors group ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="truncate pr-2">
                        {idx + 1}. {sec.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
                        {wordCount}w
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Main Academic Paper Sheet */}
            <div className="lg:col-span-3 space-y-6 print-paper-sheet">
              {/* Paper Title Sheet Header */}
              <div id="section-title" className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-center">
                <div className="text-xs uppercase font-mono text-blue-400 tracking-widest">
                  Academic Research Paper Draft
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug max-w-3xl mx-auto">
                  {activePaper.title || activePaper.topic}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
                  <span>Target Domain: <strong className="text-slate-200">{activePaper.domain}</strong></span>
                  <span>•</span>
                  <span>Level: <strong className="text-slate-200">{activePaper.academicLevel}</strong></span>
                  <span>•</span>
                  <span>Synthesized: <strong className="text-slate-200">{new Date(activePaper.generatedAt).toLocaleDateString()}</strong></span>
                </div>

                {activePaper.keywords && activePaper.keywords.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5">
                    {activePaper.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-lg font-mono"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* All 10 Remaining Structured Sections */}
              {PAPER_SECTIONS.filter((s) => s.key !== 'title').map((section, idx) => {
                const isEditing = editingSection === section.key;
                const content = activePaper.sections[section.key] || '';
                const wordCount = calculateWordCount(content);

                return (
                  <article
                    key={section.key}
                    id={`section-${section.key}`}
                    className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all space-y-4"
                  >
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xs font-bold font-mono">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h2 className="text-lg font-bold text-white tracking-tight">
                            {section.label}
                          </h2>
                          <p className="text-[11px] text-slate-400">{section.shortDesc}</p>
                        </div>
                      </div>

                      {/* Section Action Controls */}
                      <div className="no-print flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-mono text-slate-500 px-2">
                          {wordCount} words
                        </span>

                        <button
                          type="button"
                          onClick={() => handleCopySection(section.key)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs transition-colors"
                          title="Copy this section"
                        >
                          {copiedSectionKey === section.key ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {!isEditing ? (
                          <button
                            type="button"
                            onClick={() => startEditing(section.key)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs transition-colors"
                            title="Edit section text"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={saveEditing}
                            className="p-2 text-emerald-400 hover:bg-emerald-950/40 rounded-lg text-xs transition-colors"
                            title="Save changes"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setRegeneratingSection(section.key)}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg border border-blue-500/30 transition-all flex items-center gap-1.5"
                          title="Regenerate this section with Gemini AI"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Regenerate</span>
                        </button>
                      </div>
                    </div>

                    {/* Section Content */}
                    {isEditing ? (
                      <div className="space-y-3 pt-2">
                        <textarea
                          value={editBuffer}
                          onChange={(e) => setEditBuffer(e.target.value)}
                          rows={10}
                          className="w-full p-4 bg-slate-950 border border-blue-500/50 rounded-2xl text-sm text-slate-100 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingSection(null)}
                            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={saveEditing}
                            className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Special Callouts for Results and Discussion */}
                        {section.key === 'resultsAndDiscussion' && (
                          <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Simulation Transparency Notice:</strong> The numerical benchmarks below are designated as <em>[Hypothetical Simulated Results - Illustrative Model Study]</em>. Real empirical values require dedicated hardware execution.
                            </span>
                          </div>
                        )}

                        {/* Special Callout for References */}
                        {section.key === 'references' && analyzedRefs && analyzedRefs.unverifiedCount > 0 && (
                          <div className="p-3.5 bg-sky-950/40 border border-sky-500/30 rounded-xl flex items-start gap-2.5 text-xs text-sky-200">
                            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Citation Verification Reminder:</strong> {analyzedRefs.unverifiedCount} citations contain the <em>[Unverified Citation]</em> tag. Please cross-reference in recognized indexes (e.g., IEEE Xplore, PubMed, Google Scholar).
                            </span>
                          </div>
                        )}

                        <div className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
                          {content || (
                            <span className="text-slate-500 italic">
                              This section has not yet been populated. Click "Regenerate" to synthesize content.
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Regenerate Section Modal */}
      {regeneratingSection && activePaper && (
        <RegenerateModal
          sectionKey={regeneratingSection}
          currentContent={activePaper.sections[regeneratingSection] || ''}
          topic={activePaper.topic}
          domain={activePaper.domain}
          isLoading={isRegeneratingLoading}
          onClose={() => setRegeneratingSection(null)}
          onConfirm={handleConfirmRegenerate}
        />
      )}
    </div>
  );
};
