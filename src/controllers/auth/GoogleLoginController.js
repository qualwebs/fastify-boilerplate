const SocialLogin = require('../../utils/SocialLogin');
const db = require('../../models/index');
const User = db.User;
const bcrypt = require('bcrypt');
const AuthService = require("../../services/AuthService");
const moment = require('moment');

module.exports = {
    store: async (request, response) => {
        try {
            const userData = await new SocialLogin(request.body.token).loginWithGoogle();
            let user = await User.findOne({where: {'email': userData.data.email.toLowerCase()}});

            if(user){
                // UPDATE USER
                await User.update({id: user.id},{where: {'googleId': userData.data.sub}});
            }else{
                let hashedPassword = await bcrypt.hashSync(userData.data.sub, 10);
                user = await User.create({
                    name: userData.data.name,
                    email: userData.data.email.toString(),
                    password: hashedPassword,
                    email_verified_at: moment().format('YYYY-MM-DD'),
                    google_id: userData.data.sub
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
