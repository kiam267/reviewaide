const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');

const password_hash = async password => {
  const saltRound = await bcrypt.genSalt(10);
  const hash_password = await bcrypt.hash(
    password,
    saltRound,
  );
  return hash_password;
};

const comparePassword = async (password, hash_password) => {
  return await bcrypt.compare(password, hash_password);
};

const token_generator = token => {
  return jwt.sign(token, process.env.VERIFY_SIGNATURE, {
    expiresIn: '2h',
  });
};

// Function to verify a JWT token
const verifyToken = token => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.VERIFY_SIGNATURE,
    );

    // NOTE: jwt.verify already checks expiry, so this is redundant
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, message: 'Invalid token' };
  }
};

module.exports = {
  password_hash,
  comparePassword,
  token_generator,
  verifyToken,
};
