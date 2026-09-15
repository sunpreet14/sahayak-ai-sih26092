const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, default: null },
    gender: { type: String, default: "" },
    category: { type: String, default: "SC" },
    state: { type: String, default: "" },
    district: { type: String, default: "" },
    pinCode: { type: String, default: "" },
    familyIncome: { type: Number, default: null },
    education: { type: String, default: "" },
    purpose: { type: String, default: "" },
    projectCost: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
