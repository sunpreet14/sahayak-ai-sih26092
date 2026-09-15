def calculate_emi(
    principal,
    annual_interest_rate,
    tenure_months
):

    principal = float(principal)
    annual_interest_rate = float(annual_interest_rate)
    tenure_months = int(tenure_months)

    if principal <= 0:
        return {
            "error": "Loan amount must be greater than 0"
        }

    if tenure_months <= 0:
        return {
            "error": "Tenure must be greater than 0"
        }

    monthly_rate = (
        annual_interest_rate / 12 / 100
    )

    if monthly_rate == 0:

        emi = principal / tenure_months

    else:

        emi = (
            principal
            * monthly_rate
            * (1 + monthly_rate) ** tenure_months
        ) / (
            (1 + monthly_rate) ** tenure_months - 1
        )

    total_payment = (
        emi * tenure_months
    )

    total_interest = (
        total_payment - principal
    )

    return {

        "loan_amount":
            round(principal, 2),

        "annual_interest_rate":
            annual_interest_rate,

        "tenure_months":
            tenure_months,

        "tenure_years":
            round(
                tenure_months / 12,
                2
            ),

        "monthly_emi":
            round(emi, 2),

        "total_interest":
            round(total_interest, 2),

        "total_payment":
            round(total_payment, 2)
    }