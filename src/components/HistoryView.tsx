import React, { useState } from 'react';
import {
  History,
  Search,
  Trash2,
  ExternalLink,
  Download,
  Copy,
  Check,
  FileText,
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ResearchPaper } from '../types/paper';
import { formatAsText, formatAsJson } from '../utils/paperUtils';

interface HistoryViewProps {
  papers: ResearchPaper[];
  onOpenPaper: (paper: ResearchPaper) => void;
  onDeletePaper: (id: string) => void;
  onClearAll: () => void;
  onStartNew: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  papers,
  onOpenPaper,
  onDeletePaper,
  onClearAll,
  onStartNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPapers = papers.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.topic && p.topic.toLowerCase().includes(q)) ||
      (p.domain && p.domain.toLowerCase().includes(q))
    );
  });

  const handleCopy = (paper: ResearchPaper) => {
    const text = formatAsText(paper);
    navigator.clipboard.writeText(text);
    setCopiedId(paper.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = (paper: ResearchPaper) => {
    const text = formatAsText(paper);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(paper.title || paper.topic).slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_Paper.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = (paper: ResearchPaper) => {
    const json = formatAsJson(paper);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(paper.title || paper.topic).slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_Paper.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <History className="w-7 h-7 text-blue-400" />
            Research History & Archives
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Access, export, and continue editing previously generated academic research papers
          </p>
        </div>

        <div className="flex items-center gap-3">
          {papers.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-3.5 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-500/30 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
          )}

          <button
            onClick={onStartNew}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate New Paper</span>
          </button>
        </div>
      </div>

      {/* Search & Counter Bar */}
      {papers.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, paper title, or domain..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing {filteredPapers.length} of {papers.length} archived papers
          </div>
        </div>
      )}

      {/* Papers Grid */}
      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {paper.domain}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(paper.generatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                  {paper.title || paper.topic}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {paper.sections.abstract || paper.sections.introduction || 'Academic research paper'}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {paper.keywords?.slice(0, 4).map((kw, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md font-mono"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(paper)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs transition-colors"
                    title="Copy Full Paper"
                  >
                    {copiedId === paper.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadTxt(paper)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs transition-colors"
                    title="Download as TXT"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDownloadJson(paper)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-mono"
                    title="Download as JSON"
                  >
                    <span className="text-[10px] font-bold">JSON</span>
                  </button>

                  <button
                    onClick={() => onDeletePaper(paper.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg text-xs transition-colors"
                    title="Delete Paper"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => onOpenPaper(paper)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg border border-blue-500/30 transition-all flex items-center gap-1.5"
                >
                  <span>Open in Studio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-slate-800/80 max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Research Papers Archived</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No papers match your search query "${searchQuery}".`
              : 'Generate your first structured academic research paper to see it saved in your research history.'}
          </p>
          <button
            onClick={onStartNew}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate First Paper</span>
          </button>
        </div>
      )}
    </div>
  );
};
