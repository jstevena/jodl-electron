// ── i18n Translations ──────────────────────────────────────────────────────
const translations = {
  en: {
    nav_download:       'Download',
    nav_settings:       'Settings',
    nav_update:         'Update yt-dlp',
    nav_open_folder:    'Open Folder',
    cookie_label:       'Cookie',

    dl_title:           'Download Video',
    dl_subtitle:        'Select quality, enter URL, then download.',
    dl_quality_label:   'Re-encode (For Editing Software Compatibility)',
    dl_original_label:  'Original (No Re-encode)',
    dl_url_label:       'URL (one per line)',
    dl_url_placeholder: 'https://youtube.com/watch?v=...\nhttps://youtube.com/watch?v=...',
    btn_download:       'Download',
    btn_clear_log:      'Clear Log',
    log_placeholder:    '// Terminal output will appear here...',

    set_title:              'Settings',
    set_subtitle:           'Configure encoder, output directory, and cookies.',
    set_encoder_label:      'Encoder',
    set_output_label:       'Output Directory',
    set_output_placeholder: 'D:\\Downloads\\YTDL',
    set_cookies_label:      'Cookies',
    set_cookies_placeholder:'Paste cookies.txt content here...\n\nLeave empty if not needed.',
    set_lang_label:         'Language / Bahasa',
    btn_browse:             'Browse',
    btn_save:               'Save',
    btn_save_cookies:       'Save Cookies',
    btn_clear:              'Clear',
    feedback_encoder:       '✓ Encoder saved',
    feedback_dir:           '✓ Directory saved',
    feedback_cookies:       '✓ Cookies saved',
    feedback_lang:          '✓ Language changed',

    log_start:        (count, quality, encoder) => `▶ Starting download — ${count} URL(s), Quality: ${quality}, Encoder: ${encoder}`,
    log_done_url:     (url) => `✓ Done: ${url}`,
    log_fail_url:     (url) => `✗ Failed: ${url}`,
    log_all_done:     '✓ All downloads completed!',
    log_some_failed:  '✗ Some downloads failed.',
    log_updating:     '↑ Updating yt-dlp...',
    log_updated:      '✓ yt-dlp is up to date.',
    log_update_check: '⚠ Update completed (check log).',
    warn_no_url:      '⚠ Enter at least one URL.',
    warn_no_quality:  '⚠ Please select a quality first.',

    dep_checking:     '⧗ Checking dependencies...',
    dep_ok:           '✓ All dependencies found.',
    dep_missing_title:'⚠ Missing dependencies:',
    dep_install_hint: 'Please install the missing dependencies before downloading.',
    dep_ytdlp:        'yt-dlp.exe — place in the bin/ folder next to the app',
    dep_ffmpeg:       'ffmpeg — download and add to system PATH',
    dep_node:         'node — download and add to system PATH',
    dep_dl_ytdlp:     '→ Download yt-dlp',
    dep_dl_ffmpeg:    '→ Download ffmpeg',
    dep_dl_node:      '→ Download Node.js',
  },
  id: {
    nav_download:       'Download',
    nav_settings:       'Pengaturan',
    nav_update:         'Perbarui yt-dlp',
    nav_open_folder:    'Buka Folder',
    cookie_label:       'Cookie',

    dl_title:           'Download Video',
    dl_subtitle:        'Pilih kualitas, masukkan URL, lalu unduh.',
    dl_quality_label:   'Re-encode (Untuk Kompatibilitas Software Editing)',
    dl_original_label:  'Original (Tanpa Re-encode)',
    dl_url_label:       'URL (satu per baris)',
    dl_url_placeholder: 'https://youtube.com/watch?v=...\nhttps://youtube.com/watch?v=...',
    btn_download:       'Download',
    btn_clear_log:      'Hapus Log',
    log_placeholder:    '// Output terminal akan muncul di sini...',

    set_title:              'Pengaturan',
    set_subtitle:           'Konfigurasi encoder, direktori output, dan cookies.',
    set_encoder_label:      'Encoder',
    set_output_label:       'Direktori Output',
    set_output_placeholder: 'D:\\Downloads\\YTDL',
    set_cookies_label:      'Cookies',
    set_cookies_placeholder:'Tempel konten cookies.txt di sini...\n\nBiarkan kosong jika tidak diperlukan.',
    set_lang_label:         'Language / Bahasa',
    btn_browse:             'Browse',
    btn_save:               'Simpan',
    btn_save_cookies:       'Simpan Cookies',
    btn_clear:              'Hapus',
    feedback_encoder:       '✓ Encoder disimpan',
    feedback_dir:           '✓ Direktori disimpan',
    feedback_cookies:       '✓ Cookies disimpan',
    feedback_lang:          '✓ Bahasa diubah',

    log_start:        (count, quality, encoder) => `▶ Memulai download — ${count} URL, Kualitas: ${quality}, Encoder: ${encoder}`,
    log_done_url:     (url) => `✓ Selesai: ${url}`,
    log_fail_url:     (url) => `✗ Gagal:   ${url}`,
    log_all_done:     '✓ Semua download selesai!',
    log_some_failed:  '✗ Beberapa download gagal.',
    log_updating:     '↑ Memperbarui yt-dlp...',
    log_updated:      '✓ yt-dlp sudah terbaru.',
    log_update_check: '⚠ Update selesai (cek log).',
    warn_no_url:      '⚠ Masukkan setidaknya satu URL.',
    warn_no_quality:  '⚠ Pilih kualitas terlebih dahulu.',

    dep_checking:     '⧗ Memeriksa dependensi...',
    dep_ok:           '✓ Semua dependensi ditemukan.',
    dep_missing_title:'⚠ Dependensi tidak ditemukan:',
    dep_install_hint: 'Install dependensi berikut sebelum mengunduh.',
    dep_ytdlp:        'yt-dlp.exe — letakkan di folder bin/ di samping app',
    dep_ffmpeg:       'ffmpeg — download dan tambahkan ke system PATH',
    dep_node:         'node — download dan tambahkan ke system PATH',
    dep_dl_ytdlp:     '→ Download yt-dlp',
    dep_dl_ffmpeg:    '→ Download ffmpeg',
    dep_dl_node:      '→ Download Node.js',
  }
};

// ── Language State ─────────────────────────────────────────────────────────
let currentLang = 'en';

function t(key, ...args) {
  const val = translations[currentLang][key];
  if (typeof val === 'function') return val(...args);
  return val || translations['en'][key] || key;
}

function applyLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = translations[lang][key];
    if (val && typeof val === 'string') el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = translations[lang][key];
    if (val) el.placeholder = val;
  });
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.lang === lang);
  });
}

// ── State ──────────────────────────────────────────────────────────────────
let config = { encoder: 'nvidia', outputDir: '', hasCookies: false, lang: 'en', codec: 'h265' };
let selectedQuality = '';
let selectedCodec = 'h265';
let downloading = false;

// ── Init ───────────────────────────────────────────────────────────────────
async function init() {
  config = await window.ytdl.getConfig();
  currentLang = config.lang || 'en';
  applyLanguage(currentLang);
  applyConfig();
  await runDepCheck();
}

function applyConfig() {
  const encoderLabels = { nvidia: 'NVIDIA', cpu: 'CPU', remux: 'Remux' };
  document.getElementById('sidebar-encoder').textContent = encoderLabels[config.encoder] || config.encoder;
  const badge = document.querySelector('.encoder-badge');
  badge.className = 'encoder-badge enc-' + config.encoder;

  selectedCodec = config.codec || 'h265';
  document.querySelectorAll('.codec-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.codec === selectedCodec);
  });

  document.querySelectorAll('.enc-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.enc === config.encoder);
  });

  document.getElementById('output-dir-input').value = config.outputDir;

  if (config.cookiesContent && config.cookiesContent !== 'paste cookie here') {
    document.getElementById('cookies-input').value = config.cookiesContent;
  }

  const cookieBadge = document.getElementById('sidebar-cookie-badge');
  cookieBadge.style.display = config.hasCookies ? 'flex' : 'none';

  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.lang === currentLang);
  });
}

// ── Dependency Check ───────────────────────────────────────────────────────
async function runDepCheck() {
  const logEl = document.getElementById('log-terminal');
  logEl.innerHTML = '';

  addLog(t('dep_checking'), 'dim');

  const deps = await window.ytdl.checkDeps();

  if (deps.missing.length === 0) {
    addLog(t('dep_ok'), 'ok');
    return;
  }

  addLog('', 'dim');
  addLog(t('dep_missing_title'), 'warn');
  addLog(t('dep_install_hint'), 'warn');
  addLog('─'.repeat(60), 'dim');

  if (!deps.hasYtdlp) {
    addLog('  • ' + t('dep_ytdlp'), 'err');
    addLogLink(t('dep_dl_ytdlp'), 'https://github.com/yt-dlp/yt-dlp/releases/latest');
  }
  if (!deps.hasFfmpeg) {
    addLog('  • ' + t('dep_ffmpeg'), 'err');
    addLogLink(t('dep_dl_ffmpeg'), 'https://github.com/BtbN/FFmpeg-Builds/releases');
  }
  if (!deps.hasNode) {
    addLog('  • ' + t('dep_node'), 'err');
    addLogLink(t('dep_dl_node'), 'https://nodejs.org/en/download');
  }
}

// ── Log helpers ────────────────────────────────────────────────────────────
const logEl = document.getElementById('log-terminal');

function addLog(text, cls = 'info') {
  const line = document.createElement('div');
  line.className = 'log-line ' + cls;
  line.textContent = text;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

function addLogLink(text, url) {
  const line = document.createElement('div');
  line.className = 'log-line log-link';
  line.textContent = '    ' + text;
  line.style.cursor = 'pointer';
  line.addEventListener('click', () => window.ytdl.openUrl(url));
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

function clearLog() {
  logEl.innerHTML = '';
}

document.getElementById('btn-clear-log').addEventListener('click', clearLog);

// ── Navigation ─────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-item[data-page]').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    item.classList.add('active');
    document.getElementById('page-' + item.dataset.page).classList.add('active');
  });
});

// ── Quality selection ──────────────────────────────────────────────────────
document.querySelectorAll('.q-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('codec-btn')) return;
    document.querySelectorAll('.q-btn:not(.codec-btn)').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedQuality = btn.dataset.q;
  });
});

document.querySelectorAll('.codec-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    document.querySelectorAll('.codec-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedCodec = btn.dataset.codec;
    await window.ytdl.saveCodec(selectedCodec); // add this line
  });
});

// ── Download ───────────────────────────────────────────────────────────────
document.getElementById('btn-download').addEventListener('click', async () => {
  if (downloading) return;
  const raw  = document.getElementById('url-list').value.trim();
  const urls = raw.split('\n').map(u => u.trim()).filter(Boolean);
  if (!urls.length)    { addLog(t('warn_no_url'),     'warn'); return; }
  if (!selectedQuality){ addLog(t('warn_no_quality'), 'warn'); return; }

  downloading = true;
  const btn = document.getElementById('btn-download');
  btn.disabled = true;

  clearLog();
  addLog(t('log_start', urls.length, displayQuality(selectedQuality), config.encoder), 'ok');
  addLog('─'.repeat(60), 'dim');

  const wrap = document.getElementById('progress-bar-wrap');
  const bar  = document.getElementById('progress-bar');
  wrap.classList.add('visible');
  bar.style.width = '0%';

  const total = urls.length;
  let done = 0;

  window.ytdl.removeAllListeners();

  window.ytdl.onLog(({ url, data }) => {
    data.split('\n').forEach(line => {
      if (!line.trim()) return;
      let cls = 'info';
      if (line.includes('ERROR') || line.includes('error')) cls = 'err';
      else if (line.includes('WARNING') || line.includes('warning')) cls = 'warn';
      else if (line.includes('[download]') || line.includes('100%')) cls = 'ok';
      addLog(line, cls);
    });
  });

  window.ytdl.onProgress(({ url, code }) => {
    done++;
    bar.style.width = Math.round((done / total) * 100) + '%';
    if (code === 0) addLog(t('log_done_url', url), 'ok');
    else            addLog(t('log_fail_url', url), 'err');
  });

  const result = await window.ytdl.startDownload({
    urls,
    type:       selectedQuality,
    encoder:    config.encoder,
    codec:      selectedCodec,
    outputDir:  config.outputDir,
    hasCookies: config.hasCookies,
  });

  addLog('─'.repeat(60), 'dim');
  addLog(result.success ? t('log_all_done') : t('log_some_failed'), result.success ? 'ok' : 'err');

  downloading = false;
  btn.disabled = false;
});

// ── Settings ───────────────────────────────────────────────────────────────
document.querySelectorAll('.enc-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const enc = btn.dataset.enc;
    await window.ytdl.saveEncoder(enc);
    config.encoder = enc;
    applyConfig();
    showFeedback('enc-save-feedback');
  });
});

document.getElementById('btn-browse').addEventListener('click', async () => {
  const dir = await window.ytdl.browseFolder();
  if (dir) document.getElementById('output-dir-input').value = dir;
});

document.getElementById('btn-save-dir').addEventListener('click', async () => {
  const dir = document.getElementById('output-dir-input').value.trim();
  if (!dir) return;
  await window.ytdl.saveOutputDir(dir);
  config.outputDir = dir;
  showFeedback('dir-save-feedback');
});

document.getElementById('btn-save-cookies').addEventListener('click', async () => {
  const content = document.getElementById('cookies-input').value.trim();
  await window.ytdl.saveCookies(content);
  config.hasCookies = !!content;
  applyConfig();
  showFeedback('cookie-save-feedback');
});

document.getElementById('btn-clear-cookies').addEventListener('click', async () => {
  await window.ytdl.saveCookies('');
  config.hasCookies    = false;
  config.cookiesContent = '';
  document.getElementById('cookies-input').value = '';
  applyConfig();
});

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const lang = btn.dataset.lang;
    await window.ytdl.saveLang(lang);
    config.lang = lang;
    applyLanguage(lang);
    showFeedback('lang-save-feedback');
  });
});

// ── Update yt-dlp ──────────────────────────────────────────────────────────
document.getElementById('nav-update').addEventListener('click', async () => {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelector('.nav-item[data-page="download"]').classList.add('active');
  document.getElementById('page-download').classList.add('active');

  clearLog();
  addLog(t('log_updating'), 'ok');

  const result = await window.ytdl.updateYtdlp();
  result.output.split('\n').forEach(l => { if (l.trim()) addLog(l); });
  addLog(result.code === 0 ? t('log_updated') : t('log_update_check'), result.code === 0 ? 'ok' : 'warn');
});

// ── Open folder ────────────────────────────────────────────────────────────
document.getElementById('nav-open-folder').addEventListener('click', () => {
  window.ytdl.openFolder(config.outputDir);
});

// ── Helpers ────────────────────────────────────────────────────────────────
function showFeedback(id) {
  const el = document.getElementById(id);
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2000);
}

function displayQuality(q) {
  const map = {
    '360p-o': '360p Original', '480p-o': '480p Original',
    '720p-o': '720p Original', '1080p-o': '1080p Original',
    '2k-o':   '2K Original',   '4k-o':    '4K Original',
  };
  return map[q] || q.toUpperCase();
}

// ── Boot ───────────────────────────────────────────────────────────────────
init();