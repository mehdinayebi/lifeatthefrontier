# Life at the Frontier: website build brief

You are building the launch website for **Life at the Frontier** (short name: LATF), a podcast hosted by Mehdi Nayebi. Domain: `lifeatthefrontier.com`.

The design is finished and approved. Your job is to build it faithfully as a production site. Do not redesign it, restyle it or rewrite its copy.

## Read these first, in this order

1. `reference/index.html`. Open it in a browser and scroll. It is a working single-file build of the whole page with every animation. It is the source of truth for how the site looks and moves.
2. `docs/design-spec.md`. Layout, colours, type, spacing, breakpoints, components, accessibility.
3. `docs/motion-spec.md`. The six motion effects: triggers, timelines, easing, fallbacks.
4. `docs/copy.md`. Every word on the site. Use it verbatim.
5. `docs/open-items.md`. Facts and assets Mehdi has not supplied yet. Never invent them.

If two sources disagree, the order of authority is: `reference/index.html`, then `docs/`, then `reference/screenshots/`. If something is still unclear, ask before building it.

## What to build

- **Home page** (`/`): the single page in the reference. Sections in order: hero, the frontiers, the LATF lens, the Frontier Test, the host, the newsletter, the footer.
- **Three legal pages** as simple stubs in the same visual style: `/privacy`, `/terms`, `/editorial-standards`. Their text is an open item. Use a clearly marked placeholder paragraph and list them in your final report.
- **404 page** in the same style: the title, one line ("This page is beyond the frontier."), and a link home.

## Stack

Use this unless Mehdi says otherwise:

- **Astro**, current stable release, static output. No React, Vue or other UI framework.
- **Plain CSS** with custom properties. No Tailwind. Port `reference/styles.css` into the project and split it by section if you wish. Keep the class names or rename them consistently, but keep every value.
- **One small vanilla JavaScript module** for motion, ported from `reference/motion.js`. No animation library (no GSAP, Framer Motion, Lenis or similar). No smooth-scroll library and no scroll hijacking.
- **Self-hosted fonts** from `assets/fonts/` (woff2, Latin subset, SIL Open Font Licence). Do not load fonts from a third-party server. Preload Instrument Sans 700 and 600. Use `font-display: swap`.
- **Hosting**: any static host (Vercel, Netlify, Cloudflare Pages). No server code is needed except the newsletter call, described below.

Suggested layout:

```
src/
  pages/index.astro, privacy.astro, terms.astro, editorial-standards.astro, 404.astro
  layouts/Base.astro            head, fonts, meta, skip link
  components/Hero.astro, Frontiers.astro, Lens.astro, FrontierTest.astro, Host.astro, Newsletter.astro, Footer.astro
  styles/tokens.css, base.css, and one file per component
  scripts/motion.js             the ported motion module
  scripts/newsletter.js         the form adapter
  content/site.ts               all copy and the frontier list, taken from docs/copy.md
public/
  everything in assets/web/ at the site root, fonts under /fonts/, logo SVGs under /logo/
```

## Rules that must not be broken

These come from the owner. Treat each as a requirement.

1. Do not mention Spotlight, Spotlight Capital or any other venture of the host anywhere.
2. Do not promise a publishing rhythm. No "weekly", "every week", "monthly" or similar.
3. Do not describe what the show will become. Nothing about future films, funds, events or a roadmap.
4. Do not show an essay, an episode or the Frontier Test tool as already published. There is no episode list at launch.
5. Do not name the companies the host founded. The bio in `docs/copy.md` is final.
6. Do not draw or redraw platform logos (YouTube, Spotify, Apple Podcasts, X, LinkedIn, Instagram). The design uses labelled text pills. Only use official brand files if Mehdi supplies them.
7. No em dashes anywhere in the copy. Use commas, colons or full stops.
8. Text in `[square brackets]` is a placeholder. Keep it visible as a placeholder or ask. Never replace it with an invented value.
9. Do not add sections, stock photos, icons, emoji, gradients, particles, parallax or any effect that is not in the reference.

## Quality bar

- **Fidelity**: at 1440×900, 1920×1080, 1366×640, 820×1180 and 390×844 the build matches the reference. Compare against `reference/screenshots/` and against the reference page itself, side by side.
- **Responsive**: no horizontal scrolling from 320 px wide upward. Breakpoints are in the design spec.
- **Accessibility**: WCAG 2.2 level AA. Semantic landmarks and headings, a skip link, visible focus rings, labelled form field, touch targets of at least 44 px, colour contrast rules as listed in the design spec. Decorative elements carry `aria-hidden="true"`.
- **Browsers**: current Chrome, Safari, Firefox and Edge on desktop, Safari on iPhone and Chrome on Android. The reference has been tested in Chrome only, so check the others with care, above all the animated `clip-path`, the sticky hero and `text-wrap`.
- **Reduced motion**: with `prefers-reduced-motion: reduce` the page is complete and static. Nothing is hidden.
- **No JavaScript**: with scripts disabled the page is complete and readable. Nothing is hidden. Content is only ever hidden by the motion script itself.
- **Performance**: Lighthouse mobile scores of 95 or more for Performance, Accessibility, Best Practices and SEO. Total JavaScript under 15 KB before compression. No layout shift from fonts or from the pinned hero.
- **SEO and sharing**: title, description, canonical link, Open Graph and Twitter card tags, favicons and web manifest. The values are in `docs/copy.md` and `assets/web/head-snippet.html`.
- **No tracking** by default. No cookies, so no cookie banner. Analytics is an open item.

## Motion

Build all six effects exactly as specified in `docs/motion-spec.md`. `reference/motion.js` is tested code and can be ported almost as is. Keep its safety behaviour: every hidden starting state is applied by the script, and a timeout reveals everything if the observer never reports.

## Newsletter form

The provider is not chosen yet (see open items). Build the form so that connecting one is a single-file change:

- `scripts/newsletter.js` exports one function, `subscribe(email)`, that returns a promise. Its default implementation sends a POST request with JSON `{ "email": "..." }` to the address in the environment variable `PUBLIC_NEWSLETTER_ENDPOINT`.
- If that variable is empty, the form must show the error state and log a clear console message. Never show a success message that is not true.
- States and their exact wording are in `docs/design-spec.md` and `docs/copy.md`.

## How to work

1. Read the five sources above. Open the reference page at desktop and phone widths and scroll it slowly, twice.
2. Scaffold the project and port the CSS and markup section by section. Check each section against the reference before moving on.
3. Port the motion module. Test every effect on desktop and phone widths, with reduced motion, and with JavaScript disabled.
4. Add meta tags, favicons, legal stubs and the 404 page.
5. Run Lighthouse and an accessibility check (axe or similar). Fix what they find.
6. Finish with a short report: what was built, anything that differs from the reference and why, and the open items that still need Mehdi.

## Definition of done

- [ ] All seven sections match the reference at the five sizes listed above.
- [ ] All six motion effects behave as specified, forward and backward, with no console errors.
- [ ] Page is complete with reduced motion and with JavaScript off.
- [ ] Keyboard-only use works from the skip link to the footer. Focus is always visible.
- [ ] Lighthouse mobile is 95 or more in all four categories.
- [ ] None of the nine rules above is broken.
- [ ] Every placeholder is still marked and listed in the final report.
