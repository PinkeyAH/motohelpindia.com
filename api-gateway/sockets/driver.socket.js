
module.exports = (io, socket, redis) => {


  socket.on("driver:location", async ({ driverId, lat, lng }) => {

  // Save/update driver location
  await redis.geoadd(
    "drivers:geo",
    lng,
    lat,
    driverId
  );

  await redis.hset(
    "driver:last_seen",
    driverId,
    Date.now()
  );


  io.emit("driver:live_location", { driverId, lat, lng });
});

  // DRIVER ACCEPT LOAD
  socket.on("driver:accept_load", ({ loadId, driverId }) => {
    io.emit("customer:driver_accepted", { loadId, driverId });
  });
};



