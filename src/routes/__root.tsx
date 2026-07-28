import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  redirect,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { checkUnlocked } from "@/lib/gate.functions";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/layout/Header";
import { SideRail } from "@/components/layout/SideNav";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/unlock") return;
    const { unlocked } = await checkUnlocked();
    if (!unlocked) {
      throw redirect({ to: "/unlock" });
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ordergroove Brand Hub" },
      {
        name: "description",
        content:
          "The internal home for the Ordergroove brand: guidelines, downloadable assets, design tokens, and the tools to stay on brand.",
      },
      { name: "author", content: "Ordergroove Brand & Content" },
      { property: "og:title", content: "Ordergroove Brand Hub" },
      {
        property: "og:description",
        content:
          "The internal home for the Ordergroove brand: guidelines, downloadable assets, design tokens, and the tools to stay on brand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ordergroove Brand Hub" },
      {
        name: "twitter:description",
        content:
          "The internal home for the Ordergroove brand: guidelines, downloadable assets, design tokens, and the tools to stay on brand.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e47fb426-4814-4f56-820a-635cbd06b34b/id-preview-03722999--15e6b569-db8a-4eb5-aa3d-6b31bb6801ec.lovable.app-1784814836980.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e47fb426-4814-4f56-820a-635cbd06b34b/id-preview-03722999--15e6b569-db8a-4eb5-aa3d-6b31bb6801ec.lovable.app-1784814836980.png",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/logomark.png", type: "image/png" },
      // Material Symbols — the brand icon set, requested at the ratified axes.
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/*
          Stamps the side nav's collapsed state before first paint. Without it a
          user who collapsed the rail gets a 192px layout jump on every full
          page load, because React only learns the stored preference in an
          effect. The CSS var carries the width, so this one attribute is
          enough — see --sidenav in styles.css.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("og-sidenav")==="icon")document.documentElement.dataset.sidenav="icon"}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Full-bleed surfaces that render without the site header/footer: the admin
  // app and the unlock gate (nav chrome there is just non-functional clutter).
  const isBare = pathname.startsWith("/admin") || pathname === "/unlock";

  return (
    <QueryClientProvider client={queryClient}>
      {isBare ? (
        <Outlet />
      ) : (
        <div className="flex min-h-screen flex-col">
          {/*
            Skip link — roughly 50 focusable elements sit between the page top
            and the content on a route like Home. Visually hidden until it takes
            keyboard focus, then it pins to the top-left as a Midnight chip.
          */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-og-midnight focus:px-5 focus:py-3 focus:text-xs focus:font-bold focus:uppercase focus:tracking-[0.16em] focus:text-og-green"
          >
            Skip to content
          </a>
          <Header />
          {/*
            `items-start` so the rail sizes to its own sticky height rather than
            stretching to the row; `min-w-0` so a wide table inside a route
            cannot push the rail off its track.

            The pane is the container query context: the hero marquee is sized
            against the width it actually has, not the viewport, which is what
            "full bleed" means once a rail owns the left edge.
          */}
          <div className="flex flex-1 items-start">
            <SideRail />
            <main id="main" tabIndex={-1} className="min-w-0 flex-1 [container-type:inline-size]">
              <Outlet />
            </main>
          </div>
          <Footer />
        </div>
      )}
      <Toaster />
    </QueryClientProvider>
  );
}
