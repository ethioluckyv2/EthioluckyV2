const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// -------------------- FILE PATHS --------------------
const DATA_DIR = path.join(__dirname, "data");
const SETTINGS_PATH = path.join(DATA_DIR, "settings.json");
const PLAYERS_PATH = path.join(DATA_DIR, "players.json");

// -------------------- LOAD DATA --------------------
function loadSettings() {
  return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf-8"));
}

function saveSettings(data) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2));
}

function loadPlayers() {
  return JSON.parse(fs.readFileSync(PLAYERS_PATH, "utf-8"));
}

function savePlayers(data) {
  fs.writeFileSync(PLAYERS_PATH, JSON.stringify(data, null, 2));
}

// -------------------- INITIAL STATE --------------------
let settings = loadSettings();
let players = loadPlayers();

let state = {
  viewers: 0,
  spinning: false,
  winner: null,
  segments: players
};

// -------------------- SECURITY SESSIONS --------------------
const sessions = {};

// -------------------- STATIC FILES --------------------
app.use(express.static(path.join(__dirname, "public")));

// -------------------- SOCKET CONNECTION --------------------
io.on("connection", (socket) => {
  state.viewers++;
  io.emit("state", state);

  // -------- LOGIN --------
  socket.on("login", ({ role, password }) => {
    if (role === "admin" && password === settings.adminPassword) {
      sessions[socket.id] = "admin";
      socket.emit("login-success", "admin");
    } 
    else if (role === "host" && password === settings.hostPassword) {
      sessions[socket.id] = "host";
      socket.emit("login-success", "host");
    } 
    else {
      socket.emit("login-failed");
    }
  });

  // -------- ADMIN: UPDATE PLAYERS --------
  socket.on("update-players", (newPlayers) => {
    if (sessions[socket.id] !== "admin") return;

    players = newPlayers;
    state.segments = players;

    savePlayers(players);

    io.emit("state", state);
  });

  // -------- ADMIN: UPDATE SETTINGS --------
  socket.on("update-settings", (newSettings) => {
    if (sessions[socket.id] !== "admin") return;

    settings = { ...settings, ...newSettings };

    saveSettings(settings);

    io.emit("settings", settings);
  });

  // -------- SPIN WHEEL --------
  socket.on("spin", () => {
    if (sessions[socket.id] !== "admin") return;
    if (state.spinning) return;

    state.spinning = true;
    state.winner = null;

    io.emit("spin-start");

    const duration = settings.wheel.spinDuration * 1000;

    setTimeout(() => {
      const index = Math.floor(Math.random() * players.length);
      const winner = players[index];

      state.winner = winner;
      state.spinning = false;

      io.emit("spin-end", winner);
      io.emit("state", state);
    }, duration);
  });

  // -------- DISCONNECT --------
  socket.on("disconnect", () => {
    state.viewers--;
    delete sessions[socket.id];
    io.emit("state", state);
  });
});

// -------------------- START SERVER --------------------
server.listen(3000, () => {
  console.log("🚀 EthioluckyV2 running on http://localhost:3000");
});