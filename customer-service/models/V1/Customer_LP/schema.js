const customer_lp_loading_schema = {
    type: 'object',
    properties: {
        CustomerID: { type: 'string', minLength: 1 },
        LoadPostID: { type: 'string', nullable: true },
        CompanyType: { type: 'string', minLength: 1 }
    },
    required: ['CustomerID', 'CompanyType'],
    
    additionalProperties: false
};

const customer_lp_loading_schemaLR = {
    type: 'object',
    properties: {
        CustomerID: { type: 'string', minLength: 1 },
        LoadPostID: { type: 'string', nullable: true },
    },
    required: ['CustomerID'],
    
    additionalProperties: false
};

module.exports = {
    customer_lp_loading_schema,
    customer_lp_loading_schemaLR
};


