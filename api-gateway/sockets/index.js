
/* 🔹 HELPER FUNCTION */
async function getAllLiveDrivers(redis) {
    const keys = await redis.keys("driver:details:*");

    const drivers = [];
    for (const key of keys) {
        const data = await redis.hgetall(key);
        if (data && data.DriverID) {
            drivers.push(data);
        }
    }
    return drivers;
}
module.exports = (io, redis) => {
    io.on("connection", async (socket) => {
        console.log("Socket connected:", socket.id);

        // 🔥 STEP 2: New join → send Redis data
        const drivers = await getAllLiveDrivers(redis);
        socket.emit("driver:live_location", drivers);

        require("./driver.socket")(io, socket);
        require("./customer.socket")(io, socket);
        require("./vendor.socket")(io, socket);

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });
    });
};
