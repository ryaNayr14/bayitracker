import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — Posyandu Ceria" },
      { name: "description", content: "Masuk ke sistem informasi posyandu." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp, session, role, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session && role) {
      const dest = role === "admin" ? "/admin" : role === "kader" ? "/kader" : "/ortu";
      navigate({ to: dest });
    }
  }, [loading, session, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (mode === "signin") {
      const { error } = await signIn(email, password);
      if (error) toast.error(error);
      else toast.success("Berhasil masuk");
    } else {
      const { error } = await signUp(email, password, nama || email.split("@")[0]);
      if (error) toast.error(error);
      else toast.success("Akun berhasil dibuat — silakan masuk");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-warm p-5">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-soft">
            <Baby className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Posyandu Ceria</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Masuk ke akun Anda" : "Daftar akun baru"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-border/60 bg-card p-6 shadow-card space-y-4">
          {mode === "signup" && (
            <div>
              <Label>Nama Lengkap</Label>
              <Input required value={nama} onChange={(e) => setNama(e.target.value)} className="rounded-xl" />
            </div>
          )}
          <div>
            <Label>Email</Label>
            <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
          </div>
          <div>
            <Label>Kata Sandi</Label>
            <Input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl" />
          </div>

          <Button type="submit" size="lg" className="w-full rounded-xl" disabled={submitting}>
            {submitting ? "Memproses..." : mode === "signin" ? "Masuk" : "Daftar"}
          </Button>

          <button
            type="button"
            onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
            className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "Belum punya akun? Daftar di sini" : "Sudah punya akun? Masuk"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Akun baru otomatis berperan <b>Orang Tua</b>. Untuk mendapat akses Admin/Kader,
          hubungi pengelola posyandu.
        </p>
      </div>
    </div>
  );
}
