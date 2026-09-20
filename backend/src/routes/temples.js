const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/temples
router.get('/', async (req, res) => {
  try {
    const { district, search } = req.query;
    let query = 'SELECT * FROM temples WHERE is_active = true';
    const params = [];

    if (district) {
      params.push(district);
      query += ` AND (LOWER(district_en) = LOWER($${params.length}) OR district_bn = $${params.length})`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (LOWER(name_en) LIKE LOWER($${params.length}) OR name_bn LIKE $${params.length} OR LOWER(deity_en) LIKE LOWER($${params.length}))`;
    }

    query += ' ORDER BY name_en ASC';

    const result = await db.query(query, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Fetch temples error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/temples/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const templeResult = await db.query('SELECT * FROM temples WHERE id = $1', [id]);
    if (templeResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Temple not found' });
    }

    const offeringsResult = await db.query(
      'SELECT * FROM puja_offerings WHERE temple_id = $1 AND is_available = true ORDER BY base_price ASC',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...templeResult.rows[0],
        offerings: offeringsResult.rows
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/temples/:id/offerings
router.get('/:id/offerings', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM puja_offerings WHERE temple_id = $1 AND is_available = true',
      [id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
