const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ========================
// PATHS
// ========================
const DATA_DIR = path.join(__dirname, "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

// ========================
// CREATE DATA FOLDER IF MISSING
// ========================
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// ========================
// DEFAULT STATE
// ========================
const defaultState = {
  viewers: 0,
  spinning: false,
  winner: null,
  segments: [
    { name: "A", color: "#c68642" },
    { name: "B", color: "#a47148" },
    { name: "C", color: "#8b5a2b" },
    { name: "D", color: "#d2a679" }
  ]
};

// ========================
// CREATE SETTINGS FILE IF MISSING
// ========================
if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(
    SETTINGS_FILE,
    JSON.stringify(defaultState, null, 2)
  );
}

// ========================
// LOAD STATE
// ========================
let state = JSON.parse(
  fs.readFileSync(SETTINGS_FILE, "utf-8")
);

// ========================
// SAVE FUNCTION
// ========================
function saveState() {
  fs.writeFileSync(
    SETTINGS_FILE,
    JSON.stringify(state, null, 2)
  );
}

// ========================
// MIDDLEWARE
// ========================
app.use(express.static("public"));

// ========================
// SOCKET CONNECTION
// ========================
io.on("connection", (socket) => {
  state.viewers++;
  io.emit("state", state);
  saveState();

  // update segments from admin
  socket.on("update-segments", (newSegments) => {
    state.segments = newSegments;
    io.emit("state", state);
    saveState();
  });

  // spin update (optional)
  socket.on("spin", (data) => {
    state.spinning = true;
    io.emit("spin", data);
  });

  socket.on("stop-spin", (winner) => {
    state.spinning = false;
    state.winner = winner;
    io.emit("state", state);
    saveState();
  });

  socket.on("disconnect", () => {
    state.viewers--;
    io.emit("state", state);
    saveState();
  });
});

// ========================
// START SERVER
// ========================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 EthioluckyV2 running on port ${PORT}`);
});