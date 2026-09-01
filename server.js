const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (message) => {
    // Forward signaling message to all other connected clients
    for (const client of wss.clients) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
