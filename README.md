# AI Research Paper Generator & Academic Studio

A modern, full-stack web application designed to help students, scholars, and researchers synthesize structured, publication-grade academic research papers from any research topic using Gemini 3.8 Flash.

---

## 🌟 Key Features

### 1. Topic & Domain Scoping
- **Flexible Topic Input**: Enter complex interdisciplinary research inquiries with optional focus angles.
- **Domain Selection**: 12 pre-configured scholarly domains including Artificial Intelligence, Biotechnology, Quantum Computing, Renewable Energy, Medicine, and Economics.
- **Academic Target Levels**: Tailor synthesis for Undergraduate Capstones, Master's Theses, Doctoral Dissertations, or Peer-Reviewed Journal Articles.
- **1-Click Demonstration Topics**: Pre-loaded curated topics across major scientific domains.

### 2. Publication-Structured 11 Sections
Generates a complete, standard academic paper:
1. **Research Paper Title**: Scholarly and methodology-oriented scoping.
2. **Abstract & Keywords**: Comprehensive summary of background, methods, metrics, and takeaways.
3. **Introduction**: Conceptual framework and academic significance.
4. **Problem Statement**: Specific bottlenecks and unresolved research questions.
5. **Research Objectives**: Primary and secondary testable targets.
6. **Literature Review**: Critical taxonomy of seminal foundational works and current state-of-the-art.
7. **Research Methodology**: Formulations, mathematical models, experimental pipelines, and testbed configurations.
8. **Results and Discussion**: Comparative benchmarking with strict simulated evaluation transparency.
9. **Conclusion**: Validated answers to research inquiries.
10. **Future Scope**: Scalability challenges, translational hurdles, and subsequent research phases.
11. **References**: Formatted citations adhering to standard academic conventions.

### 3. Academic Integrity & Ethics Guardrails
- **Hypothetical Results Identification**: Empirical metrics are explicitly marked as `[Hypothetical Simulated Results - Illustrative Model Study]`.
- **Unverified Citation Tagging**: References that require manual validation are annotated with `[Unverified Citation - Cross-reference recommended]`.
- **Ethics Charter & Verification Workflow**: Built-in guidance for validating generated literature in IEEE Xplore, PubMed, Google Scholar, and arXiv.

### 4. Interactive Paper Studio
- **Regenerate Individual Sections**: Modify any specific section with custom prompting instructions without re-running the entire paper.
- **Inline Editing**: Live editable text areas for all sections with direct save.
- **Document Statistics**: Live word counts and estimated reading time calculations.
- **Sticky Table of Contents**: Seamless jumping between sections.

### 5. Multi-Format Academic Exports
- **Download as TXT**: Cleanly structured plain-text document.
- **Download as JSON**: Machine-readable full data structure with section keys and metadata.
- **Export BibTeX (`.bib`)**: Ready-to-import citation entries for LaTeX/Overleaf.
- **Copy Full Paper / Individual Sections**: Instant clipboard actions.
- **Print / PDF View**: Clean, distraction-free stylesheet for physical printing or saving as PDF.

### 6. Research History & Archive
- Automatically archives generated papers in browser local storage.
- Search and filter by topic or domain.
- 1-click reload back into the interactive studio.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React icons.
- **Backend**: Node.js, Express, TSX.
- **AI Engine**: Google Gemini API via `@google/genai` SDK (`gemini-3.8-flash`).
- **Security**: The Gemini API key remains strictly server-side in `server.ts` and is never exposed to the client.

---

## 🚀 Setup & Execution

### Prerequisites
- Node.js (v18+)
- npm or bun

### Environment Variables
Copy `.env.example` to `.env`:
```bash
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### Installation
```bash
npm install
```

### Development
Start the unified full-stack server (runs Express with Vite dev middleware on port 3000):
```bash
npm run dev
```

### Unit Tests
Verify pure business logic (word count, reading time, BibTeX formatting, reference analysis, sanitization):
```bash
npx --yes tsx --test src/utils/paperUtils.test.ts
```

### Production Build
```bash
npm run build
npm start
```
