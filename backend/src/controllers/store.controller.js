const pool = require('../config/db');

// Get stores list for current user (with overall + user's rating)
const getStoresForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const { 
      name = "", 
      address = "", 
      sortBy = "name", 
      sortOrder = "ASC",
      page = 1,
      limit = 50
    } = req.query;

    const offset = (page - 1) * limit;

    // Allowed Sorting Columns
    const allowedSort = ["name", "address", "created_at", "overallRating"];
    const safeSort = allowedSort.includes(sortBy) ? sortBy : "name";
    const safeOrder = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Filters
    const filters = [];
    const params = [userId];   // First param → user's rating JOIN

    if (name.trim()) {
      filters.push("s.name LIKE ?");
      params.push(`%${name}%`);
    }

    if (address.trim()) {
      filters.push("s.address LIKE ?");
      params.push(`%${address}%`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    // Main SQL
    const sql = `
      SELECT 
        s.id,
        s.name,
        s.email,
        s.address,
        u.name AS owner_name,

        IFNULL(AVG(r.rating), 0) AS overallRating,

        ur.rating AS userRating,
        ur.review AS userReview,

        s.created_at

      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id

      LEFT JOIN ratings ur 
        ON ur.store_id = s.id AND ur.user_id = ?

      ${whereClause}
      GROUP BY s.id
      ORDER BY ${safeSort} ${safeOrder}
      LIMIT ? OFFSET ?
    `;

    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);

    return res.json(rows);

  } catch (err) {
    console.error("Store getStoresForUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// Store owner dashboard: stores owned + raters
const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // 1️⃣ FETCH STORES OWNED BY OWNER
    const [stores] = await pool.query(
      `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        IFNULL(AVG(r.rating), 0) AS avgRating,
        COUNT(r.id) AS totalRatings,
        s.created_at
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE s.owner_id = ?
      GROUP BY s.id
      `,
      [ownerId]
    );

    // If no stores → return empty dashboard
    if (!stores.length) {
      return res.json({
        stores: [],
        raters: []
      });
    }

    // 2️⃣ BUILD PLACEHOLDER LIST FOR STORE IDs
    const storeIds = stores.map((s) => s.id);
    const placeholders = storeIds.map(() => "?").join(",");

    // 3️⃣ FETCH RATERS FOR ALL STORES WITH RESTAURANT NAME
    const [raters] = await pool.query(
      `
      SELECT
        r.store_id,
        s.name AS storeName,   -- ⭐ restaurant name
        u.id AS userId,
        u.name,
        u.email,
        r.rating,
        r.review,
        r.created_at
      FROM ratings r
      JOIN users u ON u.id = r.user_id
      JOIN stores s ON s.id = r.store_id
      WHERE r.store_id IN (${placeholders})
      ORDER BY r.created_at DESC
      `,
      storeIds
    );

    return res.json({
      stores,
      raters
    });

  } catch (err) {
    console.error("Store getOwnerDashboard error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  getStoresForUser,
  getOwnerDashboard
};
