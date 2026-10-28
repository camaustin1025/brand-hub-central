import path from "node:path";
import { existsSync } from "node:fs";
import { PUBLISHED_SOCIAL_TEMPLATES, SOCIAL_ASSETS, SOCIAL_FONT_FILES } from "../src/data/social-templates";
import { SOCIAL_TEMPLATE_FIXTURES, SOCIAL_FIXTURE_ASSETS } from "../src/data/social-template-fixture";
import { validateSocialTemplates } from "../src/lib/social-template-validation";

export function socialTemplateBuildErrors(publicDirectory: string): string[] {
  const errors = [
    ...validateSocialTemplates(PUBLISHED_SOCIAL_TEMPLATES, SOCIAL_ASSETS),
    ...validateSocialTemplates(SOCIAL_TEMPLATE_FIXTURES, SOCIAL_FIXTURE_ASSETS, true),
  ];
  for (const file of [...Object.values(SOCIAL_ASSETS), ...Object.values(SOCIAL_FONT_FILES)]) {
    if (!/^\/(?!\/)[a-zA-Z0-9/_ .-]+$/.test(file) || file.split("/").includes("..") || !existsSync(path.resolve(publicDirectory, file.slice(1)))) errors.push(`Missing or unsafe social template asset: ${file}`);
  }
  return errors;
}
