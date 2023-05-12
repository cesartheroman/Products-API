import pool from '../../database';

import { ProductsListProps, Product } from './definitions';

//Read All Products
export const readProductsList = async <ProductsListProps>(
  page = 1,
  count = 5
): Promise<Product[]> => {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM products ORDER BY id asc LIMIT $1 OFFSET $2;';
    const values = [count, page * count - count];

    const { rows }: { rows: Product[] } = await client.query(query, values);

    client.release();
    return rows;
  } catch (err) {
    console.log('Error executing query', err);
    return [];
  }
};

//Read One Product
export const readProductById = async (
  product_id: number
): Promise<Product[]> => {
  try {
    const client = await pool.connect();
    const query =
      'SELECT *, (SELECT array_to_json(array_agg(feature_cols)) FROM (SELECT feature, value FROM features WHERE features.product_id = products.id)  feature_cols) AS features FROM products WHERE products.id = $1;';
    const values = [product_id];

    const { rows }: { rows: Product[] } = await pool.query(query, values);

    client.release();
    return rows;
  } catch (err) {
    console.log('Error executing query', err);
    return [];
  }
};

//Read Product Styles
export const readProductStyles = async (product_id: number) => {
  try {
    const client = await pool.connect();
    const query = `SELECT row_to_json(t)
      FROM (
        SELECT products.id,
          ( 
          SELECT array_to_json(array_agg(results_col))
            FROM (
              SELECT styles.id, styles.name, styles.original_price, styles.sale_price, styles.default_style,
              (
                SELECT array_to_json(array_agg(row_to_json(photo_cols)))
                FROM (
                  SELECT thumbnail_url, url 
                  FROM photos
                  WHERE photos.style_id = styles.id
                ) photo_cols
              ) AS photos,
              (
                SELECT jsonb_object_agg(size, quantity)
                FROM skus
                WHERE skus.style_id = styles.product_id
              ) AS skus
            FROM styles
            WHERE styles.product_id = products.id
          ) results_col
        ) AS results
        FROM products
        WHERE products.id = $1
      ) t;`;

    const values = [product_id];

    const { rows } = await pool.query(query, values);

    client.release();
    return rows;
  } catch (err) {
    console.log('Error executing query', err);
  }
};

//Read Related Products
export const readRelatedProoducts = async () => {
  try {
  } catch (err) {
    console.log('Error executing query', err);
  }
};

//Create Product
export const createNewProduct = async () => {
  try {
  } catch (err) {
    console.log('Error executing query', err);
  }
};

//Update Product
export const updateProductById = async () => {
  try {
  } catch (err) {
    console.log('Error executing query', err);
  }
};

//DELETE Product
export const deleteProductById = async () => {
  try {
  } catch (err) {
    console.log('Error executing query', err);
  }
};
