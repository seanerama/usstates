const pool = require('../config/database');

/**
 * Database initialization script
 * Creates all necessary tables with proper indexes
 */
const initializeDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // States table
    await client.query(`
      CREATE TABLE IF NOT EXISTS states (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        capital VARCHAR(50) NOT NULL,
        region VARCHAR(20) NOT NULL,
        clue_1 TEXT NOT NULL,
        clue_2 TEXT NOT NULL,
        clue_3 TEXT NOT NULL,
        flag_emoji VARCHAR(10),
        population INTEGER,
        nickname VARCHAR(50),
        abbreviation VARCHAR(2) NOT NULL
      )
    `);

    // Scores table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        game_mode VARCHAR(20) NOT NULL,
        score INTEGER NOT NULL,
        time_seconds INTEGER NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on scores for leaderboard queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_scores_leaderboard
      ON scores(game_mode, score DESC, time_seconds ASC)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_scores_user
      ON scores(user_id, completed_at DESC)
    `);

    // User_Progress table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        state_id INTEGER REFERENCES states(id) ON DELETE CASCADE,
        times_correct INTEGER DEFAULT 0,
        times_attempted INTEGER DEFAULT 0,
        last_attempted TIMESTAMP,
        UNIQUE(user_id, state_id)
      )
    `);

    await client.query('COMMIT');
    console.log('Database tables initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { pool, initializeDatabase };
