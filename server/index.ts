import * as dotenv from 'dotenv';
dotenv.config();

import app from './server';

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`listening on localhost:${PORT}`);
});
