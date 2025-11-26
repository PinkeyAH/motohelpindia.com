

const login_schema = () => ({
    type: 'object',
    properties: {
        username: { type: 'string' },
        password: { type: 'string', minLength: 6 }    },
    required: ['username', 'password'],
    additionalProperties: false
});


const logout_Schema = () => ({
    type: 'object',
    properties: {
        username: { type: 'string' },
        password: { type: 'string', minLength: 6 }    },
    required: ['username', 'password'],
    additionalProperties: false
});

module.exports = { login_schema,logout_Schema };



