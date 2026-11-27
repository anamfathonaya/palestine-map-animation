# Sumber data

Isi halaman ini sama dengan [NOTICE.md](https://github.com/anamfathonaya/palestine-map-animation/blob/main/NOTICE.md) di repo.

| Lapisan | Sumber | Ketentuan |
|---|---|---|
| Negara, pantai, danau, sungai, kota | Natural Earth 1:10m & 1:50m (sudut pandang PSE) | Domain publik |
| Batas Tepi Barat & Gaza, Oslo II | Batas administratif Palestina (OCHA, lewat HDX) & data Oslo II | Ikuti lisensi aslinya (umumnya CC BY-IGO), wajib atribusi |
| Partisi PBB 1947 | Didigitasi dari peta PBB Resolusi 181 | Perkiraan |
| Sykes-Picot 1916 | Digambar ulang secara skematis dari peta perjanjian 1916 | Perkiraan |
| Gaza "Garis Kuning" Okt 2026 | Grafik Al Jazeera, didigitasi | CC BY-NC-SA 4.0 |

## Membangun ulang data

Skrip ada di `tools/data/`. File mentahnya tidak ikut di repo karena ukurannya sekitar 100 MB.

1. Unduh GeoJSON Natural Earth 10m/50m (countries + versi PSE, admin-1, disputed areas, lakes, rivers, populated places), lalu taruh di `tools/data/input/`.
2. Taruh juga `pse_admin1.geojson` (OCHA) dan shapefile Oslo II di `input/oslo/`.
3. Jalankan:

```bash
cd tools/data
pip install shapely pyshp
npm install
python3 prep.py         # build/*.json
python3 sp_vec.py       # build/sp1916.json
node topo.mjs 3e-6 1e-3 # build/reg.topo.json, world.topo.json
cp build/reg.topo.json ../../app/data/reg.json
cp build/world.topo.json ../../app/data/world.json
```

Layer Partisi 1947 (`un1947.json`) dan Garis Kuning 2026 (`gaza2026.json`) dibuat lewat georeferensi raster (titik ikat dan ICP garis pantai), jadi tidak ada skrip otomatisnya. Kedua layer itu sudah tersimpan di `app/data/reg.json`.
