import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GAME_MODES, GameMode } from '../types';
import '../App.css';

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const score = parseInt(searchParams.get('score') || '0');
  const timeSeconds = parseInt(searchParams.get('time') || '0');
  const mode = (searchParams.get('mode') || 'full_usa') as GameMode;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = (score: number): string => {
    if (score >= 45) return 'Outstanding! You\'re a geography expert!';
    if (score >= 35) return 'Great job! You know your states well!';
    if (score >= 25) return 'Good work! Keep practicing!';
    if (score >= 15) return 'Not bad! Room for improvement!';
    return 'Keep learning! Practice makes perfect!';
  };

  return (
    <div className="results-container">
      <div className="results-content">
        <div className="results-header">
          <h1 className="results-title">Game Complete!</h1>
          <p className="results-subtitle">{GAME_MODES[mode]}</p>
        </div>

        <div className="results-stats">
          <div className="results-stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-value-large">{score}</div>
              <div className="stat-label">Final Score</div>
            </div>
          </div>

          <div className="results-stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-value-large">{formatTime(timeSeconds)}</div>
              <div className="stat-label">Time Taken</div>
            </div>
          </div>
        </div>

        <div className="performance-message">
          <p>{getPerformanceMessage(score)}</p>
        </div>

        <div className="results-actions">
          <button
            className="btn-primary"
            onClick={() => navigate(`/game?mode=${mode}`)}
          >
            Play Again
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/leaderboard')}
          >
            View Leaderboard
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
