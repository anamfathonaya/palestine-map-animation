# Deploy

Studio berjalan di **https://studio.komnaspalestina.org** sebagai situs statis di VPS.

| Path | Isi |
|---|---|
| `/` | Aplikasi (`app/`) |
| `/docs/` | Dokumentasi hasil `zensical build` |

## Pembaruan

Dari mesin yang punya akses SSH ke VPS:

```bash
ssh <user>@<vps> 'bash -s' < deploy/deploy.sh
```

Skrip ini menarik versi terbaru repo ke `~/palestine-map-animation`, membangun dokumentasi dengan `uvx zensical` ([uv](https://docs.astral.sh/uv/) dipasang otomatis di `~/.local/bin` tanpa root), lalu menyalin hasilnya ke `<webroot>`.

## Prasyarat satu kali

1. Buat situs statis di web server VPS untuk `studio.komnaspalestina.org`, dengan root folder `<webroot>`.
2. Pasang SSL (misalnya Let's Encrypt), dan Cloudflare SSL/TLS diatur ke **Full (strict)**.
3. Beri akun `<user>` akses tulis ke folder situs:
   `sudo chown -R <user>:<grup-web> <webroot> && sudo chmod -R 775 <webroot>`
