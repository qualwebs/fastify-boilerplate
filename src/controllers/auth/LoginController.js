const db = require('../../models/index');
const User = db.User;
const EmailOtp = db.EmailOtp;
const AuthService = require('../../services/AuthService');
const bcrypt = require('bcrypt');
const moment = require('moment');
const otpEmailTemplate = require('../../resources/views/email-templates/login/otp');
const SendEmailClass = require('../../Utils/SendEmailClass');

async function store(request, response) {
    try {
        const data = request.body;
        const user = await User.findOne({
            where: {email: data.email.toLowerCase()},
            attributes: {include: ['password']}
        });
        if(user == null){
            return response.code(400).send({status: 400, message: "Email does not exist in the system."});
        }
        if (user.status === 'inactive' && user.email_verified_at !== null) {
            return response.code(400).send({status: 400, message: "Your account has been deactivated. Please contact support for assistance."});
        }

        if (!data.password) {
            return response.code(400).send({status: 500, message: 'Password required.'});
        }
        // Load hash from your password DB.
        let passwordMatch = await bcrypt.compareSync(data.password, user.password);
        if (passwordMatch) {
            delete user.dataValues.password;
            if (!user.email_verified_at) {
                // SEND OTP
                const otp = Math.floor(100000 + Math.random() * 900000);
                const content = otpEmailTemplate(otp, user);
                // DELETE OLD OTP
                await EmailOtp.destroy({where: {email: user.email.toLowerCase()}});
                // SAVE IN DB
                await EmailOtp.create({email: user.email.toLocaleString(), otp});
                await new SendEmailClass('OTP for Car Wash! email verification.',content,[{email: user.email}],null).sendEmail();
                return response.send({data: {}, action: 'verify_email', message: "Verify your email address to continue."});
            }

            const token = await new AuthService(user).generateToken();
            return response.send({data: {user, token}, message: "Login success."});
        } else {
            return response.code(500).send({status: 500, message: 'Incorrect password'});
        }
    }catch (e) {
        return response.code(500).send({status: 500, message: e.message});
    }
}

module.exports = {
    store,
};
