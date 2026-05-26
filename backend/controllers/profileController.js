const profileModel = require("../models/profileModel");
const imagekit = require("../config/imagekit");


// ======================================================
// CREATE PROFILE
// ======================================================

const createProfile = async (req, res) => {

  try {

    const {
      name,
      dob,
      time,
      place,
      height,
      colour,
      education,
      occupation,
      income,
      gotraFather,
      gotraMother,
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      fullAddress,
      city,
      contactNo,
      gender,
      maritalStatus
    } = req.body;

    // ======================================================
    // CHECK USER ALREADY CREATED BIODATA
    // ======================================================

   if (req.userRole !== "admin") {

  const alreadyCreated =
  await profileModel.findOne({
    user: req.userId
  });

  if (alreadyCreated) {

    return res.status(400).json({
      success: false,
      message:
      "You already created your biodata"
    });

  }

}

    // ======================================================
    // CHECK DUPLICATE BIODATA
    // ======================================================

    const existingProfile = await profileModel.findOne({
      name,
      fatherName,
      contactNo
    });

    if (existingProfile) {

      return res.status(400).json({
        success: false,
        message: "This biodata already exists"
      });

    }

    // ======================================================
    // IMAGE UPLOAD
    // ======================================================

    let photoUrl = "";

    if (req.file) {

      const file = req.file.buffer;

      const fileName = req.file.originalname;

      const uploadResponse = await imagekit.upload({
        file,
        fileName,
        folder: "/profiles"
      });

      photoUrl = uploadResponse.url;

    }

    // ======================================================
    // CREATE PROFILE
    // ======================================================

    const profile = await profileModel.create({

      user: req.userId,

      name,
      dob,
      time,
      place,
      height,
      colour,
      education,
      occupation,
      income,
      gotraFather,
      gotraMother,
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      fullAddress,
      city,
      contactNo,
      photo: photoUrl,
      gender,
      maritalStatus

    });

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ======================================================
// UPDATE PROFILE
// ======================================================

const updateProfile = async (req, res) => {

  try {

    const profileId = req.params.id;

    const profile = await profileModel.findById(profileId);

    if (!profile) {

      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });

    }

    // ======================================================
    // ACCESS CONTROL
    // ======================================================

    if (
      req.userRole !== "admin" &&
      profile.user.toString() !== req.userId
    ) {

      return res.status(403).json({
        success: false,
        message: "Access denied"
      });

    }

    const updateData = { ...req.body };

    // ======================================================
    // IMAGE UPDATE
    // ======================================================

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

    // ======================================================
    // UPDATE PROFILE
    // ======================================================

    const updatedProfile =
      await profileModel.findByIdAndUpdate(
        profileId,
        updateData,
        { new: true }
      );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ======================================================
// DELETE PROFILE
// ======================================================

const deleteProfile = async (req, res) => {

  try {

    const profileId = req.params.id;

    const profile = await profileModel.findById(profileId);

    if (!profile) {

      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });

    }

    // ======================================================
    // ACCESS CONTROL
    // ======================================================

    if (
      req.userRole !== "admin" &&
      profile.user.toString() !== req.userId
    ) {

      return res.status(403).json({
        success: false,
        message: "Access denied"
      });

    }

    await profileModel.findByIdAndDelete(profileId);

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ======================================================
// GET SINGLE PROFILE
// ======================================================

const getProfileById = async (req, res) => {

  try {

    const profile = await profileModel.findById(
      req.params.id
    );

    if (!profile) {

      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });

    }

    res.status(200).json(profile);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ======================================================
// GET ALL PROFILES
// ======================================================

const getAllProfile = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;

    const limit = 1000;

    const skip = (page - 1) * limit;

    const [profiles, total] = await Promise.all([

      profileModel
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      profileModel.countDocuments()

    ]);

    res.status(200).json({

      success: true,

      profiles,

      total,

      page,

      totalPages: Math.ceil(total / limit)

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ======================================================
// CHECK DUPLICATE
// ======================================================

const checkDuplicate = async (req, res) => {

  try {

    let { name, dob, contactNo } = req.query;

    if (!name || !contactNo || !dob) {

      return res.json({
        exists: false
      });

    }

    name = name.trim();

    contactNo = contactNo.trim();

    const escapeRegex = (text) => {
      return text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
    };

    const safeName = escapeRegex(name);

    const safeContact = escapeRegex(contactNo);

    const existing = await profileModel.findOne({

      name: {
        $regex: `^${safeName}\\s*$`,
        $options: "i"
      },

      dob,

      contactNo: {
        $regex: `^\\s*${safeContact}\\s*$`
      }

    });

    res.json({
      exists: !!existing
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }

};



// User Account Single biodata

const getMyBiodata = async (
  req,
  res
) => {

  try {

    const biodata =
    await profileModel.findOne({
      user:req.userId
    });

    res.status(200).json({
      success:true,
      data:biodata
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};


module.exports = {
  createProfile,
  getProfileById,
  getAllProfile,
  updateProfile,
  deleteProfile,
  checkDuplicate,
  getMyBiodata
};