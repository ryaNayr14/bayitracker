import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Baby, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession, clearSession, roleLabel, type DemoSession } from "@/lib/session";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: ReactNode };

export function DashboardLayout({
  allowed,
  nav,
  children,
}: {
  allowed: DemoSession["role"][];
  nav: NavItem[];
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const router = useRouter();
  const [session, setSessionState] = useState<DemoSession | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s || !allowed.includes(s.role)) {
      navigate({ to: "/login" });
      return;
    }
    setSessionState(s);
  }, [allowed, navigate]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-warm">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  const currentPath = router.state.location.pathname;

  return (
    <div className="flex min-h-screen bg-gradient-warm">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 transform border-r border-sidebar-border bg-sidebar p-5 transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link to="/" className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary shadow-soft">
            <Baby className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-base font-bold leading-tight">Posyandu Ceria</p>
            <p className="text-xs text-muted-foreground">Sistem Informasi Bayi</p>
          </div>
        </Link>

        <div className="mb-6 rounded-2xl bg-accent/60 p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Masuk sebagai</p>
          <p className="mt-1 font-semibold text-accent-foreground">{session.nama}</p>
          <p className="text-xs text-muted-foreground">{roleLabel(session.role)}</p>
        </div>

        <nav className="space-y-1">
          {nav.map((item) => {
            const active = currentPath === item.to || currentPath.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => {
              clearSession();
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/70 px-5 py-4 backdrop-blur lg:hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-soft"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
              <Baby className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Posyandu Ceria</span>
          </div>
          <div className="w-10" />
        </header>

        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm lg:hidden"
          />
        )}

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
