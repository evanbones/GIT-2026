#!/usr/bin/env bash
# =============================================================
# Seed Script: Create a Producer User
# =============================================================
# Reads DATABASE_URL from backend/.env and takes producer
# details as command-line arguments.
#
# Usage:
#   ./backend/scripts/seed_producers.sh \
#       "jane@example.com" \
#       '$2b$12$yourBcryptHashHere' \
#       "Sunrise Organics"
# =============================================================

set -euo pipefail

if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <email> <password_hash> <company_name>"
    echo ""
    echo "Example:"
    echo "  $0 \"jane@example.com\" '\$2b\$12\$hashHere' \"My Farm Co\""
    exit 1
fi

EMAIL="$1"
PASSWORD_HASH="$2"
COMPANY_NAME="$3"

# Resolve the project root (backend/.env) relative to this script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found at $ENV_FILE"
    exit 1
fi

# Load DATABASE_URL from .env
DATABASE_URL="$(grep -E '^DATABASE_URL=' "$ENV_FILE" | cut -d '=' -f2-)"

if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL not found in $ENV_FILE"
    exit 1
fi

echo "Seeding producer: $COMPANY_NAME ($EMAIL) ..."

psql "$DATABASE_URL" <<SQL
BEGIN;

INSERT INTO users (email, password_hash, user_type, created_at)
VALUES ('$EMAIL', '$PASSWORD_HASH', 'producer', NOW());

INSERT INTO producers (id, company_name)
VALUES (
    currval(pg_get_serial_sequence('users', 'id')),
    '$COMPANY_NAME'
);

COMMIT;
SQL

echo "Done! Producer '$COMPANY_NAME' created."
