const express = require('express');
const router = express.Router();

const { Driver_send_OTP, Driver_validate_OTP } = require('../controllers/validate.js');
const { getDistanceBetweenTwoPincodes ,getCheckDistance} = require('../controllers/V1/Map');
const { getDestination, getPincode, get_state_region_district ,get_state_district_block} = require('../controllers/V1/Master.js');

const { auth_vaildation } = require('../../KYC_Verification/controllers/V1/auth_vaildation');
const { Pancard , GST, DrivingLicense, Aadhaargenerateotp,Aadhaarverifyotp, Vehicle} = require('../../KYC_Verification/controllers/V1/KYC_Verification');

const { insertOrUpdateDriverLiveLocation, getDriverLiveLocation, Driveronlineofflinestatus } = require("../controllers/V1/DriverLiveLocation.js");
const { Insertdriverloadpost, updatedriverloadpost, getdriverloadpost, deletedriverloadpost, getdriverlocationbymobile , getNearestDrivers} = require('../controllers/V1/Driver_Load_Post');

const { getNearestCustomerpost ,CustomerPostStatus, getcustomerprocess ,getcustomeractive} = require('../.././customer-service/controllers/V1/Customer_Load_Post.js');
// ActiveTrip
// const { InsertActiveTrip, updateActiveTrip, getActiveTrip, deleteActiveTrip } = require("../Driver/controllers/V1/Active_Trip.js");
// const { checkExpiryAlerts } = require("../schedulers/expiryChecker");
 
const { getdriverscounts } = require("../controllers/V1/GetDriversCounts.js");
const { loadingImage } = require('../controllers/V1/Loading_Image.js');
// Driver Auth
router.post('/Driver_SendOtp', Driver_send_OTP);
router.post('/Driver_ValidateOtp', Driver_validate_OTP); 
router.post("/pincode/distance", getDistanceBetweenTwoPincodes);
router.post("/Check_Distance", getCheckDistance);
router.post("/get_state_district_block", get_state_district_block);

router.post("/get_Destination", getDestination);
router.post("/pincode", getPincode);
router.post("/get_state_region_district", get_state_region_district);


// KYC verification
router.post('/pancard', auth_vaildation, Pancard);
router.post('/GST', auth_vaildation, GST);
router.post('/DrivingLicense', auth_vaildation, DrivingLicense);
router.post('/Aadhaar_generate_otp', auth_vaildation, Aadhaargenerateotp);
router.post('/Aadhaar_verify_otp', auth_vaildation, Aadhaarverifyotp);
router.post('/Vehicle', auth_vaildation, Vehicle);

// Driver load posting
// insertOrUpdateDriverLiveLocation
router.post('/insertOrUpdate_DriverLiveLocation', insertOrUpdateDriverLiveLocation);
router.post('/get_DriverLiveLocation', getDriverLiveLocation);

router.post('/Driver_online_offline_status', Driveronlineofflinestatus);
router.post('/Insert_driver_load_post', Insertdriverloadpost);
router.post('/update_driver_load_post', updatedriverloadpost);
router.post('/get_driver_load_post', getdriverloadpost);
router.post('/delete_driver_load_post', deletedriverloadpost);

router.post('/driver_location_by_mobile', getdriverlocationbymobile);
router.post('/get_Nearest_Customer_post', getNearestCustomerpost);


// Expiry Alerts
// router.post('/expiry-alerts',checkExpiryAlerts );

router.post('/Customer_PostStatus', CustomerPostStatus);

router.post('/loading_Image', loadingImage);  

router.post('/customer_process_Trip', getcustomerprocess);
router.post('/customer_active_Trip', getcustomeractive);
// router.post('/customer_active', getcustomeractive);
router.post('/get_Nearest_Drivers', getNearestDrivers);

router.post('/get_drivers_counts', getdriverscounts); // expiry checker

// // ActiveTrip
// router.post('/Insert_Active_Trip', InsertActiveTrip);
// router.post('/update_Active_Trip', updateActiveTrip);
// router.post('/get_Active_Trip', getActiveTrip);
// router.post('/delete_Active_Trip', deleteActiveTrip);


module.exports = router
