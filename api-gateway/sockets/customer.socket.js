module.exports = (io, socket, redis) => {
    socket.on("customer:new_load", async (load) => {
  
        // Save load data
  await redis.hset(
    `loads:data:${load.loadId}`,
    load
  );

  // Save status
  await redis.hset(
    "loads:status",
    load.loadId,
    "OPEN"
  );

  // Save load geo
  await redis.geoadd(
    "loads:geo",
    load.lng,
    load.lat,
    load.loadId
  );

  const nearbyDriversRaw = await redis.georadius(
    "drivers:geo",
    load.lng,
    load.lat,
    5,
    "km",
    "WITHDIST"
  );

  // Convert to object array
  const nearbyDrivers = nearbyDriversRaw
    .map(([DriverID, distance]) => ({
      DriverID,
      distance: Number(distance)
    }))
    .sort((a, b) => a.distance - b.distance);

  for (const driver of nearbyDrivers) {

    const loadObj = {
      loadId: load.loadId,
      customerId: load.customerId,
      lat: load.lat,
      lng: load.lng,
      distance: driver.distance
    };

    // 🔥 PUSH LOAD INTO DRIVER ARRAY
    await redis.rpush(
      `driver:loads:${driver.DriverID}`,
      JSON.stringify(loadObj)
    );

    // 🔥 GET FULL ARRAY FOR DRIVER
    const allLoads = await redis.lrange(
      `driver:loads:${driver.DriverID}`,
      0,
      -1
    );

    const loadArray = allLoads.map(l => JSON.parse(l));

    // 🔥 SEND ARRAY TO DRIVER
    io.to(`driver:${driver.DriverID}`).emit(
      "driver:available_loads",
      loadArray
    );
  }
});
};

