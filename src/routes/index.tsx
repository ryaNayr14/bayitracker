import { createFileRoute, Link } from "@tanstack/react-router";
import { Baby, Heart, Users, ClipboardList, Syringe, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-posyandu.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Posyandu Ceria — Sistem Informasi Pendataan Bayi" },
      {
        name: "description",
        content:
          "Sistem informasi pendataan bayi posyandu untuk mencatat penimbangan, imunisasi, dan riwayat pertumbuhan dengan mudah.",
      },
      { property: "og:title", content: "Posyandu Ceria — Sistem Informasi Pendataan Bayi" },
      {
        property: "og:description",
        content:
          "Pencatatan bayi, penimbangan, dan imunisasi posyandu jadi mudah, terstruktur, dan rapi.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary shadow-soft">
              <Baby className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-base font-bold leading-tight">Posyandu Ceria</p>
              <p className="text-xs text-muted-foreground">Sistem Informasi Bayi</p>
            </div>
          </div>
          <Button asChild className="rounded-full">
            <Link to="/login">Masuk</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-16 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-secondary-foreground">
              <Heart className="h-3.5 w-3.5" /> Untuk Posyandu Modern
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Pendataan bayi yang{" "}
              <span className="bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                mudah & rapi
              </span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Catat penimbangan, imunisasi, dan pantau pertumbuhan setiap bayi di posyandu Anda.
              Cepat, terstruktur, dan dapat diakses kapan saja oleh admin, kader, dan orang tua.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/login">Mulai Sekarang</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <a href="#fitur">Lihat Fitur</a>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { v: "100+", l: "Data bayi" },
                { v: "3", l: "Peran pengguna" },
                { v: "11", l: "Jenis imunisasi" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-card p-4 shadow-soft">
                  <p className="text-2xl font-bold text-primary">{s.v}</p>
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-primary opacity-20 blur-3xl" />
            <img
              src={heroImage}
              alt="Ilustrasi ibu dan bayi di posyandu"
              width={1280}
              height={960}
              className="relative rounded-[2rem] border-4 border-card shadow-card"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="mx-auto max-w-6xl px-5 pb-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Semua yang dibutuhkan posyandu</h2>
          <p className="mt-3 text-muted-foreground">
            Fitur lengkap untuk pencatatan dan pemantauan tumbuh kembang bayi.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <Users className="h-6 w-6" />,
              title: "Data Bayi & Orang Tua",
              desc: "Simpan biodata bayi dan informasi orang tua dalam satu tempat yang aman.",
              tone: "bg-primary/10 text-primary",
            },
            {
              icon: <ClipboardList className="h-6 w-6" />,
              title: "Catat Penimbangan",
              desc: "Input berat dan tinggi badan setiap kunjungan dengan cepat.",
              tone: "bg-secondary text-secondary-foreground",
            },
            {
              icon: <Syringe className="h-6 w-6" />,
              title: "Riwayat Imunisasi",
              desc: "Pantau 11 jenis imunisasi wajib mulai dari Hepatitis B hingga MR.",
              tone: "bg-accent text-accent-foreground",
            },
            {
              icon: <LineChart className="h-6 w-6" />,
              title: "Grafik Pertumbuhan",
              desc: "Visualisasi tumbuh kembang bayi yang mudah dipahami orang tua.",
              tone: "bg-info/15 text-info",
            },
            {
              icon: <Heart className="h-6 w-6" />,
              title: "Akses Multi Peran",
              desc: "Admin, kader, dan orang tua dengan hak akses sesuai perannya masing-masing.",
              tone: "bg-success/15 text-success",
            },
            {
              icon: <Baby className="h-6 w-6" />,
              title: "Laporan Otomatis",
              desc: "Buat laporan data bayi dan penimbangan dengan satu klik.",
              tone: "bg-warning/20 text-warning-foreground",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft transition-shadow hover:shadow-card"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.tone}`}
              >
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="rounded-[2rem] bg-gradient-primary p-10 text-center shadow-card md:p-16">
          <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
            Siap memulai pencatatan digital?
          </h2>
          <p className="mt-3 text-primary-foreground/90">
            Coba demo dengan akun admin, kader, atau orang tua.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6 rounded-full px-8">
            <Link to="/login">Coba Demo</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Posyandu Ceria — Sistem Informasi Pendataan Bayi
      </footer>
    </div>
  );
}
