const customer_employee_schema = {
    type: 'object',
    properties: {
        EmployeeID: { type: 'string' },
        CustomerID: { type: 'string' },
        Name: { type: 'string' },
        Email: { type: 'string', format: 'email' },
        Phone: { type: 'string' },
        Designation: { type: 'string' },
        IsActive: { type: 'boolean' }
    }
};

module.exports = { customer_employee_schema };  