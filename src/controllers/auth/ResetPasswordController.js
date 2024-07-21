const bcrypt = require("bcrypt");
const otpEmailTemplate = require("../../resources/views/email-templates/login/otp");
const SendEmailClass = require("../../Utils/SendEmailClass");
const moment = require("moment/moment");
const AuthService = require("../../services/AuthService");
const db = require('../../models/index');
const User = db.User;
const EmailOtp = db.EmailOtp;

async function replace(request, response) {
    const data = request.body;
    try {
        const user = await User.findOne({where: {email: data.email.toLowerCase()}});

        if (!user) {
            response.code(400).send({status: 400, data: {}, message: "Invalid account"});
        }

        const isValidOtp = await EmailOtp.findOne({where: {email: data.email.toLowerCase(), otp: data.otp}});

        if (isValidOtp != null) {
            if (data.password === data.confirm_password) {
                await EmailOtp.destroy({where: {email: data.email.toLowerCase()}});

                let hashedPassword = await bcrypt.hashSync(data.password, 10);
                await user.update({password: hashedPassword});
                await user.save();

                response.send({data: {}, message: "Password updated successfully, Please login to continue."});
            }
            response.code(400).send({status: 400, data: {}, message: "Password and confirm password not matched."});
        }
        response.code(400).send({status: 400, data: {}, message: "This OTP is no longer valid please request a new one."});
    } catch (e) {
        response.code(500).send({status: 500, message: e.message});
    }
}

module.exports = {
    replace,
};