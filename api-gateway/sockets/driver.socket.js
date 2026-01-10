module.exports = (io, socket, redis) => {

//10/1/2026
//     socket.on("driver:location", async ({
//         DriverID,
//         VendorID,
//         VehicleID,
//         MobileNo,
//         lat,
//         lng,
//         Speed,
//         Direction,
//         City,
//         District,
//         Taluka,
//         State,
//         Pincode,
//         Address,
//         Driver_LPStatus,
//         Status
//     }) => {

//         console.log("driver:location", { DriverID, MobileNo, lat,lng,Driver_LPStatus,Status});

//         // /* 1️⃣ GEOADD → ONLY lng, lat, DriverID */Save driver location
//         await redis.geoadd(
//             "drivers:geo",
//             lng,
//             lat,
//             DriverID
//         );

//         /* 2️⃣ Save full driver details in HASH */
//         await redis.hset(
//             `driver:details:${DriverID}`,
//             {
//                 DriverID,
//                 VendorID,
//                 VehicleID,
//                 MobileNo,
//                 lat,
//                 lng,
//                 Speed,
//                 Direction,
//                 City,
//                 District,
//                 Taluka,
//                 State,
//                 Pincode,
//                 Address,
//                 Driver_LPStatus,
//                 Status,
//                 updatedAt: Date.now()
//             }
//         );

//         // Set expiry 1 hour (300 seconds)
//         await redis.expire(`driver:details:${DriverID}`, 300);

//          // 2️⃣ Check all active posts
//   const postKeys = await redis.keys("post:subscribers:*");

//   for (const key of postKeys) {
//     const postId = key.split(":")[2];

//     const post = await redis.hgetall(`loads:data:${postId}`);
//     if (!post?.lat || !post?.lng) continue;

//     const nearby = await redis.georadius(
//       "drivers:geo",
//       post.lng,
//       post.lat,
//       5,
//       "km"
//     );

//     const postDriverKey = `post:drivers:${postId}`;

//     // ❌ Driver left
//     if (!nearby.includes(DriverID)) {
//       await redis.hdel(postDriverKey, DriverID);
//     }

//     // ✅ Driver inside
//     if (nearby.includes(DriverID)) {
//       await redis.hset(
//         postDriverKey,
//         DriverID,
//         JSON.stringify({ DriverID, lat, lng, Speed, Status })
//       );
//     }

//     // 🔥 Send FULL UPDATED ARRAY
//     const all = await redis.hgetall(postDriverKey);
//     const drivers = Object.values(all).map(d => JSON.parse(d));

//     io.to(`post:${postId}`).emit("customer:drivers_update", {
//       postId,
//       drivers
//     });
//   }
// });

//     socket.on("driver:join", async ({ DriverID, lat, lng }) => {

//         socket.join(`driver:${DriverID}`);

//         const loadIds = await redis.georadius(
//             "loads:geo",
//             lng,
//             lat,
//             50,
//             "km"
//         );

//         const loads = [];
//         for (const id of loadIds) {
//             const status = await redis.hget("loads:status", id);
//             if (status === "OPEN") {
//                 const data = await redis.hgetall(`loads:data:${id}`);
//                 if (data?.loadId) loads.push(data);
//             }
//         }

//         socket.emit("driver:available_loads", loads);
//     });


//  socket.on("driver:join", async ({ DriverID }) => {

//   const openLoadIds = await redis.lrange("loads:open", 0, -1);

//   const loads = [];
//   for (const loadId of openLoadIds) {
//     const status = await redis.hget("loads:status", loadId);
//     if (status !== "OPEN") continue;

//     const data = await redis.hgetall(`loads:data:${loadId}`);
//     loads.push(data);
//   }

//   socket.emit("driver:available_loads", loads);

//   console.log(`🚚 Driver ${DriverID} ko ${loads.length} OLD loads mile`);
// });

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
        await redis.expire(`loads:data:${load.loadId}`, 36);

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

            await redis.expire(`driver:loads:${driver.DriverID}`, 36);

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
        await redis.expire(`loads:status`, 36);
        const keys = await redis.keys("driver:loads:*");
        for (const key of keys) {
            const ttl = await redis.ttl(key);
            if (ttl === -1) {
                // key ka TTL set nahi hai, ab set karo 1 hour
                await redis.expire(key, 36);
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

}


//         const isDriverAlreadySent = async (redis, postId, DriverID) => {
//   return await redis.sismember(`post:sent_drivers:${postId}`, DriverID);
// };

     /* 3️⃣ Loop subscribed posts */
    // const postKeys = await redis.keys("post:subscribers:*");

//     for (const key of postKeys) {
//         const postId = key.split(":")[2];

//         /* 4️⃣ Get post location */
//         const load = await redis.hgetall(`loads:data:${postId}`);
//         if (!load?.lat || !load?.lng) continue;

//         /* 5️⃣ Distance check (5 KM) */
//         const nearbyDrivers = await redis.georadius(
//             "drivers:geo",
//             load.lng,
//             load.lat,
//             50,
//             "km"
//         );

//         if (!nearbyDrivers.includes(DriverID)) continue;

//         if (!nearbyDrivers.includes(DriverID)) {
//   io.to(`post:${postId}`).emit(
//     "customer:driver_left",
//     { postId, DriverID }
//   );

//   await redis.srem(`post:sent_drivers:${postId}`, DriverID);
// }

//         /* 6️⃣ Prevent duplicate driver */
//         const alreadySent = await redis.sismember(
//             `post:sent_drivers:${postId}`,
//             DriverID
//         );

//         if (alreadySent) continue;

//         /* 7️⃣ Mark driver as sent */
//         await redis.sadd(
//             `post:sent_drivers:${postId}`,
//             DriverID
//         );
// // old and new and movement
//         /* 8️⃣ Notify customers */
//         io.to(`post:${postId}`).emit(
//             "customer:nearby_driver",
//             {

//          postId,
//     DriverID,
//     lat,
//     lng,
//     Speed,
//     Direction,
//     Status
//             }
//         );
// //             /* 8️⃣ Notify customers */
// //         io.to(`post:${postId}`).emit(
// //             "customer:new_nearby_driver",
// //             {
// //                     postId,
// //     DriverID,
// //     lat,
// //     lng,
// //     Status
// //             }
// //         );
    
// //         // 🔁 Driver is moving inside 5 KM
// // io.to(`post:${postId}`).emit(
// //   "customer:driver_moving",
// //   {
// //     postId,
// //     DriverID,
// //     lat,
// //     lng,
// //     Speed,
// //     Direction,
// //     Status
// //   }
// // );


//         // /* 8️⃣ Notify customers */
//         // const customers = await redis.smembers(
//         //     `post:subscribers:${postId}`
//         // );

//         // for (const customerId of customers) {
//         //     io.to(`customer:${customerId}`).emit(
           
//         //         "customer:new_nearby_driver",
//         //         {
//         //             postId,
//         //             DriverID,
//         //             lat,
//         //             lng
//         //         }
//         //     );
//         // }
//     }
// for (const key of postKeys) {
//   const postId = key.split(":")[2];

//   const load = await redis.hgetall(`loads:data:${postId}`);
//   if (!load?.lat || !load?.lng) continue;

//   const nearbyDrivers = await redis.georadius(
//     "drivers:geo",
//     load.lng,
//     load.lat,
//     50,
//     "km"
//   );

//   const alreadySent = await isDriverAlreadySent(redis, postId, DriverID);

//   // ❌ DRIVER LEFT
//   if (!nearbyDrivers.includes(DriverID) && alreadySent) {
//     await redis.srem(`post:sent_drivers:${postId}`, DriverID);

//     io.to(`post:${postId}`).emit("customer:drivers_update", {
//       action: "LEAVE",
//       postId,
//       DriverID
//     });

//     continue;
//   }

//   // 🚫 Not nearby and not sent
//   if (!nearbyDrivers.includes(DriverID)) continue;

//   // 🆕 NEW DRIVER JOIN
//   if (!alreadySent) {
//     await redis.sadd(`post:sent_drivers:${postId}`, DriverID);

//     io.to(`post:${postId}`).emit("customer:drivers_update", {
//       action: "JOIN",
//       postId,
//       DriverID,
//       lat,
//       lng,
//       Speed,
//       Direction,
//       Status
//     });

//     continue;
//   }

//   // 🔁 DRIVER MOVING
//   io.to(`post:${postId}`).emit("customer:drivers_update", {
//     action: "MOVE",
//     postId,
//     DriverID,
//     lat,
//     lng,
//     Speed,
//     Direction,
//     Status
//   });
// }


//         /* 3️⃣ Heartbeat */
//         await redis.hset(
//             "driver:last_seen",
//             DriverID,
//             Date.now()
//         );


        // 🔹 Broadcast ALL drivers live
    //     const driverKeys = await redis.keys("driver:details:*");

    //     const driverList = [];
    //     for (const key of driverKeys) {
    //         const data = await redis.hgetall(key);
    //         driverList.push(data);
    //     }

    //     io.emit("driver:live_location", driverList); // Array of objects


    //     // console.log("✅ Driver location updated:", driverList);

    //     // Set expiry 1 hour (300 seconds)
    //     // await redis.expire(`driver:loads:${DriverID}`, 300);
    //     //   });
    //     await redis.geoadd("drivers:geo", lng, lat, DriverID);
    //     await redis.expire("drivers:geo", 300);
    // 
    // });


//  socket.on("driver:join", async ({ DriverID }) => {

//   const openLoadIds = await redis.lrange("loads:open", 0, -1);

//   const loads = [];
//   for (const loadId of openLoadIds) {
//     const status = await redis.hget("loads:status", loadId);
//     if (status !== "OPEN") continue;

//     const data = await redis.hgetall(`loads:data:${loadId}`);
//     loads.push(data);
//   }

//   socket.emit("driver:available_loads", loads);

//   console.log(`🚚 Driver ${DriverID} ko ${loads.length} OLD loads mile`);
// });


    // DRIVER LOCATION UPDATE
    // socket.on("driver:location_update", async (data) => {
    //     const { DriverID, lat, lng } = data;

    //     // 🔥 Save driver live location
    //     await redis.geoadd(
    //         "drivers:geo",
    //         lng,
    //         lat,
    //         DriverID
    //     );

    //     console.log("📍 Driver location updated:", DriverID);
    // });

    // // DRIVER ACCEPT LOAD
    // socket.on("driver:accept_load", async ({ loadId, DriverID, CustomerID }) => {

    //     console.log(`Driver ${DriverID} accepted load ${loadId}`);

    //     // 1️⃣ Remove this load from driver available loads in Redis
    //     const driverLoadKey = `driver:loads:${DriverID}`;
    //     const loads = await redis.lrange(driverLoadKey, 0, -1);

    //     for (const l of loads) {
    //         const load = JSON.parse(l);
    //         if (load.loadId == loadId) {
    //             await redis.lrem(driverLoadKey, 0, l); // remove accepted load
    //             break;
    //         }
    //     }

    //     // 2️⃣ Update load status in Redis
    //     await redis.hset("loads:status", loadId, "ASSIGNED");

    //     // 3️⃣ Notify customer that driver accepted
    //     io.to(`customer:${CustomerID}`).emit("customer:driver_accepted", {
    //         loadId,
    //         DriverID
    //     });

    //     // 4️⃣ Notify driver – now live location tracking can start
    //     socket.emit("driver:start_tracking", {
    //         loadId,
    //         CustomerID
    //     });

    //     // ❌ Remove from open list
    //     await redis.lrem("loads:open", 0, loadId);

    //     // ❌ Remove geo
    //     await redis.zrem("loads:geo", loadId);

    //     io.emit("driver:remove_load", { loadId });
    //     console.log(`✅ Load ${loadId} assigned to Driver ${DriverID}`);
    // });


    // // DRIVER LOCATION BROADCAST (already implemented)
    // socket.on("driver:location", async (data) => {
    //     const { DriverID, lat, lng, Status } = data;

    //     // Save/update driver geo location
    //     await redis.geoadd("drivers:geo", lng, lat, DriverID);

    //     // Optional: save full driver info if needed
    //     await redis.hset(`driver:details:${DriverID}`, {
    //         lat,
    //         lng,
    //         Status,
    //         updatedAt: Date.now()
    //     });

    //     // Broadcast live location to customer & vendor
    //     io.to(`customer:${data.CustomerID}`).emit("driver:live_location", data);
    //     io.to(`vendor:${data.VendorID}`).emit("driver:live_location", data);
    // });


    //   // DRIVER ACCEPT LOAD
    //   socket.on("driver:accept_load", ({ loadId, DriverID }) => {
    //     io.emit("customer:driver_accepted", { loadId, DriverID });
    //   });

    //     socket.on("driver:accept_load", async ({ loadId }) => {

    //     // 1️⃣ Remove from open loads
    //     await redis.lrem("loads:open", 0, loadId);

    //     // 2️⃣ Update status
    //     await redis.hset(`load:details:${loadId}`, {
    //         status: "ASSIGNED"
    //     });

    //     // 3️⃣ Inform others
    //     io.emit("driver:remove_load", { loadId });
    // });


// };
