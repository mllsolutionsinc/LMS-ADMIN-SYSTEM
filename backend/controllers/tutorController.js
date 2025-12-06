const { getConnection } = require('../config/db');
const bcrypt = require('bcrypt'); 

async function registerTutor(req, res) {
  const { firstName, lastName, email, password } = req.body;
  const institutionId = req.admin.institution_id;

  
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "First Name, Last Name, Email and Password are required." });
  }

  // hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  let conn;
  try {
    conn = await getConnection();

    const checkSql = `SELECT tutor_id FROM tutor WHERE tutor_email = :email`;
    const checkResult = await conn.execute(checkSql, { email });

    if (checkResult.rows && checkResult.rows.length > 0) {
      return res.status(409).json({ message: "A tutor with this email already exists" });
    }

    const sql = `
      INSERT INTO tutor (
        institution_id, 
        first_name, 
        last_name, 
        tutor_email,
        password_hash
      ) VALUES (
        :institutionId, 
        :firstName, 
        :lastName, 
        :email,
        :password
      )
      RETURNING tutor_id INTO :tutor_id
    `;

    const binds = {
      institutionId,
      firstName,
      lastName,
      email,
      password: hashedPassword,   // <-- password is now hashed
      tutor_id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER }
    };

    const result = await conn.execute(sql, binds, { autoCommit: true });
    const newTutorId = result.outBinds.tutor_id[0];

    res.status(201).json({
      message: "Tutor registered successfully",
      tutorId: newTutorId
    });

  } catch (err) {
    console.error("Tutor registration error:", err);
    if (err.message && err.message.includes("ORA-00001")) {
      return res.status(409).json({ message: "A tutor with this email already exists" });
    }
    res.status(500).json({ message: "Failed to register tutor" });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getTutors(req, res) {
  const institutionId = req.admin.institution_id;
  let conn;
  try {
    conn = await getConnection();
    const sql = `
      SELECT 
        tutor_id, 
        first_name, 
        last_name, 
        tutor_email, 
        created_at 
      FROM tutor 
      WHERE institution_id = :institutionId
      ORDER BY created_at DESC
    `;
    const result = await conn.execute(sql, { institutionId });
    res.json(result.rows || []);
  } catch (err) {
    console.error("Get tutors error:", err);
    res.status(500).json({ message: "Failed to fetch tutors" });
  } finally {
    if (conn) try { await conn.close(); } catch (e) {}
  }
}

module.exports = { registerTutor, getTutors };
