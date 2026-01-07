// module.exports = (io, socket) => {

//   socket.on("joinVendor", ({ vendorId }) => {
//     socket.join(`VENDOR_${vendorId}`);
//     console.log("Vendor joined:", vendorId);
//   });

// };

// module.exports = (io, socket) => {

//   socket.on("vendor:track_driver", ({ driverId }) => {
//     io.to(`vendor:${socket.id}`).emit("vendor:tracking_started", { driverId });
//   });
// };

module.exports = (io, socket, redis) => {

  socket.on("vendor:get_drivers", async () => {
    const drivers = await redis.hgetall("driver:locations");

    const driverList = Object.values(drivers).map(d =>
      JSON.parse(d)
    );

    socket.emit("vendor:drivers", driverList);
  });

};
