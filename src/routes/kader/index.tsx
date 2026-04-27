import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Syringe, Baby, Search, Plus } from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard, PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dummyBayi, dummyImunisasi, dummyPenimbangan, hitungUsia, JENIS_IMUNISASI } from "@/data/dummy";

export const Route = createFileRoute("/kader/")({
  component: KaderHome,
});

const kaderNav = [
  { to: "/kader", label: "Beranda", icon: <Baby className="h-4 w-4" /> },
  { to: "/kader/penimbangan", label: "Catat Penimbangan", icon: <ClipboardList className="h-4 w-4" /> },
  { to: "/kader/imunisasi", label: "Catat Imunisasi", icon: <Syringe className="h-4 w-4" /> },
];

function KaderHome() {
  const [q, setQ] = useState("");
  const filtered = dummyBayi.filter(
    (b) => b.nama.toLowerCase().includes(q.toLowerCase()) || b.namaOrtu.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <DashboardLayout allowed={["kader"]} nav={kaderNav}>
      <PageHeader
        title="Beranda Kader"
        description="Pilih bayi untuk mencatat penimbangan atau imunisasi."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Bayi Terdaftar" value={dummyBayi.length} icon={<Baby className="h-6 w-6" />} tone="primary" />
        <StatCard
          label="Penimbangan Bulan Ini"
          value={dummyPenimbangan.length}
          icon={<ClipboardList className="h-6 w-6" />}
          tone="secondary"
        />
        <StatCard
          label="Imunisasi Bulan Ini"
          value={dummyImunisasi.length}
          icon={<Syringe className="h-6 w-6" />}
          tone="accent"
        />
      </div>

      <div className="mt-6 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-card p-3 shadow-soft min-w-[260px]">
          <Search className="ml-2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Cari bayi..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
        <Button asChild className="rounded-xl">
          <Link to="/kader/penimbangan"><Plus className="h-4 w-4" /> Catat Cepat</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => {
          const lastTimbang = [...dummyPenimbangan]
            .filter((p) => p.bayiId === b.id)
            .sort((a, x) => x.tanggal.localeCompare(a.tanggal))[0];
          const imunCount = dummyImunisasi.filter((i) => i.bayiId === b.id).length;
          return (
            <div key={b.id} className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-primary-foreground ${
                    b.jenisKelamin === "P" ? "bg-gradient-primary" : "bg-gradient-to-br from-info to-secondary-foreground"
                  }`}
                >
                  {b.nama.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{b.nama}</p>
                  <p className="text-xs text-muted-foreground">
                    {hitungUsia(b.tanggalLahir)} • {b.namaOrtu}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl bg-muted/40 p-2">
                  <p className="text-muted-foreground">Berat terakhir</p>
                  <p className="mt-0.5 text-base font-bold text-primary">
                    {lastTimbang ? `${lastTimbang.beratKg} kg` : "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/40 p-2">
                  <p className="text-muted-foreground">Imunisasi</p>
                  <p className="mt-0.5 text-base font-bold text-success">
                    {imunCount}/{JENIS_IMUNISASI.length}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button asChild variant="secondary" size="sm" className="rounded-xl">
                  <Link to="/kader/penimbangan">Timbang</Link>
                </Button>
                <Button asChild size="sm" className="rounded-xl">
                  <Link to="/kader/imunisasi">Imunisasi</Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
