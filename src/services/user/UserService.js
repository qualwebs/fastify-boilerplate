const db = require('../../models/index');
const User = db.User;

async function getAllUsers() {
    return await User.findAll();
}

module.exports = {
    getAllUsers,
};
