export type PaperSectionKey =
  | 'title'
  | 'abstract'
  | 'introduction'
  | 'problemStatement'
  | 'researchObjectives'
  | 'literatureReview'
  | 'methodology'
  | 'resultsAndDiscussion'
  | 'conclusion'
  | 'futureScope'
  | 'references';

export interface SectionMeta {
  key: PaperSectionKey;
  label: string;
  shortDesc: string;
  iconName: string;
}

export const PAPER_SECTIONS: SectionMeta[] = [
  { key: 'title', label: 'Research Paper Title', shortDesc: 'Authoritative scholarly title reflecting scope and methodology', iconName: 'Heading' },
  { key: 'abstract', label: 'Abstract & Keywords', shortDesc: 'Concise summary of background, methods, findings, and contributions', iconName: 'FileText' },
  { key: 'introduction', label: 'Introduction', shortDesc: 'Contextual background, significance, and conceptual framework', iconName: 'BookOpen' },
  { key: 'problemStatement', label: 'Problem Statement', shortDesc: 'Critical research gap, friction point, or unsolved research question', iconName: 'AlertCircle' },
  { key: 'researchObjectives', label: 'Research Objectives', shortDesc: 'Specific, measurable primary and secondary investigation goals', iconName: 'Target' },
  { key: 'literatureReview', label: 'Literature Review', shortDesc: 'Critical synthesis of foundational studies, benchmarks, and theories', iconName: 'Library' },
  { key: 'methodology', label: 'Research Methodology', shortDesc: 'Experimental setup, mathematical models, data pipelines, and validation', iconName: 'Cpu' },
  { key: 'resultsAndDiscussion', label: 'Results and Discussion', shortDesc: 'Hypothetical / simulated metrics, comparative analysis, and interpretation', iconName: 'BarChart3' },
  { key: 'conclusion', label: 'Conclusion', shortDesc: 'Summary of answers to research questions and validated takeaways', iconName: 'CheckCircle2' },
  { key: 'futureScope', label: 'Future Scope', shortDesc: 'Emerging directions, scalability hurdles, and subsequent research phases', iconName: 'Compass' },
  { key: 'references', label: 'References', shortDesc: 'Scholarly citations formatted in standard academic conventions', iconName: 'Bookmark' },
];

export interface ResearchPaper {
  id: string;
  topic: string;
  domain: string;
  academicLevel: string;
  title: string;
  sections: Record<PaperSectionKey, string>;
  keywords: string[];
  generatedAt: string;
  wordCount: number;
  readingTimeMinutes: number;
  citationVerificationNotices: string[];
  hasHypotheticalResults: boolean;
  starred?: boolean;
}

export interface GeneratePaperRequest {
  topic: string;
  domain: string;
  academicLevel?: string;
  focusAngle?: string;
}

export interface RegenerateSectionRequest {
  topic: string;
  domain: string;
  sectionKey: PaperSectionKey;
  currentContent?: string;
  instructions?: string;
  fullContext?: {
    title?: string;
    abstract?: string;
    problemStatement?: string;
  };
}

export interface RegenerateSectionResponse {
  sectionKey: PaperSectionKey;
  content: string;
  notices?: string[];
}
