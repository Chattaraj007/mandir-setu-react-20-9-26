const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/bookings (Filter by user or temple, role-based)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { role, id: userId, assignedTempleId } = req.user;
    let query = `
      SELECT b.*, t.name_en as temple_name_en, t.name_bn as temple_name_bn,
             po.title_en as offering_title_en, po.title_bn as offering_title_bn
      FROM bookings b
      JOIN temples t ON b.temple_id = t.id
      LEFT JOIN puja_offerings po ON b.offering_id = po.id
    `;
    const params = [];

    if (role === 'DEVOTEE') {
      params.push(userId);
      query += ` WHERE b.user_id = $${params.length}`;
    } else if (role === 'PRIEST' || role === 'TRUSTEE') {
      if (assignedTempleId) {
        params.push(assignedTempleId);
        query += ` WHERE b.temple_id = $${params.length}`;
      }
    }
    // SUPER_ADMIN gets all bookings

    query += ' ORDER BY b.created_at DESC';

    const result = await db.query(query, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/bookings (Create a new sacred puja booking)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      templeId,
      offeringId,
      devoteeName,
      devoteePhone,
      gotra,
      pujaDate,
      tithiTime,
      sankalpWish,
      prasadAddress,
      totalAmount
    } = req.body;

    if (!templeId || !devoteeName || !devoteePhone || !pujaDate || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Missing required booking fields' });
    }

    const result = await db.query(
      `INSERT INTO bookings 
       (user_id, temple_id, offering_id, devotee_name, devotee_phone, gotra, puja_date, tithi_time, sankalp_wish, prasad_address, total_amount, payment_status, booking_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'PAID', 'CONFIRMED')
       RETURNING *`,
      [userId, templeId, offeringId || null, devoteeName, devoteePhone, gotra || 'Kashyapa', pujaDate, tithiTime || 'Morning Aarti', sankalpWish || '', prasadAddress || '', totalAmount]
    );

    res.status(201).json({
      success: true,
      message: 'Puja booking confirmed successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/bookings/:id/status (Admin/Priest/Trustee status update or cancellation)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason, assignedPriestName } = req.body;

    const result = await db.query(
      `UPDATE bookings 
       SET booking_status = COALESCE($1, booking_status),
           cancellation_reason = COALESCE($2, cancellation_reason),
           assigned_priest_name = COALESCE($3, assigned_priest_name),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [status, cancellationReason, assignedPriestName, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking updated', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
