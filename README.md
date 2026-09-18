# Customer Sentiment Analysis from Call Logs

## About the Project

Customer Sentiment Analysis from Call Logs is a web application that helps organizations analyze customer conversations and understand customer satisfaction levels.

The system processes customer call transcripts and automatically determines:

- Sentiment (Positive, Negative, Neutral)
- Emotion (Happy, Sadness, Anger, Fear)
- Risk Level (Low, Medium, High)

The goal is to help support teams quickly identify dissatisfied customers and prioritize high-risk cases.

---

## Features

✅ Sentiment Analysis

✅ Emotion Detection

✅ Risk Classification

✅ Call History Tracking

✅ LangGraph Workflow Integration

✅ SQLite Database Storage

✅ React-Based User Interface

---

## Tech Stack

### Frontend
- React
- JavaScript
- Axios

### Backend
- FastAPI
- Python

### Workflow
- LangGraph

### Database
- SQLite

### NLP
- VADER Sentiment Analysis

---

## Architecture

```text
Transcript Input
        |
        v
     React UI
        |
        v
     FastAPI
        |
        v
    LangGraph
        |
        +--> Sentiment Analysis
        |
        +--> Emotion Detection
        |
        +--> Summary Generation
        |
        +--> Risk Classification
        |
        v
      SQLite
```

---

## Sample Input

```text
I have contacted customer support multiple times.
Nobody resolved my issue.
I am very frustrated.
```

## Sample Output

```text
Sentiment : NEGATIVE

Emotion   : ANGER

Risk      : HIGH
```

---

## Project Structure

```text
customer-sentiment-analysis/

backend/
│
├── app/
├── main.py
├── requirements.txt

frontend/
│
├── src/
├── public/
└── package.json
```

---

## APIs

### Analyze Transcript

```http
POST /analyze
```

### Get Call History

```http
GET /calls
```

---

## Future Enhancements

- Advanced Emotion Detection Models
- LLM-Based Summarization
- Real-Time Analytics Dashboard
- MySQL/PostgreSQL Integration
- Multi-Language Support

---

## Author

Nigun Akula
