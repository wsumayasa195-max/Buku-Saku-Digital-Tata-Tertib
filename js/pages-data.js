/* Halaman: Data Murid & Guru — tabel, tambah/ubah, hapus lunak, unggah Excel (wizard), penerbitan akun. */
(function () {
  const { $, $$, esc, ic } = UI, A = App.Actions;
  const SHEETJS = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  const EXCELJS = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js';

  /* konfigurasi per entitas: kunci server (huruf kecil) → judul kolom template */
  const ENT = {
    murid: { api: 'murid', nama: 'Murid', kunci: 'nisn', kolom: [['nisn', 'NISN', 16], ['nama', 'Nama Lengkap', 30], ['kelas', 'Kelas', 10], ['namaWali', 'Nama Wali', 26], ['kontakWali', 'No. WA Wali', 18], ['email', 'Email (opsional)', 28]],
      alias: { nisn: ['nisn', 'nis'], nama: ['nama', 'nama lengkap', 'nama siswa', 'nama murid'], kelas: ['kelas', 'rombel'], namaWali: ['nama wali', 'wali', 'orang tua', 'nama orang tua'], kontakWali: ['no wa wali', 'kontak wali', 'no hp wali', 'hp wali', 'wa wali', 'kontak'], email: ['email', 'e mail'] } },
    guru: { api: 'guru', nama: 'Guru', kunci: 'nip', kolom: [['nip', 'NIP / ID', 22], ['nama', 'Nama Lengkap', 30], ['mataPelajaran', 'Mata Pelajaran', 22], ['peran', 'Peran', 14], ['kelasDiampu', 'Kelas Diampu', 20], ['kontak', 'No. WA', 18], ['email', 'Email (opsional)', 28]],
      alias: { nip: ['nip id', 'nip', 'id guru', 'nuptk', 'nik'], nama: ['nama', 'nama lengkap', 'nama guru'], mataPelajaran: ['mata pelajaran', 'mapel'], peran: ['peran', 'jabatan', 'tugas'], kelasDiampu: ['kelas diampu', 'kelas', 'wali kelas'], kontak: ['no wa', 'kontak', 'no hp', 'hp', 'wa', 'no wa guru'], email: ['email', 'e mail'] } }
  };
  const norm = function (h) { return String(h || '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); };
  const DT = { tab: 'murid', st: { murid: { cari: '', kelas: '', halaman: 1, per: 25 }, guru: { cari: '', kelas: '', halaman: 1, per: 25 } }, d: { murid: null, guru: null }, sel: {}, ctx: null };
  const W = { ent: 'murid', step: 1, file: null, rows: [], hasil: null, tampilSemua: false };

  App.register('data', { judul: 'Data Murid & Guru', roles: ['guru', 'admin'], render: async function (view, ctx) {
    DT.ctx = ctx; DT.sel = {}; if (!App.isAdmin()) DT.tab = 'murid';
    view.innerHTML = '<div class="page-h"><div class="t"><div class="eyebrow">' + ic('db') + 'Master data</div><h1>Data Murid &amp; Guru</h1><p>Kelola data murid dan guru. Unggah dari Excel, perbaiki baris yang salah, lalu simpan — data yang dihapus tidak langsung hilang.</p></div></div>'
      + (App.isAdmin() ? '<div class="tabs" id="dt-tabs"><button data-act="dt.tab" data-t="murid">Data Murid</button><button data-act="dt.tab" data-t="guru">Data Guru</button></div>' : '')
      + '<div id="dt-body"></div><div id="dt-wizard"></div>';
    paintTabs(); await muatDT();
  } });
  function paintTabs() { $$('#dt-tabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-t') === DT.tab); }); }
  A['dt.tab'] = function (el) { DT.tab = el.getAttribute('data-t'); DT.sel = {}; W.step = 1; W.rows = []; W.hasil = null; W.file = null; $('#dt-wizard').innerHTML = ''; $('#dt-body').innerHTML = ''; paintTabs(); muatDT(); };

  async function muatDT() {
    const t = DT.tab, e = ENT[t], st = DT.st[t], body = $('#dt-body'); if (!body) return;
    const boot = App.boot();
    if (!$('#dt-toolbar')) {
      body.innerHTML = '<div class="card"><div class="filters" id="dt-toolbar"><div class="grow search" style="max-width:none"><input class="in" id="dt-q" style="padding-left:42px" type="search" placeholder="Cari nama atau ' + (t === 'murid' ? 'NISN' : 'NIP') + '…">' + ic('search') + '</div>'
        + (t === 'murid' ? '<select class="in" id="dt-kelas"><option value="">Semua Kelas</option>' + boot.kelas.map(function (k) { return '<option>' + esc(k) + '</option>'; }).join('') + '</select>' : '')
        + '<button class="btn btn-p btn-sm" data-act="dt.baru">' + ic('plus') + 'Tambah</button><button class="btn btn-ob btn-sm" data-act="dt.unggah">' + ic('upload') + 'Unggah Excel</button></div>'
        + '<div class="row" style="margin:12px 0"><button class="btn btn-o btn-sm" data-act="dt.akunTerpilih">' + ic('key') + 'Buat Akun Terpilih</button><button class="btn btn-o btn-sm" data-act="dt.akunSemua">' + ic('users') + 'Buat Akun untuk Semua yang Belum Punya</button><button class="btn btn-d btn-sm right" data-act="dt.hapusTerpilih">' + ic('trash') + 'Hapus Terpilih</button></div><div id="dt-tabel"></div></div>';
      const q = $('#dt-q'); q.addEventListener('input', UI.debounce(function () { DT.st[DT.tab].cari = q.value; DT.st[DT.tab].halaman = 1; muatDT(); }, 300));
      const k = $('#dt-kelas'); if (k) k.addEventListener('change', function () { DT.st[DT.tab].kelas = k.value; DT.st[DT.tab].halaman = 1; muatDT(); });
    }
    const box = $('#dt-tabel'); box.innerHTML = UI.skeleton(3);
    try {
      const d = await API.call(e.api + '.list', st); DT.d[t] = d; if (!DT.ctx.alive()) return;
      const akun = function (x) { return x.punyaAkun ? (x.akunAktif ? '<span class="pill ok">Aktif</span>' : '<span class="pill gray">Nonaktif</span>') : '<span class="pill warn">Belum ada</span>'; };
      const wa = function (s) { return s === 'Terdaftar' ? '<span class="pill ok" title="Terdaftar di WhatsApp">WA ✓</span>' : s === 'Tidak Terdaftar' ? '<span class="pill bad">Bukan WA</span>' : ''; };
      const aksi = function (x) { return '<td class="acts nolabel"><button class="btn-ic" data-act="dt.reset" data-id="' + esc(x.id) + '" aria-label="Reset sandi" title="Buat/reset akun">' + ic('key') + '</button><button class="btn-ic" data-act="dt.ubah" data-id="' + esc(x.id) + '" aria-label="Ubah">' + ic('pencil') + '</button><button class="btn-ic del" data-act="dt.hapus" data-id="' + esc(x.id) + '" aria-label="Hapus">' + ic('trash') + '</button></td>'; };
      const ck = function (x) { return '<td data-l="Pilih"><input type="checkbox" data-dsel="' + esc(x.id) + '" ' + (DT.sel[x.id] ? 'checked' : '') + ' aria-label="Pilih"></td>'; };
      const th = '<th style="width:36px"><input type="checkbox" id="dt-all" aria-label="Pilih semua"></th>';
      let tbl;
      if (t === 'murid') tbl = '<thead><tr>' + th + '<th>NISN</th><th>Nama</th><th>Kelas</th><th>Wali &amp; Kontak</th><th>Akun</th><th>Aksi</th></tr></thead><tbody>' + d.rows.map(function (x) { return '<tr>' + ck(x) + '<td data-l="NISN" class="mono">' + esc(x.nisn) + '</td><td data-l="Nama"><b>' + esc(x.nama) + '</b></td><td data-l="Kelas"><span class="pill gray">' + esc(x.kelas) + '</span></td><td data-l="Wali">' + esc(x.namaWali || '-') + '<span class="sub mono">' + esc(x.kontakWali) + ' ' + wa(x.statusWA) + '</span></td><td data-l="Akun">' + akun(x) + '</td>' + aksi(x) + '</tr>'; }).join('') + '</tbody>';
      else tbl = '<thead><tr>' + th + '<th>NIP / ID</th><th>Nama</th><th>Peran</th><th>Kelas diampu</th><th>Kontak</th><th>Akun</th><th>Aksi</th></tr></thead><tbody>' + d.rows.map(function (x) { return '<tr>' + ck(x) + '<td data-l="NIP" class="mono">' + esc(x.nip) + '</td><td data-l="Nama"><b>' + esc(x.nama) + '</b><span class="sub">' + esc(x.mataPelajaran) + '</span></td><td data-l="Peran"><span class="pill blue">' + esc(x.peran) + '</span></td><td data-l="Kelas">' + esc(x.kelasDiampu || 'Semua kelas') + '</td><td data-l="Kontak" class="mono">' + esc(x.kontak || '-') + ' ' + wa(x.statusWA) + '</td><td data-l="Akun">' + akun(x) + '</td>' + aksi(x) + '</tr>'; }).join('') + '</tbody>';
      box.innerHTML = d.rows.length ? '<div class="tbl-wrap"><table class="t rt">' + tbl + '</table></div>' + UI.pager(d.total, d.halaman, d.per, 'dm') : UI.kosong('users', st.cari || st.kelas ? 'Tidak ada data yang cocok.' : 'Belum ada data ' + e.nama.toLowerCase() + '. Unggah dari Excel atau tambah satu per satu.');
      const all = $('#dt-all'); if (all) all.addEventListener('change', function () { $$('[data-dsel]').forEach(function (c) { c.checked = all.checked; DT.sel[c.getAttribute('data-dsel')] = all.checked; }); });
    } catch (er) { box.innerHTML = App.errorBox(er); }
  }
  document.addEventListener('change', function (e) { const s = e.target.getAttribute && e.target.getAttribute('data-dsel'); if (s) DT.sel[s] = e.target.checked; });
  App.Pagers.dm = function (n) { DT.st[DT.tab].halaman = n; muatDT(); };
  const baris = function (id) { return (DT.d[DT.tab] ? DT.d[DT.tab].rows : []).filter(function (x) { return x.id === id; })[0]; };
  const terpilih = function () { return Object.keys(DT.sel).filter(function (k) { return DT.sel[k]; }); };

  /* ---------- tambah / ubah ---------- */
  function formEntitas(x) {
    const t = DT.tab, boot = App.boot(), baru = !x; x = x || {};
    const isi = t === 'murid'
      ? '<div class="form-g"><div class="field"><label>NISN</label><input class="in" name="nisn" inputmode="numeric" value="' + esc(x.nisn || '') + '"></div><div class="field"><label>Kelas</label><select class="in" name="kelas"><option value="">— pilih —</option>' + boot.kelas.map(function (k) { return '<option ' + (k === x.kelas ? 'selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select></div><div class="field full"><label>Nama lengkap</label><input class="in" name="nama" value="' + esc(x.nama || '') + '"></div><div class="field"><label>Nama wali</label><input class="in" name="namaWali" value="' + esc(x.namaWali || '') + '"></div><div class="field"><label>No. WA wali</label><input class="in" name="kontakWali" inputmode="tel" value="' + esc(x.kontakWali || '') + '" placeholder="08xxxxxxxxxx"></div><div class="field full"><label>Email (opsional)</label><input class="in" name="email" type="email" value="' + esc(x.email || '') + '"></div></div>'
      : '<div class="form-g"><div class="field"><label>NIP / ID</label><input class="in" name="nip" value="' + esc(x.nip || '') + '"></div><div class="field"><label>Peran</label><select class="in" name="peran">' + ['Guru', 'Guru BK', 'Wali Kelas'].map(function (p) { return '<option ' + (p === x.peran ? 'selected' : '') + '>' + p + '</option>'; }).join('') + '</select></div><div class="field full"><label>Nama lengkap</label><input class="in" name="nama" value="' + esc(x.nama || '') + '"></div><div class="field"><label>Mata pelajaran</label><input class="in" name="mataPelajaran" value="' + esc(x.mataPelajaran || '') + '"></div><div class="field"><label>Kelas diampu</label><input class="in" name="kelasDiampu" value="' + esc(x.kelasDiampu || '') + '" placeholder="IX-A, IX-B (kosong = semua kelas)"><span class="hint">Menentukan kelas yang boleh dilihat guru ini.</span></div><div class="field"><label>No. WA</label><input class="in" name="kontak" inputmode="tel" value="' + esc(x.kontak || '') + '"></div><div class="field"><label>Email</label><input class="in" name="email" type="email" value="' + esc(x.email || '') + '"></div></div>';
    UI.modal({ judul: (baru ? 'Tambah ' : 'Ubah ') + ENT[t].nama, isi: '<form>' + isi + '</form>', tombol: [{ label: 'Batal', aksi: function () { return true; } }, { label: 'Simpan', kelas: 'btn-p', aksi: async function (c) { const f = UI.form(c.el); f.id = x.id; await API.call(ENT[t].api + '.simpan', f); UI.ok('Data tersimpan.'); muatDT(); } }] });
  }
  A['dt.baru'] = function () { formEntitas(); }; A['dt.ubah'] = function (el) { const x = baris(el.getAttribute('data-id')); if (x) formEntitas(x); };
  async function hapus(ids) {
    if (!ids.length) return UI.toast('Centang data yang akan dihapus.', 'warn');
    if (!(await UI.konfirmasiHapus(ids.length, ENT[DT.tab].nama.toLowerCase()))) return;
    try { await API.call(ENT[DT.tab].api + '.hapus', { ids: ids }); DT.sel = {}; UI.ok(ids.length + ' data dipindahkan ke Data Terhapus. Akun login dinonaktifkan.'); muatDT(); } catch (e) { UI.err(e); }
  }
  A['dt.hapus'] = function (el) { hapus([el.getAttribute('data-id')]); }; A['dt.hapusTerpilih'] = function () { hapus(terpilih()); };

  /* ---------- akun login ---------- */
  async function buatAkun(ids, reset) {
    const t = DT.tab, e = ENT[t], kartu = []; let dibuat = 0, direset = 0;
    const prog = UI.modal({ judul: 'Membuat akun…', ukuran: 'sm', kunci: true, isi: '<div class="prog" style="margin:10px 0"><i id="ak-bar" style="width:0%"></i></div><p class="muted" id="ak-txt">Memproses…</p>' });
    try {
      for (let i = 0; i < ids.length; i += 15) {
        const r = await API.call(e.api + '.akun', { ids: ids.slice(i, i + 15), reset: !!reset }); dibuat += r.dibuat; direset += r.direset; r.kartu.forEach(function (k) { kartu.push(k); });
        const p = Math.round(Math.min(ids.length, i + 15) * 100 / ids.length); $('#ak-bar', prog.el).style.width = p + '%'; $('#ak-txt', prog.el).textContent = Math.min(ids.length, i + 15) + ' dari ' + ids.length + ' diproses';
      }
    } catch (er) { prog.tutup(); UI.err(er); if (!kartu.length) return; }
    prog.tutup(); muatDT(); tampilKartu(kartu, dibuat, direset);
  }
  function tampilKartu(kartu, dibuat, direset) {
    const bersandi = kartu.filter(function (k) { return k.sandi; }), lain = kartu.filter(function (k) { return !k.sandi; }), b = App.boot().app, url = location.href.split('#')[0];
    UI.modal({ judul: 'Kartu Login', ukuran: 'lg', isi: '<div class="alert warn" style="margin-bottom:12px">' + ic('lock') + '<div><b>Catat atau cetak sekarang.</b> Kata sandi awal hanya tampil sekali dan tidak dapat dilihat lagi (yang tersimpan hanya hash). Pengguna diminta membuat kata sandi baru saat masuk pertama.</div></div><p>' + dibuat + ' akun dibuat, ' + direset + ' direset' + (lain.length ? ', ' + lain.length + ' dilewati' : '') + '.</p>'
      + (bersandi.length ? '<div class="tbl-wrap" style="margin-top:10px"><table class="t"><thead><tr><th>Username</th><th>Nama</th><th>Kelas / Mapel</th><th>Kata sandi awal</th></tr></thead><tbody>' + bersandi.map(function (k) { return '<tr><td class="mono">' + esc(k.username) + '</td><td>' + esc(k.nama) + '</td><td>' + esc(k.kelas) + '</td><td class="mono"><b>' + esc(k.sandi) + '</b></td></tr>'; }).join('') + '</tbody></table></div>' : '')
      + (lain.length ? '<details style="margin-top:10px"><summary class="muted">Dilewati (' + lain.length + ')</summary>' + lain.map(function (k) { return '<div class="muted">' + esc(k.nama) + ' — ' + esc(k.status) + '</div>'; }).join('') + '</details>' : ''),
      tombol: bersandi.length ? [{ label: ic('download') + 'Unduh CSV', aksi: function () { UI.unduhTeks('kartu-login.csv', UI.csv([['Username', 'Nama', 'Kelas', 'Kata sandi awal']].concat(bersandi.map(function (k) { return [k.username, k.nama, k.kelas, k.sandi]; }))), 'text/csv;charset=utf-8'); return false; } },
        { label: ic('print') + 'Cetak Kartu', kelas: 'btn-p', aksi: function () { UI.cetak('Kartu Login', '<h1>Kartu Login ' + UI.esc(b.nama) + '</h1><p class="m">' + UI.esc(b.sekolah) + ' · Alamat: ' + UI.esc(url) + '</p><div class="k">' + bersandi.map(function (k) { return '<div class="c"><b>' + UI.esc(k.nama) + '</b>' + UI.esc(k.kelas) + '<br>Username: <b>' + UI.esc(k.username) + '</b>Kata sandi: <b>' + UI.esc(k.sandi) + '</b><span class="m">Buat kata sandi baru saat masuk pertama kali.</span></div>'; }).join('') + '</div>'); return false; } }] : [{ label: 'Tutup', aksi: function () { return true; } }] });
  }
  A['dt.akunTerpilih'] = function () { const ids = terpilih(); if (!ids.length) return UI.toast('Centang data yang akan dibuatkan akun.', 'warn'); buatAkun(ids, false); };
  A['dt.reset'] = async function (el) { const x = baris(el.getAttribute('data-id')); if (!x) return; const ada = x.punyaAkun; if (!(await UI.konfirmasi({ judul: ada ? 'Reset kata sandi?' : 'Buat akun?', pesan: ada ? x.nama + ' akan mendapat kata sandi awal baru dan perangkat lamanya otomatis keluar.' : 'Buat akun login untuk ' + x.nama + '?', ok: ada ? 'Reset' : 'Buat akun' }))) return; buatAkun([x.id], true); };
  A['dt.akunSemua'] = async function () {
    const t = DT.tab, st = DT.st[t]; if (!(await UI.konfirmasi({ judul: 'Buat akun massal', pesan: 'Buat akun untuk semua ' + ENT[t].nama.toLowerCase() + (st.kelas ? ' di kelas ' + st.kelas : '') + ' yang belum punya akun? Kartu login akan ditampilkan untuk dicetak.', ok: 'Lanjutkan' }))) return;
    const ids = []; try { for (let h = 1; h <= 25; h++) { const d = await API.call(ENT[t].api + '.list', { cari: '', kelas: st.kelas, halaman: h, per: 100 }); d.rows.forEach(function (x) { if (!x.punyaAkun) ids.push(x.id); }); if (h * 100 >= d.total) break; } } catch (e) { return UI.err(e); }
    if (!ids.length) return UI.toast('Semua data sudah punya akun.', 'ok'); buatAkun(ids, false);
  };

  /* ======================= WIZARD UNGGAH EXCEL ======================= */
  A['dt.unggah'] = function () { W.ent = DT.tab; W.step = 1; W.rows = []; W.hasil = null; W.file = null; W.tampilSemua = false; paintWizard(); $('#dt-wizard').scrollIntoView({ behavior: 'smooth' }); };
  function paintWizard() {
    const e = ENT[W.ent], box = $('#dt-wizard'); if (!box) return; const s = W.step;
    const stp = function (n, ttl, sub) { return '<div class="step ' + (s > n ? 'done' : s === n ? 'cur' : '') + '"><span class="n">' + (s > n ? ic('check') : n) + '</span><div><small>Langkah ' + n + ': ' + (s > n ? 'Selesai' : s === n ? 'Sedang berjalan' : 'Terakhir') + '</small><b>' + ttl + '</b></div></div>'; };
    let body = '';
    if (s === 1) body = '<div class="alert">' + ic('info') + '<div>Unduh template, isi data mulai baris ke-2, lalu simpan sebagai <b>.xlsx</b>. Kolom NISN/NIP/WA dibuat berformat <b>Teks</b> agar angka 0 di depan tidak hilang. Kolom Kelas berisi daftar pilihan.</div></div><div class="row" style="margin-top:14px"><button class="btn btn-ob" data-act="wz.template">' + ic('download') + 'Unduh Template Format (.xlsx)</button><button class="btn btn-p" data-act="wz.langkah2">Saya sudah mengisi — lanjut unggah ' + ic('arrow') + '</button></div>';
    else if (s === 2 && !W.hasil) body = '<div class="drop" id="wz-drop" data-act="wz.pilih" role="button" tabindex="0">' + ic('upload') + '<p><b>Tarik berkas Excel ke sini</b> atau klik untuk memilih</p><p class="muted">Format .xlsx / .xls — maksimal 2.000 baris, 5 MB</p></div><input type="file" id="wz-file" accept=".xlsx,.xls,.csv" class="hide">';
    else if (s >= 2) body = pratinjau();
    box.innerHTML = '<section class="card" style="margin-top:20px"><div class="row" style="justify-content:space-between"><div><h3 style="display:flex;gap:8px;align-items:center">' + ic('filexl') + 'Wizard Unggah Data Excel (' + e.nama + ')</h3><p class="muted" style="margin-top:4px">Perbarui data secara serentak dengan validasi otomatis. Baris yang salah bisa diperbaiki tanpa mengulang seluruh file.</p></div><button class="btn btn-g btn-sm" data-act="wz.tutup">' + ic('x') + 'Tutup</button></div><div class="steps">' + stp(1, 'Unduh &amp; Isi Template') + stp(2, 'Unggah &amp; Validasi Data') + stp(3, 'Simpan ke Database') + '</div>' + body + '</section>';
    const f = $('#wz-file'), dz = $('#wz-drop');
    if (f) f.addEventListener('change', function () { if (f.files[0]) bacaFile(f.files[0]); });
    if (dz) { ['dragenter', 'dragover'].forEach(function (n) { dz.addEventListener(n, function (ev) { ev.preventDefault(); dz.classList.add('over'); }); }); ['dragleave', 'drop'].forEach(function (n) { dz.addEventListener(n, function (ev) { ev.preventDefault(); dz.classList.remove('over'); }); }); dz.addEventListener('drop', function (ev) { if (ev.dataTransfer.files[0]) bacaFile(ev.dataTransfer.files[0]); }); dz.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') f.click(); }); }
  }
  A['wz.tutup'] = function () { $('#dt-wizard').innerHTML = ''; }; A['wz.langkah2'] = function () { W.step = 2; paintWizard(); };
  A['wz.pilih'] = function () { const f = $('#wz-file'); if (f) f.click(); };

  A['wz.template'] = async function (el) {
    const e = ENT[W.ent], kelas = App.boot().kelas; el.disabled = true;
    try {
      await UI.muatSkrip(EXCELJS);
      const wb = new ExcelJS.Workbook(), ws = wb.addWorksheet(e.nama), pt = wb.addWorksheet('Petunjuk'), dk = wb.addWorksheet('Daftar Kelas');
      ws.columns = e.kolom.map(function (k) { return { header: k[1], key: k[0], width: k[2] }; });
      ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }; ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } }; ws.views = [{ state: 'frozen', ySplit: 1 }];
      e.kolom.forEach(function (k, i) { ws.getColumn(i + 1).numFmt = '@'; });
      dk.getCell('A1').value = 'Kelas'; kelas.forEach(function (k, i) { dk.getCell('A' + (i + 2)).value = k; }); dk.getColumn(1).width = 14;
      const kc = W.ent === 'murid' ? 3 : 5, pc = 4;
      for (let r = 2; r <= 2001; r++) {
        if (W.ent === 'murid') ws.getCell(r, kc).dataValidation = { type: 'list', allowBlank: true, formulae: ["'Daftar Kelas'!$A$2:$A$100"], showErrorMessage: true, errorTitle: 'Kelas tidak dikenal', error: 'Pilih kelas dari daftar.' };
        else ws.getCell(r, pc).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Guru,Guru BK,Wali Kelas"'] };
      }
      pt.getColumn(1).width = 110;
      (W.ent === 'murid' ? ['PETUNJUK PENGISIAN DATA MURID', 'Isi data mulai baris ke-2 pada sheet "Murid". Jangan mengubah judul kolom.', 'NISN: 8–12 digit angka. Kolom sudah berformat Teks agar angka 0 di depan tidak hilang.', 'Kelas: pilih dari daftar (contoh IX-A).', 'No. WA Wali: contoh 081234567890 (wajib, dipakai untuk notifikasi).', 'Email: opsional.', 'Satu NISN hanya boleh muncul satu kali di file. Jika NISN sudah ada di sistem, datanya akan DIPERBARUI.']
        : ['PETUNJUK PENGISIAN DATA GURU', 'Isi data mulai baris ke-2 pada sheet "Guru". Jangan mengubah judul kolom.', 'NIP / ID: 4–25 karakter. Kolom berformat Teks.', 'Peran: pilih Guru, Guru BK, atau Wali Kelas.', 'Kelas Diampu: pisahkan dengan koma (contoh IX-A, IX-B). KOSONGKAN untuk Guru BK yang menangani semua kelas.', 'No. WA dan email: opsional tetapi disarankan.']).forEach(function (t, i) { pt.getCell('A' + (i + 1)).value = t; if (!i) pt.getCell('A1').font = { bold: true, size: 14 }; });
      wb.eachSheet(function (s) { if (s.name === 'Murid' || s.name === 'Guru') s.state = 'visible'; });
      const buf = await wb.xlsx.writeBuffer(); unduhBlob('template-' + W.ent + '.xlsx', new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    } catch (er) {
      try {                                                                         // cadangan tanpa dropdown
        await UI.muatSkrip(SHEETJS); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([e.kolom.map(function (k) { return k[1]; })]), e.nama); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Kelas']].concat(kelas.map(function (k) { return [k]; }))), 'Daftar Kelas'); XLSX.writeFile(wb, 'template-' + W.ent + '.xlsx'); UI.toast('Template dasar diunduh (tanpa daftar pilihan kelas).', 'warn');
      } catch (e2) { UI.err(er); }
    } finally { el.disabled = false; }
  };
  function unduhBlob(nama, blob) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nama; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800); }

  async function bacaFile(file) {
    if (file.size > 5 * 1024 * 1024) return UI.toast('Ukuran berkas maksimal 5 MB.', 'warn');
    const e = ENT[W.ent], box = $('#dt-wizard'); const drop = $('#wz-drop'); if (drop) drop.innerHTML = '<span class="spin dark"></span> Membaca berkas…';
    try {
      await UI.muatSkrip(SHEETJS);
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const nm = wb.SheetNames.filter(function (n) { return !/petunjuk|daftar kelas/i.test(n); }), pilih = nm.filter(function (n) { return n.toLowerCase() === e.nama.toLowerCase(); })[0] || nm[0];
      const aoa = XLSX.utils.sheet_to_json(wb.Sheets[pilih], { header: 1, raw: false, defval: '' });
      const peta = {}; Object.keys(e.alias).forEach(function (k) { e.alias[k].forEach(function (a) { peta[a] = k; }); });
      let hr = -1, kol = {};
      for (let i = 0; i < Math.min(aoa.length, 10) && hr < 0; i++) { const m = {}; aoa[i].forEach(function (h, j) { const k = peta[norm(h)]; if (k && m[k] === undefined) m[k] = j; }); if (Object.keys(m).length >= 2 && m[e.kunci] !== undefined) { hr = i; kol = m; } }
      if (hr < 0) throw new Error('Judul kolom tidak dikenali. Gunakan template dari tombol “Unduh Template Format”.');
      const rows = []; for (let i = hr + 1; i < aoa.length; i++) { const r = aoa[i]; if (r.join('').trim() === '') continue; const o = { _baris: i + 1 }; Object.keys(kol).forEach(function (k) { o[k] = String(r[kol[k]] == null ? '' : r[kol[k]]).trim(); }); rows.push(o); }
      if (!rows.length) throw new Error('Tidak ada baris data di berkas ini.'); if (rows.length > 2000) throw new Error('Maksimal 2.000 baris per berkas (ditemukan ' + rows.length + '). Pecah menjadi beberapa file.');
      W.file = { nama: file.name, ukuran: file.size, waktu: new Date() }; W.rows = rows; await validasi();
    } catch (er) { UI.err(er); paintWizard(); }
  }
  async function validasi() {
    const e = ENT[W.ent]; const kotak = $('#dt-wizard'); if (kotak) kotak.style.opacity = '.6';
    try { W.hasil = await API.call(e.api + '.importValidasi', { rows: W.rows }); W.step = 2; } finally { if (kotak) kotak.style.opacity = ''; }
    paintWizard();
  }
  function pratinjau() {
    const e = ENT[W.ent], h = W.hasil, r = h.ringkas, f = W.file || { nama: '-', ukuran: 0 };
    const urut = h.rows.slice().sort(function (a, b) { return (a.status === 'error' ? 0 : 1) - (b.status === 'error' ? 0 : 1); }), tampil = W.tampilSemua ? urut : urut.slice(0, 60);
    const idx = function (b) { for (let i = 0; i < W.rows.length; i++) if (W.rows[i]._baris === b) return i; return -1; };
    const kolomLihat = e.kolom.slice(0, W.ent === 'murid' ? 5 : 6);
    return '<div class="filebox">' + ic('filexl') + '<div class="grow"><b style="color:var(--text)">' + esc(f.nama) + '</b> <span class="pill gray">' + Math.max(1, Math.round(f.ukuran / 1024)) + ' KB</span><div class="muted">Diunggah ' + (f.waktu ? f.waktu.toLocaleString('id-ID') : '') + '</div></div><button class="btn btn-o btn-sm" data-act="wz.ganti">Ganti Berkas</button><button class="btn-ic del" data-act="wz.batal" aria-label="Hapus berkas">' + ic('x') + '</button></div>'
      + '<div class="row" style="margin:16px 0 8px;justify-content:space-between"><h3>Pratinjau Hasil Validasi Skema</h3>' + (r.error ? '<span class="pill warn">Ditemukan ' + r.error + ' baris bermasalah</span>' : '<span class="pill ok">Semua baris valid</span>') + '</div>'
      + '<div class="tbl-wrap"><table class="t"><thead><tr><th>Baris</th>' + kolomLihat.map(function (k) { return '<th>' + esc(k[1]) + '</th>'; }).join('') + '<th>Status validasi</th><th>Tindakan</th></tr></thead><tbody>'
      + tampil.map(function (x) {
        const d = x.data, kp = function (k) { const v = { nisn: d.NISN, nip: d.NIP, nama: d.Nama, kelas: d.Kelas, namaWali: d.NamaWali, kontakWali: d.KontakWali, mataPelajaran: d.MataPelajaran, peran: d.Peran, kelasDiampu: d.KelasDiampu, kontak: d.Kontak, email: d.Email }[k]; return v == null || v === '' ? '<span class="faint">-</span>' : esc(v); };
        return '<tr class="' + (x.status === 'error' ? 'row-bad' : '') + '"><td class="mono">' + x.baris + '</td>' + kolomLihat.map(function (k) { return '<td class="' + (k[0] === e.kunci ? 'mono' : '') + '">' + kp(k[0]) + '</td>'; }).join('')
          + '<td>' + (x.status === 'valid' ? '<span class="pill ok">' + ic('check') + (x.aksi === 'perbarui' ? 'Valid · perbarui' : 'Valid') + '</span>' : '<span class="pill bad" title="' + esc(x.errors.join('; ')) + '">' + ic('alert') + 'Error</span><div class="err-msg">' + esc(x.errors.join('; ')) + '</div>') + '</td><td class="acts">' + (x.status === 'error' ? '<button class="btn btn-ob btn-sm" data-act="wz.perbaiki" data-i="' + idx(x.baris) + '">' + ic('pencil') + 'Perbaiki</button>' : '') + '</td></tr>';
      }).join('') + '</tbody></table></div>' + (h.rows.length > tampil.length ? '<p class="muted" style="margin-top:8px">Menampilkan ' + tampil.length + ' dari ' + h.rows.length + ' baris (baris bermasalah ditampilkan lebih dulu). <a href="#" data-act="wz.semua">Tampilkan semua</a></p>' : '')
      + '<div class="row" style="margin-top:16px;justify-content:space-between;align-items:center"><div><b style="color:#15803D">' + r.valid + ' dari ' + r.total + ' baris valid</b> <span class="muted">(' + r.baru + ' baru, ' + r.perbarui + ' diperbarui' + (r.error ? ', ' + r.error + ' bermasalah' : '') + ')</span></div><div class="row">' + (r.error ? '<button class="btn btn-o" data-act="wz.laporan">' + ic('download') + 'Unduh Laporan Error (.xlsx)</button>' : '') + '<button class="btn btn-p" data-act="wz.simpan"' + (r.valid ? '' : ' disabled') + '>' + ic('upload') + 'Simpan Baris yang Valid (' + r.valid + ' Data)</button></div></div>'
      + (r.error ? '<p class="muted" style="margin-top:8px">Baris bermasalah tidak ikut disimpan. Perbaiki di sini lalu simpan, atau perbaiki file Excel dan unggah ulang.</p>' : '');
  }
  A['wz.ganti'] = function () { W.hasil = null; W.rows = []; paintWizard(); }; A['wz.batal'] = A['wz.ganti']; A['wz.semua'] = function () { W.tampilSemua = true; paintWizard(); };
  A['wz.perbaiki'] = function (el) {
    const i = Number(el.getAttribute('data-i')), r = W.rows[i], e = ENT[W.ent]; if (!r) return;
    const h = W.hasil.rows.filter(function (x) { return x.baris === r._baris; })[0];
    UI.modal({ judul: 'Perbaiki Baris ' + r._baris, isi: '<div class="alert bad" style="margin-bottom:12px">' + ic('alertc') + '<div>' + esc(h ? h.errors.join('; ') : '') + '</div></div><form>' + e.kolom.map(function (k) { return '<div class="field"><label>' + esc(k[1]) + '</label><input class="in" name="' + k[0] + '" value="' + esc(r[k[0]] || '') + '"></div>'; }).join('') + '</form>',
      tombol: [{ label: 'Batal', aksi: function () { return true; } }, { label: 'Simpan Perbaikan', kelas: 'btn-p', aksi: async function (c) { const f = UI.form(c.el); Object.keys(f).forEach(function (k) { r[k] = String(f[k]).trim(); }); await validasi(); } }] });
  };
  A['wz.laporan'] = async function () {
    try {
      await UI.muatSkrip(SHEETJS); const e = ENT[W.ent], err = W.hasil.rows.filter(function (x) { return x.status === 'error'; });
      const data = err.map(function (x) { const raw = W.rows.filter(function (r) { return r._baris === x.baris; })[0] || {}, o = { Baris: x.baris }; e.kolom.forEach(function (k) { o[k[1]] = raw[k[0]] || ''; }); o['Alasan error'] = x.errors.join('; '); return o; });
      const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), 'Error'); XLSX.writeFile(wb, 'laporan-error-' + W.ent + '.xlsx');
    } catch (er) { UI.err(er); }
  };
  A['wz.simpan'] = async function (el) {
    const e = ENT[W.ent], valid = {}; W.hasil.rows.forEach(function (x) { if (x.status === 'valid') valid[x.baris] = 1; });
    const kirim = W.rows.filter(function (r) { return valid[r._baris]; }); if (!kirim.length) return;
    el.disabled = true; W.step = 3; const prog = UI.modal({ judul: 'Menyimpan ke database…', ukuran: 'sm', kunci: true, isi: '<div class="prog" style="margin:10px 0"><i id="sv-bar" style="width:0%"></i></div><p class="muted" id="sv-txt">Menyimpan…</p>' });
    let tambah = 0, ubah = 0, tolak = 0;
    try {
      for (let i = 0; i < kirim.length; i += 150) {
        const r = await API.call(e.api + '.importSimpan', { rows: kirim.slice(i, i + 150) }); tambah += r.ditambah; ubah += r.diperbarui; tolak += r.ditolak.length;
        const p = Math.round(Math.min(kirim.length, i + 150) * 100 / kirim.length); $('#sv-bar', prog.el).style.width = p + '%'; $('#sv-txt', prog.el).textContent = Math.min(kirim.length, i + 150) + ' dari ' + kirim.length + ' baris';
      }
      prog.tutup(); UI.ok(tambah + ' data ditambah, ' + ubah + ' diperbarui.' + (tolak ? ' ' + tolak + ' ditolak.' : ''));
      W.hasil = null; W.rows = []; W.step = 1; $('#dt-wizard').innerHTML = '<section class="card" style="margin-top:20px"><div class="alert ok">' + ic('checkc') + '<div><b>Impor selesai.</b> ' + tambah + ' data baru ditambahkan dan ' + ubah + ' diperbarui.' + (tolak ? ' ' + tolak + ' baris ditolak.' : '') + '<br>Langkah berikutnya: buat akun login agar mereka bisa masuk.</div></div><div class="row" style="margin-top:12px"><button class="btn btn-p" data-act="dt.akunSemua">' + ic('key') + 'Buat Akun untuk Semua yang Belum Punya</button><button class="btn btn-o" data-act="wz.tutup">Selesai</button></div></section>'; muatDT();
    } catch (er) { prog.tutup(); UI.err(er); W.step = 2; paintWizard(); }
  };
})();
