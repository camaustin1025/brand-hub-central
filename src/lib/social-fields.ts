import type { SocialField, SocialTemplate } from "../data/social-templates";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function requiredSocialFieldError(field: SocialField, value: string): string | null {
  if (!field.required || value.trim()) return null;
  const action = field.type === "date" || field.type === "choice" ? "Choose a" : "Enter";
  return `${action} ${field.label.toLowerCase()}.`;
}

/** Construct from local calendar parts, never parse a date-only string as UTC. */
export function socialDateParts(value: string): { year: number; month: number; day: number; weekday: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(2000, month - 1, day, 12);
  date.setFullYear(year);
  if (year < 1 || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return { year, month, day, weekday: date.getDay() };
}

/** Null means an invalid nonempty value; empty optional fields draw nothing. */
export function formatSocialField(field: SocialField, value: string): string | null {
  if (!value.trim()) return "";
  if (field.type === "date") {
    const parts = socialDateParts(value);
    if (!parts) return null;
    const { year, month, day, weekday } = parts;
    if (field.dateFormat === "weekday") return `${WEEKDAYS[weekday]}, ${MONTHS[month - 1]} ${day}`;
    return `${field.dateFormat === "short" ? MONTHS[month - 1].slice(0, 3) : MONTHS[month - 1]} ${day}, ${year}`;
  }
  if (field.type === "time") {
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) return null;
    const [hours, minutes] = value.split(":").map(Number);
    return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}${field.timeZoneLabel ? ` ${field.timeZoneLabel}` : ""}`;
  }
  if (field.type === "choice" && !field.options.includes(value)) return null;
  if (field.type === "text" && (field.prefix || field.suffix)) return `${field.prefix ?? ""}${value.trim()}${field.suffix ?? ""}`;
  return value;
}

export function emptySocialFields(template: SocialTemplate, googleName = ""): Record<string, string> {
  return Object.fromEntries(template.fields.map((field) => [field.key, field.type !== "text" ? "" : field.prefill === "googleName" ? googleName : field.defaultValue ?? ""]));
}

export function socialPrimaryValue(template: SocialTemplate, fields: Record<string, string>): string {
  const primary = template.fields.find((field) => field.type === "text" && field.prefill === "googleName") ?? template.fields.find((field) => field.type === "text");
  return primary && Object.prototype.hasOwnProperty.call(fields, primary.key) ? fields[primary.key] : "";
}
