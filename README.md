# JoDL - YouTube Downloader

A lightweight Electron-based YouTube downloader powered by [yt-dlp](https://github.com/yt-dlp/yt-dlp).  
Supports multiple video qualities, audio extraction, hardware-accelerated encoding, and cookie-based authentication.

---

## Versions

| | **JoDL** (Bundled) | **JoDL-Lite** |
|---|---|---|
| **Installer size** | Larger | Smaller |
| **ffmpeg** | Bundled inside the app | ❌ Must install manually |
| **Node.js** | Bundled inside the app | ❌ Must install manually |
| **yt-dlp** | Bundled inside the app | Bundled inside the app |
| **Best for** | Users who want a one-click install with no setup | Users who already have ffmpeg & Node.js installed |

> **Recommendation:** Use **JoDL** (Bundled) if you are unsure. Use **JoDL-Lite** only if you already have ffmpeg and Node.js on your system PATH.

---

## Dependencies

### JoDL (Bundled)
No additional setup required. Everything is included.

### JoDL-Lite
You must have the following installed and available on your system PATH:

| Dependency | Download |
|---|---|
| **ffmpeg** | [https://github.com/BtbN/FFmpeg-Builds/releases](https://github.com/BtbN/FFmpeg-Builds/releases) - download `ffmpeg-master-latest-win64-gpl.zip`, extract, and add the `bin/` folder to your system PATH |
| **Node.js** | [https://nodejs.org/en/download](https://nodejs.org/en/download) - download and run the installer, it will be added to PATH automatically |

To verify they are installed correctly, open Command Prompt and run:
```
ffmpeg -version
node --version
```
Both commands should return version information without errors.

---

## Features & Settings

### Encoder
Located in the **Settings** page. Controls how downloaded video is processed and encoded.

| Encoder | Description |
|---|---|
| **NVIDIA** | Uses NVIDIA GPU hardware acceleration (`hevc_nvenc`) for fast encoding. Recommended if you have an NVIDIA GPU. |
| **CPU** | Uses software encoding (`libx265`). Works on any machine but is slower and uses more CPU. |
| **REMUX** | No re-encoding. The video stream is remuxed directly into an MP4 container. Fastest option, preserves original quality. Use this if you want the file quickly without any quality loss. |

> **Note:** NVIDIA encoder requires an NVIDIA GPU. If you select NVIDIA on a machine without one, the download will fail during the encoding step.

---

### Output Directory
Located in the **Settings** page. This is the folder where all downloaded files will be saved.

- Click **Browse** to pick a folder using the file dialog.
- Or type the path manually and click **Save**.
- Downloaded files are saved as `<video title>.<ext>` inside this folder.
- A `cache/` subfolder will be created automatically by yt-dlp for temporary data.

---

### Cookies
Located in the **Settings** page. Some YouTube videos are age-restricted, members-only, or require a logged-in account to access. Providing your browser cookies allows yt-dlp to authenticate as you.

#### How to get your cookies

1. Install the **Get cookies.txt LOCALLY** extension for your browser:
   - Chrome: [https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc](https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)
   - Firefox: [https://addons.mozilla.org/en-US/firefox/addon/get-cookies-txt-locally/](https://addons.mozilla.org/en-US/firefox/addon/get-cookies-txt-locally/)

2. Open [https://www.youtube.com](https://www.youtube.com) and make sure you are **logged in**.

3. Click the extension icon and export cookies for `youtube.com`.

4. Open the exported `cookies.txt` file with a text editor, select all, and copy the full contents.

5. Paste the contents into the **Cookies** text area in JoDL's Settings page.

6. Click **Save Cookies**.

A 🍪 badge will appear in the sidebar confirming cookies are active.

> **Security note:** Your cookies are stored locally on your machine only and are never sent anywhere other than directly to YouTube via yt-dlp.

---

### Update yt-dlp
Located in the **sidebar**. yt-dlp is the backend engine that handles all downloading. YouTube frequently changes its internal structure, which can cause downloads to fail or produce errors - even if nothing is wrong with JoDL itself.

**If you experience:**
- Downloads failing with errors
- Videos downloading as audio only
- Unexpected format or codec issues
- Slow or broken progress

**→ Click "Update yt-dlp"** to fetch the latest version of the backend engine. This usually fixes compatibility issues within seconds.

> It is good practice to update yt-dlp periodically even when things are working fine.

---

## Quality Options

### Original
Downloads the best available stream up to the selected resolution without any re-encoding. The video and audio streams are merged directly. Faster than re-encode and preserves original quality, but the output codec depends on what YouTube provides.

`360p` `480p` `720p` `1080p` `2K` `4K`

### Audio Only
Extracts audio from the video and saves it as an audio file.

`MP3` `WAV`

### Re-encode
Downloads the best available stream up to the selected resolution and re-encodes it using the selected encoder.


`360p` `480p` `720p` `1080p` `2K` `4K`

---

## Multiple URLs
You can paste multiple YouTube URLs in the URL box, **one per line**. JoDL will download them sequentially and show progress for each.

---

## Credits

Built with [Electron](https://www.electronjs.org/) and powered by [yt-dlp](https://github.com/yt-dlp/yt-dlp).  
Developed by **Johanes Steven**.