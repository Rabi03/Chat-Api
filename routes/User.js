const express = require('express');
const { authUser,registerUser,allUsers } = require('../controllers/UserControllers');
const {isUserAuthenticated}=require('../middleware/auth')
const router=express.Router();

router.route('/').post(registerUser);
router.route('/login').post(authUser);
router.route('/').get(isUserAuthenticated,allUsers);

module.exports = router;
