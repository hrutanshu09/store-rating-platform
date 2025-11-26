const pool = require('../config/db');
const { hashPassword } = require('../utils/password');
const {
  nameIsValid,
  addressIsValid,
  passwordIsValid,
  emailIsValid
} = require('../utils/validators');

const allowedUserRoles = ['ADMIN', 'USER', 'OWNER'];

// Create user (ADMIN / USER / OWNER)
const createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (!allowedUserRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!nameIsValid(name) || !emailIsValid(email) ||
        !passwordIsValid(password) || !addressIsValid(address)) {
      return res.status(400).json({ message: 'Validation failed' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashed = await hashPassword(password);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim(), hashed, address?.trim() || null, role]
    );

    return res.status(201).json({
      message: 'User created',
      userId: result.insertId
    });
  } catch (err) {
    console.error('Admin createUser error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create store
const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!nameIsValid(name) || !addressIsValid(address)) {
      return res.status(400).json({ message: 'Validation failed' });
    }
    if (email && !emailIsValid(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    let owner_id_value = null;

    if (ownerId) {
      const [owners] = await pool.query(
        'SELECT id, role FROM users WHERE id = ?',
        [ownerId]
      );
      if (!owners.length || owners[0].role !== 'OWNER') {
        return res.status(400).json({ message: 'Owner must be an existing user with OWNER role' });
      }
      owner_id_value = ownerId;
    }

    const [result] = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name.trim(), email?.trim() || null, address?.trim() || null, owner_id_value]
    );

    return res.status(201).json({
      message: 'Store created',
      storeId: result.insertId
    });
  } catch (err) {
    console.error('Admin createStore error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Dashboard stats: total users, stores, ratings
const getDashboardStats = async (req, res) => {
  try {
    const [usersRows] = await pool.query('SELECT COUNT(*) AS count FROM users');
    const [storesRows] = await pool.query('SELECT COUNT(*) AS count FROM stores');
    const [ratingsRows] = await pool.query('SELECT COUNT(*) AS count FROM ratings');

    return res.json({
      totalUsers: usersRows[0].count,
      totalStores: storesRows[0].count,
      totalRatings: ratingsRows[0].count
    });
  } catch (err) {
    console.error('Admin getDashboardStats error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List users with filter/sort
const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'asc' } = req.query;

    const allowedSort = ['name', 'email', 'address', 'role', 'created_at'];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const filters = [];
    const params = [];

    if (name) {
      filters.push('name LIKE ?');
      params.push(`%${name}%`);
    }
    if (email) {
      filters.push('email LIKE ?');
      params.push(`%${email}%`);
    }
    if (address) {
      filters.push('address LIKE ?');
      params.push(`%${address}%`);
    }
    if (role) {
      filters.push('role = ?');
      params.push(role);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const sql = `
      SELECT id, name, email, address, role, created_at
      FROM users
      ${whereClause}
      ORDER BY ${sortColumn} ${sortOrder}
    `;

    const [rows] = await pool.query(sql, params);

    return res.json(rows);
  } catch (err) {
    console.error('Admin getUsers error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List stores with overall rating, filter/sort
const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', order = 'asc' } = req.query;

    const allowedSort = ['name', 'email', 'address', 'created_at', 'overallRating'];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const filters = [];
    const params = [];

    if (name) {
      filters.push('s.name LIKE ?');
      params.push(`%${name}%`);
    }
    if (email) {
      filters.push('s.email LIKE ?');
      params.push(`%${email}%`);
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
        s.owner_id,
        IFNULL(AVG(r.rating), 0) AS overallRating,
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
    console.error('Admin getStores error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get user details, if OWNER also show ratings for owned stores
const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const [users] = await pool.query(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
      [userId]
    );
    if (!users.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    if (user.role !== 'OWNER') {
      return res.json({ user });
    }

    // Get stores owned by this user with their average rating
    const [stores] = await pool.query(
      `
        SELECT
          s.id,
          s.name,
          s.email,
          s.address,
          IFNULL(AVG(r.rating), 0) AS avgRating,
          COUNT(r.id) AS totalRatings
        FROM stores s
        LEFT JOIN ratings r ON r.store_id = s.id
        WHERE s.owner_id = ?
        GROUP BY s.id
      `,
      [userId]
    );

    return res.json({
      user,
      ownerStores: stores
    });
  } catch (err) {
    console.error('Admin getUserDetails error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createUser,
  createStore,
  getDashboardStats,
  getUsers,
  getStores,
  getUserDetails
};
