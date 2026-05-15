// DEPRECATED: data sekarang dari Lovable Cloud (lihat src/lib/queries.ts).
// File ini hanya re-export helper & types agar halaman lama tetap kompatibel
// selama migrasi bertahap. Jangan tambah data baru di sini.
export {
  JENIS_IMUNISASI,
  hitungUsia,
  formatTanggal,
  type ImunisasiJenis,
  type Role,
} from "@/lib/utils-bayi";

// Type lama (camelCase) untuk halaman yang belum direfaktor
export type Bayi = {
  id: string;
  nama: string;
  tanggalLahir: string;
  jenisKelamin: "L" | "P";
  namaOrtu: string;
  alamat: string;
  telepon: string;
};
export type Penimbangan = { id: string; bayiId: string; tanggal: string; beratKg: number; tinggiCm: number; catatan?: string };
export type Imunisasi = { id: string; bayiId: string; jenis: string; tanggal: string };

// Array kosong — placeholder. Halaman yang masih import ini akan menampilkan
// data kosong sampai direfaktor ke useQuery dari src/lib/queries.ts.
export const dummyBayi: Bayi[] = [];
export const dummyPenimbangan: Penimbangan[] = [];
export const dummyImunisasi: Imunisasi[] = [];
export const dummyKader: { id: string; nama: string; telepon: string; aktif: boolean }[] = [];
