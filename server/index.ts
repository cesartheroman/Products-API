import * as dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import { connectToDatabase, createTable, insertValues } from '../database';

const app = express();
const PORT = process.env.PORT;

app.use('/', async (req: Request, res: Response) => {
  try {
    connectToDatabase();
    createTable();
    res.json({ message: 'hello' });
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => {
  console.log(`listening on localhost:${PORT}`);
});
