#!/usr/bin/env bash
# MM55 S6 helper: set the branch-scoped Preview env vars of the 16
# `translate/<prefix>` branches on Vercel. Works on macOS bash 3.2.
#
# Usage:
#   1. vercel login
#   2. cd into this repo and run `vercel link`.
#   3. Export the secrets in YOUR shell (never in a file in the repo):
#        export GITHUB_APP_ID=123456
#        export GITHUB_APP_INSTALLATION_ID=7654321
#        read -rs GITHUB_APP_PRIVATE_KEY_B64 && export GITHUB_APP_PRIVATE_KEY_B64   # paste base64 PEM
#        # or: export GITHUB_APP_PRIVATE_KEY_B64="$(base64 -i key.pem | tr -d '\n')"
#        export TRANSLATOR_EMAILS_DEFAULT='you@example.com'
#        # optional per-locale override, prefix uppercased with - as _ :
#        export TRANSLATOR_EMAILS_PT_BR='a@example.com,b@example.com'
#   4. scripts/vercel-translator-env.sh --dry-run de     # review first
#   5. scripts/vercel-translator-env.sh                  # all 16, or: ... de pt-br
#   6. Redeploy each translate/<prefix> branch (env changes only affect new deployments).
#
# Per branch it sets (Preview, that branch only): NEXT_PUBLIC_DEPLOY_ROLE,
# NEXT_PUBLIC_TRANSLATOR_LOCALE, TRANSLATOR_EMAILS, NEXT_PUBLIC_ADSENSE_ENABLED,
# NEXT_PUBLIC_MOCK_ADS_ENABLED, NEXT_PUBLIC_SEO_FULL_INDEX, GITHUB_APP_ID,
# GITHUB_APP_INSTALLATION_ID, GITHUB_APP_PRIVATE_KEY (--sensitive; the base64 PEM),
# GITHUB_REPO, GITHUB_BASE_BRANCH.
# NEXT_PUBLIC_GA_MEASUREMENT_ID and NEXT_PUBLIC_ANALYTICS_WRITE_KEY are left
# unset on purpose: MM52 ignores them in translator mode.
# The NEXT_PUBLIC_FB_* Firebase vars are NOT set here; they must already exist
# for the Preview environment.
#
# Idempotent: each variable is removed (failure ignored) and re-added.
# --dry-run prints every command with secrets redacted and runs no `vercel`.
# Secret values are never printed and `set -x` is never used.
set -euo pipefail

DRY_RUN=0
WANTED=()
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    -h|--help) sed -n '2,30p' "$0"; exit 0 ;;
    -*) echo "Unknown option: $arg" >&2; exit 2 ;;
    *) WANTED+=("$arg") ;;
  esac
done

cd "$(dirname "$0")/.."

fail() { echo "ERROR: $*" >&2; exit 1; }

# Required secrets: report names only.
missing=""
for name in GITHUB_APP_ID GITHUB_APP_INSTALLATION_ID GITHUB_APP_PRIVATE_KEY_B64 TRANSLATOR_EMAILS_DEFAULT; do
  if [ -z "$(printenv "$name" || true)" ]; then missing="$missing $name"; fi
done
[ -z "$missing" ] || fail "missing environment variable(s):$missing"

case "$GITHUB_APP_ID" in ''|*[!0-9]*) fail "GITHUB_APP_ID must be digits only" ;; esac
case "$GITHUB_APP_INSTALLATION_ID" in ''|*[!0-9]*) fail "GITHUB_APP_INSTALLATION_ID must be digits only" ;; esac
head11="$(printf '%s' "$GITHUB_APP_PRIVATE_KEY_B64" | { base64 -d 2>/dev/null || base64 -D 2>/dev/null || true; } | head -c 11 || true)"
[ "$head11" = "-----BEGIN " ] || fail "GITHUB_APP_PRIVATE_KEY_B64 must be the base64 of a PEM starting with '-----BEGIN'"

if [ "$DRY_RUN" -eq 0 ]; then
  command -v vercel >/dev/null 2>&1 || fail "the vercel CLI is not on PATH (npm i -g vercel, then vercel login and vercel link)"
fi

# prefix=code pairs, from the registry (never hand-listed).
PAIRS=()
while IFS= read -r line; do
  [ -n "$line" ] && PAIRS+=("$line")
done < <(node scripts/list-locales.mjs --codes)
[ "${#PAIRS[@]}" -gt 0 ] || fail "scripts/list-locales.mjs --codes returned nothing"

if [ "${#WANTED[@]}" -gt 0 ]; then
  for w in "${WANTED[@]}"; do
    found=0
    for pair in "${PAIRS[@]}"; do
      [ "${pair%%=*}" = "$w" ] && found=1
    done
    [ "$found" -eq 1 ] || fail "unknown locale prefix: $w"
  done
fi

wanted_prefix() {
  [ "${#WANTED[@]}" -eq 0 ] && return 0
  for w in "${WANTED[@]}"; do
    [ "$w" = "$1" ] && return 0
  done
  return 1
}

# set_var NAME VALUE BRANCH [secret|sensitive]
#   secret    -> value shown as <redacted> in --dry-run
#   sensitive -> additionally passes --sensitive to Vercel (implies redaction)
set_var() {
  local name="$1" value="$2" branch="$3" kind="${4:-}"
  local flags=""
  [ "$kind" = "sensitive" ] && flags=" --sensitive"
  if [ "$DRY_RUN" -eq 1 ]; then
    local shown="$value"
    [ -n "$kind" ] && shown="<redacted>"
    echo "vercel env rm $name preview $branch --yes"
    echo "printf '%s' '$shown' | vercel env add $name preview $branch$flags"
    return 0
  fi
  vercel env rm "$name" preview "$branch" --yes >/dev/null 2>&1 || true
  if [ "$kind" = "sensitive" ]; then
    printf '%s' "$value" | vercel env add "$name" preview "$branch" --sensitive >/dev/null
  else
    printf '%s' "$value" | vercel env add "$name" preview "$branch" >/dev/null
  fi
  echo "  set $name"
}

for pair in "${PAIRS[@]}"; do
  prefix="${pair%%=*}"
  code="${pair#*=}"
  wanted_prefix "$prefix" || continue
  branch="translate/$prefix"

  override_name="TRANSLATOR_EMAILS_$(printf '%s' "$prefix" | tr '[:lower:]-' '[:upper:]_')"
  emails="$(printenv "$override_name" || true)"
  [ -n "$emails" ] || emails="$TRANSLATOR_EMAILS_DEFAULT"

  echo "== $branch ($code)"
  set_var NEXT_PUBLIC_DEPLOY_ROLE translator "$branch"
  set_var NEXT_PUBLIC_TRANSLATOR_LOCALE "$code" "$branch"
  set_var TRANSLATOR_EMAILS "$emails" "$branch" secret
  set_var NEXT_PUBLIC_ADSENSE_ENABLED false "$branch"
  set_var NEXT_PUBLIC_MOCK_ADS_ENABLED false "$branch"
  set_var NEXT_PUBLIC_SEO_FULL_INDEX false "$branch"
  set_var GITHUB_APP_ID "$GITHUB_APP_ID" "$branch" secret
  set_var GITHUB_APP_INSTALLATION_ID "$GITHUB_APP_INSTALLATION_ID" "$branch" secret
  set_var GITHUB_APP_PRIVATE_KEY "$GITHUB_APP_PRIVATE_KEY_B64" "$branch" sensitive
  set_var GITHUB_REPO mrrobotisreal/media_manipulator_ui "$branch"
  set_var GITHUB_BASE_BRANCH main "$branch"
done

echo
echo "Reminder: the NEXT_PUBLIC_FB_* Firebase variables must already exist for the Preview"
echo "environment (this script does not set them). Redeploy each translate/<prefix> branch"
echo "so the new variables take effect."
