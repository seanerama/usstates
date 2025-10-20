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
  const isAnonymous = searchParams.get('anonymous') === 'true';

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

        {isAnonymous && (
          <div className="anonymous-prompt" style={{
            background: 'linear-gradient(135deg, #ffd700 0%, #ffb700 100%)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Want to save your score?</h3>
            <p style={{ color: '#555', marginBottom: '16px' }}>
              Register an account to save your scores to the leaderboard and track your progress!
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={() => navigate('/register')}
                style={{ minWidth: '140px' }}
              >
                Register Now
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate('/login')}
                style={{ minWidth: '140px' }}
              >
                Login
              </button>
            </div>
          </div>
        )}

        <div className="results-actions">
          <button
            className="btn-primary"
            onClick={() => navigate(`/game?mode=${mode}&difficulty=${searchParams.get('difficulty') || 'hard'}&anonymous=true`)}
          >
            Play Again
          </button>
          {!isAnonymous && (
            <button
              className="btn-secondary"
              onClick={() => navigate('/leaderboard')}
            >
              View Leaderboard
            </button>
          )}
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
