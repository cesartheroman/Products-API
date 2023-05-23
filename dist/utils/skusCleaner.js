"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const csv_1 = require("csv");
const csv_parser_1 = __importDefault(require("csv-parser"));
const readStream = node_fs_1.default.createReadStream(node_path_1.default.join(__dirname, '../data/skus.csv'));
const writeStream = node_fs_1.default.createWriteStream(node_path_1.default.join(__dirname, '../data/clean_skus.csv'));
const transformer = (0, csv_1.transform)((data) => {
    const result = [];
    const { id, style_id, size, quantity } = data;
    result.push(`${id},${style_id},${size},${quantity}\n`);
    return result.join('\n');
});
readStream
    .pipe((0, csv_parser_1.default)({
    mapHeaders: ({ header }) => {
        header = header.trim();
        if (header === 'styleId') {
            header = 'style_id';
        }
        return header;
    },
}))
    .pipe(transformer)
    .pipe(writeStream)
    .on('finish', () => console.log('finished!'));
