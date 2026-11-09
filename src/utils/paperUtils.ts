import { ResearchPaper, PaperSectionKey, PAPER_SECTIONS } from '../types/paper';

/**
 * Calculates word count for a string safely
 */
export function calculateWordCount(text?: string): number {
  if (!text || typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Calculates total word count across all sections
 */
export function calculateTotalPaperWords(paper: Partial<ResearchPaper>): number {
  if (!paper.sections) return 0;
  let total = 0;
  for (const key of Object.keys(paper.sections) as PaperSectionKey[]) {
    total += calculateWordCount(paper.sections[key]);
  }
  return total;
}

/**
 * Estimates reading time based on typical academic reading speed (180 words/min)
 */
export function estimateReadingTime(wordCount: number): number {
  if (wordCount <= 0) return 0;
  return Math.max(1, Math.ceil(wordCount / 180));
}

/**
 * Formats full research paper into cleanly formatted TXT with academic styling
 */
export function formatAsText(paper: ResearchPaper): string {
  const lineSeparator = '='.repeat(80);
  const subSeparator = '-'.repeat(80);

  const lines: string[] = [
    lineSeparator,
    (paper.title || paper.topic || 'RESEARCH PAPER').toUpperCase(),
    lineSeparator,
    `Domain: ${paper.domain}`,
    `Academic Target: ${paper.academicLevel || 'Standard Peer-Review'}`,
    `Generated Date: ${new Date(paper.generatedAt).toLocaleString()}`,
    `Word Count: ${paper.wordCount} words (~${paper.readingTimeMinutes} min read)`,
    `Keywords: ${paper.keywords?.join(', ') || 'N/A'}`,
    '',
    '[ACADEMIC CITATION & SIMULATION DISCLOSURE]',
    '• Hypothetical / simulated experiments have been flagged where empirical ground data was unverified.',
    '• References should be validated via recognized academic indexing services (e.g., IEEE Xplore, PubMed, Google Scholar).',
    lineSeparator,
    '',
  ];

  let sectionIndex = 1;
  for (const section of PAPER_SECTIONS) {
    lines.push('');
    lines.push(`SECTION ${sectionIndex}: ${section.label.toUpperCase()}`);
    lines.push(subSeparator);
    const sectionContent =
      section.key === 'title'
        ? (paper.sections.title || paper.title || paper.topic)
        : (paper.sections[section.key] || '[Section not generated]');
    lines.push(sectionContent);
    lines.push('');
    sectionIndex++;
  }

  return lines.join('\n');
}

/**
 * Formats full research paper into structured JSON
 */
export function formatAsJson(paper: ResearchPaper): string {
  return JSON.stringify(paper, null, 2);
}

/**
 * Generates an estimated BibTeX entry for this research paper
 */
export function formatAsBibTeX(paper: ResearchPaper): string {
  const cleanId = (paper.topic || 'paper')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 20);
  const year = new Date(paper.generatedAt || Date.now()).getFullYear();

  return `@article{${cleanId}_${year},
  title = {${paper.title || paper.topic}},
  author = {AI Research Assistant and Contributors},
  journal = {AI Research Paper Generator Working Papers},
  year = {${year}},
  note = {Domain: ${paper.domain}. Generated with ethical AI synthesis. Verified for academic citation transparency.}
}`;
}

/**
 * Extracts citations or flags from references text
 */
export function analyzeReferences(refText?: string): {
  total: number;
  unverifiedCount: number;
  items: Array<{ text: string; isUnverified: boolean }>;
} {
  if (!refText) {
    return { total: 0, unverifiedCount: 0, items: [] };
  }

  const rawLines = refText
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 5 && (/^(\[\d+\]|\d+\.|\*|-)/.test(l) || l.includes('(') || l.includes('http')));

  const items = rawLines.map((line) => {
    const isUnverified =
      line.toLowerCase().includes('unverified') ||
      line.toLowerCase().includes('hypothetical') ||
      line.toLowerCase().includes('cross-reference');
    return { text: line, isUnverified };
  });

  return {
    total: items.length,
    unverifiedCount: items.filter((i) => i.isUnverified).length,
    items,
  };
}

/**
 * Ensures complete structure and defaults for a ResearchPaper object
 */
export function sanitizePaper(raw: Partial<ResearchPaper>): ResearchPaper {
  const defaultSections: Record<PaperSectionKey, string> = {
    title: raw.title || raw.topic || 'Untitled Research Study',
    abstract: '',
    introduction: '',
    problemStatement: '',
    researchObjectives: '',
    literatureReview: '',
    methodology: '',
    resultsAndDiscussion: '',
    conclusion: '',
    futureScope: '',
    references: '',
  };

  const sections = {
    ...defaultSections,
    ...(raw.sections || {}),
  };

  const words = calculateTotalPaperWords({ sections });
  const readingTime = estimateReadingTime(words);

  return {
    id: raw.id || `paper-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    topic: raw.topic || 'Untitled Research Topic',
    domain: raw.domain || 'Computer Science',
    academicLevel: raw.academicLevel || 'Postgraduate',
    title: raw.title || sections.title || raw.topic || 'Untitled Research Study',
    sections,
    keywords: Array.isArray(raw.keywords) && raw.keywords.length ? raw.keywords : ['research', 'methodology', 'analysis'],
    generatedAt: raw.generatedAt || new Date().toISOString(),
    wordCount: raw.wordCount || words,
    readingTimeMinutes: raw.readingTimeMinutes || readingTime,
    citationVerificationNotices: Array.isArray(raw.citationVerificationNotices)
      ? raw.citationVerificationNotices
      : ['Please cross-reference all citations against peer-reviewed bibliographic registries.'],
    hasHypotheticalResults: raw.hasHypotheticalResults !== undefined ? raw.hasHypotheticalResults : true,
    starred: Boolean(raw.starred),
  };
}
