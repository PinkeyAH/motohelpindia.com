// production

const e = require("express");

exports.Client_ID = "41a9dca191";
exports.Client_Secret = "82b184a67be34f97bfeb695820838266";

//UAT

// exports.Client_ID = "cf99f07b7a";
// exports.Client_Secret = "e49d70c696ee4a518420b57e4bf3be8b";

exports.auth_url = `https://production.deepvue.tech/v1/authorize`;
exports.pan_verification_url = "https://production.deepvue.tech/v1/verification/panbasic";
// exports.pan_verification_url = "https://production.deepvue.tech/v1/verification/pan-plus";
exports.Gst_verification_url = "https://production.deepvue.tech/v1/verification/gstinlite";
exports.post_DrivingLicense_verification_url = "https://production.deepvue.tech/v1/verification/post-driving-license";
exports.get_DrivingLicense_verification_url = "https://production.deepvue.tech/v1/verification/get-driving-license";
// exports.Aadhaar_verification_url = "https://production.deepvue.tech/v1/verification/aadhaar";

exports.post_Aadhaar_verification_url = "https://production.deepvue.tech/v2/ekyc/aadhaar/generate-otp";
exports.get_Aadhaar_verification_url = "https://production.deepvue.tech/v2/ekyc/aadhaar/verify-otp";

exports.Vehicle_verification_url = "https://production.deepvue.tech/v1/verification/rc-advanced";

exports.send_OTP = "https://kutility.org/app/smsapi/index.php?username=neotechnet&password=neotechnet&campa";

exports.send_OTP = `Dear Customer,OTP for login is 3322111 . Please do not share this OTP. Regards, Neotech IT Services Email: info@neotechnet.com`

// curl --location 'https://production.deepvue.tech/v1/authorize' 
// --form 'client_id="YOUR CLIENT_ID"' 
// --form 'client_secret="YOUR CLIENT_SECRET"'


//         // SMS API Configuration
//         const smsApiUrl = "https://kutility.org/app/smsapi/index.php";
//         const params = {
//             username: "neotechnet",
//             password: "neotechnet",
//             campaign: "13613",
//             routeid: "7",
//             type: "text",
//             contacts: mobile_number,
//             senderid: "NEOTEC",
//             msg: `Dear Customer, OTP for login is ${otp}. Please do not share this OTP. Regards, Neotech IT Services`,
//             template_id: "1707174151394097573", // DLT-approved template ID
//             pe_id: "1201160680727344572" // Principal entity ID
//         };

//         // Send OTP via SMS
//         const smsResponse = await axios.get(smsApiUrl, { params });
//         logger.log("info", `SMS API Response: ${JSON.stringify(smsResponse.data)}`);

// https://kutility.org/app/smsapi/index.php?username=neotechnet&password=neotechnet&campaign=13613&routeid=7&type=text&contacts=9224323167&senderid=NEOTEC&msg=Dear Customer,OTP for login is 3322111 . Please do not share this OTP. Regards, Neotech IT Services Email: info@neotechnet.com&template_id=1707174151394097573&pe_id=1201160680727344572
