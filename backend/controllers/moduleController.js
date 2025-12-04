const { getConnection } = require("../config/db");

async function getModules(req, res) {
  const institutionId = req.admin.institution_id; // From JWT

  let conn;
  try {
    conn = await getConnection();

    const sql = `
      SELECT module_id, module_code, module_name, description, created_at
      FROM module
      WHERE institution_id = :institution_id
      ORDER BY created_at DESC
    `;

    const result = await conn.execute(sql, {
      institution_id: institutionId,
    });

    res.json(result.rows || []);
  } catch (err) {
    console.error("Get modules error:", err);
    res.status(500).json({ message: "Failed to load modules" });
  } finally {
    conn?.close();
  }
}

async function createModule(req, res) {
  const { code, name, description } = req.body;
  const institutionId = req.admin.institution_id;

  if (!code || !name) {
    return res.status(400).json({ message: "Module code and name are required" });
  }

  let conn;
  try {
    conn = await getConnection();

    const sql = `
      INSERT INTO module (module_code, module_name, description, institution_id)
      VALUES (:code, :name, :description, :institution_id)
      RETURNING module_id INTO :module_id
    `;

    const binds = {
      code,
      name,
      description,
      institution_id: institutionId,
      module_id: { dir: require("oracledb").BIND_OUT, type: require("oracledb").NUMBER },
    };

    const result = await conn.execute(sql, binds, { autoCommit: true });

    res.json({
      module_id: result.outBinds.module_id[0],
      code,
      name,
      description,
    });
  } catch (err) {
    console.error("Create module error:", err);
    res.status(500).json({ message: "Failed to create module" });
  } finally {
    conn?.close();
  }
}

async function deleteModule(req, res) {
  const { module_id } = req.params;

  let conn;
  try {
    conn = await getConnection();

    const sql = `
      DELETE FROM module
      WHERE module_id = :module_id
    `;

    await conn.execute(sql, { module_id }, { autoCommit: true });

    res.json({ message: "Module deleted" });
  } catch (err) {
    console.error("Delete module error:", err);
    res.status(500).json({ message: "Failed to delete module" });
  } finally {
    conn?.close();
  }
}

module.exports = {
  getModules,
  createModule,
  deleteModule,
};
