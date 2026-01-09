// module.exports = (io, socket, redis) => {
//     socket.on("customer:new_load", async (load) => {
//         console.log("customer:new_load", load);
 
//         // Save load data
//         await redis.hset(
//             `loads:data:${load.loadId}`,
//             load
//         );

//         // Save status
//         await redis.hset(
//             "loads:status",
//             load.loadId,
//             "OPEN"
//         );

//   // ✅ VERY IMPORTANT
// const type = await redis.type("loads:open");
// if (type !== "list") {
//     console.log("❌ 'loads:open' wrong type. Deleting...");
//     await redis.del("loads:open");
// }
// await redis.rpush("loads:open", load.loadId);  
//         // Save load geo
//         await redis.geoadd(
//             "loads:geo",
//             load.lng,
//             load.lat,
//             load.loadId
//         );

//         // TTL 1 hour 30000 seconds
//         await redis.expire(`loads:data:${load.loadId}`, 300);

//         const nearbyDriversRaw = await redis.georadius(
//             "drivers:geo",
//             load.lng,
//             load.lat,
//             50,
//             "km",
//             "WITHDIST"
//         );

//         // Convert to object array
//         const nearbyDrivers = nearbyDriversRaw
//             .map(([DriverID, distance]) => ({
//                 DriverID,
//                 distance: Number(distance)
//             }))
//             .sort((a, b) => a.distance - b.distance);

//         for (const driver of nearbyDrivers) {

//             const loadObj = {
//                 loadId: load.loadId,
//                 customerId: load.CustomerID,
//                 lat: load.lat,
//                 lng: load.lng,
//                 distance: driver.distance
//             };

//             // 🔥 PUSH LOAD INTO DRIVER ARRAY
//             await redis.rpush(
//                 `driver:loads:${driver.DriverID}`,
//                 JSON.stringify(loadObj)
//             );

//             await redis.expire(`driver:loads:${driver.DriverID}`, 300);

//             // 🔥 GET FULL ARRAY FOR DRIVER
//             const allLoads = await redis.lrange(
//                 `driver:loads:${driver.DriverID}`,
//                 0,
//                 -1
//             );

//             const loadArray = allLoads.map(l => JSON.parse(l));

//             // 🔥 SEND ARRAY TO DRIVER
//             io.to(`driver:${driver.DriverID}`).emit(
//                 "driver:available_loads",
//                 loadArray
//             );

//                 // 🔥 SEND ARRAY TO DRIVER
//             io.to(`driver:${driver.DriverID}`).emit(
//                 "driver:new_load",
//                 loadArray
//             );
//                 // 3️⃣ Broadcast to online drivers
//     // io.emit("driver:new_load", load);


//         }

        
//         console.log("📦 Load broadcast done:", load.loadId);
//         console.log("📦 Load broadcast done:", load);


//         // Set status also with expiry
//         await redis.hset(`loads:status`, load.loadId, "OPEN");
//         await redis.expire(`loads:status`, 300);
//         const keys = await redis.keys("driver:loads:*");
//         for (const key of keys) {
//             const ttl = await redis.ttl(key);
//             if (ttl === -1) {
//                 // key ka TTL set nahi hai, ab set karo 1 hour
//                 await redis.expire(key, 300);
//             }
//         }
//         console.log("📢 New load created:", load);
    

        
//     });

//     socket.on("customer:select_post", async ({
//   customerId,
//   postId,
//   pickupLat,
//   pickupLng
// }) => {

//   const driversRaw = await redis.georadius(
//     "drivers:geo",
//     pickupLng,
//     pickupLat,
//     5,
//     "km",
//     "WITHDIST"
//   );

//   const drivers = [];

//   for (const [DriverID, distance] of driversRaw) {

//     const details = await redis.hgetall(
//       `driver:details:${DriverID}`
//     );

//     if (!details || Object.keys(details).length === 0) continue;

//     drivers.push({
//       DriverID,
//       distance: Number(distance).toFixed(2),
//       lat: details.lat,
//       lng: details.lng,
//       Status: details.Status || "ONLINE"
//     });
//   }

//   // 🔥 ONLY CUSTOMER
//   io.to(`customer:${customerId}`).emit(
//     "customer:nearby_drivers",
//     {
//       postId,
//       count: drivers.length,
//       drivers
//     }
//   );

//   console.log(
//     `📍 Customer ${customerId} → ${drivers.length} drivers`
//   );
// });


// socket.on("driver:location", async (data) => {
//   io.to(`customer:${data.customerId}`).emit(
//     "driver:live_location",
//     data
//   );
// });

// };

module.exports = (io, socket, redis) => {

  // 🔹 CUSTOMER POST LOAD
  socket.on("customer:new_load", async (load) => {

    await redis.hset(`loads:data:${load.loadId}`, load);
    await redis.hset("loads:status", load.loadId, "OPEN");

    await redis.geoadd(
      "loads:geo",
      load.lng,
      load.lat,
      load.loadId
    );

    await redis.expire(`loads:data:${load.loadId}`, 300);

    const nearbyDrivers = await redis.georadius(
      "drivers:geo",
      load.lng,
      load.lat,
      50,
      "km",
      "WITHDIST"
    );

    for (const [DriverID, distance] of nearbyDrivers) {

      const loadObj = {
        loadId: load.loadId,
        customerId: load.customerId,
        lat: load.lat,
        lng: load.lng,
        distance: Number(distance)
      };

      await redis.rpush(
        `driver:loads:${DriverID}`,
        JSON.stringify(loadObj)
      );

      await redis.expire(`driver:loads:${DriverID}`, 300);

      const loads = await redis.lrange(
        `driver:loads:${DriverID}`, 0, -1
      );

      io.to(`driver:${DriverID}`).emit(
        "driver:available_loads",
        loads.map(JSON.parse)
      );
    }
  });

  // 🔹 CUSTOMER SELECT POST
  socket.on("customer:select_post", async ({
    customerId,
    postId,
    pickupLat,
    pickupLng
  }) => {

    const driversRaw = await redis.georadius(
      "drivers:geo",
      pickupLng,
      pickupLat,
      5,
      "km",
      "WITHDIST"
    );

    const drivers = [];

    for (const [DriverID, distance] of driversRaw) {

      const details = await redis.hgetall(
        `driver:details:${DriverID}`
      );

      if (!details || !details.lat) continue;

      drivers.push({
        DriverID,
        distance: Number(distance).toFixed(2),
        lat: details.lat,
        lng: details.lng,
        Status: details.Status || "ONLINE"
      });
    }

    io.to(`customer:${customerId}`).emit(
      "customer:nearby_drivers",
      { postId, drivers }
    );
  });

  // 🔹 DRIVER LIVE LOCATION
  socket.on("driver:location", async (data) => {

    await redis.geoadd(
      "drivers:geo",
      data.lng,
      data.lat,
      data.DriverID
    );

    await redis.hset(
      `driver:details:${data.DriverID}`,
      data
    );

    io.to(`customer:${data.customerId}`).emit(
      "driver:live_location",
      data
    );
  });
};
