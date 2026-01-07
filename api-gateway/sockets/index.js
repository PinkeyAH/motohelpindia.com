module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    require("./driver.socket")(io, socket);
    require("./customer.socket")(io, socket);
    require("./vendor.socket")(io, socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });
};
