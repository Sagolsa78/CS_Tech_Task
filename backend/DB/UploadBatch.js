const mongoose = require("mongoose");

const UploadBatchSchema = new mongoose.Schema(
  {
    originalFileName: {
      type: String,
      required: true,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UploadBatch", UploadBatchSchema);

