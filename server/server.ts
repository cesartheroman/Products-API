import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { connectToDatabase } from '../database';

const app = express();

/* Global middlewares */
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
