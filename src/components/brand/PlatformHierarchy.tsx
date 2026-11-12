import { Laptop, LockKeyhole, MessageSquare, Package, Repeat2, Sparkles, Store, Target, TrendingUp, UserRoundCheck, UsersRound, Wifi, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PlatformItem = { label: string; icon?: LucideIcon };

// Labels and grouping follow the platform slide supplied on November 12, 2026.
const CHANNELS: { title: string; items: PlatformItem[] }[] = [
  { title: "Traditional Channels", items: [{ label: "ecomm", icon: Laptop }, { label: "Retail", icon: Store }, { label: "SMS", icon: MessageSquare }] },
  { title: "On-Site Agents", items: [{ label: "Sierra" }, { label: "Klaviyo" }, { label: "Gorgias" }] },
  { title: "Assistants", items: [{ label: "OpenAI" }, { label: "Claude" }, { label: "Gemini" }, { label: "Perplexity" }] },
];

const PROVIDER_LOGOS: Record<string, { file: string; width: number; height: number; url: string }> = {
  Sierra: { file: "sierra", width: 116, height: 36, url: "https://sierra.ai" },
  Klaviyo: { file: "klaviyo", width: 581, height: 172, url: "https://www.klaviyo.com" },
  Gorgias: { file: "gorgias", width: 139, height: 37, url: "https://www.gorgias.com" },
  OpenAI: { file: "openai", width: 82, height: 22, url: "https://openai.com" },
  Claude: { file: "claude", width: 573, height: 125, url: "https://claude.com" },
  Gemini: { file: "gemini", width: 288, height: 65, url: "https://gemini.google" },
  Perplexity: { file: "perplexity", width: 149.82, height: 36, url: "https://www.perplexity.ai" },
};

const EXPERIENCES: PlatformItem[] = [
  { label: "Subscriptions", icon: Repeat2 },
  { label: "Memberships", icon: UserRoundCheck },
  { label: "Clubs", icon: Sparkles },
  { label: "Bundles", icon: Package },
  { label: "IoT", icon: Wifi },
  { label: "Digital Access", icon: LockKeyhole },
];

const GROWTH: PlatformItem[] = [
  { label: "Acquire", icon: Target },
  { label: "Retain", icon: UsersRound },
  { label: "Expand", icon: TrendingUp },
];

const AGENTS = ["Payment Agents", "Retention Agent", "Analytics Agent"];
const DEVELOPER = ["APIs", "MCP Server", "Webhooks", "Common Data Model"];

const LAYER = "grid gap-4 p-5 [@container(min-width:44rem)]:grid-cols-[11rem_minmax(0,1fr)] [@container(min-width:44rem)]:items-center [@container(min-width:44rem)]:gap-6";
const CENTERED_LAYER = "grid gap-4 p-5 text-center";

/** Platform layers are static labels; provider logos link to their own websites. */
export function PlatformHierarchy() {
  return (
    <figure className="mt-6" aria-label="Ordergroove platform hierarchy">
      <div className="grid gap-3 [@container(min-width:44rem)]:grid-cols-3">
        {CHANNELS.map((channel) => (
          <div key={channel.title} className="rounded-lg border border-border bg-white px-4 py-5 text-center">
            <h3 className="text-base font-semibold leading-6">{channel.title}</h3>
            <ul className={cn("mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-foreground", channel.title === "Assistants" && "grid grid-cols-2 justify-items-center gap-x-3 [@container(min-width:60rem)]:flex")}>
              {channel.items.map(({ label, icon: Icon }) => {
                const logo = PROVIDER_LOGOS[label];
                return <li key={label} className="inline-flex items-center gap-1.5">
                  {logo ? <a href={logo.url} target="_blank" rel="noopener noreferrer" className="action-focus tap-target inline-flex h-8 items-center justify-center rounded-sm">
                    <img src={`/platform-logos/${logo.file}.svg`} alt={label} width={logo.width} height={logo.height} className={cn("w-auto object-contain", channel.title === "Assistants" ? "h-4" : "h-5")} />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a> : <>{Icon && <Icon size={16} className="shrink-0" aria-hidden="true" />}{label}</>}
                </li>;
              })}
            </ul>
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="hidden h-4 grid-cols-3 justify-items-center [@container(min-width:44rem)]:grid">
        {CHANNELS.map((channel) => <span key={channel.title} className="h-full w-px bg-border" />)}
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-white [@container(min-width:44rem)]:mt-0">
        <div className="border-b border-border px-5 py-4 text-center">
          <h3 className="reference-item-title flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <img src="/working-canvas/logo-light-bg.svg" alt="Ordergroove" className="h-6 w-auto" />
            <span>Platform</span>
          </h3>
        </div>

        <ol className="divide-y divide-border">
          <li className="relative p-5">
            <div className="mb-4 text-center [@container(min-width:60rem)]:absolute [@container(min-width:60rem)]:left-1/2 [@container(min-width:60rem)]:top-1/2 [@container(min-width:60rem)]:mb-0 [@container(min-width:60rem)]:w-44 [@container(min-width:60rem)]:-translate-x-1/2 [@container(min-width:60rem)]:-translate-y-1/2">
              <h4 className="reference-item-title">Experiences</h4>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">Seamlessly integrated</p>
            </div>
            <ul className="grid grid-cols-2 gap-2 [@container(min-width:36rem)]:grid-cols-3 [@container(min-width:60rem)]:grid-cols-[repeat(3,minmax(0,1fr))_11rem_repeat(3,minmax(0,1fr))]" aria-label="Experiences">
              {EXPERIENCES.map(({ label, icon: Icon }, index) => (
                <li key={label} className={cn("flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-white px-2 py-3 text-center text-[13px] font-semibold leading-5 text-foreground", index === 3 && "[@container(min-width:60rem)]:col-start-5")}>
                  {Icon && <Icon size={18} className="text-primary" aria-hidden="true" />}
                  {label}
                </li>
              ))}
            </ul>
          </li>

          <li className={`${CENTERED_LAYER} bg-primary/[0.04]`}>
            <h4 className="reference-item-title">Growth Engine</h4>
            <ul className="mx-auto grid w-full max-w-[42rem] gap-2 [@container(min-width:24rem)]:grid-cols-3" aria-label="Growth Engine">
              {GROWTH.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center justify-center gap-2 rounded-full bg-og-midnight px-4 py-2.5 text-sm font-semibold text-white">
                  {Icon && <Icon size={18} className="shrink-0 text-og-green" aria-hidden="true" />}
                  {label}
                </li>
              ))}
            </ul>
          </li>

          <li className={`${CENTERED_LAYER} bg-primary/[0.06]`}>
            <h4 className="reference-item-title">Ordergroove AI</h4>
            <ul className="mx-auto grid w-full max-w-[42rem] gap-2 [@container(min-width:24rem)]:grid-cols-3" aria-label="Ordergroove AI">
              {AGENTS.map((agent) => (
                <li key={agent} className="flex items-center justify-center rounded-md border border-primary/20 bg-white px-3 py-3 text-center text-[13px] font-semibold leading-5 text-foreground">{agent}</li>
              ))}
            </ul>
          </li>

          <li className={`${LAYER} dark bg-og-midnight text-white`}>
            <h4 className="reference-item-title">Developer Platform</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm leading-6 [@container(min-width:60rem)]:grid-cols-4" aria-label="Developer Platform">
              {DEVELOPER.map((part) => <li key={part}>{part}</li>)}
            </ul>
          </li>
        </ol>
      </div>
    </figure>
  );
}
