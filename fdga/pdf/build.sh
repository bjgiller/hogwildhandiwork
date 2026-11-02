#!/bin/sh
# Renders proposal.html to ../FDGA-Proposal.pdf with headless Chrome.
# Usage (Git Bash): sh fdga/pdf/build.sh [output.pdf]
cd "$(dirname "$0")" || exit 1
OUT="${1:-$(cd .. && pwd -W)/FDGA-Proposal.pdf}"
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --no-pdf-header-footer --print-to-pdf="$OUT" \
  "file:///$(pwd -W)/proposal.html"
