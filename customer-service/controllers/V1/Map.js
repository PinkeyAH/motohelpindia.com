
const logger = require('../../log/logger');const { loadPincodeDataDB } = require('../../models/V1/Map/utility');

exports.getDistanceBetweenTwoPincodes = async (req, res) => {
  const { origin, destination } = req.body;

  logger.log("info", `Distance check request: Origin=${origin}, Destination=${destination}`);

  try {
    if (!origin || !destination) {
      return res.status(400).json({
        status: "01",
        message: "Origin and Destination pincode are required"
      });
    }

    // Load pincode data from DB
    const pincodeMap = await loadPincodeDataDB(origin, destination);
    const originLoc = pincodeMap[origin];
    const destinationLoc = pincodeMap[destination];

    if (!originLoc || !destinationLoc) {
      return res.status(404).json({
        status: "01",
        message: "One or both pincodes not found"
      });
    }

    // Haversine formula
    function getDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }

    const distance = getDistance(
      originLoc.lat, originLoc.lon,
      destinationLoc.lat, destinationLoc.lon
    );

    return res.status(200).json({
      status: "00",
      message: "Distance calculated successfully",
      data: {
        origin,
        destination,
        distanceInKm: +distance.toFixed(2)
      }
    });
  } catch (error) {
    logger.log("error", `Distance calculation failed: ${error}`);
    return res.status(500).json({
      status: "01",
      message: "Something went wrong",
      error: error.message
    });
  }
};


exports.getCheckDistance = async (req, res) => {
  const { origin, destination } = req.body;

  logger.log("info", `Distance check request: Origin=${JSON.stringify(origin)}, Destination=${JSON.stringify(destination)}`);

  try {
    // Validate input
    if (
      !origin?.lat || !origin?.lon ||
      !destination?.lat || !destination?.lon
    ) {
      return res.status(400).json({
        status: "01",
        message: "Origin and Destination latitude/longitude are required"
      });
    }

    // Haversine formula to calculate distance in km
    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the Earth in kilometers
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Calculate the distance
    const distance = getDistance(
      parseFloat(origin.lat),
      parseFloat(origin.lon),
      parseFloat(destination.lat),
      parseFloat(destination.lon)
    );

    logger.log(
      "info",
      `Distance calculated: ${distance.toFixed(2)} km between Origin(${origin.lat},${origin.lon}) and Destination(${destination.lat},${destination.lon})`
    );

    // Send response
    return res.status(200).json({
      status: "00",
      message: "Distance calculated successfully",
      data: {
        origin,
        destination,
        distanceInKm: +distance.toFixed(2)
      }
    });
  } catch (error) {
    logger.log("error", `Distance calculation failed: ${error.stack || error}`);
    return res.status(500).json({
      status: "01",
      message: "Something went wrong while calculating distance",
      error: error.message
    });
  }
};
