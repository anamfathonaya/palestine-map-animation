# Studio Peta Palestina '48

Alat peta di browser untuk membuat framing dan animasi peta video sejarah Palestina. Dibuat untuk Tim Humas & Media Komnas Palestina.

- **Situs:** https://studio.komnaspalestina.org
- **Panduan:** https://studio.komnaspalestina.org/docs/

"Palestina '48" di sini berarti seluruh wilayah Mandat Inggris atas Palestina. Wilayah yang dikuasai sejak 1948 dilabeli sebagai bagian dari Palestina '48, bukan dipisah sebagai negara lain. Golan ditandai sebagai wilayah Suriah.

## Fitur

- Proyeksi **Mercator** atau **globe** (zoom ala Google Earth), atau **otomatis** (globe ke datar).
- Bingkai **16:9, 9:16, 4:3, 1:1, 4:5**, dengan pratinjau safe zone Reels/TikTok.
- Kamera berbasis keyframe: durasi, jeda, easing, sorotan, dan era per keyframe.
- Era sejarah yang bisa dinyalakan atau dimatikan:

  | Era | Isi |
  |---|---|
  | 1916 | Sykes-Picot (zona A, B, Biru, Merah, Internasional, Rusia, Italia 1917) |
  | 1920–23 | Mandat Inggris & Prancis |
  | 1947 | Rencana Partisi PBB (Resolusi 181) |
  | 1948 | Nakba |
  | 1949–67 | Garis gencatan senjata |
  | 1967 | Pendudukan |
  | 1995 | Oslo II: Area A/B/C |
  | Okt 2026 | Gaza: "Garis Kuning" |

- Label bahasa Indonesia dengan nama Arab di bawahnya (opsional). Jumlah label menyesuaikan tingkat zoom supaya tidak bertumpuk.
- Tema Wikipedia terang, Wikimedia abu-abu, dan gelap. Setiap warna bisa diubah.
- Ekspor:
  - **PNG** per frame
  - **SVG** per frame
  - **ZIP berisi SVG per layer** untuk diedit di Canva
  - **video MP4/WebM** langsung dari browser
  - **preset .json**

## Menjalankan secara lokal

Aplikasinya statis, tanpa proses build:

```bash
cd app
python3 -m http.server 8000
# buka http://localhost:8000
```

Pustaka (d3, topojson-client, JSZip, mp4-muxer, webm-muxer) dimuat dari CDN cdnjs dan jsDelivr.

## Struktur repo

```
app/            Aplikasi web (index.html, app.js, data/*.json TopoJSON)
docs/           Sumber dokumentasi (Zensical)
zensical.toml   Konfigurasi situs dokumentasi
tools/data/     Skrip pembangun data peta (Python + Node)
deploy/         Skrip deploy ke VPS
```

## Dokumentasi

```bash
pip install zensical
zensical serve      # pratinjau di http://localhost:8000
zensical build      # hasil di site/
```

## Deploy

Lihat [`deploy/deploy.sh`](deploy/deploy.sh) dan halaman [Deploy](docs/referensi/deploy.md) di dokumentasi.

## Lisensi

Kode di repo ini memakai lisensi **[PolyForm Noncommercial 1.0.0](LICENSE.md)**. Kode boleh dipakai, diubah, dan dibagikan untuk tujuan nonkomersial. Penggunaan komersial butuh izin tertulis.

Required Notice: Copyright (c) 2026 Anam Fathonaya (https://github.com/anamfathonaya/palestine-map-animation)

Data peta punya lisensi masing-masing, misalnya data "Garis Kuning" Gaza dari Al Jazeera yang berlisensi CC BY-NC-SA 4.0. Rinciannya ada di [NOTICE.md](NOTICE.md).
