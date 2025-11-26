const pool = require('../config/db');

// Get stores list for current user (with overall + user's rating)
const getStoresForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address, sortBy = 'name', order = 'asc' } = req.query;

    const allowedSort = ['name', 'address', 'created_at', 'overallRating'];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const filters = [];
    const params = [userId]; // first param for subquery (user's rating)

    if (name) {
      filters.push('s.name LIKE ?');
      params.push(`%${name}%`);
    }
    if (address) {
      filters.push('s.address LIKE ?');
      params.push(`%${address}%`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const sql = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        IFNULL(AVG(r.rating), 0) AS overallRating,
        (
          SELECT rating
          FROM ratings ur
          WHERE ur.store_id = s.id AND ur.user_id = ?
          LIMIT 1
        ) AS userRating,
        s.created_at
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      ${whereClause}
      GROUP BY s.id
      ORDER BY ${sortColumn} ${sortOrder}
    `;

    const [rows] = await pool.query(sql, params);

    return res.json(rows);
  } catch (err) {
    console.error('Store getStoresForUser error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Store owner dashboard: stores owned + raters
const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // stores with aggregated ratings
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

    if (!stores.length) {
      return res.json({
        stores: [],
        raters: []
      });
    }

    const storeIds = stores.map((s) => s.id);
    const placeholders = storeIds.map(() => '?').join(', ');

    const [raters] = await pool.query(
      `
        SELECT
          r.store_id,
          u.id AS userId,
          u.name,
          u.email,
          u.address,
          r.rating,
          r.created_at
        FROM ratings r
        JOIN users u ON u.id = r.user_id
        WHERE r.store_id IN (${placeholders})
        ORDER BY r.store_id, r.created_at DESC
      `,
      storeIds
    );

    return res.json({
      stores,
      raters
    });
  } catch (err) {
    console.error('Store getOwnerDashboard error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStoresForUser,
  getOwnerDashboard
};
