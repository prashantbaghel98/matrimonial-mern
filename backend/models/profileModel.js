const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: String,
  dob: String,
  time: String,
  place: String,
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
  fatherName: String,
  fatherOccupation: String,
  motherName: String,
  motherOccupation: String,
  fullAddress: String,
  city: String,
  contactNo: String,
  photo: String,
  gender: {
    type: String,
    enum: ["Male", "Female"]
  },
  maritalStatus: {
    type: String,
    enum: ["Unmarried", "Married", "Divorced", "Widowed", "Separated"]
  }
});

// 🔥 IMPORTANT LINE
profileSchema.index(
  { name: 1, fatherName:1, contactNo: 1 },
  { unique: true }
);


const profileModel = mongoose.models.Profile || mongoose.model("Profile", profileSchema);

module.exports = profileModel;