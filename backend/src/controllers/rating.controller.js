const pool = require('../config/db');

// Create rating (USER)
const createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, rating } = req.body;

    if (!storeId || !Number.isInteger(storeId)) {
      return res.status(400).json({ message: 'storeId is required and must be integer' });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    // Ensure store exists
    const [stores] = await pool.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (!stores.length) {
      return res.status(404).json({ message: 'Store not found' });
    }

    try {
      await pool.query(
        'INSERT INTO ratings (store_id, user_id, rating) VALUES (?, ?, ?)',
        [storeId, userId, numericRating]
      );
      return res.status(201).json({ message: 'Rating submitted' });
    } catch (err) {
      // Duplicate key: user already rated this store
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Rating already exists, use update instead' });
      }
      throw err;
    }
  } catch (err) {
    console.error('Rating createRating error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update rating (USER)
const updateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = parseInt(req.params.storeId, 10);
    const { rating } = req.body;

    if (!Number.isInteger(storeId)) {
      return res.status(400).json({ message: 'Invalid storeId' });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    const [result] = await pool.query(
      'UPDATE ratings SET rating = ? WHERE store_id = ? AND user_id = ?',
      [numericRating, storeId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rating not found for this store' });
    }

    return res.json({ message: 'Rating updated' });
  } catch (err) {
    console.error('Rating updateRating error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createRating, updateRating };
