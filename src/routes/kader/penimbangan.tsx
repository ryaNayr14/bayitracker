import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClipboardList, Syringe, Baby, Save } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dummyBayi, dummyPenimbangan, formatTanggal, hitungUsia } from "@/data/dummy";
import { toast } from "sonner";

export const Route = createFileRoute("/kader/penimbangan")({
  component: KaderPenimbangan,
});

const kaderNav = [
  { to: "/kader", label: "Beranda", icon: <Baby className="h-4 w-4" /> },
  { to: "/kader/penimbangan", label: "Catat Penimbangan", icon: <ClipboardList className="h-4 w-4" /> },
  { to: "/kader/imunisasi", label: "Catat Imunisasi", icon: <Syringe className="h-4 w-4" /> },
];

function KaderPenimbangan() {
  const [bayiId, setBayiId] = useState(dummyBayi[0].id);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [berat, setBerat] = useState("");
  const [tinggi, setTinggi] = useState("");

  const bayi = dummyBayi.find((b) => b.id === bayiId)!;
  const riwayat = dummyPenimbangan
    .filter((p) => p.bayiId === bayiId)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Penimbangan ${bayi.nama} disimpan`);
    setBerat("");
    setTinggi("");
  };

  return (
    <DashboardLayout allowed={["kader"]} nav={kaderNav}>
      <PageHeader title="Catat Penimbangan" description="Input berat dan tinggi badan bayi." />

      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={submit} className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <div className="space-y-4">
            <div>
              <Label>Pilih Bayi</Label>
              <select
                value={bayiId}
                onChange={(e) => setBayiId(e.target.value)}
                className="mt-1 flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {dummyBayi.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nama} ({hitungUsia(b.tanggalLahir)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Tanggal</Label>
              <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="rounded-xl h-11" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Berat (kg)</Label>
                <Input
                  required
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={berat}
                  onChange={(e) => setBerat(e.target.value)}
                  className="rounded-xl h-11 text-lg font-semibold"
                />
              </div>
              <div>
                <Label>Tinggi (cm)</Label>
                <Input
                  required
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={tinggi}
                  onChange={(e) => setTinggi(e.target.value)}
                  className="rounded-xl h-11 text-lg font-semibold"
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full rounded-xl">
              <Save className="h-5 w-5" /> Simpan Penimbangan
            </Button>
          </div>
        </form>

        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="mb-1 text-lg font-bold">Riwayat {bayi.nama}</h3>
          <p className="mb-4 text-sm text-muted-foreground">{hitungUsia(bayi.tanggalLahir)}</p>
          {riwayat.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada riwayat</p>
          ) : (
            <div className="space-y-2">
              {riwayat.map((p) => (
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
      </div>
    </DashboardLayout>
  );
}
