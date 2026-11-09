import React from 'react';
import { GraduationCap, ShieldCheck, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="no-print mt-auto border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-8 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-300">AI Research Paper Generator</span>
          <span>•</span>
          <span>Academic Studio Edition</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ethical AI Guardrails</span>
          </span>
          <span>•</span>
          <span>Powered by Gemini 3.8 Flash</span>
          <span>•</span>
          <span>Node.js + React</span>
        </div>
      </div>
    </footer>
  );
};
