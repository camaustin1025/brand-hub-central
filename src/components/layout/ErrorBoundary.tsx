import { Component, type ReactNode } from "react";

/**
 * Top-level error boundary so a single failing component degrades to a
 * recoverable message instead of white-screening the whole hub.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Log for the dev console; a real logger/GA4 error event slots in here.
    console.error("Brand hub error boundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
          <p className="eyebrow mb-3">Something broke</p>
          <h1 className="text-3xl font-extrabold">This section hit a snag</h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Try reloading the page. If it keeps happening, flag it to Brand &amp;
            Content.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
