import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { testConnection } from '../database';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use('/', (req: Request, res: Response) => {
  try {
    testConnection();
    res.json({ message: 'hello' });
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => {
  console.log(`listening on localhost:${PORT}`);
});
