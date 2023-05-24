"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const csv_1 = require("csv");
const csv_parser_1 = __importDefault(require("csv-parser"));
const readStream = node_fs_1.default.createReadStream(node_path_1.default.join(__dirname, '../data/features.csv'));
const writeStream = node_fs_1.default.createWriteStream(node_path_1.default.join(__dirname, '../data/clean_features.csv'));
const transformer = (0, csv_1.transform)((data) => {
    const stringifiedData = [];
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
    .pipe((0, csv_parser_1.default)(['id', 'product_id', 'feature', 'value']))
    .pipe(transformer)
    .pipe(writeStream)
    .on('finish', () => console.log('finished'));
