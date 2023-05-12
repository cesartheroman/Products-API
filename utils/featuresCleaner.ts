import fs from 'node:fs';
import path from 'node:path';

import { transform } from 'csv';
import csv from 'csv-parser';

const readStream = fs.createReadStream(
  path.join(__dirname, '../data/features.csv')
);

const writeStream = fs.createWriteStream(
  path.join(__dirname, '../data/clean_featureTest.csv')
);

const transformer = transform((data) => {
  const stringifiedData: string[] = [];
  const jsonParsedData = [];
  const result = [];

  stringifiedData.push(JSON.stringify(data));

  for (let row of stringifiedData) {
    jsonParsedData.push(JSON.parse(row));
  }

  for (let featureObj of jsonParsedData) {
    let { id, product_id, feature, value, ...rest } = featureObj;
    if (value.includes(',')) {
      value = value.split(',').join('');
    }
    result.push(`${id},${product_id},${feature},${value}\n`);
  }

  return result.join('\n');
});

readStream
  .pipe(csv(['id', 'product_id', 'feature', 'value']))
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => console.log('finished'));
