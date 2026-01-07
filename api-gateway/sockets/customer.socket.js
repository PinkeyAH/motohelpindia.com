// module.exports = (io, socket) => {

//   socket.on("joinCustomer", (customerId) => {
//     socket.join(`CUSTOMER_${customerId}`);
//   });

// };
module.exports = (io, socket, redis) => {

//     socket.on("customer:new_load", async (load) => {
//   /*
//     load = {
//       loadId,
//       customerId,
//       lat,
//       lng
//     }
//   */

//   // Save load (optional – future use)
//   await redis.hset(
//     "active:loads",
//     load.loadId,
//     JSON.stringify(load)
//   );

//   // 🔥 FIND DRIVERS WITHIN 5 KM
//   const nearbyDrivers = await redis.georadius(
//     "drivers:geo",
//     load.lng,
//     load.lat,
//     5,
//     "km"
//   );

//   console.log(
//     `Load ${load.loadId} nearby drivers:`,
//     nearbyDrivers
//   );

//   // 🔥 SEND LOAD ONLY TO NEARBY DRIVERS
//   nearbyDrivers.forEach(DriverID => {
//     io.to(`driver:${DriverID}`).emit(
//       "driver:available_load",
//       load
//     );
//   });
// });
socket.on("customer:new_load", async (load) => {
  /*
    load = { loadId, customerId, lat, lng }
  */

  // Save load as OPEN
  await redis.hset(
    "loads:status",
    load.loadId,
    "OPEN"
  );

  // Find drivers within 5 KM WITH DISTANCE
  const nearbyDrivers = await redis.georadius(
    "drivers:geo",
    load.lng,
    load.lat,
    5,
    "km",
    "WITHDIST"
  );

  // Sort by nearest distance
  nearbyDrivers.sort((a, b) => a[1] - b[1]);

  nearbyDrivers.forEach(([DriverID, distance]) => {
    io.to(`driver:${DriverID}`).emit(
      "driver:available_load",
      {
        ...load,
        distance: Number(distance).toFixed(2) // km
      }
    );
  });

  console.log("Load sent to nearby drivers:", load.loadId);
});

};