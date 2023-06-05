import { db, redisClient } from '../../database';

import {
  Product,
  NewProduct,
  ArrayToJsonObject,
  pgQueries,
  redisQueries,
  JsonBuildObjectStyles,
  JsonBuildObjectProduct,
} from './definitions';

/* Read All Products */
export const readProductsList = async (
  page: number,
  count: number
): Promise<Product[]> => {
  const client = await db.connect();

  try {
    const offset = page * count - count;
    const query = {
      text: pgQueries.queryProductsList,
      values: [offset, count],
    };

    const redisKey: string = redisQueries.queryProductsList(offset, count);

    const cacheValue = await redisClient.get(redisKey);

    if (cacheValue) {
      const cachedResults: Product[] = JSON.parse(cacheValue);

      return cachedResults;
    } else {
      const { rows }: { rows: Product[] } = await client.query(query);

      await redisClient.set(redisKey, JSON.stringify(rows));

      return rows;
    }
  } catch (err) {
    console.log('Error executing query: readProductsList', err);
    return [];
  } finally {
    client.release();
  }
};

/* Read One Product */
export const readProductById = async (
  product_id: number
): Promise<JsonBuildObjectProduct[]> => {
  const client = await db.connect();

  try {
    const query = {
      text: pgQueries.queryProductById,
      values: [product_id],
    };

    const redisKey: string = redisQueries.queryProductById(product_id);

    const cacheValue = await redisClient.get(redisKey);

    if (cacheValue) {
      const cachedResults: JsonBuildObjectProduct[] = JSON.parse(cacheValue);

      return cachedResults;
    } else {
      const { rows }: { rows: JsonBuildObjectProduct[] } = await db.query(
        query
      );

      await redisClient.set(redisKey, JSON.stringify(rows));

      return rows;
    }
  } catch (err) {
    console.log('Error executing query: readProductById', err);
    return [];
  } finally {
    client.release();
  }
};

/* Read Product Styles */
export const readProductStyles = async (
  product_id: number
): Promise<JsonBuildObjectStyles[]> => {
  const client = await db.connect();

  try {
    const query = {
      text: pgQueries.queryProductStyles,
      values: [product_id],
    };

    const redisKey: string = redisQueries.queryProductStyles(product_id);

    const cachedValue = await redisClient.get(redisKey);

    if (cachedValue) {
      const cachedResults: JsonBuildObjectStyles[] = JSON.parse(cachedValue);

      return cachedResults;
    } else {
      const { rows }: { rows: JsonBuildObjectStyles[] } = await db.query(query);

      await redisClient.set(redisKey, JSON.stringify(rows));

      return rows;
    }
  } catch (err) {
    console.log('Error executing query: readProductStyles', err);
    return [];
  } finally {
    client.release();
  }
};

/* Read Related Products */
export const readRelatedProoductIds = async (
  product_id: number
): Promise<ArrayToJsonObject[]> => {
  const client = await db.connect();

  try {
    const query = {
      text: pgQueries.queryRelatedProductIds,
      values: [product_id],
    };

    const redisKey = redisQueries.queryRelatedProductIds(product_id);

    const cachedValue = await redisClient.get(redisKey);

    if (cachedValue) {
      const cachedResults: ArrayToJsonObject[] = JSON.parse(cachedValue);

      return cachedResults;
    } else {
      const { rows }: { rows: ArrayToJsonObject[] } = await client.query(query);

      await redisClient.set(redisKey, JSON.stringify(rows));

      return rows;
    }
  } catch (err) {
    console.log('Error executing query: readRelatedProoductIds', err);
    return [];
  } finally {
    client.release();
  }
};

/* Create Product */
export const createNewProduct = async (
  newProduct: NewProduct
): Promise<Product[]> => {
  const client = await db.connect();

  try {
    const productQuery = {
      text: pgQueries.queryCreateProduct,
      values: [
        newProduct.name,
        newProduct.slogan,
        newProduct.description,
        newProduct.category,
        newProduct.default_price,
      ],
    };

    const { rows }: { rows: Product[] } = await client.query(productQuery);

    return rows;
  } catch (err) {
    throw new Error('Error executing query: createNewProduct');
  } finally {
    client.release();
  }
};

/* Update Product */
export const updateProductById = async (
  productToBeUpdated: Product
): Promise<Product[]> => {
  const client = await db.connect();

  try {
    const productQuery = {
      text: pgQueries.queryUpdatedProduct,
      values: [
        productToBeUpdated.name,
        productToBeUpdated.slogan,
        productToBeUpdated.description,
        productToBeUpdated.category,
        productToBeUpdated.default_price,
        productToBeUpdated.product_id,
      ],
    };

    const redisKey = redisQueries.queryProductById(
      productToBeUpdated.product_id
    );

    const { rows }: { rows: Product[] } = await client.query(productQuery);

    await redisClient.del(redisKey);

    return rows;
  } catch (err) {
    throw new Error('Error executing query: updateProductById');
  } finally {
    client.release();
  }
};

/* DELETE Product */
export const deleteProductById = async (
  product_id: number
): Promise<Product[]> => {
  const client = await db.connect();

  try {
    const query = {
      text: pgQueries.queryDeleteProduct,
      values: [product_id],
    };

    const redisKey = redisQueries.queryProductById(product_id);

    const { rows }: { rows: Product[] } = await client.query(query);

    await redisClient.del(redisKey);

    return rows;
  } catch (err: any) {
    throw new Error('Error executing query: updateProductById');
  } finally {
    client.release();
  }
};
