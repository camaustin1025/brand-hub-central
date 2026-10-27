import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { AuthGate } from "@/components/auth/AuthGate";
import { HubRoutes } from "@/components/hub/HubRoutes";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthGate>
        <ScrollToTop />
        <HubRoutes />
      </AuthGate>
    </ErrorBoundary>
  );
}
