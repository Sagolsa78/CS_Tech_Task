const express = require("express");
const router = express.Router();
const {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
} = require("../Controller/Agent.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Protected Routes
router.post("/", authMiddleware, createAgent);
router.get("/", authMiddleware, getAgents);
router.get("/:id", authMiddleware, getAgentById);
router.put("/:id", authMiddleware, updateAgent);
router.delete("/:id", authMiddleware, deleteAgent);

module.exports = router;
