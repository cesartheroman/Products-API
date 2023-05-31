export const pgQueries = {
  queryProductsList:
    'SELECT * FROM products WHERE product_id > $1 ORDER BY product_id LIMIT $2',

  queryProductById: `SELECT json_build_object(
    'product_id', products.product_id, 
    'name', products.name,
    'slogan', products.slogan,
    'description', products.description,
    'category', products.category,
    'default_price', products.default_price,
    'features', (
      SELECT ARRAY(
        SELECT json_build_object(
          'feature', features.feature,
          'values', features.value
        )
        FROM features
        WHERE features.product_id = $1
      )
    )
  )
  FROM products
  WHERE products.product_id = $1;`,

  queryProductStyles: `SELECT json_build_object(
          'product_id', products.product_id, 
          'results', (
            SELECT ARRAY(
              SELECT json_build_object(
                'style_id', styles.styles_id, 
                'name', styles.name, 
                'original_price', styles.original_price, 
                'sale_price', styles.sale_price, 
                'default?', styles.default_style, 
                'photos', (
                    SELECT ARRAY(
                      SELECT json_build_object(
                        'thumbnail_url', photos.thumbnail_url, 
                        'url', photos.url
                      ) 
                      FROM photos 
                      WHERE photos.styles_id = styles.styles_id
                    )
                ),
                'skus', (
                  SELECT jsonb_object_agg(size,quantity)
                  FROM skus
                  WHERE skus.styles_id = styles.styles_id
                )
            )
            FROM styles 
            WHERE styles.product_id = $1
          )
        )
      )
      FROM products 
      WHERE products.product_id = $1;`,

  queryRelatedProductIds: `SELECT ARRAY_TO_JSON(ARRAY_AGG(related_product_id)) FROM related WHERE product_id=$1`,

  queryCreateProduct: `INSERT INTO products (name, slogan, description, category, default_price) VALUES ($1, $2, $3, $4, $5) RETURNING *`,

  queryFeatures:
    'INSERT INTO features (product_id, feature, value) VALUES ($1, $2, $3) RETURNING *',

  queryUpdatedProduct:
    'UPDATE products SET (name, slogan, description, category, default_price) = ($1, $2, $3, $4, $5) WHERE product_id = $6 RETURNING *',

  queryDeleteProduct: 'DELETE FROM products WHERE product_id = $1 RETURNING *',
};

export const redisQueries = {
  queryProductsList: (product_id: number, limit: number) =>
    `SELECT * FROM products WHERE product_id > ${product_id} ORDER BY product_id LIMIT ${limit}`,

  queryProductById: (product_id: number) => `SELECT json_build_object(
    'product_id', products.product_id, 
    'name', products.name,
    'slogan', products.slogan,
    'description', products.description,
    'category', products.category,
    'default_price', products.default_price,
    'features', (
      SELECT ARRAY(
        SELECT json_build_object(
          'feature', features.feature,
          'values', features.value
        )
        FROM features
        WHERE features.product_id = ${product_id}
      )
    )
  )
  FROM products
  WHERE products.product_id = ${product_id};`,

  queryProductStyles: (product_id: number) => `SELECT json_build_object(
          'product_id', products.product_id, 
          'results', (
            SELECT ARRAY(
              SELECT json_build_object(
                'style_id', styles.styles_id, 
                'name', styles.name, 
                'original_price', styles.original_price, 
                'sale_price', styles.sale_price, 
                'default?', styles.default_style, 
                'photos', (
                    SELECT ARRAY(
                      SELECT json_build_object(
                        'thumbnail_url', photos.thumbnail_url, 
                        'url', photos.url
                      ) 
                      FROM photos 
                      WHERE photos.styles_id = styles.styles_id
                    )
                ),
                'skus', (
                  SELECT jsonb_object_agg(size,quantity)
                  FROM skus
                  WHERE skus.styles_id = styles.styles_id
                )
            )
            FROM styles 
            WHERE styles.product_id = ${product_id}
          )
        )
      )
      FROM products 
      WHERE products.product_id = ${product_id}`,

  queryRelatedProductIds: (product_id: number) =>
    `SELECT ARRAY_TO_JSON(ARRAY_AGG(related_product_id)) FROM related WHERE product_id=${product_id}`,
};
