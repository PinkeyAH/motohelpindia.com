// Description: It has the schema of Employee onboarding.
// It is used to validate the request body of Employee onboarding API.
const createexpenseTypeSchema = () => ({
    type: 'object',
    properties: {
        ExpenseTCode: { type: 'string' },
        ExpenseTName: { type: 'string' },
    
    },
    required: [],
    additionalProperties: false
});

module.exports = {
    createexpenseTypeSchema
};      

