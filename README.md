# Personal Travel Log

PWA sederhana untuk mencatat perjalanan berdasarkan:

- Barcode
- Timestamp server Asia/Jakarta
- Latitude
- Longitude
- GPS accuracy

## Struktur

```text
personal-travel-log/
├── index.html
├── style.css
├── app.js
├── manifest.json
├── service-worker.js
└── google-apps-script/
    └── Code.gs
```

## Deploy ke GitHub Pages

Upload file berikut ke root repository GitHub:

- index.html
- style.css
- app.js
- manifest.json
- service-worker.js

Folder `google-apps-script` hanya berisi backend Apps Script dan tidak dijalankan oleh GitHub Pages.

Aktifkan:

Settings > Pages > Deploy from a branch > main > / (root)

## Google Apps Script

Gunakan isi `google-apps-script/Code.gs` pada project Apps Script yang terhubung dengan Google Sheet.

Sheet harus bernama:

`Log`

Header:

`ID | Timestamp | Barcode | Latitude | Longitude | Accuracy`

Web App:

- Execute as: Me
- Who has access: Anyone

API URL sudah dimasukkan ke `app.js`.

## Penggunaan

Buka URL GitHub Pages melalui HTTPS di Android.

1. Tekan SCAN BARCODE.
2. Izinkan kamera.
3. Scan barcode.
4. Izinkan lokasi jika diminta.
5. GPS diambil otomatis.
6. Tekan SIMPAN LOG.
7. Data masuk ke Google Sheets.
