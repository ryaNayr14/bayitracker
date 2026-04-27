export type Role = "admin" | "kader" | "ortu";

export type Bayi = {
  id: string;
  nama: string;
  tanggalLahir: string;
  jenisKelamin: "L" | "P";
  namaOrtu: string;
  alamat: string;
  telepon: string;
};

export type Penimbangan = {
  id: string;
  bayiId: string;
  tanggal: string;
  beratKg: number;
  tinggiCm: number;
  catatan?: string;
};

export type ImunisasiJenis =
  | "Hepatitis B"
  | "BCG"
  | "Polio Tetes 1"
  | "DPT-HB-HIB 1"
  | "Polio Tetes 2"
  | "DPT-HB-HIB 2"
  | "Polio Tetes 3"
  | "DPT-HB-HIB 3"
  | "Polio Tetes 4"
  | "Polio Suntik (IPV)"
  | "Campak Rubella (MR)";

export const JENIS_IMUNISASI: ImunisasiJenis[] = [
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
];

export type Imunisasi = {
  id: string;
  bayiId: string;
  jenis: ImunisasiJenis;
  tanggal: string;
};

export const dummyBayi: Bayi[] = [
  {
    id: "b1",
    nama: "Aisyah Putri",
    tanggalLahir: "2025-01-12",
    jenisKelamin: "P",
    namaOrtu: "Siti Rahayu",
    alamat: "Jl. Melati No. 12, RT 02",
    telepon: "081234567890",
  },
  {
    id: "b2",
    nama: "Bima Saputra",
    tanggalLahir: "2024-08-04",
    jenisKelamin: "L",
    namaOrtu: "Dewi Lestari",
    alamat: "Jl. Anggrek No. 5, RT 01",
    telepon: "082345678901",
  },
  {
    id: "b3",
    nama: "Citra Maharani",
    tanggalLahir: "2025-03-22",
    jenisKelamin: "P",
    namaOrtu: "Ratna Sari",
    alamat: "Jl. Kenanga No. 8, RT 03",
    telepon: "083456789012",
  },
  {
    id: "b4",
    nama: "Dimas Pratama",
    tanggalLahir: "2024-11-15",
    jenisKelamin: "L",
    namaOrtu: "Wati Ningsih",
    alamat: "Jl. Mawar No. 3, RT 02",
    telepon: "084567890123",
  },
  {
    id: "b5",
    nama: "Elsa Anindita",
    tanggalLahir: "2025-05-08",
    jenisKelamin: "P",
    namaOrtu: "Yuli Andriani",
    alamat: "Jl. Dahlia No. 17, RT 04",
    telepon: "085678901234",
  },
  {
    id: "b6",
    nama: "Fajar Nugraha",
    tanggalLahir: "2024-06-20",
    jenisKelamin: "L",
    namaOrtu: "Lina Marlina",
    alamat: "Jl. Cempaka No. 9, RT 01",
    telepon: "086789012345",
  },
];

export const dummyPenimbangan: Penimbangan[] = [
  // Aisyah - 4 records
  { id: "p1", bayiId: "b1", tanggal: "2025-02-12", beratKg: 4.2, tinggiCm: 54 },
  { id: "p2", bayiId: "b1", tanggal: "2025-03-12", beratKg: 5.1, tinggiCm: 57 },
  { id: "p3", bayiId: "b1", tanggal: "2025-04-12", beratKg: 5.9, tinggiCm: 60 },
  { id: "p4", bayiId: "b1", tanggal: "2025-05-12", beratKg: 6.6, tinggiCm: 62 },
  // Bima
  { id: "p5", bayiId: "b2", tanggal: "2025-02-04", beratKg: 7.2, tinggiCm: 66 },
  { id: "p6", bayiId: "b2", tanggal: "2025-03-04", beratKg: 7.8, tinggiCm: 68 },
  { id: "p7", bayiId: "b2", tanggal: "2025-04-04", beratKg: 8.3, tinggiCm: 70 },
  // Citra
  { id: "p8", bayiId: "b3", tanggal: "2025-04-22", beratKg: 4.0, tinggiCm: 53 },
  { id: "p9", bayiId: "b3", tanggal: "2025-05-22", beratKg: 4.9, tinggiCm: 56 },
  // Dimas
  { id: "p10", bayiId: "b4", tanggal: "2025-03-15", beratKg: 6.5, tinggiCm: 64 },
  { id: "p11", bayiId: "b4", tanggal: "2025-04-15", beratKg: 7.1, tinggiCm: 66 },
  // Elsa
  { id: "p12", bayiId: "b5", tanggal: "2025-06-08", beratKg: 3.6, tinggiCm: 51 },
  // Fajar
  { id: "p13", bayiId: "b6", tanggal: "2025-04-20", beratKg: 8.4, tinggiCm: 71 },
];

export const dummyImunisasi: Imunisasi[] = [
  { id: "i1", bayiId: "b1", jenis: "Hepatitis B", tanggal: "2025-01-13" },
  { id: "i2", bayiId: "b1", jenis: "BCG", tanggal: "2025-02-12" },
  { id: "i3", bayiId: "b1", jenis: "Polio Tetes 1", tanggal: "2025-02-12" },
  { id: "i4", bayiId: "b2", jenis: "Hepatitis B", tanggal: "2024-08-05" },
  { id: "i5", bayiId: "b2", jenis: "BCG", tanggal: "2024-09-04" },
  { id: "i6", bayiId: "b2", jenis: "Polio Tetes 1", tanggal: "2024-09-04" },
  { id: "i7", bayiId: "b2", jenis: "DPT-HB-HIB 1", tanggal: "2024-10-04" },
  { id: "i8", bayiId: "b2", jenis: "Polio Tetes 2", tanggal: "2024-10-04" },
  { id: "i9", bayiId: "b4", jenis: "Hepatitis B", tanggal: "2024-11-16" },
  { id: "i10", bayiId: "b4", jenis: "BCG", tanggal: "2024-12-15" },
  { id: "i11", bayiId: "b6", jenis: "Hepatitis B", tanggal: "2024-06-21" },
  { id: "i12", bayiId: "b6", jenis: "BCG", tanggal: "2024-07-20" },
  { id: "i13", bayiId: "b6", jenis: "DPT-HB-HIB 1", tanggal: "2024-08-20" },
];

export const dummyKader = [
  { id: "k1", nama: "Bu Sari", telepon: "081111111111", aktif: true },
  { id: "k2", nama: "Bu Ningsih", telepon: "082222222222", aktif: true },
  { id: "k3", nama: "Bu Asih", telepon: "083333333333", aktif: false },
];

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
