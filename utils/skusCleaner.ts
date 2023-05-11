import fs, { read } from 'node:fs';
import path from 'node:path';

import { transform } from 'csv';
import csv from 'csv-parser';

const readStream = fs.createReadStream(
  path.join(__dirname + '../../../data/skus.csv')
);

const writeStream = fs.createWriteStream(
  path.join(__dirname + '../../../data/clean_skus.csv')
);

const transformer = transform((data) => {
  const result = [];
  const { id, style_id, size, quantity } = data;

  result.push(`${id},${style_id},${size},${quantity}\n`);

  return result.join('\n');
});

readStream
  .pipe(
    csv({
      mapHeaders: ({ header }) => {
        header = header.trim();
        if (header === 'styleId') {
          header = 'style_id';
        }

        return header;
      },
    })
  )
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => console.log('finished!'));
