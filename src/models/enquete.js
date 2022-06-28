const mongoose = require("mongoose");

const enqueteSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: (v) => Array.isArray(v) && v.length > 0,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Enquete", enqueteSchema);
