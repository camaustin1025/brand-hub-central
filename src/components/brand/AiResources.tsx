import { Heading } from "@/components/layout/Heading";
import { ShieldCheck } from 'lucide-react';
import { APPROVAL_STEPS, APPROVAL_CRITERIA, APPROVAL_DECISIONS, APPROVED_CONNECTORS, SECURITY_GUIDELINES, SECURITY_CHANNEL, INFOSEC_CHANNEL, SHARING_RULES } from '@/data/ai-resources';
import { cn } from '@/lib/utils';
import { AiCategoriesDirectory } from './AiCategoriesDirectory';
import { External } from './AiDirectoryList';
import s from './AiResources.module.css';

export function AiResources() {
  return <div className="ai-directory [container-type:inline-size]">
    <AiCategoriesDirectory />
    <AiPolicySections />
  </div>;
}

/** What you can share and Get a new tool approved, under the directory. */
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
      <p className={cn(s.approvalLede, 'mt-2')}>Already approved: {APPROVED_CONNECTORS}.</p>
      <ol className={s.approvalSteps}>{APPROVAL_STEPS.map((step, index) => <li key={step.link.url} className={s.approvalStep}><span aria-hidden="true" className={s.approvalNumber}>{index + 1}</span><div><External href={step.link.url}>{step.link.label}</External><p>{step.body}</p></div></li>)}</ol>
      <p className={s.approvalLinks}><External href={APPROVAL_CRITERIA.url}>{APPROVAL_CRITERIA.label}</External><External href={APPROVAL_DECISIONS.url}>{APPROVAL_DECISIONS.label}</External></p>
    </section>
  </>;
}
