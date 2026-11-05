import { Link } from "react-router-dom";
import { IconLibrary } from "@/components/brand/IconLibrary";
import { HubShell } from "@/components/hub/HubShell";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { ICON_LIBRARY_NAV_ID, isWipSection } from "@/data/hub";
import { ICON_COUNT } from "@/data/icon-library";

const LINK_CLASS = "action-focus inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4";

export default function IconLibraryPage() {
  return (
    <HubShell activeId={ICON_LIBRARY_NAV_ID}>
      <ChapterPage
        wip={isWipSection(ICON_LIBRARY_NAV_ID)}
        title="Icon library"
        intro={`All ${ICON_COUNT} Ordergroove icons in every icon color. Pick a background, color and style, then click any icon to download it, or download a whole set as a ZIP.`}
      >
        <div className="-mt-6 mb-8 flex flex-wrap gap-x-5">
          <Link to="/#icons" className={LINK_CLASS}>How to use icons</Link>
        </div>
        <IconLibrary />
      </ChapterPage>
    </HubShell>
  );
}
