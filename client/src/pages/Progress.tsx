import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { StateProgress } from '../types';
import '../App.css';

const Progress: React.FC = () => {
  const [states, setStates] = useState<StateProgress[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterRegion, setFilterRegion] = useState<string>('all');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const data = await userAPI.getProgress();
      setStates(data.states);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMasteryLevel = (accuracy: number, attempts: number): string => {
    if (attempts === 0) return 'Not Attempted';
    if (accuracy >= 80 && attempts >= 3) return 'Mastered';
    if (accuracy >= 60) return 'Proficient';
    if (accuracy >= 40) return 'Learning';
    return 'Needs Practice';
  };

  const getMasteryColor = (level: string): string => {
    switch (level) {
      case 'Mastered': return '#4CAF50';
      case 'Proficient': return '#8BC34A';
      case 'Learning': return '#FFC107';
      case 'Needs Practice': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const filteredStates = filterRegion === 'all'
    ? states
    : states.filter(s => {
        const state = states.find(st => st.state_id === s.state_id);
        return state; // In a real app, you'd filter by region here
      });

  if (loading) {
    return (
      <div className="progress-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h1>Your Progress</h1>
        <p className="progress-subtitle">Track your learning across all 50 states</p>
      </div>

      {summary && (
        <div className="progress-summary">
          <div className="summary-card">
            <div className="summary-value">{summary.attemptedStates}</div>
            <div className="summary-label">States Attempted</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{summary.masteredStates}</div>
            <div className="summary-label">States Mastered</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{summary.overallProgress}%</div>
            <div className="summary-label">Overall Progress</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{summary.totalStates}</div>
            <div className="summary-label">Total States</div>
          </div>
        </div>
      )}

      <div className="progress-content">
        <div className="progress-grid">
          {filteredStates.map((state) => {
            const masteryLevel = getMasteryLevel(state.accuracy_percentage, state.times_attempted);
            const masteryColor = getMasteryColor(masteryLevel);

            return (
              <div key={state.state_id} className="progress-card">
                <div className="progress-card-header">
                  <h3>{state.name}</h3>
                  <span
                    className="mastery-badge"
                    style={{ backgroundColor: masteryColor }}
                  >
                    {masteryLevel}
                  </span>
                </div>
                <div className="progress-card-body">
                  <div className="progress-stat">
                    <span className="stat-label">Capital:</span>
                    <span className="stat-value">{state.capital}</span>
                  </div>
                  <div className="progress-stat">
                    <span className="stat-label">Attempts:</span>
                    <span className="stat-value">{state.times_attempted}</span>
                  </div>
                  <div className="progress-stat">
                    <span className="stat-label">Correct:</span>
                    <span className="stat-value">{state.times_correct}</span>
                  </div>
                  {state.times_attempted > 0 && (
                    <div className="progress-stat">
                      <span className="stat-label">Accuracy:</span>
                      <span className="stat-value">{state.accuracy_percentage}%</span>
                    </div>
                  )}
                  {state.last_attempted && (
                    <div className="progress-stat">
                      <span className="stat-label">Last Played:</span>
                      <span className="stat-value">
                        {new Date(state.last_attempted).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Progress;
