import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Map from './Map';
import CluePanel from './CluePanel';
import ScorePanel from './ScorePanel';
import Sidebar from '../Layout/Sidebar';
import { gameAPI } from '../../services/api';
import { GameMode, GameState, SCORING, State, Difficulty } from '../../types';
import './Game.css';

const GameBoard: React.FC = () => {
  console.log('GameBoard component mounted');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const gameMode = (searchParams.get('mode') || 'full_usa') as GameMode;
  const difficulty = (searchParams.get('difficulty') || 'hard') as Difficulty;
  const isAnonymous = searchParams.get('anonymous') === 'true';

  console.log('Game mode:', gameMode, 'Difficulty:', difficulty, 'Anonymous:', isAnonymous);

  const [gameStates, setGameStates] = useState<GameState[]>([]);
  const [allStates, setAllStates] = useState<State[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedStates, setCompletedStates] = useState<Set<string>>(new Set());
  const [incorrectStates, setIncorrectStates] = useState<Set<string>>(new Set());
  const [incorrectState, setIncorrectState] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showStateInfo, setShowStateInfo] = useState(false);
  const [currentStateInfo, setCurrentStateInfo] = useState<State | null>(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameMode, difficulty]);

  useEffect(() => {
    // Update elapsed time every second
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const initializeGame = async () => {
    try {
      setLoading(true);
      console.log('=== INITIALIZING GAME ===');
      console.log('Game mode:', gameMode);
      console.log('Difficulty:', difficulty);
      console.log('Is Anonymous:', isAnonymous);
      console.log('URL params:', searchParams.toString());

      if (isAnonymous) {
        console.log('>>> Starting ANONYMOUS game session');
        // Anonymous play - load states directly from public API without session
        const statesData = await gameAPI.getAllStates();
        console.log('>>> States data received for anonymous user:', statesData.states?.length, 'states');

        // Debug: Show unique regions in the data
        const uniqueRegions = [...new Set(statesData.states.map((s: State) => s.region))];
        console.log('>>> Available regions in data:', uniqueRegions);
        console.log('>>> Sample state:', statesData.states[0]);

        // Filter states by region if not full_usa
        let filteredStates = statesData.states;
        if (gameMode !== 'full_usa') {
          // Use abbreviations to filter by region (matching backend logic)
          const REGIONS: { [key: string]: string[] } = {
            northeast: ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA'],
            mid_atlantic: ['DE', 'MD', 'VA', 'WV', 'DC'],
            southeast: ['NC', 'SC', 'GA', 'FL', 'AL', 'MS', 'TN', 'KY', 'AR', 'LA'],
            midwest: ['OH', 'IN', 'IL', 'MI', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'],
            southwest: ['TX', 'OK', 'NM', 'AZ'],
            west: ['CA', 'NV', 'UT', 'CO', 'WY', 'MT', 'ID', 'OR', 'WA', 'AK', 'HI']
          };

          const regionAbbreviations = REGIONS[gameMode] || [];
          console.log('>>> Filtering by abbreviations:', regionAbbreviations);
          filteredStates = statesData.states.filter((s: State) =>
            regionAbbreviations.includes(s.abbreviation)
          );
          console.log('>>> Filtered states count:', filteredStates.length);
        }

        // Shuffle the states to randomize order each game
        filteredStates = filteredStates.sort(() => Math.random() - 0.5);

        // Generate clues based on difficulty
        const mappedStates = filteredStates.map((s: State) => {
          let clue_1: string;
          let clue_2: string;
          let clue_3: string;

          if (difficulty === 'easy') {
            clue_1 = `State: ${s.name}`;
            clue_2 = `Capital: ${s.capital}`;
            clue_3 = s.clue_1 || 'No clue available';
          } else if (difficulty === 'medium') {
            clue_1 = `Capital: ${s.capital}`;
            clue_2 = s.clue_1 || 'No clue available';
            clue_3 = s.clue_2 || 'No clue available';
          } else {
            clue_1 = s.clue_1 || 'No clue available';
            clue_2 = s.clue_2 || 'No clue available';
            clue_3 = s.clue_3 || 'No clue available';
          }

          return {
            ...s,
            clue_1,
            clue_2,
            clue_3,
            currentClue: clue_1,
            clueLevel: 1,
            attempts: 0,
            hintUsed: false,
            completed: false,
            score: 0
          };
        });

        console.log('>>> Mapped states for game:', mappedStates.length);
        console.log('>>> First state clue check:', mappedStates[0]?.currentClue);

        setSessionId('anonymous');
        setGameStates(mappedStates);
        setAllStates(statesData.states);
      } else {
        // Authenticated play - use backend session
        const [sessionData, statesData] = await Promise.all([
          gameAPI.startSession(gameMode, difficulty),
          gameAPI.getAllStates()
        ]);

        console.log('Session data received:', sessionData);
        console.log('States data received:', statesData);

        setSessionId(sessionData.sessionId);
        const mappedStates = sessionData.states.map((s: any) => ({
          ...s,
          attempts: 0,
          hintUsed: false,
          completed: false,
          score: 0
        }));

        console.log('Mapped game states:', mappedStates);
        setGameStates(mappedStates);
        setAllStates(statesData.states);
      }

      setStartTime(Date.now());
      setTotalScore(0);
      setCurrentIndex(0);
      setCompletedStates(new Set());
    } catch (error: any) {
      console.error('Error initializing game:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error(`Failed to start game: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStateClick = async (clickedAbbr: string) => {
    if (loading || currentIndex >= gameStates.length) return;

    const currentState = gameStates[currentIndex];
    const isCorrect = currentState.abbreviation === clickedAbbr;

    if (isCorrect) {
      await handleCorrectAnswer(currentState);
    } else {
      await handleIncorrectAnswer(currentState, clickedAbbr);
    }
  };

  const handleCorrectAnswer = async (state: GameState) => {
    // Calculate score
    let points = 0;
    if (state.attempts === 0) {
      points = state.hintUsed ? SCORING.CORRECT_FIRST_WITH_HINT : SCORING.CORRECT_FIRST_NO_HINT;
    } else if (state.attempts === 1) {
      points = SCORING.CORRECT_SECOND;
    }

    // Update state
    const updatedStates = [...gameStates];
    updatedStates[currentIndex] = {
      ...state,
      completed: true,
      score: points
    };
    setGameStates(updatedStates);

    // Add to completed
    setCompletedStates(prev => new Set(prev).add(state.abbreviation));
    setTotalScore(prev => prev + points);

    toast.success(`Correct! ${state.name} - ${state.capital} (+${points} points)`, {
      autoClose: 2000
    });

    // Show state info modal
    try {
      const stateData = await gameAPI.getStateById(state.id);
      setCurrentStateInfo(stateData.state);
      setShowStateInfo(true);
    } catch (error) {
      console.error('Error fetching state info:', error);
    }

    // Move to next state after delay
    setTimeout(() => {
      if (currentIndex < gameStates.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setShowStateInfo(false);
      } else {
        // Game complete
        completeGame();
      }
    }, 3000);
  };

  const handleIncorrectAnswer = async (state: GameState, clickedAbbr: string) => {
    // Flash red
    setIncorrectState(clickedAbbr);
    setTimeout(() => setIncorrectState(null), 500);

    const updatedState = { ...state, attempts: state.attempts + 1 };

    // IMPORTANT: Update the gameStates array immediately with the new attempt count
    const updatedStates = [...gameStates];
    updatedStates[currentIndex] = updatedState;
    setGameStates(updatedStates);

    if (updatedState.attempts >= 2) {
      // Failed - reveal answer
      toast.error(`The correct answer was ${state.name}`, {
        autoClose: 3000
      });

      // Update to mark as completed with 0 score
      updatedStates[currentIndex] = { ...updatedState, completed: true, score: 0 };
      setGameStates(updatedStates);

      setCompletedStates(prev => new Set(prev).add(state.abbreviation));
      setIncorrectStates(prev => new Set(prev).add(state.abbreviation));

      // Show state info
      try {
        const stateData = await gameAPI.getStateById(state.id);
        setCurrentStateInfo(stateData.state);
        setShowStateInfo(true);
      } catch (error) {
        console.error('Error fetching state info:', error);
      }

      setTimeout(() => {
        if (currentIndex < gameStates.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setShowStateInfo(false);
        } else {
          completeGame();
        }
      }, 3000);
    } else {
      // Give next clue
      const nextClueLevel = updatedState.clueLevel + 1;
      const nextClueKey = `clue_${nextClueLevel}` as keyof GameState;
      const nextClue = updatedState[nextClueKey] as string;

      if (nextClue) {
        updatedStates[currentIndex] = {
          ...updatedState,
          currentClue: nextClue,
          clueLevel: nextClueLevel
        };
        setGameStates(updatedStates);
        toast.info('Try again with a new clue!');
      }
    }
  };

  const handleRequestHint = () => {
    const currentState = gameStates[currentIndex];

    if (currentState.hintUsed || currentState.clueLevel >= 3 || currentState.attempts > 0) {
      return;
    }

    const nextClueLevel = currentState.clueLevel + 1;
    const nextClueKey = `clue_${nextClueLevel}` as keyof GameState;
    const nextClue = currentState[nextClueKey] as string;

    if (!nextClue) {
      toast.error('No more hints available');
      return;
    }

    const updatedStates = [...gameStates];
    updatedStates[currentIndex] = {
      ...currentState,
      currentClue: nextClue,
      clueLevel: nextClueLevel,
      hintUsed: true
    };
    setGameStates(updatedStates);

    toast.info('Here\'s an easier clue!');
  };

  const completeGame = async () => {
    const timeSeconds = Math.floor((Date.now() - startTime) / 1000);

    if (isAnonymous) {
      // Anonymous user - show score but don't save to leaderboard
      toast.success(`Game complete! Final score: ${totalScore}`, {
        autoClose: 3000
      });

      // Navigate to results with anonymous flag
      setTimeout(() => {
        navigate(`/results?score=${totalScore}&time=${timeSeconds}&mode=${gameMode}&anonymous=true`);
      }, 2000);
    } else {
      // Authenticated user - save score to leaderboard
      try {
        const response = await gameAPI.completeGame(gameMode, totalScore, timeSeconds);

        toast.success(`Game complete! Final score: ${totalScore}`);

        if (response.madeLeaderboard) {
          toast.success(`🎉 You made the leaderboard at #${response.leaderboardPosition}!`, {
            autoClose: 5000
          });
        }

        // Navigate to results after a delay
        setTimeout(() => {
          navigate(`/results?score=${totalScore}&time=${timeSeconds}&mode=${gameMode}`);
        }, 2000);
      } catch (error) {
        toast.error('Failed to save score');
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="game-loading">
        <div className="spinner"></div>
        <p>Loading game...</p>
      </div>
    );
  }

  const currentState = gameStates[currentIndex];
  const statesRemaining = gameStates.length - currentIndex;

  return (
    <div className="game-container">
      <main className="game-main">
        {/* Clue Display - Above the map for mobile-friendly layout */}
        {currentState && (
          <div className="clue-header">
            <div className="clue-header-content">
              <div className="clue-level-indicator">
                <span className="clue-badge">Clue {currentState.clueLevel}</span>
                <span className="progress-badge">
                  {currentIndex + 1} of {gameStates.length}
                </span>
              </div>
              <div className="clue-text-main">
                {currentState.currentClue}
              </div>
              <div className="clue-actions">
                <button
                  className="hint-button-inline"
                  onClick={handleRequestHint}
                  disabled={currentState.hintUsed || currentState.attempts > 0 || currentState.clueLevel >= 3}
                >
                  💡 Get Hint
                </button>
                <div className="score-inline">
                  Score: <strong>{totalScore}</strong> | Time: <strong>{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="map-section">
          <Map
            onStateClick={handleStateClick}
            completedStates={completedStates}
            incorrectStates={incorrectStates}
            incorrectState={incorrectState}
            allStates={allStates}
          />
        </div>

        {/* Stats button for desktop - opens sidebar */}
        <button
          className="stats-toggle-btn"
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          aria-label="Toggle detailed stats"
        >
          📊 Stats
        </button>
      </main>

      {/* Right Sidebar - Detailed stats (optional on mobile) */}
      <Sidebar position="right" isOpen={rightSidebarOpen} onClose={() => setRightSidebarOpen(false)}>
        <ScorePanel
          gameMode={gameMode}
          currentScore={totalScore}
          elapsedTime={elapsedTime}
          isAnonymous={isAnonymous}
        />
      </Sidebar>

      {/* State Info Modal */}
      {showStateInfo && currentStateInfo && (
        <div className="modal-overlay" onClick={() => setShowStateInfo(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{currentStateInfo.name}</h2>
            <div className="state-info-grid">
              <div className="info-item">
                <strong>Capital:</strong> {currentStateInfo.capital}
              </div>
              <div className="info-item">
                <strong>Nickname:</strong> {currentStateInfo.nickname}
              </div>
              <div className="info-item">
                <strong>Population:</strong> {currentStateInfo.population?.toLocaleString()}
              </div>
              <div className="info-item">
                <strong>Region:</strong> {currentStateInfo.region}
              </div>
            </div>
            <button className="modal-close-btn" onClick={() => setShowStateInfo(false)}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
