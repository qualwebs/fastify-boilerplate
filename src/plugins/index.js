// src/plugins/index.js
const fastifyPlugin = require('fastify-plugin');
const fastifyCors = require('@fastify/cors');
const fastifySwagger = require('@fastify/swagger');
const authPlugin = require('./auth');

async function plugins(app) {
    app.register(fastifyCors, {
        origin: true,
    });

    app.register(fastifySwagger, {
        routePrefix: '/documentation',
        swagger: {
            info: {
                title: 'Fastify API',
                description: 'API Documentation',
                version: '0.1.0',
            },
        },
        exposeRoute: true,
    });

    // Register JWT plugin if using JWT
    app.register(require('@fastify/jwt'), {
        secret: process.env.JWT_SECRET
    });
    app.register(authPlugin);
}

// Export the plugin wrapped with fastify-plugin
module.exports = fastifyPlugin(plugins);
