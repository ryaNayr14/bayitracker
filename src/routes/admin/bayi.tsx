import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, Baby, Users, ClipboardList, Syringe, FileBarChart, UserCog } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dummyBayi, formatTanggal, hitungUsia, type Bayi } from "@/data/dummy";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bayi")({
  component: BayiPage,
});

const adminNav = [
  { to: "/admin", label: "Beranda", icon: <Baby className="h-4 w-4" /> },
  { to: "/admin/bayi", label: "Data Bayi", icon: <Users className="h-4 w-4" /> },
  { to: "/admin/penimbangan", label: "Penimbangan", icon: <ClipboardList className="h-4 w-4" /> },
  { to: "/admin/imunisasi", label: "Imunisasi", icon: <Syringe className="h-4 w-4" /> },
  { to: "/admin/kader", label: "Kelola Kader", icon: <UserCog className="h-4 w-4" /> },
  { to: "/admin/laporan", label: "Laporan", icon: <FileBarChart className="h-4 w-4" /> },
];

function BayiPage() {
  const [list, setList] = useState<Bayi[]>(dummyBayi);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Bayi | null>(null);

  const filtered = useMemo(
    () =>
      list.filter(
        (b) =>
          b.nama.toLowerCase().includes(q.toLowerCase()) ||
          b.namaOrtu.toLowerCase().includes(q.toLowerCase()),
      ),
    [list, q],
  );

  const handleSave = (data: Omit<Bayi, "id">) => {
    if (editing) {
      setList((prev) => prev.map((b) => (b.id === editing.id ? { ...editing, ...data } : b)));
      toast.success("Data bayi diperbarui");
    } else {
      const newBayi: Bayi = { id: `b${Date.now()}`, ...data };
      setList((prev) => [newBayi, ...prev]);
      toast.success("Data bayi ditambahkan");
    }
    setOpen(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    setList((prev) => prev.filter((b) => b.id !== id));
    toast.success("Data bayi dihapus");
  };

  return (
    <DashboardLayout allowed={["admin"]} nav={adminNav}>
      <PageHeader
        title="Data Bayi"
        description="Kelola seluruh data bayi yang terdaftar di posyandu."
        actions={
          <Dialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v);
              if (!v) setEditing(null);
            }}
          >
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="h-4 w-4" /> Tambah Bayi
              </Button>
            </DialogTrigger>
            <BayiForm initial={editing} onSave={handleSave} />
          </Dialog>
        }
      />

      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft">
        <Search className="ml-2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Cari nama bayi atau orang tua..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 text-left text-sm">
              <tr>
                <th className="px-5 py-3 font-semibold">Nama</th>
                <th className="px-5 py-3 font-semibold">Usia</th>
                <th className="px-5 py-3 font-semibold">JK</th>
                <th className="px-5 py-3 font-semibold">Orang Tua</th>
                <th className="px-5 py-3 font-semibold">Telepon</th>
                <th className="px-5 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t border-border/60 text-sm hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <Link to="/admin/bayi/$id" params={{ id: b.id }} className="font-semibold hover:text-primary">
                      {b.nama}
                    </Link>
                    <p className="text-xs text-muted-foreground">Lahir {formatTanggal(b.tanggalLahir)}</p>
                  </td>
                  <td className="px-5 py-3">{hitungUsia(b.tanggalLahir)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        b.jenisKelamin === "P"
                          ? "bg-primary/15 text-primary"
                          : "bg-info/15 text-info"
                      }`}
                    >
                      {b.jenisKelamin === "P" ? "Perempuan" : "Laki-laki"}
                    </span>
                  </td>
                  <td className="px-5 py-3">{b.namaOrtu}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.telepon}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                        onClick={() => {
                          setEditing(b);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(b.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

function BayiForm({
  initial,
  onSave,
}: {
  initial: Bayi | null;
  onSave: (data: Omit<Bayi, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Bayi, "id">>(
    initial ?? {
      nama: "",
      tanggalLahir: "",
      jenisKelamin: "P",
      namaOrtu: "",
      alamat: "",
      telepon: "",
    },
  );

  return (
    <DialogContent className="rounded-3xl">
      <DialogHeader>
        <DialogTitle>{initial ? "Ubah Data Bayi" : "Tambah Data Bayi"}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="space-y-4"
      >
        <div>
          <Label>Nama Bayi</Label>
          <Input
            required
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Tanggal Lahir</Label>
            <Input
              required
              type="date"
              value={form.tanggalLahir}
              onChange={(e) => setForm({ ...form, tanggalLahir: e.target.value })}
              className="rounded-xl"
            />
          </div>
          <div>
            <Label>Jenis Kelamin</Label>
            <select
              value={form.jenisKelamin}
              onChange={(e) =>
                setForm({ ...form, jenisKelamin: e.target.value as "L" | "P" })
              }
              className="mt-1 flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="P">Perempuan</option>
              <option value="L">Laki-laki</option>
            </select>
          </div>
        </div>
        <div>
          <Label>Nama Orang Tua</Label>
          <Input
            required
            value={form.namaOrtu}
            onChange={(e) => setForm({ ...form, namaOrtu: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div>
          <Label>Alamat</Label>
          <Input
            value={form.alamat}
            onChange={(e) => setForm({ ...form, alamat: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div>
          <Label>No. Telepon</Label>
          <Input
            value={form.telepon}
            onChange={(e) => setForm({ ...form, telepon: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <DialogFooter>
          <Button type="submit" className="rounded-xl">
            Simpan
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
