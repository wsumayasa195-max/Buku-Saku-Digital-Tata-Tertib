/* Utilitas UI bersama. Semua teks dinamis WAJIB lewat esc() sebelum masuk innerHTML. */
(function () {
  const ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkc: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
    alertc: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    hourglass: '<path d="M5 22h14M5 2h14M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2"/>',
    pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    plus: '<path d="M5 12h14M12 5v14"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    shieldc: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    gear: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><path d="M22 10v6"/>',
    filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>', refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    chevl: '<path d="m15 18-6-6 6-6"/>', chevr: '<path d="m9 18 6-6-6-6"/>', chevd: '<path d="m6 9 6 6 6-6"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    file: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/>',
    filexl: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><path d="M14 2v6h6M9 12l6 6M15 12l-6 6"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>', trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    print: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>', phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>', tag: '<path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.42 0l8.58-8.58a1 1 0 0 0 0-1.42Z"/><path d="M7 7h.01"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>', db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>', folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>', heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    gavel: '<path d="m14 13-7.5 7.5a2.12 2.12 0 0 1-3-3L11 10M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8"/>', award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>', headset: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>'
  };
  const UI = {};
  UI.ic = function (n, cls) { return '<svg class="svg-ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[n] || ICONS.info) + '</svg>'; };
  UI.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  UI.$ = function (s, r) { return (r || document).querySelector(s); };
  UI.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  UI.debounce = function (fn, ms) { let t; return function () { const a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms || 250); }; };

  /* ---- tanggal: nilai dari server berupa waktu WIB tanpa zona ("2026-11-17T07:02:00") — jangan dikonversi zona ---- */
  const BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'], BLN_P = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  UI.BLN_P = BLN_P;
  UI.tgl = function (iso, panjang) { const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/); if (!m) return ''; return Number(m[3]) + ' ' + (panjang ? BLN_P : BLN)[Number(m[2]) - 1] + ' ' + m[1]; };
  UI.jam = function (iso) { const m = String(iso || '').match(/T(\d{2}):(\d{2})/); return m && !(m[1] === '00' && m[2] === '00') ? m[1] + '.' + m[2] + ' WIB' : ''; };
  UI.tglJam = function (iso) { const j = UI.jam(iso); return UI.tgl(iso) + (j ? ' · ' + j : ''); };
  UI.hariIni = function () { const d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
  UI.salam = function () { const h = new Date().getHours(); return h < 11 ? 'Selamat Pagi' : h < 15 ? 'Selamat Siang' : h < 18 ? 'Selamat Sore' : 'Selamat Malam'; };
  UI.inisial = function (n) { return String(n || '?').trim().split(/\s+/).slice(0, 2).map(function (x) { return x[0]; }).join('').toUpperCase(); };

  /* ---- badge ---- */
  UI.statusPill = function (st) {
    if (st === 'Disepakati') return '<span class="pill ok">' + UI.ic('checkc') + 'Disepakati</span>';
    if (st === 'Menunggu Kesepakatan') return '<span class="pill warn">' + UI.ic('hourglass') + 'Menunggu Kesepakatan</span>';
    if (st === 'Keberatan') return '<span class="pill bad">' + UI.ic('alertc') + 'Keberatan</span>';
    return '<span class="pill gray">' + UI.esc(st) + '</span>';
  };
  UI.tingkatPill = function (t) { return '<span class="pill ' + (t === 'Berat' ? 'bad' : t === 'Sedang' ? 'warn' : 'gray') + '">' + UI.esc(t || 'Ringan') + '</span>'; };
  const KAT_WARNA = [['#EFF6FF', '#2563EB', '#3B82F6'], ['#FAF5FF', '#7E22CE', '#A855F7'], ['#F0FDF4', '#15803D', '#22C55E'], ['#FFFBEB', '#B45309', '#F59E0B'], ['#FFF1F2', '#BE123C', '#F43F5E'], ['#F1F5F9', '#475569', '#64748B']];
  UI.katWarna = function (kat, daftar) { const i = Math.max(0, (daftar || []).indexOf(kat)); return KAT_WARNA[i % KAT_WARNA.length]; };
  UI.katPill = function (kat, daftar) { const w = UI.katWarna(kat, daftar); return '<span class="cat" style="background:' + w[0] + ';color:' + w[1] + '"><i style="width:7px;height:7px;border-radius:50%;background:' + w[2] + ';display:inline-block"></i>' + UI.esc(kat) + '</span>'; };
  UI.skeleton = function (n) { let s = ''; for (let i = 0; i < (n || 3); i++) s += '<div class="skel" style="height:' + (i ? 18 : 28) + 'px;margin:12px 0;width:' + (i ? 90 - i * 8 : 60) + '%"></div>'; return '<div class="card">' + s + '</div>'; };
  UI.kosong = function (ikon, teks, aksi) { return '<div class="empty">' + UI.ic(ikon || 'info') + '<p>' + UI.esc(teks) + '</p>' + (aksi || '') + '</div>'; };

  /* ---- toast ---- */
  UI.toast = function (pesan, jenis) {
    let box = document.getElementById('toasts'); if (!box) { box = document.createElement('div'); box.id = 'toasts'; box.className = 'toasts'; document.body.appendChild(box); }
    const t = document.createElement('div'); t.className = 'toast ' + (jenis || ''); t.setAttribute('role', 'status');
    t.innerHTML = UI.ic(jenis === 'ok' ? 'checkc' : jenis === 'err' ? 'alertc' : 'info') + '<div>' + UI.esc(pesan) + '</div>';
    box.appendChild(t); setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(function () { t.remove(); }, 320); }, jenis === 'err' ? 6500 : 3800);
  };
  UI.ok = function (m) { UI.toast(m, 'ok'); }; UI.err = function (e) { UI.toast(typeof e === 'string' ? e : (e && e.message) || 'Terjadi kesalahan.', 'err'); };

  /* ---- modal ---- */
  /* opsi: {judul, isi (html), ukuran:'sm|lg', tombol:[{label, kelas, aksi:fn(ctl)->bool|Promise (false = tetap terbuka), tutup:false}], onBuka(el, ctl)} */
  UI.modal = function (o) {
    const bg = document.createElement('div'); bg.className = 'modal-bg'; bg.setAttribute('role', 'dialog'); bg.setAttribute('aria-modal', 'true');
    const tb = (o.tombol || []).map(function (b, i) { return '<button type="button" class="btn ' + (b.kelas || 'btn-o') + '" data-mb="' + i + '">' + (b.label) + '</button>'; }).join('');
    bg.innerHTML = '<div class="modal ' + (o.ukuran || '') + '"><div class="modal-h"><h3>' + UI.esc(o.judul || '') + '</h3><button class="btn-ic" data-mx aria-label="Tutup">' + UI.ic('x') + '</button></div><div class="modal-b">' + (o.isi || '') + '</div>' + (tb ? '<div class="modal-f">' + tb + '</div>' : '') + '</div>';
    document.body.appendChild(bg);
    const ctl = { el: bg, body: bg.querySelector('.modal-b'), tutup: function () { document.removeEventListener('keydown', esc); bg.remove(); if (o.onTutup) o.onTutup(); } };
    const esc = function (e) { if (e.key === 'Escape') ctl.tutup(); };
    document.addEventListener('keydown', esc);
    bg.addEventListener('mousedown', function (e) { if (e.target === bg && !o.kunci) ctl.tutup(); });
    bg.querySelector('[data-mx]').onclick = ctl.tutup;
    UI.$$('[data-mb]', bg).forEach(function (btn) {
      btn.onclick = async function () {
        const b = o.tombol[Number(btn.getAttribute('data-mb'))]; if (!b.aksi) return ctl.tutup();
        const lama = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="spin' + (/btn-(o|ob|g|d)\b/.test(b.kelas || 'btn-o') ? ' dark' : '') + '"></span>';
        try { const r = await b.aksi(ctl); if (r !== false && b.tutup !== false) ctl.tutup(); } catch (e) { UI.err(e); } finally { if (document.body.contains(btn)) { btn.disabled = false; btn.innerHTML = lama; } }
      };
    });
    if (o.onBuka) o.onBuka(bg, ctl);
    const fokus = bg.querySelector('input:not([type=hidden]),textarea,select'); if (fokus && window.innerWidth > 767) fokus.focus();
    return ctl;
  };
  UI.konfirmasi = function (o) {
    return new Promise(function (res) {
      let selesai = false;
      UI.modal({ judul: o.judul || 'Konfirmasi', ukuran: 'sm', isi: '<p style="line-height:22px">' + (o.html || UI.esc(o.pesan || '')) + '</p>', onTutup: function () { if (!selesai) res(false); },
        tombol: [{ label: 'Batal', kelas: 'btn-o', aksi: function () { selesai = true; res(false); } }, { label: o.ok || 'Ya, lanjutkan', kelas: o.bahaya ? 'btn-dd' : 'btn-p', aksi: function () { selesai = true; res(true); } }] });
    });
  };
  /** Hapus dengan konfirmasi dua langkah: ketik HAPUS. */
  UI.konfirmasiHapus = function (jumlah, jenis) {
    return new Promise(function (res) {
      let selesai = false;
      UI.modal({ judul: 'Hapus ' + jumlah + ' ' + jenis + '?', ukuran: 'sm', onTutup: function () { if (!selesai) res(false); },
        isi: '<p style="line-height:22px">Data dipindahkan ke <b>Data Terhapus</b> dan masih dapat dipulihkan oleh admin. Untuk melanjutkan, ketik <b>HAPUS</b> di bawah.</p><div class="field" style="margin-top:12px"><input class="in" id="kh-in" autocomplete="off" placeholder="Ketik HAPUS"></div>',
        tombol: [{ label: 'Batal', aksi: function () { selesai = true; res(false); } }, { label: UI.ic('trash') + 'Hapus', kelas: 'btn-dd', aksi: function (c) { if (UI.$('#kh-in', c.el).value.trim().toUpperCase() !== 'HAPUS') { UI.toast('Ketik HAPUS untuk melanjutkan.', 'warn'); return false; } selesai = true; res(true); } }] });
    });
  };

  /* ---- paginasi ---- */
  UI.pager = function (total, hal, per, nama) {
    const maks = Math.max(1, Math.ceil(total / per)); if (total <= per) return '<div class="pager"><span>Menampilkan ' + total + ' data</span></div>';
    const dari = (hal - 1) * per + 1, ke = Math.min(total, hal * per); let btn = '';
    const mulai = Math.max(1, Math.min(hal - 1, maks - 2)), akhir = Math.min(maks, mulai + 2);
    for (let i = mulai; i <= akhir; i++) btn += '<button class="' + (i === hal ? 'on' : '') + '" data-pg="' + i + '" data-pgn="' + nama + '">' + i + '</button>';
    return '<div class="pager"><span>Menampilkan <b>' + dari + '–' + ke + '</b> dari <b>' + total + '</b> data</span><div class="pg"><button data-pg="' + (hal - 1) + '" data-pgn="' + nama + '"' + (hal <= 1 ? ' disabled' : '') + '>Sebelumnya</button>' + btn + '<button data-pg="' + (hal + 1) + '" data-pgn="' + nama + '"' + (hal >= maks ? ' disabled' : '') + '>Selanjutnya</button></div></div>';
  };

  /* ---- util lain ---- */
  UI.salin = async function (teks) { try { await navigator.clipboard.writeText(teks); UI.ok('Disalin.'); } catch (e) { const t = document.createElement('textarea'); t.value = teks; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); UI.ok('Disalin.'); } catch (x) { UI.toast('Gagal menyalin.', 'err'); } t.remove(); } };
  UI.unduhTeks = function (nama, teks, mime) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([teks], { type: mime || 'text/plain;charset=utf-8' })); a.download = nama; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); };
  UI.csv = function (baris) { return '\ufeff' + baris.map(function (r) { return r.map(function (c) { const s = String(c == null ? '' : c); return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(','); }).join('\r\n'); };
  UI.parseCsv = function (teks) {
    const hasil = []; let baris = [], sel = '', q = false; teks = String(teks).replace(/^\ufeff/, '');
    const delim = (teks.split('\n')[0].match(/;/g) || []).length > (teks.split('\n')[0].match(/,/g) || []).length ? ';' : ',';
    for (let i = 0; i < teks.length; i++) {
      const c = teks[i];
      if (q) { if (c === '"' && teks[i + 1] === '"') { sel += '"'; i++; } else if (c === '"') q = false; else sel += c; }
      else if (c === '"') q = true; else if (c === delim) { baris.push(sel); sel = ''; } else if (c === '\n') { baris.push(sel.replace(/\r$/, '')); hasil.push(baris); baris = []; sel = ''; } else sel += c;
    }
    if (sel !== '' || baris.length) { baris.push(sel.replace(/\r$/, '')); hasil.push(baris); }
    return hasil.filter(function (r) { return r.join('').trim() !== ''; });
  };
  const SKRIP = {};
  UI.muatSkrip = function (url) {
    if (SKRIP[url]) return SKRIP[url];
    return (SKRIP[url] = new Promise(function (ok, gagal) { const s = document.createElement('script'); s.src = url; s.onload = ok; s.onerror = function () { delete SKRIP[url]; gagal(new Error('Gagal memuat pustaka dari internet. Periksa koneksi.')); }; document.head.appendChild(s); }));
  };
  UI.cetak = function (judul, html) {
    const w = window.open('', '_blank'); if (!w) { UI.toast('Izinkan pop-up untuk mencetak.', 'warn'); return; }
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>' + UI.esc(judul) + '</title><style>body{font-family:Arial,sans-serif;font-size:13px;color:#111;margin:24px}h1{font-size:18px}h2{font-size:15px;margin:18px 0 6px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:6px 8px;text-align:left;vertical-align:top}th{background:#eee}.k{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.c{border:1px dashed #666;padding:10px;border-radius:8px;break-inside:avoid}.c b{font-size:15px;display:block}.m{color:#555}.pg{break-inside:avoid;margin-bottom:14px}</style></head><body>' + html + '<script>setTimeout(function(){window.print()},300)<\/script></body></html>');
    w.document.close();
  };
  UI.form = function (el) { const o = {}; UI.$$('[name]', el).forEach(function (f) { if (f.type === 'checkbox') o[f.name] = f.checked; else if (f.type === 'radio') { if (f.checked) o[f.name] = f.value; } else o[f.name] = f.value; }); return o; };
  window.UI = UI;
})();
