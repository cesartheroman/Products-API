import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import productRoutes from './routes/router';

const app = express();
const token = process.env.LOADERIO_TOKEN;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get(`${token}`, (req: Request, res: Response) => {
  res.send(token);
});

app.use('/products', productRoutes);

export default app;
