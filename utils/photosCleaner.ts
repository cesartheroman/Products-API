import fs from 'node:fs';
import path from 'node:path';

import { transform, parse } from 'csv';

const readStream = fs.createReadStream(
  path.join(__dirname, '../data/photos.csv')
);
const writeStream = fs.createWriteStream(
  path.join(__dirname, '../data/clean_photos.csv')
);

const transformer = transform((data) => {
  const result = [];
  const [_, style_id, url, thumbnail_url] = data;

  result.push(`${style_id},${url},${thumbnail_url}\n`);

  return result.join('\n');
});

readStream
  .pipe(parse({ skip_records_with_error: true, from_line: 2 }))
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => {
    console.log('finished');
  });
