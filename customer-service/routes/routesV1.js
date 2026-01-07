const express = require('express');
const router = express.Router();

const {customerLogs, getCustomerLogs/*, exportCustomerLogsExcel, exportCustomerLogsPDF*/} = require('../log/apiLogger.js');


const { getDestination, getPincode, get_state_region_district ,get_state_district_block} = require("../controllers/V1/Master.js");
const { InsertCustomerDetails, updateCustomerDetails, deleteCustomerDetails, getCustomerDetails } = require("../controllers/V1/Customer_Onboarding.js");
const { customer_send_OTP,customer_validate_OTP } = require("../controllers/validate.js");
const { customer_login_Mpin, customer_Set_Mpin, customer_Change_Mpin, customer_Forgot_Mpin, customer_logout_Mpin } = require("../controllers/V1/Customer_Mpin.js");
const { login, logout } = require("../controllers/V1/login.js");
const { Insertcustomerpost, updateCustomerPost, deleteCustomerPost, getCustomerPost, CustomerPostAddress } = require("../controllers/V1/Customer_Posts.js");
// const { checkExpiryAlerts } = require("../schedulers/expiryChecker");
const { getDistanceBetweenTwoPincodes, getCheckDistance } = require('../controllers/V1/Map.js');
const { auth_vaildation } = require('../../KYC_Verification/controllers/V1/auth_vaildation.js');
const { Pancard , GST, DrivingLicense, Aadhaargenerateotp,Aadhaarverifyotp, Vehicle} = require('../../KYC_Verification/controllers/V1/KYC_Verification.js');
const { Insertcustomerloadpost, updatecustomerloadpost, getcustomerloadpost, deletecustomerloadpost, getVehicle_Details, getCargoTypes,getCustomerLoadPostViews,
        getNearestCustomerpost ,CustomerPostStatus, getcustomerprocess ,getcustomeractive, getcustomercompleted, getNearestDrivers, CargoTypeBodyTypeHistory} = require('../controllers/V1/Customer_Load_Post.js');
const { getActiveLoadPostWebAPI } = require('../controllers/V1/Customer_Load_Post_web.js');
const { getCustomerCounts } = require('../controllers/V1/GetCustomerCounts.js');
const { Insertcustomeremployee, updatecustomeremployee, deletecustomeremployee, getcustomeremployee } = require('../controllers/V1/Customer_Employees.js');
const { customerloadpostmaster, updatecustomerloadpostmaster, getcustomermaster, updatecustomerloadpostinvoice, getcustomerloadpostmaster} = require('../controllers/V1/Customer_LoadPost_Master.js');        



// vishal changes api 
const { getCustomerLPLoading, GetCustomerLPProgress, GetCustomerLPReached, GetCustomerLPLoaded, GetCustomerLPHold, GetCustomerLPpending, GetCustomerLPCompleted } = require('../controllers/V1/Customer_LP.js');



// ---------------------------
// Customer Logs Routes
// ---------------------------
router.get("/logs", customerLogs);
router.get("/customer-logs", getCustomerLogs);
// router.get("/excel", exportCustomerLogsExcel);
// router.get("/pdf", exportCustomerLogsPDF);

// ---------------------------
// Customer Auth APIs
// ---------------------------
router.post('/Customer_Login', login);
// router.post('/Customer_ValidateOtp_Login', customer_validateOtp_login);
router.post('/Customer_SendOtp', customer_send_OTP);
router.post('/Customer_ValidateOtp', customer_validate_OTP); 

router.post('/Customer_Login_Mpin', /* otp_validateRequests,*/ customer_login_Mpin);
router.post('/Customer_Set_Mpin', customer_Set_Mpin);
router.post('/Customer_Change_Mpin',/* Mpin_validateRequests,*/ customer_Change_Mpin);
router.post('/Customer_Forgot_Mpin', customer_Forgot_Mpin);
// router.post('/Mpin_SendOtp', Mpin_SendOtp);
// router.post('/Mpin_ValidateOtp', Mpin_ValidateOtp);
router.post('/Customer_logout_Mpin', /*Mpin_validateRequests,*/ customer_logout_Mpin);
 
router.post("/get_Destination", getDestination);
router.post("/pincode", getPincode);
router.post("/pincode/distance", getDistanceBetweenTwoPincodes);
router.post("/Check_Distance", getCheckDistance);
router.post("/get_state_district_block", get_state_district_block);
router.post("/get_state_region_district", get_state_region_district);

// Logout
router.post('/logout', logout);

// costomer onboarding APIs
router.post('/Insert_Customer', InsertCustomerDetails);
router.post('/update_Customer', updateCustomerDetails);
router.post('/delete_Customer', deleteCustomerDetails);
router.post('/get_Customer', getCustomerDetails);


// Expiry Alerts
// router.post('/expiry-alerts',checkExpiryAlerts );


// customer post
router.post('/Insert_customer_post', Insertcustomerpost);
router.post('/update_customer_post', updateCustomerPost);
// router.post('/delete_customer_post', deleteCustomerPost);
router.post('/get_customer_post', getCustomerPost);
router.post('/customer_post_address', CustomerPostAddress);


// KYC verification
router.post('/pancard', auth_vaildation, Pancard);
router.post('/GST', auth_vaildation, GST);
router.post('/DrivingLicense', auth_vaildation, DrivingLicense);
router.post('/Aadhaar_generate_otp', auth_vaildation, Aadhaargenerateotp);
router.post('/Aadhaar_verify_otp', auth_vaildation, Aadhaarverifyotp);
router.post('/Vehicle', auth_vaildation, Vehicle);

// customer load posting
router.post('/Insert_customer_load_post', Insertcustomerloadpost);
router.post('/update_customer_load_post', updatecustomerloadpost);
router.post('/get_customer_load_post', getcustomerloadpost);
router.post('/delete_customer_load_post', deletecustomerloadpost);
router.post('/get_Vehicle_Details', getVehicle_Details);
router.post('/get_CargoTypes', getCargoTypes);
router.post('/get_customer_load_post_views', getCustomerLoadPostViews);
router.post('/Customer_PostStatus', CustomerPostStatus);
router.post('/CargoType_BodyType_History', CargoTypeBodyTypeHistory);


router.post('/customer_process_Trip', getcustomerprocess);
router.post('/customer_active_Trip', getcustomeractive);
router.post('/customer_completed_Trip', getcustomercompleted);
router.post('/get_Nearest_Drivers', getNearestDrivers);


// Insertemployee
router.post('/Insert_customer_employee', Insertcustomeremployee);
router.post('/update_customer_employee', updatecustomeremployee);
router.post('/delete_customer_employee', deletecustomeremployee);
router.post('/get_customer_employee', getcustomeremployee); 

// Driver load posting
// insertOrUpdateDriverLiveLocation

// router.post('/insertOrUpdate_DriverLiveLocation', insertOrUpdateDriverLiveLocation);
// router.post('/get_DriverLiveLocation', getDriverLiveLocation);

router.post('/get_Nearest_Customer_post', getNearestCustomerpost);


// Web API 
router.post('/get_Active_LoadPost', getActiveLoadPostWebAPI);

router.post('/get_customer_counts', getCustomerCounts);


router.post('/customer_loadpost_master', customerloadpostmaster);
router.post('/update_customer_loadpost_master', updatecustomerloadpostmaster);
router.post('/update_customer_loadpost_invoice', updatecustomerloadpostinvoice);

router.post('/get_customer_master', getcustomermaster);
router.post('/get_customer_loadpost_master', getcustomerloadpostmaster);



// vishal changes api 

router.post('/customer_LP_Loading', getCustomerLPLoading);
router.post('/customer_LP_Progress', GetCustomerLPProgress);
router.post('/customer_LP_Reached', GetCustomerLPReached)
router.post('/customer_LP_Loaded', GetCustomerLPLoaded)
router.post('/customer_LP_Hold', GetCustomerLPHold)
router.post('/customer_LP_Completed', GetCustomerLPCompleted)
router.post('/customer_LP_pending', GetCustomerLPpending)


module.exports = router
