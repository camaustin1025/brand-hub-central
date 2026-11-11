/** Temporary employee-launch holds. Keep draft content until it is ready to release. */
export const HELD_SECTION_REDIRECTS: Record<string, string> = {
  tokens: "color",
  // Existing Quick reference bookmarks now lead to the asset library.
  "quick-reference": "downloads",
  // Gradients moved to Color & gradients; the logo section kept the rest.
  "logo-gradients": "logo",
};

export function employeeSectionId(id: string) {
  return Object.prototype.hasOwnProperty.call(HELD_SECTION_REDIRECTS, id) ? HELD_SECTION_REDIRECTS[id] : id;
}

export function isEmployeeSectionVisible(id: string) {
  return employeeSectionId(id) === id;
}
