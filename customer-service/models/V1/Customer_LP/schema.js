const customer_lp_loading_schema = {
    type: 'object',
    properties: {
        CustomerID: { type: 'string', minLength: 1 },
        LoadPostID: { type: 'string', nullable: true }
    },
    required: ['CustomerID'],
    additionalProperties: false
};

module.exports = {
    customer_lp_loading_schema
};


