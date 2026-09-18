def analyze_emotion(text: str):

    text = text.lower()

    anger_words = [
        "angry",
        "frustrated",
        "annoyed",
        "terrible",
        "worst",
        "furious",
        "irritated"
    ]

    sadness_words = [
        "sad",
        "upset",
        "disappointed",
        "unhappy",
        "depressed"
    ]

    happy_words = [
        "happy",
        "great",
        "excellent",
        "thank you",
        "thanks",
        "thankful",
        "appreciate",
        "appreciated",
        "good service"
    ]

    fear_words = [
        "worried",
        "fear",
        "concerned",
        "anxious",
        "scared"
    ]

    if any(word in text for word in anger_words):
        return "ANGER"

    if any(word in text for word in sadness_words):
        return "SADNESS"

    if any(word in text for word in fear_words):
        return "FEAR"

    if any(word in text for word in happy_words):
        return "HAPPY"

    return "NEUTRAL"