import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header" role="banner">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-logo" onClick={() => navigate('/')}>
            🗺️ US States Game
          </h1>
        </div>

        <nav className="header-nav" role="navigation" aria-label="Main navigation">
          <button
            className="nav-link"
            onClick={() => navigate('/')}
            aria-label="Go to home"
          >
            Play
          </button>
          <button
            className="nav-link"
            onClick={() => navigate('/leaderboard')}
            aria-label="View leaderboard"
          >
            Leaderboard
          </button>
          <button
            className="nav-link"
            onClick={() => navigate('/progress')}
            aria-label="View your progress"
          >
            Progress
          </button>
        </nav>

        <div className="header-right">
          <span className="username-display" aria-label="Current user">
            👤 {user?.username}
          </span>
          <button
            className="logout-button"
            onClick={handleLogout}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
