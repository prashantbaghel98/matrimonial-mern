const multer = require("multer");

// Memory storage for ImageKit upload
const storage = multer.memoryStorage(); // store file in memory buffer

// Only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images allowed"), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;