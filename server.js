const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

const users = {};

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };

    // Welcome current user
    socket.emit("message", { username: "Admin", text: `Welcome to ${room}`, time: moment().format('HH:mm') });

    // Broadcast to others
    socket.broadcast.to(room).emit("message", { username: "Admin", text: `${username} has joined`, time: moment().format('HH:mm') });
  });

  socket.on("chatMessage", (msg) => {
    const user = users[socket.id];
    io.to(user.room).emit("message", {
      username: user.username,
      text: msg,
      time: moment().format('HH:mm')
    });
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit("message", { username: "Admin", text: `${user.username} left the chat`, time: moment().format('HH:mm') });
      delete users[socket.id];
    }
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
