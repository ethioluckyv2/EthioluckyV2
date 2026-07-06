const socket = io();

let state = null;
let rotation = 0;
let spinning = false;

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

// ---------------- LOGIN ----------------
function login() {
  const role = document.getElementById("role").value;
  const password = document.getElementById("password").value;

  socket.emit("login", { role, password });

  socket.on("login-success", () => {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
  });
}

// ---------------- STATE ----------------
socket.on("state", (s) => {
  state = s;
  document.getElementById("viewers").innerText = s.viewers;
  draw();
});

// ---------------- DRAW WOOD CASINO WHEEL ----------------
function draw() {
  if (!state || !state.segments) return;

  const segs = state.segments.length;
  const angle = (Math.PI * 2) / segs;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, 400, 400);

  // 🎨 WOOD BACKGROUND CIRCLE
  ctx.beginPath();
  ctx.fillStyle = "#6b3e1e";
  ctx.arc(200, 200, 210, 0, Math.PI * 2);
  ctx.fill();

  // wheel center
  ctx.translate(200, 200);
  ctx.rotate((rotation * Math.PI) / 180);

  // 🎡 segments
  state.segments.forEach((seg, i) => {
    ctx.beginPath();
    ctx.fillStyle = seg.color;

    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 190, i * angle, (i + 1) * angle);
    ctx.fill();

    // text
    ctx.save();
    ctx.rotate(i * angle + angle / 2);
    ctx.fillStyle = "#111";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "right";
    ctx.fillText(seg.name, 150, 5);
    ctx.restore();
  });

  // reset transform
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  drawPointer();
}

// ---------------- GOLD POINTER ----------------
function drawPointer() {
  ctx.fillStyle = "gold";
  ctx.beginPath();
  ctx.moveTo(200, 5);
  ctx.lineTo(185, 40);
  ctx.lineTo(215, 40);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#000";
  ctx.stroke();
}

// ---------------- SPIN (CASINO FEEL) ----------------
socket.on("spin-start", () => {
  if (spinning) return;

  spinning = true;

  // 🔊 SPIN SOUND
  const spinSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-fast-roulette-spin-187.mp3");
  spinSound.volume = 0.6;
  spinSound.play();

  let speed = 55; // very fast start
  const friction = 0.986;

  function animate() {
    rotation += speed;
    speed *= friction;

    draw();

    // ✨ glow effect
    canvas.style.boxShadow = "0 0 25px gold";

    if (speed < 0.12) {
      spinning = false;
      canvas.style.boxShadow = "0 0 10px rgba(255,215,0,0.4)";
      showWinner();
      celebrate();
      return;
    }

    requestAnimationFrame(animate);
  }

  animate();
});

// ---------------- BUTTON ----------------
function spin() {
  socket.emit("spin");
}

// ---------------- WINNER ----------------
function showWinner() {
  if (!state) return;

  const segs = state.segments.length;
  const angle = 360 / segs;

  let normalized = rotation % 360;
  if (normalized < 0) normalized += 360;

  const adjusted = (360 - normalized) % 360;
  const index = Math.floor(adjusted / angle);

  const winner = state.segments[index];

  const el = document.getElementById("winner");
  el.innerText = "🎉 WINNER: " + winner.name;

  el.style.transform = "scale(1.2)";
  setTimeout(() => el.style.transform = "scale(1)", 300);
}

// ---------------- CELEBRATION ----------------
function celebrate() {
  for (let i = 0; i < 35; i++) {
    createConfetti();
  }
}

// simple confetti
function createConfetti() {
  const c = document.createElement("div");
  c.style.position = "fixed";
  c.style.width = "8px";
  c.style.height = "8px";
  c.style.background = ["gold", "red", "blue", "green", "white"][Math.floor(Math.random()*5)];
  c.style.left = Math.random() * window.innerWidth + "px";
  c.style.top = "-10px";
  c.style.zIndex = "9999";

  document.body.appendChild(c);

  let y = 0;

  function fall() {
    y += 5;
    c.style.top = y + "px";

    if (y < window.innerHeight) {
      requestAnimationFrame(fall);
    } else {
      c.remove();
    }
  }

  fall();
}