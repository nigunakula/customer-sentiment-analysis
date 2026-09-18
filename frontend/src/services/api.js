import axios from 'axios';

// When served directly from FastAPI (port 8000), use relative path.
// When running separately in Vite dev (port 5173), target port 8000.
const API_BASE_URL =
  typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://localhost:8000'
    : '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Send transcript to analyze sentiment, emotion, summary, and risk.
 * @param {string} transcript - The customer call transcript text.
 * @returns {Promise<object>} The analysis result.
 */
export const analyzeTranscript = async (transcript) => {
  const response = await apiClient.post('/analyze', { transcript });
  return response.data;
};

/**
 * Fetch past call analyses from the database.
 * @returns {Promise<Array>} List of call records.
 */
export const fetchCalls = async () => {
  const response = await apiClient.get('/calls');
  return response.data;
};

export default apiClient;
