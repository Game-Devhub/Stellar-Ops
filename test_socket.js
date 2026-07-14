const io = require("socket.io-client");
const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected to server! ID:", socket.id);
});

socket.on("gameStateUpdate", (state) => {
  console.log("Received state:", JSON.stringify(state));
  process.exit(0);
});

setTimeout(() => {
  console.log("Timeout waiting for game state");
  process.exit(1);
}, 5000);
