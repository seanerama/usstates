import React from 'react';
import './Game.css';

interface CluePanelProps {
  clue: string;
  clueLevel: number;
  canRequestHint: boolean;
  onRequestHint: () => void;
  currentScore: number;
  statesRemaining: number;
  totalStates: number;
}

const CluePanel: React.FC<CluePanelProps> = ({
  clue,
  clueLevel,
  canRequestHint,
  onRequestHint,
  currentScore,
  statesRemaining,
  totalStates
}) => {
  return (
    <div className="clue-panel" role="region" aria-label="Game information">
      <div className="panel-section">
        <h2 className="panel-title">Current Clue</h2>
        <div className="clue-display" aria-live="polite" aria-atomic="true">
          <div className="clue-level-indicator">
            <span className="clue-badge">Clue {clueLevel}/3</span>
          </div>
          <p className="clue-text">{clue}</p>
        </div>
      </div>

      <div className="panel-section">
        <div className="hint-section">
          <button
            className="hint-button"
            onClick={onRequestHint}
            disabled={!canRequestHint}
            aria-label="Request hint"
            title={canRequestHint ? 'Get an easier clue (-1 point)' : 'No more hints available'}
          >
            💡 Need a Hint?
          </button>
          {canRequestHint && (
            <small className="hint-note">Costs 1 point</small>
          )}
        </div>
      </div>

      <div className="panel-section">
        <div className="score-display">
          <div className="stat-item">
            <span className="stat-label">Current Score</span>
            <span className="stat-value score-value">{currentScore}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">States Remaining</span>
            <span className="stat-value">
              {statesRemaining} / {totalStates}
            </span>
          </div>
        </div>
      </div>

      <div className="panel-section scoring-info">
        <h3 className="info-title">Scoring</h3>
        <ul className="scoring-list">
          <li>✅ First try, no hint: <strong>5 pts</strong></li>
          <li>💡 First try, with hint: <strong>4 pts</strong></li>
          <li>🔄 Second try: <strong>2 pts</strong></li>
          <li>❌ Failed: <strong>0 pts</strong></li>
        </ul>
      </div>
    </div>
  );
};

export default CluePanel;
