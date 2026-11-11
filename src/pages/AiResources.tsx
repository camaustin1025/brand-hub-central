import { useEffect } from 'react';
import { AiResources as AiResourcesContent } from '@/components/brand/AiResources';
import { HubShell } from '@/components/hub/HubShell';
import { ChapterHero } from '@/components/layout/ChapterHero';
import { OG_AI_CHANNEL } from '@/data/ai-resources';
export default function AiResourcesPage() {
  useEffect(() => { const previous = document.title; document.title = 'AI Resources · Ordergroove Brand Hub'; return () => { document.title = previous; }; }, []);
  return <HubShell activeId="ai-skills">
    <ChapterHero compact crumbs={[{label: "Brand hub", to: "/"}, {label: "Resources"}]} title="AI Resources" intro="Find a skill, learn a workflow, or get help using AI at Ordergroove." />
    <div className="px-6 pb-16 pt-6 md:px-10"><div className="mx-auto max-w-[1060px]"><nav aria-label="AI guidance and support" className="mb-7 flex flex-wrap gap-x-6 gap-y-3 text-sm"><a className="action-focus underline underline-offset-4" href="#ai-sharing">Safe sharing guidelines</a><a className="action-focus underline underline-offset-4" href="#ai-connectors">Request a tool review</a><a className="action-focus underline underline-offset-4" href={OG_AI_CHANNEL.url} target="_blank" rel="noopener noreferrer">Ask in #og-ai<span className="sr-only"> (opens in a new tab)</span></a></nav><AiResourcesContent /></div></div>
    <footer className="border-t border-border px-6 py-8 md:px-10"><p className="mx-auto max-w-[1060px] text-sm">Owned by Brand & Content</p></footer>
  </HubShell>;
}
