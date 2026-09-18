import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import HistoryPage from './components/HistoryPage';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'home' ? <HomePage /> : <HistoryPage />}
      </main>

      {/* Clean Footer */}
      <footer className="footer">
        <p>Customer Sentiment Analysis System • Built with React & FastAPI</p>
      </footer>
    </div>
  );
}
