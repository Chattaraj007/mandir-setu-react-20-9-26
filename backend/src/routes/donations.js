const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/donations (Summary and history)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { role, assignedTempleId, id: userId } = req.user;
    let query = `
      SELECT d.*, t.name_en as temple_name_en, t.name_bn as temple_name_bn
      FROM donations d
      JOIN temples t ON d.temple_id = t.id
    `;
    const params = [];

    if (role === 'DEVOTEE') {
      params.push(userId);
      query += ` WHERE d.user_id = $${params.length}`;
    } else if (role === 'PRIEST' || role === 'TRUSTEE') {
      if (assignedTempleId) {
        params.push(assignedTempleId);
        query += ` WHERE d.temple_id = $${params.length}`;
      }
    }

    query += ' ORDER BY d.created_at DESC';

    const result = await db.query(query, params);

    // Calculate total stats
    const totalAmount = result.rows.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    res.json({
      success: true,
      totalAmount,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/donations (Make a donation or Chadhava / Gau Seva)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { templeId, donorName, causeType, amount, gotra, paymentMethod } = req.body;

    if (!templeId || !donorName || !amount) {
      return res.status(400).json({ success: false, message: 'Temple, donor name, and amount required' });
    }

    const txnRef = `MNDR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await db.query(
      `INSERT INTO donations (user_id, temple_id, donor_name, cause_type, amount, gotra, payment_method, transaction_ref, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'SUCCESS')
       RETURNING *`,
      [userId, templeId, donorName, causeType || 'GENERAL', amount, gotra || 'Kashyapa', paymentMethod || 'UPI', txnRef]
    );

    res.status(201).json({
      success: true,
      message: 'Donation received with gratitude. Prasad & blessing acknowledged.',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
