// Description: It has the schema of Employee onboarding.
// It is used to validate the request body of Employee onboarding API.
    
const employeeInsertSchema = () => ({
    type: 'object',
    properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        current_address: { type: 'string' },
        permanent_address: { type: 'string' },
        referred_person_name: { type: 'string' },
        referred_person_no: { type: 'string' },
    },
    required: [],
    additionalProperties: false
});

module.exports = { employeeInsertSchema };

