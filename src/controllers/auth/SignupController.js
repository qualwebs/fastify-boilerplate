const db = require('../../models/index');
const User = db.User;
const EmailOtp = db.EmailOtp;
const bcrypt = require('bcrypt');
const otpEmailTemplate = require('../../resources/views/email-templates/login/otp');
const SendEmailClass = require('../../Utils/SendEmailClass');

async function store(request, response) {
    try{
        let hashedPassword = await bcrypt.hashSync(request.body.password, 10);
        let email = request.body.email;
        //Validate Email
        if (email) {
            let isEmailExist = await User.count({where: { email: email.toLowerCase() }});
            if (isEmailExist) {
                return response.code(422).send({status: 500, message: 'Email already exist!'});
            }
        }

        const user = await User.create({
            name: request.body.name,
            email: request.body.email,
            password: hashedPassword
        });

        // DELETE SENSITIVE FIELD PASSWORD
        delete user.dataValues.password;

        // SEND OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const content = otpEmailTemplate(otp, user);

        // DELETE OLD OTP
        await EmailOtp.destroy({where: {email: user.email.toLowerCase()}});

        // SAVE IN DB
        await EmailOtp.create({email: user.email.toLocaleString(), otp});
        // Send Email
        await new SendEmailClass('OTP for Wash Agent! email verification',content,[{email: user.email}],null).sendEmail();

        return response.send(user);
    }catch (e){
        return response.code(500).send({status: 500, message: e.message});
    }
}

module.exports = {
    store,
};
