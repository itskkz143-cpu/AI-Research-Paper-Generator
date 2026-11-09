import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { GeneratorView } from './components/GeneratorView';
import { HistoryView } from './components/HistoryView';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';
import { ResearchPaper } from './types/paper';
import { SampleTopic } from './data/sampleTopics';
import { sanitizePaper } from './utils/paperUtils';

const STORAGE_KEY = 'ai_research_papers_history_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePaper, setActivePaper] = useState<ResearchPaper | null>(null);
  const [pendingPreset, setPendingPreset] = useState<SampleTopic | null>(null);
  const [historyPapers, setHistoryPapers] = useState<ResearchPaper[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistoryPapers(parsed.map((p) => sanitizePaper(p)));
        }
      }
    } catch (e) {
      console.warn('Failed to parse history from localStorage', e);
    }
  }, []);

  // Persist history to localStorage
  const savePapersToStorage = (papers: ResearchPaper[]) => {
    setHistoryPapers(papers);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
    } catch (e) {
      console.warn('Failed to persist history to localStorage', e);
    }
  };

  // When a new paper is generated
  const handlePaperGenerated = (newPaper: ResearchPaper) => {
    const cleanPaper = sanitizePaper(newPaper);
    setActivePaper(cleanPaper);
    // Add to history (avoid duplicates by id, place newest first)
    const updated = [cleanPaper, ...historyPapers.filter((p) => p.id !== cleanPaper.id)];
    savePapersToStorage(updated);
  };

  // When paper sections are edited or regenerated
  const handleUpdatePaper = (updatedPaper: ResearchPaper) => {
    const cleanPaper = sanitizePaper(updatedPaper);
    setActivePaper(cleanPaper);
    const updated = historyPapers.map((p) => (p.id === cleanPaper.id ? cleanPaper : p));
    savePapersToStorage(updated);
  };

  // Start generator with optional preset topic
  const handleStartGenerator = (preset?: SampleTopic) => {
    if (preset) {
      setPendingPreset(preset);
    }
    setCurrentTab('generator');
  };

  // Open existing paper in Studio
  const handleOpenPaper = (paper: ResearchPaper) => {
    setActivePaper(paper);
    setCurrentTab('generator');
  };

  // Delete paper from history
  const handleDeletePaper = (id: string) => {
    const updated = historyPapers.filter((p) => p.id !== id);
    savePapersToStorage(updated);
    if (activePaper?.id === id) {
      setActivePaper(null);
    }
  };

  // Clear all history
  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to delete all saved research papers?')) {
      savePapersToStorage([]);
      setActivePaper(null);
    }
  };

  // Start new blank paper
  const handleNewPaper = () => {
    setActivePaper(null);
    setPendingPreset(null);
    setCurrentTab('generator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          historyCount={historyPapers.length}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onNewPaper={handleNewPaper}
          />

          <main className="flex-1">
            {currentTab === 'home' && (
              <HomeView
                onStartGenerator={handleStartGenerator}
                recentPapers={historyPapers}
                onOpenPaper={handleOpenPaper}
              />
            )}

            {currentTab === 'generator' && (
              <GeneratorView
                initialPreset={pendingPreset}
                activePaper={activePaper}
                onPaperGenerated={handlePaperGenerated}
                onUpdatePaper={handleUpdatePaper}
                onClearActivePaper={() => setActivePaper(null)}
              />
            )}

            {currentTab === 'history' && (
              <HistoryView
                papers={historyPapers}
                onOpenPaper={handleOpenPaper}
                onDeletePaper={handleDeletePaper}
                onClearAll={handleClearAllHistory}
                onStartNew={handleNewPaper}
              />
            )}

            {currentTab === 'about' && <AboutView />}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
