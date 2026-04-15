require("dotenv").config();

const mongoose = require("mongoose");
const profileModel = require("./models/profileModel");

// ✅ DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

const cleanData = async () => {
  try {
    const profiles = await profileModel.find();

    for (let doc of profiles) {
      doc.name = doc.name?.trim().toLowerCase();
      doc.fatherName = doc.fatherName?.trim().toLowerCase();
      doc.contactNo = doc.contactNo?.replace(/\D/g, "");
      doc.place = doc.place?.trim();
      doc.city = doc.city?.trim();
      doc.fullAddress = doc.fullAddress?.trim();

      await doc.save();
    }

    console.log("✅ Data cleaned successfully");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

cleanData();



// Terminal Command - node cleanData.js