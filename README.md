# Flash Barber Shop — 3D Premium Barbershop (Kota Malang)

Website interaktif 3D untuk **Flash Barber Shop** di Kota Malang, Jawa Timur. Dibangun menggunakan React, TypeScript, Vite, Tailwind CSS, dan Three.js.

---

## Panduan Publish Online ke Vercel (`vercel.app`)

Proyek ini sudah dilengkapi file konfigurasi **`vercel.json`**.

1. Push kode proyek ini ke repositori GitHub Anda.
2. Buka [https://vercel.com/new](https://vercel.com/new) dan login menggunakan akun GitHub Anda.
3. Pilih repositori GitHub proyek ini lalu klik **Import**.
4. Vercel akan otomatis mendeteksi pengaturan dari `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Klik **Deploy**. Dalam ~1 menit, website akan langsung aktif di alamat `https://nama-proyek-anda.vercel.app`.

---

## Panduan Publish Online ke GitHub Pages (`github.io`)

Proyek ini sudah dikonfigurasi dengan:
- **`vite.config.ts`** menggunakan *relative base path* (`./`) saat build agar aset 3D, CSS, dan JS berjalan lancar baik di `https://username.github.io/nama-repo/` maupun di domain utama.
- **`.github/workflows/deploy-pages.yml`** untuk *auto-deploy* menggunakan GitHub Actions.
- **`public/.nojekyll`** agar semua aset statis dilayani dengan benar oleh GitHub Pages.

### Langkah Aktivasi di GitHub:
1. Push seluruh kode ke repositori GitHub Anda (branch `main` atau `master`).
2. Buka repositori Anda di GitHub, lalu masuk ke menu **Settings** → **Pages** (di sidebar kiri).
3. Pada bagian **Build and deployment** → **Source**, ubah pilihan menjadi **GitHub Actions**.
4. Buka tab **Actions** di repositori GitHub Anda: workflow **"Deploy Flash Barber Shop to GitHub Pages"** akan berjalan otomatis (atau Anda dapat menekan tombol **Run workflow**).
5. Setelah workflow selesai (centang hijau), website Anda dapat diakses publik di:
   `https://<username-github-anda>.github.io/<nama-repositori-anda>/`

---

## Mengubah Data Bisnis Permanen

Buka file `src/config/siteConfig.ts` untuk memperbarui:
- `brandName`: `'Flash Barber Shop'`
- `whatsappInternational`: Nomor WhatsApp bisnis format internasional tanpa tanda `+` (contoh: `'6281234567890'`)
- `address`: Alamat lengkap studio di Kota Malang
- `operatingHours`: Jam operasional harian
- `googleMapsUrl`: Tautan Google Maps resmi
- `services`: Daftar layanan dan harga resmi
