const db = require('../../models/index');
const User = db.User;
const EmailOtp = db.EmailOtp;
const moment = require('moment');
const AuthService = require('../../services/AuthService');
const otpEmailTemplate = require('../../resources/views/email-templates/login/otp');
const SendEmailClass = require('../../Utils/SendEmailClass');

async function update(request, response) {
    const data = request.body;
    try {
        const user = await User.findOne({where: {email: data.email.toLowerCase()}});

        if (!user) {
            response.code(400).send({status: 400, data: {}, message: "Invalid account"});
        }

        const isValidOtp = await EmailOtp.findOne({where: {email: data.email.toLowerCase(), otp: data.otp}});

        if (isValidOtp != null) {
            await EmailOtp.destroy({where: {email: data.email.toLowerCase()}});
            const user = await User.findOne({where: {email: data.email.toLowerCase()}});
            if (user) {
                await user.update({status: 'active', email_verified_at: moment().format('YYYY-MM-DD')});
                await user.save();

                const token = await new AuthService(user).generateToken();
                response.send({data: {user, token}});
            }
            response.code(400).send({status: 400, data: {}, message: "User not found in system."});
        }
        response.code(400).send({status: 400, data: {}, message: "This OTP is no longer valid please request a new one."});
    } catch (e) {
        response.code(500).send({status: 500, message: e.message});
    }
}

async function store(request, response) {
    const data = request.body;
    try {
        const user = await User.findOne({where: {email: data.email.toLowerCase()}});

        if (!user) {
            response.code(400).send({status: 400, data: {}, message: "Invalid account"});
        }

        if(!data.email){
            response.code(400).send({status: 400, data: {}, message: "Email is required."});
        }

        // SEND OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const content = otpEmailTemplate(otp, user);

        // DELETE OLD OTP
        await EmailOtp.destroy({where: {email: data.email.toLowerCase()}});

        // SAVE IN DB
        await EmailOtp.create({email: data.email.toLocaleString(), otp});
        // Send Email
        await new SendEmailClass('OTP for LIFA! email verification',content,[{email: user.email}],null).sendEmail();

        response.code(201).send();
    } catch (e) {
        response.code(500).send({status: 500, message: e.message});
    }
}


module.exports = {
    update,
    store
};
