import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import BrandHub from "@/pages/BrandHub";
import Foundation from "@/pages/Foundation";
import Voice from "@/pages/Voice";
import HeroLab from "@/pages/HeroLab";
import { AuthGate } from "@/components/auth/AuthGate";
import { employeeSectionId } from "@/data/employee-launch";

/** Sections that still live inline on the single-page hub. */
const LEGACY_ROUTES: [string, string][] = [
  ["/visual-identity", "color"],
  ["/downloads", "downloads"],
  ["/tokens", "tokens"],
  ["/toolkit", "toolkit"],
  ["/ai-skills", "ai-skills"],
];

export default function App() {
  return (
    <ErrorBoundary>
      <AuthGate>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<BrandHub />} />
        <Route path="/foundation" element={<Foundation />} />
        <Route path="/voice" element={<Voice />} />
        {/* Design exploration only — not linked from nav. */}
        <Route path="/hero-lab" element={<HeroLab />} />
        {LEGACY_ROUTES.map(([path, anchor]) => (
          <Route key={path} path={path} element={<Navigate to={`/#${employeeSectionId(anchor)}`} replace />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AuthGate>
    </ErrorBoundary>
  );
}
