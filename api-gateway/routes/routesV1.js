const express = require('express');
const router = express.Router();
const { VendorOnboarding, getVendoremployee, getVendorDetails, getVendorKYC,deleteVendoremployee, deleteVendorDetails, deleteVendorKYC,updateVendoremployee, updateVendorDetails, updateVendorKYC ,VehicleVerification} = require("../controllers/V1/Vendor_Onboarding");
const { createRouteMaster, getRouteMaster, updateRouteMaster, deleteRouteMaster,createExpenseMaster, getExpenseMaster, updateExpenseMaster, deleteExpenseMaster,createExpenseType, getExpenseType, updateExpenseType, deleteExpenseType,getDestination, getPincode, get_state_region_district } = require("../controllers/V1/Master");
const { InsertVehicle , updateVehicle, deleteVehicle, getVehicle } = require("../controllers/V1/vehicles")
const { Insertemployee, updateEmployeeDetails, deleteEmployeeDetails, getEmployeeDetails } = require("../controllers/V1/Employee_onboard")
const { InsertDriver, updateDriverDetails, deleteDriverDetails, getDriverDetails } = require("../controllers/V1/Driver_Onboard");
const { createBillingTerms, updateBillingTerms, deleteBillingTerms, getBillingTerms } = require("../controllers/V1/Billing_Terms");
const { createDepartment, updateDepartment, deleteDepartment, getDepartment } = require("../controllers/V1/Departments");
const { createReceivables, updateReceivables, deleteReceivables, getReceivables } = require("../controllers/V1/Receivables");
const { InsertCustomerDetails, updateCustomerDetails, deleteCustomerDetails, getCustomerDetails } = require("../controllers/V1/Customer_Onboarding");
const { send_OTP, validate_OTP,customer_send_OTP,customer_validate_OTP , Driver_send_OTP, Driver_validate_OTP} = require("../controllers/validate");
const { customer_login_Mpin, customer_Set_Mpin, customer_Change_Mpin, customer_Forgot_Mpin, Mpin_SendOtp, Mpin_ValidateOtp, customer_logout_Mpin } = require("../controllers/V1/Customer_Mpin");
const { vendor_login_Mpin, vendor_Set_Mpin, vendor_Change_Mpin, vendor_Forgot_Mpin, vendor_logout_Mpin } = require("../controllers/V1/Vendor_Mpin");
const { login, logout } = require("../controllers/V1/login");
const { InsertVehiclePost, updateVehiclePost, deleteVehiclePost, getVehiclePost ,getVehicleliveBiding,updateVehicleliveBiding,getlivePostBiding} = require("../controllers/V1/Vehicle_Posts");
const { Insertcustomerpost, updateCustomerPost, deleteCustomerPost, getCustomerPost,getcustomerliveBiding,updatecustomerliveBiding, CustomerPostAddress } = require("../controllers/V1/Customer_Posts");
const { checkExpiryAlerts } = require("../schedulers/expiryChecker");
const { getDistanceBetweenTwoPincodes } = require('../controllers/V1/Map');
const { auth_vaildation } = require('../KYC_Verification/controllers/V1/auth_vaildation');
const { Pancard , GST, DrivingLicense, Aadhaargenerateotp,Aadhaarverifyotp, Vehicle} = require('../KYC_Verification/controllers/V1/KYC_Verification');
const { Insertcustomerloadpost, updatecustomerloadpost, getcustomerloadpost, deletecustomerloadpost, getVehicle_Details, getCargoTypes,
        getCustomerLoadPostViews,getNearestCustomerpost ,CustomerPostStatus, getcustomerprocess ,getcustomeractive} = require('../Customer/controllers/V1/Customer_Load_Post');
const { Insertdriverloadpost, updatedriverloadpost, getdriverloadpost, deletedriverloadpost,getdriverlocationbymobile ,InsertDriverVehicleAssign ,updateDriverVehicleAssign, getDriverVehicleAssign,  deleteDriverVehicleAssign, getNearestDrivers, getDriverAvailable,getVehicleAvailable} = require('../Driver/controllers/V1/Driver_Load_Post');
// ActiveTrip
const { InsertActiveTrip, updateActiveTrip, getActiveTrip, deleteActiveTrip } = require("../Driver/controllers/V1/Active_Trip.js");
const { insertOrUpdateDriverLiveLocation, getDriverLiveLocation } = require("../Driver/controllers/V1/DriverLiveLocation.js");

// Post
router.post('/sendOTP', send_OTP);
router.post('/validateOTP', validate_OTP);
router.post('/login', login);

// Vendor
router.post('/VendorOnboarding', VendorOnboarding);
router.post('/get_vendor_employee', getVendoremployee);
router.post('/get_Vendor_Details', getVendorDetails);
router.post('/get_vendor_kyc', getVendorKYC);
router.post('/delete_vendor_employee', deleteVendoremployee);
router.post('/delete_Vendor_Details', deleteVendorDetails);
router.post('/delete_vendor_kyc', deleteVendorKYC);
router.post('/update_vendor_employee', updateVendoremployee);
router.post('/update_Vendor_Details', updateVendorDetails);
router.post('/update_vendor_kyc', updateVendorKYC);
router.post("/Vehicle_Verification", VehicleVerification);


router.post('/vendor_Login_Mpin', /* otp_validateRequests,*/ vendor_login_Mpin);
router.post('/vendor_Set_Mpin', vendor_Set_Mpin);
router.post('/vendor_Change_Mpin',/* Mpin_validateRequests,*/ vendor_Change_Mpin);
// router.post('/vendor_Forgot_Mpin', vendor_Forgot_Mpin);
// router.post('/Mpin_SendOtp', Mpin_SendOtp);
// router.post('/Mpin_ValidateOtp', Mpin_ValidateOtp);
// router.post('/vendor_logout_Mpin', /*Mpin_validateRequests,*/ vendor_logout_Mpin);

// Vehicle
router.post('/Insert_Vehicle', InsertVehicle);
router.post('/update_vehicles', updateVehicle);
router.post('/delete_vehicles', deleteVehicle);
router.post('/get_vehicles', getVehicle);

// Insertemployee
router.post('/Insert_employee', Insertemployee);
router.post('/update_EmployeeDetails', updateEmployeeDetails);
router.post('/delete_EmployeeDetails', deleteEmployeeDetails);
router.post('/get_EmployeeDetails', getEmployeeDetails);

// InsertDriver
router.post('/Insert_Driver', InsertDriver);
router.post('/update_DriverDetails', updateDriverDetails);
router.post('/delete_DriverDetails', deleteDriverDetails);
router.post('/get_DriverDetails', getDriverDetails);

router.post('/Driver_SendOtp', Driver_send_OTP);
router.post('/Driver_ValidateOtp', Driver_validate_OTP); 

// Route Master APIs
router.post("/insert_RouteMaster", createRouteMaster);
router.post("/get_RouteMaster", getRouteMaster);
router.post("/update_RouteMaster", updateRouteMaster);
router.post("/delete_RouteMaster", deleteRouteMaster);
router.post("/get_Destination", getDestination);
router.post("/pincode", getPincode);
router.post("/pincode/distance", getDistanceBetweenTwoPincodes);
router.post("/get_state_region_district", get_state_region_district);

// Expense Master APIs
router.post("/insert_ExpenseMaster", createExpenseMaster);
router.post("/get_ExpenseMaster", getExpenseMaster);
router.post("/update_ExpenseMaster", updateExpenseMaster);
router.post("/delete_ExpenseMaster", deleteExpenseMaster);

// Expense Type APIs
router.post("/insert_ExpenseType", createExpenseType);
router.post("/get_ExpenseType", getExpenseType);
router.post("/update_ExpenseType", updateExpenseType);
router.post("/delete_ExpenseType", deleteExpenseType);

// billingterms
router.post('/insert_BillingTerms', createBillingTerms);
router.post('/update_BillingTerms', updateBillingTerms);
router.post('/delete_BillingTerms', deleteBillingTerms);
router.post('/get_BillingTerms', getBillingTerms);

// department
router.post('/insert_department', createDepartment);    
router.post('/update_department', updateDepartment);
router.post('/delete_department', deleteDepartment);
router.post('/get_department', getDepartment);

// Receivables APIs
router.post("/insert_Receivables", createReceivables);
router.post("/update_Receivables", updateReceivables);
router.post("/delete_Receivables", deleteReceivables);
router.post("/get_Receivables", getReceivables);

// Logout
router.post('/logout', logout);

// costomer onboarding APIs
router.post('/Insert_Customer', InsertCustomerDetails);
router.post('/update_Customer', updateCustomerDetails);
router.post('/delete_Customer', deleteCustomerDetails);
router.post('/get_Customer', getCustomerDetails);

router.post('/Customer_SendOtp', customer_send_OTP);
router.post('/Customer_ValidateOtp', customer_validate_OTP); 

router.post('/Customer_Login_Mpin', /* otp_validateRequests,*/ customer_login_Mpin);
router.post('/Customer_Set_Mpin', customer_Set_Mpin);
router.post('/Customer_Change_Mpin',/* Mpin_validateRequests,*/ customer_Change_Mpin);
router.post('/Customer_Forgot_Mpin', customer_Forgot_Mpin);
// router.post('/Mpin_SendOtp', Mpin_SendOtp);
// router.post('/Mpin_ValidateOtp', Mpin_ValidateOtp);
router.post('/Customer_logout_Mpin', /*Mpin_validateRequests,*/ customer_logout_Mpin);


// Expiry Alerts
router.post('/expiry-alerts',checkExpiryAlerts );

// vehicle post
router.post('/Insert_vehicle_Post', InsertVehiclePost);
router.post('/update_vehicle_Post', updateVehiclePost);
// router.post('/delete_vehicle_Post', deleteVehiclePost);
router.post('/get_vehicle_Post', getVehiclePost);

// customer post
router.post('/Insert_customer_post', Insertcustomerpost);
router.post('/update_customer_post', updateCustomerPost);
// router.post('/delete_customer_post', deleteCustomerPost);
router.post('/get_customer_post', getCustomerPost);
router.post('/customer_post_address', CustomerPostAddress);

router.post('/update_Vehicle_live_Biding', updateVehicleliveBiding);
router.post('/get_Vehicle_live_Biding', getVehicleliveBiding);

router.post('/update_customer_live_Biding', updatecustomerliveBiding);
router.post('/get_customer_live_Biding', getcustomerliveBiding);

router.post('/get_live_Post_Biding', getlivePostBiding);


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

router.post('/customer_process_Trip', getcustomerprocess);
router.post('/customer_active_Trip', getcustomeractive);
// router.post('/customer_active', getcustomeractive);
router.post('/get_Nearest_Drivers', getNearestDrivers);



// Driver load posting
// insertOrUpdateDriverLiveLocation
router.post('/insertOrUpdate_DriverLiveLocation', insertOrUpdateDriverLiveLocation);
router.post('/get_DriverLiveLocation', getDriverLiveLocation);

router.post('/Insert_driver_load_post', Insertdriverloadpost);
router.post('/update_driver_load_post', updatedriverloadpost);
router.post('/get_driver_load_post', getdriverloadpost);
router.post('/delete_driver_load_post', deletedriverloadpost);
router.post('/driver_location_by_mobile', getdriverlocationbymobile);
router.post('/get_Nearest_Customer_post', getNearestCustomerpost);


// DriverVehicleAssign
router.post('/Insert_Driver_Vehicle_Assign', InsertDriverVehicleAssign);
router.post('/update_Driver_Vehicle_Assign', updateDriverVehicleAssign);
router.post('/get_Driver_Vehicle_Assign', getDriverVehicleAssign);
router.post('/delete_Driver_Vehicle_Assign', deleteDriverVehicleAssign);
router.post("/get_DriverAvailable", getDriverAvailable);
router.post("/get_VehicleAvailable", getVehicleAvailable);


// ActiveTrip
router.post('/Insert_Active_Trip', InsertActiveTrip);
router.post('/update_Active_Trip', updateActiveTrip);
router.post('/get_Active_Trip', getActiveTrip);
router.post('/delete_Active_Trip', deleteActiveTrip);


module.exports = router
