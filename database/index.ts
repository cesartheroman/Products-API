import * as dotenv from 'dotenv';
dotenv.config();

import { Client } from 'pg';

export const connectToDatabase = () => {
  const client = new Client();
  client.connect();

  client
    .query('SELECT $1::text as message', ['Hello world!'])
    .then((res) => {
      client.end();
    })
    .catch((e) => console.error(e.stack));
};
