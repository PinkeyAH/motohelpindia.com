const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
const qs = require('qs');  // ✅ Add this
const { auth_url, Client_Secret, Client_ID } = require('../../config/config');

// Load cert
// const certPath = path.resolve(__dirname, '../../../config/certs/client_cert.pem');
const certPath = path.resolve(__dirname, '../../config/certs/prod_cert.pem');

const cert = fs.readFileSync(certPath);

// HTTPS agent
const httpsAgent = new https.Agent({
  cert,
  rejectUnauthorized: true
});

exports.auth_vaildation = function (req, res, next) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Client_ID:", Client_ID);
      console.log("Client_Secret:", Client_Secret);

      const formBody = qs.stringify({
        client_id: Client_ID,
        client_secret: Client_Secret
      });

      const response = await axios.post(
        auth_url,
        formBody,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          httpsAgent
        }
      );
      console.log("Response data:", response.data);

      // next(resolve(response.data));
      const tokenData = response.data;

      // ✅ Inject token data into request headers
      req.headers['Authorization'] = `Bearer ${tokenData.access_token}`; // or whatever key it is
      req.headers['token_type'] = tokenData.token_type || 'Bearer';
      req.headers['expiry'] = tokenData.expiry || '';

      // ✅ Resolve and pass tokenData to next step if needed
      resolve(tokenData);
      next();
    } catch (error) {
      if (error.response) {
        reject(new Error(`Status ${error.response.status}: ${JSON.stringify(error.response.data)}`));
      } else if (error.request) {
        reject(new Error('No response received'));
      } else {
        reject(error);
      }
    }
  });
};
