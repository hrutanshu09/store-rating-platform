const nameIsValid = (name) =>
  typeof name === 'string' && name.length >= 20 && name.length <= 60;

const addressIsValid = (address) =>
  !address || (typeof address === 'string' && address.length <= 400);

const passwordIsValid = (password) => {
  if (typeof password !== 'string') return false;
  if (password.length < 8 || password.length > 16) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasUpper && hasSpecial;
};

const emailIsValid = (email) =>
  typeof email === 'string' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

module.exports = { nameIsValid, addressIsValid, passwordIsValid, emailIsValid };
