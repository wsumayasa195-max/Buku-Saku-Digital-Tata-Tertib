/* Halaman: Beranda · Tata Tertib · Pengumuman · Kalender · Unduhan */
(function () {
  const { $, $$, esc, ic } = UI, A = App.Actions;
  const SEMUA = ['guest', 'siswa', 'guru', 'admin'];

  /* ---------- kalender (dipakai Beranda & halaman Kalender) ---------- */
  const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const Kal = {
    mount: function (el, events, opsi) {
      opsi = opsi || {}; const now = new Date(); const st = { y: now.getFullYear(), m: now.getMonth(), sel: opsi.sel || '' };
      const pad = function (n) { return ('0' + n).slice(-2); };
      const draw = function () {
        const first = new Date(st.y, st.m, 1), mulai = new Date(st.y, st.m, 1 - first.getDay()), hariIni = UI.hariIni();
        const ev = {}, libur = {};
        (events || []).forEach(function (e) {
          let d = new Date(e.tanggal + 'T00:00:00'); const end = new Date((e.selesai || e.tanggal) + 'T00:00:00'); let n = 0;
          while (d <= end && n++ < 62) { const k = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); (ev[k] = ev[k] || []).push(e); if (e.jenis === 'Libur') libur[k] = 1; d = new Date(d.getTime() + 86400000); }
        });
        let sel = ''; for (let i = 0; i < 42; i++) {
          const d = new Date(mulai.getFullYear(), mulai.getMonth(), mulai.getDate() + i), k = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
          sel += '<button class="c' + (d.getMonth() !== st.m ? ' out' : '') + (d.getDay() === 0 ? ' sun' : '') + (k === hariIni ? ' today' : '') + (libur[k] ? ' libur' : '') + (k === st.sel ? ' sel' : '') + '" data-k="' + k + '" aria-label="' + k + '">' + d.getDate() + (ev[k] ? '<i class="ev"></i>' : '') + '</button>';
        }
        el.innerHTML = '<div class="cal"><div class="cal-h"><b>' + UI.BLN_P[st.m] + ' ' + st.y + '</b><button class="btn-ic" data-n="-1" aria-label="Bulan sebelumnya">' + ic('chevl') + '</button><button class="btn-ic" data-n="1" aria-label="Bulan berikutnya">' + ic('chevr') + '</button></div><div class="cal-g">'
          + HARI.map(function (h, i) { return '<div class="dn' + (i === 0 ? ' red' : '') + '">' + h + '</div>'; }).join('') + sel + '</div><div class="legend"><span><i style="background:var(--primary)"></i>Hari ini / kegiatan</span><span><i style="background:#DC2626"></i>Libur sekolah</span></div></div>';
        if (opsi.onBulan) opsi.onBulan(st.y, st.m);
      };
      el.addEventListener('click', function (e) {
        const n = e.target.closest('[data-n]'); if (n) { st.m += Number(n.getAttribute('data-n')); if (st.m < 0) { st.m = 11; st.y--; } if (st.m > 11) { st.m = 0; st.y++; } draw(); return; }
        const k = e.target.closest('[data-k]'); if (k) { st.sel = k.getAttribute('data-k'); draw(); if (opsi.onPilih) opsi.onPilih(st.sel); }
      });
      draw(); return { ganti: function (ev2) { events = ev2; draw(); }, state: st };
    }
  };
  window.Kal = Kal;

  /* ---------- donat ---------- */
  function donat(persen, warna, tengah, kecil) {
    const R = 54, C = 2 * Math.PI * R; let off = 0, seg = '';
    persen.forEach(function (p, i) { const len = C * p / 100; if (len > 0) seg += '<circle cx="70" cy="70" r="' + R + '" fill="none" stroke="' + warna[i] + '" stroke-width="15" stroke-dasharray="' + len.toFixed(2) + ' ' + (C - len).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 70 70)"/>'; off += len; });
    return '<div class="donut"><svg viewBox="0 0 140 140" width="150" height="150" role="img" aria-label="Diagram ringkasan kedisiplinan"><circle cx="70" cy="70" r="' + R + '" fill="none" stroke="#EEF2F7" stroke-width="15"/>' + seg + '</svg><div class="c"><div><b>' + esc(tengah) + '</b><small>' + esc(kecil) + '</small></div></div></div>';
  }
  const ILUSTRASI = '<svg class="ill" viewBox="0 0 220 150" aria-hidden="true"><circle cx="110" cy="80" r="62" fill="#DBEAFE" opacity=".55"/><rect x="48" y="96" width="112" height="20" rx="4" fill="#2563EB"/><rect x="54" y="100" width="100" height="5" rx="2" fill="#BFDBFE"/><rect x="40" y="74" width="120" height="20" rx="4" fill="#F59E0B"/><rect x="46" y="78" width="108" height="5" rx="2" fill="#FDE68A"/><rect x="56" y="52" width="108" height="20" rx="4" fill="#1E40AF"/><rect x="62" y="56" width="96" height="5" rx="2" fill="#93C5FD"/><path d="M150 52l10-26 7 3-8 26z" fill="#F59E0B"/><path d="M186 100c-2-18 4-30 16-38-2 16-6 28-16 38zM186 100c-8-8-10-18-8-28 10 6 12 16 8 28z" fill="#22C55E"/><rect x="178" y="100" width="18" height="20" rx="3" fill="#CBD5E1"/><path d="M28 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#F59E0B"/></svg>';

  function pengumumanItem(p) {
    return '<div class="ann"><div class="tile blue">' + ic('megaphone') + '</div><div class="grow"><div class="meta"><span class="d">' + UI.tgl(p.tanggal) + '</span>' + (p.penting ? '<span class="pill warn right">Penting</span>' : (p.kategori && p.kategori !== 'Umum' ? '<span class="pill gray right">' + esc(p.kategori) + '</span>' : '')) + '</div><h4>' + esc(p.judul) + '</h4><p>' + esc(p.isi) + '</p></div></div>';
  }

  /* ======================= BERANDA ======================= */
  App.register('beranda', { judul: 'Beranda', roles: SEMUA, render: async function (view, ctx) {
    const me = App.S.me, role = App.peran(), staf = App.isStaf();
    const [pengumuman, kalender, dash] = await Promise.all([
      API.swr('pub.pengumuman', function () {}).catch(function () { return []; }),
      API.swr('pub.kalender', function () {}).catch(function () { return []; }),
      me ? App.dash(true).catch(function () { return null; }) : Promise.resolve(null)
    ]);
    if (!ctx.alive()) return;
    const nama = me ? me.nama : 'Selamat datang';
    const tombol = !me ? '<button class="btn btn-p" data-act="login">' + ic('login') + 'Masuk untuk melihat catatanmu</button><a class="btn btn-o" href="#tata-tertib">' + ic('book') + 'Baca Tata Tertib</a>'
      : role === 'siswa' ? '<a class="btn btn-p" href="#tata-tertib">' + ic('book') + 'Baca Pedoman Umum</a><a class="btn btn-o" href="#catatan-saya">' + ic('user') + 'Catatan Saya</a>'
      : '<a class="btn btn-p" href="#catatan" data-act="catat-baru">' + ic('plus') + 'Catat Pelanggaran</a><a class="btn btn-o" href="#tata-tertib">' + ic('book') + 'Tata Tertib</a>';
    const sub = !me ? 'Akses tata tertib ' + esc(App.boot().app.sekolah) + ' kapan saja dari ponselmu — tanpa perlu membawa buku saku fisik.' : role === 'siswa' ? 'Pantau catatan kedisiplinan dan pahami tata tertib sekolahmu setiap hari untuk membentuk karakter unggul di ' + esc(App.boot().app.sekolah) + '.' : 'Kelola catatan kedisiplinan secara restoratif, transparan, dan terdokumentasi bersama siswa dan orang tua.';
    let h = '<div class="stack"><section class="banner"><div><div class="hello">' + UI.salam() + ' <span aria-hidden="true">👋</span></div><h1>' + esc(nama) + (me ? '!' : '') + '</h1><p>' + sub + '</p><div class="btns">' + tombol + '</div></div>' + ILUSTRASI + '</section>';

    if (dash) {
      const k = dash.kpi, kp = [
        ['blue', 'book', 'Resmi', k.pasal, 'Pasal Tata Tertib', k.kategori + ' Kategori aktif', 'var(--tile-blue)', '#tata-tertib'],
        ['green', 'megaphone', '', k.pengumumanBaru, 'Pengumuman Baru', 'Minggu ini', 'var(--tile-green)', '#pengumuman'],
        ['purple', 'clipboard', 'Aktif', k.catatan, 'Catatan Pelanggaran', dash.semester, '#9333EA', role === 'siswa' ? '#catatan-saya' : '#catatan'],
        ['amber', 'hourglass', '', k.menunggu, role === 'siswa' ? 'Menunggu Disetujui' : 'Menunggu Konfirmasi', k.menunggu ? 'Perlu respons' : 'Semua tuntas', '#B45309', role === 'siswa' ? '#catatan-saya' : '#catatan'],
        ['rose', 'gavel', '', k.keberatan, 'Keberatan Terbuka', k.keberatan ? 'Perlu mediasi' : 'Tidak ada sengketa', '#BE123C', role === 'siswa' ? '#catatan-saya' : '#catatan'],
        ['green', 'checkc', '', k.kepatuhan + '%', role === 'siswa' ? 'Tingkat Kepatuhan' : 'Siswa Tanpa Catatan', k.predikat, '#15803D', '#beranda']
      ];
      h += '<section class="kpis">' + kp.map(function (x) { return '<a class="kpi card click" style="text-decoration:none;display:block" href="' + x[7] + '"><div class="top"><span class="tile ' + x[0] + '">' + ic(x[1]) + '</span>' + (x[2] ? '<span class="pill gray">' + x[2] + '</span>' : '') + '</div><div class="num">' + esc(x[3]) + '</div><div class="lbl">' + x[4] + '</div><div class="cap" style="color:' + x[6] + '">' + esc(x[5]) + '</div></a>'; }).join('') + '</section>';

      const baris = dash.catatanTerbaru.map(function (c) {
        return '<tr><td data-l="Pasal"><b>Pasal ' + esc(c.pasalNomor) + '</b>' + (staf ? ' · ' + esc(c.nama) : '') + '<span class="sub">' + esc(c.pasalJudul) + '</span></td><td data-l="Tingkat">' + UI.tingkatPill(c.tingkat) + '</td><td data-l="Status">' + UI.statusPill(c.status) + '</td><td data-l="Tanggal" class="nowrap">' + UI.tgl(c.tanggal) + '</td></tr>';
      }).join('');
      const bersih = role === 'siswa' && k.menunggu === 0 && k.keberatan === 0;
      h += '<section class="grid g-main"><div class="card"><div class="card-h"><h3>Catatan Pelanggaran Terbaru</h3><a class="link" href="#' + (role === 'siswa' ? 'catatan-saya' : 'catatan') + '">Lihat Semua ' + ic('arrow') + '</a></div>'
        + (baris ? '<div class="tbl-wrap"><table class="t rt"><thead><tr><th>Pasal &amp; Pelanggaran</th><th>Tingkat</th><th>Status</th><th>Tanggal</th></tr></thead><tbody>' + baris + '</tbody></table></div>' : UI.kosong('smile', 'Belum ada catatan pelanggaran semester ini. Pertahankan!'))
        + (bersih && baris ? '<div class="alert ok" style="margin-top:14px">' + ic('smile') + '<div><b>Hebat!</b> Kamu tidak memiliki catatan baru yang membutuhkan konfirmasi atau tindak lanjut Guru BK. Pertahankan kedisiplinanmu!</div></div>' : '')
        + '</div><div class="card"><div class="card-h"><h3>Papan Pengumuman Sekolah</h3><a class="link" href="#pengumuman">Lihat Semua ' + ic('arrow') + '</a></div>' + ((dash.pengumuman || []).length ? dash.pengumuman.map(pengumumanItem).join('') : UI.kosong('megaphone', 'Belum ada pengumuman.')) + '</div></section>';
    } else {
      h += '<section class="grid g-main"><div class="card"><div class="card-h"><h3>Papan Pengumuman Sekolah</h3><a class="link" href="#pengumuman">Lihat Semua ' + ic('arrow') + '</a></div>' + ((pengumuman || []).length ? pengumuman.slice(0, 3).map(pengumumanItem).join('') : UI.kosong('megaphone', 'Belum ada pengumuman.')) + '</div>'
        + '<div class="card"><div class="card-h"><h3>Mengapa Buku Saku Digital?</h3></div><div class="stack" style="gap:12px">' + [['clock', 'Akses instan', 'Buka kapan saja di ponsel, tidak bisa hilang atau rusak.'], ['search', 'Cari cepat', 'Temukan pasal dengan kata kunci: seragam, terlambat, ponsel.'], ['shieldc', 'Transparan', 'Catatan kedisiplinan disepakati bersama siswa dan guru.']].map(function (x) { return '<div class="row" style="flex-wrap:nowrap;align-items:flex-start"><span class="tile blue">' + ic(x[0]) + '</span><div><b style="color:var(--text)">' + x[1] + '</b><p class="muted">' + x[2] + '</p></div></div>'; }).join('') + '</div></div></section>';
    }

    const cepat = [['book', 'Tata Tertib', '#tata-tertib', 'blue'], [role === 'siswa' ? 'user' : 'clipboard', role === 'siswa' ? 'Catatan Saya' : 'Catatan', role === 'siswa' ? '#catatan-saya' : '#catatan', 'green'], ['megaphone', 'Pengumuman', '#pengumuman', 'purple'], ['download', 'Unduh PDF', '#unduhan', 'amber'], ['calendar', 'Kalender', '#kalender', 'rose'], ['message', 'Umpan Balik', me ? '#profil' : '#tata-tertib', 'blue']];
    const warnaBg = { blue: 'var(--tile-blue-bg)', green: 'var(--tile-green-bg)', purple: 'var(--tile-purple-bg)', amber: 'var(--tile-amber-bg)', rose: 'var(--tile-rose-bg)' };
    h += '<section class="grid g-3b"><div class="card"><div class="card-h"><h3>Kalender Sekolah</h3><a class="link" href="#kalender">Lihat</a></div><div id="kal-mini"></div></div>'
      + '<div class="card"><div class="card-h"><h3>Akses Cepat</h3></div><div class="quick">' + cepat.map(function (c) { return '<a href="' + c[2] + '" style="background:' + warnaBg[c[3]] + '"><span class="tile ' + c[3] + '">' + ic(c[0]) + '</span>' + c[1] + '</a>'; }).join('') + '</div><p class="muted" style="text-align:center;margin-top:14px;font-size:12px">Pusat akses layanan kesiswaan &amp; bimbingan konseling</p></div>'
      + '<div class="card"><div class="card-h"><h3>Ringkasan Kedisiplinan</h3></div>';
    if (dash) {
      const p = dash.distribusi.persen, nama4 = ['Tanpa Catatan', 'Pelanggaran Ringan', 'Perlu Perhatian', 'Pembinaan Khusus'], wr = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444'];
      h += '<div class="donut-wrap">' + donat(p, wr, dash.kpi.kepatuhan + '%', role === 'siswa' ? 'SKOR' : 'TANPA CATATAN') + '<div class="lg">' + nama4.map(function (n, i) { return '<div><i style="background:' + wr[i] + '"></i>' + n + '<span>' + p[i] + '%</span></div>'; }).join('') + '</div></div>'
        + '<div class="status-bar">' + ic('award') + (role === 'siswa' ? 'Status sikap siswa: <b>Predikat ' + esc(dash.kpi.predikat) + ' (' + esc(dash.kpi.huruf) + ')</b>' : 'Total siswa: <b>' + dash.distribusi.total + '</b> · ' + esc(dash.semester)) + '</div>';
    } else h += UI.kosong('activity', 'Masuk untuk melihat ringkasan kedisiplinanmu.');
    h += '</div></section></div>';
    view.innerHTML = h;
    Kal.mount($('#kal-mini'), kalender || []);
  } });
  A['catat-baru'] = function () { App.S.bukaFormCatatan = true; location.hash = '#catatan'; };

  /* ======================= TATA TERTIB ======================= */
  function ayatHtml(isi) {
    return String(isi || '').split('\n').filter(function (l) { return l.trim(); }).map(function (l) { const m = l.match(/^\s*\((\d+)\)\s*(.*)$/); return m ? '<p class="ayat"><b>(' + m[1] + ')</b><span>' + esc(m[2]) + '</span></p>' : '<p class="ayat"><span>' + esc(l) + '</span></p>'; }).join('');
  }
  function sanksiHtml(sanksi) {
    if (!sanksi || !sanksi.length) return '<p class="muted">Rincian tahapan sanksi belum ditetapkan.</p>';
    return sanksi.map(function (t, i) { return '<div class="tahap t' + (i + 1) + '"><span class="no">' + t.tahap + '</span><div><b>Pelanggaran Ke-' + t.tahap + ': ' + esc(t.judul) + '</b><span class="muted">' + esc(t.uraian) + '</span></div></div>'; }).join('');
  }
  function detailPasal(p, kat) {
    return '<div class="row" style="justify-content:space-between;margin-bottom:8px"><span class="pill ok">' + ic('check') + 'Berlaku Aktif</span>' + UI.katPill(p.kategori, kat) + '</div><h3 style="font-size:19px;margin-bottom:12px">Pasal ' + esc(p.nomor) + ': ' + esc(p.judul) + '</h3>'
      + '<div class="card flat" style="background:var(--primary-soft);border-color:#DBE7FF"><div class="eyebrow">' + ic('file') + 'Teks Resmi Pasal</div>' + ayatHtml(p.isi) + '</div>'
      + '<div class="row" style="margin:16px 0 10px;justify-content:space-between"><b style="color:var(--text)">Tahapan Pembinaan &amp; Sanksi Edukatif</b>' + UI.tingkatPill(p.tingkat) + '</div>' + sanksiHtml(p.sanksi)
      + '<div class="stack" style="gap:10px;margin-top:14px">' + (App.isStaf() ? '<button class="btn btn-p" data-act="pasal.catat" data-id="' + esc(p.id) + '">' + ic('pencil') + 'Catat Pelanggaran Menggunakan Pasal Ini</button>' : '')
      + '<div class="row"><button class="btn btn-o grow" data-act="pasal.salin" data-no="' + esc(p.nomor) + '">' + ic('link') + 'Salin Tautan</button><button class="btn btn-o grow" data-act="pasal.cetak" data-id="' + esc(p.id) + '">' + ic('print') + 'Petikan PDF</button></div></div>';
  }
  const TT = { data: [], st: { q: '', kat: '', sel: '' }, ctx: null };

  App.register('tata-tertib', { judul: 'Tata Tertib', roles: SEMUA, render: async function (view, ctx) {
    TT.ctx = ctx; TT.st = { q: App.S.query || '', kat: '', sel: ctx.arg || '' }; App.S.query = '';
    const boot = App.boot(), staf = App.isStaf();
    view.innerHTML = '<div class="page-h"><div class="t"><div class="eyebrow">' + ic('shieldc') + 'Tahun Ajaran ' + esc(boot.app.tahunAjaran || '') + (boot.app.sk ? ' · ' + esc(boot.app.sk) : '') + '</div><h1>Daftar Tata Tertib &amp; Pedoman Disiplin</h1><p>Panduan norma, hak, dan kewajiban peserta didik guna mewujudkan iklim belajar yang tertib, harmonis, dan penuh tanggung jawab.</p></div>'
      + '<div class="row" id="tt-stat"></div></div>'
      + '<div class="card" style="margin-bottom:20px"><div class="search" style="max-width:none"><input id="tt-q" class="in" style="padding-left:44px" type="search" placeholder="Cari pasal, kata kunci, atau pelanggaran (mis. seragam, terlambat, ponsel, gawai)…" value="' + esc(TT.st.q) + '" aria-label="Cari pasal">' + ic('search') + '</div><div class="chips" id="tt-chips" style="margin-top:14px"></div></div>'
      + '<div class="tt-layout"><div><div class="row" style="justify-content:space-between;margin-bottom:12px"><span id="tt-count" class="muted"></span><div class="row">' + (staf ? '<button class="btn btn-p btn-sm" data-act="pasal.baru">' + ic('plus') + 'Tambah Pasal</button>' : '') + '</div></div><div id="tt-list"></div>'
      + '<div class="promo" style="margin-top:20px"><span class="tile blue" style="background:#2563EB;color:#fff">' + ic('heart') + '</span><div class="grow" style="min-width:220px"><b style="color:var(--text)">Prinsip Disiplin Restoratif ' + esc(boot.app.sekolah) + '</b><p class="muted">Setiap teguran dan sanksi mengutamakan bimbingan dialogis serta penumbuhkembangan karakter murid, bukan sanksi fisik atau penghakiman.</p></div><a class="btn btn-o" href="#unduhan">' + ic('download') + 'Unduh Buku Saku PDF</a></div></div>'
      + '<aside class="card detail" id="tt-detail"></aside></div>';
    const q = $('#tt-q'); q.addEventListener('input', UI.debounce(function () { TT.st.q = q.value; paintTT(); }, 180));
    const onQuery = function () { if (!document.body.contains(q)) { document.removeEventListener('bs-query', onQuery); return; } TT.st.q = App.S.query; App.S.query = ''; q.value = TT.st.q; paintTT(); };
    document.addEventListener('bs-query', onQuery);
    const muat = staf ? API.call('pasal.kelola').then(function (d) { TT.data = d; }) : API.swr('pub.pasal', function (d) { TT.data = d; if (ctx.alive()) paintTT(); });
    await muat; if (!ctx.alive()) return;
    paintTT(true);
  } });
  function cocok(p, q) { q = q.toLowerCase().trim(); if (!q) return true; return q.split(/\s+/).every(function (w) { return (p.nomor + ' ' + p.judul + ' ' + p.isi + ' ' + p.kategori + ' ' + p.ringkasan + ' ' + p.ringkasSanksi).toLowerCase().indexOf(w) !== -1; }); }
  function paintTT(awal) {
    if (!$('#tt-list')) return;                                        // sudah berpindah halaman
    const boot = App.boot(), kat = boot.kategori, st = TT.st, staf = App.isStaf();
    const cnt = {}; TT.data.forEach(function (p) { cnt[p.kategori] = (cnt[p.kategori] || 0) + 1; });
    const daftarKat = kat.concat(Object.keys(cnt).filter(function (k) { return kat.indexOf(k) === -1; })).filter(function (k) { return cnt[k]; });
    $('#tt-stat').innerHTML = '<div class="card" style="padding:10px 16px;display:flex;gap:10px;align-items:center"><span class="tile blue" style="width:36px;height:36px">' + ic('book') + '</span><div><b style="color:var(--text)">' + TT.data.length + ' Pasal</b><div class="muted" style="font-size:12px">Terbagi ' + daftarKat.length + ' kategori</div></div></div>';
    $('#tt-chips').innerHTML = '<button class="chip ' + (!st.kat ? 'on' : '') + '" data-act="tt.kat" data-k="">' + ic('grid') + 'Semua Kategori <span class="n">' + TT.data.length + '</span></button>' + daftarKat.map(function (k) { const w = UI.katWarna(k, kat); return '<button class="chip ' + (st.kat === k ? 'on' : '') + '" data-act="tt.kat" data-k="' + esc(k) + '"><i style="background:' + w[2] + '"></i>' + esc(k) + ' <span class="n">' + cnt[k] + '</span></button>'; }).join('');
    const tampil = TT.data.filter(function (p) { return (!st.kat || p.kategori === st.kat) && cocok(p, st.q); });
    $('#tt-count').innerHTML = 'Menampilkan <b>' + tampil.length + '</b> dari <b>' + TT.data.length + '</b> Pasal Tata Tertib';
    $('#tt-list').innerHTML = tampil.length ? '<div class="pasal-grid">' + tampil.map(function (p) {
      const w = UI.katWarna(p.kategori, kat);
      return '<article class="pasal ' + (st.sel === p.nomor ? 'sel' : '') + '" data-act="pasal.pilih" data-no="' + esc(p.nomor) + '"><div class="b"><div class="top">' + UI.katPill(p.kategori, kat) + '<span class="muted bold" style="font-size:12px">' + (p.tampil === false ? '<span class="pill gray">Disembunyikan</span> ' : '') + 'Pasal ' + esc(p.nomor) + '</span></div><h3>' + esc(p.judul) + '</h3><p>' + esc(p.ringkasan || p.isi) + '</p></div>'
        + '<div class="sk" style="color:' + (p.tingkat === 'Berat' ? '#B91C1C' : 'inherit') + '">' + ic(p.tingkat === 'Berat' ? 'alert' : 'info') + '<span>Tingkat Sanksi: <b>' + esc(p.ringkasSanksi || p.tingkat) + '</b></span></div>'
        + '<div class="ft"><span style="color:var(--primary)">Lihat Detail &amp; Sanksi ' + ic('arrow') + '</span>' + (staf ? '<span class="nowrap"><button class="btn-ic" data-act="pasal.edit" data-no="' + esc(p.nomor) + '" aria-label="Ubah pasal">' + ic('pencil') + '</button><button class="btn-ic del" data-act="pasal.hapus" data-no="' + esc(p.nomor) + '" aria-label="Hapus pasal">' + ic('trash') + '</button></span>' : '') + '</div></article>';
    }).join('') + '</div>' : UI.kosong('search', st.q ? 'Tidak ada pasal yang cocok dengan "' + st.q + '". Coba kata kunci lain.' : 'Belum ada pasal tata tertib.', staf ? '<button class="btn btn-p" data-act="pasal.baru" style="margin-top:10px">' + ic('plus') + 'Tambah Pasal</button>' : '');
    const dipilih = TT.data.filter(function (p) { return p.nomor === st.sel; })[0] || (awal && window.innerWidth >= 1280 ? tampil[0] : null);
    if (dipilih && !st.sel) st.sel = dipilih.nomor;
    $('#tt-detail').innerHTML = dipilih ? detailPasal(dipilih, kat) : UI.kosong('book', 'Pilih pasal untuk melihat teks resmi dan tahapan sanksinya.');
    if (awal && TT.ctx.arg && dipilih && window.innerWidth < 1280) bukaDetailModal(dipilih);
  }
  function bukaDetailModal(p) { UI.modal({ judul: 'Detail Pasal ' + p.nomor, ukuran: 'lg', isi: detailPasal(p, App.boot().kategori) }); }
  const pasalByNo = function (no) { return TT.data.filter(function (p) { return p.nomor === String(no); })[0]; };
  A['tt.kat'] = function (el) { TT.st.kat = el.getAttribute('data-k'); paintTT(); };
  A['pasal.pilih'] = function (el) { const p = pasalByNo(el.getAttribute('data-no')); if (!p) return; TT.st.sel = p.nomor; history.replaceState(null, '', '#tata-tertib/' + p.nomor); paintTT(); if (window.innerWidth < 1280) bukaDetailModal(p); };
  A['pasal.salin'] = function (el) { UI.salin(location.href.split('#')[0] + '#tata-tertib/' + el.getAttribute('data-no')); };
  A['pasal.cetak'] = function (el) {
    const p = TT.data.filter(function (x) { return x.id === el.getAttribute('data-id'); })[0]; if (!p) return;
    UI.cetak('Pasal ' + p.nomor, '<h1>Pasal ' + UI.esc(p.nomor) + ' — ' + UI.esc(p.judul) + '</h1><p class="m">' + UI.esc(p.kategori) + ' · ' + UI.esc(App.boot().app.sekolah) + '</p>' + ayatHtml(p.isi) + '<h2>Tahapan Pembinaan &amp; Sanksi</h2>' + (p.sanksi || []).map(function (t) { return '<p><b>Pelanggaran ke-' + t.tahap + ': ' + UI.esc(t.judul) + '</b><br>' + UI.esc(t.uraian) + '</p>'; }).join(''));
  };
  A['pasal.catat'] = function (el) { App.S.preselectPasal = el.getAttribute('data-id'); location.hash = '#catatan'; };

  function formPasal(p) {
    p = p || { nomor: '', kategori: App.boot().kategori[0] || '', judul: '', isi: '', tingkat: 'Ringan', ringkasan: '', ringkasSanksi: '', sanksi: [], tampil: true };
    const kat = App.boot().kategori, tahap = [0, 1, 2, 3].map(function (i) { return (p.sanksi || [])[i] || { judul: '', uraian: '' }; });
    UI.modal({ judul: p.id ? 'Ubah Pasal ' + p.nomor : 'Tambah Pasal', ukuran: 'lg',
      isi: '<form id="fp"><div class="form-g"><div class="field"><label>Nomor pasal</label><input class="in" name="nomor" inputmode="numeric" value="' + esc(p.nomor) + '"></div><div class="field"><label>Kategori</label><select class="in" name="kategori">' + kat.map(function (k) { return '<option ' + (k === p.kategori ? 'selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select></div>'
        + '<div class="field full"><label>Judul pasal</label><input class="in" name="judul" maxlength="200" value="' + esc(p.judul) + '"></div><div class="field full"><label>Isi pasal</label><textarea class="in" name="isi" rows="6" placeholder="(1) Bunyi ayat pertama…&#10;(2) Bunyi ayat kedua…">' + esc(p.isi) + '</textarea><span class="hint">Satu ayat per baris. Awali dengan (1), (2), dan seterusnya.</span></div>'
        + '<div class="field"><label>Tingkat pelanggaran</label><select class="in" name="tingkat">' + ['Ringan', 'Sedang', 'Berat'].map(function (t) { return '<option ' + (t === p.tingkat ? 'selected' : '') + '>' + t + '</option>'; }).join('') + '</select></div><div class="field"><label>Ringkasan sanksi (untuk kartu)</label><input class="in" name="ringkasSanksi" maxlength="160" value="' + esc(p.ringkasSanksi) + '" placeholder="Bertingkat (Teguran → Wali Kelas → BK)"></div>'
        + '<div class="field full"><label>Ringkasan singkat (opsional)</label><input class="in" name="ringkasan" maxlength="300" value="' + esc(p.ringkasan) + '"></div>'
        + '<div class="full"><div class="sect-t">Tahapan sanksi edukatif (kosongkan yang tidak dipakai)</div>' + tahap.map(function (t, i) { return '<div class="form-g"><div class="field"><label>Tahap ' + (i + 1) + ' — judul</label><input class="in" name="sj' + i + '" value="' + esc(t.judul) + '"></div><div class="field"><label>Tahap ' + (i + 1) + ' — uraian</label><input class="in" name="su' + i + '" value="' + esc(t.uraian) + '"></div></div>'; }).join('') + '</div>'
        + '<div class="field full"><label class="check"><input type="checkbox" name="tampil" ' + (p.tampil !== false ? 'checked' : '') + '>Tampilkan ke siswa</label></div></div></form>',
      tombol: [{ label: 'Batal', aksi: function () { return true; } }, { label: 'Simpan Pasal', kelas: 'btn-p', aksi: async function (c) {
        const f = UI.form(c.el), sanksi = [0, 1, 2, 3].map(function (i) { return { judul: f['sj' + i], uraian: f['su' + i] }; });
        await API.call('pasal.simpan', { id: p.id, nomor: f.nomor, kategori: f.kategori, judul: f.judul, isi: f.isi, tingkat: f.tingkat, ringkasan: f.ringkasan, ringkasSanksi: f.ringkasSanksi, sanksi: sanksi, tampil: f.tampil });
        UI.ok('Pasal tersimpan.'); TT.data = await API.call('pasal.kelola'); API.pubFetch('pub.pasal').catch(function () {}); TT.st.sel = f.nomor; paintTT();
      } }] });
  }
  A['pasal.baru'] = function () { formPasal(); };
  A['pasal.edit'] = function (el) { const p = pasalByNo(el.getAttribute('data-no')); if (p) formPasal(p); };
  A['pasal.hapus'] = async function (el) {
    const p = pasalByNo(el.getAttribute('data-no')); if (!p || !(await UI.konfirmasiHapus(1, 'pasal'))) return;
    try { await API.call('pasal.hapus', { ids: [p.id] }); UI.ok('Pasal dipindahkan ke Data Terhapus.'); TT.data = await API.call('pasal.kelola'); API.pubFetch('pub.pasal').catch(function () {}); TT.st.sel = ''; paintTT(); } catch (e) { UI.err(e); }
  };

  /* ======================= PENGUMUMAN ======================= */
  const PG = { data: [] };
  App.register('pengumuman', { judul: 'Pengumuman', roles: SEMUA, render: async function (view, ctx) {
    const staf = App.isStaf();
    view.innerHTML = '<div class="page-h"><div class="t"><div class="eyebrow">' + ic('megaphone') + 'Informasi sekolah</div><h1>Papan Pengumuman Sekolah</h1><p>Informasi terbaru dari sekolah untuk siswa dan orang tua.</p></div>' + (staf ? '<button class="btn btn-p" data-act="peng.baru">' + ic('plus') + 'Pengumuman Baru</button>' : '') + '</div><div id="pg-list"></div>';
    const paint = function (d) { if (!ctx.alive()) return; PG.data = d; $('#pg-list').innerHTML = d.length ? '<div class="stack" style="gap:14px">' + d.map(function (p) {
      return '<article class="card"><div class="row" style="align-items:flex-start;flex-wrap:nowrap"><span class="tile blue">' + ic('megaphone') + '</span><div class="grow"><div class="row" style="gap:8px"><span class="d" style="font-weight:600;color:var(--primary);font-size:12px">' + UI.tgl(p.tanggal, true) + '</span>' + (p.penting ? '<span class="pill warn">Penting</span>' : '') + (p.kategori ? '<span class="pill gray">' + esc(p.kategori) + '</span>' : '') + '</div><h3 style="margin:6px 0">' + esc(p.judul) + '</h3><p style="white-space:pre-line;line-height:22px">' + esc(p.isi) + '</p><p class="muted" style="margin-top:8px;font-size:12px">Oleh ' + esc(p.oleh) + '</p></div>'
        + (staf ? '<div class="nowrap"><button class="btn-ic" data-act="peng.edit" data-id="' + esc(p.id) + '" aria-label="Ubah">' + ic('pencil') + '</button><button class="btn-ic del" data-act="peng.hapus" data-id="' + esc(p.id) + '" aria-label="Hapus">' + ic('trash') + '</button></div>' : '') + '</div></article>'; }).join('') + '</div>' : UI.kosong('megaphone', 'Belum ada pengumuman.'); };
    await API.swr('pub.pengumuman', paint).then(paint);
  } });
  function formPeng(p) {
    p = p || { judul: '', isi: '', kategori: 'Umum', penting: false, tanggal: UI.hariIni() };
    UI.modal({ judul: p.id ? 'Ubah Pengumuman' : 'Pengumuman Baru', isi: '<form><div class="field"><label>Judul</label><input class="in" name="judul" maxlength="160" value="' + esc(p.judul) + '"></div><div class="field"><label>Isi pengumuman</label><textarea class="in" name="isi" rows="5">' + esc(p.isi) + '</textarea></div><div class="form-g"><div class="field"><label>Kategori</label><input class="in" name="kategori" maxlength="40" value="' + esc(p.kategori) + '" placeholder="Umum, Akademik, BK &amp; OSIS"></div><div class="field"><label>Tanggal terbit</label><input class="in" type="date" name="tanggal" value="' + esc(p.tanggal) + '"></div></div><label class="check"><input type="checkbox" name="penting" ' + (p.penting ? 'checked' : '') + '>Tandai sebagai penting</label></form>',
      tombol: [{ label: 'Batal', aksi: function () { return true; } }, { label: 'Simpan', kelas: 'btn-p', aksi: async function (c) { const f = UI.form(c.el); await API.call('pengumuman.simpan', { id: p.id, judul: f.judul, isi: f.isi, kategori: f.kategori, tanggal: f.tanggal, penting: f.penting }); UI.ok('Pengumuman tersimpan.'); await API.pubFetch('pub.pengumuman'); App.route(); } }] });
  }
  A['peng.baru'] = function () { formPeng(); }; A['peng.edit'] = function (el) { const p = PG.data.filter(function (x) { return x.id === el.getAttribute('data-id'); })[0]; if (p) formPeng(p); };
  A['peng.hapus'] = async function (el) { if (!(await UI.konfirmasiHapus(1, 'pengumuman'))) return; try { await API.call('pengumuman.hapus', { ids: [el.getAttribute('data-id')] }); UI.ok('Dipindahkan ke Data Terhapus.'); await API.pubFetch('pub.pengumuman'); App.route(); } catch (e) { UI.err(e); } };

  /* ======================= KALENDER ======================= */
  const KL = { data: [], y: 0, m: 0 };
  App.register('kalender', { judul: 'Kalender Sekolah', roles: SEMUA, render: async function (view, ctx) {
    const staf = App.isStaf(); const now = new Date(); KL.y = now.getFullYear(); KL.m = now.getMonth();
    view.innerHTML = '<div class="page-h"><div class="t"><div class="eyebrow">' + ic('calendar') + 'Agenda sekolah</div><h1>Kalender Sekolah</h1><p>Hari libur, jadwal asesmen, dan kegiatan sekolah.</p></div>' + (staf ? '<button class="btn btn-p" data-act="kal.baru">' + ic('plus') + 'Tambah Kegiatan</button>' : '') + '</div><div class="grid g2" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start"><div class="card"><div id="kal-big"></div></div><div class="card"><div class="card-h"><h3 id="kal-judul">Kegiatan bulan ini</h3></div><div id="kal-list"></div></div></div>';
    let kal; const isi = function () {
      const awal = KL.y + '-' + ('0' + (KL.m + 1)).slice(-2) + '-01', akhir = KL.y + '-' + ('0' + (KL.m + 1)).slice(-2) + '-31';
      const ev = KL.data.filter(function (e) { return e.tanggal <= akhir && (e.selesai || e.tanggal) >= awal; });
      $('#kal-judul').textContent = 'Kegiatan ' + UI.BLN_P[KL.m] + ' ' + KL.y;
      $('#kal-list').innerHTML = ev.length ? ev.map(function (e) { return '<div class="ann"><div class="tile ' + (e.jenis === 'Libur' ? 'rose' : e.jenis === 'Jadwal' ? 'blue' : 'green') + '">' + ic('calendar') + '</div><div class="grow"><div class="d">' + UI.tgl(e.tanggal) + (e.selesai && e.selesai !== e.tanggal ? ' – ' + UI.tgl(e.selesai) : '') + ' · ' + esc(e.jenis) + '</div><h4>' + esc(e.judul) + '</h4>' + (e.keterangan ? '<p>' + esc(e.keterangan) + '</p>' : '') + '</div>' + (staf ? '<div class="nowrap"><button class="btn-ic" data-act="kal.edit" data-id="' + esc(e.id) + '" aria-label="Ubah">' + ic('pencil') + '</button><button class="btn-ic del" data-act="kal.hapus" data-id="' + esc(e.id) + '" aria-label="Hapus">' + ic('trash') + '</button></div>' : '') + '</div>'; }).join('') : UI.kosong('calendar', 'Tidak ada kegiatan pada bulan ini.');
    };
    const paint = function (d) { if (!ctx.alive()) return; KL.data = d; if (!kal) kal = Kal.mount($('#kal-big'), d, { onBulan: function (y, m) { KL.y = y; KL.m = m; if (KL.data) isi(); } }); else kal.ganti(d); isi(); };
    await API.swr('pub.kalender', paint).then(paint);
  } });
  function formKal(e) {
    e = e || { tanggal: UI.hariIni(), selesai: '', judul: '', jenis: 'Kegiatan', keterangan: '' };
    UI.modal({ judul: e.id ? 'Ubah Kegiatan' : 'Tambah Kegiatan', isi: '<form><div class="field"><label>Judul</label><input class="in" name="judul" maxlength="120" value="' + esc(e.judul) + '"></div><div class="form-g"><div class="field"><label>Tanggal mulai</label><input class="in" type="date" name="tanggal" value="' + esc(e.tanggal) + '"></div><div class="field"><label>Tanggal selesai (opsional)</label><input class="in" type="date" name="selesai" value="' + esc(e.selesai && e.selesai !== e.tanggal ? e.selesai : '') + '"></div><div class="field"><label>Jenis</label><select class="in" name="jenis">' + ['Kegiatan', 'Jadwal', 'Libur'].map(function (j) { return '<option ' + (j === e.jenis ? 'selected' : '') + '>' + j + '</option>'; }).join('') + '</select></div></div><div class="field"><label>Keterangan</label><input class="in" name="keterangan" maxlength="300" value="' + esc(e.keterangan) + '"></div></form>',
      tombol: [{ label: 'Batal', aksi: function () { return true; } }, { label: 'Simpan', kelas: 'btn-p', aksi: async function (c) { const f = UI.form(c.el); await API.call('kalender.simpan', { id: e.id, tanggal: f.tanggal, selesai: f.selesai, judul: f.judul, jenis: f.jenis, keterangan: f.keterangan }); UI.ok('Kegiatan tersimpan.'); await API.pubFetch('pub.kalender'); App.route(); } }] });
  }
  A['kal.baru'] = function () { formKal(); }; A['kal.edit'] = function (el) { const e = KL.data.filter(function (x) { return x.id === el.getAttribute('data-id'); })[0]; if (e) formKal(e); };
  A['kal.hapus'] = async function (el) { if (!(await UI.konfirmasiHapus(1, 'kegiatan'))) return; try { await API.call('kalender.hapus', { ids: [el.getAttribute('data-id')] }); UI.ok('Dipindahkan ke Data Terhapus.'); await API.pubFetch('pub.kalender'); App.route(); } catch (e) { UI.err(e); } };

  /* ======================= UNDUHAN ======================= */
  App.register('unduhan', { judul: 'Unduhan', roles: SEMUA, render: async function (view) {
    const b = App.boot();
    view.innerHTML = '<div class="page-h"><div class="t"><div class="eyebrow">' + ic('download') + 'Berkas</div><h1>Unduhan (PDF)</h1><p>Simpan tata tertib di ponselmu agar tetap bisa dibaca meski tanpa internet.</p></div></div><div class="grid g2">'
      + '<div class="card"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><span class="tile blue">' + ic('book') + '</span><div class="grow"><h3>Buku Saku Resmi (PDF)</h3><p class="muted" style="margin:6px 0 14px">Berkas buku saku tata tertib resmi sekolah.</p>' + (b.linkPdf ? '<a class="btn btn-p" href="' + esc(b.linkPdf) + '" target="_blank" rel="noopener">' + ic('download') + 'Buka / Unduh PDF</a>' : '<div class="alert warn">' + ic('info') + '<div>Tautan PDF resmi belum diatur. Admin dapat mengisinya di menu Pengaturan.</div></div>') + '</div></div></div>'
      + '<div class="card"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><span class="tile green">' + ic('print') + '</span><div class="grow"><h3>Cetak / Simpan Tata Tertib sebagai PDF</h3><p class="muted" style="margin:6px 0 14px">Semua pasal yang berlaku, siap dicetak. Pilih “Simpan sebagai PDF” di jendela cetak.</p><button class="btn btn-p" data-act="unduh.cetak">' + ic('print') + 'Buat PDF Tata Tertib</button></div></div></div></div>'
      + (App.isStaf() ? '<div class="card" style="margin-top:20px"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><span class="tile amber">' + ic('filexl') + '</span><div class="grow"><h3>Template Excel</h3><p class="muted" style="margin:6px 0 14px">Template unggah data murid dan guru tersedia di menu Data Murid &amp; Guru.</p><a class="btn btn-o" href="#data">' + ic('upload') + 'Buka Data Murid &amp; Guru</a></div></div></div>' : '');
  } });
  A['unduh.cetak'] = async function (el) {
    el.disabled = true;
    try {
      const d = App.isStaf() ? await API.call('pasal.kelola') : (API.cached('pub.pasal') || await API.pubFetch('pub.pasal')), b = App.boot().app;
      UI.cetak('Tata Tertib ' + b.sekolah, '<h1>Tata Tertib ' + UI.esc(b.sekolah) + '</h1><p class="m">Tahun Ajaran ' + UI.esc(b.tahunAjaran || '') + (b.sk ? ' · ' + UI.esc(b.sk) : '') + '</p>' + d.filter(function (p) { return p.tampil !== false; }).map(function (p) {
        return '<div class="pg"><h2>Pasal ' + UI.esc(p.nomor) + ' — ' + UI.esc(p.judul) + '</h2><p class="m">' + UI.esc(p.kategori) + ' · Tingkat ' + UI.esc(p.tingkat) + '</p>' + ayatHtml(p.isi) + (p.sanksi && p.sanksi.length ? '<p><b>Sanksi edukatif:</b> ' + p.sanksi.map(function (t) { return 'Ke-' + t.tahap + ' ' + UI.esc(t.judul); }).join('; ') + '</p>' : '') + '</div>'; }).join(''));
    } catch (e) { UI.err(e); } finally { el.disabled = false; }
  };
})();
