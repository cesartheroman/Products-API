"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const csv_1 = require("csv");
const readStream = node_fs_1.default.createReadStream(node_path_1.default.join(__dirname, '../data/styles.csv'));
const writeStream = node_fs_1.default.createWriteStream(node_path_1.default.join(__dirname, '../data/clean_styles.csv'));
const transformer = (0, csv_1.transform)((data) => {
    const stringifiedData = [];
    const jsonParsedData = [];
    const result = [];
    stringifiedData.push(JSON.stringify(data));
    for (let row of stringifiedData) {
        jsonParsedData.push(JSON.parse(row));
    }
    for (let stylesObj of jsonParsedData) {
        let { id, product_id, name, sale_price, original_price, default_style } = stylesObj;
        result.push(`${id},${product_id},${name},${sale_price},${original_price},${default_style}\n`);
    }
    return result.join('\n');
});
readStream
    .pipe((0, csv_parser_1.default)({
    mapHeaders: ({ header }) => {
        if (header === 'productId') {
            return 'product_id';
        }
        return header;
    },
}))
    .pipe(transformer)
    .pipe(writeStream)
    .on('finish', () => {
    console.log('finished');
});
