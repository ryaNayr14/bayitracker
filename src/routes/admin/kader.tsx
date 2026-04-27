import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Baby, Users, ClipboardList, Syringe, FileBarChart, UserCog } from "lucide-react";
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
import { dummyKader } from "@/data/dummy";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/kader")({
  component: KaderPage,
});

const adminNav = [
  { to: "/admin", label: "Beranda", icon: <Baby className="h-4 w-4" /> },
  { to: "/admin/bayi", label: "Data Bayi", icon: <Users className="h-4 w-4" /> },
  { to: "/admin/penimbangan", label: "Penimbangan", icon: <ClipboardList className="h-4 w-4" /> },
  { to: "/admin/imunisasi", label: "Imunisasi", icon: <Syringe className="h-4 w-4" /> },
  { to: "/admin/kader", label: "Kelola Kader", icon: <UserCog className="h-4 w-4" /> },
  { to: "/admin/laporan", label: "Laporan", icon: <FileBarChart className="h-4 w-4" /> },
];

type Kader = (typeof dummyKader)[number];

function KaderPage() {
  const [list, setList] = useState<Kader[]>(dummyKader);
  const [open, setOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setList((p) => [...p, { id: `k${Date.now()}`, nama, telepon, aktif: true }]);
    toast.success("Kader ditambahkan");
    setOpen(false);
    setNama("");
    setTelepon("");
  };

  return (
    <DashboardLayout allowed={["admin"]} nav={adminNav}>
      <PageHeader
        title="Kelola Kader"
        description="Daftar kader posyandu yang terdaftar di sistem."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="h-4 w-4" /> Tambah Kader
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl">
              <DialogHeader>
                <DialogTitle>Tambah Kader</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <Label>Nama</Label>
                  <Input required value={nama} onChange={(e) => setNama(e.target.value)} className="rounded-xl" />
                </div>
                <div>
                  <Label>No. Telepon</Label>
                  <Input value={telepon} onChange={(e) => setTelepon(e.target.value)} className="rounded-xl" />
                </div>
                <DialogFooter>
                  <Button type="submit" className="rounded-xl">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((k) => (
          <div key={k.id} className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-lg font-bold text-secondary-foreground">
                  {k.nama.split(" ").pop()?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{k.nama}</p>
                  <p className="text-xs text-muted-foreground">{k.telepon}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl text-destructive hover:bg-destructive/10"
                onClick={() => {
                  setList((p) => p.filter((x) => x.id !== k.id));
                  toast.success("Kader dihapus");
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <span
              className={`mt-3 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                k.aktif ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
              }`}
            >
              {k.aktif ? "Aktif" : "Nonaktif"}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
