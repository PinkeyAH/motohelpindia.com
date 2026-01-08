const { Server } = require("socket.io");
const Redis = require("ioredis");

const redis = new Redis();

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", ({ userId, role }) => {
      socket.join(`${role}:${userId}`);
        console.log(`Socket ${socket.id} joined room: ${role}:${userId}`);
    });
    require("./driver.socket")(io, socket, redis);
    require("./customer.socket")(io, socket, redis);
    require("./vendor.socket")(io, socket, redis);

    // require("./events/customer.events")(io, socket, redis);
    // require("./events/driver.events")(io, socket, redis);
    // require("./events/vendor.events")(io, socket, redis);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

module.exports = { initSocket };
