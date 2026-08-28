import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { QuoteCard } from '../../../material/surfaces/card/quote';
import type { FeatureFlowImage, FeatureFlowItem } from '../types';
import { canonicalImagePaths } from './image-paths';
import { toTechnologies } from './technology-icons';

// ----------------------------------------------------------------------
//
// Canonical Storybook fixture (issue #171) — real content transcribed
// literally from the consuming portfolio app's own production data, minus
// the fields this component intentionally does not support
// (`outcomes`, `highlights`, `ctaLabel`/`ctaHref`, `expertiseSections`
// override — see the parent nesting-policy decision). Not exported from the
// package barrel: this is a fixture for `feature-flow-section.stories.tsx`
// only.
//
// ----------------------------------------------------------------------

const paragraphSx = { color: 'text.secondary', lineHeight: 1.8 } as const;

/**
 * Builds a multi-paragraph `longDescription` ReactNode. Mirrors the exact
 * styling `FeatureFlowItemDetail` applies to a plain-string `longDescription`
 * (see `isRichLongDescription` in `feature-flow-section.utils.ts`) so a rich
 * multi-paragraph node reads identically to the single-paragraph fallback.
 */
function paragraphs(...text: readonly string[]) {
  return (
    <Stack spacing={2}>
      {text.map((paragraph) => (
        <Typography key={paragraph} variant="body1" sx={paragraphSx}>
          {paragraph}
        </Typography>
      ))}
    </Stack>
  );
}

// ----------------------------------------------------------------------
// Top-level section config
// ----------------------------------------------------------------------

export const canonicalSectionConfig = {
  title: 'What I',
  txtGradient: 'Deliver',
  description: 'Results Over Buzzwords',
  layoutDirection: 'left' as const,
  columnSpacing: { xs: 0, md: 3 },
  descriptionGridSize: { xs: 12, md: 5, lg: 6 },
  imageGridSize: { xs: 12, md: 7, lg: 6 },
};

export const canonicalImage: FeatureFlowImage = {
  alt: 'High-Performance UIs and Delivery',
  src: canonicalImagePaths.topLevel.src,
  scrollImages: [canonicalImagePaths.topLevel.scrollDown, canonicalImagePaths.topLevel.scrollUp],
  sx: { width: { xs: 620, md: 860, lg: 980 }, bgcolor: 'transparent', boxShadow: 'none' },
};

// ----------------------------------------------------------------------
// Item 1 — High-Performance & Beautiful UIs
// ----------------------------------------------------------------------

const performanceUi: FeatureFlowItem = {
  id: 'performance-ui',
  icon: 'solar:rocket-bold-duotone',
  title: 'High-Performance & Beautiful UIs',
  description:
    'I build interfaces that look great and actually feel great to use — fast, responsive, and a pleasure for both the end user and the developers who have to maintain them.',
  imgUrl: [canonicalImagePaths.stack.performanceUi],
  longDescription: paragraphs(
    'I started my web journey back in 2005 in Slovenia and have watched the frontend world evolve dramatically since then.',
    'The past 9 years in Melbourne have been the most exciting time in my career. For the last 6 years at Avanade I had the opportunity to deliver production UI components to major Australian clients such as NBN, Australian Retirement Trust, Funlab, Vanguard, Homefirst and others, working with React, Angular, Vue, and more recently Next.js.',
    'Before that, I spent two years building WCAG AA-compliant government websites — an experience that taught me the real importance of accessibility and still influences every component I build today.',
    'My current stack gives me the confidence to deliver UIs that are not only visually polished but also genuinely performant and maintainable.'
  ),
  technologies: toTechnologies([
    'React',
    'Next.js',
    'TypeScript',
    'MUI',
    'Framer Motion',
    'Vitest',
  ]),
  metrics: [
    {
      value: '20+',
      label: 'Years',
      sublabel: 'front-end, since 2005',
      icon: 'solar:clock-circle-bold-duotone',
    },
    {
      value: '5',
      label: 'Enterprise clients',
      sublabel: 'at Avanade 2017–2024',
      icon: 'solar:buildings-bold-duotone',
    },
    {
      value: '<600ms',
      label: 'Load target',
      sublabel: 'standard I hold for all React & Next.js work',
      icon: 'solar:rocket-bold-duotone',
    },
  ],
  highlightCards: [
    {
      headline: '2015-2017: WCAG AA at SeamlessCMS',
      detail:
        'Spent two years building WCAG AA-compliant government intranets, public sites, and microsites using older JavaScript libraries and Google Maps API. Heavy focus on accessibility, client liaison, and strict code reviews.',
      src: canonicalImagePaths.highlight.performanceUi[0],
    },
    {
      headline: '2017-2023: React, Angular, Vue and Next.js at Avanade',
      detail:
        'For the last 6 years at Avanade in Melbourne, delivered UI components to major Australian clients including NBN, ART, Funlab, Vanguard, Homefirst and others using React, Angular, Vue, and more recently Next.js.',
      src: canonicalImagePaths.highlight.performanceUi[1],
    },
    {
      headline: 'Next.js 16 + React 19 Portfolio',
      detail:
        'Built with my current stack — Next.js 16, React 19, TypeScript strict mode, MUI v7, Framer Motion, Vitest 3 and Jest — clean architecture and fully tested.',
      src: canonicalImagePaths.highlight.performanceUi[2],
    },
  ],
};

// ----------------------------------------------------------------------
// Item 2 — Tech Debt Cleanup
// ----------------------------------------------------------------------

const techDebt: FeatureFlowItem = {
  id: 'tech-debt',
  icon: 'solar:star-shine-bold-duotone',
  title: 'Tech Debt Cleanup',
  description:
    'I turn messy, hard-to-maintain codebases into clean, stable systems that teams can actually enjoy working with long-term.',
  imgUrl: [canonicalImagePaths.stack.techDebt],
  // Rich longDescription: a Stack of paragraphs with a QuoteCard in the
  // middle — reproduces the production ReactNode using this package's own
  // QuoteCard rather than a plain string.
  longDescription: (
    <Stack spacing={2}>
      <Typography variant="body1" sx={paragraphSx}>
        I often share this thought with my colleagues when we talk about code ethics and long-term
        maintainability.
      </Typography>
      <QuoteCard quote="The application is like a big botanical garden, where developers are the gardeners." />
      <Typography variant="body1" sx={paragraphSx}>
        This is then usually followed with the explanation that every time a developer opens a file
        or a component, they should strive to leave it a little better than they found it. The tools
        and pull request reviews are there to help, and the real difference comes when every
        developer acts like a gardener — taking care of their own patch.
      </Typography>
      <Typography variant="body1" sx={paragraphSx}>
        One person can&apos;t efficiently create a beautiful garden in a reasonable amount of time
        alone, but when the whole team of gardeners (developers) looks after their part, the whole
        garden (the application) becomes a place where people actually want to come and spend their
        time — like a nice sunny Sunday in the park.
      </Typography>
      <Typography variant="body1" sx={paragraphSx}>
        It is probably clear by now I like gardening, but I like clean code even more.
      </Typography>
    </Stack>
  ),
  technologies: toTechnologies(['TypeScript', 'ESLint', 'Vitest', 'Jest', 'Storybook', 'React']),
  metrics: [
    {
      value: '80%',
      label: 'Test coverage',
      sublabel: 'achieved on complex async paths',
      icon: 'logos:jest',
    },
    {
      value: '100%',
      label: 'TypeScript',
      sublabel: 'strict mode, across enterprise codebases',
      icon: 'logos:typescript-icon',
    },
    {
      value: 'v9',
      label: 'ESLint',
      sublabel: 'to keep the cleanup permanent',
      icon: 'logos:eslint',
    },
  ],
  highlightCards: [
    {
      headline: 'Real-world experience',
      detail:
        "I've spent years working in large enterprise codebases where things had quietly grown out of control — near-zero test coverage, weak conventions, and technical debt accumulating in the background. I know exactly how that feels.",
      src: canonicalImagePaths.highlight.techDebt[0],
    },
    {
      headline: 'My practical approach',
      detail:
        "That's why my approach is always practical: I introduce TypeScript strict mode to surface hidden assumptions, focus test suites on the highest-risk paths first, and set up clear ESLint rules so the same problems don't quietly creep back in.",
      src: canonicalImagePaths.highlight.techDebt[1],
    },
    {
      headline: 'TypeScript as a first pass',
      detail:
        'Enabling strict mode does not fix a codebase — it reveals what is actually there. Hidden assumptions, unhandled nulls, and implicit any casts become explicit errors. It is the fastest way to understand the true state of a codebase before touching anything.',
      src: canonicalImagePaths.highlight.techDebt[2],
    },
    {
      headline: 'Testing the hard paths first',
      detail:
        'I have hit 80% test coverage on complex codebases by focusing on the paths that actually break — async flows, third-party API calls, and state transitions. Coverage numbers mean nothing if the wrong code is covered.',
      src: canonicalImagePaths.highlight.techDebt[3],
    },
    {
      headline: 'Rules that outlast the cleanup',
      detail:
        'A cleanup without enforcement is just a delay. ESLint rules encode the decisions made during a refactor — naming, imports, banned patterns — so they do not have to be re-argued in every PR.',
      src: canonicalImagePaths.highlight.techDebt[4],
    },
  ],
};

// ----------------------------------------------------------------------
// Item 3 — Consulting
// ----------------------------------------------------------------------

const pragmaticConsulting: FeatureFlowItem = {
  id: 'pragmatic-consulting',
  icon: 'solar:lightbulb-minimalistic-bold-duotone',
  title: 'Consulting',
  description:
    'I help teams choose the right tools and patterns that actually work for their situation — not just follow the latest trends.',
  imgUrl: [canonicalImagePaths.stack.pragmaticConsulting],
  longDescription: paragraphs(
    'At Avanade I often found myself in the middle — between design, frontend, and backend teams. One project that stands out is the home loan calculator I built for Bankfirst. I owned the financial logic, the tests, the UI, and the technical conversations with the client in the room.',
    "I've also integrated React front-ends with Sitecore and ASP.NET MVC back-ends on multiple engagements, and set up frontend architectures that teams continued using long after I left. My goal has always been to leave things better than I found them — practical solutions that make sense for the business and the people who have to live with the code every day."
  ),
  technologies: toTechnologies(['React', 'Angular', 'Vue.js', 'TypeScript']),
  metrics: [
    {
      value: '5+',
      label: 'Enterprise clients',
      sublabel: 'Avanade engagements',
      icon: 'solar:layers-bold-duotone',
    },
    {
      value: '3',
      label: 'Frameworks advised',
      sublabel: 'React · Angular · Vue',
      icon: 'solar:settings-bold-duotone',
    },
    {
      value: '20',
      label: 'Years experience',
      sublabel: 'foundation for every recommendation',
      icon: 'solar:clock-circle-bold-duotone',
    },
  ],
  highlightCards: [
    {
      headline: 'Home loan calculator, Bankfirst',
      detail:
        'Home loan calculator with precise financial logic — owned end-to-end including the maths, the test coverage, and the technical conversation with the client in the room.',
      src: canonicalImagePaths.highlight.pragmaticConsulting[0],
    },
    {
      headline: 'React + Sitecore integration',
      detail:
        'At multiple Avanade engagements I served as the integration developer bridging React front-ends with Sitecore and ASP.NET MVC back-ends — experienced enough on both sides to make the integration work without breaking either one.',
      src: canonicalImagePaths.highlight.pragmaticConsulting[1],
    },
    {
      headline: 'Front-end architecture setup',
      detail:
        'At several Avanade engagements I established the front-end architecture from scratch — component structure, shared patterns, state management conventions, and tooling decisions. The goal was always an architecture the team could extend independently after the engagement ended.',
      src: canonicalImagePaths.highlight.pragmaticConsulting[2],
    },
    {
      headline: 'Delivery transparency with clients',
      detail:
        'At Avanade the technical conversation with clients was part of the job, not a handoff to someone else. I managed delivery expectations directly — explaining trade-offs clearly and being the person who could defend a technical decision in the room when it mattered.',
      src: canonicalImagePaths.highlight.pragmaticConsulting[3],
    },
  ],
};

// ----------------------------------------------------------------------
// Item 4 — Training & Mentoring
// ----------------------------------------------------------------------

const trainingAndMentoring: FeatureFlowItem = {
  id: 'training-and-mentoring',
  icon: 'solar:user-bold-duotone',
  title: 'Training & Mentoring',
  description:
    'I enjoy helping teams level up — from juniors taking their first steps in production code to experienced developers switching frameworks.',
  imgUrl: [canonicalImagePaths.stack.trainingAndMentoring],
  longDescription: paragraphs(
    "At Avanade I assisted running React and TypeScript workshops for engineering teams, and I have later done a lot of hands-on pairing sessions as a consultant and mentor to junior developers. I've worked with people just starting their first real codebase all the way to seasoned consultants moving from Angular to React.",
    'What I care about most is not just teaching the "how", but helping people understand the "why" behind the patterns. My goal has always been the same: leave the team more confident and independent than they were before I arrived. Success for me is when a junior developer is shipping code on their own two weeks later, or when a team adopts better practices without needing me there to remind them.'
  ),
  technologies: toTechnologies(['React', 'Angular', 'Vue.js', 'TypeScript', 'Next.js', 'Vitest']),
  metrics: [
    {
      value: '6+',
      label: 'Workshops',
      sublabel: 'React & TypeScript',
      icon: 'solar:notes-bold-duotone',
    },
    {
      value: '500+',
      label: 'Connections',
      sublabel: 'LinkedIn network',
      icon: 'solar:users-group-rounded-bold-duotone',
    },
    {
      value: '2wk',
      label: 'To ship solo',
      sublabel: 'typical after a pairing session',
      icon: 'solar:rocket-bold-duotone',
    },
  ],
  highlightCards: [
    {
      headline: 'Avanade React workshops',
      detail:
        'Khoi Le, my manager at Avanade, noted the workshops "brought great benefit to everyone who attended." Multiple cohorts across multiple engagements — from junior starters to experienced consultants switching from Angular.',
      src: canonicalImagePaths.highlight.trainingAndMentoring[0],
    },
    {
      headline: 'Juniors shipping solo',
      detail:
        'The measure of a mentoring session is not whether the junior understood it in the moment — it is whether they can do it alone two weeks later. Every pairing session was designed for that outcome, not for the session itself.',
      src: canonicalImagePaths.highlight.trainingAndMentoring[1],
    },
    {
      headline: 'TypeScript adoption',
      detail:
        'The goal was never to create dependency on my presence. After the initial uplift, teams adopted TypeScript and testing practices independently — no follow-up sessions required, no regression back to old patterns.',
      src: canonicalImagePaths.highlight.trainingAndMentoring[2],
    },
  ],
};

// ----------------------------------------------------------------------
// Item 5 — Code Quality & Risk Mitigation
// ----------------------------------------------------------------------

const codeQualityImprovements: FeatureFlowItem = {
  id: 'code-quality-improvements',
  icon: 'solar:shield-bold-duotone',
  title: 'Code Quality & Risk Mitigation',
  description:
    "I make sure code doesn't just work today — it stays reliable, readable, and maintainable long into the future.",
  imgUrl: [canonicalImagePaths.stack.codeQualityImprovements],
  longDescription: paragraphs(
    "I've held code quality reviewer roles across multiple client engagements at Avanade. That meant writing tests, enforcing standards, and making sure coverage requirements actually held through the full delivery cycle.",
    "I've learned to focus on the paths that really break: async flows, third-party API calls, and tricky state management edge cases. The same discipline runs through everything I build — including this portfolio, where I use ESLint 9 flat config, TypeScript strict mode, and Vitest 3 to keep things clean and under control."
  ),
  technologies: toTechnologies(['TypeScript', 'Vitest', 'Jest', 'ESLint', 'Prettier', 'Storybook']),
  metrics: [
    {
      value: '80%',
      label: 'Jest coverage',
      sublabel: 'threshold maintained at NBN',
      icon: 'logos:jest',
    },
    {
      value: '2 days',
      label: 'Race condition',
      sublabel: 'diagnosed and resolved',
      icon: 'solar:atom-bold-duotone',
    },
    {
      value: 'v3',
      label: 'Vitest',
      sublabel: 'portfolio, currently running',
      icon: 'logos:vitest',
    },
  ],
  highlightCards: [
    {
      headline: 'Redux race condition fix',
      detail:
        'Stale UI that only surfaced under real load — two async actions competing over the same slice. Custom DevTools middleware to surface the conflict, then a refactor to a single source of truth. Diagnosed and resolved in two days.',
      src: canonicalImagePaths.highlight.codeQualityImprovements[0],
    },
    {
      headline: 'Code reviewer at Avanade',
      detail:
        'Code quality reviewer across multiple enterprise engagements — unit tests, documentation, and keeping standards intact through the full delivery cycle, not just at kick-off.',
      src: canonicalImagePaths.highlight.codeQualityImprovements[1],
    },
    {
      headline: 'Risk under control',
      detail:
        'Risk is always present in a codebase — the question is whether it is visible and manageable or invisible and accumulating. ESLint rules and typed boundaries make risk visible; automated tests make it manageable without adding manual overhead.',
      src: canonicalImagePaths.highlight.codeQualityImprovements[2],
    },
  ],
};

// ----------------------------------------------------------------------
// Item 6 — Open-Source Component Work
// ----------------------------------------------------------------------

const bestPracticesAndDocumentation: FeatureFlowItem = {
  id: 'best-practices-and-documentation',
  icon: 'solar:box-bold-duotone',
  title: 'Open-Source Component Work',
  description:
    'I enjoy building reusable systems from scratch — things I can actually share and that other developers might find genuinely useful.',
  imgUrl: [canonicalImagePaths.stack.bestPracticesAndDocumentation],
  longDescription: paragraphs(
    "Right now I'm actively building three open-source packages and a documentation site that grew directly out of my own work — all currently in active development in this workspace.",
    'giselle-mui is a typed MUI v7 component library with eight shipped exports — GiselleIcon, MetricCard, MetricCardDecoration, SelectableCard, QuoteCard, TimelineTwoColumn, PhaseCard, and TimelineDot — plus the createIconRegistrar utility. Every component has Vitest unit tests, Storybook 8 autodoc stories, and ships through a quality gate that runs Prettier, ESLint, tsc, Vitest, tsup build, and a Storybook build before every push.',
    'giselle-ui is a framework-agnostic React component library with zero MUI dependency — React 19, TypeScript strict mode, CSS Custom Properties for theming, and asChild composition via @radix-ui/react-slot.',
    'giselle-sections-sdk is the sections-api pattern extracted as a standalone npm package. Typed interfaces, pure utility helpers, and generic sample data. A consumer installs it, wires up their own data provider, and gets a fully typed architecture with no hardcoded content.',
    'giselle-docs is a Docusaurus documentation site being wired to host docs for all three packages.',
    "For many years I stayed in a corporate cocoon — enterprise delivery with almost no public footprint. I'm changing that deliberately: real published libraries under the MIT licence, not side projects I keep to myself."
  ),
  technologies: toTechnologies(['React', 'TypeScript', 'MUI', 'Storybook', 'Vitest', 'tsup']),
  metrics: [
    {
      value: '3',
      label: 'npm packages',
      sublabel: 'giselle-mui · giselle-ui · sections-sdk',
      icon: 'solar:widget-2-bold-duotone',
    },
    {
      value: '8+',
      label: 'Shipped exports',
      sublabel: 'giselle-mui, live in Storybook',
      icon: 'logos:storybook-icon',
    },
    {
      value: '6',
      label: 'Quality checks',
      sublabel: 'before every push to main',
      icon: 'solar:shield-bold-duotone',
    },
  ],
  highlightCards: [
    {
      headline: 'Open-source MUI component library',
      detail:
        'A typed MUI v7 component library with eight shipped exports — GiselleIcon, MetricCard, QuoteCard, SelectableCard, TimelineTwoColumn, and more. Every component is unit-tested with Vitest, documented in Storybook 8 autodoc, and built with CSS Variables mode.',
      src: canonicalImagePaths.highlight.bestPracticesAndDocumentation[0],
    },
    {
      headline: 'Framework-agnostic React library',
      detail:
        'A framework-agnostic React component library with zero MUI dependency. React 19, TypeScript strict mode, asChild composition via @radix-ui/react-slot, and CSS Custom Properties for theming. Clean ESM + CJS build via tsup.',
      src: canonicalImagePaths.highlight.bestPracticesAndDocumentation[1],
    },
    {
      headline: 'Typed sections data SDK',
      detail:
        'The sections-api pattern extracted as a standalone npm package. Typed interfaces, pure utility helpers, and generic sample data. Any consuming app installs it, wires up a data provider, and becomes a pure renderer with no hardcoded content.',
      src: canonicalImagePaths.highlight.bestPracticesAndDocumentation[2],
    },
    {
      headline: 'Quality gate before every push',
      detail:
        'A six-step automated quality gate runs before every push and in GitHub Actions CI: Prettier formatting, ESLint, TypeScript strict-mode type check, Vitest unit tests, tsup production build, and a full Storybook build. Broken code does not reach main.',
      src: canonicalImagePaths.highlight.bestPracticesAndDocumentation[3],
    },
    {
      headline: 'MIT licensed from scratch',
      detail:
        'Every component across all three packages is written from scratch under the MIT licence — no extracted theme code, no proprietary dependencies. The copyright boundary is intentional: these libraries are safe for anyone to install and use.',
      src: canonicalImagePaths.highlight.bestPracticesAndDocumentation[4],
    },
  ],
};

// ----------------------------------------------------------------------

/** All six real canonical items, in production order. */
export const canonicalItems: FeatureFlowItem[] = [
  performanceUi,
  techDebt,
  pragmaticConsulting,
  trainingAndMentoring,
  codeQualityImprovements,
  bestPracticesAndDocumentation,
];
