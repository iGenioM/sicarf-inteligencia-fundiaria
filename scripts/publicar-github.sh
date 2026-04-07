#!/usr/bin/env bash
set -euo pipefail

export PATH="${HOME}/.local/bin:/opt/homebrew/bin:/usr/local/bin:${PATH}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v gh >/dev/null 2>&1; then
  echo "Instale o GitHub CLI: https://cli.github.com ou use brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo ">>> Faça login no GitHub (abra o navegador quando pedir):"
  gh auth login -h github.com -p https
fi

REPO_NAME="${1:-sicarf-corregedoria}"

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' já existe. Enviando commits..."
  git push -u origin main
else
  echo ">>> Criando repositório ${REPO_NAME} e enviando código..."
  gh repo create "${REPO_NAME}" --public --source=. --remote=origin --push --description "SICARF Corregedoria — dashboard compliance e cartórios (Next.js)"
fi

echo ">>> Pronto. Verifique: https://github.com/$(gh api user -q .login)/${REPO_NAME}"
