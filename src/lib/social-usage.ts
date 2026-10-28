import { supabase } from "@/integrations/supabase/client";
import type { SocialTemplate } from "../data/social-templates";

export type SocialUsagePayload = {
  user_id: string;
  template_id: string;
  template_version: number;
  event: "editor_opened" | "downloaded";
  first_download: boolean;
};
// The insert-only table is pending migration. Keep the generated Database type untouched.
type SocialUsageWriter = {
  from(table: "social_usage_events"): { insert(payload: SocialUsagePayload): PromiseLike<unknown> };
};

export function recordSocialUsage(template: SocialTemplate, userId: string, event: SocialUsagePayload["event"], firstDownload = false): void {
  const payload: SocialUsagePayload = { user_id: userId, template_id: template.id, template_version: template.version, event, first_download: firstDownload };
  try {
    if (template.developmentOnly) { console.info("[social-usage]", payload); return; }
    // Begin independently of rendering and persistence. Both rejection and Supabase error results are ignored.
    void Promise.resolve((supabase as unknown as SocialUsageWriter).from("social_usage_events").insert(payload)).catch(() => {});
  } catch { /* Usage must never interrupt the editor. */ }
}
