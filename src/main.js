const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const os = require('os');

let mainWindow;

// ── Paths ──────────────────────────────────────────────────────────────────
const appDir = app.isPackaged
  ? path.dirname(process.execPath)
  : path.join(__dirname, '..');

const configDir = path.join(app.getPath('userData'), 'config');
if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

const encoderFile = path.join(configDir, 'encoder.txt');
const lokasiFile  = path.join(configDir, 'lokasi.txt');
const cookiesFile = path.join(configDir, 'cookies.txt');
const langFile    = path.join(configDir, 'lang.txt');
const codecFile   = path.join(configDir, 'codec.txt');

// Cache for resolved binary paths (populated by checkDependencies)
let resolvedBins = { ytdlp: null, ffmpeg: null, node: null };

// ── Defaults ───────────────────────────────────────────────────────────────
function readFile(p, fallback = '') {
  try { return fs.readFileSync(p, 'utf-8').trim(); } catch { return fallback; }
}
function writeFile(p, content) {
  fs.writeFileSync(p, content, 'utf-8');
}

// ── Dependency check ───────────────────────────────────────────────────────
function checkWhich(cmd) {
  return new Promise((resolve) => {
    const check = spawn(process.platform === 'win32' ? 'where' : 'which', [cmd], { shell: true });
    check.on('close', code => resolve(code === 0));
  });
}

/**
 * Resolve a binary path:
 *  1. System PATH (preferred)
 *  2. Bundled path inside appDir (fallback)
 * Returns { resolved: string|null, source: 'system'|'bundled'|'missing' }
 */
async function resolveBin(systemCmd, bundledRelPath) {
  const onSystem = await checkWhich(systemCmd);
  if (onSystem) return { resolved: systemCmd, source: 'system' };

  const bundled = path.join(appDir, bundledRelPath);
  if (fs.existsSync(bundled)) return { resolved: bundled, source: 'bundled' };

  return { resolved: null, source: 'missing' };
}

async function checkDependencies() {
  // yt-dlp: bundled first, then system
  const ytdlpBundled = path.join(appDir, 'bin', 'yt-dlp.exe');
  let ytdlpResolved, hasYtdlp;
  if (fs.existsSync(ytdlpBundled)) {
    ytdlpResolved = ytdlpBundled;
    hasYtdlp = true;
  } else {
    const sys = await checkWhich('yt-dlp');
    ytdlpResolved = sys ? 'yt-dlp' : null;
    hasYtdlp = sys;
  }

  // ffmpeg: bundled first (app ships it in bundled build), then system fallback
  const ffmpegBundled = path.join(appDir, 'ffmpeg', 'bin', 'ffmpeg.exe');
  let ffmpegResolved, hasFfmpeg, ffmpegSource;
  if (fs.existsSync(ffmpegBundled)) {
    ffmpegResolved = ffmpegBundled;
    hasFfmpeg      = true;
    ffmpegSource   = 'bundled';
  } else {
    const sys = await checkWhich('ffmpeg');
    ffmpegResolved = null;
    hasFfmpeg      = sys;
    ffmpegSource   = sys ? 'system' : 'missing';
  }

  // node: bundled first, system fallback
  const nodeBundled = path.join(appDir, 'node', 'node.exe');
  let nodeResolved, hasNode, nodeSource;
  if (fs.existsSync(nodeBundled)) {
    nodeResolved = nodeBundled;
    hasNode      = true;
    nodeSource   = 'bundled';
  } else {
    const sys = await checkWhich('node');
    nodeResolved = sys ? 'node' : null;
    hasNode      = !!sys;
    nodeSource   = sys ? 'system' : 'missing';
  }

  // Cache resolved paths for use in download/update
  resolvedBins.ytdlp  = ytdlpResolved;
  resolvedBins.ffmpeg = ffmpegResolved;
  resolvedBins.node   = nodeResolved;

  const missing = [];
  if (!hasYtdlp)  missing.push('yt-dlp');
  if (!hasFfmpeg) missing.push('ffmpeg');
  if (!hasNode)   missing.push('node');

  return {
    hasYtdlp,
    hasFfmpeg,
    hasNode,
    ffmpegSource,
    nodeSource,
    missing,
  };
}

// ── Window ─────────────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 860,
    height: 660,
    minWidth: 860,
    minHeight: 660,
    maxWidth: 860,
    maxHeight: 660,
    resizable: false,
    maximizable: false,
    frame: true,
    transparent: false,
    backgroundColor: '#0d0d0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// ── IPC: Window controls ───────────────────────────────────────────────────
ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-close',    () => mainWindow.close());

// ── IPC: Config read/write ─────────────────────────────────────────────────
ipcMain.handle('get-config', () => {
  return {
    encoder:        readFile(encoderFile, 'cpu'),
    codec: readFile(codecFile, 'h265'),
    outputDir:      readFile(lokasiFile,  path.join(os.homedir(), 'Downloads', 'YTDL')),
    hasCookies:     fs.existsSync(cookiesFile) && readFile(cookiesFile) !== 'paste cookie here' && readFile(cookiesFile) !== '',
    cookiesContent: readFile(cookiesFile, ''),
    lang:           readFile(langFile, 'en'),
  };
});

ipcMain.handle('save-encoder',    (_, encoder)  => { writeFile(encoderFile, encoder); return true; });
ipcMain.handle('save-codec', (_, codec) => { writeFile(codecFile, codec); return true; });
ipcMain.handle('save-output-dir', (_, dir)      => { writeFile(lokasiFile, dir);      return true; });
ipcMain.handle('save-cookies',    (_, content)  => { writeFile(cookiesFile, content); return true; });
ipcMain.handle('save-lang',       (_, lang)     => { writeFile(langFile, lang);       return true; });

ipcMain.handle('browse-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('open-folder', (_, dir) => shell.openPath(dir));

// ── IPC: Dependency check ──────────────────────────────────────────────────
ipcMain.handle('check-deps', async () => {
  return await checkDependencies();
});

ipcMain.handle('open-url', (_, url) => shell.openExternal(url));

// ── IPC: yt-dlp update ─────────────────────────────────────────────────────
ipcMain.handle('update-ytdlp', () => {
  return new Promise((resolve) => {
    const ytdlp = getYtdlpPath();
    const proc  = spawn(ytdlp, ['-U'], { shell: true });
    let out = '';
    proc.stdout.on('data', d => out += d.toString());
    proc.stderr.on('data', d => out += d.toString());
    proc.on('close', code => resolve({ code, output: out }));
  });
});

// ── Helpers ────────────────────────────────────────────────────────────────
function getYtdlpPath() {
  // use cached resolved path if available (set by checkDependencies)
  if (resolvedBins.ytdlp) return resolvedBins.ytdlp;
  // fallback: bundled first, then system
  const bundled = path.join(appDir, 'bin', 'yt-dlp.exe');
  return fs.existsSync(bundled) ? bundled : 'yt-dlp';
}

function getFfmpegPath() {
  if (resolvedBins.ffmpeg) return resolvedBins.ffmpeg;
  const bundled = path.join(appDir, 'ffmpeg', 'bin', 'ffmpeg.exe');
  if (fs.existsSync(bundled)) return bundled;
  return null; // no bundled ffmpeg, let yt-dlp find it via PATH
}

function getNodePath() {
  if (resolvedBins.node) return resolvedBins.node;
  const bundled = path.join(appDir, 'node', 'node.exe');
  if (fs.existsSync(bundled)) return bundled;
  return null; // let yt-dlp find node itself if not resolved
}

function buildArgs({ type, encoder, codec, outputDir, hasCookies }) {
  const t = type.toLowerCase();
  const output   = path.join(outputDir, '%(title)s.%(ext)s');
  const cacheDir = path.join(outputDir, 'cache');

  const ffmpegPath = getFfmpegPath();
  const nodePath   = getNodePath();
  const baseArgs = [
    ...(nodePath   ? ['--js-runtimes', `node:${nodePath}`] : []),
    ...(ffmpegPath ? ['--ffmpeg-location', ffmpegPath] : []),
    '--output', output,
    '--cache-dir', cacheDir,
  ];

  const audioFormats = { mp3: 'mp3', wav: 'wav' };
  const heights      = { '360p': 360, '480p': 480, '720p': 720, '1080p': 1080, '1440p': 1440, '2160p': 2160 };
  const origResMap   = { '360p-o': 360, '480p-o': 480, '720p-o': 720, '1080p-o': 1080, '1440p-o': 1440, '2160p-o': 2160 };

  let modeArgs = [];

  if (audioFormats[t]) {
    modeArgs = ['-x', '--audio-format', audioFormats[t]];

  } else if (heights[t] !== undefined) {
    const h = heights[t];
    if (encoder === 'remux') {
      modeArgs = [
        '-f', `bestvideo[height<=${h}]+bestaudio/best[height<=${h}]/best`,
        '--remux-video', 'mp4',
      ];
    } else {
    const videoCodec = codec === 'h264'
      ? (encoder === 'nvidia' ? 'h264_nvenc' : 'libx264')
      : (encoder === 'nvidia' ? 'hevc_nvenc' : 'libx265');
      const qp = h >= 2160 ? 18 : h >= 1080 ? 20 : 22;
      modeArgs = [
        '-f', `bestvideo[height<=${h}]+bestaudio/best[height<=${h}]/best`,
        '--merge-output-format', 'mp4',
        '--postprocessor-args', `ffmpeg:-c:v ${videoCodec} -qp ${qp} -c:a aac -b:a 320k`,
      ];
    }

  } else if (origResMap[t] !== undefined) {
    const h = origResMap[t];
    modeArgs = ['-f', `bestvideo[height<=${h}]+bestaudio/best[height<=${h}]`];

  } else {
    return null;
  }

  const cookieArgs = hasCookies ? ['--cookies', cookiesFile] : [];
  return [...baseArgs, ...modeArgs, ...cookieArgs];
}

// ── IPC: Download ──────────────────────────────────────────────────────────
ipcMain.handle('start-download', (event, { urls, type, encoder, codec, outputDir, hasCookies }) => {
  return new Promise((resolve) => {
    const args = buildArgs({ type, encoder, codec, outputDir, hasCookies });
    if (!args) { resolve({ success: false, message: 'Invalid download type.' }); return; }

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const ytdlp = getYtdlpPath();

    // build a PATH that includes bundled ffmpeg/node dirs as last resort
    const extraPaths = [
      path.join(appDir, 'ffmpeg', 'bin'),
      path.join(appDir, 'node'),
      path.join(appDir, 'bin'),
    ].filter(p => fs.existsSync(p));
    const pathSep = process.platform === 'win32' ? ';' : ':';
    const env = {
      ...process.env,
      PATH: [...extraPaths, process.env.PATH].join(pathSep),
    };

    let idx = 0;
    const results = [];

    function downloadNext() {
      if (idx >= urls.length) {
        resolve({ success: results.every(r => r.code === 0), results });
        return;
      }
      const url  = urls[idx++];
      const proc = spawn(ytdlp, [...args, url], { env, shell: false });

      proc.stdout.on('data', d => event.sender.send('download-log',      { url, data: d.toString() }));
      proc.stderr.on('data', d => event.sender.send('download-log',      { url, data: d.toString() }));
      proc.on('close', code => {
        results.push({ url, code });
        event.sender.send('download-progress', { url, code, remaining: urls.length - idx });
        downloadNext();
      });
    }

    downloadNext();
  });
});