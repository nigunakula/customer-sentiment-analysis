from app.services.sentiment import analyze_sentiment
from app.services.emotion import analyze_emotion
from app.services.summary import generate_summary
from app.services.risk import calculate_risk


def sentiment_node(state):

    print("Running Sentiment Node")

    state["sentiment"] = analyze_sentiment(
        state["transcript"]
    )

    return state


def emotion_node(state):

    print("Running Emotion Node")

    state["emotion"] = analyze_emotion(
        state["transcript"]
    )

    return state


def summary_node(state):

    print("Running Summary Node")

    state["summary"] = generate_summary(
        state["transcript"]
    )

    return state


def risk_node(state):

    print("Running Risk Node")

    state["risk"] = calculate_risk(
        state["sentiment"]["label"],
        state["emotion"]
    )

    return state