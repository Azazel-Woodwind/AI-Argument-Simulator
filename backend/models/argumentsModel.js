const mongoose = require("mongoose");

const botObject = {
  name: String,
  isFor: Boolean,
  model: String,
  temp: Number,
  freqPenalty: Number,
  presPenalty: Number,
};

const argumentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    proposition: {
      type: String,
      required: true,
    },
    bot1Config: botObject,
    bot2Config: botObject,
    argument: {
      type: [String],
      required: [true, "Please provide an argument"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Argument", argumentSchema);
