import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Baby, Users, ClipboardList, Syringe, FileBarChart, UserCog, Calendar, MapPin, Phone, Heart } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GrafikPertumbuhan, TabelInterpretasiKMS } from "@/components/GrafikPertumbuhan";
import {
  dummyBayi,
  dummyImunisasi,
  dummyPenimbangan,
  formatTanggal,
  hitungUsia,
  JENIS_IMUNISASI,
} from "@/data/dummy";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/bayi/$id")({
  component: BayiDetail,
});

const adminNav = [
  { to: "/admin", label: "Beranda", icon: <Baby className="h-4 w-4" /> },
  { to: "/admin/bayi", label: "Data Bayi", icon: <Users className="h-4 w-4" /> },
  { to: "/admin/penimbangan", label: "Penimbangan", icon: <ClipboardList className="h-4 w-4" /> },
  { to: "/admin/imunisasi", label: "Imunisasi", icon: <Syringe className="h-4 w-4" /> },
  { to: "/admin/kader", label: "Kelola Kader", icon: <UserCog className="h-4 w-4" /> },
  { to: "/admin/laporan", label: "Laporan", icon: <FileBarChart className="h-4 w-4" /> },
];

function BayiDetail() {
  const { id } = useParams({ from: "/admin/bayi/$id" });
  const bayi = dummyBayi.find((b) => b.id === id);

  if (!bayi) {
    return (
      <DashboardLayout allowed={["admin"]} nav={adminNav}>
        <p>Bayi tidak ditemukan.</p>
      </DashboardLayout>
    );
  }

  const penimbangan = dummyPenimbangan
    .filter((p) => p.bayiId === id)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  const imunisasi = dummyImunisasi.filter((i) => i.bayiId === id);

  return (
    <DashboardLayout allowed={["admin"]} nav={adminNav}>
      <Button asChild variant="ghost" className="mb-4 rounded-xl">
        <Link to="/admin/bayi">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      </Button>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-primary-foreground shadow-soft ${
              bayi.jenisKelamin === "P" ? "bg-gradient-primary" : "bg-gradient-to-br from-info to-secondary-foreground"
            }`}
          >
            {bayi.nama.charAt(0)}
          </div>
          <h2 className="mt-4 text-2xl font-bold">{bayi.nama}</h2>
          <p className="text-sm text-muted-foreground">
            {bayi.jenisKelamin === "P" ? "Perempuan" : "Laki-laki"} • {hitungUsia(bayi.tanggalLahir)}
          </p>

          <div className="mt-5 space-y-3 text-sm">
            <Row icon={<Calendar className="h-4 w-4" />} label="Tanggal Lahir" value={formatTanggal(bayi.tanggalLahir)} />
            <Row icon={<Heart className="h-4 w-4" />} label="Orang Tua" value={bayi.namaOrtu} />
            <Row icon={<MapPin className="h-4 w-4" />} label="Alamat" value={bayi.alamat} />
            <Row icon={<Phone className="h-4 w-4" />} label="Telepon" value={bayi.telepon} />
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card lg:col-span-2">
          <div className="mb-3">
            <h3 className="text-lg font-bold">Grafik KMS (Berat menurut Umur)</h3>
            <p className="text-xs text-muted-foreground">
              Standar WHO · Pita hijau = normal (-2 s/d +2 SD), kuning = waspada, di luar = perlu rujukan
            </p>
          </div>
          <GrafikPertumbuhan bayi={bayi} />
          <div className="mt-4 border-t border-border/60 pt-4">
            <h4 className="mb-2 text-sm font-bold">Interpretasi N/T per Penimbangan</h4>
            <TabelInterpretasiKMS bayi={bayi} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-bold">Riwayat Penimbangan</h3>
          {penimbangan.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada penimbangan</p>
          ) : (
            <div className="space-y-2">
              {penimbangan.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
                  <p className="text-sm font-medium">{formatTanggal(p.tanggal)}</p>
                  <div className="flex gap-4 text-sm">
                    <span><b className="text-primary">{p.beratKg}</b> kg</span>
                    <span><b className="text-info">{p.tinggiCm}</b> cm</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-bold">Riwayat Imunisasi</h3>
          <div className="space-y-1.5">
            {JENIS_IMUNISASI.map((jenis) => {
              const done = imunisasi.find((i) => i.jenis === jenis);
              return (
                <div
                  key={jenis}
                  className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-muted/40"
                >
                  <span className="text-sm">{jenis}</span>
                  {done ? (
                    <span className="rounded-full bg-success/15 px-3 py-0.5 text-xs font-semibold text-success">
                      ✓ {formatTanggal(done.tanggal)}
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-3 py-0.5 text-xs text-muted-foreground">
                      Belum
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
