export interface SampleTopic {
  id: string;
  topic: string;
  domain: string;
  academicLevel: 'Undergraduate' | 'Postgraduate' | 'Doctoral / Ph.D.' | 'Postdoc & Journal';
  focusAngle: string;
  badge: string;
}

export const RESEARCH_DOMAINS = [
  'Artificial Intelligence & Machine Learning',
  'Computer Science & Cybersecurity',
  'Biotechnology & Genomics',
  'Medicine & Clinical Health',
  'Renewable Energy & Sustainability',
  'Environmental Science & Ecology',
  'Quantum Computing & Physics',
  'Economics & Quantitative Finance',
  'Cognitive Neuroscience & Psychology',
  'Robotics & Autonomous Systems',
  'Data Science & Big Data Engineering',
  'Materials Science & Nanotechnology',
] as const;

export const SAMPLE_TOPICS: SampleTopic[] = [
  {
    id: 'ai-health',
    topic: 'Federated Learning Frameworks for Privacy-Preserving Collaborative Clinical Diagnostics Across Hospital Consortia',
    domain: 'Artificial Intelligence & Machine Learning',
    academicLevel: 'Postgraduate',
    focusAngle: 'Differential privacy mechanisms, Byzantine-robust model aggregation, and cross-silo healthcare compliance',
    badge: 'Popular • AI & Healthcare',
  },
  {
    id: 'solar-perovskite',
    topic: 'Interface Engineering and Degradation Mitigation in Perovskite-Silicon Tandem Photovoltaic Cells for High-Yield Renewable Grids',
    domain: 'Renewable Energy & Sustainability',
    academicLevel: 'Doctoral / Ph.D.',
    focusAngle: 'Bandgap tunability, thermal encapsulation stability, and life-cycle techno-economic assessment',
    badge: 'Clean Tech • Energy',
  },
  {
    id: 'crispr-diag',
    topic: 'Cas12a-Assisted Isothermal Nucleic Acid Amplification for Multiplexed Point-of-Care Pathogen Detection',
    domain: 'Biotechnology & Genomics',
    academicLevel: 'Postgraduate',
    focusAngle: 'Collateral cleavage kinetics, microfluidic integration, and clinical sensitivity in low-resource settings',
    badge: 'Biomedical • Genomics',
  },
  {
    id: 'quantum-sec',
    topic: 'Fault-Tolerant Quantum Key Distribution Protocols for Satellite-to-Ground Optical Communication Networks',
    domain: 'Quantum Computing & Physics',
    academicLevel: 'Doctoral / Ph.D.',
    focusAngle: 'Atmospheric turbulence decoherence, decoy-state protocols, and space-grade photon detector architectures',
    badge: 'Quantum • Physics',
  },
  {
    id: 'microplastics',
    topic: 'Enzymatic Biodegradation of Marine Microplastics Using Synthetic Microbial Consortia and Bioreactor Optimization',
    domain: 'Environmental Science & Ecology',
    academicLevel: 'Postgraduate',
    focusAngle: 'Polyethylene terephthalate (PETase) enzymatic turnover, metabolic flux modeling, and ecosystem safety',
    badge: 'Ecology • Sustainability',
  },
  {
    id: 'defi-risk',
    topic: 'Systemic Liquidity Contagion and Automated Market Maker Dynamics in Decentralized Lending Protocols',
    domain: 'Economics & Quantitative Finance',
    academicLevel: 'Postgraduate',
    focusAngle: 'Constant-product invariant deviations, flash loan arbitrage vulnerabilities, and stress-testing liquidity reserves',
    badge: 'Finance • Blockchain',
  },
];
