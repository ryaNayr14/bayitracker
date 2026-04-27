import { dummyPenimbangan, type Bayi } from "@/data/dummy";
import { getKurvaKMS, usiaSaatTanggal, statusGizi, hitungBBI } from "@/lib/kms";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function GrafikPertumbuhan({ bayi }: { bayi: Bayi }) {
  const kurva = getKurvaKMS(bayi.jenisKelamin, 24);

  const penimbangan = dummyPenimbangan
    .filter((p) => p.bayiId === bayi.id)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  // Map berat anak ke usia bulan
  const beratMap = new Map<number, number>();
  penimbangan.forEach((p) => {
    const usia = Math.round(usiaSaatTanggal(bayi.tanggalLahir, p.tanggal));
    beratMap.set(usia, p.beratKg);
  });

  // Gabungkan kurva KMS + titik berat anak
  const data = kurva.map((k) => ({
    usia: k.usiaBulan,
    // Stacked area untuk pita: bawah merah, kuning, hijau, kuning atas, merah atas
    // Kita pakai band: -3SD, gap_kuning_bawah(-3 ke -2), pita_hijau(-2 ke +2), kuning_atas(+2 ke +3)
    bawah: k.minus3SD,
    kuningBawah: k.minus2SD - k.minus3SD,
    hijau: k.plus2SD - k.minus2SD,
    kuningAtas: k.plus3SD - k.plus2SD,
    median: k.median,
    bbi: hitungBBI(k.usiaBulan),
    berat: beratMap.get(k.usiaBulan) ?? null,
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="usia"
            stroke="var(--muted-foreground)"
            fontSize={11}
            label={{ value: "Usia (bulan)", position: "insideBottom", offset: -2, fontSize: 11 }}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={11}
            label={{ value: "Berat (kg)", angle: -90, position: "insideLeft", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              fontSize: "12px",
            }}
            formatter={(v: number, name: string) => {
              if (name === "Berat Anak" || name === "BBI" || name === "Median (P50)")
                return [`${v} kg`, name];
              return null;
            }}
            labelFormatter={(l) => `Usia ${l} bulan`}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            payload={[
              { value: "Pita Hijau (-2 s/d +2 SD)", type: "rect", color: "oklch(0.85 0.13 145)" },
              { value: "Pita Kuning (±3 SD)", type: "rect", color: "oklch(0.88 0.14 90)" },
              { value: "Berat Anak", type: "line", color: "var(--chart-1)" },
              { value: "BBI", type: "line", color: "var(--chart-2)" },
            ]}
          />

          {/* Stacked area: pita KMS */}
          <Area
            type="monotone"
            dataKey="bawah"
            stackId="kms"
            stroke="none"
            fill="transparent"
            legendType="none"
          />
          <Area
            type="monotone"
            dataKey="kuningBawah"
            stackId="kms"
            stroke="none"
            fill="oklch(0.88 0.14 90)"
            fillOpacity={0.45}
            name="Kuning bawah"
            legendType="none"
          />
          <Area
            type="monotone"
            dataKey="hijau"
            stackId="kms"
            stroke="none"
            fill="oklch(0.85 0.13 145)"
            fillOpacity={0.5}
            name="Pita hijau"
            legendType="none"
          />
          <Area
            type="monotone"
            dataKey="kuningAtas"
            stackId="kms"
            stroke="none"
            fill="oklch(0.88 0.14 90)"
            fillOpacity={0.45}
            name="Kuning atas"
            legendType="none"
          />

          {/* Garis median (P50) */}
          <Line
            type="monotone"
            dataKey="median"
            stroke="oklch(0.55 0.15 145)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            name="Median (P50)"
          />

          {/* Garis BBI */}
          <Line
            type="monotone"
            dataKey="bbi"
            stroke="var(--chart-2)"
            strokeWidth={1.5}
            strokeDasharray="2 3"
            dot={false}
            name="BBI"
          />

          {/* Berat anak */}
          <Line
            type="monotone"
            dataKey="berat"
            stroke="var(--chart-1)"
            strokeWidth={3}
            dot={{ r: 5, fill: "var(--chart-1)", stroke: "white", strokeWidth: 2 }}
            connectNulls
            name="Berat Anak"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// Tabel interpretasi N/T per penimbangan
export function TabelInterpretasiKMS({ bayi }: { bayi: Bayi }) {
  const penimbangan = dummyPenimbangan
    .filter((p) => p.bayiId === bayi.id)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  if (penimbangan.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Belum ada data untuk diinterpretasi</p>
    );
  }

  return (
    <div className="space-y-2">
      {penimbangan.map((p, idx) => {
        const usia = usiaSaatTanggal(bayi.tanggalLahir, p.tanggal);
        const status = statusGizi(p.beratKg, usia, bayi.jenisKelamin);
        const sebelum = idx > 0 ? penimbangan[idx - 1].beratKg : null;
        const selisihGram = sebelum !== null ? (p.beratKg - sebelum) * 1000 : null;

        // KBM
        const kbm =
          usia <= 1 ? 800 : usia <= 2 ? 900 : usia <= 3 ? 800 : usia <= 4 ? 600 : usia <= 5 ? 500 : usia <= 7 ? 400 : usia <= 12 ? 300 : 200;

        let kode: "N" | "T" | "-" = "-";
        if (selisihGram !== null) kode = selisihGram >= kbm ? "N" : "T";

        const toneStatus =
          status.warna === "success" ? "bg-success/15 text-success"
          : status.warna === "warning" ? "bg-warning/15 text-warning"
          : status.warna === "danger" ? "bg-destructive/15 text-destructive"
          : "bg-info/15 text-info";

        const toneNT =
          kode === "N" ? "bg-success/15 text-success"
          : kode === "T" ? "bg-destructive/15 text-destructive"
          : "bg-muted text-muted-foreground";

        return (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-muted/40 px-4 py-3 text-sm"
          >
            <div className="flex flex-col">
              <span className="font-semibold">
                Usia {usia.toFixed(1)} bln · {p.beratKg} kg
              </span>
              <span className="text-xs text-muted-foreground">
                {selisihGram !== null
                  ? `Δ ${selisihGram >= 0 ? "+" : ""}${selisihGram.toFixed(0)} g (KBM ${kbm} g)`
                  : "Penimbangan pertama"}
              </span>
            </div>
            <div className="flex gap-2">
              <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${toneStatus}`}>
                {status.label} (z={status.z})
              </span>
              <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${toneNT}`}>
                {kode === "N" ? "N · Naik" : kode === "T" ? "T · Tidak Naik" : "—"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
