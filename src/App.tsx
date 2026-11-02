import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { AuthGate } from "@/components/auth/AuthGate";
import { HubRoutes } from "@/components/hub/HubRoutes";
import { GuestMode } from "@/components/auth/GuestMode";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthGate>
        <GuestMode />
        <ScrollToTop />
        <HubRoutes />
      </AuthGate>
    </ErrorBoundary>
  );
}
