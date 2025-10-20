const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validateGameCompletion, checkValidation } = require('../middleware/validation');

const router = express.Router();

// Regional state groupings
const REGIONS = {
  northeast: ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA'],
  mid_atlantic: ['DE', 'MD', 'VA', 'WV', 'DC'],
  southeast: ['NC', 'SC', 'GA', 'FL', 'AL', 'MS', 'TN', 'KY', 'AR', 'LA'],
  midwest: ['OH', 'IN', 'IL', 'MI', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'],
  southwest: ['TX', 'OK', 'NM', 'AZ'],
  west: ['CA', 'NV', 'UT', 'CO', 'WY', 'MT', 'ID', 'OR', 'WA', 'AK', 'HI']
};

/**
 * GET /api/game/states
 * Get all states with clues (public endpoint for anonymous play)
 */
router.get('/states', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, capital, region, abbreviation, clue_1, clue_2, clue_3 FROM states ORDER BY name'
    );

    res.json({ states: result.rows });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

/**
 * GET /api/game/states/:id
 * Get detailed information for a specific state (public endpoint)
 */
router.get('/states/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM states WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'State not found' });
    }

    res.json({ state: result.rows[0] });
  } catch (error) {
    console.error('Error fetching state:', error);
    res.status(500).json({ error: 'Failed to fetch state' });
  }
});

/**
 * GET /api/game/regions/:region
 * Get states by region
 */
router.get('/regions/:region', authenticateToken, async (req, res) => {
  const { region } = req.params;

  if (!REGIONS[region]) {
    return res.status(400).json({ error: 'Invalid region' });
  }

  try {
    const abbreviations = REGIONS[region];
    const placeholders = abbreviations.map((_, i) => `$${i + 1}`).join(',');

    const result = await pool.query(
      `SELECT id, name, capital, region, abbreviation FROM states WHERE abbreviation IN (${placeholders}) ORDER BY name`,
      abbreviations
    );

    res.json({ states: result.rows });
  } catch (error) {
    console.error('Error fetching regional states:', error);
    res.status(500).json({ error: 'Failed to fetch regional states' });
  }
});

/**
 * POST /api/game/session/start
 * Start a new game session and get random states
 * Accepts: gameMode, difficulty ('easy', 'medium', 'hard')
 */
router.post('/session/start', authenticateToken, async (req, res) => {
  const { gameMode, difficulty = 'hard' } = req.body;

  try {
    let query;
    let params = [];

    if (gameMode === 'full_usa') {
      // Get 10 random states from all states
      query = 'SELECT id, name, capital, clue_1, clue_2, clue_3, abbreviation FROM states ORDER BY RANDOM() LIMIT 10';
    } else if (REGIONS[gameMode]) {
      // Get states from specific region
      const abbreviations = REGIONS[gameMode];
      const placeholders = abbreviations.map((_, i) => `$${i + 1}`).join(',');
      query = `SELECT id, name, capital, clue_1, clue_2, clue_3, abbreviation FROM states WHERE abbreviation IN (${placeholders}) ORDER BY RANDOM()`;
      params = abbreviations;
    } else {
      return res.status(400).json({ error: 'Invalid game mode' });
    }

    const result = await pool.query(query, params);

    // Generate session ID
    const sessionId = `${Date.now()}_${req.user.userId}`;

    // Generate clues based on difficulty
    const getCluesForDifficulty = (state) => {
      if (difficulty === 'easy') {
        // Easy: State name → Capital → Fact
        return {
          clue_1: `State: ${state.name}`,
          clue_2: `Capital: ${state.capital}`,
          clue_3: state.clue_1  // First fact
        };
      } else if (difficulty === 'medium') {
        // Medium: Capital → Fact → Fact
        return {
          clue_1: `Capital: ${state.capital}`,
          clue_2: state.clue_1,  // First fact
          clue_3: state.clue_2   // Second fact
        };
      } else {
        // Hard: Fact → Fact → Fact (original behavior)
        return {
          clue_1: state.clue_1,
          clue_2: state.clue_2,
          clue_3: state.clue_3
        };
      }
    };

    res.json({
      sessionId,
      difficulty,
      states: result.rows.map(state => {
        const clues = getCluesForDifficulty(state);
        return {
          id: state.id,
          name: state.name,
          capital: state.capital,
          abbreviation: state.abbreviation,
          currentClue: clues.clue_1,
          clue_1: clues.clue_1,
          clue_2: clues.clue_2,
          clue_3: clues.clue_3,
          clueLevel: 1
        };
      })
    });
  } catch (error) {
    console.error('Error starting game session:', error);
    res.status(500).json({ error: 'Failed to start game session' });
  }
});

/**
 * POST /api/game/answer
 * Submit an answer for a state
 */
router.post('/answer', authenticateToken, async (req, res) => {
  const { stateId, guessedStateId, clueLevel } = req.body;

  try {
    const isCorrect = parseInt(stateId) === parseInt(guessedStateId);

    // Fetch the state for the next clue if incorrect
    let nextClue = null;
    if (!isCorrect && clueLevel < 3) {
      const nextClueLevel = clueLevel + 1;
      const result = await pool.query(
        `SELECT clue_${nextClueLevel} as next_clue FROM states WHERE id = $1`,
        [stateId]
      );

      if (result.rows.length > 0) {
        nextClue = result.rows[0].next_clue;
      }
    }

    // Update user progress
    await pool.query(
      `INSERT INTO user_progress (user_id, state_id, times_attempted, times_correct, last_attempted)
       VALUES ($1, $2, 1, $3, NOW())
       ON CONFLICT (user_id, state_id)
       DO UPDATE SET
         times_attempted = user_progress.times_attempted + 1,
         times_correct = user_progress.times_correct + $3,
         last_attempted = NOW()`,
      [req.user.userId, stateId, isCorrect ? 1 : 0]
    );

    res.json({
      isCorrect,
      nextClue,
      nextClueLevel: nextClue ? clueLevel + 1 : clueLevel
    });
  } catch (error) {
    console.error('Error processing answer:', error);
    res.status(500).json({ error: 'Failed to process answer' });
  }
});

/**
 * POST /api/game/hint
 * Request next clue for a state
 * Note: The frontend now manages clues, so this is kept for backward compatibility
 */
router.post('/hint', authenticateToken, async (req, res) => {
  const { stateId, currentClueLevel, nextClue } = req.body;

  try {
    if (currentClueLevel >= 3) {
      return res.status(400).json({ error: 'No more hints available' });
    }

    const nextClueLevel = currentClueLevel + 1;

    // If the frontend already has the next clue (from session start), just return it
    if (nextClue) {
      return res.json({ nextClue, nextClueLevel });
    }

    // Otherwise fetch from database (backward compatibility)
    const result = await pool.query(
      `SELECT clue_${nextClueLevel} as next_clue FROM states WHERE id = $1`,
      [stateId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'State not found' });
    }

    res.json({
      nextClue: result.rows[0].next_clue,
      nextClueLevel
    });
  } catch (error) {
    console.error('Error fetching hint:', error);
    res.status(500).json({ error: 'Failed to fetch hint' });
  }
});

/**
 * POST /api/game/complete
 * Submit final score for a completed game
 */
router.post('/complete', authenticateToken, validateGameCompletion, checkValidation, async (req, res) => {
  const { gameMode, score, timeSeconds } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO scores (user_id, game_mode, score, time_seconds) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.userId, gameMode, score, timeSeconds]
    );

    // Check if this score made it to top 20 leaderboard
    const leaderboardPosition = await pool.query(
      `SELECT COUNT(*) + 1 as position
       FROM scores
       WHERE game_mode = $1
       AND (score > $2 OR (score = $2 AND time_seconds < $3))`,
      [gameMode, score, timeSeconds]
    );

    const position = parseInt(leaderboardPosition.rows[0].position);
    const madeLeaderboard = position <= 20;

    res.json({
      message: 'Score saved successfully',
      score: result.rows[0],
      leaderboardPosition: madeLeaderboard ? position : null,
      madeLeaderboard
    });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

module.exports = router;
