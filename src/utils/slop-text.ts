const SLOP_PHRASES = [
  "In today's digital landscape, synergies are the cornerstone of innovation.",
  "Leverage your paradigm shift to maximize stakeholder engagement.",
  "This game-changing solution disrupts the way we think about disruption.",
  "Our AI-powered blockchain cloud ecosystem delivers unprecedented ROI.",
  "Unlock seamless integration across your omnichannel touchpoints.",
  "The future of work is here, and it's powered by quantum machine learning.",
  "Revolutionize your workflow with next-gen hyper-automation frameworks.",
  "Empowering users through decentralized edge computing paradigms.",
  "Transform your data-driven insights into actionable intelligence pipelines.",
  "Scale infinitely with our zero-downtime microservices architecture.",
  "At the end of the day, it's all about moving the needle on your KPIs.",
  "We're not just building products, we're crafting immersive experiences.",
  "Our proprietary algorithm leverages neural pathways to optimize engagement.",
  "Disrupt the status quo with thought-leading content strategies.",
  "Harness the power of big data analytics for sustainable growth hacking.",
  "The metaverse is not just a buzzword, it's a lifestyle transformation.",
  "Pivot your core competencies to align with emerging market dynamics.",
  "Unlock exponential growth through cross-functional team synergies.",
  "Our cloud-native approach ensures seamless digital transformation.",
  "Drive meaningful impact with data-informed decision intelligence.",
  "Let's circle back and align on the low-hanging fruit.",
  "This is a total game changer for the creator economy ecosystem.",
  "Web3 is revolutionizing how we think about thinking about things.",
  "Our NFT marketplace for corporate synergy tokens is just the beginning.",
  "The paradigm has shifted and there's no going back to the old paradigm.",
  "Innovate. Disrupt. Synergize. Repeat. That's our motto.",
  "Our 10x engineers deliver 10x results with 10x the buzzwords.",
  "We're democratizing AI one buzzword at a time.",
  "This startup is literally Uber for AI-generated LinkedIn posts.",
  "The real treasure was the data we monetized along the way.",
];

const CONNECTORS = [
  "Furthermore, ",
  "Moreover, ",
  "In addition, ",
  "It's worth noting that ",
  "Critically, ",
  "At the intersection of innovation and synergy, ",
  "According to our thought leaders, ",
  "Research suggests that ",
  "Industry experts agree that ",
  "Breaking news: ",
  "You won't believe this, but ",
  "In an unprecedented move, ",
  "Sources confirm that ",
  "Let that sink in: ",
  "Here's the thing — ",
];

export function generateSlop(paragraphs = 3): string {
  const result: string[] = [];

  for (let p = 0; p < paragraphs; p++) {
    const sentenceCount = 3 + Math.floor(Math.random() * 4);
    const sentences: string[] = [];

    for (let s = 0; s < sentenceCount; s++) {
      const connector = Math.random() > 0.5 ? CONNECTORS[Math.floor(Math.random() * CONNECTORS.length)] : "";
      const phrase = SLOP_PHRASES[Math.floor(Math.random() * SLOP_PHRASES.length)];
      sentences.push(connector + phrase);
    }

    result.push(sentences.join(" "));
  }

  return result.join("\n\n");
}

export function generateSlopTitle(): string {
  const templates = [
    "Why {} is the Future of {}",
    "{} Just Changed Everything About {}",
    "The Ultimate Guide to {} in {}",
    "How {} Will Disrupt {} Forever",
    "10 Ways {} is Revolutionizing {}",
    "{} Meets {}: A Match Made in Silicon Valley",
    "You're Doing {} Wrong (Here's How {} Fixes It)",
    "The Hidden Power of {} in the Age of {}",
  ];

  const nouns = [
    "AI",
    "Blockchain",
    "Web3",
    "Machine Learning",
    "Cloud Computing",
    "The Metaverse",
    "Quantum Computing",
    "NFTs",
    "Edge Computing",
    "Digital Transformation",
    "ChatGPT",
    "Zero Trust",
    "DevOps",
    "Microservices",
    "Big Data",
    "5G",
    "IoT",
    "AR/VR",
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  const n1 = nouns[Math.floor(Math.random() * nouns.length)];
  const n2 = nouns[Math.floor(Math.random() * nouns.length)];

  return template.replace("{}", n1).replace("{}", n2);
}
