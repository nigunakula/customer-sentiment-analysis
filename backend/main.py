import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel

from app.graph.workflow import graph


from app.database import (
    create_table,
    save_call,
    get_all_calls
)

app = FastAPI(title="Customer Sentiment Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_table()

class TranscriptRequest(BaseModel):
    transcript: str


@app.get("/api/status")
def api_status():
    return {
        "status": "running"
    }


@app.post("/analyze")
def analyze_customer_call(
    request: TranscriptRequest
):

    transcript = request.transcript

    result = graph.invoke(
        {
            "transcript": transcript
        }
    )

    save_call(
        transcript,
        result["sentiment"]["label"],
        result["sentiment"]["score"],
        result["emotion"],
        result["summary"],
        result["risk"]
    )
    return result

@app.get("/calls")
def fetch_calls():
    raw_calls = get_all_calls()
    formatted_calls = []
    for row in raw_calls:
        if isinstance(row, (list, tuple)):
            formatted_calls.append({
                "id": row[0],
                "transcript": row[1],
                "sentiment": row[2],
                "sentiment_score": row[3],
                "emotion": row[4],
                "summary": row[5],
                "risk": row[6]
            })
        elif isinstance(row, dict):
            formatted_calls.append(row)
    return formatted_calls


# Serve compiled React frontend from single URL (http://localhost:8000)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")

if os.path.exists(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")