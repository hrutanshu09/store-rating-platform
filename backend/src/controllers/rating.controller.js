const pool = require('../config/db');

// Create rating (USER)
const createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, rating, review } = req.body;

    if (!storeId || !Number.isInteger(storeId)) {
      return res.status(400).json({ message: "storeId is required and must be integer" });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Ensure store exists
    const [stores] = await pool.query("SELECT id FROM stores WHERE id = ?", [storeId]);
    if (!stores.length) {
      return res.status(404).json({ message: "Store not found" });
    }

    try {
      await pool.query(
        "INSERT INTO ratings (store_id, user_id, rating, review) VALUES (?, ?, ?, ?)",
        [storeId, userId, numericRating, review || null]
      );

      return res.status(201).json({ message: "Rating submitted" });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Rating exists, use update" });
      }
      throw err;
    }
  } catch (err) {
    console.error("createRating error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// Update rating (USER)
const updateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = parseInt(req.params.storeId);
    const { rating, review } = req.body;

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const [result] = await pool.query(
      "UPDATE ratings SET rating = ?, review = ? WHERE store_id = ? AND user_id = ?",
      [numericRating, review || null, storeId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rating not found" });
    }

    return res.json({ message: "Rating updated" });
  } catch (err) {
    console.error("updateRating error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getStoreReviews = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);

    const [reviews] = await pool.query(
      `
      SELECT r.rating, r.review, u.name AS userName, r.created_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
      `,
      [storeId]
    );

    return res.json(reviews);
  } catch (err) {
    console.error("getStoreReviews error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRating,
  updateRating,
  getStoreReviews
};
