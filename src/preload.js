const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ytdl', {
  // Window
  minimize: () => ipcRenderer.send('window-minimize'),
  close:    () => ipcRenderer.send('window-close'),

  // Config
  getConfig:      () => ipcRenderer.invoke('get-config'),
  saveEncoder:    (e) => ipcRenderer.invoke('save-encoder', e),
  saveCodec: (c) => ipcRenderer.invoke('save-codec', c),
  saveOutputDir:  (d) => ipcRenderer.invoke('save-output-dir', d),
  saveCookies:    (c) => ipcRenderer.invoke('save-cookies', c),
  saveLang:       (l) => ipcRenderer.invoke('save-lang', l),
  browseFolder:   () => ipcRenderer.invoke('browse-folder'),
  openFolder:     (d) => ipcRenderer.invoke('open-folder', d),

  // Dependency check
  checkDeps: () => ipcRenderer.invoke('check-deps'),
  openUrl:   (url) => ipcRenderer.invoke('open-url', url),

  // Actions
  updateYtdlp:   () => ipcRenderer.invoke('update-ytdlp'),
  startDownload: (opts) => ipcRenderer.invoke('start-download', opts),

  // Events
  onLog:      (cb) => ipcRenderer.on('download-log',      (_, d) => cb(d)),
  onProgress: (cb) => ipcRenderer.on('download-progress', (_, d) => cb(d)),
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('download-log');
    ipcRenderer.removeAllListeners('download-progress');
  },
});
