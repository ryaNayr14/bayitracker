import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-warm px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Halaman tidak ditemukan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Posyandu Ceria — Sistem Informasi Pendataan Bayi" },
      {
        name: "description",
        content:
          "Sistem informasi pendataan bayi posyandu untuk mencatat penimbangan, imunisasi, dan riwayat pertumbuhan.",
      },
      { name: "author", content: "Posyandu Ceria" },
      { property: "og:title", content: "Posyandu Ceria — Sistem Informasi Pendataan Bayi" },
      {
        property: "og:description",
        content: "Pencatatan bayi, penimbangan, dan imunisasi posyandu jadi mudah dan rapi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Posyandu Ceria — Sistem Informasi Pendataan Bayi" },
      { name: "description", content: "Baby Growth Tracker is a web application for digitalizing and managing infant health data." },
      { property: "og:description", content: "Baby Growth Tracker is a web application for digitalizing and managing infant health data." },
      { name: "twitter:description", content: "Baby Growth Tracker is a web application for digitalizing and managing infant health data." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ca85bb03-9440-4f33-a34c-37ef024989a1/id-preview-5c1152d5--5bd488ee-6d4a-42d1-9495-1e0eb0aa1217.lovable.app-1777298622657.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ca85bb03-9440-4f33-a34c-37ef024989a1/id-preview-5c1152d5--5bd488ee-6d4a-42d1-9495-1e0eb0aa1217.lovable.app-1777298622657.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster richColors position="top-right" />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
