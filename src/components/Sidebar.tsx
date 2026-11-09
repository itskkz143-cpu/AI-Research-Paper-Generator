import React from 'react';
import {
  Home,
  FileSpreadsheet,
  History,
  Info,
  BookOpen,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

export type NavTab = 'home' | 'generator' | 'history' | 'about';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  historyCount,
}) => {
  const navItems: Array<{
    id: NavTab;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }> = [
    {
      id: 'home',
      label: 'Home',
      sublabel: 'Dashboard & Overview',
      icon: Home,
    },
    {
      id: 'generator',
      label: 'Generate Paper',
      sublabel: 'Interactive Paper Studio',
      icon: FileSpreadsheet,
      badge: '11 Sections',
    },
    {
      id: 'history',
      label: 'Research History',
      sublabel: 'Saved Papers & Archives',
      icon: History,
      badge: historyCount > 0 ? historyCount : undefined,
    },
    {
      id: 'about',
      label: 'About & Ethics',
      sublabel: 'Methodology & Guidelines',
      icon: Info,
    },
  ];

  const handleSelect = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                PaperGen <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">AI</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Research Paper Generator</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Academic Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/25 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-wide">{item.label}</div>
                    <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-slate-800 text-blue-400 border border-slate-700/80'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'opacity-100 translate-x-0.5 text-white' : 'opacity-0 group-hover:opacity-70 text-slate-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Academic Ethics Badge in Sidebar Footer */}
        <div className="p-4 m-4 rounded-xl bg-slate-950/70 border border-slate-800/90 text-xs">
          <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Ethical AI Synthesis</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            All simulated results and citations are explicitly flagged to preserve academic integrity.
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Powered by Gemini 3.8</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Ready" />
          </div>
        </div>
      </aside>
    </>
  );
};
