export function hitungUsia(tanggalLahir: string): string {
  const lahir = new Date(tanggalLahir);
  const now = new Date();
  let bulan = (now.getFullYear() - lahir.getFullYear()) * 12 + (now.getMonth() - lahir.getMonth());
  if (now.getDate() < lahir.getDate()) bulan -= 1;
  if (bulan < 0) bulan = 0;
  const tahun = Math.floor(bulan / 12);
  const sisaBulan = bulan % 12;
  if (tahun === 0) return `${sisaBulan} bulan`;
  return `${tahun} thn ${sisaBulan} bln`;
}

export function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const JENIS_IMUNISASI = [
  "Hepatitis B",
  "BCG",
  "Polio Tetes 1",
  "DPT-HB-HIB 1",
  "Polio Tetes 2",
  "DPT-HB-HIB 2",
  "Polio Tetes 3",
  "DPT-HB-HIB 3",
  "Polio Tetes 4",
  "Polio Suntik (IPV)",
  "Campak Rubella (MR)",
] as const;

export type ImunisasiJenis = (typeof JENIS_IMUNISASI)[number];

export type Role = "admin" | "kader" | "ortu";

export type Bayi = {
  id: string;
  nama: string;
  tanggal_lahir: string;
  jenis_kelamin: "L" | "P";
  alamat: string | null;
  nama_ortu: string | null;
  telepon_ortu: string | null;
  ortu_user_id: string | null;
};

export type Penimbangan = {
  id: string;
  bayi_id: string;
  tanggal: string;
  berat_kg: number;
  tinggi_cm: number;
  catatan: string | null;
};

export type Imunisasi = {
  id: string;
  bayi_id: string;
  jenis: string;
  tanggal: string;
};

export type Kader = {
  id: string;
  nama: string;
  telepon: string | null;
  aktif: boolean;
};

export function roleLabel(r: Role): string {
  return r === "admin" ? "Ketua Posyandu" : r === "kader" ? "Kader Posyandu" : "Orang Tua";
}
