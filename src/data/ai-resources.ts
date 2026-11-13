/*
 * Content for /ai-resources. Compiled 2026-11-10 from Slack, Google Drive, and the
 * Claude skill catalog. Links are internal (Slack, Confluence, Drive, claude.ai), so
 * the page is staff-only: see HubRoutes and the guest rule in index.css.
 */

export type ResourceLink = { label: string; url: string };

const SLACK = "https://ordergroove.slack.com/archives";
const CONFLUENCE = "https://ordergroove.atlassian.net/wiki/spaces/DEV/pages";

/** Section anchors on /ai-resources, in page order. The hero's "On this page" links read from this. */
export const AI_RESOURCE_SECTIONS = [
  { id: "ai-start-here", label: "Start here" },
  { id: "ai-sharing", label: "What you can share" },
  { id: "ai-skills-library", label: "Skills" },
  { id: "ai-training", label: "Training" },
  { id: "ai-slack", label: "Slack channels" },
  { id: "ai-connectors", label: "Connectors" },
  { id: "ai-how-to", label: "How-to posts" },
];

export const OG_AI_CHANNEL: ResourceLink = { label: "#og-ai", url: `${SLACK}/C09HTBGS8JD` };
export const TRAINING_CHANNEL: ResourceLink = { label: "#og-claudetraining", url: `${SLACK}/C0B008FP10X` };
export const SECURITY_CHANNEL: ResourceLink = { label: "#security", url: `${SLACK}/C0B6SSKUPM4` };
export const INFOSEC_CHANNEL: ResourceLink = { label: "#infosec-reviews", url: `${SLACK}/C06TAFL3R63` };

export const SECURITY_GUIDELINES: ResourceLink = {
  label: "Generative AI security guidelines",
  url: `${CONFLUENCE}/3828416564/Generative+AI+security+guidelines`,
};

export const SECURITY_SUMMARY: ResourceLink = {
  label: "a summary in #ogofficial",
  url: `${SLACK}/CEKAB3HE2/p1770164079224739`,
};

export const SHARING_RULES = {
  never: [
    "Merchant or customer PII",
    "Confidential employee data",
    "Trade secrets",
    "Credentials or API keys",
    "Config files with sensitive values",
    "Deployment folders",
    "Proprietary algorithms",
    "Bulk PII (10+ records) for any merchant’s consumers or employees, even on a Team account",
  ],
  teamOnly: [
    "Merchant name and public ID",
    "Merchant GMV, revenue, and performance data",
    "Ordergroove performance data (GMV, revenue, NRR, GRR)",
  ],
};

export const SLACK_CHANNELS = [
  { ...OG_AI_CHANNEL, body: "AI questions, resources, and new skills." },
  { label: "#mcp", url: `${SLACK}/C0BCQ3FPTLH`, body: "Questions about the Ordergroove MCP, like access, data gaps, and merchant setup." },
  { ...SECURITY_CHANNEL, body: "Questions about getting connectors and MCP servers approved." },
  { ...INFOSEC_CHANNEL, body: "Security reviews of new tools." },
  { label: "#gong-ai-insights", url: `${SLACK}/C0AFZBDV4PP`, body: "AI reports built from Gong calls and emails." },
  { label: "#gen-ai-playground", url: `${SLACK}/C07VAETU95M`, body: "Gen AI experiments." },
];

/** A single #og-ai message. Slack permalinks are the channel URL plus p + the message timestamp without its dot. */
const ogAiPost = (ts: string) => `${OG_AI_CHANNEL.url}/p${ts.replace(".", "")}`;

export const RUBBER_DUCKY_POST: ResourceLink = { label: "Abbie Cook, Nov 5", url: ogAiPost("1793899475.275879") };

/** Getting a new connector, MCP server, or tool approved, in the order you'll need them. */
export const APPROVAL_STEPS = [
  {
    link: {
      label: "Check approved tools",
      url: `${CONFLUENCE}/51773599/Approved+set+of+3rd+party+applications+services+vendors+with+an+owner`,
    },
    body: "Check the list before connecting a tool, Claude connector, or MCP server.",
  },
  {
    link: {
      label: "Request a security review",
      url: `${CONFLUENCE}/3980984360/Security+vetting+for+new+3rd+party+software+tools`,
    },
    body: "Not on the list? Follow the request process to submit a review.",
  },
];

export const APPROVAL_CRITERIA: ResourceLink = {
  label: "Review criteria (no merchant PII)",
  url: `${CONFLUENCE}/3992584204/Vetting+process+for+3rd+party+tools+-+no+merchant+PII`,
};
export const APPROVAL_DECISIONS: ResourceLink = {
  label: "Review decisions",
  url: "https://sre-dashboard.ops.ordergroove.com/veto/",
};

export const TRAINING = [
  {
    label: "Claude 101 Training doc",
    url: "https://docs.google.com/document/d/1R_nIfBg19w_asiWAgc11s8znRs2SCvdOeikRICw5HaU/edit",
    owner: "Abbie Cook",
    body: "From the May 2026 training. About 1 hour.",
  },
  {
    label: "Anthropic Claude 101 course",
    url: "https://anthropic.skilljar.com/claude-101",
    owner: "Anthropic",
    body: "The course itself. Needs a free Anthropic Education account.",
  },
  {
    label: "AI@OG 2026 kickoff deck",
    url: "https://docs.google.com/presentation/d/1zPoWTyhVIjAK-SeAQg8kWWiZInWM5MVKDmXzfCUHwc4/edit",
    owner: "Ofir Shalom",
    body: "The February 2026 AI kickoff.",
  },
  {
    label: "E100 Pod Claude Project setup",
    url: "https://docs.google.com/document/d/1_Jh_Hg9go8h4b4r2Fkwrk80lGHwqBj7MVFU_4d8Irqs/edit",
    owner: "Shared drive",
    body: "Instructions for setting up Claude Projects for E100 pods.",
  },
  {
    label: "Claude tutorials",
    url: "https://claude.com/resources/tutorials",
    owner: "Anthropic",
    body: "Self-paced. Also in Claude under your profile > Learn more.",
    extra: { label: "Claude courses", url: "https://claude.com/resources/courses" },
  },
];

/**
 * org: published to the org library. shared: its creator shared it org-wide. catalog: findable in search, not shared org-wide.
 * Every org-library skill links straight to its page (claude.ai/customize/skills/id/...), which opens with an Add button for
 * anyone in the org (checked 2026-11-13), so none of today's skills needs the catalog route.
 */
export type SkillStatus = "org" | "shared" | "catalog";

/** Only "catalog" skills get a visible tag: org and shared skills both work for everyone. */
export const SEARCH_ONLY_LABEL = "Search only";

const skill = (id: string) => `https://claude.ai/customize/skills/id/${id}`;

export type Skill = { name: string; url: string; body: string; status: SkillStatus; extra?: ResourceLink };

export const SKILL_GROUPS: { id: string; label: string; skills: Skill[] }[] = [
  {
    id: "sales",
    label: "Sales and AEs",
    skills: [
      { name: "og-sales-deck", url: skill("plugin_01Evpbd3rbgLHaKLYVBdzg47"), status: "org", body: "Builds a tailored sales deck in Google Slides from the official template and the 2026 slide bank." },
      { name: "negotiation-pricing-model", url: skill("plugin_011vyJ3RhWdirLwmdA8wjr6V"), status: "shared", body: "A branded Excel model with List, Proposal, Counter, and Floor prices, 3-year ARR, and GMV sensitivity." },
      { name: "sow-generator", url: skill("plugin_012QnT8rJhSiXFWNntSNe6a4"), status: "shared", body: "Writes an SOW in Ordergroove’s standard legal language and uploads it to Drive." },
      { name: "sow-generator-type-options", url: skill("plugin_01YPffAehRDeL1GN39DVtZmf"), status: "shared", body: "An SOW variant covering 3 types: Migration, Custom Report, and General." },
      { name: "account-signal-tracker", url: skill("plugin_01Y6YDwCvD3y57ieVux9EAiK"), status: "shared", body: "Turns news about an account (earnings, new hires, launches) into outreach messaging." },
      { name: "e100-account-brief-generator", url: skill("plugin_01V2WeuDmiwVEDUfjXJMv1sG"), status: "org", body: "Drafts the E100 account strategy and mutual action plan brief." },
      { name: "ae-deal-brief", url: skill("plugin_01VwhWUfkjoB43e3ZrcqWnYH"), status: "org", body: "Deal help for every opportunity, before and after the first call, starting from the SDR’s handoff notes." },
      { name: "ae-deal-revival", url: skill("plugin_01Tn2uddTf15ohH4EqUFo2dE"), status: "org", body: "Reads one stalled or unclear deal’s full history and helps decide whether to advance, revive, or close it." },
      { name: "sdr-handoff", url: skill("plugin_01XRi85KH8fdnLGyS3UzXS97"), status: "org", body: "Turns a booked demo into an SQL, collects discovery notes, opens the prospect Slack channel, and notifies the AE. Also writes the post-demo recap." },
      { name: "Groove standard", url: skill("plugin_01ETHocUXqGZue9RMPPnXLRf"), status: "org", body: "Keeps an opportunity’s Groove Standard fields current from Gong, Salesforce, Gmail, and Slack, and drafts the follow-up email." },
    ],
  },
  {
    id: "cs",
    label: "CS and account management",
    skills: [
      { name: "account-status-update", url: skill("plugin_01RkXcDEvYqvDEQqfK1ik19F"), status: "org", body: "Graded, Slack-ready status updates for a CSM’s accounts." },
      { name: "sbr-scan", url: skill("plugin_011aJQ5cYfY8NNDV8iqupRtG"), status: "org", body: "SBR step 1: scans every source for a merchant and suggests the problem to solve." },
      { name: "sbr-prep", url: skill("plugin_01PRupGqSreSHKjS8jaND78u"), status: "org", body: "SBR step 2: researches, sizes the opportunity, and builds the story." },
      { name: "sbr-practice", url: skill("plugin_01C4K9Ndxdr4F3VmxJRBdChP"), status: "org", body: "SBR step 3: a critique from a skeptical executive, plus a meeting role-play." },
      { name: "sbr-recap", url: skill("plugin_01QKiFte7qRhQetd4n1jYo6z"), status: "org", body: "SBR step 4: a recap email, an internal summary, and a #strategic-business-reviews post." },
      { name: "dormant-customer", url: skill("plugin_01GJv6rudjSuu3TcRSVhDMYz"), status: "shared", body: "A prep pack for re-engaging a customer that’s gone quiet." },
      { name: "merchant-retention-agent", url: skill("plugin_01AoCpVfmRBNUeSZ3wtmvce2"), status: "shared", body: "Analyzes a merchant’s cancel flow using BigQuery and ranks save tactics." },
      { name: "customer-master-sheet", url: skill("plugin_01XpFBuya1BiBCx5F4VvAmSd"), status: "shared", body: "Builds and updates the hypercare master sheet and success plan." },
      { name: "cs-renewal-proposals", url: skill("plugin_01Uj3NavoQLqyMLQxbqAo461"), status: "org", body: "A renewal or pricing proposal (deck, PDF, and internal summary) from one set of deal terms, posted to #cs-deal-desk." },
      { name: "merchant-360", url: skill("plugin_017cVL7UfTqi6PLcDhhSScUn"), status: "org", body: "Answers “what’s going on with this merchant?” in Slack with a briefing from the platform, Salesforce, Zendesk, Jira, and Drive." },
      { name: "Retention forecast", url: skill("plugin_01Qe2Rc2f31WJgr8Mo5iwBiq"), status: "org", body: "The weekly CS retention forecast: refreshes the Build sheet from Salesforce, then writes the pipeline briefing, summary slide, and CS manager briefs." },
      { name: "Account management agent", url: skill("plugin_01Ai8C5aqDcghssDzxMVyyhF"), status: "org", body: "Renewal and expansion offers, account briefs, customer outreach, and tier-trip notices for the install base." },
    ],
  },
  {
    id: "brand",
    label: "Brand, content, and Solutions",
    skills: [
      { name: "ordergroove-slides", url: skill("plugin_01NVPCP1MHKPY2S73VLECC3f"), status: "org", body: "On-brand Ordergroove decks, as a .pptx that opens in Google Slides." },
      { name: "brand-pack", url: skill("plugin_01GWLnpydaU1236Xyyi13tMb"), status: "org", body: "Pulls a prospect’s logos, colors, fonts, and products into a kit for mockups." },
      { name: "linkedin-post", url: skill("plugin_014aEsntP835p1WLQZ9AgNYi"), status: "shared", body: "Drafts and edits LinkedIn posts for Ordergroove employees." },
      {
        name: "web-video",
        url: skill("plugin_016q9TPZNDY8QZjZxSteUY2o"),
        status: "org",
        body: "Editable web videos rendered to MP4.",
        extra: { label: "How-to", url: "https://claude.ai/artifact/9T5wDXvcCRAqK7oe8hSzb5?sk=xQ90Br2WZ-n3cci05ovZqQ" },
      },
      { name: "internal-handoff", url: skill("plugin_01U9wAX94m9N4QobPZSzaJQX"), status: "shared", body: "A deal handoff deck built from Salesforce, the Technical Proposal, and Slack." },
      {
        name: "ordergroove-shopify-bundles",
        url: skill("plugin_01A118VxwcGzvLFU4xo8k1Kv"),
        status: "org",
        body: "Build-your-own-box bundle subscriptions on Shopify.",
        extra: { label: "One-pager", url: "https://docs.google.com/presentation/d/1GGjmrHXBkB0EZ_ztrgZw2-ni4uUlOD5ARLZ2Of29Oz0/edit" },
      },
    ],
  },
];

/** Org plugins list with the skills of the team that uses them (the Tools & plugins section was cut on 2026-11-13). No install link yet, so their rows point to #og-ai. */
export const ORG_PLUGINS = [
  { name: "ordergroove-platform", team: "CS and account management", body: "Merchant analytics from the Ordergroove BigQuery warehouse, plus a live copy of the dbt data dictionary." },
  { name: "vet-incentives-builder-for-shopify", team: "Brand, content, and Solutions", body: "Checks a Shopify merchant’s storefront before and after go-live on Incentives Builder. For Solutions; uses the Ordergroove MCP." },
];

/** Its skill isn't in the catalog list, so it sits as one line under the Brand group. */
export const OFFER_BUILDER_ONE_PAGER: ResourceLink = {
  label: "Ordergroove Offer Builder Skill one-pager",
  url: "https://drive.google.com/file/d/1DUiqc4DsmoqvptnnrKDhccbJNeFuoZQ3/view",
};

/** Connectors already approved, shown as one line under "Get a new tool approved" (they were rows in the cut Tools & plugins section). */
export const APPROVED_CONNECTORS = "the Salesforce connector (read-only) and Claude for Google Workspace (Sheets and Slides)";

export const HOW_TO_POSTS = [
  { title: "Token-saving tips", url: ogAiPost("1774893684.767989"), byline: "Ethan Jones, Mar 30", body: "Reduce token use in Claude." },
  { title: "Peer reviews with Cowork", url: ogAiPost("1775050558.526889"), byline: "Ethan Jones, Apr 1", body: "Find examples and themes for a teammate’s review." },
  { title: "Self-evaluations with Cowork", url: ogAiPost("1775247880.852659"), byline: "Ethan Jones, Apr 3", body: "Draft a self-evaluation from your work history." },
  { title: "Monday OKR planning prompt for Slackbot", url: ogAiPost("1773071879.927559"), byline: "Ethan Jones, Mar 9", body: "Plan your week around your OKRs." },
  { title: "Scheduled Gong follow-up prompt", url: ogAiPost("1779378538.624079"), byline: "Valentina Miller, May 21", body: "Schedule call summaries and follow-up drafts." },
  { title: "ordergroove-doc and ordergroove-xlsx skills", url: ogAiPost("1785781314.812299"), byline: "Cameron Austin, Aug 3", body: "Create branded Word docs and spreadsheets." },
];
