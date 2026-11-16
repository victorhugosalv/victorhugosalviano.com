#!/usr/bin/env bash
# Roda o Lighthouse CI (tests/lighthouserc.json) com o Chromium do Playwright.
# No WSL, o chrome-launcher cria perfis temporários com caminho do Windows dentro desta
# pasta ("C:\Users\...\lighthouse.XXXX"); eles são apagados no fim.
set -u
CHROME_PATH="${CHROME_PATH:-$(node -e 'console.log(require("@playwright/test").chromium.executablePath())')}"
export CHROME_PATH
npx lhci autorun --config=tests/lighthouserc.json
status=$?
rm -rf ./C:\\Users\\*\\AppData\\Local\\lighthouse.*
exit $status
