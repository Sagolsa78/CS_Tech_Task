const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UploadBatch",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);
