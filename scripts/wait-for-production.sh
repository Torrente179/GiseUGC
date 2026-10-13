#!/usr/bin/env bash
# Wait until the Vercel production deploy for this push is live.
# Always exits 0 — IndexNow must never block deploy.
#
# Manual:
#   GITHUB_SHA=<sha> GITHUB_REPOSITORY=<owner/repo> GH_TOKEN=<token> \
#     ./scripts/wait-for-production.sh
#   WAIT_FOR_PRODUCTION_GRACE_S=120 ./scripts/wait-for-production.sh

set -u

TIMEOUT_S="${WAIT_FOR_PRODUCTION_TIMEOUT_S:-480}"
INTERVAL_S="${WAIT_FOR_PRODUCTION_INTERVAL_S:-15}"
GRACE_S="${WAIT_FOR_PRODUCTION_GRACE_S:-120}"
DEADLINE=$((SECONDS + TIMEOUT_S))

echo "Waiting up to ${TIMEOUT_S}s for the Vercel production deploy."

github_ready() {
  command -v gh >/dev/null 2>&1 || return 1
  [[ -n "${GITHUB_SHA:-}" && -n "${GITHUB_REPOSITORY:-}" ]] || return 1
  [[ -n "${GH_TOKEN:-${GITHUB_TOKEN:-}}" ]] || return 1

  export GH_TOKEN="${GH_TOKEN:-${GITHUB_TOKEN:-}}"

  local states
  states=$(gh api "repos/${GITHUB_REPOSITORY}/commits/${GITHUB_SHA}/statuses?per_page=30" \
    --jq '.[] | select((.context | ascii_downcase) | contains("vercel")) | .state' \
    2>/dev/null || true)
  if echo "$states" | grep -qx success; then
    echo "GitHub commit status reports a successful Vercel deploy."
    return 0
  fi

  local ids id state env_name
  ids=$(gh api "repos/${GITHUB_REPOSITORY}/deployments?sha=${GITHUB_SHA}&per_page=20" \
    --jq '.[] | select((.environment | ascii_downcase) == "production") | .id' \
    2>/dev/null || true)
  [[ -n "$ids" ]] || return 1

  for id in $ids; do
    state=$(gh api "repos/${GITHUB_REPOSITORY}/deployments/${id}/statuses?per_page=5" \
      --jq '.[0].state // empty' 2>/dev/null || true)
    env_name=$(gh api "repos/${GITHUB_REPOSITORY}/deployments/${id}" \
      --jq '.environment // empty' 2>/dev/null || true)
    if [[ "$state" == "success" ]]; then
      echo "GitHub production deployment ${id} (${env_name}) is success."
      return 0
    fi
  done
  return 1
}

HAS_GITHUB_PROBE=0
if command -v gh >/dev/null 2>&1 \
  && [[ -n "${GITHUB_SHA:-}" && -n "${GITHUB_REPOSITORY:-}" ]] \
  && [[ -n "${GH_TOKEN:-${GITHUB_TOKEN:-}}" ]]; then
  HAS_GITHUB_PROBE=1
fi

if [[ "$HAS_GITHUB_PROBE" -eq 1 ]]; then
  while (( SECONDS < DEADLINE )); do
    if github_ready; then
      exit 0
    fi
    echo "Vercel production not ready yet; retrying in ${INTERVAL_S}s..."
    sleep "$INTERVAL_S"
  done
  echo "Timed out waiting for a Vercel success status; continuing (fail soft)."
  exit 0
fi

echo "No GitHub deploy probe available; waiting ${GRACE_S}s for Vercel to publish main."
sleep "$GRACE_S"
echo "Grace wait finished; continuing."
exit 0
