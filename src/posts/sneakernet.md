---
title: "Linux Sneakernet"
description: "Build a static site on Linux and carry it on USB for offline use."
date: 2026-03-11
tags:
  - linux
  - sneakernet
  - offline
---

Sneakernet means moving files on physical media instead of over a network.  
For a static site, that makes deployment simple: build once, copy to a USB stick, and open `index.html` directly.

## Why this works

`11ty-no-connect` generates plain HTML, CSS, and RSS files.  
No database, no server, no internet connection required after build.

## Build on Linux

From your project directory:

```bash
npm install
npm run clean
npm run build
```

This creates `_site/`.

## USB-ready links with `SITE_BASE`
### no folders with spaces or capitals for this to work. name the usb stick one word.

If you want links to be explicit `file://` URLs for a mounted USB path, build with `SITE_BASE`.

Example for a USB mounted at `/media/$USER/NO_CONNECT`:

```bash
SITE_BASE="file:///media/$USER/NO_CONNECT" npm run build
```

Notes:

- Use the real mount path from your Linux machine.
- Do not add a trailing slash.
- If the mount path changes, rebuild with the new `SITE_BASE`.

If you skip `SITE_BASE`, the site uses relative links, which is usually the most portable option.

## Copy to USB

Format the USB as exFAT (best cross-platform choice), then copy the build output:

```bash
cp -a _site/. /media/$USER/NO_CONNECT/
sync
```

Now safely eject the USB.

## Open on any computer

On Linux, macOS, or Windows:

1. Insert the USB.
2. Open the drive.
3. Double-click `index.html`.

The site runs fully offline from the USB stick.

## Practical compatibility tips

- Keep filenames lowercase and simple.
- Avoid server-only features (API calls, dynamic auth, backend forms).
- Prefer local assets over remote CDNs for true offline behavior.

With that workflow, your site remains readable and portable even with no network available.
