import pool from '../../database';

import { Product, ArrayToJsonObject, NewProduct } from './definitions';

//Read All Products TODO: OPTIMIZE
export const readProductsList = async (
  page: number,
  count: number
): Promise<Product[]> => {
  const client = await pool.connect();

  try {
    const query = 'SELECT * FROM products ORDER BY id asc LIMIT $1 OFFSET $2;';
    const values = [count, page * count - count];

    const { rows }: { rows: Product[] } = await client.query(query, values);

    return rows;
  } catch (err) {
    console.log('Error executing query', err);
    return [];
  } finally {
    client.release();
  }
};

//Read One Product TODO: OPTIMIZE
export const readProductById = async (
  product_id: number
): Promise<Product[]> => {
  const client = await pool.connect();

  try {
    const query =
      'SELECT *, (SELECT array_to_json(array_agg(feature_cols)) FROM (SELECT feature, value FROM features WHERE features.product_id = products.id)  feature_cols) AS features FROM products WHERE products.id = $1;';
    const values = [product_id];

    const { rows }: { rows: Product[] } = await pool.query(query, values);

    return rows;
  } catch (err) {
    console.log('Error executing query', err);
    return [];
  } finally {
    client.release();
  }
};

//Read Product Styles TODO: OPTIMIZE
export const readProductStyles = async (product_id: number) => {
  const client = await pool.connect();

  try {
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

    return rows;
  } catch (err) {
    console.log('Error executing query', err);
    return [];
  } finally {
    client.release();
  }
};

//Read Related Products TODO: OPTIMIZE
export const readRelatedProoductIds = async (
  current_product_id: number
): Promise<ArrayToJsonObject[]> => {
  const client = await pool.connect();

  try {
    const query = `SELECT ARRAY_TO_JSON(ARRAY_AGG(related_product_id)) FROM related WHERE current_product_id=$1`;
    const values = [current_product_id];

    const { rows }: { rows: ArrayToJsonObject[] } = await client.query(
      query,
      values
    );

    return rows;
  } catch (err) {
    console.log('Error executing query', err);
    return [];
  } finally {
    client.release();
  }
};

//Create Product
export const createNewProduct = async (newProduct: NewProduct) => {
  const client = await pool.connect();

  try {
    const productQuery = {
      text: 'INSERT INTO testprods (name, slogan, description, category, default_price) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [
        newProduct.name,
        newProduct.slogan,
        newProduct.description,
        newProduct.category,
        newProduct.default_price,
      ],
    };

    const { rows: productRows }: { rows: Product[] } = await client.query(
      productQuery
    );

    return productRows;
  } catch (err) {
    console.log('Error executing query', err);
    return [];
  } finally {
    client.release();
  }
};

//Update Product
export const updateProductById = async () => {
  const client = await pool.connect();

  try {
  } catch (err) {
    console.log('Error executing query', err);
    return [];
  } finally {
    client.release();
  }
};

//DELETE Product
export const deleteProductById = async () => {
  const client = await pool.connect();

  try {
  } catch (err) {
    console.log('Error executing query', err);
    return [];
  } finally {
    client.release();
  }
};
