import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_NAME = os.path.join(BASE_DIR, "calls.db")


def create_table():

    conn = sqlite3.connect(DB_NAME)

    conn.execute("""
    CREATE TABLE IF NOT EXISTS calls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transcript TEXT,
        sentiment TEXT,
        sentiment_score REAL,
        emotion TEXT,
        summary TEXT,
        risk TEXT
    )
    """)

    conn.commit()
    conn.close()


def save_call(
    transcript,
    sentiment,
    sentiment_score,
    emotion,
    summary,
    risk
):

    conn = sqlite3.connect(DB_NAME)

    conn.execute("""
    INSERT INTO calls(
        transcript,
        sentiment,
        sentiment_score,
        emotion,
        summary,
        risk
    )
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        transcript,
        sentiment,
        sentiment_score,
        emotion,
        summary,
        risk
    ))

    conn.commit()
    conn.close()


def get_all_calls():

    conn = sqlite3.connect(DB_NAME)

    cursor = conn.execute(
        "SELECT * FROM calls"
    )

    rows = cursor.fetchall()

    conn.close()

    return rows