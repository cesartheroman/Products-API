import fs from 'node:fs';
import path from 'path';

import { transform } from 'csv';
import csv from 'csv-parser';

const readStream = fs.createReadStream(
  path.join(__dirname + '../../../data/features.csv')
);

const writeStream = fs.createWriteStream(
  path.join(__dirname + '../../../data/transformedFeatures.csv')
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
    result.push(`${id}, ${product_id}, ${feature}, ${value}\n`);
  }

  return result.join('\n');
});

readStream
  .pipe(csv(['id', 'product_id', 'feature', 'value']))
  .pipe(transformer)
  .pipe(writeStream)
  .on('end', () => console.log('finished!'));

// const old = transform((data) => {
//   const results: string[] = [];
//   const stringifiedData = data.toString();
//   const chunkArray = stringifiedData.split('\n');

//   /*
//   chunked array: [
//     '1556041,701483,"Frame","AllLight Composition Resin"',
//     '1556042,701484,"Sustainably Sourced",null',
//     ...]
//   */

//   for (let chunk of chunkArray) {
//     /*
//       chunk: 46967,21152,"Material","Control Support Bridge"
//       chunk: 46968,21152,"Green Leaf Certified",null
//      */
//     const splitChunk = chunk.split(',');

//     /*
//       splitChunk:  [ '17216', '7759', '"Non-GMO"', 'null' ]
//       splitChunk:  [ '17217', '7760', '"Material"', '"FullSupport Hybrid Compound"' ]
//       splitChunk:  [ '17218', '7760', '"Fair Trade Certified"', 'null' ]
//       */

//     // if (splitChunk[3] !== 'null') {
//     //   console.log(splitChunk);
//     //   splitChunk[3] = splitChunk[3].replace(/,/g, '');
//     // }
//     // console.log(splitChunk[3]);

//     if (splitChunk.length > 4) {
//       //handle case where feature value is an extra column
//       const [id, product_id, feature, ...rest] = splitChunk;
//       const newValue = rest.join('');
//       //spliced chunk [ '2051877', '924803', '"95% Cotton', ' 5% Elastic"' ]
//       // console.log(id, product_id, feature, newValue);
//       results.push([id, product_id, feature, newValue].toString());
//     } else if (splitChunk.includes('null')) {
//       //  replace null with empty string
//       let [id, product_id, feature, nullVal] = splitChunk;
//       // console.log(id, product_id, feature, nullVal);
//       nullVal = `"null"`;

//       /*
//          w/null [ '22610', '10202', '"Satisfaction Guaranteed"', 'null' ]
//          no null [ '22610', '10202', '"Satisfaction Guaranteed"', '' ]
//          */
//       // if (id === '2031') {
//       //   console.log([id, product_id, feature, nullVal].toString());
//       // }
//       results.push([id, product_id, feature, nullVal].toString());
//     } else {
//       results.push(splitChunk);
//     }
//   }

//   return results.join('\n');
// });
