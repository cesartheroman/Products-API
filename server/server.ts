import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { productsRouter, LoaderIoRouter } from './routes/router';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(`/${process.env.LOADERIO_TOKEN}`, LoaderIoRouter);

app.use('/products', productsRouter);

export default app;
