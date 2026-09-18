from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()


def analyze_sentiment(text: str):

    text_lower = text.lower()

    negative_keywords = [
        "not resolved",
        "unresolved",
        "disappointed",
        "frustrated",
        "angry",
        "worst",
        "complaint",
        "poor service",
        "nobody helped",
        "nobody resolved",
        "bad service",
        "terrible",
        "delay",
        "delayed",
        "still waiting",
        "waiting for days",
        "issue not fixed",
        "problem not solved"
    ]

    positive_keywords = [
        "thank you",
        "thanks",
        "great",
        "excellent",
        "happy",
        "issue resolved",
        "problem solved",
        "good service",
        "helpful",
        "appreciate",
        "appreciated",
        "support was helpful"
    ]

    # NEGATIVE gets highest priority
    if any(keyword in text_lower for keyword in negative_keywords):
        return {
            "label": "NEGATIVE",
            "score": -0.80
        }

    # POSITIVE only if no negative indicators exist
    if any(keyword in text_lower for keyword in positive_keywords):
        return {
            "label": "POSITIVE",
            "score": 0.80
        }

    scores = analyzer.polarity_scores(text)

    compound = scores["compound"]

    if compound >= 0.05:
        label = "POSITIVE"

    elif compound <= -0.05:
        label = "NEGATIVE"

    else:
        label = "NEUTRAL"

    return {
        "label": label,
        "score": round(compound, 4)
    }
