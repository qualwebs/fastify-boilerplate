const SocialLogin = require('../../utils/SocialLogin');
const db = require('../../models/index');
const User = db.User;
const bcrypt = require('bcrypt');
const AuthService = require("../../services/AuthService");
const moment = require('moment');

module.exports = {
    store: async (request, response) => {
        try {
            if(!request.body.user_identifier){
                throw new Error('User identifier is required field.');
            }
            let user = await User.findOne({where: {apple_id: request.body.user_identifier}});

            if(!user){
                if(!request.body.identy_token){
                    throw new Error('Identity token is required field.');
                }
                const userData = await new SocialLogin(request.body.identy_token).loginWithApple();
                let hashedPassword = await bcrypt.hashSync(userData.sub, 10);
                user = await User.create({
                    name: request.body.name,
                    email: userData.email.toString(),
                    password: hashedPassword,
                    email_verified_at: moment().format('YYYY-MM-DD'),
                    apple_id: userData.sub
                });
                delete user.dataValues.password;
            }

            const token = await new AuthService(user).generateToken();
            return response.send({data: {user, token}});
        } catch (e) {
            return response.code(500).send({status: 500, message: e.message});
        }
    }
}
