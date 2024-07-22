const jwt = require('jsonwebtoken');
const moment = require('moment');
const db = require('../Models/index');
const oauthAccessToken = db.oauthAccessToken;
const md5 = require('md5');

module.exports = class AuthService {
    constructor(user) {
        this.user = user;
    }
    // Create user
    async generateToken() {
        const token = jwt.sign({
            id: this.user.id,
            email: this.user.email,
            name: this.user.name,
            issued: Date.now(),
            expires: new Date(new Date().setDate(new Date().getDate() + 7))
        }, process.env.JWT_SECRET);

        // STORE TOKEN IN DB
        await this.storeToken(token);
        return token;
    }

    async storeToken(token){
        await oauthAccessToken.create({
           user_id: this.user.id,
           access_token: md5(token),
           expires_at: moment().add(7, 'day').toISOString()
        });
    }

    async revokeToken(){
        let token = oauthAccessToken.findOne({where: {user_id: this.user.id}});
        if (token) {
            await oauthAccessToken.destroy({where: {
                    user_id: this.user.id
                }});
        }
    }
}
