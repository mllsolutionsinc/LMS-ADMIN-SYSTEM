const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createModule,
  getModules,
  deleteModule,
} = require("../controllers/moduleController");

router.get("/", authMiddleware, getModules);
router.post("/", authMiddleware, createModule);
router.delete("/:module_id", authMiddleware, deleteModule);

module.exports = router;
