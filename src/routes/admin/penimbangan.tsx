import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Baby, Users, ClipboardList, Syringe, FileBarChart, UserCog } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { dummyBayi, dummyPenimbangan, formatTanggal, type Penimbangan } from "@/data/dummy";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/penimbangan")({
  component: PenimbanganPage,
});

const adminNav = [
  { to: "/admin", label: "Beranda", icon: <Baby className="h-4 w-4" /> },
  { to: "/admin/bayi", label: "Data Bayi", icon: <Users className="h-4 w-4" /> },
  { to: "/admin/penimbangan", label: "Penimbangan", icon: <ClipboardList className="h-4 w-4" /> },
  { to: "/admin/imunisasi", label: "Imunisasi", icon: <Syringe className="h-4 w-4" /> },
  { to: "/admin/kader", label: "Kelola Kader", icon: <UserCog className="h-4 w-4" /> },
  { to: "/admin/laporan", label: "Laporan", icon: <FileBarChart className="h-4 w-4" /> },
];

function PenimbanganPage() {
  const [list, setList] = useState<Penimbangan[]>(dummyPenimbangan);
  const [open, setOpen] = useState(false);
  const [bayiId, setBayiId] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [berat, setBerat] = useState("");
  const [tinggi, setTinggi] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bayiId) return;
    setList((prev) => [
      {
        id: `p${Date.now()}`,
        bayiId,
        tanggal,
        beratKg: parseFloat(berat),
        tinggiCm: parseFloat(tinggi),
      },
      ...prev,
    ]);
    toast.success("Penimbangan ditambahkan");
    setOpen(false);
    setBayiId("");
    setBerat("");
    setTinggi("");
  };

  const sorted = [...list].sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  return (
    <DashboardLayout allowed={["admin"]} nav={adminNav}>
      <PageHeader
        title="Data Penimbangan"
        description="Riwayat seluruh hasil penimbangan bayi."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="h-4 w-4" /> Catat Penimbangan
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl">
              <DialogHeader>
                <DialogTitle>Catat Penimbangan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <Label>Bayi</Label>
                  <select
                    required
                    value={bayiId}
                    onChange={(e) => setBayiId(e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Pilih bayi</option>
                    {dummyBayi.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Tanggal</Label>
                  <Input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Berat (kg)</Label>
                    <Input
                      required
                      type="number"
                      step="0.1"
                      value={berat}
                      onChange={(e) => setBerat(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Tinggi (cm)</Label>
                    <Input
                      required
                      type="number"
                      step="0.1"
                      value={tinggi}
                      onChange={(e) => setTinggi(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="rounded-xl">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card">
        <table className="w-full">
          <thead className="bg-muted/50 text-left text-sm">
            <tr>
              <th className="px-5 py-3 font-semibold">Tanggal</th>
              <th className="px-5 py-3 font-semibold">Bayi</th>
              <th className="px-5 py-3 font-semibold">Berat</th>
              <th className="px-5 py-3 font-semibold">Tinggi</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const bayi = dummyBayi.find((b) => b.id === p.bayiId);
              return (
                <tr key={p.id} className="border-t border-border/60 text-sm hover:bg-muted/30">
                  <td className="px-5 py-3">{formatTanggal(p.tanggal)}</td>
                  <td className="px-5 py-3 font-semibold">{bayi?.nama ?? "—"}</td>
                  <td className="px-5 py-3"><b className="text-primary">{p.beratKg}</b> kg</td>
                  <td className="px-5 py-3"><b className="text-info">{p.tinggiCm}</b> cm</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
