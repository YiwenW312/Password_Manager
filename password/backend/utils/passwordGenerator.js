const crypto = require('crypto');

const generateSecurePassword = (length, hasLetters, hasNumbers, hasSymbols) => {
  let charset = '';
  let password = [];

  if (hasLetters) {
    charset += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    password.push(charset[crypto.randomInt(0, 52)]); // Ensure at least one letter
  }
  if (hasNumbers) {
    charset += '0123456789';
    password.push(charset[52 + crypto.randomInt(0, 10)]); // Ensure at least one number
  }
  if (hasSymbols) {
    charset += '!@#$%^&*()_+-=[]{}|;:",.<>?';
    password.push(charset[62 + crypto.randomInt(0, charset.length - 62)]); // Ensure at least one symbol
  }

  // Fill the rest of the password length
  while (password.length < length) {
    password.push(charset[crypto.randomInt(0, charset.length)]);
  }

  // Shuffle the password to ensure randomness
  return password.sort(() => 0.5 - Math.random()).join('');
};

module.exports = generateSecurePassword;


