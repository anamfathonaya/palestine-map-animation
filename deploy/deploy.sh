#!/usr/bin/env bash
# Deploy Studio Peta Palestina '48 ke VPS.
# Jalankan di VPS, atau dari luar: ssh <user>@<vps> 'bash -s' < deploy/deploy.sh
set -euo pipefail
REPO_URL="${REPO_URL:-https://github.com/anamfathonaya/palestine-map-animation.git}"
SRC="${SRC:-$HOME/palestine-map-animation}"
WEBROOT="${WEBROOT:-<webroot>}"
export PATH="$HOME/.local/bin:$PATH"

if [ -d "$SRC/.git" ]; then git -C "$SRC" pull --ff-only; else git clone --depth 1 "$REPO_URL" "$SRC"; fi

# Bangun docs dengan uv (tidak butuh root / python3-venv).
command -v uvx >/dev/null || curl -LsSf https://astral.sh/uv/install.sh | sh
( cd "$SRC" && uvx zensical build --clean )

[ -w "$WEBROOT" ] || { echo "Folder $WEBROOT tidak bisa ditulis oleh $(whoami). Lihat docs/referensi/deploy.md." >&2; exit 1; }
# Salin aplikasi dan docs; file tersembunyi bawaan server di folder situs dibiarkan.
rsync -a --delete --exclude='.*' --exclude='docs/' --exclude='404.html' "$SRC/app/" "$WEBROOT/"
rsync -a --delete "$SRC/site/" "$WEBROOT/docs/"
echo "Selesai: $(git -C "$SRC" rev-parse --short HEAD) → $WEBROOT"
