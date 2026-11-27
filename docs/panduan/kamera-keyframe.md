# Kamera & keyframe

Animasi disusun dari **keyframe**. Setiap keyframe menyimpan posisi kamera dan apa yang tampil di layar. Di antara dua keyframe, kamera bergerak dengan interpolasi zoom yang halus (van Wijk).

## Isi satu keyframe

| Kolom | Arti |
|---|---|
| Nama | Label untuk diri sendiri, tidak tampil di video |
| Durasi | Lama perpindahan dari keyframe sebelumnya (detik) |
| Jeda | Lama kamera diam di keyframe ini (detik) |
| Easing | Kurva gerak: *inOut*, *in*, *out*, *linear* |
| Era | Era sejarah yang tampil, dengan crossfade dari era sebelumnya |
| Sorotan | Isian Palestina '48, redup di luar wilayah (spotlight), Gaza, garis TB & Gaza, kota, peta inset |

## Mengatur urutan

- **+ Tambah dari tampilan** menambah keyframe baru dari posisi kamera saat ini.
- **Simpan kamera ke terpilih** menimpa posisi kamera keyframe yang sedang aktif.
- **Naik / Turun / Hapus** mengatur urutan keyframe.

## Proyeksi

- **Mercator:** peta datar, cocok untuk skala negara dan wilayah.
- **Globe:** bola bumi ortografik, cocok untuk pembuka dari jauh.
- **Otomatis:** globe saat lebar bingkai lebih dari sekitar 2.200 km, lalu memudar ke Mercator saat masuk di bawah sekitar 1.300 km.

## Preset

Preset bisa disimpan sebagai `.json` (*Simpan preset*), disalin ke clipboard, lalu dibuka lagi (*Buka preset…*). Dengan cara ini tim bisa saling berbagi alur kamera yang sama.
