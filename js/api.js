/* Klien REST untuk backend Google Apps Script.
   - Data publik (tata tertib, pengumuman, kalender) memakai GET + cache localStorage
     sehingga terbuka instan dan tetap terbaca saat offline.
   - Aksi lain memakai POST text/plain (tanpa preflight CORS) dengan token sesi. */
(function () {
  const CFG = window.APP_CONFIG || {};
  const TOKEN_KEY = 'bs_token';
  const API = { token: sessionStorage.getItem(TOKEN_KEY) || '', onAuthLost: null, pending: {} };

  CFG.GAS_URL = String(CFG.GAS_URL || '').trim();
  // Terima alamat biasa (…/macros/s/ID/exec) dan alamat akun Google Workspace (…/a/macros/DOMAIN/s/ID/exec)
  API.siap = function () { return /^https:\/\/script\.google\.com\/[^\s?#]*\/s\/[^/\s]+\/exec\/?$/.test(CFG.GAS_URL); };
  /** Penyebab alamat belum dipakai, untuk pesan yang jelas di layar. */
  API.alasan = function () {
    const u = CFG.GAS_URL;
    if (!window.APP_CONFIG) return 'tidak-terbaca';
    if (!u || /GANTI_DENGAN/.test(u)) return 'contoh';
    if (!/^https:\/\//.test(u)) return 'bukan-https';
    if (/\/dev\/?$/.test(u)) return 'dev';
    if (!/\/exec\/?$/.test(u)) return 'bukan-exec';
    return 'format';
  };
  API.setToken = function (t) { API.token = t || ''; if (t) sessionStorage.setItem(TOKEN_KEY, t); else sessionStorage.removeItem(TOKEN_KEY); };

  function galat(pesan, kode) { const e = new Error(pesan); e.code = kode || ''; return e; }
  async function ambil(url, opsi, ms) {
    const ctl = new AbortController(), timer = setTimeout(function () { ctl.abort(); }, ms || 45000);
    try { opsi.signal = ctl.signal; return await fetch(url, opsi); }
    catch (e) { throw galat(e.name === 'AbortError' ? 'Server terlalu lama merespons. Coba lagi.' : 'Tidak dapat terhubung ke server. Periksa koneksi internet.', 'NET'); }
    finally { clearTimeout(timer); }
  }
  async function urai(res) {
    let j; try { j = await res.json(); } catch (e) { throw galat('Respons server tidak dikenali. Pastikan URL /exec benar dan Web App di-deploy untuk "Anyone".', 'FORMAT'); }
    return j;
  }
  function tangani(j) {
    if (j && j.success) return j.data;
    if (j && j.code === 'AUTH') { API.setToken(''); if (API.onAuthLost) API.onAuthLost(j.message); }
    throw galat((j && j.message) || 'Terjadi kesalahan.', j && j.code);
  }

  /** Aksi dengan token (POST). Permintaan baca identik yang sedang berjalan digabung. */
  API.call = function (action, data, opsi) {
    opsi = opsi || {};
    const key = opsi.dedupe ? action + '|' + JSON.stringify(data || {}) : '';
    if (key && API.pending[key]) return API.pending[key];
    const p = (async function () {
      const res = await ambil(CFG.GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: action, token: API.token, data: data || {} }), redirect: 'follow' }, opsi.timeout);
      return tangani(await urai(res));
    })();
    if (key) { API.pending[key] = p; const bersih = function () { delete API.pending[key]; }; p.then(bersih, bersih); }
    return p;
  };

  /** Data publik: GET. Gagal jaringan -> otomatis coba sekali lagi. */
  API.pubFetch = async function (action) {
    const url = CFG.GAS_URL + (CFG.GAS_URL.indexOf('?') > -1 ? '&' : '?') + 'action=' + encodeURIComponent(action);
    let res; try { res = await ambil(url, { method: 'GET', redirect: 'follow' }, 30000); } catch (e) { res = await ambil(url, { method: 'GET', redirect: 'follow' }, 30000); }
    const data = tangani(await urai(res));
    try { localStorage.setItem('bs_pub_' + action, JSON.stringify({ t: Date.now(), d: data })); } catch (e) { /* penyimpanan penuh */ }
    return data;
  };
  API.cached = function (action) { try { const o = JSON.parse(localStorage.getItem('bs_pub_' + action)); return o ? o.d : null; } catch (e) { return null; } };
  /** stale-while-revalidate: onData dipanggil dengan cache (jika ada), lalu dengan data segar bila berbeda. */
  API.swr = async function (action, onData) {
    const lama = API.cached(action); let tampil = lama;
    if (lama !== null) onData(lama, true);
    try {
      const baru = await API.pubFetch(action);
      if (JSON.stringify(baru) !== JSON.stringify(tampil)) onData(baru, false);
      return baru;
    } catch (e) {
      if (lama !== null) return lama;                           // offline: pakai cache
      throw e;
    }
  };
  window.API = API;
})();
