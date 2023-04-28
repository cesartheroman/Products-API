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

export const createTable = () => {
  const client = new Client();
  client.connect();

  const text = `CREATE TABLE IF NOT EXISTS features (
	id serial PRIMARY KEY,
	product_id INTEGER,
	feature VARCHAR (255) NOT NULL,
	value VARCHAR (255) NOT NULL
);`;

  client
    .query(text)
    .then((res) => {
      console.log(res.rows[0]);
      client.end();
    })
    .catch((e) => console.error(e.stack));
};

export const insertValues = (data: string[]) => {
  const client = new Client();
  client.connect();

  const text = `INSERT INTO features VALUES ($1, $2, $3, $4)`;
  const query = {
    text,
    data,
  };

  client
    .query(query)
    .then((res) => {
      console.log(res.rows[0]);
    })
    .catch((e) => console.error(e.stack));
};
