const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      trim: true,
      lowercase: true,
    },

    contactNo: {
      type: String,
      trim: true,
      unique: true,
    },

    genderSearch: {
      type: String,
      enum: ["Male", "Female"],
    },

    planDuration: {
      type: String,
      enum: ["1 Month", "6 Months", "1 Year"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Finance =
  mongoose.models.Finance ||
  mongoose.model("Finance", financeSchema);

module.exports = Finance;