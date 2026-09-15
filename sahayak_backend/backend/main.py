from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.matcher import find_schemes
from backend.calculator import calculate_emi
from backend.partner_locator import find_nearest_partners
from backend.nlp_parser import parse_user_input

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app = FastAPI(
    title="Sahayak AI | SIH26092",
    description="Explainable scheme matching and financial guidance for marginalized entrepreneurs.",
    version="3.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
def home():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/health")
def health():
    return {"status": "online", "service": "Sahayak AI", "version": "3.0"}


@app.get("/recommend")
def recommend(
    income: float,
    purpose: str,
    loan_amount: float,
    age: int,
    project_cost: float,
    education_status: str,
    state: str,
    category: str = "SC"
):
    results = find_schemes(
        income, purpose, loan_amount, age, project_cost,
        education_status, state, category
    )
    total = len(results["loan_recommendations"]) + len(results["support_recommendations"])
    return {"count": total, **results}


@app.get("/calculate-emi")
def calculate_loan_emi(loan_amount: float, interest_rate: float, tenure_months: int):
    return calculate_emi(loan_amount, interest_rate, tenure_months)


@app.get("/nearest-partner")
def nearest_partner(
    latitude: float = 31.326,
    longitude: float = 75.5762,
    category: str = "business",
    state: str = "Punjab",
):
    results = find_nearest_partners(latitude, longitude, category, state)
    return {"count": len(results), "partners": results}


def _interest_values(text):
    values = []
    for value in str(text or "").replace("%", "").split(";"):
        try:
            values.append(float(value.strip()))
        except (ValueError, TypeError):
            pass
    return values


def _purpose_for_partner(purpose):
    p = str(purpose).lower()
    if p == "education":
        return "education"
    if p == "business":
        return "business"
    return ""


def build_smart_result(income, purpose, loan_amount, age, project_cost,
                       education_status, state, latitude, longitude, category):
    scheme_results = find_schemes(
        income, purpose, loan_amount, age, project_cost,
        education_status, state, category
    )

    partner_results = find_nearest_partners(
        latitude, longitude, _purpose_for_partner(purpose), state
    )

    recommendations = scheme_results["loan_recommendations"]
    best_scheme = recommendations[0] if recommendations else None
    emi_result = None

    if best_scheme:
        rates = _interest_values(best_scheme.get("interest_rate"))
        if rates and loan_amount > 0:
            selected_interest = min(rates)
            emi_result = calculate_emi(loan_amount, selected_interest, 36)

    return {
        "applicant": {
            "income": income,
            "purpose": purpose,
            "loan_amount": loan_amount,
            "age": age,
            "project_cost": project_cost,
            "education_status": education_status,
            "state": state,
            "category": category,
        },
        "best_scheme": best_scheme,
        "scheme_recommendations": scheme_results,
        "financial_calculation": emi_result,
        "nearest_partners": partner_results[:5],
        "next_steps": [
            "Review the eligibility reasons and warnings.",
            "Verify the latest scheme guidelines before applying.",
            "Contact an authorized channel partner for the final application process."
        ]
    }


@app.get("/smart-recommendation")
def smart_recommendation(
    income: float,
    purpose: str,
    loan_amount: float,
    age: int,
    project_cost: float,
    education_status: str,
    state: str,
    latitude: float,
    longitude: float,
    category: str = "SC"
):
    return build_smart_result(
        income, purpose, loan_amount, age, project_cost,
        education_status, state, latitude, longitude, category
    )


@app.get("/smart-text")
def smart_text(
    text: str,
    project_cost: float = 0,
    education_status: str = "not_student",
    state: str = "Punjab",
    latitude: float = 31.326,
    longitude: float = 75.5762,
    category: str = "SC",
    age: int | None = None,
    profile_income: float | None = None,
    profile_purpose: str | None = None
):
    user_data = parse_user_input(text)
    income = user_data["income"] if user_data["income"] is not None else profile_income
    loan_amount = user_data["loan_amount"]
    purpose = user_data["purpose"] if user_data["purpose"] else (profile_purpose or "business")
    parsed_age = age if age is not None else user_data["age"]

    if income is None:
        return {"error": "Could not understand annual income. Please mention your income, for example 3 lakh."}
    if loan_amount is None and project_cost and project_cost > 0:
        loan_amount = round(project_cost * 0.90, 2)
    if loan_amount is None:
        return {"error": "Could not understand loan amount. Please mention the required loan amount, for example 1 lakh."}

    result = build_smart_result(
        income, purpose, loan_amount, parsed_age, project_cost,
        education_status, state, latitude, longitude, category
    )
    result["understood_input"] = {
        **user_data,
        "project_cost": project_cost,
        "state": state,
        "category": category,
        "education_status": education_status,
    }
    return result


if FRONTEND_DIR.exists():
    from fastapi.staticfiles import StaticFiles
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")
