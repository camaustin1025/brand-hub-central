import { execFileSync } from 'node:child_process';
import { URL } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';

// Use committer time: a change belongs to the day it entered this branch.
const day = (date) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(date);
const today = day(new Date());
const target = new URL('../src/data/changelog.json', import.meta.url);
const entries = JSON.parse(readFileSync(target, 'utf8'));
const existing = new Map(entries.map(entry => [entry.date, entry]));
const commits = execFileSync('git', ['log', '--first-parent', '--format=%H%x09%cI%x09%s', '--', 'src', 'public', 'content-sources'], { encoding: 'utf8' }).trim();
const days = new Map();
for (const line of commits.split('\n').filter(Boolean)) {
  const [hash, timestamp, ...parts] = line.split('\t');
  const date = day(new Date(timestamp));
  if (date >= today || date < '2026-11-01') continue;
  const files = execFileSync('git', ['diff-tree', '--root', '--no-commit-id', '--name-only', '-r', '-m', hash], { encoding: 'utf8' }).trim().split('\n');
  if (!files.some(file => /^(src|public|content-sources)\//.test(file) && file !== 'src/data/changelog.json')) continue;
  const title = parts.join('\t').replace(/\s*\(#\d+\)$/, '').replace(/^(feat|fix|chore|style|refactor)(\([^)]*\))?:\s*/i, '');
  if (/^(merge|chore|publish daily changelog)/i.test(title)) continue;
  if (!days.has(date)) days.set(date, new Set());
  days.get(date).add(title);
}
for (const [date, changes] of days) {
  // Preserve reviewed entries; reruns never rewrite a published day.
  if (!existing.has(date)) existing.set(date, { date, changes: [...changes] });
}
writeFileSync(target, `${JSON.stringify([...existing.values()].sort((a, b) => b.date.localeCompare(a.date)), null, 2)}\n`);
