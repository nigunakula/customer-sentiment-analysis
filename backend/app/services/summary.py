def generate_summary(text: str):

    text_lower = text.lower()

    if "frustrated" in text_lower or "angry" in text_lower:
        return (
            "Customer expressed frustration regarding "
            "an unresolved support issue."
        )

    if "disappointed" in text_lower:
        return (
            "Customer reported dissatisfaction with "
            "service quality and issue resolution."
        )

    if "thank you" in text_lower or "appreciate" in text_lower:
        return (
            "Customer expressed satisfaction and "
            "confirmed positive support experience."
        )

    if "worried" in text_lower:
        return (
            "Customer expressed concern regarding "
            "an account or service issue."
        )

    return (
        "Customer interaction analyzed "
        "successfully."
    )