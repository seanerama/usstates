import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { GameMode, GAME_MODES, LeaderboardEntry } from '../../types';
import './Leaderboard.css';

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [gameMode, setGameMode] = useState<GameMode>('full_usa');
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userBest, setUserBest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [gameMode, filter]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await leaderboardAPI.getLeaderboard(gameMode, filter);
      setLeaderboard(data.leaderboard);
      setUserBest(data.userBest);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>Leaderboard</h1>
        <p className="leaderboard-subtitle">Top 20 Players</p>
      </div>

      <div className="leaderboard-controls">
        <div className="control-group">
          <label htmlFor="game-mode-select">Game Mode:</label>
          <select
            id="game-mode-select"
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value as GameMode)}
            className="mode-select"
            aria-label="Select game mode"
          >
            {Object.entries(GAME_MODES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="time-filter-select">Time Period:</label>
          <select
            id="time-filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'week' | 'month')}
            className="filter-select"
            aria-label="Select time period"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {userBest && (
        <div className="user-best-score">
          <h3>Your Best Score</h3>
          <div className="best-score-content">
            <span className="best-rank">Rank #{userBest.rank}</span>
            <span className="best-score">{userBest.score} points</span>
            <span className="best-time">{formatTime(userBest.time_seconds)}</span>
            <span className="best-date">{formatDate(userBest.completed_at)}</span>
          </div>
        </div>
      )}

      <div className="leaderboard-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading leaderboard...</p>
          </div>
        ) : leaderboard.length > 0 ? (
          <table className="leaderboard-table" role="table" aria-label="Leaderboard rankings">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr
                  key={entry.id}
                  className={entry.user_id === user?.id ? 'current-user' : ''}
                >
                  <td className="rank-cell">
                    <span className={`rank-badge rank-${entry.rank}`}>
                      {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                    </span>
                  </td>
                  <td className="username-cell">
                    {entry.username}
                    {entry.user_id === user?.id && <span className="you-badge">You</span>}
                  </td>
                  <td className="score-cell">{entry.score}</td>
                  <td className="time-cell">{formatTime(entry.time_seconds)}</td>
                  <td className="date-cell">{formatDate(entry.completed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data-container">
            <p>No scores yet for this mode and time period.</p>
            <p>Be the first to set a record!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
