const userService = require('../services/user/UserService');

async function list(request, reply) {
    const users = request.user;
    reply.send(users);
}

module.exports = {
    list,
};
