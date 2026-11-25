import { site } from '../content/site';

/*
 * /llms.txt: a plain-text briefing for AI assistants and answer engines (llmstxt.org).
 * Generated from the same copy as the site, so it can never say anything the site does not.
 */
export function GET() {
  const abs = (p: string) => new URL(p, site.url).href;
  const f = site.frontiers;
  const t = site.test;
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.meta.description}`,
    '',
    `${site.name} (${site.shortName}) is ${site.footer.line.charAt(0).toLowerCase()}${site.footer.line.slice(1)} ${f.lead}`,
    '',
    `## ${f.heading}`,
    '',
    ...f.items.map((i, n) => `${n + 1}. ${i.name}: ${i.scope}`),
    '',
    `## ${t.heading}`,
    '',
    t.lead,
    '',
    ...t.questions.map((q, n) => `${n + 1}. ${q.question} ${q.description}`),
    '',
    `## ${site.lens.label}: ${site.lens.heading}`,
    '',
    `${site.lens.paragraph} The stages: ${site.lens.stages.map((s) => s.lines.join(' ').toLowerCase()).join(', ')}.`,
    '',
    '## Host',
    '',
    `${site.host.name}. ${site.host.bio}`,
    '',
    `## ${site.newsletter.label}`,
    '',
    `${site.newsletter.paragraph} Sign up at ${abs('/#subscribe')}.`,
    '',
    '## Pages',
    '',
    `- [Home](${abs('/')}): what the show covers, how it works and who hosts it`,
    `- [Editorial standards](${abs('/editorial-standards')}): independence, evidence, disclosure of interests and corrections`,
    `- [Privacy](${abs('/privacy')}): no cookies, no tracking; email used only for the newsletter and replies`,
    `- [Terms](${abs('/terms')}): nothing published is financial, medical or legal advice`,
    '',
    '## Contact',
    '',
    `- Email: ${site.footer.contact.email}`,
    ...site.footer.follow.platforms.filter((p) => p.url).map((p) => `- ${p.name}: ${p.url}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
