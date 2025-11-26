const sendOTP_Schema = () => ({
    type: 'object',
    properties: {
        mobile_number: { type: 'string' }
    },
    required: ['mobile_number'],
    additionalProperties: false
});

// module.exports = { sendOTP_Schema };


const validateOTP_Schema = () => ({
    type: 'object',
    properties: {
        mobile_number: { type: 'string' },
        otp: { type: 'string' }

    },
    required: ['mobile_number','otp'],
    additionalProperties: false
});

module.exports = { sendOTP_Schema , validateOTP_Schema };
