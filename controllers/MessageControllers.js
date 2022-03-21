const Message=require('../models/MessageModel');
const Chat=require('../models/ChatModel');

exports.sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
  
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
  
    try {
      var newMessage = await Message.create(newMessage);
      var message=await Message.findById(newMessage._id)
                  .populate("sender","name pic")
                  .populate({
                    path:"chat",
                    populate:{
                      path:"users",
                      select:"name pic email"
                    }
                  })
  
      await Chat.findByIdAndUpdate(chatId, { lastMessage: message });
  
      return res.status(200).json(message);
    } catch (error) {
      return res.status(400).json({ error: error});
    }
  };

  exports.allMessages= async(req, res) => {
    try {
      const messages=await Message.find({chat: req.params.chatId})
                      .populate("sender","name email pic")
                      .populate("chat")
      
      return res.status(200).json({ messages:[...messages]})
    } catch (error) {
      return res.status(400).json({ error: error});
    }
  };