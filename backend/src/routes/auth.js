const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// Plaintext dev passwords mapping for dummy accounts if hash comparison fails
const DEV_PASSWORDS = {
  'admin@mandirsetu.gov.in': 'admin123',
  'priest@kalighat.org': 'priest123',
  'trustee@tarapith.org': 'trustee123',
  'devotee@mandirsetu.org': 'omnamah108'
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const result = await db.query(
      `SELECT u.*, t.name_en as temple_name_en, t.name_bn as temple_name_bn 
       FROM users u 
       LEFT JOIN temples t ON u.assigned_temple_id = t.id 
       WHERE LOWER(u.email) = $1`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found. Check email or register.' });
    }

    const user = result.rows[0];

    // Check password: first check bcrypt, fallback to dev plaintext mapping
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, user.password_hash);
    } catch (e) {
      isValidPassword = false;
    }

    if (!isValidPassword && DEV_PASSWORDS[cleanEmail] && DEV_PASSWORDS[cleanEmail] === password) {
      isValidPassword = true;
    }

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid password. Dev accounts: admin123, priest123, trustee123, omnamah108' });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
      assignedTempleId: user.assigned_temple_id
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        phone: user.phone,
        gotra: user.gotra,
        assignedTempleId: user.assigned_temple_id,
        templeNameEn: user.temple_name_en,
        templeNameBn: user.temple_name_bn
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, phone, role = 'DEVOTEE', gotra } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Email, password, and name are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await db.query('SELECT id FROM users WHERE LOWER(email) = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await db.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role, gotra)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, full_name, role, phone, gotra`,
      [cleanEmail, passwordHash, fullName, phone || '', role, gotra || 'Kashyapa']
    );

    const newUser = result.rows[0];
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.email, u.full_name, u.role, u.phone, u.gotra, u.assigned_temple_id,
              t.name_en as temple_name_en, t.name_bn as temple_name_bn
       FROM users u
       LEFT JOIN temples t ON u.assigned_temple_id = t.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/dummy-accounts - lists available accounts for quick testing
router.get('/dummy-accounts', (req, res) => {
  res.json({
    success: true,
    accounts: [
      { role: 'SUPER_ADMIN', email: 'admin@mandirsetu.gov.in', password: 'admin123', label: 'Super Admin (Dr. Soumitra Mukherjee)' },
      { role: 'PRIEST', email: 'priest@kalighat.org', password: 'priest123', label: 'Kalighat Head Priest (Pandit Subhashish)' },
      { role: 'TRUSTEE', email: 'trustee@tarapith.org', password: 'trustee123', label: 'Tarapith Mandir Trustee (Devkumar Banerjee)' },
      { role: 'DEVOTEE', email: 'devotee@mandirsetu.org', password: 'omnamah108', label: 'Devotee (Ananya Sen)' }
    ]
  });
});

module.exports = router;
