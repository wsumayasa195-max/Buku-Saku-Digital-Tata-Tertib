/* Inti aplikasi: state, menu per peran, router (#hash), layar masuk, shell. Halaman mendaftar lewat App.Pages. */
(function () {
  const { $, $$, esc, ic } = UI;
  const App = { S: { me: null, boot: null, nav: 0, query: '', badge: {}, dashP: null, dashT: 0, loginOpen: false }, Pages: {}, Actions: {}, Pagers: {} };
  window.App = App;
  const SEMUA = ['guest', 'siswa', 'guru', 'admin'], MASUK = ['siswa', 'guru', 'admin'], STAF = ['guru', 'admin'];
  const MENU = [
    { id: 'beranda', label: 'Beranda', ic: 'grid', roles: SEMUA },
    { id: 'tata-tertib', label: 'Tata Tertib', ic: 'book', roles: SEMUA },
    { id: 'catatan-saya', label: 'Catatan Saya', ic: 'user', roles: ['siswa'] },
    { id: 'catatan', label: 'Catatan Pelanggaran', ic: 'clipboard', roles: STAF },
    { id: 'pengumuman', label: 'Pengumuman', ic: 'megaphone', roles: SEMUA },
    { id: 'kalender', label: 'Kalender Sekolah', ic: 'calendar', roles: SEMUA },
    { id: 'data', label: 'Data Murid & Guru', ic: 'upload', roles: STAF },
    { id: 'kontak', label: 'Kontak & Notifikasi', ic: 'chat', roles: STAF },
    { id: 'unduhan', label: 'Unduhan (PDF)', ic: 'download', roles: SEMUA },
    { id: 'terhapus', label: 'Data Terhapus', ic: 'trash', roles: ['admin'] },
    { id: 'pengaturan', label: 'Pengaturan', ic: 'gear', roles: ['admin'] },
    { id: 'profil', label: 'Profil & Umpan Balik', ic: 'headset', roles: MASUK }
  ];
  const peran = function () { return App.S.me ? App.S.me.role : 'guest'; };
  App.peran = peran; App.isStaf = function () { return STAF.indexOf(peran()) !== -1; }; App.isAdmin = function () { return peran() === 'admin'; };
  App.boot = function () { return App.S.boot || { app: { nama: 'Buku Saku Digital', sekolah: 'SMPN 3 Kediri' }, kategori: [], kelas: [] }; };
  App.register = function (nama, def) { App.Pages[nama] = def; };
  const root = function () { return document.getElementById('root'); };
  const NAMA_PORTAL = { guest: 'Portal Umum', siswa: 'Portal Siswa', guru: 'Portal Guru & BK', admin: 'Portal Admin' };
  /** "Dra. Hj. Siti Aminah" → "Siti" (gelar tidak dianggap nama panggilan) */
  function namaPanggil(n) { const t = String(n || '').replace(/^(?:(?:Prof|Dr|Dra|Drs|Ir|Hj|H|Bapak|Bpk|Ibu|Ustadz|Ustadzah)\.?\s+)+/i, '').trim(); return t.split(/\s+/)[0] || n || ''; }
  const NAMA_PERAN = { siswa: 'Siswa', guru: 'Guru/BK', admin: 'Admin' };

  /* ---------- layar khusus ---------- */
  function kotakPesan(ikon, judul, html) { return '<div class="login"><div class="login-card" style="max-width:560px"><div class="logo">' + ic(ikon) + '</div><h1>' + esc(judul) + '</h1><div style="margin-top:14px;line-height:22px">' + html + '</div></div></div>'; }
  function showSetup() {
    const r = API.alasan(), u = (window.APP_CONFIG && window.APP_CONFIG.GAS_URL) || '';
    const contoh = '<pre class="code">window.APP_CONFIG = {\n  GAS_URL: \'https://script.google.com/macros/s/AKfycb…/exec\'\n};</pre>';
    const sebab = {
      'tidak-terbaca': '<p><b>Berkas <code>js/config.js</code> tidak terbaca atau isinya rusak.</b> Isinya harus persis berbentuk:</p>' + contoh + '<p class="muted" style="margin-top:8px">Penyebab umum: hanya alamatnya yang ditempel tanpa <code>window.APP_CONFIG = …</code>, atau tanda kutip/kurung hilang.</p>',
      'contoh': '<p>Berkas <code>js/config.js</code> di situs ini <b>masih berisi nilai contoh</b>. Isi <code>GAS_URL</code> dengan alamat Web App Apps Script Anda (berakhiran <code>/exec</code>), simpan, lalu kirim ulang ke GitHub.</p>',
      'bukan-https': '<p>Alamat yang terbaca: <code>' + esc(u) + '</code></p><p>Alamat harus diawali <code>https://script.google.com/</code>.</p>',
      'dev': '<p>Alamat yang terbaca: <code>' + esc(u) + '</code></p><p>Alamat berakhiran <code>/dev</code> adalah <b>versi uji</b> dan hanya bisa dibuka pemilik skrip. Pakai alamat berakhiran <code>/exec</code> dari <b>Deploy → Deployment baru → Aplikasi web</b>.</p>',
      'bukan-exec': '<p>Alamat yang terbaca: <code>' + esc(u) + '</code></p><p>Alamat harus berakhiran <code>/exec</code>. Salin <b>URL Aplikasi web</b> dari jendela hasil Deploy.</p>',
      'format': '<p>Alamat yang terbaca: <code>' + esc(u) + '</code></p><p>Bentuknya tidak dikenali. Pastikan tidak ada spasi, tanda tanya (<code>?</code>), atau teks tambahan, dan alamatnya berbentuk <code>https://script.google.com/macros/s/…/exec</code>.</p>'
    }[r];
    root().innerHTML = kotakPesan('gear', 'Aplikasi belum dihubungkan', sebab
      + '<div class="alert" style="margin-top:12px">' + ic('info') + '<div>Sudah mengubah <code>config.js</code> dan mengirimnya ke GitHub? Tunggu 1–2 menit, lalu tekan <b>Ctrl+Shift+R</b> (atau buka di jendela penyamaran) karena browser menyimpan versi lama.</div></div>'
      + '<p class="muted" style="margin-top:10px">Langkah lengkap: <b>PANDUAN-INSTALASI.md</b>, Bagian 2 dan Bagian 4.</p>');
  }
  function showFatal(e) {
    root().innerHTML = kotakPesan('alert', 'Tidak dapat membuka aplikasi', '<div class="alert bad">' + ic('alert') + '<div>' + esc(e.message) + '</div></div><p style="margin-top:12px" class="muted">Penyebab yang paling sering: URL <code>/exec</code> salah, Web App belum di-deploy untuk <b>Anyone</b>, atau <code>setupAppEnvironment()</code> belum dijalankan.</p><div class="row" style="margin-top:14px"><button class="btn btn-p" data-act="reload">' + ic('refresh') + 'Coba lagi</button></div>');
  }
  App.Actions.reload = function () { location.reload(); };

  function errorBox(e) {
    return '<div class="card"><div class="alert bad">' + ic('alert') + '<div><b>Gagal memuat halaman.</b><br>' + esc(e.message || e) + '</div></div><div class="row" style="margin-top:14px"><button class="btn btn-o" data-act="reroute">' + ic('refresh') + 'Muat ulang halaman</button></div></div>';
  }
  App.Actions.reroute = function () { route(); };
  App.errorBox = errorBox;

  /* ---------- masuk ---------- */
  function showLogin(pesan) {
    App.S.loginOpen = true;
    const b = App.boot().app;
    root().innerHTML = '<div class="login"><form class="login-card" id="f-login" autocomplete="on"><div class="logo">' + ic('cap') + '</div><h1>' + esc(b.nama) + '</h1><p class="sub">' + esc(b.sekolah) + '</p>'
      + (pesan ? '<div class="alert warn" style="margin-bottom:14px">' + ic('info') + '<div>' + esc(pesan) + '</div></div>' : '')
      + '<div class="field"><label id="lb-user" for="l-user">NISN / NIP</label><input class="in" id="l-user" name="username" inputmode="text" autocomplete="username" required></div>'
      + '<div class="field"><label for="l-pass">Kata sandi</label><input class="in" id="l-pass" name="password" type="password" autocomplete="current-password" required></div>'
      + '<button class="btn btn-p" style="width:100%;min-height:46px" id="b-login">' + ic('login') + 'Masuk</button>'
      + '<div class="row" style="justify-content:space-between;margin-top:14px;font-size:13px"><a href="#" data-act="buka-publik">Buka buku saku tanpa masuk</a><a href="#" data-act="mode-darurat" id="a-darurat">Admin darurat</a></div>'
      + '<p class="muted" style="font-size:12px;margin-top:16px;text-align:center">Lupa kata sandi? Hubungi guru BK atau admin sekolah untuk reset.</p></form></div>';
    $('#l-user').focus();
    $('#f-login').onsubmit = async function (e) {
      e.preventDefault(); const btn = $('#b-login'), darurat = App.S.darurat; btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Memeriksa…';
      try {
        const d = await API.call(darurat ? 'auth.darurat' : 'auth.login', { username: $('#l-user').value.trim(), password: $('#l-pass').value });
        API.setToken(d.token); App.S.me = d.me;
        try { App.S.me = await API.call('me'); } catch (x) { /* pakai data dasar dari respons login */ }
        App.S.loginOpen = false; App.S.darurat = false; App.S.dashP = null;
        renderShell(); if (!location.hash || location.hash === '#masuk') location.hash = '#beranda'; route();
        if (App.S.me.wajibGanti) App.ubahSandiModal(App.S.me.role !== 'siswa');
      } catch (er) { UI.err(er); btn.disabled = false; btn.innerHTML = ic('login') + 'Masuk'; $('#l-pass').value = ''; $('#l-pass').focus(); }
    };
  }
  App.showLogin = showLogin;
  App.Actions['mode-darurat'] = function () {
    App.S.darurat = !App.S.darurat; $('#lb-user').textContent = App.S.darurat ? 'Nama pengguna darurat' : 'NISN / NIP'; $('#a-darurat').textContent = App.S.darurat ? 'Kembali ke login biasa' : 'Admin darurat';
    $('#l-user').value = ''; $('#l-user').focus();
  };
  App.Actions['buka-publik'] = function () { App.S.loginOpen = false; renderShell(); if (!location.hash || location.hash === '#masuk') location.hash = '#beranda'; route(); };
  App.Actions.login = function () { showLogin(); };
  App.Actions.logout = async function () {
    if (!(await UI.konfirmasi({ judul: 'Keluar', pesan: 'Keluar dari akun ini?', ok: 'Keluar' }))) return;
    try { await API.call('auth.keluar'); } catch (e) { /* tetap keluar */ }
    API.setToken(''); App.S.me = null; App.S.dashP = null; App.S.badge = {}; location.hash = '#beranda'; renderShell(); route();
  };

  App.ubahSandiModal = function (wajib) {
    const staf = peran() !== 'siswa';
    UI.modal({ judul: wajib ? 'Buat kata sandi baru' : 'Ganti kata sandi', ukuran: 'sm', kunci: !!wajib,
      isi: (wajib ? '<div class="alert warn" style="margin-bottom:14px">' + ic('lock') + '<div>Kata sandi awal hanya untuk masuk pertama kali. Buat kata sandi baru milikmu sendiri.</div></div>' : '')
        + '<div class="field"><label>Kata sandi saat ini</label><input class="in" id="p-lama" type="password" autocomplete="current-password"></div>'
        + '<div class="field"><label>Kata sandi baru</label><input class="in" id="p-baru" type="password" autocomplete="new-password"><span class="hint">' + (staf ? 'Minimal 10 karakter, kombinasi huruf dan angka.' : 'Minimal 6 karakter.') + '</span></div>'
        + '<div class="field"><label>Ulangi kata sandi baru</label><input class="in" id="p-ulang" type="password" autocomplete="new-password"></div>',
      tombol: [{ label: wajib ? 'Nanti saja' : 'Batal', kelas: 'btn-o', aksi: function () { return true; } }, { label: 'Simpan', kelas: 'btn-p', aksi: async function () {
        if ($('#p-baru').value !== $('#p-ulang').value) { UI.toast('Pengulangan kata sandi tidak sama.', 'warn'); return false; }
        const d = await API.call('auth.ubahSandi', { lama: $('#p-lama').value, baru: $('#p-baru').value }); API.setToken(d.token); UI.ok('Kata sandi diganti.');
      } }] });
  };

  /* ---------- shell ---------- */
  function sidebarHtml() {
    const r = peran(), b = App.boot().app;
    const nav = MENU.filter(function (m) { return m.roles.indexOf(r) !== -1; }).map(function (m) {
      return '<a href="#' + m.id + '" data-nav="' + m.id + '">' + ic(m.ic) + '<span>' + esc(m.label) + '</span><em class="badge-n hide" data-badge="' + m.id + '"></em></a>';
    }).join('');
    return '<div class="brand"><div class="brand-logo">' + ic('cap') + '</div><div><b>' + esc(b.nama) + '</b><small>' + esc(b.sekolah) + '</small></div></div><nav class="nav" aria-label="Menu utama">' + nav + '</nav>'
      + '<div class="side-foot"><button data-act="' + (App.S.me ? 'logout' : 'login') + '">' + ic(App.S.me ? 'logout' : 'login') + '<span>' + (App.S.me ? 'Keluar' : 'Masuk') + '</span></button></div>';
  }
  function renderShell() {
    const me = App.S.me, r = peran(), b = App.boot().app;
    root().innerHTML = '<div class="app"><aside class="sidebar" id="sidebar">' + sidebarHtml() + '</aside><div class="scrim" id="scrim" data-act="menu-tutup"></div>'
      + '<div class="main"><header class="topbar"><button class="icon-btn" data-act="menu" aria-label="Buka menu">' + ic('menu') + '</button><div class="crumb">' + esc(b.nama) + ' &rsaquo; <b>' + NAMA_PORTAL[r] + '</b></div>'
      + '<div class="search">' + ic('search') + '<input id="gsearch" type="search" placeholder="Cari tata tertib, pasal, kata kunci…" aria-label="Cari tata tertib"></div>'
      + '<div class="top-r">' + (me ? '<button class="icon-btn" data-act="bell" aria-label="Notifikasi">' + ic('bell') + '<i class="dot hide" id="bell-dot"></i></button><button class="me" data-act="ke-profil"><span class="avatar">' + esc(UI.inisial(me.nama)) + '</span><div><b>Halo, ' + esc(namaPanggil(me.nama)) + '</b><small>' + (me.kelas ? 'Kelas ' + esc(me.kelas) + ' • ' : '') + NAMA_PERAN[me.role] + '</small></div></button>' : '<button class="btn btn-p btn-sm" data-act="login">' + ic('login') + 'Masuk</button>') + '</div></header>'
      + '<main class="content" id="view" tabindex="-1"></main><footer class="foot">© ' + new Date().getFullYear() + ' ' + esc(b.nama) + ' ' + esc(b.sekolah) + ' • Made with ♥ for Students</footer></div></div>';
    const g = $('#gsearch'); g.addEventListener('keydown', function (e) { if (e.key === 'Enter' && g.value.trim()) { App.S.query = g.value.trim(); g.value = ''; if (location.hash.indexOf('#tata-tertib') === 0) document.dispatchEvent(new CustomEvent('bs-query')); else location.hash = '#tata-tertib'; } });
    updateBadges();
    if (me) App.dash().catch(function () { /* badge saja */ });
  }
  function updateBadges() {
    const bd = App.S.badge || {}, r = peran();
    const set = function (id, n) { const el = $('[data-badge="' + id + '"]'); if (!el) return; el.textContent = n; el.classList.toggle('hide', !n); };
    set('catatan-saya', r === 'siswa' ? bd.menunggu : 0); set('catatan', App.isStaf() ? bd.keberatan : 0);
    const dot = $('#bell-dot'); if (dot) dot.classList.toggle('hide', !((r === 'siswa' && bd.menunggu) || (App.isStaf() && bd.keberatan)));
  }
  App.dash = function (paksa) {
    const s = App.S;
    if (!paksa && s.dashP && Date.now() - s.dashT < 20000) return s.dashP;
    s.dashT = Date.now();
    s.dashP = API.call('dashboard').then(function (d) { s.badge = { menunggu: d.kpi.menunggu, keberatan: d.kpi.keberatan }; updateBadges(); return d; });
    s.dashP.catch(function () { s.dashP = null; });
    return s.dashP;
  };
  App.invalidasi = function () { App.S.dashP = null; };
  App.Actions.menu = function () { $('#sidebar').classList.add('open'); $('#scrim').classList.add('open'); };
  App.Actions['menu-tutup'] = function () { $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('open'); };
  App.Actions['ke-profil'] = function () { location.hash = '#profil'; };
  App.Actions.bell = function () { location.hash = peran() === 'siswa' ? '#catatan-saya' : '#catatan'; };

  /* ---------- router ---------- */
  function parse() { const h = location.hash.replace(/^#\/?/, ''); const p = h.split('/'); return { name: p[0] || 'beranda', arg: p.slice(1).join('/') }; }
  async function route() {
    if (App.S.loginOpen) return;
    const p = parse(), page = App.Pages[p.name];
    if (!page) { location.hash = '#beranda'; return; }
    const r = peran();
    if (page.roles.indexOf(r) === -1) {
      if (r === 'guest') { showLogin('Masuk terlebih dahulu untuk membuka halaman ini.'); return; }
      UI.toast('Anda tidak memiliki akses ke halaman ini.', 'warn'); location.hash = '#beranda'; return;
    }
    const nav = ++App.S.nav, view = $('#view'); if (!view) return;
    $$('[data-nav]').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-nav') === p.name); });
    App.Actions['menu-tutup'](); view.innerHTML = UI.skeleton(); window.scrollTo(0, 0);
    document.title = page.judul + ' — ' + App.boot().app.nama;
    try { await page.render(view, { arg: p.arg, nav: nav, alive: function () { return nav === App.S.nav; } }); }
    catch (e) { if (nav === App.S.nav) view.innerHTML = errorBox(e); }
  }
  App.route = route;

  /* ---------- delegasi klik ---------- */
  document.addEventListener('click', function (e) {
    const a = e.target.closest('[data-act]');
    if (a) { const fn = App.Actions[a.getAttribute('data-act')]; if (fn) { if (a.tagName === 'A') e.preventDefault(); fn(a, e); } return; }
    const pg = e.target.closest('[data-pg]');
    if (pg && !pg.disabled) { const f = App.Pagers[pg.getAttribute('data-pgn')]; if (f) f(Number(pg.getAttribute('data-pg'))); }
  });
  document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { const g = $('#gsearch') || $('#tt-q'); if (g) { e.preventDefault(); g.focus(); } } });
  window.addEventListener('hashchange', route);
  function statusJaringan() {
    let el = document.getElementById('offline');
    if (!navigator.onLine && !el) { el = document.createElement('div'); el.id = 'offline'; el.className = 'offline'; el.textContent = 'Anda sedang offline — tata tertib yang sudah pernah dibuka tetap bisa dibaca.'; document.body.prepend(el); }
    if (navigator.onLine && el) el.remove();
  }
  window.addEventListener('online', statusJaringan); window.addEventListener('offline', statusJaringan);

  /* ---------- mulai ---------- */
  App.start = async function () {
    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) navigator.serviceWorker.register('sw.js').catch(function () { /* PWA opsional */ });
    statusJaringan();
    if (!API.siap()) return showSetup();
    API.onAuthLost = function (pesan) { App.S.me = null; App.S.dashP = null; showLogin(pesan || 'Sesi berakhir. Silakan masuk kembali.'); };
    root().innerHTML = '<div class="login"><div class="login-card" style="text-align:center"><div class="logo">' + ic('cap') + '</div><h1>Memuat…</h1><p class="sub">Menyiapkan buku saku digital</p><div class="skel" style="height:10px"></div></div></div>';
    try {
      const c = API.cached('pub.boot');
      if (c) { App.S.boot = c; API.swr('pub.boot', function (d) { App.S.boot = d; }).catch(function () { /* offline */ }); }
      else App.S.boot = await API.pubFetch('pub.boot');
    } catch (e) { return showFatal(e); }
    if (API.token) { try { App.S.me = await API.call('me'); } catch (e) { App.S.me = null; if (e.code === 'NET') UI.toast('Sedang offline: hanya data publik yang tersedia.', 'warn'); } }
    renderShell(); route();
  };
})();
