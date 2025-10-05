const express = require("express");
const router = express.Router();

const authRoutes = require("./Auth.routes");
const agentRoutes = require("./Agents.routes");
const uploadRoutes = require("./upload.routes");

router.use("/auth", authRoutes);
router.use("/agents", agentRoutes);
router.use("/upload", uploadRoutes);

module.exports = router;
