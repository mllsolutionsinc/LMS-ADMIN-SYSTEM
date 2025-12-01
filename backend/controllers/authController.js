// controllers/authController.js (DEBUG MODE)
const bcrypt = require("bcrypt");
const { getConnection } = require("../config/db");
const { generateToken } = require("../utils/token");

async function login(req, res, next) {
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  let conn;

  try {
    conn = await getConnection();

    const sql = `
      SELECT 
        admin_id AS admin_id,
        institution_id AS institution_id,
        first_name AS first_name,
        last_name AS last_name,
        admin_email AS admin_email,
        password_hash AS password_hash
      FROM admin
      WHERE LOWER(admin_email) = LOWER(:email)
    `;

    
    const result = await conn.execute(sql, { email });
   

    if (!result.rows || result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const admin = result.rows[0];
    

    const passwordHash = admin.PASSWORD_HASH;

    if (!passwordHash) {
      return res.status(500).json({ message: "Admin password missing" });
    }

    
    const passwordMatch = await bcrypt.compare(password, passwordHash);
   

    if (!passwordMatch) {
      
      return res.status(401).json({ message: "Invalid email or password" });
    }


    // Build admin object using bracket access so Oracle uppercase keys work
const adminInfo = {
  admin_id: admin["ADMIN_ID"] || admin["admin_id"],
  institution_id: admin["INSTITUTION_ID"] || admin["institution_id"],
  first_name: admin["FIRST_NAME"] || admin["first_name"],
  last_name: admin["LAST_NAME"] || admin["last_name"],
  admin_email: admin["ADMIN_EMAIL"] || admin["admin_email"],
};


    const token = generateToken(adminInfo);
    

    return res.json({ token, admin: adminInfo });
  } catch (err) {
    console.log("LOGIN ERROR");
    console.error(err);
    return next(err);
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (closeErr) {
        console.error(closeErr);
      }
    }
  }
}

module.exports = { login };
