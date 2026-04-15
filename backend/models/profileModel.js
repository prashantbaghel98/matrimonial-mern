const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true
  },

  dob: {
    type: String,
    trim: true
  },

  time: String,

  place: {
    type: String,
    trim: true
  },

  height: String,

  colour: {
    type: String,
    enum: ["Fair", "Wheatish", "Brown", "Dark"]
  },

  education: String,
  occupation: String,
  income: String,

  gotraFather: String,
  gotraMother: String,

  fatherName: {
    type: String,
    trim: true,
    lowercase: true
  },

  fatherOccupation: String,
  motherName: String,
  motherOccupation: String,

  fullAddress: {
    type: String,
    trim: true
  },

  city: {
    type: String,
    trim: true
  },

  contactNo: {
    type: String,
    trim: true
  },

  photo: String,

  gender: {
    type: String,
    enum: ["Male", "Female"]
  },

  maritalStatus: {
    type: String,
    enum: ["Unmarried", "Married", "Divorced", "Widowed", "Separated"]
  }

}, { timestamps: true });


// ✅ UNIQUE INDEX (BEST COMBINATION)
profileSchema.index(
  { name: 1, dob: 1, contactNo: 1 },
  { unique: true }
);


// ✅ MODEL EXPORT
const profileModel =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);

module.exports = profileModel;