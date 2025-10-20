import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GameMode, Difficulty, GAME_MODES, DIFFICULTIES } from '../../types';
import './Auth.css';

interface QuickPlayProps {
  onClose: () => void;
}

const QuickPlay: React.FC<QuickPlayProps> = ({ onClose }) => {
  const [step, setStep] = useState<'region' | 'difficulty'>('region');
  const [selectedMode, setSelectedMode] = useState<GameMode>('full_usa');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('hard');
  const navigate = useNavigate();

  const handleRegionSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setStep('difficulty');
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    // Navigate directly to game - no authentication needed!
    const gameUrl = `/game?mode=${selectedMode}&difficulty=${difficulty}&anonymous=true`;
    console.log('=== QUICK PLAY - Navigating to:', gameUrl);
    navigate(gameUrl);
    onClose();
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
              Selected: {GAME_MODES[selectedMode]} - Choose difficulty and start playing!
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
            <p style={{ fontSize: '13px', color: '#888', marginTop: '16px', textAlign: 'center' }}>
              Your score won't be saved to the leaderboard unless you register after playing.
            </p>
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

        <button className="close-modal-btn" onClick={onClose} aria-label="Close">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QuickPlay;
