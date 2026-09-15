import re


def extract_amount(text):
    text = text.lower()

    lakh_match = re.search(
        r'(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs)',
        text
    )

    if lakh_match:
        value = float(lakh_match.group(1))
        return int(value * 100000)

    thousand_match = re.search(
        r'(\d+(?:\.\d+)?)\s*(thousand|k)',
        text
    )

    if thousand_match:
        value = float(thousand_match.group(1))
        return int(value * 1000)

    number_match = re.search(
        r'₹?\s*(\d+(?:,\d+)*(?:\.\d+)?)',
        text
    )

    if number_match:
        value = number_match.group(1).replace(",", "")
        return int(float(value))

    return None


def extract_income(text):
    text = text.lower()

    patterns = [
        r'income.*?(?:is|of|around|about)\s*(?:₹\s*)?([\d,.]+)\s*(lakh|lakhs|lac|lacs)?',
        r'आमदनी.*?([\d,.]+)\s*(लाख|लाखों)?',
        r'आय.*?([\d,.]+)\s*(लाख|लाखों)?'
    ]

    for pattern in patterns:
        match = re.search(pattern, text)

        if match:
            value = float(match.group(1).replace(",", ""))

            if len(match.groups()) > 1 and match.group(2):
                value *= 100000

            return int(value)

    return None


def extract_loan_amount(text):
    text = text.lower()

    patterns = [
        r'loan.*?(?:of|for|need|want)\s*(?:₹\s*)?([\d,.]+)\s*(lakh|lakhs|lac|lacs)?',
        r'लोन.*?([\d,.]+)\s*(लाख|लाखों)?',
        r'ऋण.*?([\d,.]+)\s*(लाख|लाखों)?'
    ]

    for pattern in patterns:
        match = re.search(pattern, text)

        if match:
            value = float(match.group(1).replace(",", ""))

            if len(match.groups()) > 1 and match.group(2):
                value *= 100000

            return int(value)

    return None


def extract_age(text):
    match = re.search(r'\b(?:age|aged|उम्र|आयु)\s*(?:is|of)?\s*(\d{1,3})\b', text.lower())

    if match:
        return int(match.group(1))

    return 25


def extract_purpose(text):
    text = text.lower()

    business_words = [
        "business",
        "shop",
        "store",
        "startup",
        "enterprise",
        "company",
        "business शुरू",
        "कारोबार",
        "व्यवसाय",
        "दुकान",
        "कारोबार शुरू",
        "व्यापार",
        "ਕਾਰੋਬਾਰ",
        "ਦੁਕਾਨ",
        "business shuru"
    ]

    education_words = [
        "education",
        "college",
        "university",
        "study",
        "course",
        "student",
        "degree",
        "school",
        "पढ़ाई",
        "शिक्षा",
        "कॉलेज",
        "विश्वविद्यालय",
        "पढ़ना",
        "ਪੜ੍ਹਾਈ",
        "ਕਾਲਜ"
    ]

    for word in business_words:
        if word in text:
            return "business"

    for word in education_words:
        if word in text:
            return "education"

    return "other"


def extract_category(text):
    text = text.lower()

    if "scheduled caste" in text or "sc" in text:
        return "SC"

    if "अनुसूचित जाति" in text or "एससी" in text:
        return "SC"

    if "ਅਨੁਸੂਚਿਤ ਜਾਤੀ" in text or "ਐਸਸੀ" in text:
        return "SC"

    return "SC"


def parse_user_input(text):
    income = extract_income(text)
    loan_amount = extract_loan_amount(text)

    return {
        "purpose": extract_purpose(text),
        "income": income,
        "loan_amount": loan_amount,
        "age": extract_age(text),
        "category": extract_category(text),
        "raw_text": text
    }