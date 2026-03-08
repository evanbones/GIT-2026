#!/usr/bin/env bash
# =============================================================
# Batch Seed: Insert all producer users from businesses.html
# =============================================================
# Reads DATABASE_URL from backend/.env and inserts all
# wineries, breweries, farms, distilleries, cideries, and
# fruit-stand businesses as producer users.
#
# Each producer gets:
#   - email:         derived from the company name (slugified)
#   - password_hash: a default bcrypt placeholder
#   - company_name:  the business name from the directory
#   - primary_address: extracted from the business listing
#
# Usage:
#   ./backend/scripts/seed_all_producers.sh
# =============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found at $ENV_FILE"
    exit 1
fi

DATABASE_URL="$(grep -E '^DATABASE_URL=' "$ENV_FILE" | cut -d '=' -f2-)"

if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL not found in $ENV_FILE"
    exit 1
fi

# Default bcrypt hash for "Password123!" — replace in production
DEFAULT_HASH='$2b$12$LJ3m4ys3Lk0TnGFBQvCiOeXbGJwv5CxEqRzP1rIqNw6ySEzFxU5rO'

# Helper: slugify a company name into an email
slugify_email() {
    echo "$1" \
        | tr '[:upper:]' '[:lower:]' \
        | sed "s/[''']//g" \
        | sed 's/&/and/g' \
        | sed 's/+/and/g' \
        | sed 's/[^a-z0-9]/-/g' \
        | sed 's/--*/-/g' \
        | sed 's/^-//;s/-$//'
}

# Each entry is "COMPANY_NAME|ADDRESS"
PRODUCERS=(
    "4 Elements Farm|15530 Sawmill Rd, Lake Country, BC V4V 2E2"
    "50th Parallel Estate Winery|17101 Terrace View Rd, Lake Country, BC V4V 1B2"
    "Ancient Hill Estate Winery|4918 Anderson Rd, Kelowna, BC V1X 7V7"
    "Arndt Orchards|1555B Teasdale Rd, Kelowna, BC V1P 1C8"
    "Arrowleaf Cellars|1574 Camp Rd, Lake Country, BC V4V 1K1"
    "BC Tree Fruits Cider Co.|826 Vaughan Ave, Kelowna, BC V1Y 7E4"
    "BNA Brewing Co. & Eatery|1250 Ellis St, Kelowna, BC V1Y 1Z4"
    "Barn Owl Brewing Company|4629 Lakeshore Rd #102, Kelowna, BC V1W 1X3"
    "Beaumont Family Estate Winery|2775 Boucherie Rd, Kelowna, BC V1Z 2G4"
    "Blind Tiger Vineyards|11014 Bond Rd, Lake Country, BC V4V 1J6"
    "Calona Vineyards|1125 Richter St, Kelowna, BC V1Y 2K6"
    "CedarCreek Estate Winery|5445 Lakeshore Rd, Kelowna, BC V1W 4S5"
    "Ciao Bella Winery|3252 Glencoe Rd, West Kelowna, BC V4T 1M2"
    "Copper Brewing Co.|1851 Kirschner Rd #102, Kelowna, BC V1Y 4N7"
    "Crosby Organics|2800 Dunster Rd, Kelowna, BC V1W 4H4"
    "Curly Frog Farm|395 Hereron Rd, Kelowna, BC V1X 7V1"
    "Ex Nihilo Vineyards|1525 Camp Rd, Lake Country, BC V4V 1K1"
    "Firefly Farms|2055 Heimlich Rd, Kelowna, BC V1W 4A8"
    "Forbidden Spirits Distilling Co.|4400 Wallace Hill Rd, Kelowna, BC V1W 4C3"
    "Frequency Winery|3210 Gulley Rd, Kelowna, BC V1W 4E5"
    "Frind Estate Winery|3725 Boucherie Rd, West Kelowna, BC V4T 0A8"
    "Gambell Farms|12133 Okanagan Centre Rd E, Lake Country, BC V4V 1G9"
    "Gray Monk Estate Winery|1055 Camp Rd, Lake Country, BC V4V 2H4"
    "Griffin Farms|3344 Elliott Rd, West Kelowna, BC V4T 1P2"
    "Grizzli Winery|2550 Boucherie Rd, West Kelowna, BC V1Z 2E6"
    "Indigenous World Winery|2218 Horizon Dr, West Kelowna, BC V1Z 3L4"
    "Intrigue Wines|2291 Goldie Rd, Lake Country, BC V4V 1G5"
    "Jackknife Brewing|727 Baillie Ave, Kelowna, BC V1Y 7E9"
    "Kalala Organic Estate Winery|3361 Glencoe Rd, West Kelowna, BC V4T 1M1"
    "Kelowna Beer Institute|1346 Water St, Kelowna, BC V1Y 9P4"
    "Kempf Orchards|1409 Teasdale Rd, Kelowna, BC V1P 1C8"
    "Kettle River Brewing Co.|731 Baillie Ave, Kelowna, BC V1Y 7E9"
    "Lakesider Brewing|835 Anders Rd, West Kelowna, BC V1Z 1J9"
    "Little Straw Vineyards|2815 Ourtoland Rd, West Kelowna, BC V1Z 2H7"
    "MacDonald Acres|Kelowna, BC"
    "Martin's Lane Winery|5437 Lakeshore Rd, Kelowna, BC V1W 4S5"
    "Meadow Vista Honey Wines|3975 June Springs Rd, Kelowna, BC V1W 4E4"
    "Mission Hill Family Estate Winery|1730 Mission Hill Rd, West Kelowna, BC V4T 2E4"
    "MotherLove Ferments|889 Vaughan Ave #109, Kelowna, BC V1Y 7E4"
    "Mount Boucherie Estate Winery|829 Douglas Rd, West Kelowna, BC V1Z 1N9"
    "Nagging Doubt Wines|4513 Sallows Rd, Kelowna, BC V1W 4C2"
    "Off the Grid Organic Winery|3623 Glencoe Rd, West Kelowna, BC V4T 1L8"
    "Okanagan Spirits Craft Distillery|267 Bernard Ave, Kelowna, BC V1Y 6N2"
    "Paynter's Fruit Market|3687 Paynter Rd, West Kelowna, BC V4T 1R1"
    "Peak Cellars|Kelowna, BC"
    "Priest Creek Family Estate Winery|2555 Saucier Rd, Kelowna, BC V1W 4B7"
    "Quails' Gate Winery|3303 Boucherie Rd, Kelowna, BC V1Z 2H3"
    "Railside Brewing|1186 High Rd, Kelowna, BC V1Y 7B1"
    "Red Bird Brewing|1080 Richter St, Kelowna, BC V1Y 2K5"
    "Rollingdale Winery|2306 Hayman Rd, West Kelowna, BC V1Z 1Z5"
    "Rustic Reel Brewing Co.|760 Vaughan Ave, Kelowna, BC V1Y 7E4"
    "Sandhill Wines|1125 Richter St, Kelowna, BC V1Y 2K6"
    "Scenic Road Cider Co.|772 Packinghouse Rd, Kelowna, BC V1V 2E1"
    "Scorched Earth Winery|6007 Lakeshore Rd, Kelowna, BC V1W 4J5"
    "Shore Line Brewing|Kelowna, BC"
    "Soma Craft Cidery|4485 Sallows Rd, Kelowna, BC V1W 4C2"
    "SpearHead Winery|3950 Spiers Rd, Kelowna, BC V1W 4B3"
    "Sperling Vineyards|1405 Pioneer Rd, Kelowna, BC V1W 4M6"
    "St. Hubertus & Oak Bay Estate Winery|5205 Lakeshore Rd, Kelowna, BC V1W 4J1"
    "Summerhill Pyramid Winery|4870 Chute Lake Rd, Kelowna, BC V1W 4M3"
    "Sun City Cherries|4759 Lakeshore Rd, Kelowna, BC V1W 4H6"
    "Tantalus Vineyards|1670 DeHart Rd, Kelowna, BC V1W 4N6"
    "The Gallery Winery|2233 Witt Rd, West Kelowna, BC V4T 2C5"
    "The Hatch|3225 Boucherie Rd, Kelowna, BC V1Z 2G9"
    "The Hatching Post Brewery & Smokery|3225 Boucherie Rd, Kelowna, BC V1Z 2G9"
    "The Vibrant Vine|3240 Pooley Rd, Kelowna, BC V1W 4G7"
    "The View Winery & Vineyard|2287 Ward Rd, Kelowna, BC V1W 4R5"
    "Tree Brewing Beer Institute|1346 Water St, Kelowna, BC V1Y 9P4"
    "Truck 59 Ciderhouse|3887 Brown Rd, West Kelowna, BC V4T 2J3"
    "Unleashed Brewing Company|880 Clement Ave #207, Kelowna, BC V1Y 0H8"
    "Upside Cider|2555 Gale Rd, Kelowna, BC V1V 2K2"
    "Urban Distilleries + Winery|1979 Old Okanagan Hwy #402, West Kelowna, BC V4T 3A4"
    "Vice & Virtue Brewing Co.|1001 Ellis St, Kelowna, BC V1Y 1Z6"
    "Volcanic Hills Estate Winery|2845 Boucherie Rd, West Kelowna, BC V1Z 2G6"
    "Wards Cider|Kelowna, BC"
    "Wild Ambition Brewing|1-3314 Appaloosa Rd, Kelowna, BC V1V 2W5"
    "Wise Earth Farm|3019 Leader Rd, Kelowna, BC V1W 2E9"
)

echo "=== Seeding ${#PRODUCERS[@]} producers ==="
echo ""

SUCCESS=0
FAIL=0

for entry in "${PRODUCERS[@]}"; do
    company="${entry%%|*}"
    address="${entry#*|}"

    slug="$(slugify_email "$company")"
    email="${slug}@mail.mail"

    # Escape single quotes for SQL
    safe_company="${company//\'/\'\'}"
    safe_address="${address//\'/\'\'}"

    echo -n "  Seeding: $company ... "

    if psql "$DATABASE_URL" -q -c "
        BEGIN;
        INSERT INTO users (email, password_hash, user_type, created_at)
        VALUES ('$email', '$DEFAULT_HASH', 'producer', NOW());
        INSERT INTO producers (id, company_name, primary_address)
        VALUES (currval(pg_get_serial_sequence('users', 'id')), '$safe_company', '$safe_address');
        COMMIT;
    " 2>/dev/null; then
        echo "OK"
        SUCCESS=$((SUCCESS+1))
    else
        echo "FAILED (may already exist)"
        FAIL=$((FAIL+1))
    fi
done

echo ""
echo "=== Done! $SUCCESS succeeded, $FAIL failed ==="
