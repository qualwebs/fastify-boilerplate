const axios = require('axios');
const jwt = require('jsonwebtoken')

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
    {
        try{
            return await jwt.decode(this.token);
        }catch (e){
            throw new Error(e.toString());
        }
    }
}
