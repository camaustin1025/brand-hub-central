import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import BrandHub from "@/pages/BrandHub";

const LEGACY_ROUTES: [string, string][] = [
  ["/foundation", "messaging"],
  ["/voice", "voice"],
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
        {LEGACY_ROUTES.map(([path, anchor]) => (
          <Route key={path} path={path} element={<Navigate to={`/#${anchor}`} replace />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
