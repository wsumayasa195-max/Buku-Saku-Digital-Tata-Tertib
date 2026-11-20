# Panduan Instalasi — Buku Saku Digital Tata Tertib SMPN 3 Kediri

Panduan ini untuk Anda yang **belum pernah** memakai Git, GitHub, atau Apps Script. Ikuti berurutan. Setiap langkah ada tanda **✅ Berhasil jika…** agar Anda tahu kapan boleh lanjut. Total waktu: sekitar 45–60 menit.

## Gambaran: ada dua bagian

| Bagian | Isinya | Tempatnya | Anda dapat dalam bentuk |
|---|---|---|---|
| **Backend** (otak + database) | 6 berkas `.gs` + `appsscript.json` | Google Apps Script (akun Google Anda) | 7 berkas terpisah — **disalin-tempel** |
| **Frontend** (tampilan) | `index.html`, `css/`, `js/`, ikon | GitHub Pages (gratis) | 1 berkas ZIP — **diekstrak** |

Data disimpan di **Google Sheets milik akun Google Anda**. Tidak ada server lain, tidak ada biaya langganan.

> **Gunakan akun Google khusus sekolah** (misalnya `bukusaku.smpn3kediri@gmail.com`), bukan akun pribadi seorang guru, supaya aplikasi tetap hidup saat petugas berganti.

---

## Bagian 1 — Pasang backend di Google Apps Script

### 1.1 Buat proyek
1. Buka **https://script.google.com** (masuk dengan akun Google sekolah).
2. Klik **Proyek baru** (*New project*). Ganti nama proyek (klik "Untitled project") menjadi `Buku Saku Digital`.

### 1.2 Pasang `appsscript.json`
1. Klik ikon roda gigi **Setelan proyek** (*Project Settings*) di kiri.
2. Centang **Tampilkan file manifes "appsscript.json" di editor**.
3. Kembali ke **Editor** (ikon `< >`). Klik berkas `appsscript.json`, **hapus seluruh isinya**, lalu tempel isi berkas `appsscript.json` dari saya. Tekan **Ctrl+S**.

### 1.3 Pasang 6 berkas kode
1. Klik berkas **Code.gs** → ubah namanya (titik tiga → *Rename*) menjadi **Kode**. Hapus isinya, tempel isi **Kode.gs** dari saya.
2. Klik **+** di sebelah "Files" → **Script**. Beri nama **Konten** → tempel isi **Konten.gs**.
3. Ulangi untuk **Pelanggaran**, **Notifikasi**, **CRM**, dan **Migrasi** (masing-masing dengan isi berkas `.gs` yang sesuai).
4. Tekan **Ctrl+S** (simpan semua).

✅ **Berhasil jika:** di panel kiri ada 6 berkas — `Kode`, `Konten`, `Pelanggaran`, `Notifikasi`, `CRM`, `Migrasi` — plus `appsscript.json`.

### 1.4 Jalankan setup (membuat database otomatis)
1. Di bagian atas editor, pilih fungsi **`setupAppEnvironment`** pada menu dropdown, lalu klik **Jalankan** (*Run*).
2. Google meminta izin: klik **Tinjau izin** → pilih akun Anda → **Lanjutan** (*Advanced*) → **Buka Buku Saku Digital (tidak aman)** → **Izinkan**. (Peringatan ini muncul untuk semua skrip pribadi; skrip ini milik Anda sendiri.)
3. Tunggu hingga **Log eksekusi** di bawah menampilkan "Setup selesai".

### 1.5 ⚠️ CATAT AKSES DARURAT (hanya tampil sekali)
Di **Log eksekusi** akan ada blok seperti ini:

```
🔐 AKSES DARURAT (catat SEKARANG — hanya tampil sekali, ganti setelah login pertama)
   Nama pengguna : darurat
   Kata sandi    : xxxxxxxxxxxxxxxx
```

**Salin ke tempat aman** (buku catatan sekolah/brankas). Inilah kunci masuk admin pertama Anda. Jika terlewat, jalankan fungsi `resetAksesDarurat` untuk membuat yang baru.

✅ **Berhasil jika:** di Google Drive Anda muncul folder **📁 Buku Saku Digital SMPN 3 Kediri** berisi spreadsheet **🗃️ Database — Buku Saku Digital**.

### 1.6 (Opsional) Isi data contoh
Jalankan fungsi **`isiDataContoh`** untuk memasukkan 6 pasal dan 2 pengumuman contoh agar tampilan tidak kosong. **Ganti dengan isi resmi SK sekolah** sebelum dipakai siswa — contoh ini bukan tata tertib resmi SMPN 3 Kediri.

---

## Bagian 2 — Deploy backend dan ambil alamat `/exec`

1. Klik **Terapkan** (*Deploy*) → **Penerapan baru** (*New deployment*).
2. Klik ikon roda gigi di samping "Pilih jenis" → pilih **Aplikasi web** (*Web app*).
3. Isi:
   - **Deskripsi:** `Versi 1`
   - **Jalankan sebagai** (*Execute as*): **Saya** (*Me*)
   - **Yang memiliki akses** (*Who has access*): **Siapa saja** (*Anyone*)
4. Klik **Terapkan** (*Deploy*) lalu **salin URL Aplikasi web** — berakhiran **`/exec`**:

```
https://script.google.com/macros/s/AKfycb....panjang..../exec
```

✅ **Berhasil jika:** URL itu dibuka di browser dan menampilkan tulisan JSON berisi `"Backend aktif"`.

> **Mengapa "Siapa saja"?** Agar siswa bisa membaca tata tertib tanpa akun Google. Data pribadi (catatan pelanggaran, data murid) tetap **dikunci oleh login** aplikasi — hanya data publik (tata tertib, pengumuman, kalender) yang terbuka.

---

## Bagian 3 — Siapkan Git dan GitHub

### 3.1 Pasang Git
- **Windows:** unduh dari https://git-scm.com/download/win, instal dengan pengaturan bawaan. Lalu buka **PowerShell** dari menu Start.
- **Mac:** buka **Terminal**, ketik `git --version`; jika belum ada, macOS menawarkan pemasangan otomatis.
- **Linux:** `sudo apt install git`.

Periksa:
```
git --version
```
✅ Berhasil jika muncul nomor versi, mis. `git version 2.4x.x`.

### 3.2 Buat akun GitHub
Daftar di https://github.com. **Username** Anda akan menjadi bagian alamat situs (`username.github.io`), jadi pilih yang pantas, mis. `smpn3kediri`.

### 3.3 Perkenalkan diri ke Git (sekali saja)
```
git config --global user.name "SMPN 3 Kediri"
git config --global user.email "email-yang-sama-dengan-akun-github@gmail.com"
```
`user.name` bebas (hanya label riwayat perubahan), **bukan** username GitHub.

### 3.4 Buat repository
1. Di github.com klik **+** (kanan atas) → **New repository**.
2. **Repository name:** `buku-saku`.
3. Pilih **Public** (wajib untuk GitHub Pages gratis; aman, lihat catatan keamanan di bawah).
4. **JANGAN** centang *Add a README*, *.gitignore*, atau *license*.
5. Klik **Create repository**. Biarkan halaman berikutnya terbuka.

---

## Bagian 4 — Isi alamat backend di frontend

1. **Ekstrak** berkas `buku-saku-smpn3-kediri.zip`. Hasilnya satu folder bernama **`buku-saku-smpn3-kediri`**.
2. Di dalam folder itu buka `js` → klik kanan **`config.js`** → **Buka dengan Notepad**.
3. Ganti tulisan `GANTI_DENGAN_URL_EXEC_ANDA` dengan URL `/exec` dari Bagian 2 (tetap di dalam tanda kutip):

```js
window.APP_CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/AKfycb....../exec'
};
```
4. Simpan (**Ctrl+S**).

---

## Bagian 5 — Unggah ke GitHub (lewat terminal)

> **Jangan** memakai tombol "Upload files" di web GitHub. Cara itu meratakan semua folder sehingga tampilan rusak (CSS/JS tidak ditemukan). Pakai terminal seperti di bawah.

### 5a — Masuk ke folder yang BENAR
Folder kerja Anda adalah **`buku-saku-smpn3-kediri`** (hasil ekstrak ZIP). **Di folder inilah** `git init` dijalankan — jangan masuk lebih dalam, jangan naik satu tingkat.

Cara cepat di Windows: buka folder itu di File Explorer, klik **address bar**, ketik `powershell`, tekan **Enter**.

Atau manual:
```
cd "C:\Users\NAMA-ANDA\Downloads\buku-saku-smpn3-kediri"
```

### 5b — Periksa isi folder
```
dir
```
(di Mac/Linux: `ls -la`)

✅ **Harus terlihat:** `index.html`, `manifest.json`, `sw.js`, `404.html`, `README.md`, `PANDUAN-INSTALASI.md`, dan folder **`css`**, **`js`**, **`icons`**.
❌ Jika yang terlihat hanya folder `buku-saku-smpn3-kediri`, Anda satu tingkat terlalu tinggi — `cd buku-saku-smpn3-kediri` dulu.
❌ Tidak boleh ada berkas `.gs` di folder ini (itu milik Apps Script).

### 5c — Kirim ke GitHub (satu per satu)
```
git init
git add .
git commit -m "Upload pertama"
git branch -M main
git remote add origin https://github.com/USERNAME/buku-saku.git
git push -u origin main
```
Ganti `USERNAME` dengan username GitHub Anda. Perhatikan **titik** setelah `git add`.

Saat diminta **Username**: ketik username GitHub. Saat diminta **Password**: tempel **Personal Access Token** (bukan password akun). Layar terlihat **kosong saat menempel — itu normal**; tekan Enter.

### 5d — Membuat Personal Access Token (jika diminta)
1. Buka https://github.com/settings/tokens → **Generate new token** → **Generate new token (classic)**.
2. **Note:** `git-push`. **Expiration:** 90 days. Centang **repo**.
3. **Generate token**, lalu **salin** (`ghp_…`) — hanya tampil sekali.
4. Ulangi `git push -u origin main` dan tempel token sebagai password.

✅ **Berhasil jika:** muncul `Writing objects: 100%` dan `* [new branch] main -> main`.

> Alternatif tanpa terminal: **GitHub Desktop** (https://desktop.github.com) → *Add Local Repository* → pilih folder `buku-saku-smpn3-kediri` → *Publish repository*.

---

## Bagian 6 — Aktifkan GitHub Pages

1. Di repository GitHub: **Settings** → **Pages** (menu kiri).
2. **Source:** *Deploy from a branch*. **Branch:** `main` dan `/ (root)`. Klik **Save**.
3. Tunggu 1–2 menit lalu muat ulang. Akan muncul: *Your site is live at* **`https://USERNAME.github.io/buku-saku/`**.
4. Centang **Enforce HTTPS** bila tersedia.

✅ **Berhasil jika:** alamat itu menampilkan halaman Buku Saku Digital dengan tata tertib.

---

## Bagian 7 — Pengaturan awal (dilakukan sekali)

Buka alamat situs Anda, klik **Masuk** → **Admin darurat**, dan masuk dengan akses darurat dari langkah 1.5.

1. **Pengaturan → Keamanan:** ganti nama pengguna & kata sandi darurat dengan milik Anda sendiri (minimal 12 karakter, huruf + angka). Simpan di tempat aman.
2. **Pengaturan → Umum:** isi nama sekolah, tahun ajaran, dasar penetapan (SK Kepala Sekolah), kategori pasal, daftar kelas (sesuaikan dengan kelas di sekolah), kontak koordinator BK, dan tautan buku saku PDF (Google Drive).
3. **Tata Tertib:** hapus pasal contoh, lalu **Tambah Pasal** sesuai SK sekolah (isi, tingkat, tahapan sanksi edukatif).
4. **Data Murid & Guru → tab Data Guru:** unggah/tambah guru dan guru BK. Isi **Kelas Diampu** untuk wali kelas (mis. `IX-A`); **kosongkan** untuk Guru BK yang menangani semua kelas.
5. **Buat akun guru:** pilih guru → **Buat Akun Terpilih** → **Cetak Kartu**. Kata sandi awal **hanya tampil sekali**.
6. **Data Murid:** **Unggah Excel** → **Unduh Template** → isi → unggah → perbaiki baris merah → **Simpan**. Lalu **Buat Akun untuk Semua yang Belum Punya** → **Cetak Kartu Login** dan bagikan ke wali kelas.
7. (Opsional) **Pengumuman** dan **Kalender Sekolah**.

### Alur kerja harian
| Siapa | Melakukan |
|---|---|
| **Guru/BK** | **Catatan Pelanggaran → Catat Pelanggaran Baru** → pilih murid, pasal, isi uraian dan konsekuensi edukatif |
| **Siswa** | Masuk (NISN + sandi) → **Catatan Saya** → **Setujui** atau **Ajukan Keberatan** (wajib beralasan) |
| **Guru/BK** | Jika ada keberatan → ikon **Mediasi** → revisi konsekuensi atau catat **disepakati bersama** |
| **Admin** | **Data Terhapus** → pulihkan data yang terhapus tidak sengaja |

Catatan berstatus **Disepakati** hanya setelah siswa menyetujui (atau guru mencatat kesepakatan hasil mediasi tatap muka). Catatan yang sudah disepakati tidak dapat diubah — jika keliru, hapus lalu buat baru.

---

## Bagian 8 — Notifikasi WhatsApp & Email (opsional)

### WhatsApp lewat Fonnte
1. Daftar di https://fonnte.com, tambahkan perangkat (nomor WhatsApp sekolah), dan salin **token** perangkat.
2. Di aplikasi: **Kontak & Notifikasi → Konfigurasi** → tempel token → **Cek perangkat** → isi nomor tes → **Kirim tes WA**.
3. Isi **Alamat aplikasi** dengan alamat GitHub Pages Anda (untuk tautan di dalam pesan).
4. Aktifkan **Notifikasi WhatsApp**, atur **Matriks notifikasi** (kejadian mana yang mengirim lewat kanal apa), lalu **Simpan Konfigurasi**.

Token disimpan **di server (Script Properties)**, tidak pernah tampil di sheet atau browser.

### Cara kerja pengiriman
Notifikasi tidak dikirim langsung saat guru menekan Simpan, tetapi **dimasukkan ke antrean** lalu dikirim oleh pemicu waktu (tiap 1 menit) — jadi aplikasi tetap cepat dan aman dari pembatasan. Pesan massal (**Blast**) dikirim **per batch** (10/20/50) dengan jeda antarpesan; nomor ganda, tidak valid, dan yang opt-out otomatis dibuang. Pantau di tab **Antrean Pesan**.

> **Etika & aturan WhatsApp:** kirim hanya kepada wali yang relevan, hindari pesan massal berlebihan (nomor dapat diblokir WhatsApp), dan hormati permintaan **opt-out**.

### Email
Aktifkan **Notifikasi email** di tab yang sama. Email dikirim dari akun Google pemilik Apps Script dan dibatasi kuota harian Google (sisa kuota tampil di halaman Konfigurasi).

---

## Bagian 9 — Pasang di ponsel (seperti aplikasi)

- **Android (Chrome):** buka situs → menu ⋮ → **Tambahkan ke layar utama** / **Instal aplikasi**.
- **iPhone (Safari):** tombol **Bagikan** → **Tambah ke Layar Utama**.

Tata tertib yang pernah dibuka tetap dapat dibaca saat **offline**. Catatan pribadi tidak disimpan di perangkat dan selalu butuh koneksi + login.

---

## Bagian 10 — Memperbarui aplikasi

**Mengubah tampilan (frontend):** ganti berkas di folder, lalu dari folder yang sama:
```
git add .
git commit -m "Perbarui tampilan"
git push
```
Tunggu 1–2 menit. Jika masih tampil versi lama, tekan **Ctrl+Shift+R**.

**Mengubah kode backend:** tempel kode baru di Apps Script, lalu **Terapkan → Kelola penerapan → ikon pensil → Versi: Versi baru → Terapkan**. URL `/exec` **tetap sama**. Jika Anda membuat "Penerapan baru", URL berubah dan `config.js` harus diperbarui.

**Cadangan:** buka spreadsheet database di Google Drive → **File → Buat salinan** secara berkala (mis. tiap akhir semester).

---

## Bagian 11 — Masalah yang sering muncul

| Gejala | Penyebab & solusi |
|---|---|
| Layar "Aplikasi belum dihubungkan" | `js/config.js` masih berisi tulisan contoh. Isi URL `/exec` (Bagian 4) lalu `git add . → commit → push`. |
| "Tidak dapat membuka aplikasi" / respons tidak dikenali | URL salah, atau Web App belum diatur **Siapa saja** (Bagian 2). Buka URL `/exec` langsung di browser — harus tampil JSON. |
| "Database belum dibuat" | `setupAppEnvironment` belum dijalankan (Bagian 1.4). |
| Situs 404 di GitHub Pages | `git init` dijalankan di folder yang salah. Lihat **Perbaikan** di bawah. |
| Tampil polos tanpa warna | Folder `css/` & `js/` rata di root (terunggah lewat web). Ulangi Bagian 5 lewat terminal. |
| "Terlalu banyak percobaan" saat login | Dikunci 15 menit setelah 5 kali salah. Tunggu, atau admin **reset sandi**. |
| Perubahan backend tidak terlihat | Anda belum membuat **Versi baru** pada penerapan (Bagian 10). |
| WhatsApp tidak terkirim | Cek **Antrean Pesan** (kolom respons), perangkat Fonnte harus *connect*, dan token benar. |
| Excel: NISN kehilangan angka 0 di depan | Gunakan **template dari aplikasi** (kolom berformat Teks). |
| Siswa lupa sandi | Guru/admin: **Data Murid → ikon kunci** untuk membuat sandi baru. |

**Perbaikan salah folder (404):** dari folder yang benar (`buku-saku-smpn3-kediri`, harus terlihat `index.html`):
```
git init
git add .
git commit -m "Perbaikan: push dari folder yang benar"
git branch -M main
git remote add origin https://github.com/USERNAME/buku-saku.git
git push -u origin main --force
```
`--force` menimpa isi repository dengan versi di komputer Anda. Aman di sini karena isi lama memang salah struktur.

---

## Keamanan & privasi — wajib dibaca

- **Repository publik aman** karena berisi tampilan saja. Satu-satunya "rahasia" di frontend adalah alamat `/exec`, yang memang publik. Semua kunci (token WhatsApp, kunci sesi, sandi darurat) tersimpan di **Script Properties** Apps Script.
- **Jangan bagikan spreadsheet database** ke siapa pun. Isinya data pribadi anak dan hash kata sandi. Batasi akses hanya untuk akun Google pengelola.
- **Kata sandi:** hanya hash yang disimpan; sandi awal hanya tampil sekali; mengganti/mereset/menonaktifkan akun langsung mengeluarkan perangkat lama; sesi berlaku 12 jam. Siswa dan guru yang masuk di komputer bersama akan otomatis keluar saat tab ditutup.
- **Catatan kedisiplinan adalah data pribadi anak di bawah umur.** Batasi akses sesuai peran (sudah diterapkan: siswa hanya melihat catatannya sendiri; wali kelas hanya kelasnya), susun kebijakan penggunaan data bersama pimpinan sekolah, dan konsultasikan kepatuhan pada ketentuan perlindungan data pribadi yang berlaku dengan pihak yang berwenang.
- Penghapusan bersifat **soft delete** (dapat dipulihkan admin) dan semua perubahan penting tercatat di **Pengaturan → Log Aktivitas**.

## Batasan yang perlu Anda ketahui

- "Batas konfirmasi 24 jam" di halaman siswa bersifat **imbauan** — sistem tidak menyetujui otomatis bila lewat batas.
- Google Apps Script memiliki **kuota harian dan batas waktu eksekusi**. Aplikasi memakai cache dan pemrosesan bertahap untuk menghindarinya, tetapi untuk sekolah sangat besar atau blast ribuan pesan, pantau halaman **Pengaturan → Status Sistem**.
- Notifikasi WhatsApp bergantung pada layanan pihak ketiga (Fonnte); fitur deteksi nomor WA tergantung paket Fonnte Anda.
- **Uji dengan data kecil dulu** (1 guru, 3 murid, 1 kelas) sebelum membuka ke seluruh sekolah.
