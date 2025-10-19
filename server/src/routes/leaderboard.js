const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/leaderboard/:gameMode
 * Get leaderboard for a specific game mode with optional time filter
 * Query params: filter=all|week|month
 */
router.get('/:gameMode', authenticateToken, async (req, res) => {
  const { gameMode } = req.params;
  const { filter = 'all' } = req.query;

  const validGameModes = ['full_usa', 'northeast', 'mid_atlantic', 'southeast', 'midwest', 'southwest', 'west'];
  if (!validGameModes.includes(gameMode)) {
    return res.status(400).json({ error: 'Invalid game mode' });
  }

  try {
    let dateFilter = '';
    if (filter === 'week') {
      dateFilter = "AND completed_at > NOW() - INTERVAL '7 days'";
    } else if (filter === 'month') {
      dateFilter = "AND completed_at > NOW() - INTERVAL '30 days'";
    }

    // Get top 20 scores with user information
    const result = await pool.query(
      `SELECT
        s.id,
        s.score,
        s.time_seconds,
        s.completed_at,
        u.username,
        u.id as user_id,
        ROW_NUMBER() OVER (ORDER BY s.score DESC, s.time_seconds ASC) as rank
       FROM scores s
       JOIN users u ON s.user_id = u.id
       WHERE s.game_mode = $1 ${dateFilter}
       ORDER BY s.score DESC, s.time_seconds ASC
       LIMIT 20`,
      [gameMode]
    );

    // Check current user's best score and rank
    const userBestScore = await pool.query(
      `SELECT
        s.score,
        s.time_seconds,
        s.completed_at,
        (
          SELECT COUNT(*) + 1
          FROM scores s2
          WHERE s2.game_mode = $1 ${dateFilter}
          AND (s2.score > s.score OR (s2.score = s.score AND s2.time_seconds < s.time_seconds))
        ) as rank
       FROM scores s
       WHERE s.user_id = $2 AND s.game_mode = $1 ${dateFilter}
       ORDER BY s.score DESC, s.time_seconds ASC
       LIMIT 1`,
      [gameMode, req.user.userId]
    );

    res.json({
      leaderboard: result.rows,
      userBest: userBestScore.rows.length > 0 ? userBestScore.rows[0] : null
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

/**
 * GET /api/leaderboard/:gameMode/top5
 * Get top 5 scores for quick preview (for sidebar)
 */
router.get('/:gameMode/preview/top5', authenticateToken, async (req, res) => {
  const { gameMode } = req.params;

  const validGameModes = ['full_usa', 'northeast', 'mid_atlantic', 'southeast', 'midwest', 'southwest', 'west'];
  if (!validGameModes.includes(gameMode)) {
    return res.status(400).json({ error: 'Invalid game mode' });
  }

  try {
    const result = await pool.query(
      `SELECT
        s.score,
        s.time_seconds,
        u.username
       FROM scores s
       JOIN users u ON s.user_id = u.id
       WHERE s.game_mode = $1
       ORDER BY s.score DESC, s.time_seconds ASC
       LIMIT 5`,
      [gameMode]
    );

    res.json({ topScores: result.rows });
  } catch (error) {
    console.error('Error fetching top scores:', error);
    res.status(500).json({ error: 'Failed to fetch top scores' });
  }
});

module.exports = router;
