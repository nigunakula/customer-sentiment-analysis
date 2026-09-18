import React, { useState, useEffect, useRef } from 'react';
import { analyzeTranscript } from '../services/api';
import ResultSection from './ResultSection';

const SAMPLE_TRANSCRIPTS = [
  {
    title: 'Angry Customer',
    icon: '😡',
    text: 'I have called your support team four times already. Nobody resolved my issue and this is the worst experience I have ever had. I am extremely frustrated and want to cancel my subscription right now!',
  },
  {
    title: 'Happy Customer',
    icon: '😊',
    text: 'Hello! I am calling to thank Sarah from your support team. She was incredibly helpful, quick, and polite. Everything is working perfectly now. Thank you so much!',
  },
  {
    title: 'Neutral Inquiry',
    icon: '😐',
    text: 'Hi, I received my monthly invoice and I would like some clarification regarding the standard service fee listed under section two. Could you please explain what that charge covers?',
  },
];

export default function HomePage() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [speechStatus, setSpeechStatus] = useState('idle'); // 'idle' | 'listening' | 'speaking'
  const [speechError, setSpeechError] = useState(null);

  const recognitionRef = useRef(null);

  const SpeechRecognitionAPI =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const handleStartRecording = async () => {
    setError(null);
    setSpeechError(null);

    if (!SpeechRecognitionAPI) {
      setSpeechError(
        'Your browser does not support the Web Speech API. Please use Google Chrome or Microsoft Edge.'
      );
      return;
    }

    // Explicitly prompt for mic permission if mediaDevices is supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Keep stream open briefly to avoid resetting Windows audio endpoint
        setTimeout(() => {
          stream.getTracks().forEach((t) => t.stop());
        }, 1000);
      } catch (err) {
        console.warn('Microphone permission request error:', err);
        setSpeechError(
          'Microphone access blocked. Click the lock/mic icon in your address bar to allow microphone access.'
        );
        return;
      }
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setSpeechStatus('listening');
        setSpeechError(null);
      };

      recognition.onspeechstart = () => {
        setSpeechStatus('speaking');
      };

      recognition.onresult = (event) => {
        let full = '';
        for (let i = 0; i < event.results.length; ++i) {
          full += event.results[i][0].transcript + ' ';
        }
        const clean = full.trim();
        if (clean) {
          setTranscript(clean);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError(
            'Microphone access denied. Please click the lock or camera icon in your browser address bar to allow microphone access.'
          );
          setSpeechStatus('idle');
        } else if (event.error === 'network') {
          setSpeechError(
            'Speech API network error (Google Cloud speech service blocked by corporate VPN/firewall). Use a sample transcript or paste text manually.'
          );
          setSpeechStatus('idle');
        } else if (event.error === 'audio-capture') {
          setSpeechError('No microphone hardware detected on this device.');
          setSpeechStatus('idle');
        } else if (event.error === 'no-speech') {
          // Keep listening
        } else {
          setSpeechError(`Speech recognition message: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setSpeechStatus('idle');
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Error starting recognition:', err);
      setSpeechError('Failed to start speech recognition: ' + err.message);
      setSpeechStatus('idle');
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setSpeechStatus('idle');
  };

  const isRecording =
    speechStatus === 'listening' ||
    speechStatus === 'speaking';

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();

    if (isRecording) {
      handleStopRecording();
    }

    const trimmed = transcript.trim();
    if (!trimmed) {
      setError(
        'Transcript is empty. Please speak into the microphone, type a transcript, or pick a test sample below.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeTranscript(trimmed);
      setResult(data);
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        'Failed to connect to backend server at http://localhost:8000. Please ensure the backend is running.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sampleText) => {
    if (isRecording) handleStopRecording();
    setTranscript(sampleText);
    setError(null);
    setSpeechError(null);
  };

  const handleClear = () => {
    if (isRecording) handleStopRecording();
    setTranscript('');
    setResult(null);
    setError(null);
    setSpeechError(null);
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Analyze Call Transcript</h2>
          <p className="card-subtitle">
            Speak or type a customer call transcript below to detect sentiment, emotion, risk level.
          </p>
        </div>

        {/* Speech Recognition Controls */}
        <div className="speech-controls-bar">
          <div className="speech-buttons">
            <button
              type="button"
              className={`btn btn-record ${isRecording ? 'listening' : ''}`}
              onClick={handleStartRecording}
              disabled={loading || isRecording}
            >
              <span className="mic-icon">🎤</span>
              {isRecording ? 'Listening...' : 'Start Recording'}
            </button>

            <button
              type="button"
              className="btn btn-stop"
              onClick={handleStopRecording}
              disabled={loading || !isRecording}
            >
              <span>⏹️</span> Stop Recording
            </button>

            {isRecording && (
              <span className="recording-status">
                <span className="pulsing-dot" />
                {speechStatus === 'speaking'
                  ? 'Voice detected! Transcribing live...'
                  : 'Microphone active! Speak now...'}
              </span>
            )}
          </div>

          {speechError && (
            <div className="speech-warning" style={{ marginTop: '0.6rem' }}>
              ⚠️ {speechError}
            </div>
          )}

          {!SpeechRecognitionAPI && (
            <div className="speech-warning" style={{ marginTop: '0.6rem' }}>
              ℹ️ Your browser doesn't support the Web Speech API. Chrome or Edge is recommended.
            </div>
          )}
        </div>

        {/* Quick Sample Prompts */}
        <div className="samples-container">
          <span className="samples-label">Quick test samples:</span>
          <div className="samples-buttons">
            {SAMPLE_TRANSCRIPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                className="sample-pill-btn"
                onClick={() => handleSelectSample(sample.text)}
              >
                <span>{sample.icon}</span> {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Transcript Form */}
        <form onSubmit={handleAnalyze} className="transcript-form">
          <div className="form-group">
            <label htmlFor="transcript-input" className="form-label">
              Call Transcript {isRecording && <span className="live-tag">Live Input Active</span>}
            </label>
            <textarea
              id="transcript-input"
              className="transcript-textarea"
              rows={6}
              placeholder="Speak using 'Start Recording' or paste transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Analyzing Call...
                </>
              ) : (
                <>
                  <span>🚀</span> Analyze Transcript
                </>
              )}
            </button>

            {transcript && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Result Section */}
      {result && <ResultSection result={result} />}
    </div>
  );
}
