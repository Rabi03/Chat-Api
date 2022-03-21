const express = require('express');
const { accessChat,fetchChats,renameGroup,removeFromGroup,addToGroup,createGroupChat } = require('../controllers/ChatControllers');
const { isUserAuthenticated } = require('../middleware/auth');
const router=express.Router();

router.route('/').post(isUserAuthenticated,accessChat);
router.route('/').get(isUserAuthenticated,fetchChats);
router.route("/group").post(isUserAuthenticated, createGroupChat);
router.route("/rename").put(isUserAuthenticated, renameGroup);
router.route("/groupremove").put(isUserAuthenticated, removeFromGroup);
router.route("/groupadd").put(isUserAuthenticated, addToGroup);

module.exports=router;