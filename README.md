# Buku Saku Digital Tata Tertib — SMPN 3 Kediri

Aplikasi web (PWA) pengganti buku saku fisik: siswa membaca tata tertib kapan saja dari ponsel, guru/BK mencatat pelanggaran dan konsekuensi yang **disepakati bersama siswa**, lengkap dengan unggah data Excel, kontak/CRM, dan notifikasi WhatsApp/Email.

- **Frontend:** HTML/CSS/JavaScript murni (folder ini) → GitHub Pages
- **Backend:** Google Apps Script sebagai REST API + Google Sheets sebagai database (berkas `.gs` disalin ke Apps Script, **tidak** ada di folder ini)

## Mulai
Baca **[PANDUAN-INSTALASI.md](PANDUAN-INSTALASI.md)** dari atas ke bawah. Singkatnya:

1. Pasang backend di Apps Script, jalankan `setupAppEnvironment`, deploy sebagai Web App → salin URL `/exec`.
2. Isi `GAS_URL` di `js/config.js`.
3. `git init` di folder ini → push ke GitHub → aktifkan Pages.

## Struktur
```
index.html          halaman utama (single-page, rute #hash)
manifest.json       PWA
sw.js               service worker (cangkang aplikasi offline)
404.html
css/style.css       desain (token dari DESIGN.md)
js/config.js        ← ISI GAS_URL DI SINI
js/api.js           klien REST (GET publik + cache offline, POST bertoken)
js/ui.js            ikon, modal, toast, utilitas
js/app.js           router, login, sidebar/topbar
js/pages-*.js       halaman: publik, catatan, data, kontak, admin
icons/              ikon PWA
```
