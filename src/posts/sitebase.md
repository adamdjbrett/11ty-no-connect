---
title: "MacOS siteBase and running on a usb with no server"
date: 2026-03-10
---

## USB `siteBase` option

You can optionally emit absolute `file://` links by setting `SITE_BASE` at build time.

Example for a USB volume named `no-connect` on macOS:

```bash
SITE_BASE="file:///Volumes/no-connect" npm run build
```

When `SITE_BASE` is set:

- CSS and internal page links are generated as absolute `file://...` URLs.
- RSS links are generated with the same base.

Notes:

- `SITE_BASE` should match the final mount path where files will be opened.
- Do not include a trailing slash; the build normalizes it, but keeping it clean avoids mistakes.
- If the USB name/path changes, rebuild with the new `SITE_BASE`.

## Quick publish flow to USB

1. Build the site: `npm run build` (or use `SITE_BASE=... npm run build`).
2. Copy `_site/*` to the USB root (or chosen folder).
3. Open `index.html` directly from the USB.
