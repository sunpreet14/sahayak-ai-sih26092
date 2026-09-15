import pandas as pd
from pathlib import Path

SCHEME_FILE = Path(__file__).parent.parent / "data" / "schemes.csv"


def load_schemes():
    return pd.read_csv(SCHEME_FILE).fillna("")


def clean_text(value):
    if value is None:
        return ""

    if pd.isna(value):
        return ""

    return str(value).strip().lower()


def safe_value(value):
    if value is None or pd.isna(value):
        return "Not specified"

    return value


def to_number(value):
    try:
        if value is None or pd.isna(value):
            return None

        text = str(value).strip()

        if text == "":
            return None

        return float(text)

    except:
        return None


def normalize_purpose(purpose):
    purpose = clean_text(purpose)

    education_words = [
        "education",
        "college",
        "university",
        "study",
        "studies",
        "course",
        "student",
        "degree",
        "engineering",
        "medical",
        "management",
        "law",
        "technical education",
        "higher education"
    ]

    business_words = [
        "business",
        "shop",
        "store",
        "startup",
        "enterprise",
        "self employment",
        "self-employment",
        "micro business",
        "micro enterprise",
        "company",
        "retail",
        "service",
        "manufacturing",
        "transport",
        "dairy",
        "poultry",
        "farming",
        "agriculture",
        "trading"
    ]

    for word in education_words:
        if word in purpose:
            return "education"

    for word in business_words:
        if word in purpose:
            return "business"

    return "other"


def beneficiary_matches(category, beneficiary):
    category = clean_text(category)
    beneficiary = clean_text(beneficiary)

    if category == "":
        return True

    if beneficiary == "":
        return True

    category_mapping = {
        "sc": [
            "scheduled caste",
            "sc"
        ],
        "obc": [
            "obc",
            "other backward"
        ],
        "st": [
            "scheduled tribe",
            "st"
        ],
        "women": [
            "women",
            "female"
        ],
        "startup": [
            "startup"
        ],
        "entrepreneur": [
            "entrepreneur"
        ],
        "msme": [
            "msme",
            "micro and small enterprises",
            "micro enterprises"
        ]
    }

    possible_matches = category_mapping.get(
        category,
        [category]
    )

    for item in possible_matches:
        if item in beneficiary:
            return True

    return False


def purpose_matches(normalized_purpose, scheme):
    scheme_purpose = clean_text(scheme["purpose"])
    scheme_type = clean_text(scheme["scheme_type"])
    support_type = clean_text(scheme["support_type"])
    education_eligible = clean_text(
        scheme["education_eligible"]
    )

    if normalized_purpose == "education":

        if "education" in scheme_purpose:
            return True

        if "education" in scheme_type:
            return True

        if "education" in support_type:
            return True

        if education_eligible == "yes":
            return True

        return False

    if normalized_purpose == "business":

        business_words = [
            "business",
            "enterprise",
            "self employment",
            "self-employment",
            "entrepreneur",
            "micro",
            "startup",
            "income generating",
            "manufacturing",
            "service",
            "retail",
            "agriculture",
            "livelihood",
            "trading",
            "credit",
            "loan"
        ]

        for word in business_words:

            if word in scheme_purpose:
                return True

            if word in scheme_type:
                return True

            if word in support_type:
                return True

        return False

    return True


def is_active(scheme):

    status = clean_text(
        scheme["active_status"]
    )

    if "closed" in status:
        return False

    if "ended" in status:
        return False

    if "historical" in status:
        return False

    if "inactive" in status:
        return False

    return True


def check_eligibility(
    scheme,
    income,
    loan_amount,
    age,
    project_cost
):

    reasons = []
    warnings = []

    # -------------------------
    # INCOME CHECK
    # -------------------------

    income_limit = to_number(
        scheme["income_limit"]
    )

    if income_limit is not None:

        if income > income_limit:
            return None

        reasons.append(
            "Your income is within the stated income limit"
        )

    else:

        warnings.append(
            "Income limit is not specified"
        )

    # -------------------------
    # AGE CHECK
    # -------------------------

    age_min = to_number(
        scheme["age_min"]
    )

    age_max = to_number(
        scheme["age_max"]
    )

    if age_min is not None:

        if age < age_min:
            return None

        reasons.append(
            "Your age satisfies the minimum age requirement"
        )

    if age_max is not None:

        if age > age_max:
            return None

        reasons.append(
            "Your age is within the permitted age range"
        )

    # -------------------------
    # LOAN AMOUNT CHECK
    # -------------------------

    maximum_loan = to_number(
        scheme["maximum_loan"]
    )

    if loan_amount > 0:

        if maximum_loan is not None:

            if loan_amount > maximum_loan:
                return None

            reasons.append(
                "Requested loan is within the maximum loan limit"
            )

        else:

            warnings.append(
                "Maximum loan amount is not specified"
            )

    # -------------------------
    # PROJECT COST CHECK
    # -------------------------

    project_min = to_number(
        scheme["project_cost_min"]
    )

    project_max = to_number(
        scheme["project_cost_max"]
    )

    if project_cost > 0:

        if project_min is not None:

            if project_cost < project_min:
                return None

        if project_max is not None:

            if project_cost > project_max:
                return None

        if project_min is not None or project_max is not None:

            reasons.append(
                "Project cost fits the available project-cost range"
            )

        else:

            warnings.append(
                "Project-cost limit is not specified"
            )

    return {
        "reasons": reasons,
        "warnings": warnings
    }


def calculate_match_score(
    scheme,
    normalized_purpose,
    eligibility_result
):

    score = 0

    reasons = eligibility_result["reasons"]
    warnings = eligibility_result["warnings"]

    # -------------------------
    # PURPOSE SCORE
    # -------------------------

    if purpose_matches(
        normalized_purpose,
        scheme
    ):

        score += 30

    # -------------------------
    # INCOME SCORE
    # -------------------------

    if any(
        "income is within" in reason
        for reason in reasons
    ):

        score += 20

    # -------------------------
    # AGE SCORE
    # -------------------------

    age_reasons = [
        "age satisfies",
        "age is within"
    ]

    for reason in reasons:

        if any(
            text in reason
            for text in age_reasons
        ):

            score += 5

    # -------------------------
    # LOAN SCORE
    # -------------------------

    if any(
        "loan is within" in reason
        for reason in reasons
    ):

        score += 20

    # -------------------------
    # PROJECT SCORE
    # -------------------------

    if any(
        "project cost fits" in reason
        for reason in reasons
    ):

        score += 15

    # -------------------------
    # LOW INTEREST BONUS
    # -------------------------

    interest_text = clean_text(
        scheme["interest_rate"]
    )

    if interest_text:

        try:

            values = interest_text.replace(
                "%",
                ""
            ).split(";")

            interest_values = []

            for value in values:

                try:

                    number = float(
                        value.strip()
                    )

                    interest_values.append(
                        number
                    )

                except:
                    pass

            if interest_values:

                lowest_interest = min(
                    interest_values
                )

                if lowest_interest <= 8:

                    score += 5

                    reasons.append(
                        "This scheme offers a relatively concessional interest rate"
                    )

        except:
            pass

    return {
        "score": score,
        "reasons": reasons,
        "warnings": warnings
    }


def find_schemes(
    income,
    purpose,
    loan_amount,
    age,
    project_cost,
    education_status,
    state,
    category="SC"
):

    schemes = load_schemes()

    normalized_purpose = normalize_purpose(
        purpose
    )

    loan_recommendations = []
    support_recommendations = []

    for _, scheme in schemes.iterrows():

        # -------------------------
        # ACTIVE CHECK
        # -------------------------

        if not is_active(scheme):
            continue

        # -------------------------
        # BENEFICIARY CHECK
        # -------------------------

        if not beneficiary_matches(
            category,
            scheme["beneficiary_category"]
        ):

            continue

        # -------------------------
        # PURPOSE CHECK
        # -------------------------

        if not purpose_matches(
            normalized_purpose,
            scheme
        ):

            continue

        # -------------------------
        # ELIGIBILITY CHECK
        # -------------------------

        eligibility = check_eligibility(
            scheme,
            income,
            loan_amount,
            age,
            project_cost
        )

        if eligibility is None:
            continue

        # -------------------------
        # SCORE
        # -------------------------

        result = calculate_match_score(
            scheme,
            normalized_purpose,
            eligibility
        )

        # -------------------------
        # RECOMMENDATION LEVEL
        # -------------------------

        score = result["score"]

        if score >= 80:

            recommendation_level = "Excellent Match"

        elif score >= 60:

            recommendation_level = "Strong Match"

        elif score >= 40:

            recommendation_level = "Possible Match"

        else:

            recommendation_level = "Low Match"

        # -------------------------
        # DIRECT FINANCING CHECK
        # -------------------------

        maximum_loan = to_number(
            scheme["maximum_loan"]
        )

        support_type = clean_text(
            scheme["support_type"]
        )

        scheme_type = clean_text(
            scheme["scheme_type"]
        )

        is_direct_financing = (

            maximum_loan is not None

            or "loan" in support_type

            or "credit" in support_type

            or "financing" in support_type

            or "loan" in scheme_type

            or "credit" in scheme_type
        )

        # -------------------------
        # CREATE RESPONSE
        # -------------------------

        recommendation = {

            "scheme_name":
                safe_value(
                    scheme["scheme_name"]
                ),

            "scheme_level":
                safe_value(
                    scheme["scheme_level"]
                ),

            "ministry":
                safe_value(
                    scheme["ministry"]
                ),

            "beneficiary_category":
                safe_value(
                    scheme["beneficiary_category"]
                ),

            "scheme_type":
                safe_value(
                    scheme["scheme_type"]
                ),

            "support_type":
                safe_value(
                    scheme["support_type"]
                ),

            "maximum_loan":
                maximum_loan
                if maximum_loan is not None
                else "Not specified",

            "interest_rate":
                safe_value(
                    scheme["interest_rate"]
                ),

            "subsidy":
                safe_value(
                    scheme["subsidy"]
                ),

            "moratorium":
                safe_value(
                    scheme["moratorium"]
                ),

            "tenure":
                safe_value(
                    scheme["tenure"]
                ),

            "match_score":
                score,

            "recommendation_level":
                recommendation_level,

            "reasons":
                result["reasons"],

            "warnings":
                result["warnings"],

            "application_method":
                safe_value(
                    scheme["application_method"]
                ),

            "channel_partner_type":
                safe_value(
                    scheme["channel_partner_type"]
                ),

            "active_status":
                safe_value(
                    scheme["active_status"]
                ),

            "source_url":
                safe_value(
                    scheme["source_url"]
                )
        }

        # -------------------------
        # SEPARATE RESULTS
        # -------------------------

        if is_direct_financing:

            loan_recommendations.append(
                recommendation
            )

        else:

            support_recommendations.append(
                recommendation
            )

    # -------------------------
    # SORT BY SCORE
    # -------------------------

    loan_recommendations.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    support_recommendations.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    # -------------------------
    # RETURN
    # -------------------------

    return {

        "loan_recommendations":
            loan_recommendations,

        "support_recommendations":
            support_recommendations
    }