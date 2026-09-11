const profileModel = require("../models/profileModel");
const imagekit = require("../config/imagekit");
const sharp = require("sharp");


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
          message: "You already created your biodata"
        });

      }

    }

    // ======================================================
    // CHECK DUPLICATE BIODATA
    // ======================================================

    const existingProfile =
      await profileModel.findOne({
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
    // IMAGE UPLOAD + OPTIMIZATION
    // ======================================================

    let photoUrl = "";

    if (req.file) {

      // Optimize uploaded image
      const optimizedImage = await sharp(req.file.buffer)
        .resize({
          width: 1200,
          height: 1200,
          fit: "inside",
          withoutEnlargement: true
        })
        .webp({
          quality: 80
        })
        .toBuffer();

      // New WebP filename
      const fileName =
        `profile-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;

      // Upload optimized image to ImageKit
      const uploadResponse =
        await imagekit.upload({
          file: optimizedImage,
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
    // IMAGE UPDATE + OPTIMIZATION
    // ======================================================

    if (req.file) {

      // Optimize uploaded image
      const optimizedImage = await sharp(req.file.buffer)
        .resize({
          width: 1200,
          height: 1200,
          fit: "inside",
          withoutEnlargement: true
        })
        .webp({
          quality: 80
        })
        .toBuffer();

      // Generate unique WebP filename
      const fileName =
        `profile-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;

      // Upload optimized image to ImageKit
      const uploadResponse =
        await imagekit.upload({
          file: optimizedImage,
          fileName,
          folder: "/profiles"
        });

      // Save new image URL
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
    const profile = await profileModel.findById(req.params.id).lean();
    console.log("ROLE:", req.userRole);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    // Sirf admin ko asli data dikhega
    // if (req.userRole !== "admin") {
    //   profile.contactNo = "Subscription Required";
    //   profile.fullAddress = "Subscription Required";
    // }

    res.status(200).json({
      success: true,
      profile
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
// GET ALL PROFILES WITH FILTER + PAGINATION
// ======================================================

const getAllProfile = async (req, res) => {
  try {

    // ======================================================
    // GET FILTER VALUES
    // ======================================================

    const {
      name,
      gender,
      city,
      maritalStatus,
      minAge,
      maxAge,
      minIncome,
      maxIncome
    } = req.query;


    // ======================================================
    // BUILD FILTER
    // ======================================================

    const filter = {};


    // ======================================================
    // NAME FILTER
    // ======================================================

    if (name && name.trim()) {

      filter.name = {
        $regex: name.trim(),
        $options: "i"
      };

    }


    // ======================================================
    // GENDER FILTER
    // ======================================================

    if (gender && gender.trim()) {

      filter.gender = {
        $regex: `^${gender.trim()}$`,
        $options: "i"
      };

    }


    // ======================================================
    // CITY FILTER
    // ======================================================

    if (city && city.trim()) {

      filter.city = {
        $regex: city.trim(),
        $options: "i"
      };

    }


    // ======================================================
    // MARITAL STATUS FILTER
    // ======================================================

    if (maritalStatus && maritalStatus.trim()) {

      filter.maritalStatus = {
        $regex: `^${maritalStatus.trim()}$`,
        $options: "i"
      };

    }


    // ======================================================
    // AGE FILTER
    // ======================================================

    if (minAge || maxAge) {

      const today = new Date();

      const dobFilter = {};


      // Minimum age
      if (minAge) {

        const minAgeNumber = Number(minAge);

        if (!isNaN(minAgeNumber)) {

          const maxDob = new Date(today);

          maxDob.setFullYear(
            today.getFullYear() - minAgeNumber
          );

          dobFilter.$lte = maxDob;

        }

      }


      // Maximum age
      if (maxAge) {

        const maxAgeNumber = Number(maxAge);

        if (!isNaN(maxAgeNumber)) {

          const minDob = new Date(today);

          minDob.setFullYear(
            today.getFullYear() - maxAgeNumber - 1
          );

          dobFilter.$gte = minDob;

        }

      }


      if (Object.keys(dobFilter).length > 0) {

        filter.dob = dobFilter;

      }

    }


    // ======================================================
    // INCOME FILTER
    // ======================================================

    if (minIncome || maxIncome) {

      filter.income = {};


      if (minIncome) {

        const minIncomeNumber = Number(minIncome);

        if (!isNaN(minIncomeNumber)) {

          filter.income.$gte = minIncomeNumber;

        }

      }


      if (maxIncome) {

        const maxIncomeNumber = Number(maxIncome);

        if (!isNaN(maxIncomeNumber)) {

          filter.income.$lte = maxIncomeNumber;

        }

      }


      // Remove empty income filter
      if (Object.keys(filter.income).length === 0) {

        delete filter.income;

      }

    }


    // ======================================================
    // DEBUG
    // ======================================================

    console.log("USER ROLE:", req.userRole);
    console.log("PROFILE FILTER:", filter);


    // ======================================================
    // PROJECTION
    // ======================================================

    const projection =
      req.userRole === "admin"
        ? ""
        : "-contactNo -fullAddress";


    // ======================================================
    // ADMIN
    // ======================================================
    // ADMIN KO KOI LIMIT NAHI HAI
    // ADMIN KO SAARE MATCHING PROFILES MILENGE
    // ======================================================

    if (req.userRole === "admin") {

      const profiles = await profileModel
        .find(filter)
        .select(projection)
        .sort({
          createdAt: -1
        })
        .lean();


      return res.status(200).json({

        success: true,

        profiles,

        total: profiles.length,

        // Admin ke liye pagination nahi
        page: 1,

        limit: profiles.length,

        totalPages: 1,

        hasMore: false

      });

    }


    // ======================================================
    // NORMAL USER
    // ======================================================
    // NORMAL USER KE LIYE LIMIT = 28
    // ======================================================

    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = 28;

    const skip = (page - 1) * limit;


    const [
      profiles,
      total
    ] = await Promise.all([

      profileModel
        .find(filter)
        .select(projection)
        .sort({
          createdAt: -1
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      profileModel.countDocuments(filter)

    ]);


    // ======================================================
    // PAGINATION
    // ======================================================

    const totalPages =
      Math.ceil(total / limit);

    const hasMore =
      page < totalPages;


    // ======================================================
    // NORMAL USER RESPONSE
    // ======================================================

    return res.status(200).json({

      success: true,

      profiles,

      total,

      page,

      limit,

      totalPages,

      hasMore

    });


  } catch (error) {

    console.error(
      "Get all profiles error:",
      error
    );


    return res.status(500).json({

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







const getSharePage = async (req, res) => {

  try {

    const profile =
      await profileModel.findById(req.params.id);

    if (!profile) {
      return res.status(404).send("Not Found");
    }

    res.send(`
<!DOCTYPE html>
<html>
<head>

<title>${profile.name}</title>

<meta property="og:title"
content="${profile.name}" />

<meta property="og:description"
content="${profile.city}" />

<meta property="og:image"
content="${profile.photo}" />

<meta property="og:image:secure_url"
content="${profile.photo}" />

<meta property="og:image:type"
content="image/jpeg" />

<meta property="og:image:width"
content="1200" />

<meta property="og:image:height"
content="630" />

<meta property="og:type"
content="website" />

<meta property="og:url"
content="https://apnavivah.in/s/${profile._id}" />

<meta name="twitter:card"
content="summary_large_image" />

<meta name="twitter:image"
content="${profile.photo}" />

<meta http-equiv="refresh"
content="2;url=https://apnavivah.in/browse-profile/${profile._id}">

</head>

<body>

<h1>${profile.name}</h1>

<img
src="${profile.photo}"
width="300"
/>

</body>
</html>
`);

  } catch (error) {

    console.log(error);

    res.status(500).send(error.message);

  }

};



module.exports = {
  createProfile,
  getProfileById,
  getAllProfile,
  updateProfile,
  deleteProfile,
  checkDuplicate,
  getMyBiodata,
  getSharePage
};