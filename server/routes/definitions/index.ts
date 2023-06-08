import path from 'path';
export const PORT = process.env.PORT;
export const SERVER_1 = process.env.SERVER_1;
export const SERVER_EC2_1 = process.env.SERVER_EC2_1;
export const SERVER_EC2_2 = process.env.SERVER_EC2_2;
export const LOCAL_HOST = process.env.LOCAL_HOST;

/* Swagger definition */
export const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products-API',
      version: '1.0.0',
    },
    servers: [
      {
        url: `${SERVER_1}:${PORT}`,
      },
      {
        url: `${SERVER_EC2_1}:${PORT}`,
      },
      {
        url: `${SERVER_EC2_2}:${PORT}`,
      },
      {
        url: `${LOCAL_HOST}:${PORT}`,
      },
    ],
  },
  apis: [path.join(__dirname, '../../routes/router.js')],
};
