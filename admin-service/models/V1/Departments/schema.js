// Description: It has the schema of Department onboarding.
// It is used to validate the request body of Department onboarding API.
const createDepartmentSchema = () => ({
    type: 'object',
    properties: {
        DepartmentID: { type: 'string' },
        department: { type: 'string' },
        name: { type: 'string' },
        email_id: { type: 'string' },
        contact_no: { type: 'string' },
        designation: { type: 'string' }
    },
    required: [],
    additionalProperties: false
});

module.exports = {
    createDepartmentSchema
};      

