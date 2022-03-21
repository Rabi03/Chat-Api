const express = require('express');
const { sendMessage,allMessages }= require('../controllers/MessageControllers');
const { isUserAuthenticated } = require('../middleware/auth');
const router=express.Router();

router.route('/').post(isUserAuthenticated,sendMessage);
router.route('/:chatId').get(isUserAuthenticated,allMessages);

module.exports=router;