import fs from 'node:fs';
import path from 'node:path';

import csv from 'csv-parser';
import { transform } from 'csv';

const readStream = fs.createReadStream(
  path.join(__dirname, '../data/related.csv')
);

const writeStream = fs.createWriteStream(
  path.join(__dirname, '../data/clean_related.csv')
);

const transformer = transform((data) => {
  const stringifiedData: string[] = [];
  const jsonParsedData = [];
  const result = [];

  stringifiedData.push(JSON.stringify(data));

  for (let row of stringifiedData) {
    jsonParsedData.push(JSON.parse(row));
  }
  for (let relatedObj of jsonParsedData) {
    let { id, current_product_id, related_product_id } = relatedObj;

    result.push(`${id},${current_product_id},${related_product_id}\n`);
  }

  return result.join('\n');
});

readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => {
    console.log('finished');
  });
