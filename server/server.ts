import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import productRoutes from './routes/router';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req: Request, res: Response) => {
  try {
    res.json({ message: 'hello' });
  } catch (err) {
    console.error(err);
  }
});

app.use('/products', productRoutes);

export default app;
