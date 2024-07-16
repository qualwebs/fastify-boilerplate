const {User} = require('../../models/user');

async function getAllUsers() {
    return await User.find();
}

module.exports = {
    getAllUsers,
};
