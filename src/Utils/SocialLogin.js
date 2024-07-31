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
}
