#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: md2docx.sh INPUT.md [OUTPUT.docx]

Converts a Markdown file to DOCX via pandoc. If OUTPUT.docx is omitted,
the DOCX file is written next to the input using the same basename.
By default, the DOCX uses Arial as the main font.
EOF
}

if [[ $# -lt 1 || $# -gt 2 ]]; then
  usage
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCAL_PANDOC="$ROOT_DIR/.pandoc_local/bin/pandoc"
DEFAULT_EXTERNAL_PANDOC="/mnt/c/BI core XP/.pandoc_local/bin/pandoc"
DOCX_MAINFONT="${DOCX_MAINFONT:-Arial}"
REFERENCE_DOC="$ROOT_DIR/scripts/pandoc/reference-arial.docx"

if [[ -n "${PANDOC_BIN:-}" && -x "${PANDOC_BIN}" ]]; then
  PANDOC_BIN="${PANDOC_BIN}"
elif command -v pandoc >/dev/null 2>&1; then
  PANDOC_BIN="pandoc"
elif [[ -x "$LOCAL_PANDOC" ]]; then
  PANDOC_BIN="$LOCAL_PANDOC"
elif [[ -x "$DEFAULT_EXTERNAL_PANDOC" ]]; then
  PANDOC_BIN="$DEFAULT_EXTERNAL_PANDOC"
else
  echo "pandoc is required but not found in PATH, .pandoc_local/bin, or PANDOC_BIN." >&2
  exit 1
fi

input=$1
if [[ ! -f "$input" ]]; then
  echo "Input file '$input' not found." >&2
  exit 1
fi

if [[ $# -eq 2 ]]; then
  output=$2
else
  base=${input%.*}
  output="${base}.docx"
fi

mkdir -p "$(dirname "$output")"

pandoc_args=(
  --from=gfm
  --to=docx
  --variable "mainfont=$DOCX_MAINFONT"
  --resource-path="$(dirname "$input"):$ROOT_DIR"
  --output="$output"
)

if [[ -f "$REFERENCE_DOC" ]]; then
  pandoc_args+=(--reference-doc="$REFERENCE_DOC")
fi

"$PANDOC_BIN" "$input" "${pandoc_args[@]}"

echo "Converted '$input' -> '$output'"
