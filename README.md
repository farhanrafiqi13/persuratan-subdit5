# Portal Persuratan & BA Subdit 5 — Tahun 2026 📋✈️

Aplikasi Web Portal Persuratan & Berita Acara (BA DOC) Jasa Terkait **Subdirektorat Sistem Penyelenggaraan dan Pengusahaan Bandar Udara**, Direktorat Bandar Udara, Direktorat Jenderal Perhubungan Udara, Kementerian Perhubungan RI untuk Tahun Anggaran 2026.

Dibangun dengan arsitektur **Single Page Application (SPA) Murni** (HTML5, Tailwind CSS, Vanilla JS) dan **Progressive Web App (PWA)** offline-ready.

---

## Spesifikasi Teknis & Arsitektur Backend (@anbu)
- **Backend API**: Google Apps Script Web App (Hardcoded Endpoint)
  ```javascript
  const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzFk3Lgw0kXLpqhFgrBgVDOZyCKYwANppBq6-AtVggCK5EzJYKsFm39Tyz07AN8JqG0/exec";
  ```
- **Komunikasi Data**: POST payload `Content-Type: text/plain;charset=utf-8` (CORS-safe) dengan upload Base64 berkas PDF untuk Nota Dinas Kasubdit (`fileNotaKasubdit`), Surat Direktur (`fileSuratDirektur`), dan Dokumen BA (`fileBA`).
- **GET Endpoint**: `?action=getSuratKeluar` dan `?action=getBAJasaTerkait`.
- **Concurrency & Race Condition Guard (`LockService`) [R-14]**:
  Setiap fungsi penomoran surat dan mutasi baris spreadsheet di `Code.gs` dilindungi oleh `LockService` untuk mencegah bentrok nomor urut saat submit bersamaan:
  ```javascript
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Batas tunggu 30 detik
    // Eksekusi kalkulasi nomor urut & appendRow/update data
  } finally {
    lock.releaseLock();
  }
  ```

---

## Desain & Kepatuhan Audit Kualitas (@jonin & @akatsuki)
- **antislop-human [R-01, R-02]**: Kontras warna teks memenuhi standar WCAG 2.1 AA (rasio $\ge 4.5:1$). Dropzone upload berkas sepenuhnya aksesibel via navigasi keyboard (`tabindex="0"`, `role="button"`, handler Enter/Spasi, dan focus-visible outline).
- **antislop-layoutmobile [R-03, R-04, R-05]**: Posisi header tabel `sticky` responsif terhadap ketinggian navbar ponsel (`top-[108px] sm:top-[61px]`). Kluster pemilih tanggal adaptif di layar sempit. Tombol aksi modal form berada di footer bertumpu bawah (*sticky bottom*) yang nyaman dijangkau ibu jari (*thumb zone*).
- **antislop-ui [R-06, R-07]**: Tipografi terpadu `Inter` & `JetBrains Mono` dengan precaching Google Fonts pada Service Worker. Badge status terstandardisasi: *Lengkap*, *Menunggu Surat Direktur*, dan *Belum Ada Berkas*.
- **antislop-code [R-08, R-09]**: Input pencarian teks dilengkapi pembungkus *debounce* (180ms) guna mencegah *layout thrashing*. Instalasi Service Worker toleran terhadap kegagalan parsial CDN via `Promise.allSettled()`.
- **antislop-copywriting [R-10]**: Standardisasi 100% nomenklatur kedinasan: **Subdirektorat Sistem Penyelenggaraan dan Pengusahaan Bandar Udara**.
- **Keamanan Siber & API Resilience [R-11, R-12, R-13]**:
  * Proteksi Stored XSS via fungsi sanitasi `escapeHtml()` dan `sanitizeUrl()`.
  * Pembatasan ukuran berkas PDF klien maksimal 10 MB sebelum pembacaan FileReader / Base64.
  * Mekanisme *AbortController* dengan timeout 30 detik pada setiap panggilan Fetch API serta penanganan error non-JSON yang aman.

---

## Struktur Berkas
- `index.html` — Antarmuka web portal SPA Enterprise.
- `manifest.json` — Konfigurasi PWA Web App Manifest.
- `sw.js` — Service Worker untuk offline precache & network routing.
- `icon.svg`, `icon-192.png`, `icon-512.png` — Aset ikon grafis aplikasi.
- `README.md` — Dokumentasi teknis dan arsitektur aplikasi.

---

## Deployment GitHub Pages
Aplikasi live dan dapat diakses publik melalui:  
**https://farhanrafiqi13.github.io/persuratan-subdit5/**
