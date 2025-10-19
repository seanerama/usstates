import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GameMode, Difficulty, GAME_MODES, DIFFICULTIES } from '../../types';
import './Auth.css';

interface QuickPlayProps {
  onClose: () => void;
}

const QuickPlay: React.FC<QuickPlayProps> = ({ onClose }) => {
  const [step, setStep] = useState<'region' | 'difficulty' | 'username'>('region');
  const [selectedMode, setSelectedMode] = useState<GameMode>('full_usa');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('hard');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { guestLogin } = useAuth();

  const handleRegionSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setStep('difficulty');
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setStep('username');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await guestLogin(username);
      // Navigate to game
      navigate(`/game?mode=${selectedMode}&difficulty=${selectedDifficulty}`);
    } catch (error) {
      // Error is handled in AuthContext with toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-card quick-play-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="auth-subtitle">⚡ Quick Play</h2>

        {step === 'region' && (
          <>
            <p className="quick-play-description">
              Choose your region to get started - no login required!
            </p>
            <div style={{ marginTop: '20px' }}>
              {Object.entries(GAME_MODES).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleRegionSelect(key as GameMode)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    marginBottom: '10px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    textAlign: 'left'
                  }}
                >
                  {key === 'full_usa' ? '🇺🇸' : '🗺️'} {label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'difficulty' && (
          <>
            <p className="quick-play-description">
              Selected: {GAME_MODES[selectedMode]} - Choose difficulty
            </p>
            <div style={{ marginTop: '20px' }}>
              {Object.entries(DIFFICULTIES).map(([key, { name, description }]) => (
                <button
                  key={key}
                  onClick={() => handleDifficultySelect(key as Difficulty)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    marginBottom: '10px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    textAlign: 'left'
                  }}
                >
                  {key === 'easy' ? '⭐' : key === 'medium' ? '⭐⭐' : '⭐⭐⭐'} {name}
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>{description}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('region')}
              style={{
                marginTop: '10px',
                background: 'none',
                border: 'none',
                color: '#4a90e2',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back to regions
            </button>
          </>
        )}

        {step === 'username' && (
          <>
            <p className="quick-play-description">
              Almost there! Enter a username to save your score to the leaderboard.
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
                  Choose any name - it doesn't need to be unique!
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

            <button
              onClick={() => setStep('difficulty')}
              style={{
                marginTop: '10px',
                background: 'none',
                border: 'none',
                color: '#4a90e2',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back to difficulty
            </button>
          </>
        )}

        <button className="close-modal-btn" onClick={onClose} aria-label="Close">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QuickPlay;
