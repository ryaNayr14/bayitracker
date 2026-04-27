import { createFileRoute } from "@tanstack/react-router";
import { Download, Baby, Users, ClipboardList, Syringe, FileBarChart, UserCog, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import {
  dummyBayi,
  dummyImunisasi,
  dummyPenimbangan,
  formatTanggal,
  hitungUsia,
  JENIS_IMUNISASI,
} from "@/data/dummy";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/admin/laporan")({
  component: LaporanPage,
});

const adminNav = [
  { to: "/admin", label: "Beranda", icon: <Baby className="h-4 w-4" /> },
  { to: "/admin/bayi", label: "Data Bayi", icon: <Users className="h-4 w-4" /> },
  { to: "/admin/penimbangan", label: "Penimbangan", icon: <ClipboardList className="h-4 w-4" /> },
  { to: "/admin/imunisasi", label: "Imunisasi", icon: <Syringe className="h-4 w-4" /> },
  { to: "/admin/kader", label: "Kelola Kader", icon: <UserCog className="h-4 w-4" /> },
  { to: "/admin/laporan", label: "Laporan", icon: <FileBarChart className="h-4 w-4" /> },
];

function LaporanPage() {
  const total = dummyBayi.length;
  const lk = dummyBayi.filter((b) => b.jenisKelamin === "L").length;
  const pr = dummyBayi.filter((b) => b.jenisKelamin === "P").length;

  const cakupan = JENIS_IMUNISASI.map((j) => ({
    nama: j.length > 12 ? j.substring(0, 12) + "…" : j,
    Jumlah: dummyImunisasi.filter((i) => i.jenis === j).length,
  }));

  const handleDownload = () => {
    const rows = [
      ["Nama", "Tgl Lahir", "Usia", "JK", "Orang Tua", "Telepon"].join(","),
      ...dummyBayi.map((b) =>
        [b.nama, b.tanggalLahir, hitungUsia(b.tanggalLahir), b.jenisKelamin, b.namaOrtu, b.telepon].join(","),
      ),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan-bayi.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Laporan diunduh");
  };

  return (
    <DashboardLayout allowed={["admin"]} nav={adminNav}>
      <PageHeader
        title="Laporan Posyandu"
        description="Ringkasan dan ekspor data untuk pelaporan."
        actions={
          <Button onClick={handleDownload} className="rounded-xl">
            <Download className="h-4 w-4" /> Unduh CSV
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <p className="text-sm text-muted-foreground">Total Bayi</p>
          <p className="mt-1 text-4xl font-bold text-primary">{total}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl bg-info/10 p-3">
              <p className="text-xs text-muted-foreground">Laki-laki</p>
              <p className="text-xl font-bold text-info">{lk}</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <p className="text-xs text-muted-foreground">Perempuan</p>
              <p className="text-xl font-bold text-primary">{pr}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <p className="text-sm text-muted-foreground">Total Penimbangan</p>
          <p className="mt-1 text-4xl font-bold text-info">{dummyPenimbangan.length}</p>
          <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Rata-rata{" "}
            {(dummyPenimbangan.length / total).toFixed(1)} penimbangan/bayi
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <p className="text-sm text-muted-foreground">Total Imunisasi</p>
          <p className="mt-1 text-4xl font-bold text-success">{dummyImunisasi.length}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            Cakupan{" "}
            {((dummyImunisasi.length / (total * JENIS_IMUNISASI.length)) * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-border/60 bg-card p-6 shadow-card">
        <h3 className="mb-4 text-lg font-bold">Cakupan Imunisasi</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cakupan} margin={{ top: 5, right: 16, left: -10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="nama" stroke="var(--muted-foreground)" fontSize={11} angle={-30} textAnchor="end" />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="Jumlah" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card">
        <div className="border-b border-border/60 px-6 py-4">
          <h3 className="font-bold">Ringkasan Data Bayi</h3>
        </div>
        <table className="w-full">
          <thead className="bg-muted/50 text-left text-sm">
            <tr>
              <th className="px-5 py-3 font-semibold">Nama</th>
              <th className="px-5 py-3 font-semibold">Tgl Lahir</th>
              <th className="px-5 py-3 font-semibold">Usia</th>
              <th className="px-5 py-3 font-semibold">Penimbangan</th>
              <th className="px-5 py-3 font-semibold">Imunisasi</th>
            </tr>
          </thead>
          <tbody>
            {dummyBayi.map((b) => (
              <tr key={b.id} className="border-t border-border/60 text-sm">
                <td className="px-5 py-3 font-semibold">{b.nama}</td>
                <td className="px-5 py-3">{formatTanggal(b.tanggalLahir)}</td>
                <td className="px-5 py-3">{hitungUsia(b.tanggalLahir)}</td>
                <td className="px-5 py-3">{dummyPenimbangan.filter((p) => p.bayiId === b.id).length}x</td>
                <td className="px-5 py-3">
                  {dummyImunisasi.filter((i) => i.bayiId === b.id).length}/{JENIS_IMUNISASI.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
