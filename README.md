# Portal Persuratan & BA Subdit 5 — Tahun 2026 📋✈️

Aplikasi Web Portal Persuratan & Berita Acara (BA DOC) Jasa Terkait Subdirektorat Standardisasi Kebandarudaraan, Direktorat Bandar Udara, Kementerian Perhubungan RI untuk Tahun Anggaran 2026.

Dibangun dengan arsitektur **Single Page Application (SPA) Murni** (HTML5, Tailwind CSS, Vanilla JS) dan **Progressive Web App (PWA)** offline-ready.

---

## Spesifikasi Teknis (@anbu)
- **Backend API**: Google Apps Script Web App (Hardcoded Endpoint)
  ```javascript
  const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzFk3Lgw0kXLpqhFgrBgVDOZyCKYwANppBq6-AtVggCK5EzJYKsFm39Tyz07AN8JqG0/exec";
  ```
- **Komunikasi Data**: POST payload `Content-Type: text/plain;charset=utf-8` (CORS-safe) dengan upload Base64 berkas PDF untuk Nota Dinas Kasubdit (`fileNotaKasubdit`), Surat Direktur (`fileSuratDirektur`), dan Dokumen BA (`fileBA`).
- **GET Endpoint**: `?action=getSuratKeluar` dan `?action=getBAJasaTerkait`.

---

## Desain & Interaksi (@jonin) — Standar Antislop
- **antislop-ui**: Palette slate/neutral enterprise kedinasan yang tajam, profesional, tanpa gradien klise AI.
- **antislop-layoutmobile**: Target sentuh minimal 44px (`.touch-target`), tanpa clipping scrollbar horizontal, form modal adaptif.
- **antislop-human**: Kontras teks memenuhi standar WCAG AA dengan *focus indicator* yang jelas.
- **antislop-copywriting**: Terminologi resmi tata naskah dinas Kementerian Perhubungan.
- **antislop-code**: Kode bersih dari komentar redundan AI; hanya mendokumentasikan routing dan integrasi API.

---

## Struktur Berkas
- `index.html` — Antarmuka web portal SPA.
- `manifest.json` — Konfigurasi PWA Web App Manifest.
- `sw.js` — Service Worker untuk offline cache.
- `icon.svg`, `icon-192.png`, `icon-512.png` — Ikon grafis aplikasi.
- `README.md` — Dokumentasi teknis aplikasi.

---

## Deployment GitHub Pages
Aplikasi otomatis dapat diakses publik melalui:  
**https://farhanrafiqi13.github.io/persuratan-subdit5/**
