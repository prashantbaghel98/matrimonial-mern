const express = require('express');
const { userCreate, userLogin } = require('../controllers/userController');
const router = express.Router();

router.post('/register',userCreate)
router.post('/login',userLogin)




module.exports = router;
