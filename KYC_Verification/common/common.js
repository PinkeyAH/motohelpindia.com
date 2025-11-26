// Generate OTP function

// otp.js
// module.exports.generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
// };
exports.generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
};
// // Test the function
// console.log("Generated OTP:", exports.generateOTP());


exports.getRandomSixDigitNumber =()=> {
        return Math.floor(100000 + Math.random() * 900000);
      
  }
  
  