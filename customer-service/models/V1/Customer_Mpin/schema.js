// Description: It has the schema of Employee onboarding.
// It is used to validate the request body of Employee onboarding API.
const customersetmpinSchema = () => ({
    type: 'object',
    properties: {
        // vendorid: { type: 'string' },
        customerid: { type: 'string' },
        mobile_number: { type: 'string' },
        mpin: { type: 'string', minLength: 4, maxLength: 6 },
        confirm_mpin: { type: 'string', minLength: 4, maxLength: 6 }

    },
    required: [],
    additionalProperties: false
});

const customerloginmpinSchema = () => ({
    type: 'object',
    properties: {
        // vendorid: { type: 'string' },
        customerid: { type: 'string' },
        mobile_number: { type: 'string' },
        mpin: { type: 'string', minLength: 4, maxLength: 6 }
    },
    required: [],
    additionalProperties: false
});
module.exports = {
    customersetmpinSchema,customerloginmpinSchema
};      

