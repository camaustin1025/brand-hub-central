import { IconLibrary } from "@/components/brand/IconLibrary";
import { HubShell } from "@/components/hub/HubShell";
import { HeroAction } from "@/components/layout/ChapterHero";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { ICON_LIBRARY_NAV_ID, isWipSection } from "@/data/hub";
import { ICON_COUNT } from "@/data/icon-library";

export default function IconLibraryPage() {
  return (
    <HubShell activeId={ICON_LIBRARY_NAV_ID}>
      <ChapterPage
        navId={ICON_LIBRARY_NAV_ID}
        wip={isWipSection(ICON_LIBRARY_NAV_ID)}
        updated="2026-11-05"
        title="Icon library"
        intro={`All ${ICON_COUNT} Ordergroove icons in every icon color. Pick a background, color and style, then click any icon to download it, or download a whole set as a ZIP.`}
        primaryAction={<HeroAction to="/#icons">How to use icons</HeroAction>}
      >
        <IconLibrary />
      </ChapterPage>
    </HubShell>
  );
}
