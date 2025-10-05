const express = require("express");
const multer = require("multer");
const router = express.Router();
const { uploadList, getDistributedLists } = require("../Controller/upload.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .csv, .xls, .xlsx files allowed!"), false);
    }
  },
});

// Upload and distribute list
router.post("/", authMiddleware, upload.single("file"), uploadList);

// Get distributed lists
router.get("/", authMiddleware, getDistributedLists);

module.exports = router;
