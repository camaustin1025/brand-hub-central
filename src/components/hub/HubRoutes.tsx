import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import Changelog from "@/pages/Changelog";
import BrandHub from "@/pages/BrandHub";
import Foundation from "@/pages/Foundation";
import Voice from "@/pages/Voice";
import AiResources from "@/pages/AiResources";
import DesignCanvas from "@/pages/DesignCanvas";
import IconLibraryPage from "@/pages/IconLibrary";
import HeroLab from "@/pages/HeroLab";
import LayoutLab from "@/pages/LayoutLab";
import ButtonLab from "@/pages/ButtonLab";
import ZoomBackgrounds from "@/pages/ZoomBackgrounds";
import { employeeSectionId } from "@/data/employee-launch";
import AdminGuests from "@/pages/AdminGuests";
import { useAccess } from "@/hooks/use-access";
import { ASSETS, assetAnchor } from "@/data/assets";
import { DESIGN_CANVAS_PATH, isDisabledSection, designCanvasTemplatePath, ICON_LIBRARY_PATH, NEW_EMPLOYEE_PATH, RESOURCE_PAGE_PATHS, sectionPagePath, ZOOM_BACKGROUNDS_PATH } from "@/data/hub";

const SocialCustomizer = lazy(() => import("@/pages/SocialCustomizer"));

/** Routes whose content still lives on the homepage. */
const LEGACY_ROUTES: [string, string][] = [
  ["/visual-identity", "color"],
  ["/downloads", "downloads"],
  ["/tokens", "tokens"],
];

/** Old homepage anchors for assets that now live on their own page (Zoom backgrounds). */
function movedAssetPage(hash: string) {
  const asset = ASSETS.find((entry) => hash === `#${assetAnchor(entry.id)}`);
  return asset && sectionPagePath(asset.section);
}

function HomeRoute() {
  const { hash, search } = useLocation();
  const movedPage = Object.entries(RESOURCE_PAGE_PATHS).find(([id]) => hash === `#${id}`)?.[1];
  if (movedPage) return <Navigate to={{ pathname: movedPage, search }} replace />;
  const assetPage = movedAssetPage(hash);
  return assetPage ? <Navigate to={{ pathname: assetPage, search, hash }} replace /> : <BrandHub />;
}

/** Editor links from before the toolkit became Design canvas. */
function ToolkitGraphicRoute() {
  const { templateId = "" } = useParams<{ templateId: string }>();
  return <Navigate to={designCanvasTemplatePath(templateId)} replace />;
}

/** Shared route inventory. App keeps this entire tree inside AuthGate. */
export function HubRoutes() {
  const access = useAccess();
  const isGuest = access === "guest";
  return (
    <Routes>
      {access === "admin" && <Route path="/admin/guests" element={<AdminGuests />} />}
      <Route path="/" element={<HomeRoute />} />
      {!isGuest && <Route path="/employee-resources" element={<Navigate to="/" replace />} />}
      {!isGuest && <Route path="/team-culture" element={<Navigate to="/" replace />} />}
      <Route path="/changelog" element={<Changelog />} />
      <Route path="/foundation" element={<Foundation />} />
      {/* Voice & language is paused on the live site; dev builds keep it for editing. */}
      <Route path="/voice" element={import.meta.env.DEV || !isDisabledSection("voice") ? <Voice /> : <Navigate to="/" replace />} />
      {/* Guests are view-only, so the graphic editor and its downloads stay staff-only. */}
      {!isGuest && <Route path={DESIGN_CANVAS_PATH} element={<DesignCanvas />} />}
      {!isGuest && <Route path={`${DESIGN_CANVAS_PATH}/:templateId`} element={
        <Suspense fallback={<p role="status" className="p-6">Loading graphic...</p>}>
          <SocialCustomizer />
        </Suspense>
      } />}
      {!isGuest && <Route path={ICON_LIBRARY_PATH} element={<IconLibraryPage />} />}
      {/* Downloads only, and guests can't download, so staff-only like the icon library. */}
      {!isGuest && <Route path={ZOOM_BACKGROUNDS_PATH} element={<ZoomBackgrounds />} />}
      <Route path="/toolkit" element={<Navigate to={DESIGN_CANVAS_PATH} replace />} />
      <Route path="/toolkit/social/:templateId" element={<ToolkitGraphicRoute />} />
      {/* Internal links (Slack, Confluence, security policy), so staff-only like Design canvas. */}
      {!isGuest && <Route path={RESOURCE_PAGE_PATHS["ai-skills"]} element={<AiResources />} />}
      {/* Links into staff-only pages (graphic editor, Zoom backgrounds, AI resources), so staff-only too. */}
      {!isGuest && <Route path={NEW_EMPLOYEE_PATH} element={<Navigate to="/" replace />} />}
      <Route path="/ai-skills" element={<Navigate to={RESOURCE_PAGE_PATHS["ai-skills"]} replace />} />
      {/* The ladder layout now lives on /foundation; keep old preview links working. */}
      <Route path="/foundation-preview" element={<Navigate to="/foundation" replace />} />
      {/* Design exploration only, not linked from navigation. */}
      <Route path="/hero-lab" element={<HeroLab />} />
      <Route path="/layout-lab" element={<LayoutLab />} />
      <Route path="/button-lab" element={<ButtonLab />} />
      {LEGACY_ROUTES.map(([path, anchor]) => (
        <Route key={path} path={path} element={<Navigate to={`/#${employeeSectionId(anchor)}`} replace />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
