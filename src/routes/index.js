const fastifyPlugin = require('fastify-plugin');
const userRoutes = require('./users');
const authRoutes = require('./auth');

async function routes(app) {
    app.register(authRoutes, { prefix: '/api/v1/auth' });
    app.register(userRoutes, { prefix: '/api/v1/users' });
}

module.exports = fastifyPlugin(routes);
