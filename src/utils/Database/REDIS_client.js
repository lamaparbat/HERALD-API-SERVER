const redis = require('redis')

const redisClient = redis.createClient();

const url = '';

redisClient
    .connect()
    .then(() => console.log('connected to redis server!'))
    .catch((err) =>
        console.log(
            'error connecting to reids ------> skip connection if error'
        )
    );

module.exports = redisClient;
