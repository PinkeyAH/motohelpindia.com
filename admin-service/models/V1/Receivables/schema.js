// Description: It has the schema of Employee onboarding.
// It is used to validate the request body of Employee onboarding API.
const createReceivablesSchema = () => ({
    type: 'object',
    properties: {
        ReceivableID: { type: 'string' },
        CreditPeriod: { type: 'string' },
        BillingPeriod: { type: 'string' },
        BillingAddress: { type: 'string' },

    },
    required: [],
    additionalProperties: false
});

module.exports = {
    createReceivablesSchema
};      

