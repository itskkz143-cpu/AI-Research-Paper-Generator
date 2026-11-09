import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  RefreshCw,
  Download,
  BookOpen,
  Cpu,
  Layers,
  GraduationCap,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import { SAMPLE_TOPICS, RESEARCH_DOMAINS, SampleTopic } from '../data/sampleTopics';
import { ResearchPaper } from '../types/paper';

interface HomeViewProps {
  onStartGenerator: (preset?: SampleTopic) => void;
  recentPapers: ResearchPaper[];
  onOpenPaper: (paper: ResearchPaper) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartGenerator,
  recentPapers,
  onOpenPaper,
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 py-6 px-4 sm:px-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Empowering Academic Research & Scholarship</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            AI Research Paper <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Generator & Assistant
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Synthesize publication-structured academic research papers across 11 standard sections using Gemini 3.8 Flash. Built with rigorous academic integrity guardrails: clear distinction of hypothetical results and explicit unverified citation flagging.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onStartGenerator()}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Paper Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onStartGenerator(SAMPLE_TOPICS[0])}
              className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-medium text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Try Sample Topic (Healthcare AI)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Academic Integrity Highlight Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30 shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Academic Rigor & Responsible AI Policy
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              We do not fabricate experimental data. All model benchmarks are designated as{' '}
              <span className="text-amber-300 font-mono">[Hypothetical Simulated Results]</span> and references outside recognized indexes are marked as{' '}
              <span className="text-sky-300 font-mono">[Unverified Citation]</span> for cross-referencing.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Peer-Review Aligned</span>
        </div>
      </div>

      {/* 11 Academic Sections Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Comprehensive 11-Section Synthesis
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Every paper is generated into a complete, scholarly peer-review structure
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { num: '01', title: 'Paper Title', desc: 'Authoritative, precise topic scoping' },
            { num: '02', title: 'Abstract & Keywords', desc: 'Summary of background, aims & takeaways' },
            { num: '03', title: 'Introduction', desc: 'Domain context & conceptual foundations' },
            { num: '04', title: 'Problem Statement', desc: 'Specific research gap or bottleneck' },
            { num: '05', title: 'Research Objectives', desc: 'Primary and secondary investigation goals' },
            { num: '06', title: 'Literature Review', desc: 'Taxonomy of seminal & recent prior art' },
            { num: '07', title: 'Methodology', desc: 'Formulations, pipelines & testbeds' },
            { num: '08', title: 'Results & Discussion', desc: 'Hypothetical simulated metrics & analysis' },
            { num: '09', title: 'Conclusion', desc: 'Validated answers to research inquiries' },
            { num: '10', title: 'Future Scope', desc: 'Translational avenues & open problems' },
            { num: '11', title: 'References', desc: 'Scholarly citations with verification tags' },
            { num: '12', title: 'Regenerate Any Section', desc: 'Tailor individual sections with custom prompts', highlight: true },
          ].map((sec) => (
            <div
              key={sec.num}
              className={`p-4 rounded-xl border transition-all ${
                sec.highlight
                  ? 'bg-blue-950/40 border-blue-500/40 text-blue-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-slate-400">{sec.num}</span>
                {sec.highlight && <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
              </div>
              <h3 className="text-sm font-bold text-white">{sec.title}</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">{sec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Topics for Demonstration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Sample Topics for Demonstration
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any pre-configured research topic to instantly explore the generation studio
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_TOPICS.map((sample) => (
            <div
              key={sample.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {sample.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {sample.academicLevel}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug group-hover:text-blue-300 transition-colors">
                  {sample.topic}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  Focus: {sample.focusAngle}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">{sample.domain}</span>
                <button
                  onClick={() => onStartGenerator(sample)}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg border border-blue-500/30 transition-all flex items-center gap-1.5"
                >
                  <span>Use Topic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Papers Preview (if any) */}
      {recentPapers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            Recent Research Papers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPapers.slice(0, 3).map((paper) => (
              <div
                key={paper.id}
                onClick={() => onOpenPaper(paper)}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{paper.domain}</span>
                  <span>{new Date(paper.generatedAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-2 hover:text-blue-400 transition-colors">
                  {paper.title || paper.topic}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>{paper.wordCount} words</span>
                  <span className="text-blue-400 flex items-center gap-1 font-medium">
                    Open in Studio <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
