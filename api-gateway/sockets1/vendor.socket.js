

// module.exports = (io, socket, redis) => {

//   socket.on("vendor:get_drivers", async () => {
//     const drivers = await redis.hgetall("driver:locations");

//     const driverList = Object.values(drivers).map(d =>
//       JSON.parse(d)
//     );

//     socket.emit("vendor:drivers", driverList);
//   });

// };

// module.exports = (io, socket, redis) => {

//     socket.on("vendor:join", ({ VendorID }) => {
//     socket.join(`vendor:${VendorID}`);
//     console.log("🏢 Vendor joined:", VendorID);
// });


//     socket.on("vendor:select_driver", async ({ vendorId, DriverID }) => {

//         // 1️⃣ Driver ki location nikalo
//         const driverPos = await redis.geopos(
//             "drivers:geo",
//             DriverID
//         );

//         if (!driverPos || !driverPos[0]) {
//             console.log("❌ Driver location not found");
//             return;
//         }

//         const [lng, lat] = driverPos[0];

//         // 2️⃣ 5 KM ke andar ke loads
//         const nearbyLoads = await redis.georadius(
//             "loads:geo",
//             lng,
//             lat,
//             50,
//             "km"
//         );

//         const loads = [];

//         for (const loadId of nearbyLoads) {

//             const status = await redis.hget(
//                 "loads:status",
//                 loadId
//             );

//             if (status !== "OPEN") continue;

//             const loadData = await redis.hgetall(
//                 `loads:data:${loadId}`
//             );

//             loads.push(loadData);
//         }

//         // 3️⃣ Vendor ko bhejo
//         io.to(`vendor:${vendorId}`).emit(
//             "vendor:nearby_loads_for_driver",
//             {
//                 DriverID,
//                 loads
//             }
//         );

//         console.log(
//             `📦 Vendor ${vendorId} ko ${loads.length} loads mile`
//         );
//     });

// };

module.exports = (io, socket, redis) => {

    /* ==============================
       VENDOR JOIN
    ============================== */
    socket.on("vendor:join", ({ VendorID }) => {

        if (!VendorID) {
            console.log("❌ VendorID missing in vendor:join");
            return;
        }

        socket.join(`vendor:${VendorID}`);
        socket.vendorId = VendorID; // 🔥 store in socket

        console.log("🏢 Vendor joined:", VendorID);
    });


    /* ==============================
       VENDOR SELECT DRIVER
    ============================== */
    socket.on("vendor:select_driver", async ({ VendorID, DriverID }) => {

        // 🔒 SAFETY: vendor must be joined
        const vendorId = VendorID || socket.vendorId;

        if (!vendorId || !DriverID) {
            console.log("❌ Invalid vendor:select_driver payload:", {
                VendorID,
                socketVendor: socket.vendorId,
                DriverID
            });
            return;
        }

        console.log(`🔍 Vendor ${vendorId} selected driver ${DriverID}`);

        /* 1️⃣ Get driver location */
        const driverPos = await redis.geopos("drivers:geo", DriverID);

        if (!driverPos || !driverPos[0]) {
            console.log("❌ Driver location not found:", DriverID);
            return;
        }

        const [lng, lat] = driverPos[0];

        /* 2️⃣ Find nearby OPEN loads */
        const nearbyLoadIds = await redis.georadius(
            "loads:geo",
            lng,
            lat,
            50,
            "km"
        );

        const loads = [];

        for (const loadId of nearbyLoadIds) {

            const status = await redis.hget("loads:status", loadId);
            if (status !== "OPEN") continue;

            const loadData = await redis.hgetall(`loads:data:${loadId}`);

            if (loadData && loadData.loadId) {
                loads.push(loadData);
            }
        }

        /* 3️⃣ Send loads to vendor room */
        io.to(`vendor:${vendorId}`).emit(
            "vendor:nearby_loads_for_driver",
            {
                DriverID,
                totalLoads: loads.length,
                loads
            }
        );

        console.log(
            `📦 Vendor ${vendorId} received ${loads.length} loads for driver ${DriverID}`
        );
    });

};
