#!/bin/sh
# Pull the latest code from GitHub, rebuild and restart Eli Check, and drop the old image.
set -eu
cd "$(dirname "$0")"
git -C .. pull --ff-only
docker compose up -d --build
docker image prune -f --filter label=com.docker.compose.project=eli-check
