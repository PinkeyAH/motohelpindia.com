
module.exports = (io, socket, redis) => {
  socket.on("join_post_room", ({ postId }) => {
    socket.join(`post:${postId}`);
    console.log("👤 Socket joined room:", `post:${postId}`);
  });

  // Customer creates new load
  // 10/1/2026
  // socket.on("customer:new_load", async (load) => {

  //       await redis.hset(`loads:data:${load.loadId}`, load);
  //       await redis.sadd("loads:open", load.loadId);
  //       await redis.hset("loads:status", load.loadId, "OPEN");

  //       await redis.geoadd(
  //           "loads:geo",
  //           load.lng,
  //           load.lat,
  //           load.loadId
  //       );

  //       await redis.expire(`loads:data:${load.loadId}`, 300);

  //       const drivers = await redis.georadius(
  //           "drivers:geo",
  //           load.lng,
  //           load.lat,
  //           50,
  //           "km"
  //       );

  //       for (const DriverID of drivers) {
  //           io.to(`driver:${DriverID}`).emit("driver:new_load", load);
  //       }
  //   });

  socket.on("customer:new_load", async (load) => {
    console.log("customer:new_load", load);

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

    // TTL 1 hour 3600 seconds
    await redis.expire(`loads:data:${load.loadId}`, 3600);

    const nearbyDriversRaw = await redis.georadius(
      "drivers:geo",
      load.lng,
      load.lat,
      50,
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

  // 🔹 CUSTOMER SELECT POST
  //   socket.on("customer:select_post", async ({
  //     customerId,
  //     postId,
  //     pickupLat,
  //     pickupLng
  //   }) => {

  //       // ✅ ADD LINE 1: customer ko post room me add karo
  //   socket.join(`post:${postId}`);

  //   // 🔥 RESET sent drivers (VERY IMPORTANT)
  //   await redis.del(`post:sent_drivers:${postId}`);

  //   // 🔹 Save subscriber
  //   await redis.sadd(`post:subscribers:${postId}`, customerId);

  // //       // 🔹 Add customer to post subscribers
  // //   await redis.sadd(`post:subscribers:${postId}`, customerId);

  //   // 🔹 Find existing nearby drivers (5 KM)
  //     const driversRaw = await redis.georadius(
  //       "drivers:geo",
  //       pickupLng,
  //       pickupLat,
  //       50,
  //       "km",
  //       "WITHDIST"
  //     );

  //     const drivers = [];

  //     for (const [DriverID, distance] of driversRaw) {

  //       const details = await redis.hgetall(
  //         `driver:details:${DriverID}`
  //       );

  //       if (!details || !details.lat) continue;

  //       drivers.push({
  //         DriverID,
  //         distance: Number(distance).toFixed(2),
  //         lat: details.lat,
  //         lng: details.lng,
  //         Status: details.Status || "ONLINE"
  //       });
  //     }

  //     io.to(`customer:${customerId}`).emit(
  //       "customer:nearby_drivers",
  //       { postId, drivers }
  //     );
  //   });

  // const driverMap = {};

  // socket.on("customer:drivers_update", data => {

  //   const { action, DriverID } = data;

  //   if (action === "JOIN") {
  //     driverMap[DriverID] = data;
  //     addDriverToUI(data);
  //   }

  //   if (action === "MOVE") {
  //     if (!driverMap[DriverID]) return;
  //     driverMap[DriverID].lat = data.lat;
  //     driverMap[DriverID].lng = data.lng;
  //     moveDriverMarker(data);
  //   }

  //   if (action === "LEAVE") {
  //     delete driverMap[DriverID];
  //     removeDriverFromUI(DriverID);
  //   }
  // });


  // 🔹 DRIVER LIVE LOCATION

  //   socket.on("customer:drivers_update", updates => {
  //   console.log("🚗 Drivers Update:", updates);

  //   // ✅ Always convert to array
  //   const dataArray = Array.isArray(updates) ? updates : [updates];

  //   dataArray.forEach(data => {
  //     const { action, DriverID, lat, lng } = data;

  //     // 🆕 JOIN
  //     if (action === "JOIN") {
  //       driverMap[DriverID] = data;
  //       addDriverToUI(data);
  //     }

  //     // 🔁 MOVE
  //     if (action === "MOVE") {
  //       if (!driverMap[DriverID]) {
  //         driverMap[DriverID] = data; // safety
  //         addDriverToUI(data);
  //       } else {
  //         driverMap[DriverID].lat = lat;
  //         driverMap[DriverID].lng = lng;
  //         moveDriverMarker(data);
  //       }
  //     }

  //     // ❌ LEAVE
  //     if (action === "LEAVE") {
  //       delete driverMap[DriverID];
  //       removeDriverFromUI(DriverID);
  //     }
  //   });
  // });


  // socket.on("driver:location", async (data) => {

  //   await redis.geoadd(
  //     "drivers:geo",
  //     data.lng,
  //     data.lat,
  //     data.DriverID
  //   );

  //   await redis.hset(
  //     `driver:details:${data.DriverID}`,
  //     data
  //   );

  //   io.to(`customer:${data.customerId}`).emit(
  //     "driver:live_location",
  //     data
  //   );
  // });
};
