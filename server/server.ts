import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { connectToDatabase } from '../database';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req: Request, res: Response) => {
  try {
    connectToDatabase();
    res.json({ message: 'hello' });
  } catch (err) {
    console.error(err);
  }
});

export default app;
