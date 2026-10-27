#!/usr/bin/env bash
# Headless browser check: serves the site, dumps the rendered DOM for every tab,
# and screenshots each tab at desktop and phone widths in light and dark.
# Usage: tools/check.sh [port] [--keep]
#   --keep leaves the server running and writes its PID to tools/out/server.pid
set -euo pipefail

cd "$(dirname "$0")/.."
PORT=8765
KEEP=0
for a in "$@"; do
  case "$a" in
    --keep) KEEP=1 ;;
    *) PORT="$a" ;;
  esac
done

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT=tools/out
mkdir -p "$OUT"
rm -f "$OUT"/dom-*.html "$OUT"/*.png

python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
cleanup() { if [ "$KEEP" -eq 0 ]; then kill "$SERVER" 2>/dev/null || true; fi; }
trap cleanup EXIT
sleep 1

BASE="http://127.0.0.1:$PORT"
COMMON=(--headless=new --disable-gpu --hide-scrollbars --no-first-run --no-default-browser-check --virtual-time-budget=4000)

for tab in about technical policy cv links; do
  "$CHROME" "${COMMON[@]}" --window-size=1280,900 --dump-dom "$BASE/#$tab" > "$OUT/dom-$tab.html" 2>/dev/null
  for theme in light dark; do
    "$CHROME" "${COMMON[@]}" --window-size=1280,900 --screenshot="$OUT/$tab-1280-$theme.png" "$BASE/?theme=$theme#$tab" >/dev/null 2>&1
    # Chrome clamps the window to 500px wide, so phone shots go through a 390px iframe.
    src=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "/?theme=$theme#$tab")
    "$CHROME" "${COMMON[@]}" --window-size=390,844 --screenshot="$OUT/$tab-390-$theme.png" "$BASE/tools/phone.html?src=$src" >/dev/null 2>&1
  done
done

if [ "$KEEP" -eq 1 ]; then
  echo "$SERVER" > "$OUT/server.pid"
  echo "server pid $SERVER on port $PORT (kill \$(cat $OUT/server.pid) to stop)"
fi
echo ok
