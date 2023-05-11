import fs from 'node:fs';
import path from 'node:path';

import csv from 'csv-parser';
import { transform } from 'csv';

const readStream = fs.createReadStream(
  path.join(__dirname, '../data/styles.csv')
);

const writeStream = fs.createWriteStream(
  path.join(__dirname, '../data/clean_styles.csv')
);

const transformer = transform((data) => {
  const stringifiedData: string[] = [];
  const jsonParsedData = [];
  const result = [];

  stringifiedData.push(JSON.stringify(data));

  for (let row of stringifiedData) {
    jsonParsedData.push(JSON.parse(row));
  }
  for (let stylesObj of jsonParsedData) {
    let { id, product_id, name, sale_price, original_price, default_style } =
      stylesObj;

    result.push(
      `${id},${product_id},${name},${sale_price},${original_price},${default_style}\n`
    );
  }

  return result.join('\n');
});

readStream
  .pipe(
    csv({
      mapHeaders: ({ header }) => {
        if (header === 'productId') {
          return 'product_id';
        }
        return header;
      },
    })
  )
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => {
    console.log('finished');
  });
