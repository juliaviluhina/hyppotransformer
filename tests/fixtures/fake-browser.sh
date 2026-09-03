#!/bin/sh
# Deterministic test browser: writes a minimal non-empty PDF to --print-to-pdf.
for arg in "$@"; do
  case "$arg" in
    --print-to-pdf=*) output="${arg#--print-to-pdf=}" ;;
  esac
done
printf '%%PDF-1.7\nfixture\n' > "$output"
