/* Halaman: Catatan Saya (siswa) · Catatan Pelanggaran (guru/BK & admin) */
(function () {
  const { $, $$, esc, ic } = UI, A = App.Actions;

  /* ======================= CATATAN SAYA (SISWA) ======================= */
  const CS = { d: null };
  function kartuAktif(c, batas) {
    const menunggu = c.status === 'Menunggu Kesepakatan';
    return '<article class="card" id="cs-' + esc(c.id) + '"><div class="row" style="justify-content:space-between;margin-bottom:10px"><span class="eyebrow" style="margin:0;color:' + (menunggu ? 'var(--warn)' : 'var(--bad)') + '"><i style="width:9px;height:9px;border-radius:50%;background:' + (menunggu ? '#F59E0B' : '#EF4444') + ';display:inline-block"></i>' + (menunggu ? 'Catatan aktif memerlukan respon' : 'Keberatan sedang ditinjau guru') + '</span>' + UI.statusPill(c.status) + '</div>'
      + '<h2 style="font-size:21px">Pencatatan Kejadian: ' + esc(c.pasalJudul) + '</h2><p class="muted" style="margin-top:4px">ID Catatan: #' + esc(c.id) + ' • Kategori: ' + esc(c.pasalKategori) + ' • Tingkat: ' + esc(c.tingkat) + '</p>'
      + '<div class="kv"><div><small>Tanggal &amp; Waktu Kejadian</small><b>' + ic('clock') + esc(UI.tglJam(c.tanggal)) + '</b></div><div><small>Pasal Terkait</small><b>' + ic('book') + '<a href="#tata-tertib/' + esc(c.pasalNomor) + '">Pasal ' + esc(c.pasalNomor) + ' (' + esc(c.pasalJudul) + ')</a></b></div><div><small>Guru Pelapor / Pencatat</small><b>' + ic('user') + esc(c.pencatat || '-') + '</b></div><div><small>Lokasi</small><b>' + ic('pin') + esc(c.lokasi || '-') + '</b></div></div>'
      + '<div class="sect-t">Uraian Kejadian yang Divalidasi</div><div class="quote">' + esc(c.keterangan) + '</div>'
      + '<div class="card flat" style="background:var(--primary-soft);border-color:#DBE7FF;margin-top:14px"><b style="color:var(--text);display:flex;gap:8px;align-items:center">' + ic('checkc') + 'Konsekuensi Pembinaan Edukatif yang Ditugaskan</b><p style="margin-top:8px;line-height:22px">' + esc(c.konsekuensi) + '</p><p style="margin-top:8px;color:var(--primary);font-size:12px;display:flex;gap:6px">' + ic('info') + 'Konsekuensi bernilai edukatif dan bertujuan mengembalikan disiplin serta rasa kepedulian lingkungan.</p></div>'
      + (c.mediasi ? '<div class="sect-t">Riwayat mediasi</div><div class="mediasi-log">' + esc(c.mediasi) + '</div>' : '')
      + (menunggu ? '<div class="act-bar"><button class="btn btn-d" data-act="cs.keberatan" data-id="' + esc(c.id) + '">' + ic('alert') + 'Ajukan Keberatan</button><button class="btn btn-p" style="flex:1;max-width:360px" data-act="cs.setuju" data-id="' + esc(c.id) + '">' + ic('checkc') + 'Setujui Catatan &amp; Konsekuensi</button></div>'
        : '<div class="alert bad" style="margin-top:14px">' + ic('alertc') + '<div><b>Keberatan kamu:</b> ' + esc(c.alasanKeberatan) + '<br><span style="opacity:.85">Guru akan membahasnya bersamamu. Kamu akan diminta konfirmasi ulang setelah mediasi.</span></div></div>');
  }
  App.register('catatan-saya', { judul: 'Catatan Saya', roles: ['siswa'], render: async function (view, ctx) {
    const d = await API.call('catatan.saya'); if (!ctx.alive()) return; CS.d = d;
    const aktif = d.rows.filter(function (c) { return c.status !== 'Disepakati'; }), arsip = d.rows.filter(function (c) { return c.status === 'Disepakati'; }), b = App.boot(), r = d.ringkasan;
    let h = '<div class="stack"><section class="card"><div class="row" style="align-items:flex-start;gap:20px"><div class="t" style="flex:1;min-width:260px"><div class="eyebrow">' + ic('shieldc') + 'Portal kedisiplinan siswa <span class="muted" style="text-transform:none;letter-spacing:0;font-weight:500">• Tahun Ajaran ' + esc(b.app.tahunAjaran || '') + '</span></div><h1>Catatan Kedisiplinan Saya</h1><p class="muted" style="margin-top:6px;max-width:520px">Riwayat pelanggaran, status verifikasi, dan penyelesaian kesepakatan bersama Guru BK secara transparan dan akuntabel.</p></div>'
      + '<div class="sum-chips"><div class="sum"><small>' + ic('clipboard') + 'Total</small><b>' + r.total + ' Catatan</b></div><div class="sum warn"><small>' + ic('hourglass') + 'Verifikasi</small><b>' + r.menunggu + ' Menunggu</b></div><div class="sum ok"><small>' + ic('checkc') + 'Tuntas</small><b>' + r.disepakati + ' Disepakati</b></div><div class="sum gray"><small>' + ic('gavel') + 'Sengketa</small><b>' + r.keberatan + ' Keberatan</b></div></div></div></section>';
    if (r.menunggu) h += '<div class="alert warn" style="align-items:center;flex-wrap:wrap"><span class="tile amber" style="background:#B45309;color:#fff;border-radius:50%">' + ic('alertc') + '</span><div class="grow" style="min-width:240px"><b style="font-size:16px">Terdapat ' + r.menunggu + ' catatan baru yang membutuhkan konfirmasi Anda</b> <span class="pill gray" style="background:#fff">Imbauan: ' + d.batasJam + ' jam</span><br>Harap membaca rincian kejadian dan konsekuensi di bawah ini. Anda dapat menyetujui secara langsung atau mengajukan keberatan dengan alasan yang valid.</div><a class="btn" style="background:#B45309;color:#fff" href="#cs-' + esc(aktif[0].id) + '" data-act="cs.tinjau">Tinjau Kejadian ' + ic('chevd') + '</a></div>';
    h += '<section class="grid g-main"><div class="stack">' + (aktif.length ? aktif.map(function (c) { return kartuAktif(c, d.batasJam); }).join('') : '<div class="card">' + UI.kosong('smile', 'Tidak ada catatan yang perlu direspons. Pertahankan kedisiplinanmu!') + '</div>') + '</div>'
      + '<aside class="stack"><div class="card"><h3 style="display:flex;gap:8px;align-items:center">' + ic('scale') + 'Prinsip Kesepakatan Terbuka</h3><p style="margin-top:10px;line-height:22px" class="muted">' + esc(b.app.nama) + ' mengedepankan pembinaan karakter, bukan sekadar pemberian sanksi. Siswa memiliki hak penuh untuk mengonfirmasi kebenaran fakta atau menyampaikan argumen sanggahan secara sopan.</p><div class="card flat" style="background:var(--primary-soft);border-color:#DBE7FF;margin-top:12px"><b style="color:var(--text);display:flex;gap:8px;align-items:center">' + ic('shieldc') + 'Jaminan Kerahasiaan</b><p style="margin-top:6px" class="muted">Data pembinaan ini hanya dapat diakses oleh Anda, orang tua/wali, Guru BK, dan wali kelas.</p></div></div>'
      + '<div class="card"><h3>Kontak Konseling Mandiri</h3><div class="row" style="margin-top:12px;flex-wrap:nowrap"><span class="avatar" style="width:50px;height:50px">' + esc(UI.inisial(d.bk.nama || 'BK')) + '</span><div><b style="color:var(--text)">' + esc(d.bk.nama || 'Guru BK') + '</b><div class="muted">' + esc(d.bk.jabatan || '') + '</div>' + (d.bk.lokasi ? '<div style="color:var(--primary);font-weight:600">' + esc(d.bk.lokasi) + '</div>' : '') + '</div></div><a class="btn btn-ob" style="width:100%;margin-top:14px" href="#profil">' + ic('message') + 'Hubungi Guru BK</a></div>'
      + '<div class="card"><div class="row" style="justify-content:space-between"><b style="color:var(--text)">Tingkat Kedisiplinan Bulan Ini</b><b style="color:#15803D;font-size:20px">' + d.skor.skor + '%</b></div><div class="prog" style="margin:10px 0"><i style="width:' + d.skor.skor + '%"></i></div><p class="muted">Skor kedisiplinan terjaga dalam rentang predikat ' + esc(d.skor.predikat) + ' (' + esc(d.skor.huruf) + '). ' + esc(d.semester) + '.</p></div></aside></section>';
    h += '<section class="card"><div class="card-h"><h3>Riwayat Arsip Kedisiplinan</h3><button class="btn btn-o btn-sm right" data-act="cs.unduh">' + ic('download') + 'Unduh Riwayat</button></div>'
      + (arsip.length ? '<div class="tbl-wrap"><table class="t rt"><thead><tr><th>Tanggal</th><th>Pasal &amp; Pelanggaran</th><th>Konsekuensi Dijalani</th><th>Status</th></tr></thead><tbody>' + arsip.map(function (c) { return '<tr><td data-l="Tanggal" class="nowrap"><b>' + UI.tgl(c.tanggal) + '</b><span class="sub">' + esc(UI.jam(c.tanggal)) + '</span></td><td data-l="Pasal"><a href="#tata-tertib/' + esc(c.pasalNomor) + '"><b>Pasal ' + esc(c.pasalNomor) + ' (' + esc(c.pasalJudul) + ')</b></a><span class="sub">' + esc(c.keterangan.slice(0, 80)) + (c.keterangan.length > 80 ? '…' : '') + '</span></td><td data-l="Konsekuensi">' + esc(c.konsekuensi) + '</td><td data-l="Status">' + UI.statusPill(c.status) + '</td></tr>'; }).join('') + '</tbody></table></div>' : UI.kosong('folder', 'Belum ada riwayat catatan yang disepakati.'))
      + '<div class="alert" style="margin-top:14px">' + ic('lock') + '<div>Seluruh arsip data tata tertib bersifat rahasia dan terlindungi dalam sistem rekam edukasi terpadu ' + esc(b.app.sekolah) + '.</div></div></section></div>';
    view.innerHTML = h;
  } });
  A['cs.tinjau'] = function (el) { const t = $(el.getAttribute('href')); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  A['cs.setuju'] = async function (el) {
    if (!(await UI.konfirmasi({ judul: 'Setujui catatan?', pesan: 'Dengan menyetujui, kamu mengonfirmasi bahwa uraian kejadian dan konsekuensi pembinaan ini sudah benar dan kamu bersedia menjalaninya.', ok: 'Ya, saya setuju' }))) return;
    el.disabled = true;
    try { await API.call('catatan.setujui', { id: el.getAttribute('data-id') }); UI.ok('Terima kasih, catatan sudah kamu setujui.'); App.invalidasi(); App.dash(true).catch(function () {}); App.route(); } catch (e) { UI.err(e); el.disabled = false; }
  };
  A['cs.keberatan'] = function (el) {
    const id = el.getAttribute('data-id');
    UI.modal({ judul: 'Ajukan Keberatan', isi: '<p class="muted" style="margin-bottom:12px">Sampaikan alasanmu dengan sopan dan jelas. Guru akan membahasnya bersamamu sebelum catatan dinyatakan disepakati.</p><div class="field"><label>Alasan keberatan</label><textarea class="in" id="kb-alasan" rows="5" maxlength="1000" placeholder="Contoh: Saya sudah melapor ke pos piket sebelum bel masuk…"></textarea><span class="hint" id="kb-n">Minimal 10 karakter.</span></div>',
      onBuka: function (m) { const t = $('#kb-alasan', m), n = $('#kb-n', m); t.addEventListener('input', function () { n.textContent = t.value.trim().length + ' / 1000 karakter (minimal 10)'; }); },
      tombol: [{ label: 'Batal', aksi: function () { return true; } }, { label: 'Kirim Keberatan', kelas: 'btn-dd', aksi: async function (c) {
        const alasan = $('#kb-alasan', c.el).value.trim(); if (alasan.length < 10) { UI.toast('Tulis alasan minimal 10 karakter.', 'warn'); return false; }
        await API.call('catatan.keberatan', { id: id, alasan: alasan }); UI.ok('Keberatanmu sudah dikirim ke guru.'); App.invalidasi(); App.dash(true).catch(function () {}); App.route();
      } }] });
  };
  A['cs.unduh'] = function () {
    if (!CS.d) return; const b = App.boot().app, me = App.S.me;
    UI.cetak('Riwayat Kedisiplinan', '<h1>Riwayat Kedisiplinan — ' + UI.esc(me.nama) + '</h1><p class="m">' + UI.esc(b.sekolah) + ' · Kelas ' + UI.esc(me.kelas || '') + '</p><table><tr><th>Tanggal</th><th>Pasal</th><th>Uraian</th><th>Konsekuensi</th><th>Status</th></tr>' + CS.d.rows.map(function (c) { return '<tr><td>' + UI.tgl(c.tanggal) + '</td><td>Pasal ' + UI.esc(c.pasalNomor) + ' ' + UI.esc(c.pasalJudul) + '</td><td>' + UI.esc(c.keterangan) + '</td><td>' + UI.esc(c.konsekuensi) + '</td><td>' + UI.esc(c.status) + '</td></tr>'; }).join('') + '</table>');
  };

  /* ======================= CATATAN PELANGGARAN (STAF) ======================= */
  const CP = { f: { cari: '', kelas: '', kategori: '', status: '', halaman: 1, per: 20 }, d: null, sel: {}, ctx: null };
  App.register('catatan', { judul: 'Catatan Pelanggaran', roles: ['guru', 'admin'], render: async function (view, ctx) {
    CP.ctx = ctx; CP.sel = {}; const boot = App.boot();
    view.innerHTML = '<div class="stack"><section class="card"><div class="row" style="align-items:flex-start;gap:16px"><div style="flex:1;min-width:260px"><div class="eyebrow">' + ic('shieldc') + 'Portal resmi Guru BK &amp; Kesiswaan</div><h1>Manajemen Catatan Pelanggaran &amp; Konseling Siswa</h1><p class="muted" style="margin-top:6px">Pencatatan restoratif yang adil, transparan, dan terintegrasi dengan persetujuan orang tua serta murid.</p></div><div class="stack" style="gap:10px;align-items:stretch"><a class="btn btn-ob" href="#data">' + ic('upload') + 'Unggah Data Excel (Murid / Guru)</a><button class="btn btn-p" data-act="cp.baru">' + ic('plus') + 'Catat Pelanggaran Baru</button></div></div></section>'
      + '<section class="grid" style="grid-template-columns:repeat(4,minmax(0,1fr));gap:14px" id="cp-kpi"></section>'
      + '<section class="card"><div class="filters"><div class="grow search" style="max-width:none"><input class="in" id="cp-q" style="padding-left:42px" type="search" placeholder="Cari nama murid, NISN, atau guru pencatat…" value="' + esc(CP.f.cari) + '">' + ic('search') + '</div>'
      + '<select class="in" id="cp-kelas"><option value="">Semua Kelas</option>' + boot.kelas.map(function (k) { return '<option ' + (CP.f.kelas === k ? 'selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select>'
      + '<select class="in" id="cp-kat"><option value="">Semua Kategori Tata Tertib</option>' + boot.kategori.map(function (k) { return '<option ' + (CP.f.kategori === k ? 'selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select>'
      + '<select class="in" id="cp-st"><option value="">Semua Status</option>' + ['Menunggu Kesepakatan', 'Disepakati', 'Keberatan'].map(function (k) { return '<option ' + (CP.f.status === k ? 'selected' : '') + '>' + k + '</option>'; }).join('') + '</select><button class="btn btn-g btn-sm" data-act="cp.reset">' + ic('refresh') + 'Reset</button></div></section>'
      + '<div class="alert">' + ic('shieldc') + '<div><b>Jaminan perlindungan data pelajar:</b> setiap penghapusan data bersifat <b>soft delete</b> dan tidak langsung dimusnahkan. Data dapat dipulihkan oleh admin lewat menu Data Terhapus. Audit trail aktif.</div></div>'
      + '<section class="card"><div class="card-h"><h3>Daftar Rekam Kasus Siswa</h3><span class="pill gray" id="cp-n"></span><div class="right row"><span class="muted">Tindakan kolektif:</span><button class="btn btn-o btn-sm" data-act="cp.cetak">' + ic('print') + 'Cetak Rekap (PDF)</button><button class="btn btn-d btn-sm" data-act="cp.hapusTerpilih">' + ic('trash') + 'Hapus Terpilih</button></div></div><div id="cp-tabel">' + UI.skeleton(3) + '</div></section></div>';
    const q = $('#cp-q'); q.addEventListener('input', UI.debounce(function () { CP.f.cari = q.value; CP.f.halaman = 1; muatCP(); }, 350));
    [['cp-kelas', 'kelas'], ['cp-kat', 'kategori'], ['cp-st', 'status']].forEach(function (x) { $('#' + x[0]).addEventListener('change', function (e) { CP.f[x[1]] = e.target.value; CP.f.halaman = 1; muatCP(); }); });
    await muatCP(); if (!ctx.alive()) return;
    if (App.S.preselectPasal || App.S.bukaFormCatatan) { const p = App.S.preselectPasal; App.S.preselectPasal = null; App.S.bukaFormCatatan = false; formCatatan(null, p); }
  } });
  async function muatCP() {
    try {
      const d = await API.call('catatan.list', CP.f); CP.d = d; if (!CP.ctx.alive()) return; const r = d.ringkasan;
      $('#cp-kpi').innerHTML = [['blue', 'clipboard', r.total, 'Total Catatan ' + r.semester.replace('Semester ', 'Semester ').split(' ').slice(0, 2).join(' ')], ['green', 'checkc', r.disepakati, 'Tuntas & Disepakati'], ['amber', 'hourglass', r.menunggu, 'Menunggu Konfirmasi'], ['rose', 'gavel', r.keberatan, 'Perlu Sidang Keberatan']].map(function (x) { return '<div class="card" style="display:flex;gap:12px;align-items:center;padding:14px 16px"><span class="tile ' + x[0] + '">' + ic(x[1]) + '</span><div><b style="font-size:22px;color:var(--text);display:block;line-height:26px">' + x[2] + '</b><span class="muted" style="font-size:12px">' + esc(x[3]) + '</span></div></div>'; }).join('');
      $('#cp-n').textContent = d.total + ' catatan';
      $('#cp-tabel').innerHTML = d.rows.length ? '<div class="tbl-wrap"><table class="t rt"><thead><tr><th style="width:36px"><input type="checkbox" id="cp-all" aria-label="Pilih semua"></th><th>NISN</th><th>Nama murid</th><th>Kelas</th><th>Pasal &amp; Kategori</th><th>Tanggal</th><th>Konsekuensi / Restorasi</th><th>Status</th><th>Aksi</th></tr></thead><tbody>'
        + d.rows.map(function (c) {
          return '<tr class="' + (c.status === 'Keberatan' ? 'row-bad' : '') + '"><td data-l="Pilih"><input type="checkbox" data-sel="' + esc(c.id) + '" ' + (CP.sel[c.id] ? 'checked' : '') + ' aria-label="Pilih catatan"></td><td data-l="NISN" class="mono">' + esc(c.nisn) + '</td><td data-l="Nama"><b>' + esc(c.nama) + '</b>' + (c.status === 'Keberatan' ? ' <span class="pill bad">Perlu sidang</span>' : '') + '<span class="sub">Wali: ' + esc(c.wali || '-') + ' (' + esc(c.kontakWali || '-') + ')</span></td><td data-l="Kelas"><span class="pill gray">' + esc(c.kelas) + '</span></td>'
            + '<td data-l="Pasal"><a href="#tata-tertib/' + esc(c.pasalNomor) + '"><b>Pasal ' + esc(c.pasalNomor) + '</b></a><span class="sub">' + esc(c.pasalJudul) + '</span></td><td data-l="Tanggal" class="nowrap">' + UI.tgl(c.tanggal) + '<span class="sub">' + esc(UI.jam(c.tanggal)) + '</span></td><td data-l="Konsekuensi" style="max-width:190px">' + esc(c.konsekuensi) + '</td><td data-l="Status">' + UI.statusPill(c.status) + '</td>'
            + '<td class="acts nolabel"><button class="btn-ic" data-act="cp.lihat" data-id="' + esc(c.id) + '" aria-label="Lihat detail">' + ic(c.status === 'Keberatan' ? 'message' : 'eye') + '</button>' + (c.status === 'Menunggu Kesepakatan' ? '<button class="btn-ic" data-act="cp.edit" data-id="' + esc(c.id) + '" aria-label="Ubah">' + ic('pencil') + '</button>' : '') + '<button class="btn-ic del" data-act="cp.hapus" data-id="' + esc(c.id) + '" aria-label="Hapus">' + ic('trash') + '</button></td></tr>';
        }).join('') + '</tbody></table></div>' + UI.pager(d.total, d.halaman, d.per, 'cp') : UI.kosong('clipboard', 'Belum ada catatan yang cocok dengan filter.');
      const all = $('#cp-all'); if (all) all.addEventListener('change', function () { $$('[data-sel]').forEach(function (c) { c.checked = all.checked; CP.sel[c.getAttribute('data-sel')] = all.checked; }); });
    } catch (e) { if (CP.ctx.alive()) $('#cp-tabel').innerHTML = App.errorBox(e); }
  }
  document.addEventListener('change', function (e) { const s = e.target.getAttribute && e.target.getAttribute('data-sel'); if (s) CP.sel[s] = e.target.checked; });
  App.Pagers.cp = function (n) { CP.f.halaman = n; muatCP(); };
  A['cp.reset'] = function () { CP.f = { cari: '', kelas: '', kategori: '', status: '', halaman: 1, per: 20 }; App.route(); };
  const cari = function (id) { return (CP.d ? CP.d.rows : []).filter(function (c) { return c.id === id; })[0]; };

  A['cp.lihat'] = function (el) {
    const c = cari(el.getAttribute('data-id')); if (!c) return;
    const kb = c.status === 'Keberatan';
    UI.modal({ judul: 'Detail Catatan #' + c.id, ukuran: 'lg', isi: '<div class="row" style="justify-content:space-between">' + UI.statusPill(c.status) + UI.tingkatPill(c.tingkat) + '</div><h2 style="margin:10px 0 4px">' + esc(c.nama) + ' <span class="muted" style="font-size:14px;font-weight:500">· ' + esc(c.kelas) + ' · NISN ' + esc(c.nisn) + '</span></h2>'
      + '<div class="kv"><div><small>Tanggal &amp; waktu</small><b>' + ic('clock') + esc(UI.tglJam(c.tanggal)) + '</b></div><div><small>Pasal</small><b>' + ic('book') + 'Pasal ' + esc(c.pasalNomor) + ' — ' + esc(c.pasalJudul) + '</b></div><div><small>Dicatat oleh</small><b>' + ic('user') + esc(c.pencatat || '-') + '</b></div><div><small>Lokasi</small><b>' + ic('pin') + esc(c.lokasi || '-') + '</b></div></div>'
      + '<div class="sect-t">Uraian kejadian</div><div class="quote">' + esc(c.keterangan) + '</div><div class="sect-t">Konsekuensi pembinaan</div><div class="quote">' + esc(c.konsekuensi) + '</div>'
      + (kb ? '<div class="alert bad" style="margin-top:14px">' + ic('alertc') + '<div><b>Keberatan siswa:</b> ' + esc(c.alasanKeberatan) + '</div></div>' : '') + (c.mediasi ? '<div class="sect-t">Riwayat mediasi</div><div class="mediasi-log">' + esc(c.mediasi) + '</div>' : '')
      + '<div class="sect-t">Jejak kesepakatan</div><p class="muted">Guru: ' + (c.setujuGuruAt ? UI.tglJam(c.setujuGuruAt) : '—') + ' · Siswa: ' + (c.setujuSiswaAt ? UI.tglJam(c.setujuSiswaAt) : 'belum menyetujui') + '</p>',
      tombol: kb ? [{ label: 'Tutup', aksi: function () { return true; } }, { label: ic('gavel') + 'Mediasi', kelas: 'btn-p', tutup: false, aksi: function (ctl) { ctl.tutup(); mediasi(c); return false; } }] : [{ label: 'Tutup', aksi: function () { return true; } }] });
  };
  function mediasi(c) {
    UI.modal({ judul: 'Mediasi Keberatan — ' + c.nama, isi: '<div class="alert bad" style="margin-bottom:14px">' + ic('alertc') + '<div><b>Keberatan siswa:</b> ' + esc(c.alasanKeberatan) + '</div></div>'
      + '<div class="field"><label>Hasil pembahasan bersama</label><div class="stack" style="gap:8px"><label class="check"><input type="radio" name="aksi" value="revisi" checked>Revisi konsekuensi — siswa diminta menyetujui ulang</label><label class="check"><input type="radio" name="aksi" value="sepakat">Disepakati bersama setelah mediasi tatap muka</label></div></div>'
      + '<div class="field" id="md-kons"><label>Konsekuensi yang direvisi</label><textarea class="in" name="konsekuensi" rows="3">' + esc(c.konsekuensi) + '</textarea></div><div class="field"><label>Ringkasan hasil mediasi</label><textarea class="in" name="catatan" rows="3" placeholder="Apa yang dibahas dan disepakati bersama siswa…"></textarea></div>',
      onBuka: function (m) { $$('[name=aksi]', m).forEach(function (r) { r.addEventListener('change', function () { $('#md-kons', m).classList.toggle('hide', UI.form(m).aksi === 'sepakat'); }); }); },
      tombol: [{ label: 'Batal', aksi: function () { return true; } }, { label: 'Simpan Hasil Mediasi', kelas: 'btn-p', aksi: async function (ctl) { const f = UI.form(ctl.el); await API.call('catatan.mediasi', { id: c.id, aksi: f.aksi, konsekuensi: f.konsekuensi, catatan: f.catatan }); UI.ok('Hasil mediasi tersimpan.'); App.invalidasi(); App.dash(true).catch(function () {}); muatCP(); } }] });
  }

  /* ---- formulir catat / ubah ---- */
  async function formCatatan(c, pasalAwal) {
    let pasal; try { pasal = API.cached('pub.pasal') || await API.pubFetch('pub.pasal'); } catch (e) { return UI.err(e); }
    const kat = App.boot().kategori, grup = {}; pasal.forEach(function (p) { (grup[p.kategori] = grup[p.kategori] || []).push(p); });
    const awal = c ? { tgl: String(c.tanggal).slice(0, 10), jam: (String(c.tanggal).match(/T(\d{2}:\d{2})/) || [])[1] || '07:00' } : { tgl: UI.hariIni(), jam: '07:00' };
    let murid = c ? { id: c.muridId, nama: c.nama, kelas: c.kelas } : null;
    UI.modal({ judul: c ? 'Ubah Catatan' : 'Catat Pelanggaran Baru', ukuran: 'lg',
      isi: '<form id="fc"><div class="field dd"><label>Murid</label><input class="in" id="fc-m" autocomplete="off" placeholder="Ketik nama atau NISN murid…" ' + (c ? 'disabled' : '') + ' value="' + (c ? esc(c.nama + ' (' + c.kelas + ')') : '') + '"><div class="dd-list hide" id="fc-dd"></div><span class="hint" id="fc-mh">' + (c ? 'Murid tidak dapat diganti.' : 'Pilih dari daftar yang muncul.') + '</span></div>'
        + '<div class="field"><label>Pasal yang dilanggar</label><select class="in" name="pasalId" id="fc-p"><option value="">— pilih pasal —</option>' + Object.keys(grup).map(function (k) { return '<optgroup label="' + esc(k) + '">' + grup[k].map(function (p) { return '<option value="' + esc(p.id) + '" ' + ((c && c.pasalId === p.id) || pasalAwal === p.id ? 'selected' : '') + '>Pasal ' + esc(p.nomor) + ' — ' + esc(p.judul) + '</option>'; }).join('') + '</optgroup>'; }).join('') + '</select></div>'
        + '<div class="form-g"><div class="field"><label>Tanggal kejadian</label><input class="in" type="date" name="tanggal" max="' + UI.hariIni() + '" value="' + awal.tgl + '"></div><div class="field"><label>Jam kejadian</label><input class="in" type="time" name="jam" value="' + awal.jam + '"></div><div class="field"><label>Lokasi</label><input class="in" name="lokasi" maxlength="120" value="' + esc(c ? c.lokasi : '') + '" placeholder="Gerbang depan"></div><div class="field"><label>Tingkat</label><select class="in" name="tingkat" id="fc-t">' + ['Ringan', 'Sedang', 'Berat'].map(function (t) { return '<option ' + (c && c.tingkat === t ? 'selected' : '') + '>' + t + '</option>'; }).join('') + '</select></div></div>'
        + '<div class="field"><label>Uraian kejadian</label><textarea class="in" name="keterangan" rows="3" maxlength="2000" placeholder="Uraikan kejadian secara objektif…">' + esc(c ? c.keterangan : '') + '</textarea></div>'
        + '<div class="field"><label>Konsekuensi pembinaan edukatif</label><textarea class="in" name="konsekuensi" id="fc-k" rows="3" maxlength="1000" placeholder="Disepakati bersama siswa…">' + esc(c ? c.konsekuensi : '') + '</textarea><div class="chips" id="fc-saran" style="margin-top:6px"></div></div>'
        + '<div class="alert">' + ic('info') + '<div>Setelah disimpan, catatan berstatus <b>Menunggu Kesepakatan</b> sampai siswa menyetujuinya atau mengajukan keberatan.</div></div></form>',
      onBuka: function (m) {
        const inp = $('#fc-m', m), dd = $('#fc-dd', m), sp = $('#fc-p', m);
        const saran = function () { const p = pasal.filter(function (x) { return x.id === sp.value; })[0]; $('#fc-saran', m).innerHTML = p ? (p.sanksi || []).map(function (t, i) { return '<button type="button" class="chip" data-s="' + i + '">Saran: ' + esc(t.judul) + '</button>'; }).join('') : ''; return p; };
        sp.addEventListener('change', function () { const p = saran(); if (p && !c) $('#fc-t', m).value = p.tingkat; });
        $('#fc-saran', m).addEventListener('click', function (e) { const b = e.target.closest('[data-s]'); if (!b) return; const p = pasal.filter(function (x) { return x.id === sp.value; })[0], t = p.sanksi[Number(b.getAttribute('data-s'))]; $('#fc-k', m).value = t.judul + (t.uraian ? ' — ' + t.uraian : ''); });
        saran();
        if (!c) inp.addEventListener('input', UI.debounce(async function () {
          murid = null; const v = inp.value.trim(); if (v.length < 2) { dd.classList.add('hide'); return; }
          try { const r = await API.call('murid.list', { cari: v, per: 8 }); dd.innerHTML = r.rows.length ? r.rows.map(function (x) { return '<button type="button" data-id="' + esc(x.id) + '" data-n="' + esc(x.nama) + '" data-k="' + esc(x.kelas) + '">' + esc(x.nama) + '<small>' + esc(x.kelas) + ' · NISN ' + esc(x.nisn) + '</small></button>'; }).join('') : '<div style="padding:12px" class="muted">Murid tidak ditemukan di kelas yang Anda tangani.</div>'; dd.classList.remove('hide'); } catch (e) { UI.err(e); }
        }, 250));
        dd.addEventListener('click', function (e) { const b = e.target.closest('[data-id]'); if (!b) return; murid = { id: b.getAttribute('data-id'), nama: b.getAttribute('data-n'), kelas: b.getAttribute('data-k') }; inp.value = murid.nama + ' (' + murid.kelas + ')'; dd.classList.add('hide'); $('#fc-mh', m).textContent = '✓ Murid dipilih'; });
      },
      tombol: [{ label: 'Batal', aksi: function () { return true; } }, { label: c ? 'Simpan Perubahan' : 'Simpan Catatan', kelas: 'btn-p', aksi: async function (ctl) {
        if (!murid) { UI.toast('Pilih murid dari daftar yang muncul.', 'warn'); return false; }
        const f = UI.form(ctl.el); const r = await API.call('catatan.simpan', { id: c ? c.id : undefined, muridId: murid.id, pasalId: f.pasalId, tanggal: f.tanggal, jam: f.jam, lokasi: f.lokasi, tingkat: f.tingkat, keterangan: f.keterangan, konsekuensi: f.konsekuensi });
        UI.ok(c ? 'Catatan diperbarui.' : 'Catatan tersimpan, menunggu persetujuan siswa.'); App.invalidasi(); App.dash(true).catch(function () {}); muatCP();
      } }] });
  }
  A['cp.baru'] = function () { formCatatan(); };
  A['cp.edit'] = function (el) { const c = cari(el.getAttribute('data-id')); if (c) formCatatan(c); };
  A['cp.hapus'] = async function (el) {
    if (!(await UI.konfirmasiHapus(1, 'catatan'))) return;
    try { await API.call('catatan.hapus', { ids: [el.getAttribute('data-id')] }); UI.ok('Catatan dipindahkan ke Data Terhapus.'); App.invalidasi(); App.dash(true).catch(function () {}); muatCP(); } catch (e) { UI.err(e); }
  };
  A['cp.hapusTerpilih'] = async function () {
    const ids = Object.keys(CP.sel).filter(function (k) { return CP.sel[k]; }); if (!ids.length) return UI.toast('Centang catatan yang akan dihapus.', 'warn');
    if (!(await UI.konfirmasiHapus(ids.length, 'catatan'))) return;
    try { await API.call('catatan.hapus', { ids: ids }); CP.sel = {}; UI.ok(ids.length + ' catatan dipindahkan ke Data Terhapus.'); App.invalidasi(); App.dash(true).catch(function () {}); muatCP(); } catch (e) { UI.err(e); }
  };
  A['cp.cetak'] = function () {
    if (!CP.d || !CP.d.rows.length) return UI.toast('Tidak ada data untuk dicetak.', 'warn'); const b = App.boot().app;
    UI.cetak('Rekap Catatan Pelanggaran', '<h1>Rekap Catatan Pelanggaran — ' + UI.esc(b.sekolah) + '</h1><p class="m">Dicetak ' + UI.tgl(UI.hariIni(), true) + ' oleh ' + UI.esc(App.S.me.nama) + ' · Dokumen rahasia</p><table><tr><th>NISN</th><th>Nama</th><th>Kelas</th><th>Pasal</th><th>Tanggal</th><th>Konsekuensi</th><th>Status</th></tr>' + CP.d.rows.map(function (c) { return '<tr><td>' + UI.esc(c.nisn) + '</td><td>' + UI.esc(c.nama) + '</td><td>' + UI.esc(c.kelas) + '</td><td>Pasal ' + UI.esc(c.pasalNomor) + '</td><td>' + UI.tgl(c.tanggal) + '</td><td>' + UI.esc(c.konsekuensi) + '</td><td>' + UI.esc(c.status) + '</td></tr>'; }).join('') + '</table>');
  };
})();
