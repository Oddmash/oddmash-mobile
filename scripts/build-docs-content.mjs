import { cp, writeFile } from 'node:fs/promises';

const source = new URL('../docs/', import.meta.url);
const site = new URL('../docs-dist/', import.meta.url);
const siteDocs = new URL('docs/', site);
const publicDocs = new URL('https://oddmash.github.io/oddmash-mobile/docs/');
const entries = [
  ['Alpha usage and limitations', 'alpha.md'],
  ['Alpha verification', 'alpha-verification.md'],
  ['Browser verification', 'browser-verification.md'],
  ['Architecture', 'architecture.md'],
  ['Quality and release', 'quality-and-release.md'],
];

await cp(source, siteDocs, { recursive: true });

const index = [
  '# Oddmash Mobile',
  '',
  '> Experimental React components for Bottom Sheet, Adaptive Dialog, Swipe Action and Pull to Refresh.',
  '',
  'Package: `@oddmash/mobile-interactions`',
  '',
  ...entries.map(([title, path]) => `- [${title}](${new URL(path, publicDocs)})`),
  '',
].join('\n');

await writeFile(new URL('llms.txt', site), index);
