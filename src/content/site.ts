/*
 * Every word on the site, taken verbatim from docs/copy.md.
 * Text in [square brackets] is a placeholder for something Mehdi has not supplied
 * yet (docs/open-items.md). Keep it visible; never replace it with an invented value.
 *
 * Headings are stored without their final full stop: the components add it as a
 * separate tangerine span.
 */

export interface Frontier {
  name: string;
  scope: string;
}

export interface LensStage {
  /** Two lines, as set on the curve. */
  lines: [string, string];
}

export interface Question {
  question: string;
  description: string;
}

export interface Platform {
  name: string;
  /** The show's real page on this platform. Empty until supplied: the pill is left out. */
  url: string;
}

export const site = {
  /** Canonical address. Vercel redirects the bare domain here, so every URL we publish uses www. */
  url: 'https://www.lifeatthefrontier.com',
  name: 'Life at the Frontier',
  shortName: 'LATF',
  lang: 'en',

  meta: {
    title: 'Life at the Frontier: a podcast from the frontiers of science and technology',
    description:
      'A podcast from the frontiers of science and technology, with the people who spend their lives there. Hosted by Mehdi Nayebi.',
    ogTitle: 'Life at the Frontier',
    ogDescription:
      'A podcast from the frontiers of science and technology, with the people who spend their lives there.',
    ogImage: '/share-image-1200x630.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    themeColor: '#1C3D7A',
    /** X account, for share cards. */
    xHandle: '@lifeatfrontier',
  },

  skipLink: 'Skip to content',

  hero: {
    label: 'Introduction',
    titleLines: ['Life at the', 'Frontier'] as [string, string],
    line: 'A podcast from the frontiers of science and technology, with the people who spend their lives there.',
    button: 'Subscribe',
  },

  frontiers: {
    label: 'What we cover',
    heading: 'The frontiers of human possibility',
    lead: 'Each episode takes one breakthrough from these fields and sits down with the people building it.',
    items: [
      { name: 'Intelligent machines', scope: 'AI, robotics and autonomous systems' },
      { name: 'Energy', scope: 'Fusion, advanced nuclear, energy storage and abundance' },
      { name: 'Human health', scope: 'Gene editing, longevity, regenerative medicine and neurotechnology' },
      {
        name: 'Materials and manufacturing',
        scope: 'Next-generation semiconductors, nanotechnology and advanced production',
      },
      {
        name: 'Beyond Earth',
        scope: 'Space exploration, orbital infrastructure and the emerging space economy',
      },
      {
        name: 'The information frontier',
        scope:
          'Quantum computing, advanced cryptography, programmable money and next-generation networks',
      },
    ] as Frontier[],
  },

  lens: {
    label: 'The LATF lens',
    heading: 'How possibility becomes reality',
    paragraph:
      'We follow breakthroughs along the whole journey, from the lab to everyday life. Not every one makes it through each stage.',
    alt: 'A rising curve through four stages: scientific breakthrough, technical validation, commercial adoption and real-world transformation',
    stages: [
      { lines: ['Scientific', 'breakthrough'] },
      { lines: ['Technical', 'validation'] },
      { lines: ['Commercial', 'adoption'] },
      { lines: ['Real-world', 'transformation'] },
    ] as LensStage[],
  },

  test: {
    label: 'What we ask',
    heading: 'The Frontier Test',
    lead: 'In every episode, we ask four fundamental questions.',
    questions: [
      { question: "What's possible?", description: 'The breakthroughs expanding human capability.' },
      {
        question: 'What actually works?',
        description: 'The evidence, the people and the companies turning possibility into reality.',
      },
      {
        question: 'What will change?',
        description: 'The industries, economies and lives these breakthroughs could transform.',
      },
      {
        question: 'What does it mean for you?',
        description: "What's coming, what to prepare for and where opportunity lies.",
      },
    ] as Question[],
  },

  host: {
    label: 'Your host',
    name: 'Mehdi Nayebi',
    bio: 'Mehdi worked on structured products at Deutsche Bank and Bank of America, and has founded or co-founded three companies. He brings both lenses to every story: what the evidence really shows, and what it takes to build.',
    /** Path under public/ once a portrait is supplied (open item 6). Empty shows the placeholder block. */
    portrait: '/host/mehdi-nayebi-288.jpg',
    /** Sharper copy for high-density screens. */
    portrait3x: '/host/mehdi-nayebi-432.jpg',
    portraitAlt: 'Portrait of Mehdi Nayebi',
    portraitPlaceholder: '[Photo]',
    portraitPlaceholderLabel: 'Portrait of Mehdi Nayebi, to be added',
  },

  newsletter: {
    label: 'The newsletter',
    heading: "Understand what's coming. Be ready for what's next",
    paragraph:
      'The Frontier Brief: the breakthroughs that matter, the people making them happen and what it all means. In your inbox each time an episode or essay is published.',
    fieldLabel: 'Email address',
    button: 'Subscribe',
    note: {
      before: 'Free. Unsubscribe at any time. By subscribing you agree to our ',
      link: 'privacy policy',
      href: '/privacy',
      after: '.',
    },
    messages: {
      sending: 'Subscribing...',
      success: "You're in. Check your inbox to confirm.",
      invalid: 'Please enter a valid email address.',
      error: "That didn't work. Please try again.",
    },
  },

  footer: {
    logoLabel: 'Life at the Frontier, back to top',
    line: 'An independent podcast about the breakthroughs transforming our world, and the people behind them. Created and hosted by Mehdi Nayebi.',
    explore: {
      label: 'Explore',
      links: [
        { label: 'The frontiers', id: 'frontiers' },
        { label: 'The LATF lens', id: 'lens' },
        { label: 'The Frontier Test', id: 'test' },
        { label: 'Your host', id: 'host' },
      ],
    },
    contact: {
      label: 'Contact',
      /** Contact address. Empty would show the placeholder below as plain text. */
      email: 'hello@lifeatthefrontier.com',
      emailPlaceholder: '[hello@lifeatthefrontier.com]',
      partner: 'Partner with us',
      partnerSubject: 'Partnership',
    },
    follow: {
      label: 'Follow and listen',
      /** Open item 4: add each real address. A platform without one is left out. */
      platforms: [
        { name: 'YouTube', url: '' },
        { name: 'Spotify', url: '' },
        { name: 'Apple Podcasts', url: '' },
        { name: 'X', url: 'https://x.com/lifeatfrontier' },
        { name: 'LinkedIn', url: '' },
        { name: 'Instagram', url: 'https://www.instagram.com/lifeatfrontier/' },
      ] as Platform[],
    },
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Editorial standards', href: '/editorial-standards' },
    ],
  },

  /** Search and AI visibility. */
  seo: {
    /** Pages listed in the sitemap, with the date their content last changed. */
    pages: [
      { path: '/', updated: '2026-11-25' },
      { path: '/editorial-standards', updated: '2026-11-25' },
      { path: '/privacy', updated: '2026-11-25' },
      { path: '/terms', updated: '2026-11-25' },
    ],
    /** Subjects the show covers, from the frontier descriptions. Helps search engines and AI assistants place the show. */
    topics: [
      'Artificial intelligence', 'Robotics', 'Autonomous systems',
      'Fusion energy', 'Advanced nuclear energy', 'Energy storage',
      'Gene editing', 'Longevity', 'Regenerative medicine', 'Neurotechnology',
      'Semiconductors', 'Nanotechnology', 'Advanced manufacturing',
      'Space exploration', 'Space economy',
      'Quantum computing', 'Cryptography', 'Programmable money',
      'Science and technology', 'Deep tech',
    ],
    logo: '/icon-512.png',
  },

  /** Page Kit sends people to after they click the confirmation link. */
  confirmed: {
    heading: "You're confirmed",
    line: 'The Frontier Brief will arrive in your inbox each time an episode or essay is published.',
    link: 'Back to the home page',
  },

  notFound: {
    line: 'This page is beyond the frontier.',
    link: 'Back to the home page',
  },
};
