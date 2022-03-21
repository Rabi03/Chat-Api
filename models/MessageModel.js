const mongoose = require('mongoose');

const messageSchema=mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    type:{
        type:String
    },
    content:{
        type:String
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat'
    },
    readBy:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
},
{ timestamps: true }
);

module.exports =mongoose.model('Message',messageSchema);