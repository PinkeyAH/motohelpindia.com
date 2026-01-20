// clearLoads.js (CommonJS)
const Redis = require("ioredis"); // or "redis" if you use that

const redis = new Redis({ host: "127.0.0.1", port: 6379 });

async function clearLoads() {
  try {

    
                // geo
    const geo = await redis.keys("drivers:geo:*");
    if (geo.length > 0) {
      await redis.del(geo);
      console.log("Deleted geo keys:", geo);
    } else {
      console.log("No geo keys found.");
    }


                // loads
    const loadsKeys = await redis.keys("driver:loads:*");
    if (loadsKeys.length > 0) {
      await redis.del(loadsKeys);
      console.log("Deleted loads keys:", loadsKeys);
    } else {
      console.log("No loads keys found.");
    }


            // vendor
    const vendorKeys = await redis.keys("vendor:drivers:*");
    if (vendorKeys.length > 0) {
      await redis.del(vendorKeys);
      console.log("Deleted vendor keys:", vendorKeys);
    } else {
      console.log("No vendor keys found.");
    }

        // driver
    const driverKeys = await redis.keys("driver:details:*");
    if (driverKeys.length > 0) {
      await redis.del(driverKeys);
      console.log("Deleted driver keys:", driverKeys);
    } else {
      console.log("No driver keys found.");
    }

    // Get all load keys
    const keys = await redis.keys("loads:data:*");
    if (keys.length > 0) {
      await redis.del(keys);
      console.log("Deleted load keys:", keys);
    } else {
      console.log("No load keys found.");
    }

    // Delete geo key
    await redis.del("loads:geo");
    console.log("Deleted loads:geo key");
  } catch (err) {
    console.error(err);
  } finally {
    redis.quit();
  }
}

clearLoads();
