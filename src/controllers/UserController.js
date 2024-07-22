const userService = require('../services/user/UserService');

async function list(request, response) {
    const users = request.user;
    return response.send(users);
}

module.exports = {
    list,
};
