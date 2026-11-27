# Ekspor

| Tombol | Hasil | Untuk |
|---|---|---|
| **PNG frame ini** | Gambar frame saat ini | Thumbnail, slide |
| **SVG frame ini** | Satu SVG berisi semua layer | Desain cetak |
| **SVG per layer untuk Canva (.zip)** | Satu SVG per layer (laut, daratan, batas, era, label, dll.) | Diedit dan dianimasikan di Canva |
| **Render video di browser** | MP4 H.264 (atau WebM) | Langsung masuk CapCut atau unggah |

Resolusi **Ganda (4K)** dan FPS 25/30/60 diatur di panel *Bingkai & proyeksi*. Opsi latar transparan dan teks SVG sebagai `<text>` ada di panel *Ekspor*.

## Supaya tidak pecah di CapCut

Video ini sudah merekam zoom-nya sendiri, jadi **jangan zoom lagi di CapCut**. Kalau memang perlu ruang untuk zoom di CapCut, ekspor di resolusi 4K lalu taruh di timeline 1080p. Ruang zoom-nya sampai 2×, dan gambar tetap tajam.

## Di Canva

1. Ekstrak ZIP. Setiap layer adalah file SVG terpisah dengan ukuran kanvas yang sama.
2. Unggah semua SVG, lalu tumpuk dengan posisi 0,0 dan ukuran penuh.
3. Animasikan per layer, misalnya era muncul setelah daratan dan label masuk terakhir.

## Render di PC (raea)

Render lewat [raea](https://raea.io) di PC tim sedang disiapkan. Rencananya, preset `.json` dari Studio akan dibaca untuk menghasilkan MP4 dengan GPU lokal.
