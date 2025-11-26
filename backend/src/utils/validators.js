// SIMPLE VALIDATION

const nameIsValid = (name) =>
  typeof name === "string" && name.trim().length >= 3;

const emailIsValid = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const passwordIsValid = (password) =>
  typeof password === "string" && password.length >= 6;

const addressIsValid = (address) =>
  !address || (typeof address === "string" && address.length <= 400);

module.exports = { nameIsValid, emailIsValid, passwordIsValid, addressIsValid };
