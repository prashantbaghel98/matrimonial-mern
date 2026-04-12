const express = require("express");
const router = express.Router();
const { createProfile, getProfileById, getAllProfile, updateProfile, deleteProfile } = require("../controllers/profileController");
const upload = require('../middleware/upload')
const authMiddleware = require('../middleware/authMiddleware.js')

// router.get("/:id", getProfileById);
router.post("/create",upload.single("photo"),createProfile)
router.get('/:id',getProfileById)
router.get('/',getAllProfile)
router.put('/update/:id',authMiddleware , upload.single("photo"),updateProfile)
router.delete('/delete/:id',authMiddleware, deleteProfile)

module.exports = router;  