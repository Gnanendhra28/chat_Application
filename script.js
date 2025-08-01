document.getElementById("join-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const room = document.getElementById("room").value;
  localStorage.setItem("username", username);
  localStorage.setItem("room", room);
  window.location.href = "chat.html";
});
