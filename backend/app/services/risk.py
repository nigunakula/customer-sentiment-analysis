def calculate_risk(
    sentiment,
    emotion
):

    if sentiment == "NEGATIVE" and emotion == "ANGER":
        return "HIGH"

    if sentiment == "NEGATIVE" and emotion == "FEAR":
        return "HIGH"

    if sentiment == "NEGATIVE" and emotion == "SADNESS":
        return "MEDIUM"

    if sentiment == "POSITIVE" and emotion in [
        "ANGER",
        "SADNESS",
        "FEAR"
    ]:
        return "MEDIUM"

    if sentiment == "POSITIVE" and emotion == "HAPPY":
        return "LOW"

    if sentiment == "NEUTRAL":
        return "MEDIUM"

    return "MEDIUM"