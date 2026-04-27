import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Syringe, ClipboardList, Baby, Check } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  dummyBayi,
  dummyImunisasi,
  formatTanggal,
  hitungUsia,
  JENIS_IMUNISASI,
  type ImunisasiJenis,
} from "@/data/dummy";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kader/imunisasi")({
  component: KaderImunisasi,
});

const kaderNav = [
  { to: "/kader", label: "Beranda", icon: <Baby className="h-4 w-4" /> },
  { to: "/kader/penimbangan", label: "Catat Penimbangan", icon: <ClipboardList className="h-4 w-4" /> },
  { to: "/kader/imunisasi", label: "Catat Imunisasi", icon: <Syringe className="h-4 w-4" /> },
];

function KaderImunisasi() {
  const [bayiId, setBayiId] = useState(dummyBayi[0].id);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [selected, setSelected] = useState<ImunisasiJenis | null>(null);

  const bayi = dummyBayi.find((b) => b.id === bayiId)!;
  const sudah = dummyImunisasi.filter((i) => i.bayiId === bayiId);

  const submit = () => {
    if (!selected) return;
    toast.success(`${selected} dicatat untuk ${bayi.nama}`);
    setSelected(null);
  };

  return (
    <DashboardLayout allowed={["kader"]} nav={kaderNav}>
      <PageHeader title="Catat Imunisasi" description="Pilih bayi dan jenis imunisasi yang diberikan." />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <div className="space-y-4">
            <div>
              <Label>Pilih Bayi</Label>
              <select
                value={bayiId}
                onChange={(e) => {
                  setBayiId(e.target.value);
                  setSelected(null);
                }}
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
            <Button
              disabled={!selected}
              onClick={submit}
              size="lg"
              className="w-full rounded-xl"
            >
              <Check className="h-5 w-5" /> Catat {selected ?? "Imunisasi"}
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card lg:col-span-2">
          <h3 className="mb-4 text-lg font-bold">Pilih Jenis Imunisasi</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {JENIS_IMUNISASI.map((j) => {
              const done = sudah.find((i) => i.jenis === j);
              const active = selected === j;
              return (
                <button
                  key={j}
                  type="button"
                  disabled={!!done}
                  onClick={() => setSelected(j)}
                  className={cn(
                    "rounded-2xl border-2 p-3 text-left transition-all",
                    done
                      ? "cursor-not-allowed border-success/30 bg-success/10"
                      : active
                        ? "border-primary bg-primary/10 shadow-soft -translate-y-0.5"
                        : "border-border bg-background hover:border-primary/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{j}</span>
                    {done && (
                      <span className="text-xs font-semibold text-success">
                        ✓ {formatTanggal(done.tanggal)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
