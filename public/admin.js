const socket = io();

let players = [];

// ---------------- ADD PLAYER ----------------
function addPlayer() {
  const name = document.getElementById("name").value;
  const color = document.getElementById("color").value;

  if (!name || !color) return;

  players.push({
    id: Date.now(),
    name,
    color
  });

  render();
}

// ---------------- REMOVE PLAYER ----------------
function removePlayer(id) {
  players = players.filter(p => p.id !== id);
  render();
}

// ---------------- RENDER LIST ----------------
function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  players.forEach(p => {
    const div = document.createElement("div");

    div.innerHTML = `
      <span style="color:${p.color}">
        ${p.name}
      </span>
      <button onclick="removePlayer(${p.id})">X</button>
    `;

    list.appendChild(div);
  });
}

// ---------------- SEND TO SERVER ----------------
function sendUpdate() {
  socket.emit("update-players", players);
}

// ---------------- START SPIN ----------------
function startSpin() {
  socket.emit("spin");
}