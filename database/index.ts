import * as dotenv from 'dotenv';
dotenv.config();

import { Client } from 'pg';

export const connectToDatabase = () => {
  const client = new Client();
  client.connect();

  client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
    console.log(err ? err.stack : res.rows[0].message); // Hello World!
    client.end();
  });
};

export const createProductsTable = () => {
  const client = new Client();
  client.connect();

  const text = `CREATE TABLE IF NOT EXISTS products
  (
    id SERIAL PRIMARY KEY,
    name VARCHAR (255),
    slogan VARCHAR (255),
    description TEXT,
    category VARCHAR (255),
    default_price INTEGER
);`;

  client
    .query(text)
    .then((res) => {
      createFeaturesTable();
      client.end();
    })
    .catch((e) => console.error(e.stack));
};

export const createFeaturesTable = () => {
  const client = new Client();
  client.connect();

  const text = `CREATE TABLE IF NOT EXISTS features
  (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products,
    feature VARCHAR (255) NOT NULL,
    value VARCHAR (255) NOT NULL
);`;

  client
    .query(text)
    .then((res) => {
      client.end();
    })
    .catch((e) => console.error(e.stack));
};
