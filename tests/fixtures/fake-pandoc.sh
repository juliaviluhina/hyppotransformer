#!/bin/sh
# Deterministic test renderer: writes an intermediate HTML file after -o.
output=""
while [ "$#" -gt 0 ]; do
  if [ "$1" = "-o" ]; then output="$2"; shift 2; else shift; fi
done
printf '<html><body>fixture</body></html>\n' > "$output"
