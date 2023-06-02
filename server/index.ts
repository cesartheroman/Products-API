import * as dotenv from 'dotenv';
dotenv.config();

import app from './server';
import { PORT } from './routes/definitions';

app.listen(PORT, () => {
  console.log(`[server]: Server is running on port: ${PORT}`);
});
