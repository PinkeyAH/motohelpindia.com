// module.exports = (io, socket) => {

//   socket.on("joinCustomer", (customerId) => {
//     socket.join(`CUSTOMER_${customerId}`);
//   });

// };
module.exports = (io, socket, redis) => {

  // CUSTOMER POSTS LOAD
  socket.on("customer:new_load", async (data) => {
    /*
      data = {
        loadId,
        origin,
        destination,
        customerId,
        lat,
        lng
      }
    */

    await redis.set(`load:${data.loadId}`, JSON.stringify(data));

    // Broadcast to nearby drivers
    io.emit("driver:available_load", data);
  });

  // CUSTOMER SELECTS DRIVER
  socket.on("customer:select_driver", ({ loadId, driverId }) => {
    io.to(`driver:${driverId}`).emit("driver:load_assigned", { loadId });
  });
};
