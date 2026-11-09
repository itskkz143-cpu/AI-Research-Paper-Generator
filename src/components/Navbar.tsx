import React from 'react';
import { Menu, GraduationCap, Sparkles, PlusCircle } from 'lucide-react';
import { NavTab } from './Sidebar';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMobileMenu: () => void;
  onNewPaper: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
  onNewPaper,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'home':
        return 'Overview & Dashboard';
      case 'generator':
        return 'Research Paper Studio';
      case 'history':
        return 'Research History & Archives';
      case 'about':
        return 'About & Academic Integrity';
      default:
        return 'Research Paper Generator';
    }
  };

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-400 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white tracking-tight">{getTabTitle()}</span>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
              Full-Stack Node + React
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentTab !== 'generator' && (
          <button
            onClick={() => onSelectTab('generator')}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Research Paper</span>
            <span className="sm:hidden">New</span>
          </button>
        )}

        <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="hidden sm:inline">Gemini API Ready</span>
        </div>
      </div>
    </header>
  );
};
