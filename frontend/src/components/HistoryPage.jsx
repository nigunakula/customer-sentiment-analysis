import React, { useState, useEffect } from 'react';
import { fetchCalls } from '../services/api';

/**
 * Normalizes call object whether it comes as an array [id, transcript, ...]
 * or as an object { id, transcript, ... }.
 */
const normalizeCall = (item, index) => {
  if (Array.isArray(item)) {
    return {
      id: item[0] ?? index + 1,
      transcript: item[1] ?? '',
      sentiment: item[2] ?? 'N/A',
      score: item[3] !== null && item[3] !== undefined ? Number(item[3]).toFixed(2) : null,
      emotion: item[4] ?? 'N/A',
      summary: item[5] ?? '',
      risk: item[6] ?? 'LOW',
    };
  }

  // Object structure
  const sentimentVal =
    typeof item.sentiment === 'object' && item.sentiment !== null
      ? item.sentiment.label
      : item.sentiment;

  const scoreVal =
    typeof item.sentiment === 'object' && item.sentiment !== null
      ? item.sentiment.score
      : item.sentiment_score;

  return {
    id: item.id ?? index + 1,
    transcript: item.transcript ?? '',
    sentiment: sentimentVal ?? 'N/A',
    score: scoreVal !== null && scoreVal !== undefined ? Number(scoreVal).toFixed(2) : null,
    emotion: item.emotion ?? 'N/A',
    summary: item.summary ?? '',
    risk: item.risk ?? 'LOW',
  };
};

const getSentimentClass = (sentiment) => {
  const val = (sentiment || '').toUpperCase();
  if (val === 'POSITIVE') return 'badge-positive';
  if (val === 'NEGATIVE') return 'badge-negative';
  return 'badge-neutral';
};

const getRiskClass = (risk) => {
  const val = (risk || '').toUpperCase();
  if (val === 'HIGH') return 'badge-risk-high';
  if (val === 'MEDIUM') return 'badge-risk-medium';
  return 'badge-risk-low';
};

export default function HistoryPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadCalls = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCalls();
      const normalized = Array.isArray(data) ? data.map(normalizeCall) : [];
      setCalls(normalized);
    } catch (err) {
      console.error('Error fetching calls:', err);
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Failed to fetch call history. Ensure backend is running at http://localhost:8000.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalls();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="table-header-row">
          <div>
            <h2 className="card-title">Call History & Logs</h2>
            <p className="card-subtitle">
              Past analyzed calls retrieved from the database via <code>GET /calls</code>.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={loadCalls}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        {error && (
          <div className="alert-error" style={{ marginTop: '1rem' }}>
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <span className="spinner" style={{ width: '32px', height: '32px' }} />
            <p>Loading call history from database...</p>
          </div>
        ) : calls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No call records found</h3>
            <p>Go to the Analyze tab to test and save your first call transcript.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th style={{ minWidth: '220px' }}>Transcript</th>
                  <th>Sentiment</th>
                  <th>Emotion</th>
                  <th>Risk</th>
                  <th style={{ minWidth: '200px' }}>Summary</th>
                </tr>
              </thead>
              <tbody>
                {calls.map((call) => {
                  const isExpanded = expandedId === call.id;
                  const isLongTranscript = call.transcript && call.transcript.length > 90;

                  return (
                    <tr key={call.id}>
                      <td className="id-cell">{call.id}</td>
                      <td>
                        <div className="transcript-cell">
                          <p className="transcript-text">
                            {isExpanded || !isLongTranscript
                              ? call.transcript
                              : `${call.transcript.slice(0, 90)}...`}
                          </p>
                          {isLongTranscript && (
                            <button
                              type="button"
                              className="expand-btn"
                              onClick={() => toggleExpand(call.id)}
                            >
                              {isExpanded ? 'Show less' : 'Read more'}
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getSentimentClass(call.sentiment)}`}>
                          {call.sentiment}
                        </span>
                        {call.score !== null && (
                          <div className="score-subtext">({call.score})</div>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-emotion">
                          {call.emotion}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getRiskClass(call.risk)}`}>
                          {call.risk}
                        </span>
                      </td>
                      <td>
                        <div className="summary-cell-text">
                          {call.summary || '—'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
