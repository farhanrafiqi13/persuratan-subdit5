# Portal Persuratan & BA Subdit 5 — Tahun 2026 ✈️📋

Aplikasi Web Portal Persuratan & Berita Acara (BA DOC) Subdirektorat Standardisasi Kebandarudaraan, Direktorat Bandar Udara, Kementerian Perhubungan RI untuk Tahun Anggaran 2026.

Dibangun dengan arsitektur **Single Page Application (SPA) Murni** tanpa dependensi bundler/framework rumit (Pure HTML5, Tailwind CSS via CDN, Vanilla JavaScript), siap di-deploy secara instan ke **GitHub Pages**, dan mendukung penuh **Progressive Web App (PWA)** sehingga dapat diinstal di homescreen smartphone atau desktop.

---

## 🌟 Fitur Utama

### 1. Tab 'Surat Keluar 2026'
- **Tabel Data Terstruktur**: Menampilkan No, Tanggal, Nomor Surat, Perihal, Konseptor, Link Nota Dinas Kasubdit, dan Link Surat Direktur.
- **Pintasan Salin**: Satu klik untuk menyalin nomor surat ke clipboard.
- **Integrasi Dokumen Cloud**: Tombol langsung menuju berkas PDF di Google Drive.
- **Modal Tambah Data**:
  - Tanggal Surat (*DatePicker*)
  - Dropdown Konseptor (*Tony Fredrik, Novrinanda, Hanif A, Aspar, Farhan Rafiqi, Andy Bastian, Dedi Santoso, Rosadianita, Sadewo*)
  - Perihal (*Textarea*)
  - Upload Berkas Nota Dinas (PDF) -> Dikonversi otomatis ke Base64 (`fileNotaKasubdit`)
  - Upload Berkas Surat Direktur (PDF) -> Dikonversi otomatis ke Base64 (`fileSuratDirektur`)

### 2. Tab 'BA DOC Jasa Terkait 2026'
- **Tabel Berita Acara**: Menampilkan No, Tanggal, Nomor Berita Acara, Nama PT, Bandara/Cabang, PIC Pemeriksa, dan Berkas BA.
- **Pilihan Bandara Lengkap**: Dropdown kode IATA bandara di seluruh Indonesia (CGK, HLP, GTO, TIM, BDO, TRK, BWX, PLM, SUB, DPS, KNO, UPG, YIA, dll.).
- **Modal Tambah Data BA**:
  - Tanggal Berita Acara (*DatePicker*)
  - Nama PT / Perusahaan (*Input Teks*)
  - Bandara / Cabang (*Dropdown Bandara*)
  - PIC Pemeriksa (*Input Teks / Datalist Rekomendasi Tim*)
  - Upload Berkas Berita Acara (PDF) -> Dikonversi otomatis ke Base64 (`fileBA`)

### 3. Progressive Web App (PWA) & Offline Ready
- Didukung oleh `manifest.json` dan `sw.js` (Service Worker).
- Tombol **"Install App"** otomatis muncul saat dibuka melalui browser yang mendukung PWA (Chrome/Edge/Safari/Samsung Internet).
- Tampilan independen (*standalone display*) tanpa address bar browser.
- Aset inti dicache menggunakan strategi *Stale-While-Revalidate*.

### 4. Performa & User Experience
- **Pencarian Instan**: Menyaring tabel secara seketika berdasarkan perihal, nomor surat, nama PT, bandara, konseptor, atau PIC.
- **Filter Cepat & Pengurutan**: Filter per konseptor/bandara dan pengurutan data terbaru/terlama.
- **Sistem Notifikasi Toast**: Umpan balik visual real-time saat berhasil/gagal menyimpan dokumen.
- **CORS Safe**: Pengiriman data POST menggunakan header `Content-Type: text/plain;charset=utf-8` untuk mencegah isu *preflight OPTIONS* pada Google Apps Script.

---

## 🛠️ Arsitektur & Konfigurasi API

Aplikasi ini terhubung langsung dengan backend **Google Apps Script (GAS)**:
```javascript
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzFk3Lgw0kXLpqhFgrBgVDOZyCKYwANppBq6-AtVggCK5EzJYKsFm39Tyz07AN8JqG0/exec";
```

### Endpoint & Operasi:
1. **GET Data Surat Keluar**:
   `GET ${GAS_API_URL}?action=getSuratKeluar`
2. **GET Data BA Jasa Terkait**:
   `GET ${GAS_API_URL}?action=getBAJasaTerkait`
3. **POST Tambah Surat Keluar**:
   `POST ${GAS_API_URL}` dengan body JSON payload `{ action: 'addSuratKeluar', tanggal, konseptor, perihal, fileNotaKasubdit, fileSuratDirektur }`
4. **POST Tambah BA Jasa Terkait**:
   `POST ${GAS_API_URL}` dengan body JSON payload `{ action: 'addBAJasaTerkait', tanggal, namaPT, kodeBandara, lokasiBandara, pic, fileBA }`

---

## 🚀 Panduan Mengaktifkan GitHub Pages

Aplikasi ini telah dirancang untuk langsung aktif melalui GitHub Pages tanpa langkah build tambahan:

1. Buka repositori proyek di GitHub:
   `https://github.com/farhanrafiqi13/persuratan-subdit5`
2. Klik tab **Settings** di navigasi atas repositori.
3. Pada bilah sisi kiri (*sidebar*), klik menu **Pages** (di bawah bagian *Code and automation*).
4. Di bagian **Build and deployment**:
   - **Source**: Pilih `Deploy from a branch`
   - **Branch**: Pilih `main` (atau `master`), lalu pilih folder `/ (root)`
5. Klik tombol **Save**.
6. Tunggu sekitar 1–2 menit hingga proses deployment GitHub Actions selesai.
7. Portal Anda akan dapat diakses secara publik di URL:
   ```
   https://farhanrafiqi13.github.io/persuratan-subdit5/
   ```

---

## 📂 Struktur Berkas

```
├── index.html       # Single Page Application utama (Tailwind CDN, FontAwesome, JS)
├── manifest.json    # Konfigurasi PWA Web App Manifest
├── sw.js            # Service Worker untuk caching dan mode offline
├── icon.svg         # Ikon vektor aplikasi
├── icon-192.png     # Ikon PWA resolusi 192x192
├── icon-512.png     # Ikon PWA resolusi 512x512
└── README.md        # Dokumentasi teknis & panduan deployment
```

---

## 👨‍💻 Pengembang
Subdirektorat Standardisasi Kebandarudaraan  
Direktorat Bandar Udara — Kementerian Perhubungan Republik Indonesia (2026)
