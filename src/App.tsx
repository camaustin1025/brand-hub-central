import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import BrandHub from "@/pages/BrandHub";
import Foundation from "@/pages/Foundation";
import Voice from "@/pages/Voice";

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
      <Routes>
        <Route path="/" element={<BrandHub />} />
        <Route path="/foundation" element={<Foundation />} />
        <Route path="/voice" element={<Voice />} />
        {LEGACY_ROUTES.map(([path, anchor]) => (
          <Route key={path} path={path} element={<Navigate to={`/#${anchor}`} replace />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
