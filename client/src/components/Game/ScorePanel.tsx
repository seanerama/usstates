import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../../services/api';
import { GameMode } from '../../types';
import './Game.css';

interface ScorePanelProps {
  gameMode: GameMode;
  currentScore: number;
  elapsedTime: number;
}

const ScorePanel: React.FC<ScorePanelProps> = ({ gameMode, currentScore, elapsedTime }) => {
  const [topScores, setTopScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopScores();
  }, [gameMode]);

  const fetchTopScores = async () => {
    try {
      const data = await leaderboardAPI.getTopFive(gameMode);
      setTopScores(data.topScores);
    } catch (error) {
      console.error('Error fetching top scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="score-panel" role="region" aria-label="Current game statistics">
      <div className="panel-section">
        <h2 className="panel-title">Session Stats</h2>
        <div className="session-stats">
          <div className="stat-box">
            <div className="stat-label">Score</div>
            <div className="stat-value large">{currentScore}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Time</div>
            <div className="stat-value large">{formatTime(elapsedTime)}</div>
          </div>
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-subtitle">Top 5 Leaderboard</h3>
        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : topScores.length > 0 ? (
          <ol className="mini-leaderboard">
            {topScores.map((entry, index) => (
              <li key={index} className="mini-leaderboard-item">
                <span className="rank-badge">#{index + 1}</span>
                <div className="leader-info">
                  <div className="leader-name">{entry.username}</div>
                  <div className="leader-stats">
                    {entry.score} pts • {formatTime(entry.time_seconds)}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="no-data-message">No scores yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default ScorePanel;
