import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import BrandHub from "@/pages/BrandHub";
import Foundation from "@/pages/Foundation";
import Voice from "@/pages/Voice";
import AiResources from "@/pages/AiResources";
import DesignCanvas from "@/pages/DesignCanvas";
import HeroLab from "@/pages/HeroLab";
import LayoutLab from "@/pages/LayoutLab";
import { employeeSectionId } from "@/data/employee-launch";
import AdminGuests from "@/pages/AdminGuests";
import { useAccess } from "@/hooks/use-access";
import { DESIGN_CANVAS_PATH, designCanvasTemplatePath, RESOURCE_PAGE_PATHS } from "@/data/hub";

const SocialCustomizer = lazy(() => import("@/pages/SocialCustomizer"));

/** Routes whose content still lives on the homepage. */
const LEGACY_ROUTES: [string, string][] = [
  ["/visual-identity", "color"],
  ["/downloads", "downloads"],
  ["/tokens", "tokens"],
];

function HomeRoute() {
  const { hash, search } = useLocation();
  const movedPage = Object.entries(RESOURCE_PAGE_PATHS).find(([id]) => hash === `#${id}`)?.[1];
  return movedPage ? <Navigate to={{ pathname: movedPage, search }} replace /> : <BrandHub />;
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
      <Route path="/foundation" element={<Foundation />} />
      <Route path="/voice" element={<Voice />} />
      {/* Guests are view-only, so the graphic editor and its downloads stay staff-only. */}
      {!isGuest && <Route path={DESIGN_CANVAS_PATH} element={<DesignCanvas />} />}
      {!isGuest && <Route path={`${DESIGN_CANVAS_PATH}/:templateId`} element={
        <Suspense fallback={<p role="status" className="p-6">Loading graphic...</p>}>
          <SocialCustomizer />
        </Suspense>
      } />}
      <Route path="/toolkit" element={<Navigate to={DESIGN_CANVAS_PATH} replace />} />
      <Route path="/toolkit/social/:templateId" element={<ToolkitGraphicRoute />} />
      <Route path={RESOURCE_PAGE_PATHS["ai-skills"]} element={<AiResources />} />
      <Route path="/ai-skills" element={<Navigate to={RESOURCE_PAGE_PATHS["ai-skills"]} replace />} />
      {/* Design exploration only, not linked from navigation. */}
      <Route path="/hero-lab" element={<HeroLab />} />
      <Route path="/layout-lab" element={<LayoutLab />} />
      {LEGACY_ROUTES.map(([path, anchor]) => (
        <Route key={path} path={path} element={<Navigate to={`/#${employeeSectionId(anchor)}`} replace />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
