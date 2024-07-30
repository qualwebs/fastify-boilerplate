const db = require('../models');
const User = db.User;

const fastifyPlugin = require('fastify-plugin');

async function authPlugin(fastify, options) {
    fastify.decorate('authenticate', async (request, reply) => {
        try {
            const decodedToken = await request.jwtVerify();
            const user_id = decodedToken.id;
            const user = await User.findOne({where: {id: user_id}});
            if(!user){
                throw new Error('User does not exists in the system');
            }
            if(user.status === 'inactive'){
                throw new Error('User is inactive');
            }
            return decodedToken;
        } catch (err) {
            return reply.code(401).send({ error: err.toString() });
        }
    });
}

module.exports = fastifyPlugin(authPlugin);
