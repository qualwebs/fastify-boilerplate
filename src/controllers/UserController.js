const userService = require('../services/user/UserService');

async function list(request, reply) {
    const users = await userService.getAllUsers();
    reply.send(users);
}

module.exports = {
    list,
};
