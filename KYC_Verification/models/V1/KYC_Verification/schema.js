const PANCard_schema = () => ({
    type: 'object',
    properties: {
        pan_number: { type: 'string', pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' },
        // name: { type: 'string', minLength: 1 },
        // date_of_birth: { type: 'string', format: 'date' }
    },
    required: ['pan_number'],
    additionalProperties: false
});
const Gst_schema = () => ({
    type: 'object',
    properties: {
        gstin_number: { type: 'string', pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z{1}[0-9A-Z]{1}$' },
        // name: { type: 'string', minLength: 1 },
        // state_code: { type: 'string', pattern: '^[0-9]{2}$' }
    },
    required: ['gstin_number'],
    additionalProperties: false
});

const DrivingLicense_schema = () => ({
    type: 'object',
    properties: {   
        // dl_number: { type: 'string', pattern: '^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{7}$' },
        // name: { type: 'string', minLength: 1 },
        // dob: { type: 'string', format: 'date' },
        // issue_date: { type: 'string', format: 'date' },
        // expiry_date: { type: 'string', format: 'date' }
    },
    // required: ['dl_number', 'dob'],
    additionalProperties: false
});
const Aadhaargenerateotp_schema = () => ({
    type: 'object',
    properties: {
        aadhaar_number: { type: 'string', pattern: '^[2-9]{1}[0-9]{11}$' },
        // name: { type: 'string', minLength: 1 },
        // date_of_birth: { type: 'string', format: 'date' }
    },
    required: ['aadhaar_number'],
    additionalProperties: false
});

const Aadhaarverifyotp_schema = () => ({
    type: 'object',
    properties: {
        otp: { type: 'string', pattern: '^[0-9]{4,6}$' },
        reference_id: { type: 'string', minLength: 1 },
        // mobile_number: { type: 'string', pattern: '^[6-9][0-9]{9}$' },
        // generate_pdf: { type: 'boolean' }
    },
    required: ['otp', 'reference_id'],
    additionalProperties: false
});

const Vehicle_schema = () => ({
    type: 'object',
    properties: {
        rc_number: { type: 'string', pattern: '^[A-Z]{2}[0-9]{2}[A-Z]{1,3}[0-9]{4,5}$' },
        // name: { type: 'string', minLength: 1 },
        // date_of_birth: { type: 'string', format: 'date' }
    },
    required: ['rc_number'],
    additionalProperties: false
});

module.exports = {  PANCard_schema,Gst_schema, DrivingLicense_schema ,Aadhaargenerateotp_schema, Aadhaarverifyotp_schema ,Vehicle_schema };

