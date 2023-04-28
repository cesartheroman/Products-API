import * as dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import {
  connectToDatabase,
  createProductsTable,
  createFeaturesTable,
} from '../database';

const app = express();
const PORT = process.env.PORT;

app.use('/', async (req: Request, res: Response) => {
  try {
    connectToDatabase();
    createProductsTable();
    res.json({ message: 'hello' });
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => {
  console.log(`listening on localhost:${PORT}`);
});
