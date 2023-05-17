import db from '../../database';

import { Product, ArrayToJsonObject, NewProduct } from './definitions';

//Read All Products TODO: OPTIMIZE
export const readProductsList = async (
  page: number,
  count: number
): Promise<Product[]> => {
  const client = await db.connect();

  try {
    const query = {
      text: 'SELECT * FROM products ORDER BY id asc LIMIT $1 OFFSET $2;',
      values: [count, page * count - count],
    };

    const { rows }: { rows: Product[] } = await client.query(query);

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
  const client = await db.connect();

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
            WHERE features.product_id = products.product_id) feature_cols
      ) 
      AS features 
      FROM products 
      WHERE products.product_id = $1;`,
      values: [product_id],
    };

    const { rows }: { rows: Product[] } = await db.query(query);

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
  const client = await db.connect();

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
            WHERE styles.product_id = products.product_id
          ) results_col
        ) AS results
        FROM products
        WHERE products.product_id = $1
      ) t;`,
      values: [product_id],
    };

    const { rows } = await db.query(query);

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
  product_id: number
): Promise<ArrayToJsonObject[]> => {
  const client = await db.connect();

  try {
    const query = {
      text: `SELECT ARRAY_TO_JSON(ARRAY_AGG(related_product_id)) FROM related WHERE product_id=$1`,
      values: [product_id],
    };

    const { rows }: { rows: ArrayToJsonObject[] } = await client.query(query);

    return rows;
  } catch (err) {
    console.log('Error executing query', err);
    return [];
  } finally {
    client.release();
  }
};

//Create Product TODO: OPTIMIZE
export const createNewProduct = async (
  newProduct: NewProduct
): Promise<Product[]> => {
  const client = await db.connect();

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

    const { rows }: { rows: Product[] } = await client.query(productQuery);

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
  } catch (err) {
    console.log('Error executing query', err);
    return [];
  } finally {
    client.release();
  }
};

//Update Product
export const updateProductById = async (product_id: number) => {
  const client = await db.connect();

  try {
    //TODO:
    // const query = {
    //   text: 'UPDATE product SET',
    //   values: [product_id],
    // };
    // const { rows }: { rows: Product[] } = await client.query(query);
    // return rows;
  } catch (err) {
    console.log('Error executing query', err);
    return [];
  } finally {
    client.release();
  }
};

//DELETE Product TODO: OPTIMIZE
export const deleteProductById = async (
  product_id: number
): Promise<Product[]> => {
  const client = await db.connect();

  try {
    const query = {
      text: 'DELETE FROM products WHERE product_id=$1 RETURNING *',
      values: [product_id],
    };

    const { rows }: { rows: Product[] } = await client.query(query);

    return rows;
  } catch (err) {
    console.log('Error executing query', err);
    return [];
  } finally {
    client.release();
  }
};
