import path from 'path';
export const PORT = process.env.PORT;
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
        url: `${LOCAL_HOST}:${PORT}`,
      },
    ],
  },
  apis: [path.join(__dirname, '../../routes/router.ts')],
};
