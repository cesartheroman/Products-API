"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const csv_1 = require("csv");
const readStream = node_fs_1.default.createReadStream(node_path_1.default.join(__dirname, '../data/photos.csv'));
const writeStream = node_fs_1.default.createWriteStream(node_path_1.default.join(__dirname, '../data/clean_photos.csv'));
const transformer = (0, csv_1.transform)((data) => {
    const result = [];
    const [_, style_id, url, thumbnail_url] = data;
    result.push(`${style_id},${url},${thumbnail_url}\n`);
    return result.join('\n');
});
readStream
    .pipe((0, csv_1.parse)({ skip_records_with_error: true, from_line: 2 }))
    .pipe(transformer)
    .pipe(writeStream)
    .on('finish', () => {
    console.log('finished');
});
