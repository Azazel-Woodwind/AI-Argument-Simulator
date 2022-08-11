const mongoose = require("mongoose");

const argumentSchema = mongoose.Schema({
  argument: {
    type: [String],
    required: [true, "Please provide an argument"],
  },
  username: {
    type: String,
    required: [true, "Please provide a username"],
  },
});

module.exports = mongoose.model("Argument", argumentSchema);
