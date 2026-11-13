/**
 * Figtree type canon. The homepage specimen and the token kits both read this
 * file, so a change here updates the page and every copy-and-paste kit together.
 */

export const FONT_FAMILY = ["Figtree", "system-ui", "sans-serif"];

/** Every bundled Figtree weight, each rendered in itself. */
export const TYPE_WEIGHTS = [
  { name: "Regular", value: 400 },
  { name: "Medium", value: 500 },
  { name: "SemiBold", value: 600 },
  { name: "Bold", value: 700 },
  { name: "ExtraBold", value: 800 },
];

export type TypeLevel = {
  /** Token name in the kits. */
  id: string;
  role: string;
  spec: string;
  note?: string;
  sample: string;
  className: string;
  /** Desktop size; the specimen and kits share it. */
  size: string;
  /** Smaller size for phones, when canon gives a range. */
  mobileSize?: string;
  weight: number;
  lineHeight: number;
  letterSpacing?: string;
  uppercase?: boolean;
};

/**
 * Canon 5.3 web hierarchy, set at true size. Character limits come from the
 * hero pattern (6.4); the four-line body note is salvaged from the old hub.
 */
export const TYPE_HIERARCHY: TypeLevel[] = [
  {
    id: "eyebrow",
    role: "Eyebrow",
    spec: "12px · SemiBold 600",
    note: "ALL CAPS, 0.16em letter-spacing",
    sample: "Brand guidelines",
    className: "eyebrow",
    size: "12px",
    weight: 600,
    lineHeight: 1.33,
    letterSpacing: "0.16em",
    uppercase: true,
  },
  {
    id: "headline",
    role: "Headline",
    spec: "40 to 44px · ExtraBold 800",
    note: "Sentence case",
    sample: "Make it look like Ordergroove",
    className: "text-[40px] font-extrabold leading-[1.08] tracking-tight [text-wrap:balance] md:text-[44px]",
    size: "44px",
    mobileSize: "40px",
    weight: 800,
    lineHeight: 1.08,
    letterSpacing: "-0.025em",
  },
  {
    id: "subhead",
    role: "Subhead",
    spec: "21px · Regular 400",
    sample: "Clear words. Consistent design",
    className: "text-[21px] leading-[1.45]",
    size: "21px",
    weight: 400,
    lineHeight: 1.45,
  },
  {
    id: "body",
    role: "Body",
    spec: "15px · Regular 400",
    sample: "Write clearly. Let evidence carry the message.",
    className: "measure text-[15px] leading-[1.65]",
    size: "15px",
    weight: 400,
    lineHeight: 1.65,
  },
];
