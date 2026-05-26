const express = require('express');
const { userCreate, userLogin, userLogout, userProfileUpdate, userProfile, } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware.js')

const router = express.Router();

router.post('/register',userCreate)
router.post('/login',userLogin)
router.get('/logout',authMiddleware,userLogout)
router.get('/me',authMiddleware,userProfile)
router.put('/update-profile',authMiddleware,userProfileUpdate)




module.exports = router;
