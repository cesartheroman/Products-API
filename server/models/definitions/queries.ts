export const pgQueries = {
  queryProductsList:
    'SELECT * FROM products WHERE product_id > $1 ORDER BY product_id LIMIT $2',
  queryProductById: `SELECT *, 
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
  queryProductStyles: `SELECT row_to_json(t)
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
  queryRelatedProductIds: `SELECT ARRAY_TO_JSON(ARRAY_AGG(related_product_id)) FROM related WHERE product_id=$1`,
  queryCreateProduct: `INSERT INTO products (name, slogan, description, category, default_price) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
  queryFeatures:
    'INSERT INTO features (product_id, feature, value) VALUES ($1, $2, $3) RETURNING *',
  queryUpdatedProduct:
    'UPDATE products SET (name, slogan, description, category, default_price) = ($1, $2, $3, $4, $5) WHERE product_id=$6 RETURNING *',
  queryDeleteProduct: 'DELETE FROM products WHERE product_id=$1 RETURNING *',
};

export const redisQueries = {
  queryProductsList: (product_id: number, limit: number) =>
    `SELECT * FROM products WHERE product_id > ${product_id} ORDER BY product_id LIMIT ${limit}`,
  queryProductById: (product_id: number) => `SELECT *, 
      (
        SELECT array_to_json(array_agg(feature_cols)
      ) 
      FROM 
      (
        SELECT feature, value 
          FROM features 
            WHERE features.product_id = ${product_id}) feature_cols
      ) 
      AS features 
      FROM products 
      WHERE products.product_id = ${product_id}`,
  queryProductStyles: (product_id: number) => `SELECT row_to_json(t)
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
            WHERE styles.product_id = ${product_id}
          ) results_col
        ) AS results
        FROM products
        WHERE products.product_id = ${product_id}
      ) t;`,
  queryRelatedProductIds: (product_id: number) =>
    `SELECT ARRAY_TO_JSON(ARRAY_AGG(related_product_id)) FROM related WHERE product_id=${product_id}`,
};
