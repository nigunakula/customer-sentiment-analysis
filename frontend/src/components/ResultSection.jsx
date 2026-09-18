import React from 'react';

/**
 * Helper to determine badge color class based on sentiment label.
 */
const getSentimentBadgeClass = (label) => {
  const normalized = (label || '').toUpperCase();
  if (normalized === 'POSITIVE') return 'badge-positive';
  if (normalized === 'NEGATIVE') return 'badge-negative';
  return 'badge-neutral';
};

/**
 * Helper to determine badge color class based on risk level.
 */
const getRiskBadgeClass = (risk) => {
  const normalized = (risk || '').toUpperCase();
  if (normalized === 'HIGH') return 'badge-risk-high';
  if (normalized === 'MEDIUM') return 'badge-risk-medium';
  return 'badge-risk-low';
};

/**
 * Helper to return a friendly emoji for common emotions.
 */
const getEmotionEmoji = (emotion) => {
  const map = {
    ANGER: '😠',
    ANGRY: '😠',
    HAPPY: '😊',
    JOY: '😄',
    SADNESS: '😢',
    SAD: '😢',
    FEAR: '😨',
    SURPRISE: '😲',
    DISGUST: '🤢',
    NEUTRAL: '😐',
  };
  return map[(emotion || '').toUpperCase()] || '💬';
};

export default function ResultSection({ result }) {
  if (!result) return null;

  const sentimentLabel = result.sentiment?.label || 'UNKNOWN';
  const sentimentScore =
    result.sentiment?.score !== undefined
      ? Number(result.sentiment.score).toFixed(3)
      : null;

  const emotion = result.emotion || 'UNKNOWN';
  const risk = result.risk || 'LOW';
  const summary = result.summary || 'No summary available.';

  return (
    <div className="result-card">
      <div className="result-header">
        <div className="result-header-title">
          <span className="result-icon">📊</span>
          <h3>Analysis Result</h3>
        </div>
        <span className="timestamp-tag">Just Analyzed</span>
      </div>

      <div className="metrics-grid">
        {/* Sentiment Card */}
        <div className="metric-box">
          <div className="metric-label">Sentiment</div>
          <div className="metric-content">
            <span className={`badge ${getSentimentBadgeClass(sentimentLabel)}`}>
              {sentimentLabel}
            </span>
            {sentimentScore !== null && (
              <span className="score-text">Score: {sentimentScore}</span>
            )}
          </div>
        </div>

        {/* Emotion Card */}
        <div className="metric-box">
          <div className="metric-label">Emotion</div>
          <div className="metric-content">
            <span className="badge badge-emotion">
              <span className="emotion-emoji">{getEmotionEmoji(emotion)}</span>
              {emotion}
            </span>
          </div>
        </div>

        {/* Risk Level Card */}
        <div className="metric-box">
          <div className="metric-label">Risk Level</div>
          <div className="metric-content">
            <span className={`badge ${getRiskBadgeClass(risk)}`}>
              ⚠️ {risk}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="summary-section">
        <h4 className="summary-title">Executive Summary</h4>
        <div className="summary-text-box">
          <p>{summary}</p>
        </div>
      </div>
    </div>
  );
}
