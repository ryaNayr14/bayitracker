import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Baby, Shield, Users, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setSession } from "@/lib/session";
import { dummyBayi, type Role } from "@/data/dummy";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — Posyandu Ceria" },
      { name: "description", content: "Masuk ke sistem informasi posyandu sebagai admin, kader, atau orang tua." },
    ],
  }),
  component: LoginPage,
});

const ROLES: {
  role: Role;
  title: string;
  desc: string;
  icon: typeof Shield;
  tone: string;
  defaultName: string;
}[] = [
  {
    role: "admin",
    title: "Ketua Posyandu",
    desc: "Kelola data, kader, dan laporan",
    icon: Shield,
    tone: "from-primary to-warning",
    defaultName: "Bu Ketua Rina",
  },
  {
    role: "kader",
    title: "Kader Posyandu",
    desc: "Input penimbangan & imunisasi",
    icon: Users,
    tone: "from-secondary-foreground to-info",
    defaultName: "Bu Sari",
  },
  {
    role: "ortu",
    title: "Orang Tua",
    desc: "Lihat data & pertumbuhan anak",
    icon: Heart,
    tone: "from-warning to-primary",
    defaultName: "Siti Rahayu",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Role | null>(null);
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("demo123");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const finalName = nama.trim() || ROLES.find((r) => r.role === selected)!.defaultName;

    if (selected === "ortu") {
      // Match by parent name to a baby, fallback to first
      const bayi =
        dummyBayi.find((b) => b.namaOrtu.toLowerCase() === finalName.toLowerCase()) ??
        dummyBayi[0];
      setSession({ role: "ortu", nama: bayi.namaOrtu, bayiId: bayi.id });
      navigate({ to: "/ortu" });
      return;
    }

    setSession({ role: selected, nama: finalName });
    navigate({ to: selected === "admin" ? "/admin" : "/kader" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-warm p-5">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-soft">
            <Baby className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">Selamat datang di Posyandu Ceria</h1>
          <p className="mt-2 text-muted-foreground">Pilih peran Anda untuk melanjutkan</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const active = selected === r.role;
            return (
              <button
                key={r.role}
                onClick={() => setSelected(r.role)}
                className={cn(
                  "group rounded-3xl border-2 bg-card p-6 text-left shadow-soft transition-all",
                  active
                    ? "border-primary shadow-card -translate-y-1"
                    : "border-transparent hover:border-border hover:-translate-y-0.5",
                )}
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-primary-foreground shadow-soft",
                    r.tone,
                  )}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                {active && (
                  <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Dipilih <ArrowRight className="h-3 w-3" />
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {selected && (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 max-w-md rounded-3xl border border-border/60 bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-4"
          >
            <h2 className="text-lg font-bold">Masuk sebagai {ROLES.find((r) => r.role === selected)!.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Demo — gunakan nama apa saja</p>

            <div className="mt-5 space-y-4">
              <div>
                <Label htmlFor="nama">Nama</Label>
                <Input
                  id="nama"
                  placeholder={ROLES.find((r) => r.role === selected)!.defaultName}
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="pw">Kata Sandi</Label>
                <Input
                  id="pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-6 w-full rounded-xl">
              Masuk Sekarang
            </Button>

            {selected === "ortu" && (
              <p className="mt-3 text-xs text-muted-foreground">
                Tip: ketik <span className="font-semibold">Dewi Lestari</span> atau{" "}
                <span className="font-semibold">Ratna Sari</span> untuk melihat data anak yang berbeda.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
