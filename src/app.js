require('dotenv').config();
const fastify = require('fastify');
const fastifyEnv = require('@fastify/env');
const plugins = require('./plugins');
const routes = require('./routes');
const { sequelize } = require('./models');

const buildApp = () => {
    const app = fastify({
        logger: true,
        ajv: {
            customOptions: {
                jsonPointers: true,
                // Warning: Enabling this option may lead to this security issue https://www.cvedetails.com/cve/CVE-2020-8192/
                allErrors: true
            },
            plugins: [
                require('ajv-errors')
            ]
        }
    });

    // Register @fastify/env plugin to load environment variables
    app.register(fastifyEnv, {
        dotenv: true,  // Load variables from .env file
        schema: {
            type: 'object',
            required: ['PORT', 'DATABASE_URL', 'NODE_ENV'],
            properties: {
                PORT: { type: 'string', default: '3000' },
                DATABASE_URL: { type: 'string' },
                NODE_ENV: { type: 'string', default: 'development' },
            },
        },
    });

    // Register plugins
    app.register(plugins);

    // Register routes
    app.register(routes);

    // Sync Database
    app.addHook('onReady', async () => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            app.log.info('Database connected and synchronized.');
        } catch (error) {
            app.log.error('Unable to connect to the database:', error);
        }
    });

    return app;
};

module.exports = buildApp;
