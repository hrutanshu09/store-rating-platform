const bcrypt = require('bcrypt');

const hashPassword = async (plain) => {
  const saltRounds = 10;
  return bcrypt.hash(plain, saltRounds);
};

const comparePassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

module.exports = { hashPassword, comparePassword };
