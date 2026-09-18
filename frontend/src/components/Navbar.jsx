import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => setActiveTab('home')}>
          <div className="navbar-logo">📈</div>
          <div>
            <h1 className="navbar-title">Customer Sentiment Analyzer</h1>
            <p className="navbar-subtitle">AI Call Transcript & Sentiment Intelligence</p>
          </div>
        </div>

        <nav className="navbar-nav">
          <button
            type="button"
            className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <span className="nav-icon">✨</span>
            Analyze Call
          </button>
          <button
            type="button"
            className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span className="nav-icon">📋</span>
            Call History
          </button>
        </nav>
      </div>
    </header>
  );
}
