const Chat = require("../models/ChatModel");

exports.accessChat=async(req,res) =>{
    const {userId}=req.body;
    if(!userId){
        return res.status(400).json({
            error: 'UserId not provied'
        });
    }

    const hasChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    })
    .populate('users','-password')
    .populate({
        path:"lastMessage",
        select:"sender content timestamp",
        populate:{
            path:"sender",
            select:"name pic email"
        },
    });

    if(hasChat.length>0){
        return res.status(200).json({
            chat:hasChat[0]
        })
    }else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
          };
      
          try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
              "users",
              "-password"
            );
            return res.status(200).json(FullChat);
          } catch (error) {
            return res.status(400).json({
                error:error.message
            });
          }
    }
};

exports.fetchChats=async(req, res) => {
    try{
    const chats=await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
                      .populate("users","-password")
                      .populate("groupAdmin")
                      .populate({
                          path:"lastMessage",
                          populate:{
                            path:"sender",
                            select:"name email pic"
                          }
                      })
                      .sort({updatedAt:-1});
    

    return res.status(200).json({
        chats
    });
    
    } catch(error){
        return res.status(400).json({
            errror:error
        })
    }
};

exports.createGroupChat=async(req, res) => {
    if(!req.body.users|| !req.body.chatName){
        return res.status(400).json({ message: "Please Fill all the feilds" });
    }
    const {users,chatName}=req.body;

    if(users.length<2){
    return res
      .status(400)
      .json({ message:"More than 2 users are required to form a group chat"});
    };

    users.push(req.user._id);

    try {

        const groupChat=await Chat.create({
            chatName,
            isGroupChat:true,
            users,
            groupAdmin:req.user._id
        });

        console.log(groupChat);

        const fullChat=await Chat.findOne({_id:groupChat._id})
            .populate("users","-password")
            .populate("groupAdmin","-password")
        
        return res.status(200).json({
            chat:fullChat
        })
        
    } catch (error) {
        return res.status(400).json({
            error:error
        })
    }

};

exports.renameGroup=async(req, res) => {
    const {chatId,chatName} = req.body;
    try {

        const updateChat = await Chat.findByIdAndUpdate(
            chatId,
            {chatName:chatName},
            {new:true}
        );

        return res.status(200).json({
            updateChat
        })
        
    } catch (error) {
        return res.status(400).json({
            error:error
        });
    }
};

exports.removeFromGroup=async(req, res) => {
    const {chatId,userId} = req.body;

    try {
        const removed= await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull:{users:userId}
            },
            {new:true}
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        return res.status(200).json({
            removed
        })
        
    } catch (error) {
        return res.status(400).json({
            error:error
        });
    }
};

exports.addToGroup=async(req, res) => {
    const {chatId,userId}=req.body;

    try {

        const added = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push:{users:userId}
            }
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        return res.status(200).json({
            added
        })


        
    } catch (error) {
        return res.status(400).json({
            error:error
        });
    }
};