

// module.exports = (io, socket, redis) => {

//   socket.on("vendor:get_drivers", async () => {
//     const drivers = await redis.hgetall("driver:locations");

//     const driverList = Object.values(drivers).map(d =>
//       JSON.parse(d)
//     );

//     socket.emit("vendor:drivers", driverList);
//   });

// };
module.exports = (io, socket, redis) => {

    socket.on("vendor:select_driver", async ({ vendorId, DriverID }) => {

        // 1️⃣ Driver ki location nikalo
        const driverPos = await redis.geopos(
            "drivers:geo",
            DriverID
        );

        if (!driverPos || !driverPos[0]) {
            console.log("❌ Driver location not found");
            return;
        }

        const [lng, lat] = driverPos[0];

        // 2️⃣ 5 KM ke andar ke loads
        const nearbyLoads = await redis.georadius(
            "loads:geo",
            lng,
            lat,
            50,
            "km"
        );

        const loads = [];

        for (const loadId of nearbyLoads) {

            const status = await redis.hget(
                "loads:status",
                loadId
            );

            if (status !== "OPEN") continue;

            const loadData = await redis.hgetall(
                `loads:data:${loadId}`
            );

            loads.push(loadData);
        }

        // 3️⃣ Vendor ko bhejo
        io.to(`vendor:${vendorId}`).emit(
            "vendor:nearby_loads_for_driver",
            {
                DriverID,
                loads
            }
        );

        console.log(
            `📦 Vendor ${vendorId} ko ${loads.length} loads mile`
        );
    });

};
