const cookieParser=require('cookie-parser');
const dotenv=require('dotenv');
const express = require('express');
const connectDB = require('./connectDB');
const app = express();

const chat=require('./routes/Chat');
const user=require('./routes/User');
const message=require('./routes/Message');

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

connectDB();

app.use("/api/user", user);
app.use("/api/chat", chat);
app.use("/api/message", message);



const server=app.listen(process.env.PORT||5000,()=>console.log('Server is running on port '+process.env.PORT))

const io=require('socket.io')(server,{
    pingTimeout: 60000,
    cors:{
        origin: 'http://localhost:3000'
    }
});

io.on('connection',(socket)=>{
    console.log("Connected to socket.io")

    socket.on('setup',userData=>{
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log("User joined chat",room);
    });

    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));


    socket.on("new message",(message)=>{
        var chat=message.chat;
        if(!chat.users) return console.log("Chat.users not defined");

        
        chat.users.forEach(user=>{
            if(user._id === message.sender._id) return

            socket.in(user._id).emit("message received",message);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
});