const buildApp = require('./app');

const startServer = async () => {
    const app = await buildApp();
    try {
        await app.listen({port: app.config.PORT});
        app.log.info(`Server listening on http://localhost:${app.config.PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

startServer();
