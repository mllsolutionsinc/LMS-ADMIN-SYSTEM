// utils/token.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(admin) {
  // admin: { admin_id, admin_email, first_name, last_name, institution_id }
  const payload = {
    admin_id: admin.ADMIN_ID ?? admin.admin_id,
    admin_email: admin.ADMIN_EMAIL ?? admin.admin_email,
    first_name: admin.FIRST_NAME ?? admin.first_name,
    last_name: admin.LAST_NAME ?? admin.last_name,
    institution_id: admin.INSTITUTION_ID ?? admin.institution_id
  };

  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  if (!secret) throw new Error('JWT_SECRET not set');

  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = { generateToken };
