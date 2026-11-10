import { ICON_COLORS } from "@/data/brand-resources";
import { ICON_GLYPH_SIZE, ICON_TILE_SIZE, ICON_TINT_OPACITY, type IconColor } from "@/data/icon-library";
import { PAGE_ICONS, type PageIconName } from "@/data/page-icons";

const BRAND_GREEN = ICON_COLORS.light.find((color) => color.name === "Brand Green")!;

/**
 * The icon library's Tinted treatment, drawn inline: an 80-unit circle at 12% opacity
 * with the glyph centred at 60% of the tile, the same geometry as buildIconSvg. Decorative,
 * so it is hidden from assistive tech; the heading beside it carries the meaning.
 */
export function TintedIcon({
  name,
  color = BRAND_GREEN,
  size = 48,
  className,
}: {
  name: PageIconName;
  color?: IconColor;
  size?: number;
  className?: string;
}) {
  const glyph = PAGE_ICONS[name];
  const r = ICON_TILE_SIZE / 2;
  const offset = (ICON_TILE_SIZE - ICON_GLYPH_SIZE) / 2;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox={`0 0 ${ICON_TILE_SIZE} ${ICON_TILE_SIZE}`}
      className={className}
    >
      <circle cx={r} cy={r} r={r} fill={color.hex} fillOpacity={ICON_TINT_OPACITY} />
      <path transform={`translate(${offset} ${offset})`} fill={color.hex} d={glyph.d} />
    </svg>
  );
}
