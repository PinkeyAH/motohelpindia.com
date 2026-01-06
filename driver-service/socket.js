const {
  insertOrUpdate_DriverLiveLocationDB,
  get_DriverLiveLocationDB
} = require("./models/V1/DriverLiveLocation/utility");

const {
  getNearestDriversDB,
} = require("./models/V1/Driver_Load_Post/utility");

const {
  getNearestCustomerposttDB,
  getcustomeractiveDB,
  getcustomerloadpostDB,
  getcustomerprocessDB,
} = require("../customer-service/models/V1/Customer_Load_Post/utility");

const {
  updateDriverLocation,
  getAlldriverLPStatus,
  getAllDriverLocations
} = require("../api-gateway/shared/driverLiveStore");

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


function initializeDriverSocket(io, app) {
  console.log("🚛 Driver Socket initialized");

  const connectedDrivers = new Map();
  const connectedCustomers = new Map();
  const connectedVendors = new Map();

  io.on("connection", (socket) => {

    /* ================= DRIVER REGISTER ================= */
    socket.on("registerDriver", (driverId) => {
      connectedDrivers.set(driverId, { socket });
      console.log(`✅ Driver registered: ${driverId}`);
    });

    /* ================= CUSTOMER REGISTER ================= */
    socket.on("registerCustomer", (CustomerID) => {
      connectedCustomers.set(CustomerID, socket);
      console.log("👤 Customer connected:", CustomerID);
    });

    /* ================= VENDOR REGISTER ================= */
    socket.on("registerVendor", (VendorID) => {
      connectedVendors.set(VendorID, socket);
      console.log("🏢 Vendor connected:", VendorID);
    });

    /* ================= DRIVER LIVE LOCATION ================= */
    socket.on("driverLiveLocation", async (data) => {
      try {
        const { DriverID, Latitude, Longitude } = data;
        if (!DriverID) return;
        console.log(data ,"*****************************driver side");

        // Update cache
        updateDriverLocation(DriverID, {
          ...data,
          UpdatedAt: new Date()
        });

        // Save DB
        await insertOrUpdate_DriverLiveLocationDB(data);

        // Prepare payload
        const payload = {
          DriverID,
          Latitude,
          Longitude,
          source: "LIVE",
          UpdatedAt: new Date()
        };

        // 🔔 Vendors
        connectedVendors.forEach((vendorSocket) => {
          vendorSocket.emit("driverLiveLocation", data);
          console.log(data ,"*****************************vendor side");
          
        });

        // 🔔 Customers
        connectedCustomers.forEach((customerSocket) => {
          customerSocket.emit("driverLiveLocation", data);
          console.log(data ,"*****************************customer side");
        });

      } catch (err) {
        console.error("⚠️ driverLiveLocation error:", err.message);

      }
    });

    /* ================= CACHE BROADCAST ================= */
    setInterval(() => {
      try {
        const allDrivers = getAllDriverLocations();
        if (!allDrivers || allDrivers.size === 0) return;
console.log(allDrivers ,"*****************************allDrivers side");

        allDrivers.forEach((loc, driverId) => {
          const payload = {
            DriverID: loc.DriverID,
            VendorID: loc.VendorID,
            VehicleID: loc.VehicleID,
            MobileNo: loc.MobileNo,
            Lat: loc.Lat,
            Lng: loc.Lng,
            Speed: loc.Speed,
            Direction: loc.Direction,
            City: loc.City,
            District: loc.District,
            Taluka: loc.Taluka,
            State: loc.State,
            Pincode: loc.Pincode,
            Address: loc.Address,
            Driver_LPStatus: loc.Driver_LPStatus,
            Status: loc.Status,

            source: "CACHE",
            UpdatedAt: new Date()
          };

          connectedVendors.forEach((vendorSocket) => {
            vendorSocket.emit("driverLiveLocation", payload);
            console.log('**************driverLiveLocation******vendorSocket*************', payload );
            
          });

          connectedCustomers.forEach((customerSocket) => {
            customerSocket.emit("driverLiveLocation", payload);
            console.log('**************driverLiveLocation******customerSocket*************', payload );
          });
        });

      } catch (err) {
        console.error("🔥 Live location broadcast error:", err.message);
      }
    }, 5000);


    // customr post

socket.on("createCustomerLoadPost", (payload) => {
  try {
    console.log("📦 Load post received:", payload);

    const {
      PickupLat,
      PickupLng
    } = payload;

    const allDrivers = getAllDriverLocations();

    console.log("🚗 Total drivers:", allDrivers.size);

    allDrivers.forEach((driverLoc, driverId) => {
      if (!driverLoc?.Latitude || !driverLoc?.Longitude) return;

      const distance = getDistance(
        PickupLat,
        PickupLng,
        driverLoc.Latitude,
        driverLoc.Longitude
      );

      console.log(`📏 Driver ${driverId} distance:`, distance);

      // ✅ 5 KM filter
      if (distance <= 5) {
        const driverEntry = connectedDrivers.get(driverId);
        if (!driverEntry) return;

        driverEntry.socket.emit("NearbyCustomerLoadPost", {
          ...payload,
          distance: distance.toFixed(2)
        });

        console.log(`✅ Load sent to Driver ${driverId} at distance ${distance.toFixed(2)} KM`);
      }
    });

  } catch (err) {
    console.error("❌ createCustomerLoadPost error:", err.message);
  }
});


    /* ================= DISCONNECT ================= */
    socket.on("disconnect", () => {
      connectedDrivers.forEach((entry, driverId) => {
        if (entry.socket.id === socket.id) {
          connectedDrivers.delete(driverId);
          console.log(`❌ Driver disconnected: ${driverId}`);
        }
      });
    });

  });
}

module.exports = initializeDriverSocket;


