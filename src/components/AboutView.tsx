import React from 'react';
import {
  ShieldCheck,
  Scale,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Cpu,
  GraduationCap,
} from 'lucide-react';
import { PAPER_SECTIONS } from '../types/paper';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 px-4 sm:px-6">
      {/* Title */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Academic Integrity & Platform Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About AI Research Paper Generator
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          An AI-powered academic assistant engineered to assist scholars, students, and researchers in conceptualizing, structuring, and drafting rigorous research paper frameworks.
        </p>
      </div>

      {/* Core Ethics Charter */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-blue-900/40 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 text-blue-400">
          <Scale className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Responsible AI & Academic Integrity Charter
          </h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Academic synthesis powered by large language models must uphold rigorous scholarly ethics. To combat AI hallucination, misinformation, and citation fabrication, this application enforces the following hard rules:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Hypothetical Results Identification</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI models must never invent false empirical trials or fabricate real laboratory data. All quantitative findings in the <strong className="text-slate-200">Results and Discussion</strong> section are explicitly tagged with <span className="text-amber-300 font-mono text-[11px]">[Hypothetical Simulated Results - Illustrative Model Study]</span>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Unverified Citation Tagging</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              While seminal landmark works (e.g. Turing 1950, Vaswani 2017) are preserved accurately, newly formulated or synthetic citations are explicitly labeled with <span className="text-sky-300 font-mono text-[11px]">[Unverified Citation - Cross-reference recommended]</span> to ensure researchers verify entries in official index registries.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Verification Workflow for Students */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Recommended Academic Verification Workflow
        </h3>
        <p className="text-xs text-slate-400">
          When using this assistant to produce research papers or grant proposals, follow these standard steps:
        </p>

        <ol className="space-y-3 text-xs text-slate-300">
          <li className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono shrink-0">1</span>
            <div>
              <strong className="text-white">Review & Refine Objectives:</strong> Align the generated Problem Statement and Research Objectives with your specific departmental or institutional guidelines.
            </div>
          </li>
          <li className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono shrink-0">2</span>
            <div>
              <strong className="text-white">Cross-Check Literature on Scholarly Databases:</strong> Query Google Scholar, PubMed, IEEE Xplore, or arXiv to locate peer-reviewed papers corroborating the synthesized literature review.
            </div>
          </li>
          <li className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono shrink-0">3</span>
            <div>
              <strong className="text-white">Replace Simulated Metrics with Empirical Data:</strong> Conduct your physical experiments, simulations, or observational cohorts to replace hypothetical model data with your real findings.
            </div>
          </li>
          <li className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono shrink-0">4</span>
            <div>
              <strong className="text-white">Regenerate or Edit Sections:</strong> Use the built-in section regeneration tool to iterate on methodology or future directions with targeted prompts.
            </div>
          </li>
        </ol>
      </div>

      {/* 11 Section Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          The 11 Supported Sections
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PAPER_SECTIONS.map((sec, idx) => (
            <div key={sec.key} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <span className="text-blue-400 font-mono text-[11px]">{String(idx + 1).padStart(2, '0')}.</span>
                <span>{sec.label}</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{sec.shortDesc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span>Technology & Architecture</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Built as a full-stack web application with React 19, TypeScript, and Tailwind CSS on the frontend, served by an Express / Node.js backend. All AI reasoning and text generation calls execute securely server-side through the official <code className="text-blue-300 font-mono">@google/genai</code> SDK using the <strong className="text-white">Gemini 3.8 Flash</strong> foundation model.
        </p>
      </div>
    </div>
  );
};
