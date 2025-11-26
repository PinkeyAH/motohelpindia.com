// Description: It has the schema of Employee onboarding.
// It is used to validate the request body of Employee onboarding API.
const createBillingTermsSchema = () => ({
    type: 'object',
    properties: {
        BillID: { type: 'string' },
        CreditPeriod: { type: 'string' },
        BillingPeriod: { type: 'string' },
        BillingAddress: { type: 'string' },

    },
    required: [],
    additionalProperties: false
});

module.exports = {
    createBillingTermsSchema
};      

