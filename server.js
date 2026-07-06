const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));

// 🔐 SIMPLE LOGIN CREDENTIALS (change later if you want)
const USERS = {
  admin: { password: "admin123", role: "admin" },
  host: { password: "host123", role: "host" }
};

// LOGIN API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = USERS[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: "Invalid login" });
  }

  res.json({
    success: true,
    role: user.role
  });
});

// SOCKET.IO
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("spinWheel", (data) => {
    io.emit("spinWheel", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});