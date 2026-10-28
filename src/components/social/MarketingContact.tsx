export const MARKETING_CONTACT_URL: string | null = null;

export function MarketingContact() {
  return <p className="text-sm text-muted-foreground">Need something different? {MARKETING_CONTACT_URL
    ? <a href={MARKETING_CONTACT_URL} className="action-focus underline underline-offset-4">Reach out to Marketing.</a>
    : "Reach out to Marketing."}</p>;
}
