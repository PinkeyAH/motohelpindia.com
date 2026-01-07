

module.exports = (io, socket, redis) => {

  socket.on("vendor:get_drivers", async () => {
    const drivers = await redis.hgetall("driver:locations");

    const driverList = Object.values(drivers).map(d =>
      JSON.parse(d)
    );

    socket.emit("vendor:drivers", driverList);
  });

};
