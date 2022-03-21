const mongoose = require('mongoose');

const chatSchema=mongoose.Schema({
    chatName:{type:String, required:true,trim:true},
    isGroupChat:{type:Boolean, required:true},
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    lastMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

},
{ timestamps: true }
);

module.exports=mongoose.model('Chat',chatSchema);