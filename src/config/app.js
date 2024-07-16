const fastifyEnv = require('@fastify/env');

const schema = {
    type: 'object',
    required: ['PORT'],
    properties: {
        PORT: {
            type: 'string',
            default: 3000,
        },
        NODE_ENV: {
            type: 'string',
            default: 'development',
        },
    },
};

const options = {
    confKey: 'config',
    schema: schema,
    dotenv: true,
};

module.exports = fastifyEnv(options);
