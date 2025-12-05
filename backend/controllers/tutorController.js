const { getConnection } = require('../config/db');

async function registerTutor(req, res) {
  // Only extract fields that exist in the database table
  const { firstName, lastName, email } = req.body;
  
  // We assume the logged-in admin's institution_id applies to the new tutor
  const institutionId = req.admin.institution_id; 

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ message: "First Name, Last Name, and Email are required." });
  }

  let conn;
  try {
    conn = await getConnection();

    // 1. Check if email already exists
    // Note: We use the column name 'tutor_email' as defined in your SQL
    const checkSql = `SELECT tutor_id FROM tutor WHERE tutor_email = :email`;
    const checkResult = await conn.execute(checkSql, { email });

    if (checkResult.rows && checkResult.rows.length > 0) {
      return res.status(409).json({ message: "A tutor with this email already exists" });
    }

    // 2. Insert new tutor
    // Strictly matching columns: institution_id, first_name, last_name, tutor_email
    const sql = `
      INSERT INTO tutor (
        institution_id, 
        first_name, 
        last_name, 
        tutor_email
      ) VALUES (
        :institutionId, 
        :firstName, 
        :lastName, 
        :email
      )
      RETURNING tutor_id INTO :tutor_id
    `;

    const binds = {
      institutionId,
      firstName,
      lastName,
      email,
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
    // Oracle unique constraint error code usually involves ORA-00001
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
    // Fetching columns matching your table
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
    
    // Map database columns to camelCase for frontend if needed, 
    // or send as is. Oracle driver normally returns uppercase keys by default.
    // result.rows will be an array of objects if oracledb.outFormat = OBJECT is set in db.js
    res.json(result.rows || []);
  } catch (err) {
    console.error("Get tutors error:", err);
    res.status(500).json({ message: "Failed to fetch tutors" });
  } finally {
    if (conn) try { await conn.close(); } catch(e) {}
  }
}

module.exports = { registerTutor, getTutors };