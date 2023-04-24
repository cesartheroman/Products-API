import express from 'express';

const app = express();
const PORT = 3000;

app.use('/', (req, res) => {
  res.json({ message: 'hello' });
});

app.listen(PORT, (req, res) => {
  console.log(`listening on localhost:${PORT}`);
});
