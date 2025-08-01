const socket = io();

const username = localStorage.getItem("username");
const room = localStorage.getItem("room");

if (!username || !room) window.location.href = "/";

socket.emit("joinRoom", { username, room });

const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const messages = document.getElementById("messages");
const roomName = document.getElementById("room-name");

roomName.textContent = room;

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (message.trim()) {
    socket.emit("chatMessage", message);
    messageInput.value = "";
    messageInput.focus();
  }
});

socket.on("message", (data) => {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${data.username}</strong> [${data.time}]: ${data.text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});
