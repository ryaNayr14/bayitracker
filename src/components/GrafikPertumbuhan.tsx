import { dummyPenimbangan, formatTanggal, type Bayi } from "@/data/dummy";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function GrafikPertumbuhan({ bayi }: { bayi: Bayi }) {
  const data = dummyPenimbangan
    .filter((p) => p.bayiId === bayi.id)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
    .map((p) => ({
      tanggal: formatTanggal(p.tanggal),
      "Berat (kg)": p.beratKg,
      "Tinggi (cm)": p.tinggiCm,
    }));

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground">
        Belum ada data penimbangan
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="tanggal" stroke="var(--muted-foreground)" fontSize={12} />
          <YAxis stroke="var(--muted-foreground)" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="Berat (kg)"
            stroke="var(--chart-1)"
            strokeWidth={3}
            dot={{ r: 5, fill: "var(--chart-1)" }}
          />
          <Line
            type="monotone"
            dataKey="Tinggi (cm)"
            stroke="var(--chart-2)"
            strokeWidth={3}
            dot={{ r: 5, fill: "var(--chart-2)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
