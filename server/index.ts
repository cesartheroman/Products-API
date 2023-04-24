import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use('/', (req, res) => {
  res.json({ message: 'hello' });
});

app.listen(PORT, (req, res) => {
  console.log(`listening on localhost:${PORT}`);
});
