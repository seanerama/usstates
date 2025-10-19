import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAME_MODES, DIFFICULTIES, GameMode, Difficulty } from '../types';
import '../App.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('hard');

  const startGame = (mode: GameMode, difficulty: Difficulty) => {
    navigate(`/game?mode=${mode}&difficulty=${difficulty}`);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-hero">
          <h1 className="home-title">Learn US States & Capitals</h1>
          <p className="home-description">
            Test your knowledge of US geography through an interactive map-based game.
            Answer clues, click states, and climb the leaderboard!
          </p>
        </div>

        {!selectedMode ? (
          <>
            <h2 className="section-title">Choose Your Region</h2>
            <div className="game-modes-grid">
              {Object.entries(GAME_MODES).map(([key, label]) => (
                <button
                  key={key}
                  className="game-mode-card"
                  onClick={() => setSelectedMode(key as GameMode)}
                  aria-label={`Select ${label}`}
                >
                  <div className="mode-icon">
                    {key === 'full_usa' ? '🇺🇸' : '🗺️'}
                  </div>
                  <h3 className="mode-title">{label}</h3>
                  <p className="mode-description">
                    {key === 'full_usa'
                      ? 'Test your knowledge of all 50 states'
                      : `Focus on the ${label.replace(' Region', '')} states`}
                  </p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="difficulty-selection">
            <h2 className="section-title">Choose Difficulty</h2>
            <p className="difficulty-subtitle">Selected: {GAME_MODES[selectedMode]}</p>

            <div className="difficulty-grid">
              {Object.entries(DIFFICULTIES).map(([key, { name, description }]) => (
                <button
                  key={key}
                  className={`difficulty-card ${selectedDifficulty === key ? 'selected' : ''}`}
                  onClick={() => setSelectedDifficulty(key as Difficulty)}
                  aria-label={`Select ${name} difficulty`}
                >
                  <div className="difficulty-icon">
                    {key === 'easy' ? '⭐' : key === 'medium' ? '⭐⭐' : '⭐⭐⭐'}
                  </div>
                  <h3 className="difficulty-name">{name}</h3>
                  <p className="difficulty-description">{description}</p>
                </button>
              ))}
            </div>

            <div className="action-buttons">
              <button
                className="btn-secondary"
                onClick={() => setSelectedMode(null)}
              >
                ← Back to Regions
              </button>
              <button
                className="btn-primary"
                onClick={() => startGame(selectedMode, selectedDifficulty)}
              >
                Start Game →
              </button>
            </div>
          </div>
        )}

        <div className="features-section">
          <h2>How to Play</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Read the Clue</h3>
              <p>Each state has 3 clues of increasing difficulty</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Click the State</h3>
              <p>Find and click the correct state on the map</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Earn Points</h3>
              <p>Get 5 points for correct first try, fewer for hints/retries</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Top the Leaderboard</h3>
              <p>Compete for the highest score and fastest time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
