

const axios = require('axios');
const { Client_Secret, Client_ID } = require('../config/config');

exports.get_request = async function (url, queryParams = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔍 Request URL:", url);
      console.log("📦 Query Params:", queryParams);
      console.log("🧾 Request Headers:", headers);

      const response = await axios.get(url, {
        params: queryParams, // ✅ Proper way to send data in GET request
        headers: {
          'Content-Type': 'application/json',
          'Authorization': headers.Authorization,
          'x-api-key': Client_Secret
        },
        timeout: 50000
      });

      resolve(response);
    } catch (error) {
      if (error.response) {
        reject(new Error(`Status ${error.response.status}: ${JSON.stringify(error.response.data)}`));
      } else if (error.request) {
        reject(new Error('No response received from server'));
      } else {
        reject(error);
      }
    }
  });
};

exports.post_request = async function (url, queryParams = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔍 Request URL:", url);
      console.log("📦 Query Params:", queryParams);
      console.log("🧾 Request Headers:", headers);

      const response = await axios.post(url, {
        params: queryParams, 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': headers.Authorization,
          'x-api-key': Client_Secret
        },
        timeout: 10000
      });

      resolve(response.data);
    } catch (error) {
      if (error.response) {
        reject(new Error(`Status ${error.response.status}: ${JSON.stringify(error.response.data)}`));
      } else if (error.request) {
        reject(new Error('No response received from server'));
      } else {
        reject(error);
      }
    }
  });
};

exports.post_request_DL = async function (url, queryParams = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔍 Request URL:", url);
      console.log("📦 Query Params:", queryParams);
      console.log("🧾 Request Headers:", headers);

      const response = await axios.post(
        url,
        {}, // empty request body
        {
          params: queryParams,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': headers.Authorization,
            'x-api-key': Client_Secret
          },
          timeout: 60000
        }
      );
      console.log("Response data:", response.data);

      resolve(response.data);
    } catch (error) {
      if (error.response) {
        reject(new Error(`Status ${error.response.status}: ${JSON.stringify(error.response.data)}`));
      } else if (error.request) {
        reject(new Error('No response received from server'));
      } else {
        reject(error);
      }
    }
  });
};

exports.get_request_DL = async function (url, queryParams = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔍 Request URL:", url);
      console.log("📦 Query Params:", queryParams);
      console.log("🧾 Request Headers:", headers);

      const response = await axios.get(
        url,
        {
          params: queryParams,
          headers: {
        'Content-Type': 'application/json',
        'Authorization': headers.Authorization,
        'x-api-key': Client_Secret
          },
          timeout: 60000
        }
      );    console.log("Response data:", response.data);

      resolve(response.data);
    } catch (error) {
      if (error.response) {
        reject(new Error(`Status ${error.response.status}: ${JSON.stringify(error.response.data)}`));
      } else if (error.request) {
        reject(new Error('No response received from server'));
      } else {
        reject(error);
      }
    }
  });
};

exports.post_request_Aadhaar = async function (url, queryParams = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔍 Request URL:", url);
      console.log("📦 Query Params:", queryParams);
      console.log("🧾 Request Headers:", headers);

      const response = await axios.post(
        url,
        {}, // empty body
        {
          params: {
            aadhaar_number: queryParams.aadhaar_number,
            consent: queryParams.consent || "Y",
            purpose: queryParams.purpose || "ForKYC",
          },
          headers: {
            "Content-Type": "application/json",
            "x-api-key": Client_Secret,  // from your config/env
            "client-id": Client_ID,      // from your config/env
          },
          timeout: 10000,
        }
      );

      console.log("✅ Response data:", response.data);
      resolve(response);

    } catch (error) {
      if (error.response) {
        reject(
          new Error(
            `Status ${error.response.status}: ${JSON.stringify(
              error.response.data
            )}`
          )
        );
      } else if (error.request) {
        reject(new Error("No response received from server"));
      } else {
        reject(error);
      }
    }
  });
};

exports.get_request_Aadhaar = async function (url, queryParams = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔍 Request URL:", url);
      console.log("📦 Query Params:", queryParams);
      console.log("🧾 Request Headers:", headers);

        const response = await axios.post(
        url,
        {}, // empty body
        {
          params: {
            otp: queryParams.otp,
            reference_id: queryParams.reference_id,
            consent: queryParams.consent || "Y",
            purpose: queryParams.purpose || "ForKYC",
            // mobile_number: queryParams.mobile_number,
            // generate_pdf: "false", // ✅ Always include

          },
          headers: {
            "Content-Type": "application/json",
            "x-api-key": headers["x-api-key"] || Client_Secret,
            "client-id": headers["client-id"] || Client_ID,
          },
          timeout: 50000,
        }
      );

      console.log("✅ Response data:", response.data);
      resolve(response);
    } catch (error) {
      if (error.response) {
        reject(
          new Error(
            `Status ${error.response.status}: ${JSON.stringify(
              error.response.data.message || error.response.data
            )}`
          )
        );
      } else if (error.request) {
        reject(new Error("No response received from server"));
      } else {
        reject(error);
      }
    }
  });
};

exports.post_request_Bank_Cheque_OCR = async function extractBankCheque( url,  queryParams = {}, headers = {}) {
  try {
    console.log("🔍 Preparing Bank Cheque OCR Request...");

    const body = {
      document1: queryParams.document1   // Base64 Cheque Image
    };

    console.log("📩 Sending Request...");
    console.log("➡ URL:", url);
    console.log("➡ Headers:", headers);
    // console.log("➡ Body:", body);

    const response = await axios.post(url, body, { headers });

    console.log("✅ Response Received");
    return response.data;

  } catch (error) {
    if (error.response) {
      console.error("❌ API Error:", error.response.status, error.response.data);
      throw new Error(`HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.log("❌ No Response from Server:", error);
      throw new Error("❌ No response from DeepVue server"+ error.request);
    } else {
      throw new Error("❌ Request Error: " + error.message);
    }
  }
}

