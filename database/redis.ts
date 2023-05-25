import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: 'redis',
    port: 6379,
  },
});

redisClient.on('error', (error) => console.error(`Error : ${error}`));

(async () => {
  redisClient.connect();
})();

export default redisClient;
