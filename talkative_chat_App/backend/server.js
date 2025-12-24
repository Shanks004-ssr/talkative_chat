const express=require('express')
const dotenv=require('dotenv')
const connectDB=require('./config/db')
const userRoutes=require('./routes/userRoutes')
const chatRoutes = require("./routes/chatRoutes");
const cors = require("cors");
const messageRoutes=require('./routes/messageRoutes')
const path = require('path')

const app=express()
app.use(cors());
dotenv.config()
connectDB()
const PORT=process.env.PORT||5000
app.use(express.json())
app.use('/api/user',userRoutes)
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server=app.listen(5000,()=>{console.log(`server running on port ${5000}`)})
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    
  },
});
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    
    socket.join(userData._id);
    //console.log(userData._id)
    socket.emit("connected");
  });
   socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
   socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    console.log(chat)

    if (!chat||!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
   socket.on("typing", (room) => socket.in(room).emit("typing"));
   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

 
  });
