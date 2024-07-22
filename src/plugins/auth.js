const fastifyPlugin = require('fastify-plugin');

async function authPlugin(fastify, options) {
    fastify.decorate('authenticate', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send({ error: 'Unauthorized' });
        }
    });
}

module.exports = fastifyPlugin(authPlugin);
