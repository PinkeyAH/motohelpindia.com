// module.exports = (io, socket) => {

//   socket.on("joinCustomer", (customerId) => {
//     socket.join(`CUSTOMER_${customerId}`);
//   });

// };
module.exports = (io, socket, redis) => {

    socket.on("customer:new_load", async (load) => {
  /*
    load = {
      loadId,
      customerId,
      lat,
      lng
    }
  */

  // Save load (optional – future use)
  await redis.hset(
    "active:loads",
    load.loadId,
    JSON.stringify(load)
  );

  // 🔥 FIND DRIVERS WITHIN 5 KM
  const nearbyDrivers = await redis.georadius(
    "drivers:geo",
    load.lng,
    load.lat,
    5,
    "km"
  );

  console.log(
    `Load ${load.loadId} nearby drivers:`,
    nearbyDrivers
  );

  // 🔥 SEND LOAD ONLY TO NEARBY DRIVERS
  nearbyDrivers.forEach(driverId => {
    io.to(`driver:${driverId}`).emit(
      "driver:available_load",
      load
    );
  });
});

};