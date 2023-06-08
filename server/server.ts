import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import { productsRouter, LoaderIoRouter } from './routes/router';
import { swaggerSpec } from './routes/definitions';

const app = express();

/* Global middlewares */
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerJSDoc(swaggerSpec))
);

/* Routes */
app.use(`/${process.env.LOADERIO_TOKEN}`, LoaderIoRouter);
app.use('/products', productsRouter);

export default app;
