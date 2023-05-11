import fs from 'node:fs';
import path from 'node:path';

import { transform } from 'csv';
import csv from 'csv-parser';

const readStream = fs.createReadStream(
  path.join(__dirname + '../../../data/products.csv')
);

const writeStream = fs.createWriteStream(
  path.join(__dirname + '../../../data/clean_products.csv')
);

const transformer = transform((data) => {
  const stringifiedData: string[] = [];
  const jsonParsedData = [];
  const result = [];

  stringifiedData.push(JSON.stringify(data));

  for (let row of stringifiedData) {
    jsonParsedData.push(JSON.parse(row));
  }

  for (let productObj of jsonParsedData) {
    let { id, name, slogan, description, category, default_price } = productObj;
    default_price = default_price.replace(/\D/g, '');
    result.push(
      `${id}, "${name}", "${slogan}", "${description}", "${category}", ${default_price}\n`
    );
  }

  return result.join('\n');
});

readStream
  .pipe(
    csv({
      mapHeaders: ({ header }) => header.trim(),
    })
  )
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => console.log('finished'));
