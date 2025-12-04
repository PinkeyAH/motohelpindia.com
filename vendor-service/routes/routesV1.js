const express = require('express');
const router = express.Router();

const { send_OTP, validate_OTP} = require("../controllers/validate");
const { login, logout } = require("../controllers/V1/login");
const { vendor_login_Mpin, vendor_Set_Mpin, vendor_Change_Mpin, vendor_Forgot_Mpin, vendor_logout_Mpin } 
      = require("../controllers/V1/Vendor_Mpin");
const {VendorOnboarding, vendorBankkYC, getVendoremployee, getVendorDetails, getVendorKYC, getVehicle, 
       VendorOnboardingUpdate, updateVendoremployee, updateVendorDetails, updateVendorKYC, updateVehicle,
       deleteVendoremployee, deleteVendorDetails, deleteVendorKYC, deleteVehicle, deleteDriver, VehicleVerification} 
       = require("../controllers/V1/Vendor_Onboarding");
const { auth_vaildation } = require('../../KYC_Verification/controllers/V1/auth_vaildation');
const { Pancard , GST, DrivingLicense, Aadhaargenerateotp,Aadhaarverifyotp, Vehicle, Aadhar_send_otp, Aadhar_verify_otp, Bank_Cheque_OCR} 
      = require('../../KYC_Verification/controllers/V1/KYC_Verification');
const { InsertVehicles , updateVehicles, deleteVehicles, getVehicles } = require("../controllers/V1/vehicles")
const { InsertDriver, updateDriverDetails, deleteDriverDetails, getDriverDetails } = require("../controllers/V1/Driver_Onboard");
const { insertOrUpdateDriverLiveLocation, getDriverAvailableStatus } = require("../../driver-service/controllers/V1/DriverLiveLocation");
const { getDistanceBetweenTwoPincodes , getCheckDistance} = require('../controllers/V1/Map');
const { Insertdriverloadpost, updatedriverloadpost, getdriverloadpost, deletedriverloadpost, getdriverlocationbymobile,
        InsertDriverVehicleAssign ,updateDriverVehicleAssign,getDriverVehicleAssign,  
        deleteDriverVehicleAssign, getNearestDrivers, getDriverAvailable,getVehicleAvailable} 
      = require('../../driver-service/controllers/V1/Driver_Load_Post');
const { getNearestCustomerpost ,CustomerPostStatus, getcustomerprocess ,getcustomeractive, VendorNearestCustomerPost} 
      = require('../.././customer-service/controllers/V1/Customer_Load_Post.js');
const { createRouteMaster, getRouteMaster, updateRouteMaster, deleteRouteMaster,createExpenseMaster, 
        getExpenseMaster, updateExpenseMaster, deleteExpenseMaster,createExpenseType, getExpenseType, updateExpenseType, 
        deleteExpenseType,getDestination, getPincode, get_state_region_district , get_state_district_block,Vendor_Designations } 
       = require("../controllers/V1/Master");
const { Insertemployee, updateEmployeeDetails, deleteEmployeeDetails, getEmployeeDetails } = require("../controllers/V1/Employee_onboard")
const { getvendorCounts ,getvehicleavailable, getvehicleprocess, getvehicleactive, getvehicleclosed} = require("../controllers/V1/GetVendorCounts.js");
const { Vendor_KYC_Check } =require('../../KYC_Verification/controllers/V1/Check_KYC.js');

// const { checkExpiryAlerts } = require("../schedulers/expiryChecker");

// ActiveTrip
// const { InsertActiveTrip, updateActiveTrip, getActiveTrip, deleteActiveTrip } = require("../Driver/controllers/V1/Active_Trip.js");

// const { InsertVehiclePost, updateVehiclePost, deleteVehiclePost, getVehiclePost ,getVehicleliveBiding,updateVehicleliveBiding,getlivePostBiding} = require("../controllers/V1/Vehicle_Posts");

// Post
router.post('/sendOTP', send_OTP);
router.post('/validateOTP', validate_OTP);
router.post('/login', login);

router.post('/vendor_Login_Mpin', /* otp_validateRequests,*/ vendor_login_Mpin);
router.post('/vendor_Set_Mpin', vendor_Set_Mpin);
router.post('/vendor_Change_Mpin',/* Mpin_validateRequests,*/ vendor_Change_Mpin);
// router.post('/vendor_Forgot_Mpin', vendor_Forgot_Mpin);
// router.post('/Mpin_SendOtp', Mpin_SendOtp);
// router.post('/Mpin_ValidateOtp', Mpin_ValidateOtp);
// router.post('/vendor_logout_Mpin', /*Mpin_validateRequests,*/ vendor_logout_Mpin);
// Logout
router.post('/logout', logout);

// KYC verification
router.post('/pancard', auth_vaildation, Pancard);
router.post('/GST', auth_vaildation, GST);
router.post('/DrivingLicense', auth_vaildation, DrivingLicense);
router.post('/Aadhaar_generate_otp', auth_vaildation, Aadhaargenerateotp);
router.post('/Aadhaar_verify_otp', auth_vaildation, Aadhaarverifyotp);
router.post('/Vehicle', auth_vaildation, Vehicle);
router.post('/Aadhar_send_otp', auth_vaildation, Aadhar_send_otp);
router.post('/Aadhar_verify_otp', auth_vaildation, Aadhar_verify_otp);
router.post('/Bank_Cheque_OCR', auth_vaildation, Bank_Cheque_OCR);
router.post('/Vendor_KYC_Check', Vendor_KYC_Check);


// Vendor
router.post('/VendorOnboarding', VendorOnboarding);
router.post('/VendorOnboarding_Update', VendorOnboardingUpdate);
// router.post('/get_Vendor_Details', getVendorDetails);
router.post('/vendor_Bank_kyc', vendorBankkYC);

router.post('/get_vendor_employee', getVendoremployee);
router.post('/get_Vendor_Details', getVendorDetails);
router.post('/get_vendor_kyc', getVendorKYC);
router.post('/get_vehicle', getVehicle);

router.post('/update_vendor_employee', updateVendoremployee);
router.post('/update_Vendor_Details', updateVendorDetails);
router.post('/update_vendor_kyc', updateVendorKYC);
router.post('/update_vehicle', updateVehicle);

router.post('/delete_vendor_employee', deleteVendoremployee);
router.post('/delete_Vendor_Details', deleteVendorDetails);
router.post('/delete_vendor_kyc', deleteVendorKYC);
router.post('/delete_vehicle', deleteVehicle);
router.post('/delete_Driver', deleteDriver); //*************************  */

router.post("/Vehicle_Verification", VehicleVerification);

// getdestination
router.post("/get_Destination", getDestination);
router.post("/pincode", getPincode);
router.post("/pincode/distance", getDistanceBetweenTwoPincodes);
router.post("/Check_Distance", getCheckDistance);
router.post("/get_state_region_district", get_state_region_district);
router.post("/get_state_district_block", get_state_district_block);

// InsertDriver
router.post('/Insert_Driver', InsertDriver);
router.post('/update_DriverDetails', updateDriverDetails);
router.post('/delete_DriverDetails', deleteDriverDetails);
router.post('/get_DriverDetails', getDriverDetails);

// Vehicle
router.post('/Insert_Vehicle', InsertVehicles);
router.post('/update_vehicles', updateVehicles);
router.post('/delete_vehicles', deleteVehicles);
router.post('/get_vehicles', getVehicles);

// Insertemployee
router.post('/Insert_employee', Insertemployee);
router.post('/update_EmployeeDetails', updateEmployeeDetails);
router.post('/delete_EmployeeDetails', deleteEmployeeDetails);
router.post('/get_EmployeeDetails', getEmployeeDetails); 

// Route Master APIs
router.post("/insert_RouteMaster", createRouteMaster);
router.post("/get_RouteMaster", getRouteMaster);
router.post("/update_RouteMaster", updateRouteMaster);
router.post("/delete_RouteMaster", deleteRouteMaster);

// Expense Master APIs
router.post("/insert_ExpenseMaster", createExpenseMaster);
router.post("/get_ExpenseMaster", getExpenseMaster);
router.post("/update_ExpenseMaster", updateExpenseMaster);
router.post("/delete_ExpenseMaster", deleteExpenseMaster);

// Vendor_Designations
router.post("/Designations", Vendor_Designations)

// Expense Type APIs
router.post("/insert_ExpenseType", createExpenseType);
router.post("/get_ExpenseType", getExpenseType);
router.post("/update_ExpenseType", updateExpenseType);
router.post("/delete_ExpenseType", deleteExpenseType);

// DriverVehicleAssign
router.post('/Insert_Driver_Vehicle_Assign', InsertDriverVehicleAssign);
router.post('/update_Driver_Vehicle_Assign', updateDriverVehicleAssign);
router.post('/get_Driver_Vehicle_Assign', getDriverVehicleAssign);

router.post('/delete_Driver_Vehicle_Assign', deleteDriverVehicleAssign);
router.post("/get_DriverAvailable", getDriverAvailable);
router.post("/get_VehicleAvailable", getVehicleAvailable);

// Driver load posting
// insertOrUpdateDriverLiveLocation
router.post('/insertOrUpdate_DriverLiveLocation', insertOrUpdateDriverLiveLocation);
// router.post('/get_DriverLiveLocation', getDriverLiveLocation);
router.post('/get_Driver_Available_status', getDriverAvailableStatus);

router.post('/Insert_driver_load_post', Insertdriverloadpost);
router.post('/update_driver_load_post', updatedriverloadpost);
router.post('/get_driver_load_post', getdriverloadpost);
router.post('/delete_driver_load_post', deletedriverloadpost);
router.post('/driver_location_by_mobile', getdriverlocationbymobile);
router.post('/get_Nearest_Customer_post', getNearestCustomerpost);
router.post('/get_Nearest_Drivers', getNearestDrivers);

router.post('/vendor_nearest_customer_post', VendorNearestCustomerPost);


router.post('/PostStatus', CustomerPostStatus);

router.post('/process_Trip', getcustomerprocess);
router.post('/active_Trip', getcustomeractive);
// router.post('/customer_active', getcustomeractive);
// router.post('/get_Nearest_Drivers', getNearestDrivers);

// GetMultiCounts
router.post('/get_vendor_counts', getvendorCounts);

router.post('/get_vehicle_available', getvehicleavailable);
router.post('/get_vehicle_process', getvehicleprocess);
router.post('/get_vehicle_active', getvehicleactive);
router.post('/get_vehicle_closed', getvehicleclosed);


// billingterms
// router.post('/insert_BillingTerms', createBillingTerms);
// router.post('/update_BillingTerms', updateBillingTerms);
// router.post('/delete_BillingTerms', deleteBillingTerms);
// router.post('/get_BillingTerms', getBillingTerms);

// department
// router.post('/insert_department', createDepartment);    
// router.post('/update_department', updateDepartment);
// router.post('/delete_department', deleteDepartment);
// router.post('/get_department', getDepartment);

// Receivables APIs
// router.post("/insert_Receivables", createReceivables);
// router.post("/update_Receivables", updateReceivables);
// router.post("/delete_Receivables", deleteReceivables);
// router.post("/get_Receivables", getReceivables);



// // vehicle posts
// router.post('/get_vehicle_Post', getVehiclePost);


// // ActiveTrip
// router.post('/Insert_Active_Trip', InsertActiveTrip);
// router.post('/update_Active_Trip', updateActiveTrip);
// router.post('/get_Active_Trip', getActiveTrip);
// router.post('/delete_Active_Trip', deleteActiveTrip);


module.exports = router
