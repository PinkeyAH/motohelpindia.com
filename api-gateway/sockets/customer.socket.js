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

//         // Save load geo
//         await redis.geoadd(
//             "loads:geo",
//             load.lng,
//             load.lat,
//             load.loadId
//         );

//         // TTL 1 hour 3600 seconds
//         await redis.expire(`loads:data:${load.loadId}`, 36);

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

//             await redis.expire(`driver:loads:${driver.DriverID}`, 36);

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
//         await redis.expire(`loads:status`, 36);
//         const keys = await redis.keys("driver:loads:*");
//         for (const key of keys) {
//             const ttl = await redis.ttl(key);
//             if (ttl === -1) {
//                 // key ka TTL set nahi hai, ab set karo 1 hour
//                 await redis.expire(key, 36);
//             }
//         }
//         console.log("📢 New load created:", load);
//     });

// socket.on("driver:location", async (data) => {
//   io.to(`customer:${data.customerId}`).emit(
//     "driver:live_location",
//     data
//   );
// });

// };

module.exports = (io, socket, redis) => {

    socket.on("customer:new_load", async (load) => {

        await redis.hset(`loads:data:${load.loadId}`, load);
        await redis.sadd("loads:open", load.loadId);
        await redis.hset("loads:status", load.loadId, "OPEN");

        await redis.geoadd(
            "loads:geo",
            load.lng,
            load.lat,
            load.loadId
        );

        await redis.expire(`loads:data:${load.loadId}`, 300);

        const drivers = await redis.georadius(
            "drivers:geo",
            load.lng,
            load.lat,
            50,
            "km"
        );

        for (const DriverID of drivers) {
            io.to(`driver:${DriverID}`).emit("driver:new_load", load);
        }
    });
};
