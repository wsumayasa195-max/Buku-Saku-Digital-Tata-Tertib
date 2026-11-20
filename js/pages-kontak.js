/* Halaman: Kontak & Notifikasi — CRM kontak (Nama · Email · WhatsApp), Blast WA, Antrean, Konfigurasi */
(function () {
  const { $, $$, esc, ic } = UI, A = App.Actions;
  const K = { tab: 'kontak', f: { cari: '', segmen: '', statusWA: '', kelas: '', tag: '', optOut: '', duplikat: false, halaman: 1, per: 50 }, d: null, sel: {}, ctx: null, audiens: null, cfg: null };

  App.register('kontak', { judul: 'Kontak & Notifikasi', roles: ['guru', 'admin'], render: async function (view, ctx) {
    K.ctx = ctx; K.sel = {}; if (!App.isAdmin() && K.tab === 'konfigurasi') K.tab = 'kontak';
    view.innerHTML = '<div class="page-h"><div class="t"><div class="eyebrow">' + ic('chat') + 'CRM &amp; notifikasi</div><h1>Kontak &amp; Notifikasi</h1><p>Pantau kontak wali murid dan guru, kirim pesan massal per batch lewat WhatsApp, dan atur notifikasi otomatis.</p></div></div>'
      + '<div class="tabs" id="kt-tabs"><button data-act="kt.tab" data-t="kontak">Kontak</button><button data-act="kt.tab" data-t="blast">Blast WhatsApp</button><button data-act="kt.tab" data-t="antrean">Antrean Pesan</button>' + (App.isAdmin() ? '<button data-act="kt.tab" data-t="konfigurasi">Konfigurasi</button>' : '') + '</div><div id="kt-body"></div>';
    paintTab();
  } });
  A['kt.tab'] = function (el) { K.tab = el.getAttribute('data-t'); paintTab(); };
  function paintTab() {
    $$('#kt-tabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-t') === K.tab); });
    ({ kontak: tabKontak, blast: tabBlast, antrean: tabAntrean, konfigurasi: tabKonfig })[K.tab]();
  }

  /* ======================= KONTAK (CRM) ======================= */
  async function tabKontak() {
    const boot = App.boot(), body = $('#kt-body');
    body.innerHTML = '<div class="grid" id="kt-stat" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:16px"></div><div class="card"><div class="filters"><div class="grow search" style="max-width:none"><input class="in" id="kt-q" style="padding-left:42px" type="search" placeholder="Cari nama, email, nomor, atau nama murid…" value="' + esc(K.f.cari) + '">' + ic('search') + '</div>'
      + '<select class="in" id="kt-seg"><option value="">Semua segmen</option><option>Wali Murid</option><option>Guru</option><option>Lainnya</option></select><select class="in" id="kt-wa"><option value="">Semua status WA</option><option>Terdaftar</option><option>Tidak Terdaftar</option><option value="belum">Belum dicek</option></select>'
      + '<select class="in" id="kt-kelas"><option value="">Semua kelas</option>' + boot.kelas.map(function (k) { return '<option ' + (K.f.kelas === k ? 'selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select><label class="check"><input type="checkbox" id="kt-dup" ' + (K.f.duplikat ? 'checked' : '') + '>Duplikat saja</label></div>'
      + '<div class="row" style="margin:12px 0"><button class="btn btn-o btn-sm" data-act="kt.sync">' + ic('refresh') + 'Sinkron dari Murid &amp; Guru</button><button class="btn btn-o btn-sm" data-act="kt.deteksi">' + ic('wifi') + 'Deteksi Nomor WA</button><button class="btn btn-o btn-sm" data-act="kt.impor">' + ic('upload') + 'Impor CSV</button>' + (App.isAdmin() ? '<button class="btn btn-o btn-sm" data-act="kt.ekspor">' + ic('download') + 'Ekspor CSV</button>' : '')
      + '<span class="right row"><button class="btn btn-ob btn-sm" data-act="kt.bulk" data-a="tag">' + ic('tag') + 'Beri Tag</button><button class="btn btn-ob btn-sm" data-act="kt.bulk" data-a="optout">Opt-out</button><button class="btn btn-ob btn-sm" data-act="kt.bulk" data-a="optin">Opt-in</button><button class="btn btn-ob btn-sm" data-act="kt.gabung">Gabung</button><button class="btn btn-p btn-sm" data-act="kt.kirimTerpilih">' + ic('send') + 'Blast Terpilih</button></span></div><div id="kt-tabel">' + UI.skeleton(3) + '</div></div>';
    $('#kt-seg').value = K.f.segmen; $('#kt-wa').value = K.f.statusWA;
    const q = $('#kt-q'); q.addEventListener('input', UI.debounce(function () { K.f.cari = q.value; K.f.halaman = 1; muatKontak(); }, 300));
    [['kt-seg', 'segmen'], ['kt-wa', 'statusWA'], ['kt-kelas', 'kelas']].forEach(function (x) { $('#' + x[0]).addEventListener('change', function (e) { K.f[x[1]] = e.target.value; K.f.halaman = 1; muatKontak(); }); });
    $('#kt-dup').addEventListener('change', function (e) { K.f.duplikat = e.target.checked; K.f.halaman = 1; muatKontak(); });
    API.call('crm.stats').then(function (s) {
      const c = [['blue', 'users', s.total, 'Total kontak'], ['green', 'chat', s.terdaftarWA, 'Terdaftar WhatsApp'], ['green', 'phone', s.waValid, 'Nomor WA valid'], ['purple', 'mail', s.emailValid, 'Email valid'], ['amber', 'hourglass', s.belumDicek, 'Belum dicek WA'], ['rose', 'copy', s.duplikat, 'Duplikat'], ['rose', 'alert', s.tidakBisaDihubungi, 'Tak bisa dihubungi'], ['amber', 'x', s.optOut, 'Opt-out']];
      if ($('#kt-stat')) $('#kt-stat').innerHTML = c.map(function (x) { return '<div class="card" style="padding:12px 14px;display:flex;gap:10px;align-items:center"><span class="tile ' + x[0] + '" style="width:38px;height:38px">' + ic(x[1]) + '</span><div><b style="font-size:19px;color:var(--text);display:block;line-height:22px">' + x[2] + '</b><span class="muted" style="font-size:12px">' + x[3] + '</span></div></div>'; }).join('');
    }).catch(function () {});
    await muatKontak();
  }
  async function muatKontak() {
    const box = $('#kt-tabel'); if (!box) return;
    try {
      const d = await API.call('crm.list', K.f); K.d = d; if (!K.ctx.alive()) return;
      if (!d.total && !K.f.cari && !K.f.segmen && !K.f.statusWA && !K.f.kelas && !K.f.duplikat) { box.innerHTML = UI.kosong('users', 'Belum ada kontak. Klik “Sinkron dari Murid & Guru” untuk mengisi otomatis dari data yang sudah ada.'); return; }
      box.innerHTML = '<div class="tbl-wrap"><table class="t rt"><thead><tr><th style="width:36px"><input type="checkbox" id="kt-all" aria-label="Pilih semua"></th><th>Nama</th><th>WhatsApp</th><th>Email</th><th>Segmen &amp; tag</th><th>Pesan</th><th></th></tr></thead><tbody>' + d.rows.map(function (k) {
        const wa = k.statusWA === 'Terdaftar' ? '<span class="pill ok">WA ✓</span>' : k.statusWA === 'Tidak Terdaftar' ? '<span class="pill bad">Bukan WA</span>' : (k.wa ? '<span class="pill gray">Belum dicek</span>' : '');
        return '<tr class="' + (k.optOut ? '' : '') + '"><td data-l="Pilih"><input type="checkbox" data-ksel="' + esc(k.id) + '" ' + (K.sel[k.id] ? 'checked' : '') + '></td><td data-l="Nama"><b>' + esc(k.nama) + '</b>' + (k.optOut ? ' <span class="pill bad">Opt-out</span>' : '') + (k.duplikat ? ' <span class="pill warn">Duplikat</span>' : '') + '<span class="sub">' + (k.info.NamaMurid ? 'Wali ' + esc(k.info.NamaMurid) + ' · ' + esc(k.info.Kelas) : esc(k.info.Peran || '')) + '</span></td><td data-l="WhatsApp" class="mono">' + (k.wa ? esc(k.wa) : '<span class="faint">-</span>') + ' ' + wa + '</td><td data-l="Email">' + (k.email ? esc(k.email) + (k.emailValid === 'TIDAK' ? ' <span class="pill bad">Salah</span>' : '') : '<span class="faint">-</span>') + '</td><td data-l="Segmen"><span class="pill blue">' + esc(k.segmen) + '</span>' + (k.tag ? '<span class="sub">' + esc(k.tag) + '</span>' : '') + '</td><td data-l="Pesan">' + k.jumlahPesan + '<span class="sub">' + (k.terakhir ? UI.tgl(k.terakhir) : 'belum pernah') + '</span></td><td class="acts nolabel"><button class="btn-ic" data-act="kt.detail" data-id="' + esc(k.id) + '" aria-label="Detail">' + ic('eye') + '</button></td></tr>';
      }).join('') + '</tbody></table></div>' + UI.pager(d.total, d.halaman, d.per, 'kt');
      const all = $('#kt-all'); if (all) all.addEventListener('change', function () { $$('[data-ksel]').forEach(function (c) { c.checked = all.checked; K.sel[c.getAttribute('data-ksel')] = all.checked; }); });
    } catch (e) { box.innerHTML = App.errorBox(e); }
  }
  document.addEventListener('change', function (e) { const s = e.target.getAttribute && e.target.getAttribute('data-ksel'); if (s) K.sel[s] = e.target.checked; });
  App.Pagers.kt = function (n) { K.f.halaman = n; muatKontak(); };
  const idTerpilih = function () { return Object.keys(K.sel).filter(function (k) { return K.sel[k]; }); };

  A['kt.sync'] = async function (el) { el.disabled = true; try { const r = await API.call('crm.sync'); UI.ok('Sinkron selesai: +' + r.ditambah + ' baru, ' + r.diperbarui + ' diperbarui.'); tabKontak(); } catch (e) { UI.err(e); } finally { el.disabled = false; } };
  A['kt.deteksi'] = async function (el) {
    el.disabled = true; let terdaftar = 0, tidak = 0;
    try {
      const d = await API.call('crm.list', { statusWA: 'belum', per: 100, halaman: 1 }), nomor = d.rows.filter(function (k) { return k.wa; }).map(function (k) { return k.wa; });
      if (!nomor.length) { UI.toast('Semua nomor sudah dicek.', 'ok'); return; }
      for (let i = 0; i < Math.min(nomor.length, 100); i += 50) { const r = await API.call('wa.validate', { nomor: nomor.slice(i, i + 50) }); terdaftar += r.terdaftar; tidak += r.tidak; }
      UI.ok('Selesai: ' + terdaftar + ' terdaftar WA, ' + tidak + ' bukan WA.' + (d.total > 100 ? ' Klik lagi untuk melanjutkan sisanya.' : '')); tabKontak();
    } catch (e) { UI.err(e); } finally { el.disabled = false; }
  };
  A['kt.bulk'] = async function (el) {
    const ids = idTerpilih(); if (!ids.length) return UI.toast('Centang kontak terlebih dahulu.', 'warn'); const a = el.getAttribute('data-a');
    const jalan = async function (nilai) { const r = await API.call('crm.bulk', { ids: ids, aksi: a, nilai: nilai }); UI.ok(r.diubah + ' kontak diperbarui.'); K.sel = {}; tabKontak(); };
    if (a === 'tag') UI.modal({ judul: 'Beri tag pada ' + ids.length + ' kontak', ukuran: 'sm', isi: '<div class="field"><label>Tag</label><input class="in" id="tg" maxlength="30" placeholder="mis. kelas9, prioritas"></div>', tombol: [{ label: 'Batal', aksi: function () { return true; } }, { label: 'Terapkan', kelas: 'btn-p', aksi: async function (c) { const v = $('#tg', c.el).value.trim(); if (!v) return false; await jalan(v); } }] });
    else if (await UI.konfirmasi({ judul: a === 'optout' ? 'Tandai opt-out?' : 'Aktifkan kembali?', pesan: ids.length + ' kontak ' + (a === 'optout' ? 'tidak akan menerima blast lagi.' : 'dapat menerima pesan lagi.') })) await jalan('').catch(UI.err);
  };
  A['kt.gabung'] = async function () {
    const ids = idTerpilih(); if (ids.length < 2) return UI.toast('Centang minimal 2 kontak yang akan digabung.', 'warn');
    if (await UI.konfirmasi({ judul: 'Gabung kontak?', pesan: 'Kontak pertama yang dicentang menjadi kontak utama; ' + (ids.length - 1) + ' lainnya diarsipkan dan riwayatnya digabung.' })) { try { await API.call('crm.merge', { utama: ids[0], gabung: ids.slice(1) }); UI.ok('Kontak digabung.'); K.sel = {}; tabKontak(); } catch (e) { UI.err(e); } }
  };
  A['kt.impor'] = function () {
    UI.modal({ judul: 'Impor kontak dari CSV', isi: '<p class="muted" style="margin-bottom:10px">Kolom: <code>nama, email, wa, segmen, tag</code> (baris pertama = judul). Minimal nama dan salah satu dari email/WA. Kontak dengan nomor/email yang sama dilewati.</p><input type="file" id="im-f" accept=".csv,text/csv" class="in">',
      tombol: [{ label: 'Batal', aksi: function () { return true; } }, { label: 'Impor', kelas: 'btn-p', aksi: async function (c) {
        const f = $('#im-f', c.el).files[0]; if (!f) { UI.toast('Pilih berkas CSV.', 'warn'); return false; }
        const t = UI.parseCsv(await f.text()), h = t[0].map(function (x) { return x.trim().toLowerCase(); }), ix = function (n) { return h.indexOf(n); };
        if (ix('nama') < 0) { UI.toast('Kolom "nama" tidak ditemukan.', 'err'); return false; }
        const rows = t.slice(1, 1001).map(function (r) { return { nama: r[ix('nama')], email: r[ix('email')], wa: r[ix('wa')] !== undefined && ix('wa') > -1 ? r[ix('wa')] : r[ix('no wa')], segmen: r[ix('segmen')], tag: r[ix('tag')] }; });
        const r = await API.call('crm.import', { rows: rows }); UI.ok(r.ditambah + ' kontak ditambahkan, ' + r.dilewati + ' dilewati.'); tabKontak();
      } }] });
  };
  A['kt.ekspor'] = async function (el) {
    el.disabled = true; try { const r = await API.call('crm.export', K.f); if (!r.rows.length) return UI.toast('Tidak ada data.', 'warn'); const h = Object.keys(r.rows[0]); UI.unduhTeks('kontak-crm.csv', UI.csv([h].concat(r.rows.map(function (o) { return h.map(function (k) { return o[k]; }); }))), 'text/csv;charset=utf-8'); } catch (e) { UI.err(e); } finally { el.disabled = false; }
  };
  A['kt.detail'] = async function (el) {
    try {
      const d = await API.call('crm.detail', { kontakId: el.getAttribute('data-id') }), k = d.kontak, manual = k.sumber === 'manual';
      UI.modal({ judul: k.nama, ukuran: 'lg', isi: '<div class="row" style="margin-bottom:10px"><span class="pill blue">' + esc(k.segmen) + '</span>' + (k.optOut ? '<span class="pill bad">Opt-out</span>' : '') + (k.duplikat ? '<span class="pill warn">Duplikat</span>' : '') + '<span class="muted">Sumber: ' + esc(k.sumber) + '</span></div><form id="kd"><div class="form-g">'
        + '<div class="field"><label>WhatsApp</label><input class="in" name="wa" value="' + esc(k.wa) + '" ' + (manual ? '' : 'disabled') + '></div><div class="field"><label>Email</label><input class="in" name="email" value="' + esc(k.email) + '" ' + (manual ? '' : 'disabled') + '></div><div class="field"><label>Tag (pisahkan koma)</label><input class="in" name="tag" value="' + esc(k.tag) + '"></div><div class="field"><label>Catatan</label><input class="in" name="catatan" value="' + esc(k.catatan) + '"></div></div>'
        + (manual ? '' : '<p class="hint muted">Nama, nomor, dan email berasal dari data ' + (k.sumber === 'wali' ? 'murid' : 'guru') + '. Ubah di menu Data Murid &amp; Guru.</p>') + '<label class="check"><input type="checkbox" name="optOut" ' + (k.optOut ? 'checked' : '') + '>Opt-out (jangan kirim blast)</label></form>'
        + '<div class="sect-t">Catat interaksi manual</div><div class="row" style="flex-wrap:nowrap"><select class="in" id="ix-k" style="width:150px">' + ['Telepon', 'WA Manual', 'Kunjungan', 'Catatan'].map(function (x) { return '<option>' + x + '</option>'; }).join('') + '</select><input class="in" id="ix-r" placeholder="Ringkasan percakapan…"><button class="btn btn-ob" id="ix-b">Catat</button></div>'
        + '<div class="sect-t">Riwayat</div>' + (d.timeline.length ? d.timeline.map(function (t) { return '<div class="ann"><div class="tile ' + (t.kanal === 'WA' ? 'green' : t.kanal === 'EMAIL' ? 'purple' : 'blue') + '" style="width:36px;height:36px">' + ic(t.kanal === 'EMAIL' ? 'mail' : t.kanal === 'WA' ? 'chat' : 'phone') + '</div><div class="grow"><div class="d">' + UI.tglJam(t.waktu) + ' · ' + esc(t.kanal) + ' · ' + esc(t.oleh) + '</div><p style="-webkit-line-clamp:3">' + esc(t.ringkasan) + '</p></div></div>'; }).join('') : '<p class="muted">Belum ada riwayat.</p>'),
        onBuka: function (m) { $('#ix-b', m).onclick = async function () { try { await API.call('crm.interaksi', { kontakId: k.id, kanal: $('#ix-k', m).value, ringkasan: $('#ix-r', m).value }); UI.ok('Interaksi dicatat.'); } catch (e) { UI.err(e); } }; },
        tombol: [{ label: 'Tutup', aksi: function () { return true; } }, { label: 'Simpan', kelas: 'btn-p', aksi: async function (c) { const f = UI.form($('#kd', c.el)); await API.call('crm.save', { kontakId: k.id, tag: f.tag, catatan: f.catatan, optOut: f.optOut, wa: manual ? f.wa : undefined, email: manual ? f.email : undefined, nama: manual ? k.nama : undefined }); UI.ok('Kontak disimpan.'); muatKontak(); } }] });
    } catch (e) { UI.err(e); }
  };
  A['kt.kirimTerpilih'] = async function () {
    const ids = idTerpilih(); if (!ids.length) return UI.toast('Centang kontak yang akan dikirimi pesan.', 'warn');
    const rows = (K.d ? K.d.rows : []).filter(function (k) { return K.sel[k.id]; }); K.audiens = { dari: 'terpilih', rows: rows.map(function (k) { return { id: k.id, nama: k.nama, hp: k.wa, optOut: k.optOut, statusWA: k.statusWA, vars: { kelas: k.info.Kelas || '', namaMurid: k.info.NamaMurid || '' } }; }) };
    K.tab = 'blast'; paintTab();
  };

  /* ======================= BLAST WHATSAPP ======================= */
  const B = { f: { segmen: 'Wali Murid', kelas: '', statusWA: '', tag: '' }, hanyaWA: false };
  async function tabBlast() {
    const boot = App.boot(); let cfg = null; try { cfg = App.isAdmin() ? await API.call('notif.config') : null; } catch (e) { /* abaikan */ }
    $('#kt-body').innerHTML = '<div class="grid g-main"><div class="stack"><div class="card"><div class="card-h"><h3>1 · Pilih penerima</h3></div>'
      + (K.audiens && K.audiens.dari === 'terpilih' ? '<div class="alert">' + ic('info') + '<div>' + K.audiens.rows.length + ' kontak terpilih dari tab Kontak. <a href="#" data-act="bl.lepas">Pakai filter lain</a></div></div>'
      : '<div class="filters"><select class="in" id="bl-seg"><option>Wali Murid</option><option>Guru</option><option value="">Semua segmen</option></select><select class="in" id="bl-kelas"><option value="">Semua kelas</option>' + boot.kelas.map(function (k) { return '<option>' + esc(k) + '</option>'; }).join('') + '</select><select class="in" id="bl-wa"><option value="">Semua status WA</option><option>Terdaftar</option></select><input class="in" id="bl-tag" placeholder="Tag (opsional)" style="min-width:130px"><button class="btn btn-ob btn-sm" data-act="bl.hitung">' + ic('users') + 'Hitung penerima</button></div><div class="field" style="margin-top:12px"><label>Atau tempel nomor manual (satu per baris: <code>nomor|nama</code>)</label><textarea class="in" id="bl-manual" rows="3" placeholder="081234567890|Bu Ani"></textarea></div>')
      + '<div id="bl-aud" style="margin-top:12px"></div></div>'
      + '<div class="card"><div class="card-h"><h3>2 · Tulis pesan</h3></div><div class="field"><label>Judul internal</label><input class="in" id="bl-judul" maxlength="100" placeholder="Undangan rapat wali murid"></div><div class="field"><label>Isi pesan</label><textarea class="in" id="bl-pesan" rows="5" maxlength="1500" placeholder="Yth. {nama}, …"></textarea><span class="hint">Variabel: <code>{nama}</code> <code>{namaMurid}</code> <code>{kelas}</code> <code>{institusi}</code> <code>{link}</code>. Tulis *tebal* dengan tanda bintang.</span></div><div class="alert warn">' + ic('info') + '<div id="bl-prev">Pratinjau muncul setelah menulis pesan.</div></div></div>'
      + '<div class="card"><div class="card-h"><h3>3 · Batch &amp; kirim</h3></div><div class="form-g"><div class="field"><label>Ukuran batch</label><select class="in" id="bl-batch">' + [10, 20, 50].map(function (n) { return '<option ' + (n === (cfg ? cfg.batchDefault : 20) ? 'selected' : '') + '>' + n + '</option>'; }).join('') + '</select><span class="hint">Pesan dikirim bertahap agar nomor aman dari pembatasan WhatsApp.</span></div><div class="field"><label>Jeda antarpesan (detik)</label><input class="in" id="bl-jeda" value="' + esc(cfg ? cfg.jeda : '5') + '" placeholder="5 atau 3-8"></div></div><label class="check"><input type="checkbox" id="bl-hanya">Hanya kirim ke nomor yang sudah terdeteksi terdaftar WhatsApp</label><div style="margin-top:14px"><button class="btn btn-p" data-act="bl.buat">' + ic('send') + 'Buat Blast</button></div></div></div>'
      + '<div class="card"><div class="card-h"><h3>Riwayat Blast</h3><button class="btn btn-g btn-sm right" data-act="bl.muat">' + ic('refresh') + 'Muat ulang</button></div><div id="bl-list">' + UI.skeleton(2) + '</div></div></div>';
    ['bl-seg', 'bl-kelas', 'bl-wa'].forEach(function (id) { const e = $('#' + id); if (e) e.addEventListener('change', function () { K.audiens = null; $('#bl-aud').innerHTML = ''; }); });
    $('#bl-pesan').addEventListener('input', UI.debounce(pratinjauBlast, 200)); muatBlast(); if (K.audiens && K.audiens.dari === 'terpilih') ringkasAudiens();
  }
  A['bl.lepas'] = function () { K.audiens = null; tabBlast(); };
  function pratinjauBlast() {
    if (!$('#bl-pesan') || !$('#bl-prev')) return;                     // pengguna sudah berpindah halaman
    const t = $('#bl-pesan').value, r = K.audiens && K.audiens.rows[0], v = Object.assign({ nama: r ? r.nama : 'Bu Ani', institusi: App.boot().app.sekolah, link: location.href.split('#')[0] }, r ? r.vars : { namaMurid: 'Rizky', kelas: 'IX-A' });
    $('#bl-prev').innerHTML = '<b>Pratinjau:</b><br><span style="white-space:pre-line">' + esc(t.replace(/\{(\w+)\}/g, function (m, k) { return v[k] == null ? m : v[k]; })) + '</span>';
  }
  function ringkasAudiens() {
    const a = K.audiens; if (!a || !$('#bl-aud')) return; const seen = {}; let valid = 0, ganda = 0, salah = 0, opt = 0, wa = 0;
    a.rows.forEach(function (r) { const h = String(r.hp || '').replace(/\D/g, ''); if (!/^0?8\d{8,12}$/.test(h) && !/^628\d{8,12}$/.test(h)) { salah++; return; } if (seen[h]) { ganda++; return; } seen[h] = 1; if (r.optOut) { opt++; return; } valid++; if (r.statusWA === 'Terdaftar') wa++; });
    a.ringkas = { valid: valid, ganda: ganda, salah: salah, opt: opt, wa: wa };
    $('#bl-aud').innerHTML = '<div class="chips"><span class="pill ok">' + valid + ' nomor valid</span><span class="pill blue">' + wa + ' terdaftar WA</span><span class="pill warn">' + ganda + ' ganda (dibuang)</span><span class="pill bad">' + salah + ' tidak valid</span><span class="pill gray">' + opt + ' opt-out</span></div>';
  }
  A['bl.hitung'] = async function (el) {
    el.disabled = true;
    try {
      const manual = $('#bl-manual').value.trim(); const d = manual ? await API.call('wa.audience', { manual: manual }) : await API.call('wa.audience', { segmen: $('#bl-seg').value, kelas: $('#bl-kelas').value, statusWA: $('#bl-wa').value, tag: $('#bl-tag').value });
      K.audiens = { dari: 'filter', rows: d.rows }; ringkasAudiens(); pratinjauBlast();
      if (!d.rows.length) UI.toast('Belum ada kontak. Buka tab Kontak lalu klik Sinkron.', 'warn');
    } catch (e) { UI.err(e); } finally { el.disabled = false; }
  };
  A['bl.buat'] = async function (el) {
    const a = K.audiens; if (!a || !a.rows.length) return UI.toast('Hitung penerima terlebih dahulu.', 'warn');
    const judul = $('#bl-judul').value.trim(), pesan = $('#bl-pesan').value.trim(), hanya = $('#bl-hanya').checked;
    if (!judul || pesan.length < 5) return UI.toast('Isi judul dan pesan.', 'warn');
    const rows = a.rows.filter(function (r) { return !r.optOut && (!hanya || r.statusWA === 'Terdaftar'); }); if (!rows.length) return UI.toast('Tidak ada penerima yang memenuhi syarat.', 'warn');
    if (!(await UI.konfirmasi({ judul: 'Buat blast WhatsApp?', html: 'Pesan <b>“' + esc(judul) + '”</b> akan dikirim ke maksimal <b>' + rows.length + ' nomor</b>, ' + esc($('#bl-batch').value) + ' pesan per batch. Nomor ganda, tidak valid, dan opt-out otomatis dibuang.', ok: 'Buat & mulai' }))) return;
    el.disabled = true;
    try {
      const r = await API.call('wa.blastCreate', { judul: judul, pesan: pesan, ukuranBatch: Number($('#bl-batch').value), jeda: $('#bl-jeda').value, sasaran: a.dari === 'terpilih' ? 'Kontak terpilih' : 'Filter CRM', penerima: rows.map(function (x) { return { hp: x.hp, nama: x.nama, vars: x.vars }; }) });
      UI.ok('Blast dibuat untuk ' + r.total + ' nomor. Pengiriman berjalan bertahap otomatis tiap menit.'); $('#bl-judul').value = ''; $('#bl-pesan').value = ''; muatBlast();
    } catch (e) { UI.err(e); } finally { el.disabled = false; }
  };
  async function muatBlast() {
    const box = $('#bl-list'); if (!box) return;
    try {
      const d = await API.call('wa.blastList');
      box.innerHTML = d.length ? '<div class="tbl-wrap"><table class="t rt"><thead><tr><th>Blast</th><th>Progres</th><th>Status</th><th></th></tr></thead><tbody>' + d.map(function (b) {
        return '<tr><td data-l="Blast"><b>' + esc(b.judul) + '</b><span class="sub">' + UI.tglJam(b.tanggal) + ' · ' + esc(b.oleh) + ' · batch ' + b.batch + '</span></td><td data-l="Progres" style="min-width:180px"><div class="prog"><i style="width:' + b.persen + '%"></i></div><span class="sub">' + b.terkirim + ' terkirim · ' + b.gagal + ' gagal · ' + b.sisa + ' sisa dari ' + b.total + '</span></td><td data-l="Status"><span class="pill ' + (b.status === 'Selesai' ? 'ok' : b.status === 'Berjalan' ? 'blue' : 'gray') + '">' + esc(b.status) + '</span></td><td class="acts nolabel">' + (b.status === 'Berjalan' ? '<button class="btn btn-ob btn-sm" data-act="bl.proses" data-id="' + esc(b.id) + '">Proses batch</button><button class="btn btn-d btn-sm" data-act="bl.stop" data-id="' + esc(b.id) + '">Hentikan</button>' : '') + '</td></tr>';
      }).join('') + '</tbody></table></div>' : UI.kosong('send', 'Belum ada blast.');
    } catch (e) { box.innerHTML = App.errorBox(e); }
  }
  A['bl.muat'] = muatBlast;
  A['bl.proses'] = async function (el) { el.disabled = true; try { const r = await API.call('wa.blastProcess', { blastId: el.getAttribute('data-id') }, { timeout: 90000 }); UI.ok('Batch diproses: ' + (r.proses.terkirim || 0) + ' pesan terkirim.'); } catch (e) { UI.err(e); } muatBlast(); };
  A['bl.stop'] = async function (el) { if (!(await UI.konfirmasi({ judul: 'Hentikan blast?', pesan: 'Pesan yang belum terkirim akan dibatalkan.', bahaya: true, ok: 'Hentikan' }))) return; try { const r = await API.call('wa.blastStop', { blastId: el.getAttribute('data-id') }); UI.ok(r.dibatalkan + ' pesan dibatalkan.'); } catch (e) { UI.err(e); } muatBlast(); };

  /* ======================= ANTREAN ======================= */
  const Q = { status: '' };
  async function tabAntrean() {
    $('#kt-body').innerHTML = '<div class="card"><div class="filters"><select class="in" id="q-st"><option value="">Semua status</option><option>Antri</option><option>Terkirim</option><option>Gagal</option><option>Batal</option></select><button class="btn btn-o btn-sm" data-act="q.proses">' + ic('send') + 'Proses sekarang</button>' + (App.isAdmin() ? '<button class="btn btn-o btn-sm" data-act="q.ulang">' + ic('refresh') + 'Coba ulang yang gagal</button>' : '') + '<button class="btn btn-g btn-sm" data-act="q.muat">Muat ulang</button></div><div id="q-body" style="margin-top:14px">' + UI.skeleton(3) + '</div></div>';
    $('#q-st').value = Q.status; $('#q-st').addEventListener('change', function (e) { Q.status = e.target.value; muatAntrean(); }); muatAntrean();
  }
  async function muatAntrean() {
    const box = $('#q-body'); if (!box) return;
    try {
      const d = await API.call('notif.queue', { status: Q.status });
      box.innerHTML = '<div class="chips" style="margin-bottom:12px">' + Object.keys(d.ringkasan).map(function (k) { return '<span class="pill ' + (k === 'Terkirim' ? 'ok' : k === 'Gagal' ? 'bad' : k === 'Antri' ? 'warn' : 'gray') + '">' + k + ': ' + d.ringkasan[k] + '</span>'; }).join('') + '<span class="muted">(1.000 pesan terakhir)</span></div>'
        + (d.rows.length ? '<div class="tbl-wrap"><table class="t rt"><thead><tr><th>Waktu</th><th>Kanal</th><th>Tujuan</th><th>Pesan</th><th>Status</th></tr></thead><tbody>' + d.rows.map(function (r) { return '<tr><td data-l="Waktu" class="nowrap">' + UI.tglJam(r.dikirim || r.dibuat) + '</td><td data-l="Kanal"><span class="pill ' + (r.kanal === 'WA' ? 'ok' : 'purple') + '">' + esc(r.kanal) + '</span></td><td data-l="Tujuan" class="mono">' + esc(r.tujuan) + '<span class="sub">' + esc(r.nama) + '</span></td><td data-l="Pesan" style="max-width:300px">' + esc(r.pesan) + '<span class="sub">' + esc(r.event) + (r.blastId ? ' · ' + esc(r.blastId) : '') + '</span></td><td data-l="Status"><span class="pill ' + (r.status === 'Terkirim' ? 'ok' : r.status === 'Gagal' ? 'bad' : r.status === 'Antri' ? 'warn' : 'gray') + '">' + esc(r.status) + '</span>' + (r.respon && r.status !== 'Terkirim' ? '<span class="sub">' + esc(r.respon) + '</span>' : '') + '</td></tr>'; }).join('') + '</tbody></table></div>' : UI.kosong('send', 'Antrean kosong.'));
    } catch (e) { box.innerHTML = App.errorBox(e); }
  }
  A['q.muat'] = muatAntrean;
  A['q.proses'] = async function (el) { el.disabled = true; try { const r = await API.call('notif.processNow', {}, { timeout: 90000 }); UI.ok(r.terkirim !== undefined ? r.terkirim + ' pesan terkirim.' : (r.info || 'Selesai.')); } catch (e) { UI.err(e); } el.disabled = false; muatAntrean(); };
  A['q.ulang'] = async function () { try { const r = await API.call('notif.retry'); UI.ok(r.diulang + ' pesan dijadwalkan ulang.'); } catch (e) { UI.err(e); } muatAntrean(); };

  /* ======================= KONFIGURASI (ADMIN) ======================= */
  async function tabKonfig() {
    const body = $('#kt-body'); body.innerHTML = UI.skeleton(4);
    try {
      const c = await API.call('notif.config'); K.cfg = c;
      body.innerHTML = '<div class="grid g-main"><div class="stack"><div class="card"><div class="card-h"><h3>WhatsApp (Fonnte)</h3><span class="pill ' + (c.tokenAda ? 'ok' : 'warn') + ' right">' + (c.tokenAda ? 'Token tersimpan' : 'Token belum diisi') + '</span></div>'
        + '<div class="row" style="margin-bottom:14px"><label class="switch"><input type="checkbox" id="cf-wa" ' + (c.waAktif ? 'checked' : '') + '><i></i></label><b style="color:var(--text)">Aktifkan notifikasi WhatsApp</b></div>'
        + '<div class="field"><label>Token Fonnte</label><input class="in" id="cf-token" type="password" autocomplete="off" placeholder="' + (c.tokenAda ? 'Tersimpan: ' + esc(c.token) + ' — isi hanya untuk mengganti' : 'Tempel token perangkat Fonnte') + '"><span class="hint">Token disimpan aman di server (Script Properties), tidak pernah tampil di sheet atau browser.</span></div>'
        + '<div class="row"><button class="btn btn-o btn-sm" data-act="cf.device">' + ic('phone') + 'Cek perangkat</button><input class="in" id="cf-tes-wa" placeholder="Nomor tes 08…" style="width:170px"><button class="btn btn-o btn-sm" data-act="cf.teswa">Kirim tes WA</button>' + (c.tokenAda ? '<button class="btn btn-d btn-sm right" data-act="cf.hapusToken">Hapus token</button>' : '') + '</div><div id="cf-dev" style="margin-top:10px"></div></div>'
        + '<div class="card"><div class="card-h"><h3>Email</h3><span class="muted right">Sisa kuota harian: ' + (c.sisaKuotaEmail == null ? '-' : c.sisaKuotaEmail) + '</span></div><div class="row" style="margin-bottom:14px"><label class="switch"><input type="checkbox" id="cf-em" ' + (c.emailAktif ? 'checked' : '') + '><i></i></label><b style="color:var(--text)">Aktifkan notifikasi email</b></div><div class="form-g"><div class="field"><label>Nama pengirim</label><input class="in" id="cf-nama" value="' + esc(c.namaPengirim) + '"></div><div class="field"><label>Email tes</label><div class="row" style="flex-wrap:nowrap"><input class="in" id="cf-tes-em" placeholder="alamat@email.com"><button class="btn btn-o btn-sm" data-act="cf.tesem">Tes</button></div></div></div></div>'
        + '<div class="card"><div class="card-h"><h3>Pengiriman &amp; tautan</h3></div><div class="form-g"><div class="field"><label>Ukuran batch bawaan</label><select class="in" id="cf-batch">' + [10, 20, 50].map(function (n) { return '<option ' + (n === c.batchDefault ? 'selected' : '') + '>' + n + '</option>'; }).join('') + '</select></div><div class="field"><label>Jeda antarpesan (detik)</label><input class="in" id="cf-jeda" value="' + esc(c.jeda) + '"></div><div class="field full"><label>Alamat aplikasi (untuk {link} di pesan)</label><input class="in" id="cf-url" value="' + esc(c.appUrl) + '" placeholder="https://namaanda.github.io/buku-saku/"></div></div><label class="check"><input type="checkbox" id="cf-det" ' + (c.deteksiOtomatis ? 'checked' : '') + '>Deteksi otomatis nomor WA untuk kontak baru</label></div></div>'
        + '<div class="stack"><div class="card"><div class="card-h"><h3>Matriks notifikasi otomatis</h3></div><p class="muted" style="margin-bottom:10px">Pilih kanal untuk setiap kejadian. Penerima: wali murid atau guru pencatat sesuai kejadian.</p>' + c.matriks.map(function (m) { return '<div style="padding:12px 0;border-bottom:1px solid var(--border)"><b style="color:var(--text)">' + esc(m.label) + '</b><div class="row" style="margin-top:8px"><label class="check"><input type="checkbox" data-mx="' + esc(m.kode) + '" data-k="wa" ' + (m.wa ? 'checked' : '') + '>WhatsApp</label><label class="check"><input type="checkbox" data-mx="' + esc(m.kode) + '" data-k="email" ' + (m.email ? 'checked' : '') + '>Email</label><button class="btn btn-g btn-sm right" data-act="cf.templat" data-k="' + esc(m.kode) + '">' + ic('pencil') + 'Templat</button></div></div>'; }).join('')
        + '</div><div class="card"><div class="row"><span class="pill ' + (c.triggerAktif ? 'ok' : 'bad') + '">' + (c.triggerAktif ? 'Pengirim otomatis aktif (tiap 1 menit)' : 'Pengirim otomatis mati') + '</span></div><p class="muted" style="margin-top:8px">Notifikasi tidak dikirim langsung saat aksi — dimasukkan ke antrean lalu dikirim bertahap oleh pengirim otomatis.</p></div><button class="btn btn-p" style="min-height:46px" data-act="cf.simpan">' + ic('check') + 'Simpan Konfigurasi</button></div></div>';
    } catch (e) { body.innerHTML = App.errorBox(e); }
  }
  A['cf.device'] = async function (el) { el.disabled = true; try { const d = await API.call('wa.device'); $('#cf-dev').innerHTML = '<div class="alert ok">' + ic('checkc') + '<div>Perangkat <b>' + esc(d.perangkat) + '</b> — ' + esc(d.status) + ' · Paket ' + esc(d.paket) + (d.kuota !== '' ? ' · Kuota ' + esc(d.kuota) : '') + (d.kedaluwarsa ? ' · Berlaku s.d. ' + esc(d.kedaluwarsa) : '') + '</div></div>'; } catch (e) { $('#cf-dev').innerHTML = '<div class="alert bad">' + ic('alertc') + '<div>' + esc(e.message) + '</div></div>'; } el.disabled = false; };
  A['cf.teswa'] = async function () { try { await API.call('wa.test', { nomor: $('#cf-tes-wa').value }); UI.ok('Pesan tes terkirim.'); } catch (e) { UI.err(e); } };
  A['cf.tesem'] = async function () { try { await API.call('email.test', { email: $('#cf-tes-em').value }); UI.ok('Email tes terkirim.'); } catch (e) { UI.err(e); } };
  A['cf.hapusToken'] = async function () { if (await UI.konfirmasi({ judul: 'Hapus token Fonnte?', pesan: 'Notifikasi WhatsApp tidak akan berjalan sampai token diisi lagi.', bahaya: true, ok: 'Hapus' })) { try { await API.call('notif.configSave', { token: '__HAPUS__', waAktif: false }); UI.ok('Token dihapus.'); tabKonfig(); } catch (e) { UI.err(e); } } };
  A['cf.templat'] = function (el) {
    const m = K.cfg.matriks.filter(function (x) { return x.kode === el.getAttribute('data-k'); })[0];
    UI.modal({ judul: 'Templat — ' + m.label, ukuran: 'lg', isi: '<div class="field"><label>Subjek email</label><input class="in" id="tp-s" value="' + esc(m.subjek) + '"></div><div class="field"><label>Isi pesan</label><textarea class="in" id="tp-p" rows="9">' + esc(m.pesan) + '</textarea><span class="hint">Variabel: {nama} {namaMurid} {kelas} {pasal} {tanggal} {konsekuensi} {alasan} {link} {institusi}</span></div>',
      tombol: [{ label: 'Kembalikan bawaan', aksi: function (c) { $('#tp-s', c.el).value = m.subjekDefault; $('#tp-p', c.el).value = m.pesanDefault; return false; } }, { label: 'Pakai', kelas: 'btn-p', aksi: function (c) { m.subjek = $('#tp-s', c.el).value; m.pesan = $('#tp-p', c.el).value; UI.toast('Templat diperbarui. Klik Simpan Konfigurasi.', 'ok'); } }] });
  };
  A['cf.simpan'] = async function (el) {
    el.disabled = true;
    try {
      const matriks = {}; K.cfg.matriks.forEach(function (m) { matriks[m.kode] = { wa: $('[data-mx="' + m.kode + '"][data-k="wa"]').checked, email: $('[data-mx="' + m.kode + '"][data-k="email"]').checked, subjek: m.subjek, pesan: m.pesan }; });
      const token = $('#cf-token').value.trim();
      await API.call('notif.configSave', { waAktif: $('#cf-wa').checked, emailAktif: $('#cf-em').checked, token: token || undefined, namaPengirim: $('#cf-nama').value, batchDefault: Number($('#cf-batch').value), jeda: $('#cf-jeda').value, appUrl: $('#cf-url').value.trim(), deteksiOtomatis: $('#cf-det').checked, matriks: matriks });
      UI.ok('Konfigurasi tersimpan.'); tabKonfig();
    } catch (e) { UI.err(e); } finally { el.disabled = false; }
  };
  A['kt.noop'] = function () {};
})();
