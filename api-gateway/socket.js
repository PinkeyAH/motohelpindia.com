const { Server } = require("socket.io");

function initializeSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Base socket connected:", socket.id);

    socket.on("ping", () => {
      socket.emit("pong", { message: "Pong from Gateway!" });
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Client disconnected (${socket.id}) - Reason: ${reason}`);
    });
  });

  // ✅ Store io reference for other modules
  app.set("socketio", io);
  return io;
}

module.exports = initializeSocket;
