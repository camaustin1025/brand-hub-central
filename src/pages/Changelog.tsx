import { HubShell } from "@/components/hub/HubShell";
import entries from "@/data/changelog.json";

export default function Changelog() {
  return (
    <HubShell activeId="changelog">
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-og-indigo">Brand Hub updates</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">What’s changed</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">Catch up on the latest changes to the hub. Updates are collected once a day, after the day ends in Eastern time.</p>
        <div className="mt-10 space-y-6">
          {entries.length === 0 && <p className="text-muted-foreground">The first daily update will appear here after changes are published.</p>}
          {entries.map(entry => (
            <article key={entry.date} className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-xl font-semibold">
                <time dateTime={entry.date}>{new Date(`${entry.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
              </h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">
                {entry.changes.map(change => <li key={change}>{change}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </HubShell>
  );
}
