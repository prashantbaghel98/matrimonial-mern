const profileModel = require('../models/profileModel')
const imagekit = require('../config/imagekit')


// Create Profile 

const createProfile = async (req, res) => {
  try {
    const {
      name, dob, time, place, height, colour, education, occupation, income,
      gotraFather, gotraMother, fatherName, fatherOccupation, motherName, motherOccupation,
      fullAddress, city, contactNo, gender, maritalStatus
    } = req.body;


    const existingProfile = await profileModel.findOne({
      name,
      fatherName,
      contactNo
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "This biodata already exists"
      });
    }

    // Check if file exists
    let photoUrl = null;
    if (req.file) {
      const file = req.file.buffer; // buffer from multer
      const fileName = req.file.originalname;

      const uploadResponse = await imagekit.upload({
        file,             // file buffer
        fileName,         // original filename
        folder: "/profiles" // optional folder in ImageKit
      });

      photoUrl = uploadResponse.url; // get the CDN URL
    }


    const profile = await profileModel.create({
      name, dob, time, place, height, colour, education, occupation, income,
      gotraFather, gotraMother, fatherName, fatherOccupation, motherName, motherOccupation,
      fullAddress, city, contactNo, photo: photoUrl, gender, maritalStatus
    });

    res.status(201).json({
      message: "Profile created successfully",
      data: profile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Update Profile 

const updateProfile = async (req, res) => {
  try {
    const profileId = req.params.id;
    const updateData = { ...req.body };

    // If a new photo is uploaded
    if (req.file) {
      const file = req.file.buffer;
      const fileName = req.file.originalname;

      const uploadResponse = await imagekit.upload({
        file,
        fileName,
        folder: "/profiles"
      });

      updateData.photo = uploadResponse.url;
    }

    const updatedProfile = await profileModel.findByIdAndUpdate(
      profileId,
      updateData,
      { new: true } // return the updated document
    );

    if (!updatedProfile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Delete Profile 

const deleteProfile = async (req, res) => {
  try {
    const profileId = req.params.id;
    const deletedProfile = await profileModel.findByIdAndDelete(profileId);
    if (!deletedProfile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Get Single Profile 

const getProfileById = async (req, res) => {
  try {
    const profile = await profileModel.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    console.log(profile)
    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Get All Profile 

const getAllProfile = async (req, res) => {
  try {
    const profiles = await profileModel.find({});
    if (profiles.length === 0) {
      return res.status(404).json({ message: "No profiles found" });
    }
    console.log(profiles)
    res.status(200).json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};





const checkDuplicate = async (req, res) => {
  try {
    let { name, dob, contactNo } = req.query;

    // ✅ basic validation
    if (!name || !contactNo || !dob) {
      return res.json({ exists: false });
    }

    // ✅ trim values
    name = name.trim();
    contactNo = contactNo.trim();

    // ✅ escape regex special characters (important)
    const escapeRegex = (text) => {
      return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    const safeName = escapeRegex(name);
    const safeContact = escapeRegex(contactNo);

    // ✅ strict + safe regex match
    const existing = await profileModel.findOne({
      name: { $regex: `^${safeName}\\s*$`, $options: "i" }, // case-insensitive exact match
      dob: dob,
      contactNo: { $regex: `^\\s*${safeContact}\\s*$` } // allow spaces before/after
    });

    res.json({ exists: !!existing });

  } catch (error) {
    console.error("Duplicate check error:", error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createProfile, getProfileById, getAllProfile, updateProfile, deleteProfile,checkDuplicate };