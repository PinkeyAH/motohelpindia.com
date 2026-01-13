
module.exports = (io, socket, redis) => {
  socket.on("join_post_room", ({ postId }) => {
    socket.join(`post:${postId}`);
    console.log("👤 Socket joined room:", `post:${postId}`);
  });

  socket.on("customer:new_load", async (load) => {
    console.log("customer:new_load", load);

    // Save load data
    await redis.hset(`loads:data:${load.loadId}`, load);

    // TTL 1 hour 3600 seconds
    await redis.expire(`loads:data:${load.loadId}`, 3600);

    // Save status
    await redis.hset("loads:status", load.loadId, "OPEN");
    await redis.expire(`loads:status`, 3600); // 1 hour TTL

    // Save load geo
    await redis.geoadd("loads:geo", load.lng, load.lat, load.loadId);
    await redis.set(`loads:expiry:${load.loadId}`, 1, "EX", 3600); // TTL key for cleanup
    await redis.expire(`loads:geo`, 3600); // optional for all loads

    const nearbyDriversRaw = await redis.georadius("drivers:geo", load.lng, load.lat, 50, "km", "WITHDIST");

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
        customerId: load.CustomerID,
        lat: load.lat,
        lng: load.lng,
        distance: driver.distance
      };

      // 🔥 PUSH LOAD INTO DRIVER ARRAY
      await redis.rpush(
        `driver:loads:${driver.DriverID}`,
        JSON.stringify(loadObj)
      );

      await redis.expire(`driver:loads:${driver.DriverID}`, 3600);

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

    console.log("📦 Load broadcast done:", load.loadId);
    console.log("📦 Load broadcast done:", load);


    // Set status also with expiry
    await redis.hset(`loads:status`, load.loadId, "OPEN");
    await redis.expire(`loads:status`, 3600);
    const keys = await redis.keys("driver:loads:*");
    for (const key of keys) {
      const ttl = await redis.ttl(key);
      if (ttl === -1) {
        // key ka TTL set nahi hai, ab set karo 1 hour
        await redis.expire(key, 3600);
      }
    }
    console.log("📢 New load created:", load);
  });

  socket.on("driver:location", async (data) => {
    io.to(`customer:${data.customerId}`).emit(
      "driver:live_location",
      data
    );
  });

  socket.on("customer:select_post", async ({ customerId, postId }) => {

    // 1️⃣ Join post room
    socket.join(`post:${postId}`);

    // 2️⃣ Save subscriber
    await redis.sadd(`post:subscribers:${postId}`, customerId);

    // 3️⃣ Get post pickup location
    const post = await redis.hgetall(`loads:data:${postId}`);
    if (!post?.lat || !post?.lng) return;

    // 4️⃣ Find nearby drivers (5 KM)
    const nearbyDrivers = await redis.georadius(
      "drivers:geo",
      post.lng,
      post.lat,
      50,
      "km"
    );

    const drivers = [];

    // 5️⃣ Get full driver details
    for (const DriverID of nearbyDrivers) {
      const details = await redis.hgetall(`driver:details:${DriverID}`);
      if (!details?.lat) continue;

      drivers.push({
        DriverID,
        lat: details.lat,
        lng: details.lng,
        Speed: details.Speed,
        Status: details.Status,
        distance: details.distance

      });
    }

    // 6️⃣ Save snapshot for live updates
    await redis.del(`post:drivers:${postId}`);
    for (const d of drivers) {
      await redis.hset(
        `post:drivers:${postId}`,
        d.DriverID,
        JSON.stringify(d)
      );
    }

    // 7️⃣ Send FULL ARRAY to customer
    socket.emit("customer:drivers_update", {
      postId,
      drivers
    });
  });

  socket.on("customer:load_accepted", ({ loadId, DriverID }) => {
  log(`✅ Load ${loadId} accepted by Driver ${DriverID}`);
});

socket.on("customer:driver_nearby", ({ DriverID, distance }) => {
  log(`🚨 Driver ${DriverID} is ${distance.toFixed(0)} meters away`);
});
// 🆕 Driver assigned final confirmation
socket.on("customer:driver_assigned", ({ loadId, DriverID }) => {
  log(`✅ FINAL: Driver ${DriverID} assigned to Load ${loadId}`);
});

};
