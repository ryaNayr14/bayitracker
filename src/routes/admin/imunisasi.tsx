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
import {
  dummyBayi,
  dummyImunisasi,
  formatTanggal,
  JENIS_IMUNISASI,
  type Imunisasi,
  type ImunisasiJenis,
} from "@/data/dummy";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/imunisasi")({
  component: ImunisasiPage,
});

const adminNav = [
  { to: "/admin", label: "Beranda", icon: <Baby className="h-4 w-4" /> },
  { to: "/admin/bayi", label: "Data Bayi", icon: <Users className="h-4 w-4" /> },
  { to: "/admin/penimbangan", label: "Penimbangan", icon: <ClipboardList className="h-4 w-4" /> },
  { to: "/admin/imunisasi", label: "Imunisasi", icon: <Syringe className="h-4 w-4" /> },
  { to: "/admin/kader", label: "Kelola Kader", icon: <UserCog className="h-4 w-4" /> },
  { to: "/admin/laporan", label: "Laporan", icon: <FileBarChart className="h-4 w-4" /> },
];

function ImunisasiPage() {
  const [list, setList] = useState<Imunisasi[]>(dummyImunisasi);
  const [open, setOpen] = useState(false);
  const [bayiId, setBayiId] = useState("");
  const [jenis, setJenis] = useState<ImunisasiJenis>("Hepatitis B");
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bayiId) return;
    setList((prev) => [{ id: `i${Date.now()}`, bayiId, jenis, tanggal }, ...prev]);
    toast.success("Imunisasi dicatat");
    setOpen(false);
  };

  return (
    <DashboardLayout allowed={["admin"]} nav={adminNav}>
      <PageHeader
        title="Data Imunisasi"
        description="Catatan imunisasi seluruh bayi."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="h-4 w-4" /> Catat Imunisasi
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl">
              <DialogHeader>
                <DialogTitle>Catat Imunisasi</DialogTitle>
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
                      <option key={b.id} value={b.id}>{b.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Jenis Imunisasi</Label>
                  <select
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value as ImunisasiJenis)}
                    className="mt-1 flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    {JENIS_IMUNISASI.map((j) => (
                      <option key={j} value={j}>{j}</option>
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
                <DialogFooter>
                  <Button type="submit" className="rounded-xl">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dummyBayi.map((bayi) => {
          const items = list.filter((i) => i.bayiId === bayi.id);
          const done = items.length;
          return (
            <div key={bayi.id} className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-bold">{bayi.nama}</p>
                  <p className="text-xs text-muted-foreground">
                    {done}/{JENIS_IMUNISASI.length} imunisasi
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {bayi.nama.charAt(0)}
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-gradient-primary transition-all"
                  style={{ width: `${(done / JENIS_IMUNISASI.length) * 100}%` }}
                />
              </div>
              <div className="mt-3 space-y-1 text-xs">
                {items.slice(0, 3).map((i) => (
                  <div key={i.id} className="flex justify-between">
                    <span>{i.jenis}</span>
                    <span className="text-muted-foreground">{formatTanggal(i.tanggal)}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-muted-foreground">+{items.length - 3} lainnya</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
