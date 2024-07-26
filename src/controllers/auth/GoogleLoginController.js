const SocialLogin = require('../../utils/SocialLogin');
const moment = require('moment/moment');
const db = require('../../models/index');
const User = db.User;
const EmailOtp = db.EmailOtp;
const bcrypt = require('bcrypt');
const AuthService = require("../../services/AuthService");

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
                    email_verified_at: moment().format('YYYY-MM-DD')
                });
            }

            const token = await new AuthService(user).generateToken();
            return response.send({data: {user, token}});
        } catch (e) {
            return response.code(500).send({status: 500, message: e.message});
        }
    }
}
