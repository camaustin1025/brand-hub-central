import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import Home from "@/pages/Home";
import Foundation from "@/pages/Foundation";
import Voice from "@/pages/Voice";
import VisualIdentity from "@/pages/VisualIdentity";
import Downloads from "@/pages/Downloads";
import Tokens from "@/pages/Tokens";
import Toolkit from "@/pages/Toolkit";
import AISkills from "@/pages/AISkills";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/foundation" element={<Foundation />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/visual-identity" element={<VisualIdentity />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/toolkit" element={<Toolkit />} />
          <Route path="/ai-skills" element={<AISkills />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  );
}
