import pandas as pd
from pathlib import Path
from math import radians, sin, cos, sqrt, atan2

PARTNER_FILE = Path(__file__).parent.parent / "data" / "partners.csv"


def load_partners():
    return pd.read_csv(PARTNER_FILE).fillna("")


def clean_text(value):
    if value is None:
        return ""

    return str(value).strip().lower()


def calculate_distance(lat1, lon1, lat2, lon2):

    earth_radius = 6371

    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a)
    )

    return earth_radius * c


def category_matches(partner, category):

    if not category:
        return True

    category = clean_text(category)

    categories = clean_text(
        partner["loan_categories"]
    )

    if category in ["business", "business loan"]:

        if "micro finance" in categories:
            return True

        if "term loan" in categories:
            return True

        return False

    if category in ["education", "education loan"]:

        if "education loan" in categories:
            return True

        return False

    if category in categories:
        return True

    return False


def find_nearest_partners(
    latitude,
    longitude,
    category="",
    state=""
):

    partners = load_partners()

    results = []

    for _, partner in partners.iterrows():

        # -------------------------
        # ACTIVE CHECK
        # -------------------------

        active_status = clean_text(
            partner["active_status"]
        )

        if active_status not in [
            "active",
            "yes",
            "eligible"
        ]:
            continue

        # -------------------------
        # FUND UTILIZATION CHECK
        # -------------------------

        fund_status = clean_text(
            partner["fund_utilization_status"]
        )

        if fund_status not in [
            "eligible",
            "yes",
            "available"
        ]:
            continue

        # -------------------------
        # STATE CHECK
        # -------------------------

        if state:

            requested_state = clean_text(state)

            partner_state = clean_text(
                partner["state"]
            )

            if requested_state != partner_state:
                continue

        # -------------------------
        # CATEGORY CHECK
        # -------------------------

        if not category_matches(
            partner,
            category
        ):
            continue

        # -------------------------
        # COORDINATES
        # -------------------------

        try:

            partner_lat = float(
                partner["latitude"]
            )

            partner_lon = float(
                partner["longitude"]
            )

        except (ValueError, TypeError):

            continue

        # -------------------------
        # DISTANCE
        # -------------------------

        distance = calculate_distance(
            latitude,
            longitude,
            partner_lat,
            partner_lon
        )

        # -------------------------
        # ADD RESULT
        # -------------------------

        results.append({

            "partner_name":
                str(partner["partner_name"]),

            "partner_type":
                str(partner["partner_type"]),

            "state":
                str(partner["state"]),

            "district":
                str(partner["district"]),

            "city":
                str(partner["city"]),

            "pincode":
                str(partner["pincode"]),

            "latitude":
                partner_lat,

            "longitude":
                partner_lon,

            "loan_categories":
                str(partner["loan_categories"]),

            "distance_km":
                round(distance, 2),

            "active_status":
                str(partner["active_status"]),

            "fund_utilization_status":
                str(
                    partner[
                        "fund_utilization_status"
                    ]
                )
        })

    # Closest partner first

    results.sort(
        key=lambda x: x["distance_km"]
    )

    return results