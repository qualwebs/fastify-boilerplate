const UserController = require('../controllers/UserController');

async function userRoutes(app) {
    app.get('/profile',{onRequest: [app.authenticate]}, UserController.list);
}

module.exports = userRoutes;
