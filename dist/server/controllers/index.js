"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getRelatedProductIds = exports.getProductStyles = exports.getOneProduct = exports.getProductsList = void 0;
const models_1 = require("../models");
//GET All Products
const getProductsList = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    try {
        const productsList = await (0, models_1.readProductsList)(page, count);
        res.status(200).send(productsList);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.getProductsList = getProductsList;
//GET One Product
const getOneProduct = async (req, res) => {
    const { product_id } = req.params;
    try {
        const response = await (0, models_1.readProductById)(parseInt(product_id));
        res.status(200).send(response);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.getOneProduct = getOneProduct;
//GET Product Styles
const getProductStyles = async (req, res) => {
    const { product_id } = req.params;
    try {
        const response = await (0, models_1.readProductStyles)(parseInt(product_id));
        res.status(200).send(response);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.getProductStyles = getProductStyles;
//GET Related ProductIds
const getRelatedProductIds = async (req, res) => {
    const { product_id } = req.params;
    try {
        const [arrayToJsonObject] = await (0, models_1.readRelatedProoductIds)(parseInt(product_id));
        const relatedIds = [...arrayToJsonObject['array_to_json']];
        res.status(200).send(relatedIds);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.getRelatedProductIds = getRelatedProductIds;
//POST Create Product
const createProduct = async (req, res) => {
    const { name, slogan, description, category, default_price, features } = req.query;
    try {
        const parsedFeatures = JSON.parse(features);
        const newProduct = {
            name: name,
            slogan: slogan,
            description: description,
            category: category,
            default_price: parseInt(default_price),
            features: parsedFeatures,
        };
        const createdProduct = await (0, models_1.createNewProduct)(newProduct);
        res.status(201).send(createdProduct);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.createProduct = createProduct;
//PUT Update Product
const updateProduct = async (req, res) => {
    const { product_id } = req.params;
    const { name, slogan, description, category, default_price } = req.body;
    try {
        const product = await (0, models_1.readProductById)(parseInt(product_id));
        if (product.length === 0)
            throw new Error('Product does not exist');
        const productToBeUpdated = {
            product_id: parseInt(product_id),
            name: name,
            slogan: slogan,
            description: description,
            category: category,
            default_price: parseInt(default_price),
        };
        const updatedProduct = await (0, models_1.updateProductById)(productToBeUpdated);
        res.status(200).send(updatedProduct);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.updateProduct = updateProduct;
//DELETE Product
const deleteProduct = async (req, res) => {
    const { product_id } = req.params;
    try {
        const deletedProduct = await (0, models_1.deleteProductById)(parseInt(product_id));
        res.status(200).send(deletedProduct);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.deleteProduct = deleteProduct;
