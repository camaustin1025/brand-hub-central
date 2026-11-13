import { Heading } from "@/components/layout/Heading";
import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { APPROVAL_STEPS, APPROVAL_CRITERIA, APPROVAL_DECISIONS, SECURITY_GUIDELINES, SECURITY_CHANNEL, INFOSEC_CHANNEL, SHARING_RULES } from '@/data/ai-resources';
import { cn } from '@/lib/utils';
import { DIRECTORY_LAYOUT, DIRECTORY_LAYOUTS, type DirectoryLayout } from './ai-directory-layout';
import { DirectoryGroups, DirectoryStatus, DirectoryToolbar, External, useDirectoryFilters } from './AiDirectoryList';
import s from './AiResources.module.css';

/*
 * Layout review (2026-11-13): Options A (library), B (filtered table) and C (categories: the current
 * list with A's category card) load only in dev, or once DIRECTORY_LAYOUT promotes one, so production
 * ships the current directory and nothing else.
 */
const OPTIONS_ENABLED = import.meta.env.DEV || DIRECTORY_LAYOUT !== 'current';
const OPTION_DIRECTORIES: Partial<Record<DirectoryLayout, LazyExoticComponent<ComponentType>>> = OPTIONS_ENABLED
  ? {
      library: lazy(() => import('./ai-directory-options/LibraryDirectory')),
      table: lazy(() => import('./ai-directory-options/TableDirectory')),
      categories: lazy(() => import('./ai-directory-options/CategoriesDirectory')),
    }
  : {};
const LayoutSwitcher = import.meta.env.DEV ? lazy(() => import('./ai-directory-options/LayoutSwitcher')) : null;

function useDirectoryLayout(): DirectoryLayout {
  const [params] = useSearchParams();
  if (!import.meta.env.DEV) return DIRECTORY_LAYOUT;
  const requested = params.get('layout') as DirectoryLayout | null;
  return requested && DIRECTORY_LAYOUTS.includes(requested) ? requested : DIRECTORY_LAYOUT;
}

export function AiResources() {
  const layout = useDirectoryLayout();
  const Option = OPTION_DIRECTORIES[layout];
  return <div className="ai-directory [container-type:inline-size]">
    {Option ? <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}><Option /></Suspense> : <CurrentDirectory />}
    <AiPolicySections />
    {LayoutSwitcher && <Suspense fallback={null}><LayoutSwitcher layout={layout} /></Suspense>}
  </div>;
}

/** The shipped directory: grouped lists with type chips and the team filter. */
function CurrentDirectory() {
  const f = useDirectoryFilters();
  return <section aria-label="AI resource directory" id="ai-skills-library" className="scroll-mt-24">
    <DirectoryToolbar f={f} />
    <DirectoryStatus f={f} />
    <DirectoryGroups f={f} />
  </section>;
}

/** What you can share and Get a new tool approved: the same under every directory layout. */
function AiPolicySections() {
  return <>
    <section id="ai-sharing" className={cn('dark', s.panel)} aria-labelledby="what-you-can-share">
      <span id="ai-start-here" className="scroll-mt-24" />
      <Heading as="h2" id="what-you-can-share"><ShieldCheck aria-hidden="true" size={26} />What you can share</Heading>
      <p className={s.panelIntro}>Use your OG Gmail to sign in to Team accounts (Claude, ChatGPT, Gemini). Read the <External href={SECURITY_GUIDELINES.url}>{SECURITY_GUIDELINES.label}</External>.</p>
      <div className={s.panelCols}>
        <div className={s.colNever}>
          <Heading as="h3" id="never-share"><span className={cn(s.mark, s.markNever)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></span>Never share</Heading>
          <ul className={cn(s.rules, s.rulesNever)} aria-labelledby="never-share">{SHARING_RULES.never.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className={s.colTeam}>
          <Heading as="h3" id="team-account-only"><span className={cn(s.mark, s.markTeam)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span>Team account only</Heading>
          <ul className={s.rules} aria-labelledby="team-account-only">{SHARING_RULES.teamOnly.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
    </section>
    <section id="ai-connectors" className={s.approval} aria-labelledby="get-a-new-tool-approved">
      <Heading as="h2" id="get-a-new-tool-approved" className="reference-section-title">Get a new tool approved</Heading>
      <p className={s.approvalLede}>Get approval before connecting a tool. Questions: <External href={SECURITY_CHANNEL.url}>{SECURITY_CHANNEL.label}</External>. Reviews: <External href={INFOSEC_CHANNEL.url}>{INFOSEC_CHANNEL.label}</External>.</p>
      <ol className={s.approvalSteps}>{APPROVAL_STEPS.map((step, index) => <li key={step.link.url} className={s.approvalStep}><span aria-hidden="true" className={s.approvalNumber}>{index + 1}</span><div><External href={step.link.url}>{step.link.label}</External><p>{step.body}</p></div></li>)}</ol>
      <p className={s.approvalLinks}><External href={APPROVAL_CRITERIA.url}>{APPROVAL_CRITERIA.label}</External><External href={APPROVAL_DECISIONS.url}>{APPROVAL_DECISIONS.label}</External></p>
    </section>
  </>;
}
