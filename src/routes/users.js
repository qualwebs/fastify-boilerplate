const UserController = require('../controllers/UserController');

async function userRoutes(app) {
    app.get('/', UserController.list);
}

module.exports = userRoutes;
