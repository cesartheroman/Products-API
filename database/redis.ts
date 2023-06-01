import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
});

redisClient.on('error', (error) => console.error(`Error : ${error}`));

(async () => {
  redisClient.connect();
})();

export default redisClient;
