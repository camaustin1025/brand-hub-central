import { Heading } from "@/components/layout/Heading";
import { HubShell } from "@/components/hub/HubShell";
import { ChapterPage } from "@/components/layout/ChapterPage";
import entries from "@/data/changelog.json";

export default function Changelog() {
  return (
    <HubShell activeId="changelog">
      <ChapterPage title="What’s changed" intro="Catch up on the latest changes to the hub. Updates are collected once a day, after the day ends in Eastern time." width="reading">
        <div className="space-y-6">
          {entries.length === 0 && <p className="text-foreground">The first daily update will appear here after changes are published.</p>}
          {entries.map(entry => (
            <article key={entry.date} className="rounded-lg border border-border bg-white p-6 md:p-8">
              <Heading as="h2" className="reference-section-title">
                <time dateTime={entry.date}>{new Date(`${entry.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
              </Heading>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-foreground">
                {entry.changes.map(change => <li key={change}>{change}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </ChapterPage>
    </HubShell>
  );
}
