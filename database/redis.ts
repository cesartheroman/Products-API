import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL;

const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on('error', (error) => console.error(`Error : ${error}`));

(async () => {
  redisClient.connect();
})();

export default redisClient;
