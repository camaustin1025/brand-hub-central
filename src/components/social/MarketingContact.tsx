import { MARKETING_CONTACT } from "@/data/brand-resources";

export function MarketingContact() {
  return <p className="text-sm text-foreground">Need something different? <a href={MARKETING_CONTACT.url} target="_blank" rel="noopener noreferrer" className="action-focus inline-flex min-h-11 items-center underline underline-offset-4">Ping {MARKETING_CONTACT.label} in Slack.</a></p>;
}
