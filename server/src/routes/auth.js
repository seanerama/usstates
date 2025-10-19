const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { validateRegister, validateLogin, checkValidation } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', validateRegister, checkValidation, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      const existing = existingUser.rows[0];
      if (existing.username === username) {
        return res.status(409).json({ error: 'Username already taken' });
      }
      if (existing.email === email) {
        return res.status(409).json({ error: 'Email already registered' });
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, passwordHash]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

/**
 * POST /api/auth/login
 * Login existing user
 */
router.post('/login', validateLogin, checkValidation, async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

/**
 * GET /api/auth/verify
 * Verify JWT token and return user info
 */
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Server error during verification' });
  }
});

/**
 * POST /api/auth/guest
 * Quick play - create guest session with just username
 */
router.post('/guest', async (req, res) => {
  const { username } = req.body;

  if (!username || username.trim().length < 3 || username.trim().length > 20) {
    return res.status(400).json({ error: 'Username must be 3-20 characters' });
  }

  try {
    // Create a guest user entry (no real email, dummy password)
    // Username uniqueness is NOT enforced for guests - multiple users can have same display name
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username',
      [username.trim(), `guest_${Date.now()}@quickplay.local`, 'GUEST_NO_PASSWORD']
    );

    const userId = result.rows[0].id;

    // Generate JWT token for guest session
    const token = jwt.sign(
      { userId, username: username.trim(), isGuest: true },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Shorter expiry for guests
    );

    res.json({
      message: 'Guest session created',
      token,
      user: {
        id: userId,
        username: username.trim(),
        email: null,
        isGuest: true
      }
    });
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(500).json({ error: 'Server error during guest login' });
  }
});

module.exports = router;
