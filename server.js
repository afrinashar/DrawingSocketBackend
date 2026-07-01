const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.LOCAL || "https://drawing-socket.vercel.app/",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB || 'mongodb+srv://afrin:961215106001@cluster0.hbkqtqv.mongodb.net/jamboard', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Server is running');
});

let connectedUsers = 0;

io.on('connection', (socket) => {
  connectedUsers++;
  console.log('a user connected. Total users:', connectedUsers);
  
  // Broadcast user count to all connected clients
  io.emit('userCount', connectedUsers);

  // Handle drawing events
  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    connectedUsers--;
    console.log('user disconnected. Total users:', connectedUsers);
    io.emit('userCount', connectedUsers);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
