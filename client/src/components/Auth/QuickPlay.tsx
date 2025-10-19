import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GameMode, Difficulty } from '../../types';
import './Auth.css';

interface QuickPlayProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  onClose: () => void;
}

const QuickPlay: React.FC<QuickPlayProps> = ({ gameMode, difficulty, onClose }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { guestLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await guestLogin(username);
      // Navigate to game
      navigate(`/game?mode=${gameMode}&difficulty=${difficulty}`);
    } catch (error) {
      // Error is handled in AuthContext with toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-card quick-play-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="auth-subtitle">Quick Play</h2>
        <p className="quick-play-description">
          Enter a username to start playing. Your score will be saved to the leaderboard!
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              minLength={3}
              maxLength={20}
              aria-label="Enter username"
              placeholder="Enter a username (3-20 characters)"
            />
            <small className="form-hint">
              Choose any name - no password required!
            </small>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading || username.length < 3}
            aria-label="Start playing"
          >
            {loading ? 'Starting...' : 'Start Playing'}
          </button>
        </form>

        <button className="close-modal-btn" onClick={onClose} aria-label="Close">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QuickPlay;
