import * as dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import { connectToDatabase } from '../database';

const app = express();
const PORT = process.env.PORT;

app.use('/', async (req: Request, res: Response) => {
  try {
    connectToDatabase();
    res.json({ message: 'hello' });
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => {
  console.log(`listening on localhost:${PORT}`);
});
