## Migrasi Posyandu Ceria ke Lovable Cloud (PostgreSQL)

Mengganti seluruh `src/data/dummy.ts` dengan database real + autentikasi multi-role. MySQL tidak didukung di platform Lovable, jadi kita pakai Lovable Cloud (PostgreSQL — secara fungsional setara: tabel, relasi, SQL standard).

### 1. Skema Database

Buat tabel berikut via migration:

```text
profiles          (id PK = auth.users.id, nama, telepon, created_at)
user_roles        (id, user_id FK, role enum: admin|kader|ortu)
bayi              (id, nama, tanggal_lahir, jenis_kelamin, alamat,
                   ortu_user_id FK profiles, created_at)
penimbangan       (id, bayi_id FK, tanggal, berat_kg, tinggi_cm, catatan,
                   dicatat_oleh FK profiles, created_at)
imunisasi         (id, bayi_id FK, jenis text, tanggal, dicatat_oleh FK,
                   created_at)
kader             (id, user_id FK profiles, nama, telepon, aktif, created_at)
```

- Enum `app_role` (admin, kader, ortu) + fungsi `has_role()` SECURITY DEFINER (mencegah RLS recursion).
- Trigger `on_auth_user_created` → otomatis insert ke `profiles`.
- RLS aktif di semua tabel.

### 2. RLS Policies

- **bayi/penimbangan/imunisasi**: admin & kader full CRUD; ortu hanya SELECT bila `bayi.ortu_user_id = auth.uid()`.
- **kader**: hanya admin yang bisa kelola.
- **profiles**: setiap user baca/update miliknya sendiri; admin baca semua.
- **user_roles**: hanya admin yang bisa assign role.

### 3. Authentication

- Email/password (sesuai pilihan awal: akun dibuatkan admin/kader).
- Auto-confirm email diaktifkan (untuk demo, tanpa verifikasi email).
- Tidak pakai Google sign-in karena akun dibuat oleh admin.
- `src/routes/login.tsx` direfaktor jadi form email/password real.
- Layout `_authenticated` dengan `beforeLoad` cek session + role guard.

### 4. Refactor Data Layer

- Hapus `src/data/dummy.ts` → ganti dengan `src/lib/queries.ts` berisi server functions (`createServerFn`) untuk:
  - `listBayi`, `getBayi`, `createBayi`, `updateBayi`, `deleteBayi`
  - `listPenimbangan(bayiId?)`, `createPenimbangan`
  - `listImunisasi(bayiId?)`, `createImunisasi`
  - `listKader`, `createKader`, `toggleKader`
  - `getMyChildren` (untuk ortu)
- Pakai TanStack Query (`useQuery`/`useMutation`) di komponen.
- Helper `hitungUsia` & `formatTanggal` dipindah ke `src/lib/utils-bayi.ts` (tetap dipakai).

### 5. Refactor Halaman

Setiap halaman admin/kader/ortu disesuaikan untuk:
- Loader `ensureQueryData` + `useSuspenseQuery`.
- Mutation invalidate query keys terkait.
- `session.ts` lama dibuang, ganti dengan `useAuth` hook yang baca dari Supabase auth.

### 6. Seed Data Awal

Insert data sample (6 bayi + penimbangan + imunisasi + 1 admin demo) supaya UI tidak kosong saat pertama dibuka. Akun admin awal: dibuat lewat signup form, lalu role-nya di-assign via SQL insert.

### 7. Yang Tidak Berubah

- Komponen UI (`DashboardLayout`, `StatCard`, `GrafikPertumbuhan`, `TabelInterpretasiKMS`).
- Logic KMS (`src/lib/kms.ts`).
- Design system & styling.

### Catatan Teknis

- Lovable Cloud = PostgreSQL (bukan MySQL). API & SQL syntax sangat mirip MySQL untuk operasi CRUD biasa, jadi semua use case sistem ini tercover.
- Kalau nanti benar-benar perlu MySQL eksternal (misal sudah ada server MySQL sendiri), kita bisa export schema PostgreSQL ke MySQL belakangan — tapi untuk sistem yang dideploy via Lovable, PostgreSQL adalah jalur yang paling praktis.

Setelah disetujui, saya jalankan migration → setup auth → refactor halaman secara bertahap.