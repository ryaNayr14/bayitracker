// KMS (Kartu Menuju Sehat) - WHO Weight-for-Age Standards
// Sumber: WHO Child Growth Standards 2006 (LMS values, simplified)
// Pita hijau = -2 SD s/d +2 SD (normal)

// Tabel LMS WHO (Weight-for-Age) — sebagian, bulan 0-24
// Format: [umurBulan, L, M, S]
const WFA_BOYS_LMS: [number, number, number, number][] = [
  [0, 0.3487, 3.3464, 0.14602],
  [1, 0.2297, 4.4709, 0.13395],
  [2, 0.197, 5.5675, 0.12385],
  [3, 0.1738, 6.3762, 0.11727],
  [4, 0.1553, 7.0023, 0.11316],
  [5, 0.1395, 7.5105, 0.1108],
  [6, 0.1257, 7.934, 0.10958],
  [7, 0.1134, 8.297, 0.10902],
  [8, 0.1021, 8.6151, 0.10882],
  [9, 0.0917, 8.9014, 0.10881],
  [10, 0.082, 9.1649, 0.10891],
  [11, 0.073, 9.4122, 0.10906],
  [12, 0.0644, 9.6479, 0.10925],
  [13, 0.0563, 9.8749, 0.10949],
  [14, 0.0487, 10.0953, 0.10976],
  [15, 0.0413, 10.3108, 0.11007],
  [16, 0.0343, 10.5228, 0.1104],
  [17, 0.0275, 10.7319, 0.11075],
  [18, 0.0211, 10.9385, 0.11111],
  [19, 0.0148, 11.143, 0.11148],
  [20, 0.0087, 11.3462, 0.11187],
  [21, 0.0029, 11.5486, 0.11227],
  [22, -0.0028, 11.7504, 0.11267],
  [23, -0.0083, 11.9514, 0.11308],
  [24, -0.0137, 12.1515, 0.11349],
];

const WFA_GIRLS_LMS: [number, number, number, number][] = [
  [0, 0.3809, 3.2322, 0.14171],
  [1, 0.1714, 4.1873, 0.13724],
  [2, 0.0962, 5.1282, 0.13, ],
  [3, 0.0402, 5.8458, 0.12619],
  [4, -0.005, 6.4237, 0.12402],
  [5, -0.043, 6.8985, 0.12274],
  [6, -0.0756, 7.297, 0.122],
  [7, -0.1039, 7.6422, 0.12159],
  [8, -0.1288, 7.9487, 0.12142],
  [9, -0.1507, 8.2254, 0.12141],
  [10, -0.17, 8.48, 0.12152],
  [11, -0.1872, 8.7192, 0.12174],
  [12, -0.2024, 8.9481, 0.12204],
  [13, -0.216, 9.1699, 0.1224],
  [14, -0.228, 9.387, 0.12281],
  [15, -0.2387, 9.6008, 0.12328],
  [16, -0.2483, 9.8124, 0.12379],
  [17, -0.2569, 10.0226, 0.12434],
  [18, -0.2646, 10.232, 0.12492],
  [19, -0.2715, 10.4393, 0.12549],
  [20, -0.2778, 10.6464, 0.12606],
  [21, -0.2835, 10.8534, 0.12663],
  [22, -0.2887, 11.0608, 0.1272],
  [23, -0.2934, 11.2688, 0.12776],
  [24, -0.2978, 11.4775, 0.12832],
];

function lerpLMS(table: [number, number, number, number][], usia: number) {
  if (usia <= table[0][0]) return { L: table[0][1], M: table[0][2], S: table[0][3] };
  if (usia >= table[table.length - 1][0]) {
    const last = table[table.length - 1];
    return { L: last[1], M: last[2], S: last[3] };
  }
  const lower = Math.floor(usia);
  const upper = lower + 1;
  const t = usia - lower;
  const a = table[lower];
  const b = table[upper];
  return {
    L: a[1] + (b[1] - a[1]) * t,
    M: a[2] + (b[2] - a[2]) * t,
    S: a[3] + (b[3] - a[3]) * t,
  };
}

// Hitung berat berdasarkan z-score: X = M * (1 + L*S*z)^(1/L)
function weightAtZ(L: number, M: number, S: number, z: number): number {
  if (Math.abs(L) < 1e-7) return M * Math.exp(S * z);
  return M * Math.pow(1 + L * S * z, 1 / L);
}

export type KMSPoint = {
  usiaBulan: number;
  median: number; // M (BBI)
  minus2SD: number;
  plus2SD: number;
  minus3SD: number;
  plus3SD: number;
};

export function getKurvaKMS(jenisKelamin: "L" | "P", maxBulan = 24): KMSPoint[] {
  const table = jenisKelamin === "L" ? WFA_BOYS_LMS : WFA_GIRLS_LMS;
  const points: KMSPoint[] = [];
  for (let u = 0; u <= maxBulan; u++) {
    const { L, M, S } = lerpLMS(table, u);
    points.push({
      usiaBulan: u,
      median: +M.toFixed(2),
      minus2SD: +weightAtZ(L, M, S, -2).toFixed(2),
      plus2SD: +weightAtZ(L, M, S, 2).toFixed(2),
      minus3SD: +weightAtZ(L, M, S, -3).toFixed(2),
      plus3SD: +weightAtZ(L, M, S, 3).toFixed(2),
    });
  }
  return points;
}

// Berat Badan Ideal (rumus Behrman / Kemenkes)
// Bayi 0-11 bulan: BBI = (umur_bulan + 9) / 2
// Anak 1-6 tahun: BBI = 2 * umur_tahun + 8
export function hitungBBI(usiaBulan: number): number {
  if (usiaBulan < 12) return +((usiaBulan + 9) / 2).toFixed(1);
  const tahun = usiaBulan / 12;
  return +(2 * tahun + 8).toFixed(1);
}

// Status gizi berdasarkan z-score berat menurut umur
export function statusGizi(
  beratKg: number,
  usiaBulan: number,
  jenisKelamin: "L" | "P",
): { label: string; warna: "success" | "warning" | "danger" | "info"; z: number } {
  const table = jenisKelamin === "L" ? WFA_BOYS_LMS : WFA_GIRLS_LMS;
  const { L, M, S } = lerpLMS(table, Math.min(usiaBulan, 24));
  // z = ((X/M)^L - 1) / (L*S)
  let z: number;
  if (Math.abs(L) < 1e-7) z = Math.log(beratKg / M) / S;
  else z = (Math.pow(beratKg / M, L) - 1) / (L * S);
  z = +z.toFixed(2);

  if (z < -3) return { label: "Berat Sangat Kurang", warna: "danger", z };
  if (z < -2) return { label: "Berat Kurang", warna: "warning", z };
  if (z <= 1) return { label: "Berat Normal", warna: "success", z };
  if (z <= 2) return { label: "Risiko Berat Lebih", warna: "info", z };
  return { label: "Berat Lebih", warna: "warning", z };
}

// Kenaikan Berat Badan Minimal (KBM) per bulan (gram) — Kemenkes
// 0-1 bln: 800g, 1-2: 900g, 2-3: 800g, 3-4: 600g, 4-5: 500g, 5-6: 400g
// 6-7: 400g, 7-12: 300g, >12 bln: 200g
export function kbmGram(usiaBulanSekarang: number): number {
  if (usiaBulanSekarang <= 1) return 800;
  if (usiaBulanSekarang <= 2) return 900;
  if (usiaBulanSekarang <= 3) return 800;
  if (usiaBulanSekarang <= 4) return 600;
  if (usiaBulanSekarang <= 5) return 500;
  if (usiaBulanSekarang <= 7) return 400;
  if (usiaBulanSekarang <= 12) return 300;
  return 200;
}

// Interpretasi N (Naik) / T (Tidak Naik) berdasarkan grafik KMS
export function interpretasiNT(
  beratSekarang: number,
  beratSebelumnya: number | null,
  usiaBulanSekarang: number,
): { kode: "N" | "T" | "-"; label: string } {
  if (beratSebelumnya === null) return { kode: "-", label: "Penimbangan pertama" };
  const kenaikanGram = (beratSekarang - beratSebelumnya) * 1000;
  const kbm = kbmGram(usiaBulanSekarang);
  if (kenaikanGram >= kbm) {
    return { kode: "N", label: `Naik (+${kenaikanGram.toFixed(0)}g, KBM ${kbm}g)` };
  }
  return { kode: "T", label: `Tidak Naik (+${kenaikanGram.toFixed(0)}g, KBM ${kbm}g)` };
}

export function usiaSaatTanggal(tanggalLahir: string, tanggal: string): number {
  const lahir = new Date(tanggalLahir);
  const t = new Date(tanggal);
  const ms = t.getTime() - lahir.getTime();
  const hari = ms / (1000 * 60 * 60 * 24);
  return +(hari / 30.4375).toFixed(2);
}
