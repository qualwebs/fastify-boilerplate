const db = require('../../models/index');
const User = db.User;
const bcrypt = require('bcrypt');

async function store(request, response) {
    let hashedPassword = await bcrypt.hashSync(request.body.password, 10);
    const user = await User.create({
        name: request.body.name,
        email: request.body.email,
        password: hashedPassword
    });
    response.send(user);
}

module.exports = {
    store,
};
