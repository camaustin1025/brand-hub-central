/**
 * Working at OG: mission, values, holidays, Rippling, and perks & benefits.
 * Source: People team copy and the "Perks & Benefits" page (People Resources & Culture Hub), 2026-11-12.
 *
 * A link with no `href` still needs its URL from the People team. It renders as plain
 * text with a "Link needed" badge, so nothing points at a dead or guessed address.
 */

import type { PageIconName } from "./page-icons";

export const MISSION = "Putting relationships at the center of commerce to help merchants thrive";

/** Copy matches "How we show up each day" on ordergroove.com/careers. Each sentence renders on its own line. */
export const VALUES: { title: string; icon: PageIconName; body: string[] }[] = [
  { title: "What you see is what you get", icon: "visibility", body: ["We are authentic, passionate, and humble.", "We always act with respect and integrity."] },
  { title: "We’re in it to win it", icon: "trophy", body: ["We are scrappy, positive, and will go the extra mile together to get things done."] },
  { title: "We drive results", icon: "rocket_launch", body: ["We are problem solvers who desire to make an impact.", "We ask questions and propose solutions."] },
  { title: "We’re comfortable being uncomfortable", icon: "experiment", body: ["We bravely go into the unknown.", "We embrace change, and fail and learn fast."] },
];

export const HOLIDAYS_YEAR = 2026;

export const HOLIDAYS = [
  { name: "Martin Luther King Jr. Day", date: "Monday, January 19" },
  { name: "Presidents’ Day", date: "Monday, February 16" },
  { name: "Memorial Day", date: "Monday, May 25" },
  { name: "Juneteenth", date: "Friday, June 19" },
  { name: "4th of July (observed)", date: "Friday, July 3" },
  { name: "Labor Day", date: "Monday, September 7" },
  { name: "Thanksgiving", date: "Thursday, November 26 & Friday, November 27" },
  { name: "Refresh Week", date: "Thursday, December 24 through Friday, January 1" },
];

export const HOLIDAY_FLEX = {
  title: "Holiday flexibility for our global team",
  body: [
    "Because we’re a globally distributed team and not all public holidays are the same everywhere, we offer holiday flexibility so team members can observe important local holidays while maintaining consistent coverage across the business.",
    "Team members based outside the US may choose to swap up to 5 of the company holidays listed here for locally-recognized, public holidays in their country of residence. Therefore, the total number of paid holidays remains the same for all team members.",
  ],
  rulesIntro: "Holiday swaps for team members located outside the US must:",
  rules: [
    "Be for official public holidays",
    "Be approved by the team member’s manager to ensure coverage",
    "Be communicated in advance",
  ],
};

export const RIPPLING = {
  url: "https://app.rippling.com/dashboard",
  body: "Ordergroove’s first comprehensive Human Resources Information System (HRIS) that serves as a centralized platform for managing core people processes across the organization in one place. The platform manages information for all team members (US employees, non-US employees, and contractors).",
};

export type BenefitLink = { label: string; href?: string };

export const PEOPLE_HUB: BenefitLink = { label: "People Resources & Culture Hub", href: "https://ordergroove.slack.com/docs/T2V7W6KL4/F08UTNTB63E" };

/** One run of text inside a benefit's details. Links and phone numbers stay inline. */
export type Inline = string | { link: BenefitLink } | { tel: string } | { em: string };

export type Benefit = {
  name: string;
  /** Paragraphs of inline runs. */
  details: Inline[][];
  /** Optional bulleted steps after the paragraphs. */
  list?: { intro?: string; items: Inline[][] };
  /** Small print after everything else. */
  note?: string;
  links?: BenefitLink[];
  audience: "Insperity users" | "All Ordergroove team members" | "All Ordergroove employees";
};

export const INSPERITY: BenefitLink = { label: "Insperity account", href: "https://portal.insperity.com/" };

const insperity = (lead: string): Inline[] => [lead, { link: INSPERITY }, "."];

export const BENEFIT_GROUPS: { id: string; title: string; benefits: Benefit[] }[] = [
  {
    id: "health-wellness",
    title: "Health and wellness",
    benefits: [
      {
        name: "2026 health benefits",
        details: [],
        links: [{ label: "2026 Benefits at a Glance", href: "https://drive.google.com/file/d/151Poh-sO2AJUvmEK6Hj75taN1_QDCWFL/view?usp=sharing" }],
        audience: "Insperity users",
      },
      {
        name: "Healthcare Flexible Spending Account (FSA)",
        details: [
          ["Insperity Health Care FSA allows you to set aside current earnings pretax for reimbursement of health care expenses during the year, reducing your taxable income."],
          insperity("For more info, log into your "),
        ],
        audience: "Insperity users",
      },
      {
        name: "Life & personal accident insurance",
        details: [
          ["Eligible team members are automatically enrolled in OG-paid Life and Personal Accident Insurance. Team members may also opt into additional life and personal accident insurance at their own cost."],
          insperity("See your plan coverage details in your "),
        ],
        audience: "Insperity users",
      },
      {
        name: "Disability insurance",
        details: [
          ["Team members may opt to enroll in disability insurance at their own cost."],
          insperity("See more details in your "),
        ],
        audience: "Insperity users",
      },
      {
        name: "Employee Assistance Program",
        details: [
          ["The Insperity Employee Assistance Program provides unlimited phone and online confidential support, counseling, customized resources and referrals, along with practical information on hundreds of work and home life topics."],
          insperity("For more info, see your "),
        ],
        audience: "Insperity users",
      },
      {
        name: "Calm app",
        details: [["The Calm app can help you tackle stress, get a good night’s sleep and feel more present in your life. It’s one of the most popular apps worldwide, and it’s available at no cost to you as part of your benefits."]],
        links: [{ label: "Calm flyer (PDF)", href: "https://ordergroove.slack.com/files/U07HGNK3VJ5/F092H033WPM/insperity_optum_calm_flyer_08152024_high.pdf" }],
        audience: "Insperity users",
      },
      {
        name: "Boon Health",
        details: [["Free, 1:1 coaching for professional development, stress, burnout, and more."]],
        audience: "All Ordergroove team members",
      },
    ],
  },
  {
    id: "family-benefits",
    title: "Family benefits",
    benefits: [
      {
        name: "Parental leave",
        details: [["We offer paid child bonding leave for birthing and non-birthing parents (6 weeks), as well as paid childbirth recovery leave for birthing parents, for a total of up to 12 weeks of paid leave."]],
        links: [{ label: "Parental leave policy", href: "https://docs.google.com/document/d/1vgr6YdvVkoXXxf-fPxxiCsyWzUptGo_L/edit" }],
        audience: "All Ordergroove employees",
      },
      {
        name: "Adoption Assistance Program",
        details: [
          ["Insperity Adoption Assistance Program reimburses an eligible employee up to $1,500 for adoption expenses."],
          insperity("For more information, view your "),
        ],
        audience: "Insperity users",
      },
    ],
  },
  {
    id: "financial-benefits",
    title: "Financial benefits",
    benefits: [
      {
        name: "Retirement plan",
        details: [["Team members can enroll in a 401(k) plan in one of two ways."]],
        list: {
          items: [
            [
              { em: "By phone: " },
              "Call the Insperity 401(k) Contact Center at ",
              { tel: "888-401-5273" },
              ". The Voice Response Unit (VRU) lets you get personal account information and make transactions. For some services, you’ll need to speak with a Contact Center specialist, available business days from 7 a.m. to 7 p.m. Central time.",
            ],
            [{ em: "Online: " }, "Access the ", { link: { label: "Retirement Service Center", href: "https://portalapps.insperity.com/3rdPartyRetirementServices/Launch.aspx" } }, "."],
          ],
        },
        note: "Plan deductions generally begin within 1 to 2 payroll periods after enrollment. At this time, Ordergroove does not have a matching program.",
        links: [{ label: "401(k) page in Insperity", href: "https://portal.insperity.com/cs/nsp/SitePage/insperity_401_k__plan_information" }, { label: "401(k) Plan Essentials flyer (PDF)", href: "https://ordergroove.slack.com/files/U07HGNK3VJ5/F092QAKH99C/401k_plan_essentials.pdf" }],
        audience: "Insperity users",
      },
      {
        name: "Productivity allowance",
        details: [],
        links: [{ label: "Productivity Allowance Policy", href: "https://docs.google.com/document/d/1nxY31JF1QT5lsCyhWMpfHd_1ybPjcc2clrCBbYqT8Uk/edit?tab=t.0" }],
        audience: "All Ordergroove employees",
      },
      {
        name: "Relationship Commerce allowance",
        details: [["Expense $60 per year toward physical subscription goods. When submitting the expense in Ramp, select “Company Culture (All Teams).”"]],
        list: {
          intro: "For Ramp users (US employees), code your reimbursements this way:",
          items: [
            [{ em: "Memo: " }, "“relationship commerce allowance: brief description of purchase”"],
            [{ em: "QuickBooks category: " }, "Company Culture (All Teams)"],
            [{ em: "QuickBooks class: " }, "Corporate"],
          ],
        },
        audience: "All Ordergroove employees",
      },
    ],
  },
];
