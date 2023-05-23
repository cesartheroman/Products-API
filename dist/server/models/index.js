"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductById = exports.updateProductById = exports.createNewProduct = exports.readRelatedProoductIds = exports.readProductStyles = exports.readProductById = exports.readProductsList = void 0;
const database_1 = __importDefault(require("../../database"));
//Read All Products
const readProductsList = async (page, count) => {
    const client = await database_1.default.connect();
    try {
        const query = {
            text: 'SELECT * FROM products WHERE product_id > $1 ORDER BY product_id LIMIT $2',
            values: [page * count - count, count],
        };
        const { rows } = await client.query(query);
        return rows;
    }
    catch (err) {
        console.log('Error executing query: readProductsList', err);
        return [];
    }
    finally {
        client.release();
    }
};
exports.readProductsList = readProductsList;
//Read One Product
const readProductById = async (product_id) => {
    const client = await database_1.default.connect();
    try {
        const query = {
            text: `SELECT *, 
      (
        SELECT array_to_json(array_agg(feature_cols)
      ) 
      FROM 
      (
        SELECT feature, value 
          FROM features 
            WHERE features.product_id = $1) feature_cols
      ) 
      AS features 
      FROM products 
      WHERE products.product_id = $1;`,
            values: [product_id],
        };
        const { rows } = await database_1.default.query(query);
        return rows;
    }
    catch (err) {
        console.log('Error executing query: readProductById', err);
        return [];
    }
    finally {
        client.release();
    }
};
exports.readProductById = readProductById;
//Read Product Styles
const readProductStyles = async (product_id) => {
    const client = await database_1.default.connect();
    try {
        const query = {
            text: `SELECT row_to_json(t)
      FROM (
        SELECT products.product_id,
          ( 
          SELECT array_to_json(array_agg(results_col))
            FROM (
              SELECT styles.styles_id, styles.name, styles.original_price, styles.sale_price, styles.default_style,
              (
                SELECT array_to_json(array_agg(row_to_json(photo_cols)))
                FROM (
                  SELECT thumbnail_url, url 
                  FROM photos
                  WHERE photos.styles_id = styles.styles_id
                ) photo_cols
              ) AS photos,
              (
                SELECT jsonb_object_agg(size, quantity)
                FROM skus
                WHERE skus.styles_id = styles.product_id
              ) AS skus
            FROM styles
            WHERE styles.product_id = $1
          ) results_col
        ) AS results
        FROM products
        WHERE products.product_id = $1
      ) t;`,
            values: [product_id],
        };
        const { rows } = await database_1.default.query(query);
        return rows;
    }
    catch (err) {
        console.log('Error executing query: readProductStyles', err);
        return [];
    }
    finally {
        client.release();
    }
};
exports.readProductStyles = readProductStyles;
//Read Related Products
const readRelatedProoductIds = async (product_id) => {
    const client = await database_1.default.connect();
    try {
        const query = {
            text: `SELECT ARRAY_TO_JSON(ARRAY_AGG(related_product_id)) FROM related WHERE product_id=$1`,
            values: [product_id],
        };
        const { rows } = await client.query(query);
        return rows;
    }
    catch (err) {
        console.log('Error executing query: readRelatedProoductIds', err);
        return [];
    }
    finally {
        client.release();
    }
};
exports.readRelatedProoductIds = readRelatedProoductIds;
//Create Product
const createNewProduct = async (newProduct) => {
    const client = await database_1.default.connect();
    try {
        const productQuery = {
            text: `INSERT INTO products (name, slogan, description, category, default_price) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            values: [
                newProduct.name,
                newProduct.slogan,
                newProduct.description,
                newProduct.category,
                newProduct.default_price,
            ],
        };
        const { rows } = await client.query(productQuery);
        const [createdProduct] = rows;
        const [featuresObj] = newProduct.features;
        const featuresQuery = {
            text: 'INSERT INTO features (product_id, feature, value) VALUES ($1, $2, $3) RETURNING *',
            values: [
                createdProduct.product_id,
                featuresObj.feature,
                featuresObj.value,
            ],
        };
        await client.query(featuresQuery);
        return [createdProduct];
    }
    catch (err) {
        console.log('Error executing query: createNewProduct', err);
        return [];
    }
    finally {
        client.release();
    }
};
exports.createNewProduct = createNewProduct;
//Update Product
const updateProductById = async (productToBeUpdated) => {
    const client = await database_1.default.connect();
    try {
        const productQuery = {
            text: 'UPDATE products SET (name, slogan, description, category, default_price) = ($1, $2, $3, $4, $5) WHERE product_id=$6 RETURNING *',
            values: [
                productToBeUpdated.name,
                productToBeUpdated.slogan,
                productToBeUpdated.description,
                productToBeUpdated.category,
                productToBeUpdated.default_price,
                productToBeUpdated.product_id,
            ],
        };
        const { rows } = await client.query(productQuery);
        return rows;
    }
    catch (err) {
        console.log('Error executing query: updateProductById', err);
        return [];
    }
    finally {
        client.release();
    }
};
exports.updateProductById = updateProductById;
//DELETE Product
const deleteProductById = async (product_id) => {
    const client = await database_1.default.connect();
    try {
        const query = {
            text: 'DELETE FROM products WHERE product_id=$1 RETURNING *',
            values: [product_id],
        };
        const { rows } = await client.query(query);
        return rows;
    }
    catch (err) {
        console.log('Error executing query: deleteProductById', err);
        return [];
    }
    finally {
        client.release();
    }
};
exports.deleteProductById = deleteProductById;
