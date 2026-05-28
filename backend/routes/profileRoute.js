const express = require("express");
const router = express.Router();
const { createProfile, getProfileById, getAllProfile, updateProfile, deleteProfile, checkDuplicate,getMyBiodata, getSocialProfile } = require("../controllers/profileController");
const upload = require('../middleware/upload')
const authMiddleware = require('../middleware/authMiddleware.js')


router.get("/check",checkDuplicate)
router.get('/',getAllProfile)
router.get('/my-biodata',authMiddleware,getMyBiodata)
router.get('/:id',getProfileById)
router.post("/create",authMiddleware,upload.single("photo"),createProfile)
router.put('/update/:id',authMiddleware , upload.single("photo"),updateProfile)
router.delete('/delete/:id',authMiddleware, deleteProfile)
router.get('/my-biodata',authMiddleware,getMyBiodata)



module.exports = router;  