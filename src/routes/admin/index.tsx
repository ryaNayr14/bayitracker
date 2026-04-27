import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, ClipboardList, Syringe, FileBarChart, UserCog, Baby } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard, PageHeader } from "@/components/StatCard";
import { dummyBayi, dummyImunisasi, dummyKader, dummyPenimbangan, formatTanggal, hitungUsia } from "@/data/dummy";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const adminNav = [
  { to: "/admin", label: "Beranda", icon: <Baby className="h-4 w-4" /> },
  { to: "/admin/bayi", label: "Data Bayi", icon: <Users className="h-4 w-4" /> },
  { to: "/admin/penimbangan", label: "Penimbangan", icon: <ClipboardList className="h-4 w-4" /> },
  { to: "/admin/imunisasi", label: "Imunisasi", icon: <Syringe className="h-4 w-4" /> },
  { to: "/admin/kader", label: "Kelola Kader", icon: <UserCog className="h-4 w-4" /> },
  { to: "/admin/laporan", label: "Laporan", icon: <FileBarChart className="h-4 w-4" /> },
];

export const ADMIN_NAV = adminNav;

function AdminDashboard() {
  const recentTimbang = [...dummyPenimbangan]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, 5);

  return (
    <DashboardLayout allowed={["admin"]} nav={adminNav}>
      <PageHeader
        title="Beranda Admin"
        description="Ringkasan data posyandu Anda hari ini."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Bayi" value={dummyBayi.length} icon={<Baby className="h-6 w-6" />} tone="primary" />
        <StatCard label="Penimbangan" value={dummyPenimbangan.length} icon={<ClipboardList className="h-6 w-6" />} tone="secondary" />
        <StatCard label="Imunisasi" value={dummyImunisasi.length} icon={<Syringe className="h-6 w-6" />} tone="accent" />
        <StatCard label="Kader Aktif" value={dummyKader.filter((k) => k.aktif).length} hint={`dari ${dummyKader.length} total`} icon={<UserCog className="h-6 w-6" />} tone="info" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Penimbangan Terbaru</h3>
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/admin/penimbangan">Lihat semua</Link>
            </Button>
          </div>
          <div className="space-y-2">
            {recentTimbang.map((p) => {
              const bayi = dummyBayi.find((b) => b.id === p.bayiId);
              if (!bayi) return null;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                      {bayi.nama.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{bayi.nama}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTanggal(p.tanggal)} • {hitungUsia(bayi.tanggalLahir)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{p.beratKg} kg</p>
                    <p className="text-xs text-muted-foreground">{p.tinggiCm} cm</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-bold">Aksi Cepat</h3>
          <div className="space-y-2">
            <Button asChild className="w-full justify-start rounded-xl">
              <Link to="/admin/bayi">
                <Users className="h-4 w-4" /> Tambah Data Bayi
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full justify-start rounded-xl">
              <Link to="/admin/penimbangan">
                <ClipboardList className="h-4 w-4" /> Catat Penimbangan
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start rounded-xl">
              <Link to="/admin/laporan">
                <FileBarChart className="h-4 w-4" /> Buat Laporan
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
