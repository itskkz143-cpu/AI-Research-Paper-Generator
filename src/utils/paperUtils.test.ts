import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWordCount,
  estimateReadingTime,
  calculateTotalPaperWords,
  formatAsText,
  formatAsJson,
  formatAsBibTeX,
  analyzeReferences,
  sanitizePaper,
} from './paperUtils';
import { ResearchPaper } from '../types/paper';

test('calculateWordCount calculates word count accurately', () => {
  assert.equal(calculateWordCount(''), 0);
  assert.equal(calculateWordCount('   '), 0);
  assert.equal(calculateWordCount('Hello world'), 2);
  assert.equal(calculateWordCount('Deep  learning  for  natural  language  processing'), 6);
});

test('estimateReadingTime calculates minutes based on 180 wpm', () => {
  assert.equal(estimateReadingTime(0), 0);
  assert.equal(estimateReadingTime(100), 1);
  assert.equal(estimateReadingTime(180), 1);
  assert.equal(estimateReadingTime(360), 2);
  assert.equal(estimateReadingTime(500), 3);
});

test('calculateTotalPaperWords aggregates across all sections', () => {
  const partial = {
    sections: {
      title: 'Neural Networks In Medicine',
      abstract: 'This paper studies neural architectures.',
      introduction: 'Introduction to clinical deep learning models.',
      problemStatement: 'Problem statement regarding data scarcity.',
      researchObjectives: 'Objective one and two.',
      literatureReview: 'Prior work by Smith et al.',
      methodology: 'Data pipeline and training procedures.',
      resultsAndDiscussion: 'Simulated accuracy reached ninety five percent.',
      conclusion: 'Conclusion summary points.',
      futureScope: 'Future extensions in clinical trials.',
      references: '[1] Smith et al. 2024.',
    },
  };
  const total = calculateTotalPaperWords(partial as any);
  assert.ok(total > 30);
});

test('formatAsText and formatAsJson export cleanly', () => {
  const paper = sanitizePaper({
    title: 'Quantum Key Distribution in Low Earth Orbit',
    topic: 'Quantum Satellite Networks',
    domain: 'Computer Science',
    sections: {
      title: 'Quantum Key Distribution in Low Earth Orbit',
      abstract: 'Abstract content goes here.',
      introduction: 'Intro content goes here.',
      problemStatement: 'Problem statement goes here.',
      researchObjectives: 'Objectives go here.',
      literatureReview: 'Review goes here.',
      methodology: 'Methodology goes here.',
      resultsAndDiscussion: 'Results go here.',
      conclusion: 'Conclusion goes here.',
      futureScope: 'Future scope goes here.',
      references: '[1] Bennett & Brassard (1984) [Unverified Citation - Cross-reference recommended]',
    },
  });

  const txt = formatAsText(paper);
  assert.ok(txt.includes('QUANTUM KEY DISTRIBUTION IN LOW EARTH ORBIT'));
  assert.ok(txt.includes('LITERATURE REVIEW'));
  assert.ok(txt.includes('METHODOLOGY'));
  assert.ok(txt.includes('REFERENCES'));

  const json = formatAsJson(paper);
  const parsed = JSON.parse(json) as ResearchPaper;
  assert.equal(parsed.title, paper.title);
  assert.equal(parsed.domain, 'Computer Science');
});

test('formatAsBibTeX contains required citation elements', () => {
  const paper = sanitizePaper({
    title: 'Reinforcement Learning in Robotics',
    topic: 'Robotics',
    domain: 'Artificial Intelligence',
  });
  const bib = formatAsBibTeX(paper);
  assert.ok(bib.startsWith('@article{'));
  assert.ok(bib.includes('Reinforcement Learning in Robotics'));
  assert.ok(bib.includes('Artificial Intelligence'));
});

test('analyzeReferences correctly flags unverified citations', () => {
  const refText = `
[1] Turing, A. M. (1950). Computing Machinery and Intelligence.
[2] Doe, J. (2025). Novel Generative Pipeline. [Unverified Citation - Cross-reference recommended]
[3] Smith, K. (2024). Hypothetical Simulated Results in Edge Devices.
  `;
  const result = analyzeReferences(refText);
  assert.equal(result.total, 3);
  assert.equal(result.unverifiedCount, 2);
});

test('sanitizePaper populates missing fields and computes stats', () => {
  const paper = sanitizePaper({
    topic: 'CRISPR Gene Editing',
    domain: 'Biotechnology',
  });
  assert.ok(paper.id.startsWith('paper-'));
  assert.equal(paper.topic, 'CRISPR Gene Editing');
  assert.equal(paper.domain, 'Biotechnology');
  assert.ok(paper.sections.abstract !== undefined);
  assert.ok(paper.sections.conclusion !== undefined);
  assert.ok(paper.wordCount >= 0);
  assert.ok(paper.readingTimeMinutes >= 0);
});
