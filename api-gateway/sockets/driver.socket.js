
module.exports = (io, socket, redis) => {

//   // DRIVER LOCATION UPDATE
//   socket.on("driver:location", async ({ driverId, lat, lng }) => {
//     await redis.hset(
//       "driver:locations",
//       driverId,
//       JSON.stringify({ lat, lng })
//     );

//     // Send to customer & vendor
//     io.emit("driver:live_location", { driverId, lat, lng });
//   });

  socket.on("driver:location", async ({ driverId, lat, lng }) => {
  await redis.hset(
    "driver:locations",
    driverId,
    JSON.stringify({ lat, lng, time: Date.now() })
  );

  io.emit("driver:live_location", { driverId, lat, lng });
});

  // DRIVER ACCEPT LOAD
  socket.on("driver:accept_load", ({ loadId, driverId }) => {
    io.emit("customer:driver_accepted", { loadId, driverId });
  });
};

// module.exports = (io, socket) => {

//   // Driver join
//   socket.on("joinDriver", ({ driverId }) => {
//     socket.join(`DRIVER_${driverId}`);
//     console.log("Driver joined:", driverId);
//   });

//   // Driver live location
//   socket.on("driverLocation", (data) => {
//     /*
//       data = {
//         driverId,
//         vendorId,
//         vehicleId,
//         mobileNo,
//         lat,
//         lng,
//         speed,
//         direction,
//         city,
//         district,
//         taluka,
//         state,
//         pincode,
//         address,
//         driver_LPStatus,
//         status
//       }
//     */

//     // 🔥 Vendor ko driver ki live location bhejo
//     io.to(`VENDOR_${data.vendorId}`).emit("driverLiveLocation", {
//       driverId: data.driverId,
//       vehicleId: data.vehicleId,
//       mobileNo: data.mobileNo,
//       lat: data.lat,
//       lng: data.lng,
//       speed: data.speed,
//       direction: data.direction,
//       status: data.status,
//       address: data.address
//     });
//   });

// };
