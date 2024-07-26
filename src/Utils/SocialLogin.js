const axios = require('axios');


// CLIENT SECRET _Lgsp2kus9V3rtzxfgjvIBTrm4iq8Ux_BZjtdf199S3T4gVrnO

module.exports = class SocialLogin
{
    constructor(token) {
        this.token = token;
    }

    async loginWithGoogle()
    {
        return await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${this.token}`);
    }


    async loginWithApple()
    {   // TODO: NEED TO ADD CREDENTIALS FOR APPLE LOGIN
        const response = await axios.post(`https://appleid.apple.com/auth/token`, null, {
            params: {
                client_id: 'your_apple_client_id',
                client_secret: 'your_apple_client_secret',
                code: this.token,
                grant_type: 'authorization_code',
            },
        });
        const userExists =  await User.findOne({apple_id: response.data.id});
        return {
            user_exists: userExists,
            name: response.data.name,
            email: response.data.email.toLowerCase(),
            apple_id: response.data.id,
            email_verified_at: new Date().valueOf(),
            status: 'active'
        }
    }


}
