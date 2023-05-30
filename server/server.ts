import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import { productsRouter, LoaderIoRouter } from './routes/router';

const app = express();

/* Swagger definition */
const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products-API',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://18.119.161.46/${process.env.PORT}`,
      },
    ],
  },
  apis: ['./server/routes/router.ts'],
};

/* Global middlewares */
app.use(cors({ methods: ['GET', 'PUT', 'POST', 'DELETE'] }));
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
