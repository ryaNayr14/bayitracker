import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Calendar, MapPin, Phone, Baby } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GrafikPertumbuhan } from "@/components/GrafikPertumbuhan";
import { PageHeader } from "@/components/StatCard";
import {
  dummyBayi,
  dummyImunisasi,
  dummyPenimbangan,
  formatTanggal,
  hitungUsia,
  JENIS_IMUNISASI,
  type Bayi,
} from "@/data/dummy";
import { getSession } from "@/lib/session";

export const Route = createFileRoute("/ortu/")({
  component: OrtuHome,
});

const ortuNav = [
  { to: "/ortu", label: "Beranda", icon: <Heart className="h-4 w-4" /> },
];

function OrtuHome() {
  const navigate = useNavigate();
  const [bayi, setBayi] = useState<Bayi | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "ortu") {
      navigate({ to: "/login" });
      return;
    }
    const b = dummyBayi.find((x) => x.id === s.bayiId) ?? dummyBayi[0];
    setBayi(b);
  }, [navigate]);

  if (!bayi) return null;

  const penimbangan = dummyPenimbangan
    .filter((p) => p.bayiId === bayi.id)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  const imunisasi = dummyImunisasi.filter((i) => i.bayiId === bayi.id);
  const last = penimbangan[0];
  const cakupanImun = ((imunisasi.length / JENIS_IMUNISASI.length) * 100).toFixed(0);

  return (
    <DashboardLayout allowed={["ortu"]} nav={ortuNav}>
      <PageHeader title={`Hai, ${bayi.namaOrtu}!`} description={`Pantau pertumbuhan ${bayi.nama} di sini.`} />

      <div className="rounded-[2rem] bg-gradient-primary p-6 shadow-card md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-card text-3xl font-bold text-primary shadow-soft">
              {bayi.nama.charAt(0)}
            </div>
            <div className="text-primary-foreground">
              <p className="text-2xl font-bold">{bayi.nama}</p>
              <p className="opacity-90">
                {bayi.jenisKelamin === "P" ? "Perempuan" : "Laki-laki"} • {hitungUsia(bayi.tanggalLahir)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <Stat label="Berat" value={last ? `${last.beratKg}` : "—"} unit="kg" />
            <Stat label="Tinggi" value={last ? `${last.tinggiCm}` : "—"} unit="cm" />
            <Stat label="Imunisasi" value={cakupanImun} unit="%" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-bold">Profil</h3>
          <div className="space-y-3 text-sm">
            <Row icon={<Baby className="h-4 w-4" />} label="Nama" value={bayi.nama} />
            <Row icon={<Calendar className="h-4 w-4" />} label="Tanggal Lahir" value={formatTanggal(bayi.tanggalLahir)} />
            <Row icon={<Heart className="h-4 w-4" />} label="Orang Tua" value={bayi.namaOrtu} />
            <Row icon={<MapPin className="h-4 w-4" />} label="Alamat" value={bayi.alamat} />
            <Row icon={<Phone className="h-4 w-4" />} label="Telepon" value={bayi.telepon} />
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card lg:col-span-2">
          <h3 className="mb-3 text-lg font-bold">Grafik Pertumbuhan</h3>
          <GrafikPertumbuhan bayi={bayi} />
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
          <h3 className="mb-4 text-lg font-bold">Status Imunisasi</h3>
          <div className="space-y-1">
            {JENIS_IMUNISASI.map((j) => {
              const done = imunisasi.find((i) => i.jenis === j);
              return (
                <div key={j} className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-muted/40">
                  <span className="text-sm">{j}</span>
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

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-2xl bg-card/95 p-3 text-center shadow-soft">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xl font-bold text-primary">
        {value}
        <span className="ml-0.5 text-xs font-medium text-muted-foreground">{unit}</span>
      </p>
    </div>
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
