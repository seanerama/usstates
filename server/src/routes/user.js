const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/user/stats
 * Get user's overall game statistics
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get total games played by mode
    const gamesPlayed = await pool.query(
      `SELECT game_mode, COUNT(*) as games_count, AVG(score) as avg_score
       FROM scores
       WHERE user_id = $1
       GROUP BY game_mode`,
      [req.user.userId]
    );

    // Get best scores per mode
    const bestScores = await pool.query(
      `SELECT DISTINCT ON (game_mode)
        game_mode,
        score,
        time_seconds,
        completed_at
       FROM scores
       WHERE user_id = $1
       ORDER BY game_mode, score DESC, time_seconds ASC`,
      [req.user.userId]
    );

    // Get recent games
    const recentGames = await pool.query(
      `SELECT game_mode, score, time_seconds, completed_at
       FROM scores
       WHERE user_id = $1
       ORDER BY completed_at DESC
       LIMIT 10`,
      [req.user.userId]
    );

    res.json({
      gamesPlayed: gamesPlayed.rows,
      bestScores: bestScores.rows,
      recentGames: recentGames.rows
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

/**
 * GET /api/user/progress
 * Get user's state-by-state progress
 */
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        s.id as state_id,
        s.name,
        s.capital,
        s.abbreviation,
        COALESCE(up.times_correct, 0) as times_correct,
        COALESCE(up.times_attempted, 0) as times_attempted,
        up.last_attempted,
        CASE
          WHEN up.times_attempted > 0 THEN
            ROUND((up.times_correct::decimal / up.times_attempted::decimal) * 100, 1)
          ELSE 0
        END as accuracy_percentage
       FROM states s
       LEFT JOIN user_progress up ON s.id = up.state_id AND up.user_id = $1
       ORDER BY s.name`,
      [req.user.userId]
    );

    // Calculate overall progress statistics
    const totalStates = result.rows.length;
    const attemptedStates = result.rows.filter(s => s.times_attempted > 0).length;
    const masteredStates = result.rows.filter(s => s.accuracy_percentage >= 80 && s.times_attempted >= 3).length;

    res.json({
      states: result.rows,
      summary: {
        totalStates,
        attemptedStates,
        masteredStates,
        overallProgress: Math.round((attemptedStates / totalStates) * 100)
      }
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Failed to fetch user progress' });
  }
});

/**
 * GET /api/user/progress/:stateId
 * Get detailed progress for a specific state
 */
router.get('/progress/:stateId', authenticateToken, async (req, res) => {
  const { stateId } = req.params;

  try {
    const result = await pool.query(
      `SELECT
        s.*,
        COALESCE(up.times_correct, 0) as times_correct,
        COALESCE(up.times_attempted, 0) as times_attempted,
        up.last_attempted
       FROM states s
       LEFT JOIN user_progress up ON s.id = up.state_id AND up.user_id = $1
       WHERE s.id = $2`,
      [req.user.userId, stateId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'State not found' });
    }

    res.json({ state: result.rows[0] });
  } catch (error) {
    console.error('Error fetching state progress:', error);
    res.status(500).json({ error: 'Failed to fetch state progress' });
  }
});

module.exports = router;
